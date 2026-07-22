import React, { useState, useEffect } from 'react';

const DEMOS = [
  {
    label: 'Dup15q Syndrome',
    priority: 'high',
    priorityLabel: 'High Priority',
    priorityColors: { bg: '#fff1f2', color: '#be123c', border: '#fecdd3', dot: '#e11d48' },
    situation: '"She dropped to the floor in the grocery store covering her ears and won\'t respond."',
    actions: [
      'Leave the cart and move Audrey to the entrance immediately — the PA is still active.',
      'Offer Ellie the elephant as soon as you reach the quieter space.',
      'Kneel beside her at floor level — steady presence, no talking yet.',
    ],
    note: 'You\'re doing the right thing by leaving the cart. Getting her out of the noise is the only priority right now.',
  },
  {
    label: 'Autism Spectrum Disorder',
    priority: 'medium',
    priorityLabel: 'Medium Priority',
    priorityColors: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe', dot: '#2563eb' },
    situation: '"He\'s been refusing to leave the tablet for 15 minutes and is starting to escalate."',
    actions: [
      'Set the visual timer for 5 minutes — show it to Liam, don\'t just announce it.',
      'Let him choose which chair he sits in at dinner — restores a sense of control.',
      'Start with mac and cheese before introducing anything else on the plate.',
    ],
    note: 'This is a routine disruption, not defiance. The choice strategy works well for Liam — let him feel some agency.',
  },
  {
    label: 'Rett Syndrome',
    priority: 'medium-high',
    priorityLabel: 'Medium-High',
    priorityColors: { bg: '#fffbeb', color: '#92400e', border: '#fde68a', dot: '#d97706' },
    situation: '"Sophie has been hand-wringing for 20 minutes and won\'t make eye contact."',
    actions: [
      'Move her away from foot traffic to a quiet corner — reduce the sensory input first.',
      'Put on her headphones with the ocean sounds playlist immediately.',
      'Apply gentle firm hand pressure — she responds well to proprioceptive input.',
    ],
    note: 'Sensory overload from the mall crowd. Removing her from the input is more important than any comfort strategy right now.',
  },
];

