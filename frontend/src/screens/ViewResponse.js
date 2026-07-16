import React, { useState } from 'react';
import API from '../config';

const PRIORITY_LABELS = {
  high: 'High Priority',
  'medium-high': 'Medium-High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
  unknown: 'Priority Unknown'
};

export default function ViewResponse({ response, selectedUser, navigate }) {
  const [overall, setOverall] = useState(null);
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shareState, setShareState] = useState('idle'); // idle | copied | shared

  const firstName = selectedUser?.name?.split(' ')[0];
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  if (!response) { navigate('dashboard'); return null; }

  const priorityClass = `priority-${response.priority || 'medium'}`;
  const priorityLabel = PRIORITY_LABELS[response.priority] || response.priority;

  const handleStarClick = (strategy, rating) => setRatings({ ...ratings, [strategy]: rating });

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
          strategy_ratings: strategyRatings
        })
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
      `Priority: ${(response.priority || 'medium').toUpperCase()}`,
      '',
      'Immediate Actions:',
      ...(response.immediate_actions || []).map((a, i) => `${i + 1}. ${a}`),
    ];
    if (response.precautions?.length) {
      lines.push('', 'Watch for:');
      response.precautions.forEach(p => lines.push(`• ${p}`));
    }
    if (response.caregiver_note) {
      lines.push('', response.caregiver_note);
    }
    return lines.join('\n');
  };

  const handleShare = async () => {
    const text = buildShareText();
    if (canShare) {
      try {
        await navigator.share({ title: `NeuroGrow — Support for ${firstName}`, text });
        setShareState('shared');
        setTimeout(() => setShareState('idle'), 2200);
      } catch (e) {
        // User cancelled — no-op
      }
    } else {
      navigator.clipboard.writeText(text);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2200);
    }
  };

  const shareLabel = shareState === 'copied' ? 'Copied' : shareState === 'shared' ? 'Sent' : canShare ? 'Share' : 'Copy';
  const shareActive = shareState !== 'idle';

  return (
    <div>
      <div className="nav-back" onClick={() => navigate('dashboard')}>
        ← Back to Dashboard
      </div>

      {/* Priority + share row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div className={`priority-badge ${priorityClass}`}>
          {priorityLabel}
        </div>
        <button className={`copy-btn ${shareActive ? 'copied' : ''}`} onClick={handleShare}>
          {canShare && shareState === 'idle' && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 2 }}>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          )}
          {shareLabel}
        </button>
      </div>

      {/* Caregiver note */}
      {response.caregiver_note && (
        <div className="caregiver-note">
          {response.caregiver_note}
        </div>
      )}

      {/* Immediate actions */}
      <div className="card">
        <div className="section-label" style={{ marginTop: 0 }}>Immediate Actions</div>
        <ul className="actions-list">
          {response.immediate_actions?.map((action, i) => (
            <li key={i} className="action-item">
              <span className="action-number">{i + 1}</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Precautions */}
      {response.precautions?.length > 0 && (
        <div className="card">
          <div className="section-label" style={{ marginTop: 0 }}>Watch For</div>
          <ul className="precautions-list">
            {response.precautions.map((p, i) => (
              <li key={i} className="precaution-item">{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer">
        {response.disclaimer}
      </div>

      {/* Feedback */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-title" style={{ fontSize: 17 }}>How did it go?</div>
        <div className="card-subtitle">
          Your feedback helps {firstName}'s support improve over time.
        </div>

        {submitted ? (
          <div className="success-banner">
            Feedback saved — thank you for helping the app learn.
          </div>
        ) : (
          <div className="feedback-section">
            <div className="section-label" style={{ marginTop: 0 }}>Was this helpful overall?</div>
            <div className="thumbs-row">
              <button
                className={`thumb-btn ${overall === 1 ? 'selected-up' : ''}`}
                onClick={() => setOverall(1)}
              >
                👍
              </button>
              <button
                className={`thumb-btn ${overall === 0 ? 'selected-down' : ''}`}
                onClick={() => setOverall(0)}
              >
                👎
              </button>
            </div>

            <div className="section-label">Rate each step</div>
            {response.immediate_actions?.map((action, i) => (
              <div key={i} className="strategy-rating">
                <span className="strategy-text">
                  <span style={{ fontWeight: 600, color: '#334155', marginRight: 6 }}>{i + 1}.</span>
                  {action}
                </span>
                <div className="star-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${(ratings[action] || 0) >= star ? 'filled' : ''}`}
                      onClick={() => handleStarClick(action, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="btn btn-teal btn-full"
              style={{ marginTop: 20 }}
              onClick={handleSubmitFeedback}
              disabled={submitting || overall === null}
            >
              {submitting ? 'Saving...' : 'Submit Feedback'}
            </button>
          </div>
        )}
      </div>

      <button
        className="btn btn-outline btn-full"
        style={{ marginTop: 8 }}
        onClick={() => navigate('report')}
      >
        Report Another Situation
      </button>
    </div>
  );
}
