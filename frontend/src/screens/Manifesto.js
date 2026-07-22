import React from 'react';
import BrainLogo from '../components/BrainLogo';

export default function Manifesto({ navigate }) {
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', minHeight: '100vh', background: '#f4f6f9' }}>

      {/* ── DARK HEADER ── */}
      <div style={{
        background: '#07091a',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle orb */}
        <div style={{
          position: 'absolute', top: -60, right: -40,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,180,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div className="hero-grid" />

        {/* ── FULL NAV (same as Landing) ── */}
        <nav style={{
          position: 'relative', zIndex: 20,
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={() => navigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <BrainLogo size={32} color="white" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
              NeuroVero
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button onClick={() => navigate('landing')} className="landing-nav-link">
              How it works
            </button>
            {/* Manifesto is active — highlight it */}
            <button
              className="landing-nav-link"
              style={{ color: 'rgba(255,255,255,0.85)', cursor: 'default' }}
            >
              Manifesto
            </button>
            <a href="mailto:tylerkim1020@gmail.com" className="landing-nav-link" style={{ textDecoration: 'none' }}>
              Contact
            </a>
            <button
              onClick={() => navigate('login')}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, color: 'rgba(255,255,255,0.75)',
                fontSize: 13, fontWeight: 500, padding: '7px 18px',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s', marginLeft: 10,
              }}
            >Sign In</button>
          </div>
        </nav>

        {/* Page title */}
        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: 600, margin: '0 auto',
          padding: '40px 24px 60px',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '2px', color: '#0a9c85', marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ color: 'rgba(10,156,133,0.35)' }}>—</span>
            <span>Manifesto</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(30px, 7vw, 46px)', fontWeight: 700,
            color: 'white', letterSpacing: '-1.2px', lineHeight: 1.12,
            fontFamily: 'Lora, Georgia, serif', margin: 0,
          }}>
            Why NeuroVero<br/>exists.
          </h1>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '52px 24px 96px' }}>

        {/* Tyler — write your manifesto here */}
        <div style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: 16,
          color: '#334155',
          lineHeight: 2.0,
          minHeight: 200,
        }}>
          {/* Your content goes here */}
        </div>

        {/* Bottom "back" — subtle, in content area not header */}
        <div style={{ marginTop: 64, paddingTop: 28, borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={() => navigate('landing')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
              color: '#94a3b8', padding: 0, transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#0a9c85'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to home
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        background: '#07091a', padding: '32px 24px',
        textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 12 }}>
          <BrainLogo size={22} color="rgba(255,255,255,0.4)" />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600 }}>NeuroVero</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>
          Built for caregivers, by caregivers.
        </div>
      </div>

    </div>
  );
}
