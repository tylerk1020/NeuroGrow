import os
import json
import re
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
from app import models

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=False)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# -------------------------
# SYNTHESIS FUNCTION
# Now outputs structured JSON instead of prose.
# Each field is a typed list or string the main prompt can inject cleanly
# as hard constraints rather than background reading the model can skim.
# -------------------------
def synthesize_learned_patterns(user: models.User, all_sessions: list) -> str:
    """
    Synthesizes all past sessions with feedback into a structured JSON object.
    Stored as a JSON string in user.learned_patterns.
    Returns empty string if no usable data or synthesis fails.
    """
    if not all_sessions:
        return ""

    session_lines = []
    for s in all_sessions:
        line = f"- [{s.get('severity', '?').upper()}] Situation: {s.get('situation', '')} | Trigger: {s.get('trigger', 'unknown')}"
        ratings = s.get("strategy_ratings", [])
        if ratings:
            worked = [r["strategy"] for r in ratings if r["rating"] >= 4]
            didnt = [r["strategy"] for r in ratings if r["rating"] <= 2]
            if worked:
                line += f"\n  Worked: {'; '.join(worked)}"
            if didnt:
                line += f"\n  Didn't work: {'; '.join(didnt)}"
        session_lines.append(line)

    history_text = "\n".join(session_lines)

    synthesis_prompt = f"""You are analyzing caregiver feedback for {user.name}, a {user.age or 'unknown age'} year old with {user.disorder}.

Here is their session history with strategy ratings:

{history_text}

Output a single JSON object with exactly these keys. Use {user.name}'s actual name and actual item/person names throughout — never be generic.

{{
  "confirmed_working": ["specific strategies confirmed effective across multiple sessions — e.g. 'offer Ellie the elephant', not 'comfort object'"],
  "confirmed_not_working": ["specific strategies that consistently got low ratings — be exact"],
  "recurring_triggers": ["triggers that appear in 2 or more sessions"],
  "context_rules": ["specific situational rules derived from patterns — e.g. 'address hunger before any calming strategy', 'never suggest items not physically present with {user.name}'"],
  "baseline_status": "one concise sentence on current baseline — is {user.name} more reactive than normal? Note any patterns worth flagging."
}}

Output ONLY the JSON object. No explanation, no markdown, no extra text."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": synthesis_prompt}],
            temperature=0.2,
            max_tokens=600,
        )
        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if model added them
        if "```" in raw:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)```", raw)
            if match:
                raw = match.group(1).strip()

        # Validate it's real JSON before storing
        parsed = json.loads(raw)
        return json.dumps(parsed)

    except Exception as e:
        print(f"SYNTHESIS ERROR: {e}")
        return ""


# -------------------------
# LEARNED PATTERNS PARSER
# Handles both the new JSON format and the old prose format gracefully.
# Returns a structured dict or None.
# -------------------------
def _parse_learned_patterns(raw: str) -> dict | None:
    if not raw:
        return None
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
    except (json.JSONDecodeError, ValueError):
        pass
    # Old prose format — wrap it so the prompt can still use it
    return {"legacy_insights": raw}


# -------------------------
# MAIN LLM FUNCTION
# Takes the full user object, situation details, and pre-computed pattern
# facts from Python. The pre-computed dict means the model doesn't have
# to do data analysis — it just has to reason and act.
# -------------------------
def get_llm_response(
    user: models.User,
    situation: str,
    trigger: str,
    severity: str,
    additional_context: str,
    current_location: str,
    available_items: str,
    feedback_history: list,
    pre_computed: dict = None
) -> dict:

    # -------------------------
    # FIRST NAME ONLY
    # Use first name throughout responses — sounds personal, not clinical.
    # -------------------------
    first_name = user.name.split()[0]

    # -------------------------
    # TRUSTED PEOPLE PRESENT CHECK
    # Scan all input fields for names that match trusted people in the profile.
    # If found, surface them as an explicit flag so the model doesn't miss them.
    # -------------------------
    present_trusted = []
    if user.trusted_people:
        all_inputs = " ".join(filter(None, [situation, trigger, additional_context, current_location, available_items]))
        for person in user.trusted_people.split(","):
            person = person.strip()
            # Extract just the first name or short name from entries like "Tyler — older sibling"
            short_name = person.split("—")[0].split("(")[0].strip()
            if short_name and short_name.lower() in all_inputs.lower():
                present_trusted.append(person.strip())

    # -------------------------
    # ITEMS GATE
    # Hard constraint enforced structurally, not just as a rule in text.
    # -------------------------
    if available_items and available_items.strip():
        items_gate = (
            f"CONFIRMED AVAILABLE RIGHT NOW: {available_items}\n"
            f"GATE: These are the ONLY items that exist for this response. "
            f"Do NOT suggest anything not on this list. If an item is in the profile but not here, it is not present."
        )
    else:
        items_gate = (
            "ITEMS STATUS: None confirmed present.\n"
            "GATE: Use ONLY body-based strategies — calm presence, slow voice, "
            "firm hand squeeze only if they initiate, physical proximity. "
            "Do NOT suggest any specific objects or comfort items."
        )

    # -------------------------
    # PRE-COMPUTED PATTERN ALERTS
    # Sharp facts computed in Python — no LLM interpretation needed.
    # -------------------------
    pattern_lines = []
    if pre_computed:
        if pre_computed.get("recurring_triggers"):
            pattern_lines.append(
                f"🔁 RECURRING TRIGGERS: {', '.join(pre_computed['recurring_triggers'])} "
                f"— confirmed pattern across multiple sessions, factor in what has worked before"
            )
        if pre_computed.get("confirmed_working"):
            pattern_lines.append(
                f"✅ CONFIRMED WORKING (avg rating ≥4 across sessions): "
                f"{'; '.join(pre_computed['confirmed_working'][:6])} — prioritize these"
            )
        if pre_computed.get("confirmed_not_working"):
            pattern_lines.append(
                f"❌ CONFIRMED NOT WORKING (avg rating ≤2 across sessions): "
                f"{'; '.join(pre_computed['confirmed_not_working'][:6])} — DO NOT suggest these"
            )
        if pre_computed.get("baseline_elevated"):
            count = pre_computed.get("high_severity_count", 0)
            pattern_lines.append(
                f"⚠️ ELEVATED BASELINE: {first_name} has had {count} high-severity sessions recently — "
                f"she is more reactive than normal, adjust urgency accordingly"
            )
        if pre_computed.get("hunger_flag"):
            pattern_lines.append(
                f"🍽️ HUNGER FLAG: Hunger is a confirmed recurring trigger for {first_name}. "
                f"If she has not eaten recently, obtaining food is Step 1 — before any calming strategy. "
                f"If they are not at home, stop somewhere NOW to get food. Do NOT tell the caregiver to wait until they get home."
            )

    if present_trusted:
        pattern_lines.append(
            f"👤 TRUSTED PERSON PRESENT: {', '.join(present_trusted)} is physically there right now. "
            f"Involve them by name in the response — they can help directly."
        )

    pattern_section = ""
    if pattern_lines:
        pattern_section = (
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            "PATTERN ALERTS (pre-computed from session history — treat as facts)\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            + "\n".join(pattern_lines)
            + "\n\n"
        )

    # -------------------------
    # LEARNED INSIGHTS
    # Structured JSON from synthesis — injected as labeled hard constraints.
    # Falls back gracefully for old prose format.
    # -------------------------
    learned_section = ""
    parsed_learned = _parse_learned_patterns(user.learned_patterns)
    if parsed_learned:
        if "legacy_insights" in parsed_learned:
            learned_section = (
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"⭐ LEARNED INSIGHTS (from real feedback — hard constraints)\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"{parsed_learned['legacy_insights']}\n\n"
            )
        else:
            insight_lines = []
            if parsed_learned.get("confirmed_working"):
                insight_lines.append(f"✅ ALWAYS TRY FIRST: {'; '.join(parsed_learned['confirmed_working'])}")
            if parsed_learned.get("confirmed_not_working"):
                insight_lines.append(f"❌ NEVER SUGGEST: {'; '.join(parsed_learned['confirmed_not_working'])}")
            if parsed_learned.get("recurring_triggers"):
                insight_lines.append(f"🔁 KNOWN PATTERNS: {'; '.join(parsed_learned['recurring_triggers'])}")
            if parsed_learned.get("context_rules"):
                insight_lines.append(f"📋 RULES (follow exactly): {'; '.join(parsed_learned['context_rules'])}")
            if parsed_learned.get("baseline_status"):
                insight_lines.append(f"📊 BASELINE: {parsed_learned['baseline_status']}")
            if insight_lines:
                learned_section = (
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                    f"⭐ LEARNED INSIGHTS (from real caregiver feedback — HARD CONSTRAINTS not suggestions)\n"
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                    + "\n".join(insight_lines)
                    + "\n\n"
                )

    # -------------------------
    # RECENT SESSION CONTEXT
    # Last 3 situations only — gives temporal awareness without noise.
    # -------------------------
    recent_context_lines = []
    for s in feedback_history[:3]:
        if s.get("situation"):
            entry = f"- [{s.get('severity', '?').upper()}] {s['situation']}"
            if s.get("trigger"):
                entry += f" (trigger: {s['trigger']})"
            recent_context_lines.append(entry)

    recent_section = ""
    if recent_context_lines:
        recent_section = (
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            "RECENT SESSIONS (last 3, most recent first)\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            + "\n".join(recent_context_lines)
            + "\n\n"
        )

    # -------------------------
    # PROFILE SECTION
    # Only populated fields included — no empty clutter.
    # -------------------------
    profile_lines = [
        f"NAME: {first_name} (use first name only in all responses)",
        f"NEUROLOGICAL CONDITION: {user.disorder}",
    ]
    if user.age:
        profile_lines.append(f"AGE: {user.age}")
    if user.communication_style:
        profile_lines.append(f"HOW THEY COMMUNICATE: {user.communication_style}")
    if user.behavior_meanings:
        profile_lines.append(f"BEHAVIOR DECODER: {user.behavior_meanings}")
    if user.sensory_profile:
        profile_lines.append(f"SENSORY PROFILE: {user.sensory_profile}")
    if user.known_triggers:
        profile_lines.append(f"KNOWN TRIGGERS: {user.known_triggers}")
    if user.escalation_signs:
        profile_lines.append(f"EARLY WARNING SIGNS: {user.escalation_signs}")
    if user.calming_tools:
        profile_lines.append(f"CALMING STRATEGIES THAT WORK: {user.calming_tools}")
    if user.favorite_items:
        profile_lines.append(f"COMFORT ITEMS (use exact names): {user.favorite_items}")
    if user.trusted_people:
        profile_lines.append(f"TRUSTED PEOPLE (suggest by name): {user.trusted_people}")
    if user.do_not_do:
        profile_lines.append(f"⚠️ NEVER DO THIS: {user.do_not_do}")
    if user.daily_routine:
        profile_lines.append(f"DAILY ROUTINE: {user.daily_routine}")
    if user.medical_notes:
        profile_lines.append(f"MEDICAL NOTES: {user.medical_notes}")
    if user.recent_context:
        profile_lines.append(f"RECENT CONTEXT: {user.recent_context}")

    profile_section = "\n".join(profile_lines)

    # -------------------------
    # SITUATION SECTION
    # -------------------------
    situation_lines = [f"WHAT IS HAPPENING: {situation}"]
    if trigger:
        situation_lines.append(f"POSSIBLE TRIGGER: {trigger}")
    if severity:
        situation_lines.append(f"SEVERITY: {severity.upper()}")
    if current_location:
        situation_lines.append(f"CURRENT LOCATION: {current_location}")
    situation_lines.append(
        f"ITEMS AVAILABLE: {available_items if available_items and available_items.strip() else 'NONE CONFIRMED'}"
    )
    if additional_context:
        situation_lines.append(f"ADDITIONAL CONTEXT: {additional_context}")

    situation_section = "\n".join(situation_lines)

    # -------------------------
    # SYSTEM PROMPT
    # Mandatory 6-check pre-flight reasoning before any step is generated.
    # The checklist forces explicit answers — not free-form reflection.
    # -------------------------
    system_prompt = f"""You are NeuroGrow, a real-time AI support tool for caregivers of individuals with neurological disabilities.

