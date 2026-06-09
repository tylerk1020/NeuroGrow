import React, { useState } from 'react';
import API from '../config';

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginTop: 28, marginBottom: 16 }}>
    <div className="profile-section-header">
      <div className="profile-section-dot" />
      <div className="profile-section-title">{title}</div>
    </div>
    {subtitle && <div className="profile-section-subtitle">{subtitle}</div>}
  </div>
);

const Field = ({ label, name, placeholder, as = 'input', hint, value, onChange, required }) => (
  <div className="form-group">
    <label className="form-label">
      {label}{required && <span style={{ color: '#c53030', marginLeft: 3 }}>*</span>}
    </label>
    {hint && <div className="field-hint">{hint}</div>}
    {as === 'textarea' ? (
      <textarea
        className="form-textarea"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ minHeight: 88, lineHeight: 1.6 }}
      />
    ) : (
      <input
        className="form-input"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

export default function CreateProfile({ navigate, setSelectedUser, editUser }) {
  const isEditing = !!editUser;
  const [showAll, setShowAll] = useState(isEditing);

  const [form, setForm] = useState({
    name: editUser?.name || '',
    age: editUser?.age || '',
    disorder: editUser?.disorder || '',
    communication_style: editUser?.communication_style || '',
    behavior_meanings: editUser?.behavior_meanings || '',
    sensory_profile: editUser?.sensory_profile || '',
    known_triggers: editUser?.known_triggers || '',
    escalation_signs: editUser?.escalation_signs || '',
    do_not_do: editUser?.do_not_do || '',
    calming_tools: editUser?.calming_tools || '',
    favorite_items: editUser?.favorite_items || '',
    trusted_people: editUser?.trusted_people || '',
    daily_routine: editUser?.daily_routine || '',
    medical_notes: editUser?.medical_notes || '',
    recent_context: editUser?.recent_context || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.disorder) { setError('Name and diagnosis are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('ng_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };
      const body = { ...form, age: form.age ? parseInt(form.age) : null };
      const url = isEditing ? `${API}/users/${editUser.id}` : `${API}/users`;
      const method = isEditing ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Request failed');
      setSelectedUser(data);
      navigate('dashboard');
    } catch (e) {
      setError(e.message || 'Failed to save profile. Make sure your backend is running.');
    }
    setLoading(false);
  };

  const field = (props) => (
    <Field key={props.name} value={form[props.name]} onChange={handleChange} {...props} />
  );

  const firstName = form.name?.split(' ')[0] || 'this person';

  return (
    <div>
      <div className="nav-back" onClick={() => navigate('dashboard')}>
        ← Back
      </div>

      <div className="card">
        <div className="card-title">
          {isEditing ? `Edit ${editUser.name}'s Profile` : 'Create a Profile'}
        </div>
        <div className="card-subtitle">
          {isEditing
            ? 'The more detail you add, the more specific and helpful the AI support will be.'
            : 'Start with just the basics. You can add more detail anytime — each field you fill in makes the AI meaningfully better.'
          }
        </div>

        {error && <div className="alert-box">{error}</div>}

        {/* Quick start banner — only on create */}
        {!isEditing && !showAll && (
          <div className="quick-start-banner">
            <div className="quick-start-title">Quick start</div>
            <div className="quick-start-text">
              Fill in name and diagnosis to get started. The fields below unlock more personalized responses — add them when you're ready.
            </div>
          </div>
        )}

        {/* Always-visible: Basic Info */}
        <SectionHeader title="Basic Information" />
        {field({ label: 'Full Name', name: 'name', placeholder: 'e.g. Maya Chen', required: true })}
        {field({ label: 'Age', name: 'age', placeholder: 'e.g. 9' })}
        {field({
          label: 'Neurological Diagnosis', name: 'disorder',
          placeholder: 'e.g. Dup15q Syndrome, Autism Spectrum Disorder, Rett Syndrome',
          required: true
        })}

        {/* Expand button — only show on create if not already expanded */}
        {!isEditing && !showAll && (
          <button
            className="btn btn-outline btn-full"
            style={{ marginTop: 8 }}
            onClick={() => setShowAll(true)}
          >
            Add more detail to improve accuracy
          </button>
        )}

        {/* Expanded fields */}
        {showAll && (
          <>
            <SectionHeader
              title="Communication"
              subtitle="How does this person express themselves? This helps the AI understand what behaviors mean."
            />
            {field({
              label: 'How They Communicate', name: 'communication_style',
              placeholder: 'e.g. primarily nonverbal, uses single words, has an AAC device, knows some signs'
            })}
            {field({
              label: 'What Their Behaviors Mean', name: 'behavior_meanings', as: 'textarea',
              placeholder: 'e.g.\nRocking side to side = content, do not interrupt\nHand flapping = excited or overstimulated\nPulling at shirt collar = anxious\nHitting own head = pain or extreme distress',
              hint: 'Helps the AI interpret what is actually happening during a situation — one of the most valuable fields.'
            })}

            <SectionHeader
              title="Sensory Profile"
              subtitle="Sensory sensitivities are a major factor in many neurological conditions."
            />
            {field({
              label: 'Sensory Sensitivities & Preferences', name: 'sensory_profile', as: 'textarea',
              placeholder: 'e.g.\nHypersensitive to: loud sudden noises, bright fluorescent lights\nLoves: deep pressure, weighted blanket, firm hugs from trusted people\nDislikes: being touched from behind without warning'
            })}

            <SectionHeader
              title="Triggers & Escalation"
              subtitle="What sets them off, and how can you tell it's coming?"
            />
            {field({
              label: 'Known Triggers', name: 'known_triggers', as: 'textarea',
              placeholder: 'e.g. loud unexpected noises, schedule changes without warning, hunger, crowded environments, transitions between activities'
            })}
            {field({
              label: 'Early Warning Signs', name: 'escalation_signs', as: 'textarea',
              placeholder: 'e.g.\nStarts rocking more than usual\nCovers ears\nGoes very quiet and still\nStops responding to name',
              hint: 'Signs before the crisis hits — catching these early changes everything.'
            })}
            {field({
              label: 'Do NOT Do', name: 'do_not_do', as: 'textarea',
              placeholder: 'e.g.\nDo not raise your voice\nDo not physically restrain unless safety emergency\nDo not take away comfort items as a consequence\nDo not demand eye contact',
              hint: 'Critical. The AI will never suggest these. Be as specific as possible.'
            })}

            <SectionHeader
              title="Calming & Comfort"
              subtitle={`This section powers the most personalized responses for ${firstName}.`}
            />
            {field({
              label: 'Calming Strategies That Work', name: 'calming_tools', as: 'textarea',
              placeholder: 'e.g. bring to a quiet dim room, offer weighted blanket, put on lo-fi music playlist, sit nearby without talking, firm hand squeeze if they reach for your hand'
            })}
            {field({
              label: 'Favorite Items & Comfort Objects', name: 'favorite_items', as: 'textarea',
              placeholder: 'e.g.\nEllie — small gray stuffed elephant she carries everywhere\nWeighted blanket (the blue one with stars)\nPurple water bottle\nKinetic sand',
              hint: 'Use exact names. The AI will reference these directly — this is what makes responses feel personal.'
            })}
            {field({
              label: 'Trusted People', name: 'trusted_people', as: 'textarea',
              placeholder: 'e.g.\nMom (Sarah) — responds to her voice best\nTyler — older sibling, can calm her with hand squeeze method\nMs. Rivera — classroom aide at school',
              hint: 'The AI can suggest involving these people by name in its steps.'
            })}

            <SectionHeader
              title="Routine & Medical"
              subtitle="Routine disruptions are a top trigger. Medical context keeps suggestions safe."
            />
            {field({
              label: 'Daily Routine', name: 'daily_routine', as: 'textarea',
              placeholder: 'e.g. 7am wake, same breakfast daily, school 8:30–3pm, snack immediately after school (skipping this causes major dysregulation), dinner 5:30pm, bath 7pm, bed 8pm'
            })}
            {field({
              label: 'Medical Notes', name: 'medical_notes', as: 'textarea',
              placeholder: 'e.g.\nAbsence seizures — glassy-eyed and unresponsive for 30+ seconds means contact Sarah immediately\nOn Keppra 500mg twice daily\nRecent medication increase 3 weeks ago may be causing increased irritability',
              hint: 'Medications and seizure history are especially important — the AI factors these into every response.'
            })}

            <SectionHeader
              title="Recent Context"
              subtitle="Update this regularly — it dramatically improves accuracy."
            />
            {field({
              label: "What's Been Happening Lately", name: 'recent_context', as: 'textarea',
              placeholder: 'e.g.\nSchool had a fire drill last Tuesday — very distressing, behavior elevated all week\nHad a cold 10 days ago, sleep disrupted since\nCurrently more sensitive than her baseline',
              hint: 'Recent illness, sleep issues, schedule changes, or medication adjustments heavily affect behavior.'
            })}
          </>
        )}

        <button
          className="btn btn-teal btn-full btn-lg"
          onClick={handleSubmit}
          disabled={loading}
          style={{ marginTop: 24 }}
        >
          {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Profile'}
        </button>
      </div>
    </div>
  );
}
