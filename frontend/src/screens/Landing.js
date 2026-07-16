import React from 'react';

export default function Landing({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1f3c 0%, #0f2d4a 50%, #0a1f38 100%)',
        padding: '0 24px',
        height: 62,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #0a9c85, #087a65)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 14,
            boxShadow: '0 2px 8px rgba(10,156,133,0.4)',
          }}>N</div>
          <span style={{ color: 'white', fontWeight: 600, fontSize: 16, letterSpacing: '-0.2px' }}>NeuroGrow</span>
        </div>
        <button
          onClick={() => navigate('login')}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, color: 'rgba(255,255,255,0.85)',
            fontSize: 13, fontWeight: 500, padding: '6px 16px',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          Sign In
        </button>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px 60px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '52px 0 36px' }}>
          <div style={{
            display: 'inline-block',
            background: '#e6f5f2',
            color: '#065f52',
            border: '1px solid #99e6d8',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 14px',
            marginBottom: 20,
            letterSpacing: '0.3px',
          }}>
            Free for caregivers
          </div>

          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#0f1f3d',
            lineHeight: 1.25,
            letterSpacing: '-0.5px',
            marginBottom: 16,
          }}>
            Real-time AI support<br />during the hardest moments
          </h1>

          <p style={{
            fontSize: 16,
            color: '#475569',
            lineHeight: 1.7,
            marginBottom: 32,
            maxWidth: 460,
            margin: '0 auto 32px',
          }}>
            Describe a meltdown or crisis as it's happening. Get immediate, personalized strategies — tailored to your loved one's triggers, communication style, and what actually works for them.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280, margin: '0 auto' }}>
            <button
              onClick={() => navigate('login')}
              style={{
                background: 'linear-gradient(135deg, #0a9c85, #087a65)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 16px rgba(10,156,133,0.35)',
                letterSpacing: '-0.1px',
              }}
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('login')}
              style={{
                background: 'white',
                color: '#334155',
                border: '1.5px solid #e2e8f0',
                borderRadius: 12,
                padding: '13px 28px',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              I already have an account
            </button>
          </div>
        </div>

        {/* Conditions */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
            Built for families navigating
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {['Autism Spectrum Disorder', 'Dup15q Syndrome', 'Rett Syndrome', 'Cerebral Palsy', 'Angelman Syndrome', 'Tuberous Sclerosis', 'ADHD & co-occurring conditions', 'and more'].map(label => (
              <span key={label} style={{
                fontSize: 12, fontWeight: 500,
                padding: '5px 12px', borderRadius: 20,
                background: 'white', color: '#334155',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(15,31,61,0.05)',
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: '28px 24px',
          marginBottom: 20,
          boxShadow: '0 4px 16px rgba(15,31,61,0.06)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: 20 }}>
            How it works
          </div>
          {[
            {
              num: '1',
              title: 'Build a profile once',
              desc: "Enter your loved one's triggers, calming tools, favorite comfort items, medical notes, and trusted people. The AI uses this every single time.",
            },
            {
              num: '2',
              title: 'Describe what\'s happening',
              desc: "Type out the situation in plain language — \"she dropped to the floor covering her ears and won't respond.\" No special format needed.",
            },
            {
              num: '3',
              title: 'Get personalized steps',
              desc: 'Receive immediate, numbered actions that reference your loved one by name and use the specific tools and people you said work for them.',
            },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, marginBottom: i < 2 ? 22 : 0,
              paddingBottom: i < 2 ? 22 : 0,
              borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #0f1f3d, #1a3260)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                boxShadow: '0 2px 8px rgba(15,31,61,0.2)',
              }}>
                {step.num}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1f3d', marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI learns over time */}
        <div style={{
          background: 'linear-gradient(135deg, #e6f5f2 0%, #f0fbf9 100%)',
          border: '1px solid rgba(10,156,133,0.2)',
          borderLeft: '3px solid #0a9c85',
          borderRadius: 12,
          padding: '18px 20px',
          marginBottom: 20,
        }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#065f52', marginBottom: 5 }}>
            The AI gets smarter with every session
          </div>
          <div style={{ fontSize: 13, color: '#0a7a68', lineHeight: 1.6 }}>
            After each interaction, you rate what worked. NeuroGrow learns your loved one's patterns over time and builds those insights directly into future responses.
          </div>
        </div>

        {/* Privacy */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          marginBottom: 32,
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>🔒</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1f3d', marginBottom: 4 }}>Your data is private</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
              Profile information is tied to your account and never shared or used to train AI models. It exists only to help you get better support.
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('login')}
            style={{
              background: 'linear-gradient(135deg, #0a9c85, #087a65)',
              color: 'white', border: 'none',
              borderRadius: 12, padding: '14px 40px',
              fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 16px rgba(10,156,133,0.35)',
            }}
          >
            Get Started Free
          </button>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
            Free to use · No credit card required
          </div>
        </div>
      </div>
    </div>
  );
}