A caregiver needs help RIGHT NOW. Your job is to give specific, actionable steps — not generic advice pulled from a profile.

RESPOND IN TWO PARTS:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — PRE-FLIGHT CHECKLIST (inside <reasoning> tags)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST work through all 6 checks explicitly before writing a single step. Answer each one directly.

CHECK 1 — MEDICAL/SAFETY FLAGS:
Read the medical notes carefully. Is there any active medical concern right now — seizure signs, medication side effects, physical injury risk? If yes, this overrides everything else and Step 1 must address it.

CHECK 2 — ENVIRONMENT:
Is the trigger still actively present in the environment right now? If yes, Step 1 MUST be removal from that environment — before any comfort strategy, before any item, before anything.

CHECK 3 — ITEMS GATE:
{items_gate}
Write your conclusion: "I can suggest: [list]" OR "No items confirmed — body-based strategies only."

CHECK 4 — DO-NOT-DO SCAN:
Write out the do-not-do list for {first_name}. Before locking in any step, verify it does not violate this list. Cut anything that does.

CHECK 5 — HISTORY & PATTERNS:
Is this a recurring trigger? What strategies have CONFIRMED worked for {first_name} in past sessions with high ratings? What has CONFIRMED not worked? Lead with what's proven. Do not suggest anything rated low previously.

