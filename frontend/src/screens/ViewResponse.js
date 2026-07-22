import React, { useState } from 'react';
import API from '../config';

const PRIORITY_CONFIG = {
  high: {
    label: 'High Priority',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
    glow: 'rgba(185,28,28,0.22)',
    dot: '#ef4444',
  },
  'medium-high': {
    label: 'Medium-High',
    gradient: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
    glow: 'rgba(180,83,9,0.18)',
    dot: '#f59e0b',
  },
  medium: {
    label: 'Medium Priority',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e3270 100%)',
    glow: 'rgba(30,58,138,0.18)',
    dot: '#60a5fa',
  },
  low: {
    label: 'Low Priority',
    gradient: 'linear-gradient(135deg, #065f52 0%, #044a3f 100%)',
    glow: 'rgba(6,95,82,0.18)',
    dot: '#34d399',
  },
  unknown: {
    label: 'Response Ready',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    glow: 'rgba(30,41,59,0.18)',
    dot: '#94a3b8',
  },
};

// SVG icon for each priority level — no emoji
function PriorityIcon({ priority, size = 22 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (priority === 'high') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  if (priority === 'medium-high') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
  if (priority === 'low') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
  return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

export default function ViewResponse({ response, selectedUser, navigate }) {
  const [overall, setOverall] = useState(null); // 1 = helpful, 0 = not helpful
  const [ratings, setRatings] = useState({});   // strategy -> 5 (worked) or 1 (didn't)
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shareState, setShareState] = useState('idle');

  const firstName = selectedUser?.name?.split(' ')[0];
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  if (!response) { navigate('dashboard'); return null; }

  const pc = PRIORITY_CONFIG[response.priority] || PRIORITY_CONFIG.unknown;

  const handleStepRating = (strategy, val) =>
    setRatings(prev => ({ ...prev, [strategy]: val }));

  const handleSubmitFeedback = async () => {
    setSubmitting(true);
    try {
      const strategyRatings = Object.entries(ratings).map(([strategy, rating]) => ({ strategy, rating }));
      await fetch(`${API}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: response.session_id,
          overall_helpful: overall,
          strategy_ratings: strategyRatings,
        }),
      });
      setSubmitted(true);
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  const buildShareText = () => {
    const lines = [
      `NeuroVero — Support for ${firstName}`,
      `Priority: ${pc.label}`,
      '',
      'Immediate Actions:',
      ...(response.immediate_actions || []).map((a, i) => `${i + 1}. ${a}`),
    ];
    if (response.precautions?.length) {
      lines.push('', 'Watch for:');
      response.precautions.forEach(p => lines.push(`• ${p}`));
    }
    if (response.caregiver_note) lines.push('', response.caregiver_note);
    return lines.join('\n');
  };

  const handleShare = async () => {
    const text = buildShareText();
    if (canShare) {
      try {
        await navigator.share({ title: `NeuroVero — Support for ${firstName}`, text });
        setShareState('shared');
        setTimeout(() => setShareState('idle'), 2200);
      } catch (e) { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(text);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2200);
    }
  };

  const shareLabel = shareState === 'copied' ? 'Copied' : shareState === 'shared' ? 'Sent' : canShare ? 'Share' : 'Copy';

  return (
    <div>
      <div className="nav-back" onClick={() => navigate('dashboard')}>← Back</div>

      {/* ── PRIORITY HEADER ── */}
      <div style={{
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 12,
        boxShadow: `0 0 32px ${pc.glow}, 0 6px 24px rgba(0,0,0,0.14)`,
      }}>
        <div style={{
          background: pc.gradient,
          padding: '20px 22px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -24, top: -24,
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PriorityIcon priority={response.priority} size={22} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
                  AI Response
                </div>
                <div style={{ color: 'white', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' }}>
                  {pc.label}
                </div>
              </div>
            </div>

            <button onClick={handleShare} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 8, color: 'rgba(255,255,255,0.8)',
              fontSize: 12, fontWeight: 600, padding: '7px 14px',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            }}>
              {shareState !== 'idle' ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {shareLabel}
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  {shareLabel}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Caregiver note */}
        {response.caregiver_note && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            padding: '15px 22px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            fontSize: 13.5,
            color: 'rgba(255,255,255,0.68)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)',
            lineHeight: 1.75,
          }}>
            {response.caregiver_note}
          </div>
        )}
      </div>

      {/* ── ACTIONS + PRECAUTIONS + DISCLAIMER in one card ── */}
      <div className="card" style={{ padding: '22px 22px' }}>

        {/* Immediate actions */}
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: 14 }}>
          Immediate Actions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: response.precautions?.length ? 22 : 0 }}>
          {response.immediate_actions?.map((action, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 13,
                padding: '14px 16px',
                background: '#111c2e',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.85)',
                animation: 'fade-slide-up 0.32s ease both',
                animationDelay: `${i * 55}ms`,
              }}
            >
              <div style={{
                minWidth: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #0a9c85, #087a65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 12, fontWeight: 700,
                boxShadow: '0 2px 8px rgba(10,156,133,0.3)',
                marginTop: 1,
              }}>
                {i + 1}
              </div>
              <span>{action}</span>
            </div>
          ))}
        </div>

        {/* Precautions */}
        {response.precautions?.length > 0 && (
          <>
            <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0 18px' }} />
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: 12 }}>
              Watch For
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {response.precautions.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '11px 14px',
                  background: 'rgba(217,119,6,0.1)',
                  border: '1px solid rgba(217,119,6,0.25)',
                  borderRadius: 10,
                  fontSize: 13, color: '#fcd34d', lineHeight: 1.6,
                }}>
                  <svg style={{ flexShrink: 0, marginTop: 2 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {p}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: 18,
          fontSize: 11.5, color: 'rgba(255,255,255,0.32)', lineHeight: 1.65,
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14,
        }}>
          {response.disclaimer}
        </div>
      </div>

      {/* ── FEEDBACK ── */}
      <div className="card">
        <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px', marginBottom: 3 }}>
          How did it go?
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', marginBottom: 20, lineHeight: 1.5 }}>
          Your ratings help {firstName}'s AI improve over time.
        </div>

        {submitted ? (
          <div style={{
            padding: '16px 20px',
            background: 'rgba(10,156,133,0.12)',
            border: '1px solid rgba(10,156,133,0.25)',
            borderRadius: 12, textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, fontWeight: 600, color: '#4ecca3',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Feedback saved — thank you.
          </div>
        ) : (
          <>
            {/* Overall — text buttons, no emoji */}
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 10 }}>
              Was this response helpful overall?
            </div>
            <div style={{ display: 'flex', gap: 9, marginBottom: 26 }}>
              {[
                {
                  val: 1, label: 'Helpful',
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
                  activeStyle: { background: 'rgba(10,156,133,0.18)', borderColor: '#0a9c85', color: '#4ecca3', boxShadow: '0 3px 12px rgba(10,156,133,0.2)' },
                },
                {
                  val: 0, label: 'Not helpful',
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
                  activeStyle: { background: 'rgba(225,29,72,0.15)', borderColor: '#e11d48', color: '#fca5a5', boxShadow: '0 3px 12px rgba(225,29,72,0.15)' },
                },
              ].map(({ val, label, icon, activeStyle }) => {
                const active = overall === val;
                return (
                  <button
                    key={val}
                    onClick={() => setOverall(val)}
                    style={{
                      flex: 1, padding: '12px 16px',
                      borderRadius: 10,
                      border: `1.5px solid ${active ? activeStyle.borderColor : 'rgba(255,255,255,0.1)'}`,
                      background: active ? activeStyle.background : '#111c2e',
                      color: active ? activeStyle.color : 'rgba(255,255,255,0.42)',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      transition: 'all 0.18s',
                      boxShadow: active ? activeStyle.boxShadow : 'none',
                      transform: active ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    {icon}
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Per-step ratings — "Worked / Didn't work" pills */}
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 12 }}>
              Did each step help?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              {response.immediate_actions?.map((action, i) => (
                <div key={i}>
                  {/* Step text */}
                  <div style={{
                    fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5,
                    marginBottom: 7, paddingLeft: 2,
                  }}>
                    <span style={{ fontWeight: 600, color: '#0a9c85', marginRight: 5 }}>{i + 1}.</span>
                    {action.length > 90 ? action.slice(0, 90) + '…' : action}
                  </div>
                  {/* Worked / Didn't work */}
                  <div style={{ display: 'flex', gap: 7 }}>
                    {[
                      { val: 5, label: 'Worked', activeColor: '#4ecca3', activeBg: 'rgba(10,156,133,0.18)', activeBorder: '#0a9c85' },
                      { val: 3, label: 'Somewhat', activeColor: '#fcd34d', activeBg: 'rgba(217,119,6,0.15)', activeBorder: '#d97706' },
                      { val: 1, label: "Didn't work", activeColor: '#fca5a5', activeBg: 'rgba(225,29,72,0.15)', activeBorder: '#e11d48' },
                    ].map(({ val, label, activeColor, activeBg, activeBorder }) => {
                      const active = ratings[action] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleStepRating(action, val)}
                          style={{
                            flex: 1,
                            padding: '7px 4px',
                            borderRadius: 8,
                            border: `1.5px solid ${active ? activeBorder : 'rgba(255,255,255,0.09)'}`,
                            background: active ? activeBg : '#111c2e',
                            color: active ? activeColor : 'rgba(255,255,255,0.35)',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 11, fontWeight: 600,
                            transition: 'all 0.15s',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitFeedback}
              disabled={submitting || overall === null}
              style={{
                width: '100%', padding: '13px 28px',
                background: overall === null
                  ? 'rgba(255,255,255,0.07)'
                  : 'linear-gradient(135deg, #0a9c85, #087a65)',
                color: overall === null ? 'rgba(255,255,255,0.3)' : 'white',
                border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                cursor: overall === null ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
                boxShadow: overall === null ? 'none' : '0 0 22px rgba(10,156,133,0.28), 0 3px 10px rgba(10,156,133,0.15)',
              }}
            >
              {submitting ? 'Saving...' : 'Submit Feedback'}
            </button>
          </>
        )}
      </div>

      <button
        className="btn btn-outline btn-full"
        style={{ marginTop: 6, marginBottom: 8 }}
        onClick={() => navigate('report')}
      >
        Report Another Situation
      </button>
    </div>
  );
}
