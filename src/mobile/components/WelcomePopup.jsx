import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sitemap } from '../../content/sitemap.js'
import { announcements } from '../../content/announcements.js'

const LS_KEY = 'portfolio_welcome_last_shown'
const ONE_DAY_MS = 86400000

const greeting = "Welcome to Hassan Nawaz's portfolio — where data science meets creative engineering. Feel free to explore!"

function shouldShow() {
  const stored = localStorage.getItem(LS_KEY)
  if (!stored) return true
  const elapsed = Date.now() - parseInt(stored, 10)
  return elapsed > ONE_DAY_MS
}

export default function WelcomePopup() {
  const [visible, setVisible] = useState(() => shouldShow())

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
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#37d8ff',
                  boxShadow: '0 0 10px rgba(55, 216, 255, 0.6)',
                  marginBottom: '12px',
                }}
              />
              <p style={{ color: '#f5f5ff', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8a5cff', marginBottom: '12px', fontWeight: 600 }}>
                Explore
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(138, 92, 255, 0.1)',
                      color: '#f5f5ff',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <i className={`fa-solid ${entry.icon}`} style={{ color: '#37d8ff', width: '18px', textAlign: 'center' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{entry.title}</div>
                      <div style={{ color: '#a1a1c2', fontSize: '0.75rem' }}>
                        {entry.sections.map((s) => s.title).join(' · ')}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {announcements.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8a5cff', marginBottom: '10px', fontWeight: 600 }}>
                  Announcements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(55, 216, 255, 0.04)',
                        border: '1px solid rgba(55, 216, 255, 0.1)',
                        fontSize: '0.82rem',
                        color: '#f5f5ff',
                      }}
                    >
                      <span style={{ color: '#37d8ff', fontWeight: 600, marginRight: '6px' }}>{a.date}</span>
                      {a.text}
                      {a.link && (
                        <a href={a.link} target="_blank" rel="noreferrer" style={{ color: '#37d8ff', marginLeft: '4px', textDecoration: 'underline' }}>
                          Learn more
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <style>{`
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