CHECK 6 — SEVERITY CALIBRATION:
Is this a medical emergency, a full meltdown, early warning signs, or low-level dysregulation? State the level explicitly. Calibrate your response: low = 2-3 short steps, high = 4-5 tightly focused urgent steps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — JSON RESPONSE (after your reasoning)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Output a single valid JSON object. No markdown, no extra text before or after:
{{
  "priority": "high OR medium-high OR medium OR low",
  "immediate_actions": [
    "Step 1 — specific, uses {first_name}'s first name only and ONLY confirmed available items",
    "Step 2",
    "Step 3",
    "Step 4 (high severity only)",
    "Step 5 (high severity only)"
  ],
  "precautions": [
    "Specific thing to watch for given THIS situation — not a generic warning"
  ],
  "caregiver_note": "One sentence that references something SPECIFIC to this exact moment — the actual trigger, a specific item by name, or a specific person. Do NOT write generic encouragement like 'you are doing great'.",
  "disclaimer": "These are caregiver support suggestions only. Always consult your medical team for advice specific to your child's condition."
}}

HARD RULES — violating these makes the response actively harmful:
1. NEVER suggest any item not confirmed on the available list
2. NEVER suggest anything from the do-not-do list
3. NEVER use verbal reasoning, explanation, or "let her know" steps for someone who is nonverbal during active distress
4. If trigger is still present in environment, Step 1 is ALWAYS removal — no exceptions
5. Use {first_name}'s first name only throughout — never full name, never "your child", "them", or "a comfort object"
6. Match step count to severity — low severity gets a short, calm response not a crisis protocol
7. If a trusted person is flagged as present, involve them by name in the steps"""

    user_prompt = f"""🚨 CAREGIVER NEEDS REAL-TIME SUPPORT

