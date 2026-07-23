from pydantic import BaseModel
from typing import List, Optional


# -------------------------
# CAREGIVER (AUTH) SCHEMAS
# -------------------------

class CaregiverCreate(BaseModel):
    email: str
    full_name: str
    password: str

class CaregiverResponse(BaseModel):
    id: int
    email: str
    full_name: str
    email_verified: bool = False

    class Config:
        from_attributes = True

class LoginInput(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    caregiver: CaregiverResponse

class RegisterResponse(BaseModel):
    message: str
    email: str


# -------------------------
# USER SCHEMAS
# -------------------------

class UserCreate(BaseModel):
    name: str
    age: Optional[int] = None
    disorder: str
    communication_style: Optional[str] = None
    sensory_profile: Optional[str] = None
    known_triggers: Optional[str] = None
    escalation_signs: Optional[str] = None
    calming_tools: Optional[str] = None
    favorite_items: Optional[str] = None
    do_not_do: Optional[str] = None
    trusted_people: Optional[str] = None
    behavior_meanings: Optional[str] = None
    daily_routine: Optional[str] = None
    medical_notes: Optional[str] = None
    recent_context: Optional[str] = None


# UserUpdate allows partial edits — only send the fields you want to change
class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    disorder: Optional[str] = None
    communication_style: Optional[str] = None
    sensory_profile: Optional[str] = None
    known_triggers: Optional[str] = None
    escalation_signs: Optional[str] = None
    calming_tools: Optional[str] = None
    favorite_items: Optional[str] = None
    do_not_do: Optional[str] = None
    trusted_people: Optional[str] = None
    behavior_meanings: Optional[str] = None
    daily_routine: Optional[str] = None
    medical_notes: Optional[str] = None
    recent_context: Optional[str] = None
    learned_patterns: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    age: Optional[int]
    disorder: str
    communication_style: Optional[str]
    sensory_profile: Optional[str]
    known_triggers: Optional[str]
    escalation_signs: Optional[str]
    calming_tools: Optional[str]
    favorite_items: Optional[str]
    do_not_do: Optional[str]
    trusted_people: Optional[str]
    behavior_meanings: Optional[str]
    daily_routine: Optional[str]
    medical_notes: Optional[str]
    recent_context: Optional[str]
    learned_patterns: Optional[str] = None

    class Config:
        from_attributes = True


# -------------------------
# SITUATION / SESSION SCHEMAS
# -------------------------

class SituationInput(BaseModel):
    user_id: int
    situation: str                               # free text — any situation
    trigger: Optional[str] = None
    severity: Optional[str] = None
    additional_context: Optional[str] = None    # any extra info the caregiver wants to add
    current_location: Optional[str] = None      # where they are right now — critical for context
    available_items: Optional[str] = None       # what comfort items are physically present

class SituationResponse(BaseModel):
    session_id: int
    priority: str
    immediate_actions: List[str]
    precautions: Optional[List[str]] = []
    caregiver_note: Optional[str] = None
    disclaimer: str


# -------------------------
# FEEDBACK SCHEMAS
# -------------------------

class StrategyRating(BaseModel):
    strategy: str
    rating: float                                # 1.0 to 5.0

class FeedbackInput(BaseModel):
    session_id: int
    overall_helpful: int                         # 1 = helpful, 0 = not helpful
    strategy_ratings: Optional[List[StrategyRating]] = []

class FeedbackResponse(BaseModel):
    message: str
    session_id: int
