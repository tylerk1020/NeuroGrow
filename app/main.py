from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from app import models
from app.database import engine, get_db, SessionLocal
from app.schemas import (
    UserCreate, UserUpdate, UserResponse,
    SituationInput, SituationResponse,
    FeedbackInput, FeedbackResponse,
    CaregiverCreate, CaregiverResponse, LoginInput, TokenResponse
)
from app.llm import get_llm_response, synthesize_learned_patterns


# -------------------------
# PATTERN PRE-COMPUTATION
# Runs in Python before the LLM call so the model receives sharp facts,
# not raw history it has to interpret itself. This is where the learning
# loop actually becomes reliable — we do the data work, the model does
# the reasoning.
# -------------------------
def pre_compute_patterns(feedback_history: list, user: models.User) -> dict:
    if not feedback_history:
        return {}

    trigger_counts = {}
    strategy_ratings = {}   # strategy text -> list of float ratings
    high_severity_count = 0

    for session in feedback_history:
        # Count trigger occurrences
        if session.get("trigger"):
            t = session["trigger"].lower().strip()
            trigger_counts[t] = trigger_counts.get(t, 0) + 1

        # Count high-severity sessions
        if session.get("severity", "").lower() == "high":
            high_severity_count += 1

        # Aggregate ratings per strategy
        for rating in session.get("strategy_ratings", []):
            s = rating["strategy"]
            r = float(rating["rating"])
            if s not in strategy_ratings:
                strategy_ratings[s] = []
            strategy_ratings[s].append(r)

    # Recurring triggers: seen in 2+ sessions
    recurring_triggers = [t for t, count in trigger_counts.items() if count >= 2]

    # Confirmed working: avg rating >= 4.0 AND rated in 2+ sessions
    confirmed_working = [
        s for s, ratings in strategy_ratings.items()
        if len(ratings) >= 2 and (sum(ratings) / len(ratings)) >= 4.0
    ]

    # Confirmed not working: avg rating <= 2.0 AND rated in 2+ sessions
    confirmed_not_working = [
        s for s, ratings in strategy_ratings.items()
        if len(ratings) >= 2 and (sum(ratings) / len(ratings)) <= 2.0
    ]

    # Hunger flag: hunger is a known trigger for this person AND
    # appears as a recurring pattern in sessions
    hunger_keywords = {"hunger", "food", "meal", "snack", "eat", "eating"}
    hunger_in_history = any(
        any(kw in t for kw in hunger_keywords)
        for t in recurring_triggers
    )
    hunger_in_profile = bool(
        user.known_triggers and
        any(kw in user.known_triggers.lower() for kw in hunger_keywords)
    )
    # Flag it if hunger is in profile triggers AND either appears in history
    # or there are recent high-severity sessions (elevated baseline makes hunger more risky)
    hunger_flag = hunger_in_profile and (hunger_in_history or high_severity_count >= 1)

    return {
        "recurring_triggers": recurring_triggers,
        "confirmed_working": confirmed_working,
        "confirmed_not_working": confirmed_not_working,
        "high_severity_count": high_severity_count,
        "baseline_elevated": high_severity_count >= 2,
        "hunger_flag": hunger_flag,
    }
from app.auth import (
    verify_password, hash_password, create_access_token,
    get_current_caregiver, require_caregiver
)

# Create all database tables automatically on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="NeuroGrow API", version="2.0")

# CORS origins — in production set ALLOWED_ORIGINS in your environment variables
# e.g. ALLOWED_ORIGINS=https://neurogrow.onrender.com
import os as _os
_raw_origins = _os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# -------------------------
# ROOT TEST
# -------------------------
@app.get("/")
def read_root():
    return {"message": "NeuroGrow API v2.0 — AI-powered caregiver support"}


# =====================================
# AUTH ENDPOINTS
# =====================================

@app.post("/auth/register", response_model=TokenResponse)
def register(data: CaregiverCreate, db: Session = Depends(get_db)):
    """Create a new caregiver account. Returns a JWT token immediately."""
    existing = db.query(models.Caregiver).filter(
        models.Caregiver.email == data.email.lower()
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )
    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters."
        )

    caregiver = models.Caregiver(
        email=data.email.lower().strip(),
        full_name=data.full_name.strip(),
        hashed_password=hash_password(data.password)
    )
    db.add(caregiver)
    db.commit()
    db.refresh(caregiver)

    token = create_access_token(caregiver.email)
    return {"access_token": token, "token_type": "bearer", "caregiver": caregiver}


