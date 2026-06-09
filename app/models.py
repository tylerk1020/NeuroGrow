from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


# -------------------------
# CAREGIVER TABLE
# This is the login account — the person who uses the app.
# One caregiver can manage multiple user profiles (e.g., a parent with 2 kids,
# or a camp counselor managing an entire cabin).
# -------------------------
class Caregiver(Base):
    __tablename__ = "caregivers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="caregiver")


# -------------------------
# USER TABLE
# This is the INDIVIDUAL BEING CARED FOR — not the person logging in.
# Massively expanded profile to power hyper-personalized AI responses.
# -------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("caregivers.id"), nullable=True)

    # --- Basic Info ---
    name = Column(String, nullable=False)               # e.g. "Audrey"
    age = Column(Integer, nullable=True)                # e.g. 14
    disorder = Column(String, nullable=False)           # e.g. "Dup15q Syndrome"

    # --- Communication ---
    communication_style = Column(String, nullable=True) # e.g. "non-verbal, uses AAC device"

    # --- Sensory ---
    sensory_profile = Column(Text, nullable=True)       # NEW: hypersensitivities, seeks deep pressure, etc.

    # --- Triggers & Escalation ---
    known_triggers = Column(Text, nullable=True)        # what sets them off
    escalation_signs = Column(Text, nullable=True)      # NEW: early warning signs BEFORE a meltdown
    do_not_do = Column(Text, nullable=True)             # NEW: things that make it worse — critical!

    # --- Calming & Comfort (THE PERSONALIZATION GOLD MINE) ---
    calming_tools = Column(Text, nullable=True)         # general strategies that work
    favorite_items = Column(Text, nullable=True)        # NEW: specific comfort objects by name (e.g. "Toy Story cup")
    trusted_people = Column(Text, nullable=True)        # NEW: specific people they respond well to

    # --- Behavior Meanings ---
    behavior_meanings = Column(Text, nullable=True)     # NEW: "rocking = anxious", "hand flapping = excited"

    # --- Routine & Medical ---
    daily_routine = Column(Text, nullable=True)         # NEW: typical schedule
    medical_notes = Column(Text, nullable=True)         # NEW: medications, seizure history, physical limitations

    # --- Dynamic Notes (update these regularly!) ---
    recent_context = Column(Text, nullable=True)        # NEW: what's been happening lately — huge for accuracy

    # --- AI-Learned Insights (auto-updated after each feedback submission) ---
    # This is the memory system. After each session + feedback, an LLM synthesizes
    # what it has learned about this specific individual and writes it here.
    # This gets injected at the top of every future prompt.
    learned_patterns = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    caregiver = relationship("Caregiver", back_populates="users")
    sessions = relationship("Session", back_populates="user")


# -------------------------
# SESSION TABLE
# Each time a caregiver requests advice, that's a session
# -------------------------
class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    situation = Column(String, nullable=False)
    trigger = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    actions_given = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")
    feedbacks = relationship("Feedback", back_populates="session")


# -------------------------
# FEEDBACK TABLE
# Star ratings per strategy feed back into future AI prompts
# -------------------------
class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    overall_helpful = Column(Integer, nullable=True)    # 1 = helpful, 0 = not helpful
    strategy = Column(String, nullable=True)
    strategy_rating = Column(Float, nullable=True)      # 1.0 to 5.0
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("Session", back_populates="feedbacks")
