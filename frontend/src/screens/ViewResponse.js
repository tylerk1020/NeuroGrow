import React, { useState } from 'react';
import API from '../config';

const PRIORITY_CONFIG = {
  high: {
    label: 'High Priority',
    emoji: '🚨',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
    glow: 'rgba(220,38,38,0.25)',
    dot: '#ef4444',
  },
  'medium-high': {
    label: 'Medium-High',
    emoji: '⚠️',
    gradient: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
    glow: 'rgba(217,119,6,0.2)',
    dot: '#f59e0b',
  },
  medium: {
    label: 'Medium Priority',
    emoji: '💙',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    glow: 'rgba(37,99,235,0.2)',
    dot: '#3b82f6',
  },
  low: {
    label: 'Low Priority',
    emoji: '✅',
    gradient: 'linear-gradient(135deg, #065f52 0%, #0a4a3f 100%)',
    glow: 'rgba(10,156,133,0.2)',
    dot: '#0a9c85',
  },
  unknown: {
    label: 'Response Ready',
    emoji: '💭',
    gradient: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
    glow: 'rgba(71,85,105,0.2)',
    dot: '#64748b',
  },
};

export default function ViewResponse({ response, selectedUser, navigate }) {
  const [overall, setOverall] = useState(null);
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shareState, setShareState] = useState('idle');

  const firstName = selectedUser?.name?.split(' ')[0];
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  if (!response) { navigate('dashboard'); return null; }

  const pc = PRIORITY_CONFIG[response.priority] || PRIORITY_CONFIG.unknown;

  const handleStarClick = (strategy, rating) =>
    setRatings({ ...ratings, [strategy]: rating });

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
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const buildShareText = () => {
    const lines = [
      `Support response for ${firstName}`,
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
        await navigator.share({ title: `NeuroGrow — Support for ${firstName}`, text });
        setShareState('shared');
        setTimeout(() => setShareState('idle'), 2200);
      } catch (e) { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(text);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2200);
    }
  };

  const shareLabel = shareState === 'copied' ? '✓ Copied' : shareState === 'shared' ? '✓ Sent' : canShare ? 'Share' : 'Copy';

  return (
    <div>
      <div className="nav-back" onClick={() => navigate('dashboard')}>← Back to Dashboard</div>

      {/* ══ PRIORITY HERO CARD ══ */}
      <div style={{
        borderRadius: 20, overflow: 'hidden', marginBottom: 14,
        boxShadow: `0 0 40px ${pc.glow}, 0 8px 32px rgba(0,0,0,0.15)`,
      }}>
        {/* Colored gradient header */}
        <div style={{
          background: pc.gradient,
          padding: '22px 22px 18px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Background glow orb */}
          <div style={{
            position: 'absolute', right: -30, top: -30,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 12,
            position: 'relative',
          }}>
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '1.2px', color: 'rgba(255,255,255,0.5)',
                marginBottom: 6,
              }}>
                AI Response
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: pc.dot,
                  boxShadow: `0 0 10px ${pc.dot}`,
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                <span style={{
                  color: 'white', fontSize: 20, fontWeight: 800,
                  letterSpacing: '-0.4px',
                }}>
                  {pc.label}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{pc.emoji}</div>
              {/* Share button */}
              <button
                onClick={handleShare}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, color: 'rgba(255,255,255,0.85)',
                  fontSize: 12, fontWeight: 600, padding: '6px 12px',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {shareLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Caregiver note — inside the card, below the header */}
        {response.caregiver_note && (
          <div style={{
            background: 'white',
            padding: '16px 22px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            fontSize: 14,
            color: '#1e293b',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)',
            lineHeight: 1.7,
          }}>
            {response.caregiver_note}
          </div>
        )}
      </div>

      {/* ══ IMMEDIATE ACTIONS ══ */}
      <div className="card">
        <div className="section-label" style={{ marginTop: 0 }}>Immediate Actions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {response.immediate_actions?.map((action, i) => (
            <div
              key={i}
              className="action-item"
              style={{
                animation: 'fade-slide-up 0.35s ease both',
                animationDelay: `${i * 60}ms`,
              }}
            >
              <span className="action-number">{i + 1}</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PRECAUTIONS ══ */}
      {response.precautions?.length > 0 && (
        <div className="card">
          <div className="section-label" style={{ marginTop: 0 }}>Watch For</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {response.precautions.map((p, i) => (
              <div key={i} className="precaution-item">{p}</div>
            ))}
          </div>
        </div>
      )}

      {/* ══ DISCLAIMER ══ */}
      <div className="disclaimer">{response.disclaimer}</div>

      {/* ══ FEEDBACK CARD ══ */}
      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ marginBottom: 2 }}>
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#0f1f3d',
            letterSpacing: '-0.3px', marginBottom: 4,
          }}>
            How did it go?
          </div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
            Rating each step helps {firstName}'s AI get smarter over time.
          </div>
        </div>

        {submitted ? (
          <div style={{
            marginTop: 18, padding: '16px 20px',
            background: 'linear-gradient(135deg, #e6f5f2, #f0fbf9)',
            border: '1px solid rgba(10,156,133,0.2)',
            borderRadius: 12, textAlign: 'center',
            fontSize: 14, fontWeight: 600, color: '#065f52',
          }}>
            ✓ Feedback saved — thank you for helping the AI learn.
          </div>
        ) : (
          <div style={{ marginTop: 18 }}>

            {/* Overall thumbs */}
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 10,
            }}>
              Was this helpful overall?
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {[
                { val: 1, icon: '👍', activeStyle: { background: '#e6f5f2', border: '2px solid #0a9c85', boxShadow: '0 4px 16px rgba(10,156,133,0.2)' } },
                { val: 0, icon: '👎', activeStyle: { background: '#fff1f2', border: '2px solid #e11d48', boxShadow: '0 4px 16px rgba(225,29,72,0.15)' } },
              ].map(({ val, icon, activeStyle }) => (
                <button
                  key={val}
                  onClick={() => setOverall(val)}
                  style={{
                    flex: 1, padding: '14px 0',
                    borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 26,
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    transition: 'all 0.18s',
                    transform: overall === val ? 'scale(1.04)' : 'scale(1)',
                    ...(overall === val ? activeStyle : {}),
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Per-step ratings */}
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 10,
            }}>
              Rate each step
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {response.immediate_actions?.map((action, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 14,
                    padding: '12px 0',
                    borderBottom: i < response.immediate_actions.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}
                >
                  {/* Step text */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, flex: 1 }}>
                    <div style={{
                      minWidth: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--teal-light)', color: 'var(--teal-text)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                      {action.length > 80 ? action.slice(0, 80) + '…' : action}
                    </span>
                  </div>

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        onClick={() => handleStarClick(action, star)}
                        style={{
                          fontSize: 22, cursor: 'pointer', lineHeight: 1,
                          color: (ratings[action] || 0) >= star ? '#f59e0b' : '#e2e8f0',
                          transition: 'all 0.1s',
                          transform: (ratings[action] || 0) >= star ? 'scale(1.15)' : 'scale(1)',
                          display: 'inline-block',
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitFeedback}
              disabled={submitting || overall === null}
              style={{
                width: '100%', marginTop: 20,
                padding: '14px 28px',
                background: overall === null
                  ? '#f1f5f9'
                  : 'linear-gradient(135deg, #0a9c85, #087a65)',
                color: overall === null ? '#94a3b8' : 'white',
                border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 600, cursor: overall === null ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
                boxShadow: overall === null ? 'none' : '0 0 24px rgba(10,156,133,0.3), 0 4px 12px rgba(10,156,133,0.15)',
              }}
            >
              {submitting ? 'Saving...' : 'Submit Feedback'}
            </button>
          </div>
        )}
      </div>

      {/* Report another */}
      <button
        className="btn btn-outline btn-full"
        style={{ marginTop: 8, marginBottom: 8 }}
        onClick={() => navigate('report')}
      >
        Report Another Situation
      </button>
    </div>
  );
}