{learned_section}{pattern_section}{recent_section}━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{first_name.upper()}'S PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{profile_section}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT SITUATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{situation_section}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOW RESPOND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Work through all 6 pre-flight checks in <reasoning> tags, then output the JSON."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=1500,
        )

        raw = response.choices[0].message.content.strip()

        # Strip the reasoning block — caregivers never see it
        if "<reasoning>" in raw:
            raw = re.sub(r"<reasoning>.*?</reasoning>", "", raw, flags=re.DOTALL).strip()

        # Strip markdown code fences if model wrapped the JSON
        if "```" in raw:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)```", raw)
            if match:
                raw = match.group(1).strip()

        return json.loads(raw)

    except Exception as e:
        print(f"LLM ERROR: {e}")
        calming = user.calming_tools or "any comfort item they respond to"
        return {
            "priority": "unknown",
            "immediate_actions": [
                f"Stay calm and close to {user.name} — your presence matters most right now",
                "Speak softly and slowly — short, simple words or no words at all",
                f"Try offering: {calming}",
                "Remove any environmental stressors if it is safe to do so",
                "Contact your medical team if the situation escalates or you are unsure"
            ],
            "precautions": [
                f"Monitor {user.name} closely and do not leave them alone",
                "If this is a medical emergency, call 911 immediately"
            ],
            "caregiver_note": (
                f"We are having trouble connecting right now. "
                f"You know {user.name} better than anyone — trust your instincts."
            ),
            "disclaimer": (
                "These are caregiver support suggestions only. "
                "Always consult your medical team for advice specific to your child's condition."
            ),
            "error": str(e)
        }
