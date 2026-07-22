import React, { useState, useRef } from 'react';
import API from '../config';

const LOADING_MESSAGES = [
  'Reading the profile...',
  'Analyzing the situation...',
  'Checking past sessions...',
  'Building a personalized response...',
];

const SEVERITY_OPTIONS = [
  {
    id: 'low',
    label: 'Low',
    iconColor: '#0a9c85',
    desc: 'Early signs',
    activeBg: 'rgba(10,156,133,0.16)',
    activeBorder: '#0a9c85',
    activeColor: '#4ecca3',
    activeShadow: 'rgba(10,156,133,0.25)',
  },
  {
    id: 'medium',
    label: 'Medium',
    iconColor: '#d97706',
    desc: 'Escalating',
    activeBg: 'rgba(217,119,6,0.15)',
    activeBorder: '#d97706',
    activeColor: '#fcd34d',
    activeShadow: 'rgba(217,119,6,0.25)',
  },
  {
    id: 'high',
    label: 'High',
    iconColor: '#e11d48',
    desc: 'Crisis',
    activeBg: 'rgba(225,29,72,0.15)',
    activeBorder: '#e11d48',
    activeColor: '#fca5a5',
    activeShadow: 'rgba(225,29,72,0.25)',
  },
];

export default function ReportSituation({ selectedUser, navigate, setLastResponse }) {
  const [form, setForm] = useState({
    situation: '',
    trigger: '',
    severity: 'medium',
    additional_context: '',
    current_location: '',
    available_items: '',
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
          available_items: form.available_items,
        }),
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

  /* ── LOADING SCREEN ── */
  if (loading) {
    return (
      <div style={{
        minHeight: '72vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 24, padding: '60px 20px',
      }}>
        {/* Glowing spinner */}
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(10,156,133,0.12)',
            borderTopColor: '#0a9c85',
            borderRightColor: 'rgba(10,156,133,0.4)',
            animation: 'spin 0.75s linear infinite',
            boxShadow: '0 0 24px rgba(10,156,133,0.25)',
          }} />
          <div style={{
            position: 'absolute', inset: 8,
            borderRadius: '50%',
            border: '2px solid rgba(10,156,133,0.07)',
            borderTopColor: 'rgba(10,156,133,0.3)',
            animation: 'spin 1.2s linear infinite reverse',
          }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 17, fontWeight: 700,
            color: '#0f1f3d', marginBottom: 8, letterSpacing: '-0.2px',
          }}>
            Analyzing {firstName}'s profile
          </div>
          <div style={{
            fontSize: 13, color: '#94a3b8',
            transition: 'opacity 0.3s',
            minHeight: 18,
          }}>
            {LOADING_MESSAGES[loadingMsg]}
          </div>
        </div>

        {showColdStart && (
          <div className="cold-start-notice">
            The server is waking up — this can take up to 60 seconds on first use.
            Your request is queued and will complete automatically.
          </div>
        )}
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div>
      <div className="nav-back" onClick={() => navigate('dashboard')}>← Back</div>

      {/* Main card — no padding at root so header can bleed */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

        {/* ── DARK HEADER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 60%, #0a1a30 100%)',
          padding: '22px 24px',
          display: 'flex', alignItems: 'center', gap: 13,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 100, height: 100, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,180,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Avatar */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #00d4b4, #009e8a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#041a14', fontWeight: 800, fontSize: 18,
            boxShadow: '0 0 20px rgba(0,212,180,0.55)',
            position: 'relative',
          }}>
            {firstName ? firstName[0].toUpperCase() : '?'}
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              color: 'white', fontWeight: 700, fontSize: 16, letterSpacing: '-0.25px',
            }}>
              What's happening with {firstName}?
            </div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 2 }}>
              The more specific you are, the better the support
            </div>
          </div>
        </div>

        {/* ── FORM BODY ── */}
        <div style={{ padding: '22px 24px' }}>
          {error && <div className="alert-box">{error}</div>}

          {/* Situation textarea */}
          <div className="form-group">
            <label className="form-label">
              Describe the situation <span style={{ color: '#e11d48', fontWeight: 700 }}>*</span>
            </label>
            <textarea
              className="form-textarea"
              name="situation"
              placeholder={`What is ${firstName} doing right now? Be specific — "She dropped to the floor covering her ears after the alarm went off and won't respond."`}
              value={form.situation}
              onChange={handleChange}
              style={{ minHeight: 120, fontSize: 14, lineHeight: 1.7 }}
              autoFocus
            />
          </div>

          {/* Severity — big icon cards */}
          <div className="form-group">
            <label className="form-label">How severe is this?</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9 }}>
              {SEVERITY_OPTIONS.map(s => {
                const active = form.severity === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setForm({ ...form, severity: s.id })}
                    style={{
                      padding: '14px 6px 12px',
                      borderRadius: 14,
                      border: `2px solid ${active ? s.activeBorder : 'rgba(255,255,255,0.09)'}`,
                      background: active ? s.activeBg : '#111c2e',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                      transform: active ? 'scale(1.04)' : 'scale(1)',
                      boxShadow: active
                        ? `0 4px 18px ${s.activeShadow}, 0 1px 4px rgba(15,31,61,0.05)`
                        : '0 1px 3px rgba(15,31,61,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: active ? s.iconColor : '#e2e8f0',
                        transition: 'background 0.18s',
                        boxShadow: active ? `0 0 8px ${s.iconColor}80` : 'none',
                      }} />
                    </div>
                    <div style={{
                      fontWeight: 700, fontSize: 13, letterSpacing: '-0.1px',
                      color: active ? s.activeColor : 'rgba(255,255,255,0.75)',
                    }}>
                      {s.label}
                    </div>
                    <div style={{
                      fontSize: 10, fontWeight: 600, marginTop: 2,
                      color: active ? s.activeColor : '#94a3b8',
                      opacity: 0.85,
                    }}>
                      {s.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional fields toggle */}
          {!showOptional ? (
            <button
              onClick={() => setShowOptional(true)}
              style={{
                width: '100%', padding: '12px',
                background: 'transparent',
                border: '1.5px dashed rgba(255,255,255,0.18)',
                borderRadius: 10, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13, fontWeight: 500,
                color: 'rgba(255,255,255,0.42)',
                marginTop: 4, marginBottom: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
              Add location, trigger, or available items
            </button>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Possible Trigger</label>
                <input className="form-input" name="trigger"
                  placeholder="What may have caused this? e.g. loud noise, missed snack, unexpected change"
                  value={form.trigger} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Current Location</label>
                <input className="form-input" name="current_location"
                  placeholder="Where are you right now? e.g. grocery store, school, car, home"
                  value={form.current_location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Items Available Right Now</label>
                <input className="form-input" name="available_items"
                  placeholder={`What do you have with you? e.g. Ellie, weighted blanket`}
                  value={form.available_items} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Additional Context</label>
                <textarea className="form-textarea" name="additional_context"
                  placeholder="Anything else — who else is present, how they've been today, time of day"
                  value={form.additional_context} onChange={handleChange} />
              </div>
            </>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%', marginTop: 12,
              padding: '15px 28px',
              background: 'linear-gradient(135deg, #0a9c85 0%, #087a65 100%)',
              color: 'white', border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', letterSpacing: '-0.15px',
              boxShadow: '0 0 32px rgba(10,156,133,0.38), 0 4px 16px rgba(10,156,133,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              transition: 'all 0.2s',
            }}
          >
            Get Support Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
