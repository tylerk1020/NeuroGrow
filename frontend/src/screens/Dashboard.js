import React, { useState, useEffect } from 'react';
import API from '../config';

export default function Dashboard({ selectedUser, setSelectedUser, navigate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pull caregiver name from localStorage
  const caregiverFirst = (() => {
    try {
      const saved = localStorage.getItem('ng_caregiver');
      if (!saved) return null;
      const name = JSON.parse(saved)?.full_name || '';
      return name.split(' ')[0] || null;
    } catch { return null; }
  })();

  useEffect(() => {
    const token = localStorage.getItem('ng_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API}/users-list`, { headers })
      .then(r => r.json())
      .then(data => {
        const list = data.users || [];
        setUsers(list);
        if (list.length === 1 && !selectedUser) setSelectedUser(list[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const firstName = selectedUser?.name?.split(' ')[0];

  return (
    <div>

      {/* Greeting */}
      <div style={{ marginBottom: 22 }}>
        <div style={{
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--gray-900)',
          letterSpacing: '-0.5px',
          marginBottom: 3,
          fontFamily: 'var(--font-serif)',
          lineHeight: 1.2,
        }}>
          {caregiverFirst ? `Hi, ${caregiverFirst}` : 'Welcome back'}
        </div>
        <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>
          {selectedUser
            ? `${firstName}'s profile is active.`
            : 'Select a profile to get personalized support.'}
        </div>
      </div>

      {/* Active profile + CTA hero card */}
      {selectedUser ? (
        <div style={{
          background: 'linear-gradient(145deg, #0a1628 0%, #0f2040 50%, #0a1628 100%)',
          borderRadius: 20,
          padding: '22px 22px 22px',
          marginBottom: 14,
          boxShadow: '0 0 0 1px rgba(0,212,180,0.15), 0 0 40px rgba(0,212,180,0.08), 0 12px 48px rgba(0,0,0,0.35)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(0,212,180,0.18)',
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', right: -30, top: -30,
            width: 140, height: 140, borderRadius: '50%',
            background: 'rgba(10,156,133,0.1)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 40, bottom: -40,
            width: 90, height: 90, borderRadius: '50%',
            background: 'rgba(37,99,235,0.08)',
            pointerEvents: 'none',
          }} />

          {/* Profile row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 11,
            marginBottom: 18, position: 'relative',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--teal), var(--teal-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 16,
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(10,156,133,0.45)',
            }}>
              {firstName[0]}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>
                {selectedUser.name}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 1,
              }}>
                {selectedUser.disorder}
              </div>
            </div>
            <div style={{
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: 5,
              cursor: 'pointer', padding: '5px 10px',
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
            }}
              onClick={() => navigate('edit-profile')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 500 }}>Edit</span>
            </div>
          </div>

          {/* Main CTA */}
          <button
            className="btn btn-teal btn-full"
            onClick={() => navigate('report')}
            style={{
              fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px',
              padding: '15px 28px', position: 'relative',
              boxShadow: '0 4px 20px rgba(10,156,133,0.5)',
            }}
          >
            Get Support Now
          </button>
        </div>
      ) : null}

      {/* Profile list card */}
      <div className="card">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 14,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.8px', color: 'var(--gray-400)',
          }}>
            {users.length > 0 ? 'Profiles' : 'Get Started'}
          </div>
          <button
            onClick={() => navigate('create-profile')}
            style={{
              background: 'var(--teal-light)', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: 'var(--teal-text)',
              padding: '5px 12px', borderRadius: 8, fontFamily: 'var(--font)',
            }}
          >
            + Add Profile
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <div className="spinner" style={{ width: 26, height: 26, borderWidth: 2 }} />
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
            <div className="empty-icon-ring" style={{ marginBottom: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="empty-title">No profiles yet</div>
            <div className="empty-text" style={{ marginBottom: 16 }}>
              Create a profile for the person you support to get personalized AI guidance.
            </div>
            <button className="btn btn-primary" onClick={() => navigate('create-profile')}>
              Create First Profile
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {users.map(user => {
              const isSelected = selectedUser?.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 13,
                    padding: '14px 16px',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(0,212,180,0.09) 0%, rgba(10,156,133,0.05) 100%)'
                      : '#111c2e',
                    borderRadius: 14,
                    border: `1.5px solid ${isSelected ? 'rgba(0,212,180,0.35)' : 'rgba(255,255,255,0.09)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: isSelected
                      ? '0 0 20px rgba(0,212,180,0.14), 0 2px 8px rgba(0,0,0,0.2)'
                      : '0 1px 3px rgba(0,0,0,0.2)',
                    position: 'relative',
                  }}
                >
                  {/* Left accent bar when selected */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', left: 0, top: '20%', bottom: '20%',
                      width: 3, borderRadius: '0 3px 3px 0',
                      background: 'linear-gradient(to bottom, #00d4b4, #0a9c85)',
                      boxShadow: '0 0 8px rgba(0,212,180,0.5)',
                    }} />
                  )}

                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: isSelected
                      ? 'linear-gradient(135deg, #00d4b4, #009e8a)'
                      : 'linear-gradient(135deg, #0f1f3d, #1a3260)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isSelected ? '#041a14' : 'white',
                    fontWeight: 700, fontSize: 17,
                    boxShadow: isSelected
                      ? '0 0 16px rgba(0,212,180,0.45)'
                      : '0 2px 8px rgba(15,31,61,0.2)',
                    transition: 'all 0.2s',
                  }}>
                    {user.name[0]}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 14,
                      color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)',
                      marginBottom: 4,
                    }}>
                      {user.name}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      fontSize: 11, fontWeight: 600,
                      padding: '2px 9px', borderRadius: 20,
                      background: isSelected ? 'rgba(0,212,180,0.14)' : 'rgba(255,255,255,0.07)',
                      color: isSelected ? '#4ecca3' : 'rgba(255,255,255,0.42)',
                      border: isSelected ? '1px solid rgba(0,212,180,0.28)' : '1px solid rgba(255,255,255,0.09)',
                      transition: 'all 0.2s',
                    }}>
                      {user.disorder}
                    </div>
                  </div>

                  {/* Right indicator */}
                  {isSelected ? (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #0a9c85, #087a65)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 11, fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(10,156,133,0.4)',
                    }}>✓</div>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Secondary actions */}
      {selectedUser && (
        <button
          className="btn btn-outline btn-full"
          onClick={() => navigate('history')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
          View Session History
        </button>
      )}

    </div>
  );
}
