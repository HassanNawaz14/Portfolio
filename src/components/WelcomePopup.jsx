import { useState, useEffect, useCallback } from 'react'
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
  const [greeting, setGreeting] = useState(cachedGreeting)
  const [loading, setLoading] = useState(!cachedGreeting)

  useEffect(() => {
    if (!visible || greeting) return

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
            background: 'rgba(5, 4, 10, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
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
              background: 'rgba(13, 11, 33, 0.85)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(138, 92, 255, 0.24)',
              borderRadius: '20px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(138, 92, 255, 0.15)',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '32px',
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
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(138, 92, 255, 0.15)'; e.currentTarget.style.color = '#f5f5ff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#a1a1c2' }}
              aria-label="Close welcome popup"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            {/* Greeting section */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#37d8ff',
                  boxShadow: '0 0 10px rgba(55, 216, 255, 0.6)',
                  marginBottom: '12px',
                }}
              />
              {loading ? (
                <div>
                  <div
                    style={{
                      height: '16px',
                      width: '80%',
                      background: 'rgba(138, 92, 255, 0.15)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      animation: 'welcomeShimmer 1.5s infinite',
                    }}
                  />
                  <div
                    style={{
                      height: '16px',
                      width: '60%',
                      background: 'rgba(138, 92, 255, 0.15)',
                      borderRadius: '8px',
                      animation: 'welcomeShimmer 1.5s infinite 0.3s',
                    }}
                  />
                </div>
              ) : (
                <p style={{ color: '#f5f5ff', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                  {greeting}
                </p>
              )}
            </div>

            {/* Site index */}
            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: '#8a5cff',
                  marginBottom: '14px',
                  fontWeight: 600,
                }}
              >
                Explore
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sitemap.map((entry) => (
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
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(138, 92, 255, 0.1)',
                      color: '#f5f5ff',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      fontSize: '0.88rem',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(138, 92, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.3)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.1)' }}
                  >
                    <i className={`fa-solid ${entry.icon}`} style={{ color: '#37d8ff', width: '20px', textAlign: 'center' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{entry.title}</div>
                      <div style={{ color: '#a1a1c2', fontSize: '0.78rem' }}>
                        {entry.sections.map((s) => s.title).join(' · ')}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Announcements */}
            {announcements.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#8a5cff',
                    marginBottom: '12px',
                    fontWeight: 600,
                  }}
                >
                  Announcements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'rgba(55, 216, 255, 0.04)',
                        border: '1px solid rgba(55, 216, 255, 0.1)',
                        fontSize: '0.85rem',
                        color: '#f5f5ff',
                      }}
                    >
                      <span style={{ color: '#37d8ff', fontWeight: 600, marginRight: '8px' }}>
                        {a.date}
                      </span>
                      {a.text}
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#37d8ff', marginLeft: '6px', textDecoration: 'underline' }}
                        >
                          Learn more
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <style>{`
              @keyframes welcomeShimmer {
                0% { opacity: 0.4; }
                50% { opacity: 0.8; }
                100% { opacity: 0.4; }
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
