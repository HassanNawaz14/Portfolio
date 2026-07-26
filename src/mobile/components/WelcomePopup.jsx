import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sitemap } from '../../content/sitemap.js'
import { announcements } from '../../content/announcements.js'

const LS_KEY = 'portfolio_welcome_last_shown'
const SS_KEY = 'portfolio_welcome_greeting'
const ONE_DAY_MS = 86400000

const staticGreeting = "Welcome to Hassan Nawaz's portfolio — where data science meets creative engineering. This space is built with AI at its core, featuring a smart chat assistant that knows every project, skill, and page. Feel free to explore, ask questions, and see how modern web technologies come together to create something unique."

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
          className="mwelcome-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(5, 4, 10, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0',
          }}
        >
          <motion.div
            className="mwelcome-modal"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(13, 11, 33, 0.95)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(138, 92, 255, 0.24)',
              borderBottom: 'none',
              borderRadius: '20px 20px 0 0',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '28px 20px',
              paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              position: 'relative',
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(138, 92, 255, 0.2)',
                background: 'rgba(255,255,255,0.04)',
                color: '#a1a1c2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
              aria-label="Close welcome popup"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#37d8ff',
                    boxShadow: '0 0 8px rgba(55, 216, 255, 0.6)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.6rem',
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
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#f5f5ff',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                }}
              >
                Hassan Nawaz<span style={{ color: '#37d8ff' }}>'</span>s Portfolio
              </h1>
              <p style={{ color: '#a1a1c2', fontSize: '0.72rem', margin: '3px 0 0', lineHeight: 1.5 }}>
                AI-powered portfolio with a smart assistant — explore, learn, and connect effortlessly.
              </p>
            </div>

            <div style={{
              marginBottom: '20px',
              padding: '18px',
              borderRadius: '14px',
              background: 'rgba(138, 92, 255, 0.06)',
              border: '1px solid rgba(138, 92, 255, 0.18)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.58rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: '#8a5cff',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '0.6rem' }} />
                AI Generated
              </div>
              {loading ? (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ height: '12px', width: '80%', background: 'rgba(138, 92, 255, 0.15)', borderRadius: '8px', marginBottom: '6px', animation: 'mwelcomeShimmer 1.5s infinite' }} />
                  <div style={{ height: '12px', width: '60%', background: 'rgba(138, 92, 255, 0.15)', borderRadius: '8px', animation: 'mwelcomeShimmer 1.5s infinite 0.3s' }} />
                </div>
              ) : (
                <p style={{ color: '#e0e0f0', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, marginBottom: '14px' }}>
                  {greeting || staticGreeting}
                </p>
              )}
              <div style={{ display: 'flex', gap: '6px' }}>
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
                      gap: '3px',
                      padding: '6px 4px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(138, 92, 255, 0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: 'rgba(55, 216, 255, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#37d8ff',
                        fontSize: '0.6rem',
                      }}
                    >
                      <i className={`fa-solid ${f.icon}`} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.6rem', color: '#f5f5ff', lineHeight: 1.1 }}>{f.label}</div>
                    <div style={{ fontSize: '0.52rem', color: '#a1a1c2', lineHeight: 1.2 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {announcements.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8a5cff', marginBottom: '2px', fontWeight: 600 }}>
                  Announcements
                </h3>
                <p style={{ color: '#a1a1c2', fontSize: '0.68rem', margin: '0 0 10px', lineHeight: 1.4 }}>
                  Latest updates on what I'm building, learning, and shipping.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {announcements.map((a) => {
                    const accentMap = { cyan: '#37d8ff', violet: '#8a5cff', pink: '#f056c4', green: '#00ff88' }
                    const accent = accentMap[a.color || 'cyan']
                    return (
                      <div
                        key={a.id}
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: `rgba(55, 216, 255, 0.03)`,
                          border: `1px solid ${accent}22`,
                          borderLeft: `3px solid ${accent}`,
                          fontSize: '0.8rem',
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
                            width: '28px',
                            height: '28px',
                            minWidth: '28px',
                            borderRadius: '7px',
                            background: `${accent}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: accent,
                            fontSize: '0.8rem',
                          }}
                        >
                          <i className={`fa-solid ${a.icon || 'fa-bullhorn'}`} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                            <span style={{ color: accent, fontWeight: 600, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                              {a.date}
                            </span>
                            {a.label && (
                              <span
                                style={{
                                  fontSize: '0.58rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                  padding: '1px 6px',
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
                                gap: '4px',
                                padding: '3px 10px',
                                borderRadius: '99px',
                                background: `${accent}15`,
                                color: accent,
                                border: `1px solid ${accent}30`,
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                marginTop: '6px',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}30`; e.currentTarget.style.borderColor = `${accent}60` }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = `${accent}15`; e.currentTarget.style.borderColor = `${accent}30` }}
                            >
                              Learn more <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.55rem' }} />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8a5cff', marginBottom: '10px', fontWeight: 600 }}>
                Explore
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {sitemap.map((entry) => (
                  <a
                    key={entry.route}
                    href={entry.route}
                    onClick={(e) => {
                      e.preventDefault()
                      handleClose()
                      setTimeout(() => { window.location.href = entry.route }, 100)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '99px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(138, 92, 255, 0.1)',
                      color: '#f5f5ff',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      transition: 'all 0.2s',
                    }}
                  >
                    <i className={`fa-solid ${entry.icon}`} style={{ color: '#37d8ff', fontSize: '0.7rem' }} />
                    {entry.title}
                  </a>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes mwelcomeShimmer {
                0% { opacity: 0.4; }
                50% { opacity: 0.8; }
                100% { opacity: 0.4; }
              }
              .mwelcome-modal::-webkit-scrollbar { width: 4px; }
              .mwelcome-modal::-webkit-scrollbar-track { background: transparent; }
              .mwelcome-modal::-webkit-scrollbar-thumb { background: rgba(138, 92, 255, 0.3); border-radius: 2px; }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}