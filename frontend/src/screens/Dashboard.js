import React, { useState, useEffect } from 'react';
import API from '../config';

export default function Dashboard({ selectedUser, setSelectedUser, navigate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ng_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API}/users-list`, { headers })
      .then(r => r.json())
      .then(data => {
        const list = data.users || [];
        setUsers(list);
        // Auto-select if there's only one profile
        if (list.length === 1 && !selectedUser) setSelectedUser(list[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const firstName = selectedUser?.name?.split(' ')[0];

  return (
    <div>
      {/* Welcome card */}
      <div className="card">
        <div className="card-title">
          {selectedUser ? `${firstName}'s Dashboard` : 'Welcome to NeuroGrow'}
        </div>
        <div className="card-subtitle">
          {selectedUser
            ? `Personalized AI support ready for ${firstName}. Select an action below.`
            : 'Select a profile below or create a new one to get started.'
          }
        </div>
        <button className="btn btn-teal btn-full" onClick={() => navigate('create-profile')}>
          Add New Profile
        </button>
      </div>

      {/* Profile list */}
      {loading ? (
        <div className="loading-wrap">
          <div className="spinner" />
          <div className="loading-text">Loading profiles...</div>
        </div>
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div className="empty-icon-ring" style={{ marginBottom: 14 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="empty-title">No profiles yet</div>
          <div className="empty-text" style={{ marginBottom: 20 }}>
            Create a profile for the person you support to get personalized AI guidance during difficult moments.
          </div>
          <button className="btn btn-primary" onClick={() => navigate('create-profile')}>
            Create First Profile
          </button>
        </div>
      ) : (
        <div>
          <div className="section-label">Profiles</div>
          {users.map(user => (
            <div
              key={user.id}
              className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="user-avatar">{user.name[0]}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-disorder">{user.disorder}</div>
              </div>
              {selectedUser?.id === user.id && (
                <div className="user-check">✓</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions for selected profile */}
      {selectedUser && (
        <div style={{ marginTop: 6 }}>
          <div className="section-label">Actions for {firstName}</div>
          <div className="action-buttons">
            <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('report')}>
              Get Support Now
            </button>
            <button className="btn btn-outline btn-full" onClick={() => navigate('history')}>
              View Session History
            </button>
            <button className="btn btn-outline btn-full" onClick={() => navigate('edit-profile')}>
              Edit {firstName}'s Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