@app.post("/auth/login", response_model=TokenResponse)
def login(data: LoginInput, db: Session = Depends(get_db)):
    """Log in with email and password. Returns a JWT token."""
    caregiver = db.query(models.Caregiver).filter(
        models.Caregiver.email == data.email.lower().strip()
    ).first()

    if not caregiver or not verify_password(data.password, caregiver.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token(caregiver.email)
    return {"access_token": token, "token_type": "bearer", "caregiver": caregiver}


@app.get("/auth/me", response_model=CaregiverResponse)
def get_me(caregiver: models.Caregiver = Depends(require_caregiver)):
    """Returns the currently logged-in caregiver's info. Use to verify the token."""
    return caregiver


# =====================================
# USER / PROFILE ENDPOINTS
# =====================================

@app.post("/users", response_model=UserResponse)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    caregiver: Optional[models.Caregiver] = Depends(get_current_caregiver)
):
    """
    Create a new individual profile.
    Linked to the caregiver's account if they are logged in.
    Still works without auth for backward compatibility.
    """
    new_user = models.User(
        caregiver_id=caregiver.id if caregiver else None,
        name=user_data.name,
        age=user_data.age,
        disorder=user_data.disorder,
        communication_style=user_data.communication_style,
        sensory_profile=user_data.sensory_profile,
        known_triggers=user_data.known_triggers,
        escalation_signs=user_data.escalation_signs,
        calming_tools=user_data.calming_tools,
        favorite_items=user_data.favorite_items,
        do_not_do=user_data.do_not_do,
        trusted_people=user_data.trusted_people,
        behavior_meanings=user_data.behavior_meanings,
        daily_routine=user_data.daily_routine,
        medical_notes=user_data.medical_notes,
        recent_context=user_data.recent_context,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    """
    Update any fields of an existing profile. Only sends what changed —
    great for things like updating recent_context without re-typing everything.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Only update fields that were actually sent in the request
    update_data = user_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users-list")
def get_all_users(
    db: Session = Depends(get_db),
    caregiver: Optional[models.Caregiver] = Depends(get_current_caregiver)
):
    """
    Returns profiles. If logged in, returns ONLY this caregiver's profiles.
    If not logged in (no token), returns all profiles (legacy behavior).
    """
    query = db.query(models.User)
    if caregiver:
        query = query.filter(models.User.caregiver_id == caregiver.id)

    users = query.all()
    return {"users": [
        {
            "id": u.id,
            "name": u.name,
            "age": u.age,
            "disorder": u.disorder,
            "communication_style": u.communication_style,
            "sensory_profile": u.sensory_profile,
            "known_triggers": u.known_triggers,
            "escalation_signs": u.escalation_signs,
            "calming_tools": u.calming_tools,
            "favorite_items": u.favorite_items,
            "do_not_do": u.do_not_do,
            "trusted_people": u.trusted_people,
            "behavior_meanings": u.behavior_meanings,
            "daily_routine": u.daily_routine,
            "medical_notes": u.medical_notes,
            "recent_context": u.recent_context,
        } for u in users
    ]}


# =====================================
# MAIN DECISION ENGINE — LLM POWERED
# =====================================

@app.post("/get-response", response_model=SituationResponse)
def get_response(data: SituationInput, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found. Create a user profile first."
        )

    # Pull feedback history — most recent 20 sessions only
    past_sessions = db.query(models.Session).filter(
        models.Session.user_id == data.user_id
    ).order_by(models.Session.created_at.desc()).limit(20).all()

    feedback_history = []
    for session in past_sessions:
        session_entry = {
            "situation": session.situation,
            "trigger": session.trigger,
            "severity": session.severity,
            "created_at": session.created_at.isoformat() if session.created_at else None,
            "strategy_ratings": []
        }
        for feedback in session.feedbacks:
            if feedback.strategy and feedback.strategy_rating is not None:
                session_entry["strategy_ratings"].append({
                    "strategy": feedback.strategy,
                    "rating": feedback.strategy_rating
                })
        feedback_history.append(session_entry)

    # Pre-compute pattern facts in Python before calling the LLM
    pre_computed = pre_compute_patterns(feedback_history, user)

    # Call LLM with full user object + situation + pre-computed patterns
    llm_result = get_llm_response(
        user=user,
        situation=data.situation,
        trigger=data.trigger,
        severity=data.severity,
        additional_context=data.additional_context,
        current_location=data.current_location,
        available_items=data.available_items,
        feedback_history=feedback_history,
        pre_computed=pre_computed
    )

    # Save session to database
    new_session = models.Session(
        user_id=data.user_id,
        situation=data.situation,
        trigger=data.trigger,
        severity=data.severity,
        actions_given=llm_result.get("immediate_actions", [])
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return {
        "session_id": new_session.id,
        "priority": llm_result.get("priority", "medium"),
        "immediate_actions": llm_result.get("immediate_actions", []),
        "precautions": llm_result.get("precautions", []),
        "caregiver_note": llm_result.get("caregiver_note"),
        "disclaimer": llm_result.get(
            "disclaimer",
            "These are caregiver support suggestions only. Always consult your medical team."
        )
    }


# =====================================
# FEEDBACK ENDPOINT
# =====================================

def run_synthesis_background(user_id: int):
    """
    Background task: after feedback is saved, re-synthesize learned_patterns
    for this individual and write it back to the DB.
    Runs in a separate thread so it doesn't slow down the feedback response.
    """
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            return

        past_sessions = db.query(models.Session).filter(
            models.Session.user_id == user_id
        ).order_by(models.Session.created_at.desc()).limit(20).all()

        all_sessions = []
        for s in past_sessions:
            entry = {
                "situation": s.situation,
                "trigger": s.trigger,
                "severity": s.severity,
                "strategy_ratings": []
            }
            for f in s.feedbacks:
                if f.strategy and f.strategy_rating is not None:
                    entry["strategy_ratings"].append({
                        "strategy": f.strategy,
                        "rating": f.strategy_rating
                    })
            all_sessions.append(entry)

        # Only synthesize if we have at least one session with feedback
        has_feedback = any(len(s["strategy_ratings"]) > 0 for s in all_sessions)
        if not has_feedback:
            return

        insights = synthesize_learned_patterns(user, all_sessions)
        if insights:
            user.learned_patterns = insights
            db.commit()
            print(f"✅ Synthesis complete for {user.name}: {len(insights)} chars written to learned_patterns")
    except Exception as e:
        print(f"SYNTHESIS BACKGROUND ERROR: {e}")
    finally:
        db.close()


@app.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(data: FeedbackInput, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):

    session = db.query(models.Session).filter(
        models.Session.id == data.session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    overall_feedback = models.Feedback(
        session_id=data.session_id,
        overall_helpful=data.overall_helpful
    )
    db.add(overall_feedback)

    for rating in data.strategy_ratings:
        strategy_feedback = models.Feedback(
            session_id=data.session_id,
            strategy=rating.strategy,
            strategy_rating=rating.rating
        )
        db.add(strategy_feedback)

    db.commit()

    # Kick off synthesis in the background — doesn't block the response
    background_tasks.add_task(run_synthesis_background, session.user_id)

    return {"message": "Feedback saved successfully. Thank you!", "session_id": data.session_id}


# =====================================
# HISTORY ENDPOINT
# =====================================

@app.get("/users/{user_id}/history")
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    sessions = db.query(models.Session).filter(
        models.Session.user_id == user_id
    ).order_by(models.Session.created_at.desc()).all()

    history = []
    for s in sessions:
        history.append({
            "session_id": s.id,
            "situation": s.situation,
            "trigger": s.trigger,
            "severity": s.severity,
            "actions_given": s.actions_given,
            "created_at": s.created_at,
            "feedback": [
                {
                    "overall_helpful": f.overall_helpful,
                    "strategy": f.strategy,
                    "strategy_rating": f.strategy_rating
                }
                for f in s.feedbacks
            ]
        })

    return {"user": user.name, "disorder": user.disorder, "sessions": history}
