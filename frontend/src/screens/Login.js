import React, { useState } from 'react';
import API from '../config';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    if (mode === 'register' && !form.full_name) { setError('Your name is required.'); return; }
    if (mode === 'register' && form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, full_name: form.full_name };

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Something went wrong. Please try again.');

      localStorage.setItem('ng_token', data.access_token);
      localStorage.setItem('ng_caregiver', JSON.stringify(data.caregiver));
      onLogin(data.caregiver, data.access_token);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: '#f4f6f9'
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              background: '#0a9c85',
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
            }}>N</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#0f1f3d', letterSpacing: '-0.4px' }}>
              NeuroGrow
            </span>
          </div>
          <div style={{ fontSize: 15, color: '#334155', fontWeight: 500, marginBottom: 6 }}>
            Real-time AI support for caregivers
          </div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
            Describe what's happening during a meltdown or crisis moment and get immediate, personalized strategies — built around your loved one's profile.
          </div>
        </div>

        {/* Feature pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}>
          {['Autism', 'Dup15q', 'Rett Syndrome', 'Cerebral Palsy', '& more'].map(label => (
            <span key={label} style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 20,
              background: '#e6f5f2',
              color: '#065f52',
              border: '1px solid #99e6d8',
            }}>
              {label}
            </span>
          ))}
        </div>

        <div className="card" style={{ padding: 28 }}>

          {/* Tab toggle */}
          <div style={{
            display: 'flex',
            background: '#f1f3f7',
            borderRadius: 10,
            padding: 3,
            marginBottom: 22,
          }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 13,
                  transition: 'all 0.15s',
                  background: mode === m ? '#ffffff' : 'transparent',
                  color: mode === m ? '#0f1f3d' : '#94a3b8',
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && <div className="alert-box">{error}</div>}

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                name="full_name"
                placeholder="e.g. Sarah Chen"
                value={form.full_name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus={mode === 'login'}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="btn btn-teal btn-full btn-lg"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: 6 }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#94a3b8' }}>
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <span
                  style={{ color: '#0a9c85', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => { setMode('register'); setError(''); }}
                >
                  Create one free
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  style={{ color: '#0a9c85', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => { setMode('login'); setError(''); }}
                >
                  Sign in
                </span>
              </>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span
            style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer', transition: 'color 0.15s' }}
            onClick={() => onLogin(null, null)}
            onMouseEnter={e => e.target.style.color = '#475569'}
            onMouseLeave={e => e.target.style.color = '#94a3b8'}
          >
            Continue without an account
          </span>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#cbd5e1', letterSpacing: '0.2px' }}>
          Your data is private and never shared.
        </div>
      </div>
    </div>
  );
}
