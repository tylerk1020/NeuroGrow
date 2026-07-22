import React from 'react';

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

        {/* Dot grid */}
        <div className="hero-grid" />

        {/* Nav */}
        <nav style={{
          position: 'relative', zIndex: 20,
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo — clickable, goes back to landing */}
          <button
            onClick={() => navigate('landing')}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#0a9c85"/>
              <path d="M15 9H12.5C9.5 9 7.5 11.5 7.5 16C7.5 20.5 9.5 23 12.5 23H15V9Z" fill="white" opacity="0.93"/>
              <path d="M17 9H19.5C22.5 9 24.5 11.5 24.5 16C24.5 20.5 22.5 23 19.5 23H17V9Z" fill="white" opacity="0.93"/>
              <rect x="14.5" y="23" width="3" height="2.5" rx="1.2" fill="white" opacity="0.7"/>
            </svg>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
              NeuroVero
            </span>
          </button>

          <button
            onClick={() => navigate('landing')}
            className="landing-nav-link"
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
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

        {/* Tyler — write your manifesto here. Below is the styled container. */}
        <div style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: 16,
          color: '#334155',
          lineHeight: 2.0,
          minHeight: 200,
        }}>
          {/* Add your content here — paragraphs, quotes, whatever feels right. */}
        </div>

        {/* Bottom nav back */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={() => navigate('landing')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
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
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#0a9c85"/>
            <path d="M15 9H12.5C9.5 9 7.5 11.5 7.5 16C7.5 20.5 9.5 23 12.5 23H15V9Z" fill="white" opacity="0.93"/>
            <path d="M17 9H19.5C22.5 9 24.5 11.5 24.5 16C24.5 20.5 22.5 23 19.5 23H17V9Z" fill="white" opacity="0.93"/>
            <rect x="14.5" y="23" width="3" height="2.5" rx="1.2" fill="white" opacity="0.7"/>
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600 }}>NeuroVero</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>
          Built for caregivers, by caregivers.
        </div>
      </div>

    </div>
  );
}
