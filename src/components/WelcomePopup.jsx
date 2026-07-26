import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sitemap } from '../content/sitemap.js'
import { announcements } from '../content/announcements.js'

const LS_KEY = 'portfolio_welcome_last_shown'
const SS_KEY = 'portfolio_welcome_greeting'
const ONE_DAY_MS = 86400000

const staticGreeting = "Welcome to Hassan Nawaz's portfolio — where data science meets creative engineering. Feel free to explore!"

function shouldShow() {
  const stored = localStorage.getItem(LS_KEY)
  if (!stored) return true
  const elapsed = Date.now() - parseInt(stored, 10)
  return elapsed > ONE_DAY_MS
}

function getCachedGreeting() {
  try {
    const cached = sessionStorage.getItem(SS_KEY)
    if (!cached) return null
    const { greeting, date } = JSON.parse(cached)
    const today = new Date().toISOString().split('T')[0]
    if (date === today) return greeting
  } catch {
    return null
  }
}

function setCachedGreeting(greeting) {
  try {
    const today = new Date().toISOString().split('T')[0]
    sessionStorage.setItem(SS_KEY, JSON.stringify({ greeting, date: today }))
  } catch {
    // sessionStorage not available
  }
}

export default function WelcomePopup() {
  const [visible, setVisible] = useState(() => shouldShow())
  const cachedGreeting = useState(() => getCachedGreeting())[0]
  const [greeting, setGreeting] = useState(cachedGreeting || null)
  const [loading, setLoading] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!visible || greeting || fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)

    let cancelled = false
    const controller = new AbortController()

    fetch('/api/greeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcements }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const msg = data.greeting || staticGreeting
        setGreeting(msg)
        setCachedGreeting(msg)
      })
      .catch(() => {
        if (!cancelled) setGreeting(staticGreeting)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [visible, greeting])

  const handleClose = useCallback(() => {
    localStorage.setItem(LS_KEY, String(Date.now()))
    setVisible(false)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="welcome-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'radial-gradient(ellipse at 15% 25%, rgba(55, 216, 255, 0.2), transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(138, 92, 255, 0.2), transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(240, 86, 196, 0.05), transparent 70%), rgba(10, 8, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            className="welcome-modal"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(15, 12, 40, 0.82)',
              backdropFilter: 'blur(28px) saturate(200%)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%)',
              border: '1px solid rgba(138, 92, 255, 0.2)',
              borderRadius: '20px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 80px rgba(138, 92, 255, 0.15), 0 0 150px rgba(55, 216, 255, 0.08)',
              width: '100%',
              maxWidth: '100vw',
              height: '100%',
              maxHeight: '100vh',
              overflow: 'hidden',
              padding: '40px 48px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(138, 92, 255, 0.2)',
                background: 'rgba(255,255,255,0.04)',
                color: '#a1a1c2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(138, 92, 255, 0.15)'; e.currentTarget.style.color = '#f5f5ff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#a1a1c2' }}
              aria-label="Close welcome popup"
            >
              <i className="fa-solid fa-xmark" />
            </button>

{/* Main row: Left (Heading + Announcements) | Right (Greeting card) */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
                flex: 1,
                minHeight: 0,
                marginBottom: '20px',
              }}
            >
              {/* Left column: Heading + Announcements */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '28px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#37d8ff',
                        boxShadow: '0 0 10px rgba(55, 216, 255, 0.6)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25em',
                        color: '#8a5cff',
                        fontWeight: 700,
                      }}
                    >
                      Welcome
                    </span>
                  </div>
                  <h1
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#f5f5ff',
                      margin: 0,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Hassan Nawaz<span style={{ color: '#37d8ff' }}>'</span>s Portfolio
                  </h1>
                  <p style={{ color: '#a1a1c2', fontSize: '0.82rem', margin: '4px 0 0', lineHeight: 1.6 }}>
                    AI-powered portfolio with a smart assistant — explore, learn, and connect effortlessly.
                  </p>
                </div>

                <h3
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#8a5cff',
                    marginBottom: '2px',
                    fontWeight: 600,
                  }}
                >
                  Announcements
                </h3>
                <p style={{ color: '#a1a1c2', fontSize: '0.72rem', margin: '0 0 14px', lineHeight: 1.5 }}>
                  Latest updates on what I'm building, learning, and shipping.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {announcements.map((a) => {
                    const accentMap = { cyan: '#37d8ff', violet: '#8a5cff', pink: '#f056c4', green: '#00ff88' }
                    const accent = accentMap[a.color || 'cyan']
                    return (
                      <div
                        key={a.id}
                        style={{
                          display: 'flex',
                          gap: '14px',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          background: `rgba(55, 216, 255, 0.03)`,
                          border: `1px solid ${accent}22`,
                          borderLeft: `3px solid ${accent}`,
                          fontSize: '0.85rem',
                          color: '#f5f5ff',
                          transition: 'all 0.2s',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}0d`; e.currentTarget.style.borderColor = `${accent}44` }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(55, 216, 255, 0.03)'; e.currentTarget.style.borderColor = `${accent}22` }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            minWidth: '32px',
                            borderRadius: '8px',
                            background: `${accent}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: accent,
                            fontSize: '0.9rem',
                          }}
                        >
                          <i className={`fa-solid ${a.icon || 'fa-bullhorn'}`} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ color: accent, fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                              {a.date}
                            </span>
                            {a.label && (
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                  padding: '1px 8px',
                                  borderRadius: '99px',
                                  background: `${accent}20`,
                                  color: accent,
                                  border: `1px solid ${accent}30`,
                                }}
                              >
                                {a.label}
                              </span>
                            )}
                          </div>
                          <span style={{ color: '#e0e0f0' }}>{a.text}</span>
                          {a.link && (
                            <a
                              href={a.link}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 12px',
                                borderRadius: '99px',
                                background: `${accent}15`,
                                color: accent,
                                border: `1px solid ${accent}30`,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}30`; e.currentTarget.style.borderColor = `${accent}60` }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = `${accent}15`; e.currentTarget.style.borderColor = `${accent}30` }}
                            >
                              Learn more <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.6rem' }} />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right: Greeting card */}
              <div
                style={{
                  width: '520px',
                  minWidth: '520px',
                  padding: '28px',
                  borderRadius: '16px',
                  background: 'rgba(138, 92, 255, 0.06)',
                  border: '1px solid rgba(138, 92, 255, 0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-60px',
                    right: '-60px',
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(55, 216, 255, 0.08), transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#8a5cff',
                    fontWeight: 700,
                    marginBottom: '14px',
                  }}
                >
                  <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '0.7rem' }} />
                  AI Generated
                </div>
                {loading ? (
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        height: '16px',
                        width: '100%',
                        background: 'rgba(138, 92, 255, 0.15)',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        animation: 'welcomeShimmer 1.5s infinite',
                      }}
                    />
                    <div
                      style={{
                        height: '16px',
                        width: '75%',
                        background: 'rgba(138, 92, 255, 0.15)',
                        borderRadius: '8px',
                        animation: 'welcomeShimmer 1.5s infinite 0.3s',
                      }}
                    />
                  </div>
                ) : (
                  <p style={{ color: '#e0e0f0', fontSize: '1.05rem', lineHeight: 1.9, margin: 0, marginBottom: '20px' }}>
                    {greeting || staticGreeting}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                  {[
                    { icon: 'fa-brain', label: 'AI-Powered', desc: 'Gemini & Grok APIs' },
                    { icon: 'fa-robot', label: 'Assistant', desc: 'Chat knows every page' },
                    { icon: 'fa-bolt', label: 'Modern Stack', desc: 'React + Vite + Motion' },
                  ].map((f) => (
                    <div
                      key={f.label}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 6px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(138, 92, 255, 0.1)',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(138, 92, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.25)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.1)' }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '7px',
                          background: 'rgba(55, 216, 255, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#37d8ff',
                          fontSize: '0.75rem',
                        }}
                      >
                        <i className={`fa-solid ${f.icon}`} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.72rem', color: '#f5f5ff', lineHeight: 1.2 }}>{f.label}</div>
                      <div style={{ fontSize: '0.6rem', color: '#a1a1c2', lineHeight: 1.3 }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Site index — horizontal at bottom */}
            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h3
                  style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#8a5cff',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Explore
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#a1a1c2', margin: 0, lineHeight: 1.5 }}>
                  Jump straight to any section of the portfolio
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                {sitemap.flatMap((entry, i) => {
                    const sectionText = entry.sections.map((s) => s.title).join(' · ')
                    return [
                      <a
                        key={entry.route}
                        href={entry.route}
                        onClick={(e) => {
                          e.preventDefault()
                          window.location.href = entry.route
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(138, 92, 255, 0.1)',
                          color: '#f5f5ff',
                          textDecoration: 'none',
                          transition: 'all 0.25s',
                          fontSize: '0.82rem',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(138, 92, 255, 0.1)'
                          e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.35)'
                          e.currentTarget.style.transform = 'translateY(-3px)'
                          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)'
                          const tip = e.currentTarget.querySelector('.explore-tooltip')
                          if (tip) { tip.style.opacity = '1'; tip.style.transform = 'translateY(0)' }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                          e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.1)'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                          const tip = e.currentTarget.querySelector('.explore-tooltip')
                          if (tip) { tip.style.opacity = '0'; tip.style.transform = 'translateY(6px)' }
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            minWidth: '32px',
                            borderRadius: '8px',
                            background: 'rgba(55, 216, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#37d8ff',
                            fontSize: '0.85rem',
                            transition: 'all 0.25s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(55, 216, 255, 0.2)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(55, 216, 255, 0.1)' }}
                        >
                          <i className={`fa-solid ${entry.icon}`} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{entry.title}</span>

                        <div
                          className="explore-tooltip"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            left: '50%',
                            transform: 'translateX(-50%) translateY(6px)',
                            background: 'rgba(20, 18, 50, 0.95)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(138, 92, 255, 0.2)',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.68rem',
                            color: '#a1a1c2',
                            whiteSpace: 'nowrap',
                            opacity: 0,
                            transition: 'all 0.2s',
                            pointerEvents: 'none',
                            zIndex: 10,
                          }}
                        >
                          {sectionText}
                        </div>
                      </a>,
                      i < sitemap.length - 1 && (
                        <div
                          key={`sep-${entry.route}`}
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: '#37d8ff',
                            boxShadow: '0 0 8px rgba(55, 216, 255, 0.6)',
                            alignSelf: 'center',
                            animation: 'sepPulse 2s ease-in-out infinite',
                          }}
                        />
                      ),
                    ]
                  })}
              </div>
            </div>

            <style>{`
              @keyframes welcomeShimmer {
                0% { opacity: 0.4; }
                50% { opacity: 0.8; }
                100% { opacity: 0.4; }
              }
              @keyframes sepPulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.5); }
              }
              .welcome-modal::-webkit-scrollbar { width: 4px; }
              .welcome-modal::-webkit-scrollbar-track { background: transparent; }
              .welcome-modal::-webkit-scrollbar-thumb { background: rgba(138, 92, 255, 0.3); border-radius: 2px; }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}