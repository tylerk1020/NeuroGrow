import React, { useState } from 'react';
import API from '../config';
import BrainLogo from '../components/BrainLogo';

export default function Login({ onLogin, resetToken }) {
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login');
  const [form, setForm] = useState({ email: '', password: '', full_name: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingEmail, setPendingEmail] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  const handleSubmit = async () => {
    setError(''); setSuccess('');

    // ── RESET PASSWORD ──
    if (mode === 'reset') {
      if (!form.newPassword || !form.confirmPassword) { setError('Please fill in both fields.'); return; }
      if (form.newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
      if (form.newPassword !== form.confirmPassword) { setError('Passwords don\'t match.'); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: resetToken, password: form.newPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Something went wrong.');
        localStorage.setItem('ng_token', data.access_token);
        localStorage.setItem('ng_caregiver', JSON.stringify(data.caregiver));
        onLogin(data.caregiver, data.access_token);
      } catch (e) { setError(e.message); }
      setLoading(false);
      return;
    }

    // ── FORGOT PASSWORD ──
    if (mode === 'forgot') {
      if (!form.email) { setError('Enter your email address.'); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: '' }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Something went wrong.');
        setSuccess('If that email exists, a reset link is on its way. Check your inbox.');
      } catch (e) { setError('Something went wrong. Try again.'); }
      setLoading(false);
      return;
    }

    // ── REGISTER ──
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    if (mode === 'register' && !form.full_name) { setError('Your name is required.'); return; }
    if (mode === 'register' && form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await fetch(`${API}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password, full_name: form.full_name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Something went wrong.');
        setPendingEmail(form.email);
      } else {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Something went wrong.');
        localStorage.setItem('ng_token', data.access_token);
        localStorage.setItem('ng_caregiver', JSON.stringify(data.caregiver));
        onLogin(data.caregiver, data.access_token);
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true); setResendMsg('');
    try {
      const res = await fetch(`${API}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to resend.');
      setResendMsg('Email resent! Check your inbox.');
    } catch (e) { setResendMsg(e.message); }
    setResendLoading(false);
  };

  // ── SHARED STYLES ──
  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14,
    border: '1px solid #e2e8f0', fontFamily: 'Inter, sans-serif',
    outline: 'none', boxSizing: 'border-box', color: '#0f1f3d',
    background: 'white', marginTop: 6,
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#475569', display: 'block' };
  const btnTeal = {
    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
    background: '#0a9c85', color: 'white', fontWeight: 600, fontSize: 15,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginTop: 8,
    transition: 'opacity 0.15s',
  };

  // ── CHECK YOUR EMAIL ──
  if (pendingEmail) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#f4f6f9' }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e6f5f2', border: '2px solid #99e6d8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a9c85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f1f3d', margin: '0 0 10px', letterSpacing: '-0.3px' }}>Check your email</h2>
          <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, margin: '0 0 6px' }}>We sent a verification link to</p>
          <p style={{ color: '#0a9c85', fontWeight: 600, fontSize: 15, margin: '0 0 24px' }}>{pendingEmail}</p>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 28px' }}>Click the link to activate your account. Check spam if you don't see it.</p>
          {resendMsg && (
            <div style={{ background: resendMsg.includes('resent') ? '#e6f5f2' : '#fef2f2', border: `1px solid ${resendMsg.includes('resent') ? '#99e6d8' : '#fca5a5'}`, color: resendMsg.includes('resent') ? '#065f52' : '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {resendMsg}
            </div>
          )}
          <button onClick={handleResend} disabled={resendLoading} style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: 8, color: '#475569', fontSize: 13, fontWeight: 500, padding: '9px 20px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 16 }}>
            {resendLoading ? 'Sending...' : 'Resend email'}
          </button>
          <div>
            <button onClick={() => { setPendingEmail(null); setMode('login'); setError(''); setResendMsg(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESET PASSWORD (arrived via ?reset=TOKEN link) ──
  if (mode === 'reset') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#f4f6f9' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <BrainLogo size={36} color="#07091a" />
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f1f3d', margin: '14px 0 6px', letterSpacing: '-0.3px' }}>Set new password</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Choose a strong password for your account.</p>
          </div>
          <div className="card" style={{ padding: 28 }}>
            {error && <div className="alert-box" style={{ marginBottom: 16 }}>{error}</div>}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>New password</label>
              <input style={inputStyle} name="newPassword" type="password" placeholder="At least 8 characters" value={form.newPassword} onChange={handleChange} onKeyDown={handleKeyDown} autoFocus />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Confirm password</label>
              <input style={inputStyle} name="confirmPassword" type="password" placeholder="Same password again" value={form.confirmPassword} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
            <button style={btnTeal} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Set new password'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN LOGIN / REGISTER / FORGOT ──
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#f4f6f9' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <BrainLogo size={32} color="#07091a" />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#0f1f3d', letterSpacing: '-0.4px' }}>NeuroVero</span>
          </div>
          {mode !== 'forgot' && (
            <>
              <div style={{ fontSize: 15, color: '#334155', fontWeight: 500, marginBottom: 6 }}>Real-time AI support for caregivers</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
                Describe what's happening during a crisis and get immediate, personalized strategies — built around your loved one's profile.
              </div>
            </>
          )}
        </div>

        {mode !== 'forgot' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {['Autism', 'Dup15q', 'Rett Syndrome', 'Cerebral Palsy', '& more'].map(label => (
              <span key={label} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#e6f5f2', color: '#065f52', border: '1px solid #99e6d8' }}>{label}</span>
            ))}
          </div>
        )}

        <div className="card" style={{ padding: 28 }}>

          {/* Forgot password form */}
          {mode === 'forgot' ? (
            <>
              <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: '#0f1f3d' }}>Forgot your password?</h3>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Enter your email and we'll send a reset link.</p>
              {error && <div className="alert-box" style={{ marginBottom: 14 }}>{error}</div>}
              {success && <div style={{ background: '#e6f5f2', border: '1px solid #99e6d8', color: '#065f52', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>{success}</div>}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} onKeyDown={handleKeyDown} autoFocus />
              </div>
              <button style={btnTeal} onClick={handleSubmit} disabled={loading || !!success}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span onClick={() => { setMode('login'); setError(''); setSuccess(''); }} style={{ fontSize: 13, color: '#0a9c85', cursor: 'pointer', fontWeight: 600 }}>Back to sign in</span>
              </div>
            </>
          ) : (
            <>
              {/* Tab toggle */}
              <div style={{ display: 'flex', background: '#f1f3f7', borderRadius: 10, padding: 3, marginBottom: 22 }}>
                {['login', 'register'].map(m => (
                  <button key={m} onClick={() => { setMode(m); setError(''); }} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, transition: 'all 0.15s', background: mode === m ? '#ffffff' : 'transparent', color: mode === m ? '#0f1f3d' : '#94a3b8', boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                    {m === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              {error && <div className="alert-box">{error}</div>}

              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" name="full_name" placeholder="e.g. Sarah Chen" value={form.full_name} onChange={handleChange} onKeyDown={handleKeyDown} autoFocus />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} onKeyDown={handleKeyDown} autoFocus={mode === 'login'} />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" name="password" type="password" placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'} value={form.password} onChange={handleChange} onKeyDown={handleKeyDown} />
              </div>

              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: 6, marginBottom: 4 }}>
                  <span onClick={() => { setMode('forgot'); setError(''); }} style={{ fontSize: 12, color: '#0a9c85', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
                </div>
              )}

              <button className="btn btn-teal btn-full btn-lg" onClick={handleSubmit} disabled={loading} style={{ marginTop: 10 }}>
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#94a3b8' }}>
                {mode === 'login' ? (
                  <>Don't have an account?{' '}<span style={{ color: '#0a9c85', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setMode('register'); setError(''); }}>Create one free</span></>
                ) : (
                  <>Already have an account?{' '}<span style={{ color: '#0a9c85', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setMode('login'); setError(''); }}>Sign in</span></>
                )}
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer' }} onClick={() => onLogin(null, null)}
            onMouseEnter={e => e.target.style.color = '#475569'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>
            Continue without an account
          </span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#cbd5e1' }}>Your data is private and never shared.</div>
      </div>
    </div>
  );
}
