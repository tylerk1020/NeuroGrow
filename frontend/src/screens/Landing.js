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
    label: 'Autism Spectrum',
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

// Scroll-reveal via IntersectionObserver — no scroll jacking, just a clean fade-in
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -28px 0px' }
    );
    const t = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 60);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);
}

// Numbered section label — eidola-style "01 — PROFILE"
function SectionLabel({ num, text }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '2px', color: '#0a9c85', marginBottom: 14,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ color: 'rgba(10,156,133,0.35)', fontVariantNumeric: 'tabular-nums' }}>{num}</span>
      <span style={{ width: 20, height: 1, background: 'rgba(10,156,133,0.4)', flexShrink: 0 }} />
      <span>{text}</span>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontSize: 'clamp(22px, 5.5vw, 30px)', fontWeight: 700,
      color: '#0f1f3d', letterSpacing: '-0.5px',
      marginBottom: 12, lineHeight: 1.2,
      fontFamily: 'Lora, Georgia, serif',
    }}>
      {children}
    </h2>
  );
}

function SectionBody({ children }) {
  return (
    <p style={{
      fontSize: 14, color: '#64748b', lineHeight: 1.8,
      marginBottom: 24, maxWidth: 480,
    }}>
      {children}
    </p>
  );
}

export default function Landing({ navigate }) {
  const [demoIdx, setDemoIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useReveal();

  useEffect(() => {
    const t = setInterval(() => {
      setDemoIdx(i => (i + 1) % DEMOS.length);
      setAnimKey(k => k + 1);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const handleTab = (i) => { setDemoIdx(i); setAnimKey(k => k + 1); };
  const demo = DEMOS[demoIdx];
  const pc = demo.priorityColors;

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════
          DARK HERO
      ══════════════════════════════════════ */}
      <div style={{
        minHeight: '100vh', background: '#07091a',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div className="orb orb-teal" />
        <div className="orb orb-purple" />
        <div className="orb orb-indigo" />
        <div className="hero-grid" />

        {/* NAV */}
        <nav style={{
          position: 'relative', zIndex: 20,
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#0a9c85"/>
              <path d="M15 9H12.5C9.5 9 7.5 11.5 7.5 16C7.5 20.5 9.5 23 12.5 23H15V9Z" fill="white" opacity="0.93"/>
              <path d="M17 9H19.5C22.5 9 24.5 11.5 24.5 16C24.5 20.5 22.5 23 19.5 23H17V9Z" fill="white" opacity="0.93"/>
              <rect x="14.5" y="23" width="3" height="2.5" rx="1.2" fill="white" opacity="0.7"/>
            </svg>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
              NeuroVero
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button onClick={() => scrollTo('how-it-works')} className="landing-nav-link">How it works</button>
            <button onClick={() => scrollTo('manifesto')} className="landing-nav-link">Manifesto</button>
            <a href="mailto:tylerkim1020@gmail.com" className="landing-nav-link" style={{ textDecoration: 'none' }}>Contact</a>
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

        {/* HERO CONTENT */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px 80px',
          position: 'relative', zIndex: 10,
        }}>
          <div className="hero-badge-anim" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,212,180,0.07)',
            border: '1px solid rgba(0,212,180,0.18)',
            borderRadius: 20, padding: '5px 16px', marginBottom: 32,
          }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#00d4b4', letterSpacing: '0.2px' }}>
              Free for caregivers
            </span>
          </div>

          <h1 className="hero-headline hero-headline-anim">NeuroVero</h1>

          <div className="hero-sub-anim" style={{ marginBottom: 30, marginTop: 4 }}>
            <p style={{
              fontSize: 22, fontWeight: 400,
              color: 'rgba(255,255,255,0.38)',
              letterSpacing: '-0.2px', lineHeight: 1.4, margin: '0 0 4px',
            }}>Real-time AI support</p>
            <p style={{
              fontSize: 22, fontWeight: 600,
              color: 'rgba(255,255,255,0.72)',
              letterSpacing: '-0.3px', lineHeight: 1.4, margin: 0,
            }}>during the hardest moments.</p>
          </div>

          <p className="hero-desc-anim" style={{
            fontSize: 15, color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.8, maxWidth: 380, margin: '0 auto 40px',
          }}>
            Describe what's happening during a crisis. Get immediate, step-by-step guidance
            built around your loved one — not a generic checklist.
          </p>

          <div className="hero-cta-anim" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
            <button onClick={() => navigate('login')} className="hero-cta-primary">
              Get Started Free
            </button>
            <button onClick={() => navigate('login')} className="hero-cta-ghost">
              I already have an account
            </button>
          </div>

          <div className="hero-pills-anim" style={{
            display: 'flex', flexWrap: 'wrap', gap: 7,
            justifyContent: 'center', marginTop: 44, maxWidth: 440,
          }}>
            {['Autism', 'Dup15q', 'Rett Syndrome', 'Cerebral Palsy', 'Angelman', 'Tuberous Sclerosis', '& more'].map(l => (
              <span key={l} style={{
                fontSize: 11, fontWeight: 500,
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
          position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          animation: 'bounce-y 2.2s ease-in-out infinite',
          opacity: 0.25, zIndex: 10,
        }}>
          <span style={{ fontSize: 9, color: 'white', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>scroll</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PROBLEM STATEMENT BRIDGE (dark)
      ══════════════════════════════════════ */}
      <div style={{
        background: '#07091a', padding: '72px 24px 80px',
        textAlign: 'center', position: 'relative',
      }}>
        {/* connecting line from hero */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 1, height: 48,
          background: 'linear-gradient(to bottom, rgba(0,212,180,0.25), transparent)',
        }} />

        <div className="reveal" style={{ maxWidth: 540, margin: '0 auto' }}>
          <p style={{
            fontSize: 'clamp(20px, 4.5vw, 27px)', fontWeight: 600,
            fontFamily: 'Lora, Georgia, serif',
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.55, letterSpacing: '-0.3px',
            marginBottom: 20,
          }}>
            "In the hardest moments,<br/>you shouldn't have to guess."
          </p>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.3)',
            lineHeight: 1.75, maxWidth: 360, margin: '0 auto',
          }}>
            Every caregiver carries years of knowledge about their person.
            NeuroVero turns that knowledge into immediate, specific action.
          </p>
        </div>

        {/* transition line to light section */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 1, height: 48,
          background: 'linear-gradient(to bottom, transparent, rgba(0,212,180,0.18))',
        }} />
      </div>

      {/* ══════════════════════════════════════
          LIGHT CONTENT SECTION
      ══════════════════════════════════════ */}
      <div style={{ background: '#f4f6f9' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '64px 20px 80px' }}>

          {/* ─────────────────────────────────────
              01 / PROFILE
          ───────────────────────────────────── */}
          <div id="how-it-works" className="reveal" style={{ marginBottom: 60, scrollMarginTop: '20px' }}>
            <SectionLabel num="01" text="Profile" />
            <SectionHeading>Build a profile once.</SectionHeading>
            <SectionBody>
              Enter your loved one's triggers, calming strategies, favorite items, trusted people, and medical context.
              The AI uses all of this every single time — no repeating yourself.
            </SectionBody>

            {/* Profile mockup */}
            <div style={{
              background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
              overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,31,61,0.08)',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0a1628, #0f2040)',
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d4b4, #009e8a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#041a14', fontWeight: 800, fontSize: 15,
                  boxShadow: '0 0 16px rgba(0,212,180,0.45)',
                }}>A</div>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>Audrey's Profile</div>
                  <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 1 }}>Dup15q Syndrome</div>
                </div>
                <div style={{
                  marginLeft: 'auto', padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(0,212,180,0.1)', border: '1px solid rgba(0,212,180,0.2)',
                  fontSize: 10, fontWeight: 600, color: '#00d4b4', letterSpacing: '0.5px',
                }}>ACTIVE</div>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  { label: 'Calming tools', value: 'Ellie the elephant, weighted blanket, ocean sounds playlist' },
                  { label: 'Known triggers', value: 'Loud sudden noises, schedule changes, crowded spaces' },
                  { label: 'What works', value: 'Floor-level presence, no talking, reduce visual input first' },
                ].map(f => (
                  <div key={f.label} style={{
                    padding: '10px 14px', background: '#f8fafc',
                    borderRadius: 10, border: '1px solid #e2e8f0',
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 3,
                    }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────
              02 / DESCRIBE
          ───────────────────────────────────── */}
          <div className="reveal" style={{ marginBottom: 60, transitionDelay: '0.08s' }}>
            <SectionLabel num="02" text="Describe" />
            <SectionHeading>Tell us what's happening.</SectionHeading>
            <SectionBody>
              Type the situation in plain language — no special format needed.
              The more specific you are, the better the guidance.
            </SectionBody>

            {/* Describe mockup */}
            <div style={{
              background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
              overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,31,61,0.08)',
              padding: '20px 20px 18px',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 8,
              }}>Describe the situation</div>
              <div style={{
                background: '#f8fafc', border: '1.5px solid #0a9c85',
                borderRadius: 10, padding: '12px 14px',
                fontSize: 13, color: '#334155', lineHeight: 1.7,
                boxShadow: '0 0 0 3px rgba(10,156,133,0.08)',
                marginBottom: 18,
              }}>
                She dropped to the floor in the grocery store covering her ears and won't respond to me.
              </div>

              <div style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.8px', color: '#94a3b8', marginBottom: 8,
              }}>How severe is this?</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[
                  { label: 'Low', desc: 'Early signs', color: '#0a9c85', bg: '#e6f5f2', border: '#0a9c85', active: false },
                  { label: 'Medium', desc: 'Escalating', color: '#d97706', bg: '#fffbeb', border: '#d97706', active: false },
                  { label: 'High', desc: 'Crisis', color: '#e11d48', bg: '#fff1f2', border: '#e11d48', active: true },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '12px 8px', borderRadius: 12, textAlign: 'center',
                    background: s.active ? s.bg : 'white',
                    border: `2px solid ${s.active ? s.border : '#e2e8f0'}`,
                    transform: s.active ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.18s',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: s.active ? s.color : '#e2e8f0',
                      margin: '0 auto 7px',
                      boxShadow: s.active ? `0 0 8px ${s.color}80` : 'none',
                    }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: s.active ? s.color : '#334155' }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: s.active ? s.color : '#94a3b8', marginTop: 2, opacity: 0.85 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────
              03 / ACT (+ interactive demo)
          ───────────────────────────────────── */}
          <div className="reveal" style={{ marginBottom: 40, transitionDelay: '0.16s' }}>
            <SectionLabel num="03" text="Act" />
            <SectionHeading>Get personalized steps.</SectionHeading>
            <SectionBody>
              Receive immediate, numbered actions that reference your loved one by name and use the specific
              tools and strategies that work for them — not a generic protocol.
            </SectionBody>

            {/* Demo subheader */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '1.3px', color: '#94a3b8', marginBottom: 4,
              }}>Live preview</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Personalized for every condition</div>
            </div>

            {/* INTERACTIVE DEMO CARD */}
            <div style={{
              background: 'white', borderRadius: 20,
              border: '1px solid #e2e8f0', overflow: 'hidden',
              boxShadow: '0 8px 48px rgba(15,31,61,0.10)',
            }}>
              {/* Tabs */}
              <div style={{
                display: 'flex', background: '#f8fafc',
                borderBottom: '1px solid #f1f5f9',
                padding: '10px 16px 0', gap: 2, overflowX: 'auto',
              }}>
                {DEMOS.map((d, i) => (
                  <button key={i} onClick={() => handleTab(i)} style={{
                    padding: '7px 14px', border: 'none',
                    background: demoIdx === i ? 'white' : 'transparent',
                    color: demoIdx === i ? '#0f1f3d' : '#94a3b8',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '8px 8px 0 0',
                    borderBottom: demoIdx === i ? '2px solid #0a9c85' : '2px solid transparent',
                    whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0,
                  }}>{d.label}</button>
                ))}
              </div>

              {/* Demo body */}
              <div style={{ padding: '20px 20px 22px' }} key={animKey}>
                <div style={{
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: 10, padding: '11px 14px', marginBottom: 14,
                  fontSize: 13, color: '#64748b', fontStyle: 'italic', lineHeight: 1.6,
                  animation: 'fade-slide-up 0.3s ease',
                }}>{demo.situation}</div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 11px', borderRadius: 20,
                  background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`,
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.8px', marginBottom: 14,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: pc.dot, flexShrink: 0 }} />
                  {demo.priorityLabel}
                </div>

                {demo.actions.map((step, i) => (
                  <div key={`${animKey}-${i}`} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 13px', marginBottom: 7,
                    background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0',
                    fontSize: 13, color: '#334155', lineHeight: 1.6,
                    animation: 'fade-slide-up 0.35s ease both',
                    animationDelay: `${i * 70}ms`,
                  }}>
                    <div style={{
                      minWidth: 23, height: 23, flexShrink: 0,
                      background: 'linear-gradient(135deg, #0a9c85, #087a65)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 10, fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(10,156,133,0.35)',
                    }}>{i + 1}</div>
                    {step}
                  </div>
                ))}

                <div style={{
                  marginTop: 12, padding: '11px 14px',
                  background: 'linear-gradient(135deg, #e6f5f2, #f0fbf9)',
                  borderLeft: '3px solid #0a9c85', borderRadius: 8,
                  fontSize: 12.5, color: '#065f52', fontStyle: 'italic', lineHeight: 1.65,
                  animation: 'fade-slide-up 0.4s ease both', animationDelay: '200ms',
                }}>{demo.note}</div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 18 }}>
                  {DEMOS.map((_, i) => (
                    <div key={i} onClick={() => handleTab(i)} style={{
                      width: i === demoIdx ? 20 : 6, height: 6, borderRadius: 3,
                      background: i === demoIdx ? '#0a9c85' : '#e2e8f0',
                      cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────
              SUPPORTING INFO
          ───────────────────────────────────── */}
          <div className="reveal" style={{ marginBottom: 16, transitionDelay: '0.1s' }}>
            <div style={{
              background: 'linear-gradient(135deg, #e6f5f2, #f0fbf9)',
              border: '1px solid rgba(10,156,133,0.2)',
              borderLeft: '3px solid #0a9c85',
              borderRadius: 12, padding: '18px 20px', marginBottom: 10,
            }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#065f52', marginBottom: 5 }}>
                The AI learns with every session
              </div>
              <div style={{ fontSize: 13, color: '#0a7a68', lineHeight: 1.65 }}>
                After each interaction, you rate what worked. NeuroVero builds those insights directly into every future response.
              </div>
            </div>

            <div style={{
              background: 'white', borderRadius: 12, border: '1px solid #e2e8f0',
              padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{ flexShrink: 0, marginTop: 1 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a9c85" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1f3d', marginBottom: 4 }}>
                  Your data is private
                </div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                  Profile information is tied to your account only — never shared or used to train AI models.
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────
              MANIFESTO
          ───────────────────────────────────── */}
          <div
            id="manifesto"
            className="reveal"
            style={{ marginTop: 32, marginBottom: 40, scrollMarginTop: '20px', transitionDelay: '0.08s' }}
          >
            <div style={{
              background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
              padding: '40px 32px',
              boxShadow: '0 4px 20px rgba(15,31,61,0.06)',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '2px', color: '#0a9c85', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ color: 'rgba(10,156,133,0.35)' }}>—</span>
                <span>Manifesto</span>
              </div>
              <h2 style={{
                fontSize: 26, fontWeight: 700, color: '#0f1f3d',
                letterSpacing: '-0.5px', marginBottom: 28, lineHeight: 1.25,
                fontFamily: 'Lora, Georgia, serif',
              }}>
                Why NeuroVero exists.
              </h2>
              {/* Tyler — add your manifesto content here */}
              <div style={{
                minHeight: 80, borderTop: '1px dashed #e2e8f0', paddingTop: 24,
                fontFamily: 'Lora, Georgia, serif',
                fontSize: 15, color: '#475569', lineHeight: 1.9,
              }} />
            </div>
          </div>

          {/* ─────────────────────────────────────
              BOTTOM CTA
          ───────────────────────────────────── */}
          <div className="reveal" style={{ textAlign: 'center', transitionDelay: '0.12s' }}>
            <button
              onClick={() => navigate('login')}
              style={{
                background: 'linear-gradient(135deg, #0a9c85, #087a65)',
                color: 'white', border: 'none', borderRadius: 12,
                padding: '15px 48px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 24px rgba(10,156,133,0.38)',
                letterSpacing: '-0.1px', transition: 'all 0.2s',
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

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <div style={{
        background: '#07091a', padding: '36px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 14 }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#0a9c85"/>
            <path d="M15 9H12.5C9.5 9 7.5 11.5 7.5 16C7.5 20.5 9.5 23 12.5 23H15V9Z" fill="white" opacity="0.93"/>
            <path d="M17 9H19.5C22.5 9 24.5 11.5 24.5 16C24.5 20.5 22.5 23 19.5 23H17V9Z" fill="white" opacity="0.93"/>
            <rect x="14.5" y="23" width="3" height="2.5" rx="1.2" fill="white" opacity="0.7"/>
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 600 }}>NeuroVero</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1px' }}>
          Built for caregivers, by caregivers.
        </div>
      </div>

    </div>
  );
}