export default function Landing({ navigate }) {
  const [demoIdx, setDemoIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setDemoIdx(i => (i + 1) % DEMOS.length);
      setAnimKey(k => k + 1);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const handleTab = (i) => {
    setDemoIdx(i);
    setAnimKey(k => k + 1);
  };

  const demo = DEMOS[demoIdx];
  const pc = demo.priorityColors;

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════
          DARK HERO SECTION
      ══════════════════════════════════════ */}
      <div style={{
        minHeight: '100vh',
        background: '#07091a',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Animated background orbs */}
        <div className="orb orb-teal" />
        <div className="orb orb-purple" />
        <div className="orb orb-indigo" />

        {/* Subtle dot-grid overlay */}
        <div className="hero-grid" />

        {/* ── NAV ── */}
        <div style={{
          position: 'relative', zIndex: 20,
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #00d4b4 0%, #009e8a 100%)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#041a14', fontWeight: 800, fontSize: 15,
              boxShadow: '0 0 22px rgba(0,212,180,0.65)',
            }}>N</div>
            <span style={{
              color: 'white', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px',
            }}>NeuroGrow</span>
          </div>

          <button
            onClick={() => navigate('login')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: 'rgba(255,255,255,0.7)',
              fontSize: 13, fontWeight: 500, padding: '7px 18px',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
        </div>

        {/* ── HERO CONTENT ── */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px 80px',
          position: 'relative', zIndex: 10,
        }}>

          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,212,180,0.07)',
            border: '1px solid rgba(0,212,180,0.18)',
            borderRadius: 20, padding: '5px 16px',
            marginBottom: 32,
          }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#00d4b4', letterSpacing: '0.2px' }}>
              Free for caregivers
            </span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="hero-headline">
            NeuroGrow
          </h1>

          <div style={{ marginBottom: 30, marginTop: 4 }}>
            <p style={{
              fontSize: 22, fontWeight: 400,
              color: 'rgba(255,255,255,0.38)',
              letterSpacing: '-0.2px', lineHeight: 1.4,
              margin: '0 0 4px',
            }}>
              Real-time AI support
            </p>
            <p style={{
              fontSize: 22, fontWeight: 600,
              color: 'rgba(255,255,255,0.72)',
              letterSpacing: '-0.3px', lineHeight: 1.4,
              margin: 0,
            }}>
              during the hardest moments.
            </p>
          </div>

          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.8,
            marginBottom: 40,
            maxWidth: 380,
            margin: '0 auto 40px',
          }}>
            Describe what's happening during a crisis. Get immediate, step-by-step guidance
            built around your loved one — not a generic checklist.
          </p>

          {/* CTA BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
            <button
              onClick={() => navigate('login')}
              className="hero-cta-primary"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('login')}
              className="hero-cta-ghost"
            >
              I already have an account
            </button>
          </div>

          {/* Condition pills */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 7,
            justifyContent: 'center', marginTop: 44, maxWidth: 440,
          }}>
            {['Autism', 'Dup15q', 'Rett Syndrome', 'Cerebral Palsy', 'Angelman', 'Tuberous Sclerosis', '& more'].map(l => (
              <span key={l} style={{
                fontSize: 11, fontWeight: 500, letterSpacing: '0.1px',
                padding: '4px 13px', borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: 22,
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          animation: 'bounce-y 2.2s ease-in-out infinite',
          opacity: 0.25, zIndex: 10, cursor: 'default',
        }}>
          <span style={{ fontSize: 9, color: 'white', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>scroll</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════
          LIGHT CONTENT SECTION
      ══════════════════════════════════════ */}
      <div style={{ background: '#f4f6f9' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 20px 64px' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '1.3px', color: '#94a3b8', marginBottom: 6,
            }}>See it in action</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0f1f3d', letterSpacing: '-0.2px' }}>
              Personalized for every condition
            </div>
          </div>

          {/* ── INTERACTIVE DEMO CARD ── */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 8px 48px rgba(15,31,61,0.10)',
            marginBottom: 20,
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              background: '#f8fafc',
              borderBottom: '1px solid #f1f5f9',
              padding: '10px 16px 0',
              gap: 2,
              overflowX: 'auto',
            }}>
              {DEMOS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => handleTab(i)}
                  style={{
                    padding: '7px 14px',
                    border: 'none',
                    background: demoIdx === i ? 'white' : 'transparent',
                    color: demoIdx === i ? '#0f1f3d' : '#94a3b8',
                    fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '8px 8px 0 0',
                    borderBottom: demoIdx === i ? '2px solid #0a9c85' : '2px solid transparent',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Demo body */}
            <div style={{ padding: '20px 20px 22px' }} key={animKey}>

              {/* Situation field */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '11px 14px',
                marginBottom: 14,
                fontSize: 13,
                color: '#64748b',
                fontStyle: 'italic',
                lineHeight: 1.6,
                animation: 'fade-slide-up 0.3s ease',
              }}>
                {demo.situation}
              </div>

              {/* Priority badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 11px', borderRadius: 20,
                background: pc.bg, color: pc.color,
                border: `1px solid ${pc.border}`,
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.8px', marginBottom: 14,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: pc.dot, flexShrink: 0 }} />
                {demo.priorityLabel}
              </div>

              {/* Action steps */}
              {demo.actions.map((step, i) => (
                <div
                  key={`${animKey}-${i}`}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 13px', marginBottom: 7,
                    background: '#f8fafc', borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    fontSize: 13, color: '#334155', lineHeight: 1.6,
                    animation: 'fade-slide-up 0.35s ease both',
                    animationDelay: `${i * 70}ms`,
                  }}
                >
                  <div style={{
                    minWidth: 23, height: 23, flexShrink: 0,
                    background: 'linear-gradient(135deg, #0a9c85, #087a65)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 10, fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(10,156,133,0.35)',
                  }}>{i + 1}</div>
                  {step}
                </div>
              ))}

              {/* Caregiver note */}
              <div style={{
                marginTop: 12, padding: '11px 14px',
                background: 'linear-gradient(135deg, #e6f5f2, #f0fbf9)',
                borderLeft: '3px solid #0a9c85', borderRadius: 8,
                fontSize: 12.5, color: '#065f52', fontStyle: 'italic', lineHeight: 1.65,
                animation: 'fade-slide-up 0.4s ease both',
                animationDelay: '200ms',
              }}>
                {demo.note}
              </div>

              {/* Dot pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 18 }}>
                {DEMOS.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => handleTab(i)}
                    style={{
                      width: i === demoIdx ? 20 : 6,
                      height: 6, borderRadius: 3,
                      background: i === demoIdx ? '#0a9c85' : '#e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* How it works */}
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '28px 24px', marginBottom: 16,
            boxShadow: '0 4px 20px rgba(15,31,61,0.06)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: 20 }}>
              How it works
            </div>
            {[
              { num: '1', title: 'Build a profile once', desc: "Enter your loved one's triggers, calming tools, favorite items, medical notes, and trusted people. The AI uses this every single time." },
              { num: '2', title: 'Describe what\'s happening', desc: 'Type the situation in plain language — "she dropped to the floor covering her ears." No special format needed.' },
              { num: '3', title: 'Get personalized steps', desc: 'Receive immediate, numbered actions that reference your loved one by name and use the specific items and people that work for them.' },
            ].map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16,
                marginBottom: i < 2 ? 22 : 0,
                paddingBottom: i < 2 ? 22 : 0,
                borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #0f1f3d, #1e3a5f)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  boxShadow: '0 3px 10px rgba(15,31,61,0.2)',
                }}>{step.num}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1f3d', marginBottom: 5 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Learning banner */}
          <div style={{
            background: 'linear-gradient(135deg, #e6f5f2, #f0fbf9)',
            border: '1px solid rgba(10,156,133,0.2)',
            borderLeft: '3px solid #0a9c85',
            borderRadius: 12, padding: '18px 20px', marginBottom: 16,
          }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#065f52', marginBottom: 5 }}>
              The AI gets smarter with every session
            </div>
            <div style={{ fontSize: 13, color: '#0a7a68', lineHeight: 1.65 }}>
              After each interaction, you rate what worked. NeuroGrow learns your loved one's patterns and builds those insights directly into every future response.
            </div>
          </div>

          {/* Privacy */}
          <div style={{
            background: 'white', borderRadius: 12,
            border: '1px solid #e2e8f0',
            padding: '18px 20px', marginBottom: 36,
            display: 'flex', gap: 14, alignItems: 'flex-start',
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
                color: 'white', border: 'none', borderRadius: 12,
                padding: '15px 44px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 24px rgba(10,156,133,0.38)',
                letterSpacing: '-0.1px',
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
    </div>
  );
}
