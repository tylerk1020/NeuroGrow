import React, { useState, useRef } from 'react';
import API from '../config';

const LOADING_MESSAGES = [
  'Reading the profile...',
  'Analyzing the situation...',
  'Checking past sessions...',
  'Building a personalized response...',
];

export default function ReportSituation({ selectedUser, navigate, setLastResponse }) {
  const [form, setForm] = useState({
    situation: '',
    trigger: '',
    severity: 'medium',
    additional_context: '',
    current_location: '',
    available_items: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [showColdStart, setShowColdStart] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [error, setError] = useState('');
  const coldTimerRef = useRef(null);

  const firstName = selectedUser?.name?.split(' ')[0];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.situation) { setError('Please describe what is happening.'); return; }
    setLoading(true);
    setShowColdStart(false);
    setError('');
    setLoadingMsg(0);

    const interval = setInterval(() => {
      setLoadingMsg(m => (m + 1) % LOADING_MESSAGES.length);
    }, 1400);

    // Show cold start warning if request takes more than 8 seconds
    coldTimerRef.current = setTimeout(() => setShowColdStart(true), 8000);

    try {
      const res = await fetch(`${API}/get-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.id,
          situation: form.situation,
          trigger: form.trigger,
          severity: form.severity,
          additional_context: form.additional_context,
          current_location: form.current_location,
          available_items: form.available_items
        })
      });
      const data = await res.json();
      clearInterval(interval);
      clearTimeout(coldTimerRef.current);
      setLastResponse(data);
      navigate('response');
    } catch (e) {
      clearInterval(interval);
      clearTimeout(coldTimerRef.current);
      setError('Failed to get a response. Make sure your backend is running.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-wrap" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
        <div className="loading-text">Analyzing {firstName}'s profile</div>
        <div className="loading-subtext">{LOADING_MESSAGES[loadingMsg]}</div>
        {showColdStart && (
          <div className="cold-start-notice">
            The server is waking up — this can take up to 60 seconds on first use. Your request is queued and will complete automatically.
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="nav-back" onClick={() => navigate('dashboard')}>
        ← Back
      </div>

      <div className="card">
        <div className="card-title">What's Happening?</div>
        <div className="card-subtitle">
          Describe the situation for {firstName}. The more specific you are, the more personalized the support will be.
        </div>

        {error && <div className="alert-box">{error}</div>}

        {/* Required: situation description */}
        <div className="form-group">
          <label className="form-label">Describe the Situation <span style={{ color: '#c53030' }}>*</span></label>
          <textarea
            className="form-textarea"
            name="situation"
            placeholder={`What is ${firstName} doing right now? Be specific — e.g. "She dropped to the floor covering her ears after the alarm went off and won't respond."`}
            value={form.situation}
            onChange={handleChange}
            style={{ minHeight: 110 }}
            autoFocus
          />
        </div>

        {/* Severity — always visible, already has a default */}
        <div className="form-group">
          <label className="form-label">Severity</label>
          <div className="severity-options">
            {['low', 'medium', 'high'].map(s => (
              <button
                key={s}
                className={`severity-btn ${s} ${form.severity === s ? 'active' : ''}`}
                onClick={() => setForm({ ...form, severity: s })}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Optional fields toggle */}
        {!showOptional ? (
          <button
            className="btn btn-ghost btn-full"
            style={{ marginTop: 4, marginBottom: 4, color: '#64748b', fontSize: 13 }}
            onClick={() => setShowOptional(true)}
          >
            + Add more detail (location, trigger, items available)
          </button>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Possible Trigger</label>
              <input
                className="form-input"
                name="trigger"
                placeholder="What may have caused this? e.g. loud noise, missed snack, unexpected change"
                value={form.trigger}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Location</label>
              <input
                className="form-input"
                name="current_location"
                placeholder="Where are you right now? e.g. school hallway, grocery store, car, home"
                value={form.current_location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Items Available Right Now</label>
              <input
                className="form-input"
                name="available_items"
                placeholder={`What do you have with you? e.g. Ellie, weighted blanket — or leave blank if nothing is available`}
                value={form.available_items}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Context</label>
              <textarea
                className="form-textarea"
                name="additional_context"
                placeholder="Anything else — who else is present, time of day, recent events, how she's been today"
                value={form.additional_context}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} style={{ marginTop: 12 }}>
          Get Support
        </button>
      </div>
    </div>
  );
}
