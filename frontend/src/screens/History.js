import React, { useState, useEffect } from 'react';
import API from '../config';

const SEVERITY_COLORS = {
  high: { bg: '#fff5f5', color: '#9b2c2c', border: '#feb2b2' },
  medium: { bg: '#eff4ff', color: '#1e40af', border: '#bfdbfe' },
  low: { bg: '#e6f5f2', color: '#065f52', border: '#99e6d8' },
};

export default function History({ selectedUser, navigate }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const firstName = selectedUser?.name?.split(' ')[0];

  useEffect(() => {
    if (!selectedUser) return;
    fetch(`${API}/users/${selectedUser.id}/history`)
      .then(r => r.json())
      .then(data => { setHistory(data.sessions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedUser]);

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="nav-back" onClick={() => navigate('dashboard')}>
        ← Back
      </div>

      <div className="card">
        <div className="card-title">{firstName}'s Session History</div>
        <div className="card-subtitle">
          Past situations and the strategies that were recommended. Tap any session to see the full response.
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap">
          <div className="spinner" />
          <div className="loading-text">Loading history...</div>
        </div>
      ) : history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div className="empty-icon-ring" style={{ marginBottom: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
          </div>
          <div className="empty-title">No sessions yet</div>
          <div className="empty-text">
            Report a situation to get started. Each session you rate makes future responses smarter.
          </div>
        </div>
      ) : (
        [...history].reverse().map((session, i) => {
          const sev = session.severity?.toLowerCase() || 'medium';
          const colors = SEVERITY_COLORS[sev] || SEVERITY_COLORS.medium;
          const hasFeedback = session.feedback?.some(f => f.overall_helpful !== null);
          const isExpanded = !!expanded[session.id ?? i];
          const actions = session.actions_given || [];
          const previewActions = isExpanded ? actions : actions.slice(0, 2);
          const hasMore = actions.length > 2;

          return (
            <div
              key={session.id ?? i}
              className="history-item"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleExpand(session.id ?? i)}
            >
              <div className="history-header">
                <div className="history-situation">
                  {session.situation?.length > 80
                    ? session.situation.slice(0, 80) + '...'
                    : session.situation}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <div className="history-date">{formatDate(session.created_at)}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
                    {isExpanded ? '▲ collapse' : '▼ expand'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {session.severity && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: colors.bg,
                    color: colors.color,
                    border: `1px solid ${colors.border}`,
                  }}>
                    {session.severity}
                  </span>
                )}
                {session.trigger && (
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    {session.trigger}
                  </span>
                )}
              </div>

              <div className="history-actions">
                {previewActions.map((a, j) => (
                  <div key={j} style={{ marginBottom: 4 }}>
                    <span style={{ color: '#0a9c85', fontWeight: 600, marginRight: 5 }}>{j + 1}.</span>
                    {a}
                  </div>
                ))}
                {!isExpanded && hasMore && (
                  <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                    +{actions.length - 2} more steps — tap to expand
                  </div>
                )}
              </div>

              {/* Full expanded view */}
              {isExpanded && session.caregiver_note && (
                <div style={{
                  marginTop: 12,
                  padding: '12px 14px',
                  background: 'linear-gradient(135deg, #e6f5f2 0%, #f0fbf9 100%)',
                  borderLeft: '3px solid #0a9c85',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#065f52',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                }}>
                  {session.caregiver_note}
                </div>
              )}

              {hasFeedback && (
                <div style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: '#0a9c85',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}>
                  <span style={{ fontSize: 10 }}>●</span> Feedback submitted
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
