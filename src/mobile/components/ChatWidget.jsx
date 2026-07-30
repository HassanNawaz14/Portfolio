import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const MAX_SESSION_MSGS = 50
const API_URL = '/api/chat'

const staticFallback = "I'm sorry, I'm having trouble connecting right now. Please try again later."

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [currentSection, setCurrentSection] = useState('')

  const sectionLabels = {
    home: 'my work', about: 'who I am', 'nav-strip': 'where to go',
    skills: 'my toolkit', certifications: 'my credentials', education: 'my journey', experience: 'my career',
    courses: 'my courses', contact: 'how to reach me',
    startup: 'QuickSite', 'currently-building': 'what I\'m building',
    'featured-projects': 'my best work', projects: 'all my projects',
    profiles: 'my network',
  }
  const pageLabels = {
    '/': 'the portfolio', '/quicksite': 'QuickSite',
    '/building': 'Lab Access', '/projects': 'the archives', '/profiles': 'my network',
  }

  const sectionOrder = ['home', 'about', 'nav-strip', 'skills', 'certifications', 'experience', 'education', 'courses', 'contact', 'startup', 'currently-building', 'featured-projects', 'projects', 'profiles']

  useEffect(() => {
    const handleScroll = () => {
      for (const id of sectionOrder) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top >= 0 && rect.top <= window.innerHeight * 0.4) {
            setCurrentSection(id)
            return
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const groupRef = useRef(null)

  useEffect(() => {
    const el = groupRef.current
    if (!el || !currentSection) return

    const m = 16
    const rect = el.getBoundingClientRect()
    const gw = rect.width
    const gh = rect.height
    const vw = window.innerWidth
    const vh = window.innerHeight

    const centerY = vh / 2 - gh / 2
    const upY = vh * 0.25 - gh / 2
    const downY = vh * 0.75 - gh / 2

    const positions = {
      home: { left: m, top: vh * 0.75 - gh / 2 },
      about: { left: vw - gw - m, top: centerY },
      'nav-strip': { left: m, top: upY },
      skills: { left: vw - gw - m, top: upY },
      certifications: { left: vw - gw - m, top: centerY },
      education: { left: vw - gw - m, top: downY },
      experience: { left: m, top: downY },
      courses: { left: vw - gw - m, top: upY },
      contact: { left: vw - gw - m, top: downY },
    }

    const target = positions[currentSection]
    if (target) {
      gsap.to(el, { ...target, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' })
    } else {
      gsap.to(el, { left: m, top: centerY, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' })
    }
  }, [currentSection])

  useEffect(() => {
    const handleResize = () => {
      const el = groupRef.current
      if (!el || !currentSection) return
      const m = 16
      const rect = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const centerY = vh / 2 - rect.height / 2
      const upY = vh * 0.25 - rect.height / 2
      const downY = vh * 0.75 - rect.height / 2
      const positions = {
        home: { left: m, top: vh * 0.75 - rect.height / 2 },
        about: { left: vw - rect.width - m, top: centerY },
        'nav-strip': { left: m, top: upY },
        skills: { left: vw - rect.width - m, top: upY },
        certifications: { left: vw - rect.width - m, top: centerY },
        education: { left: vw - rect.width - m, top: downY },
        experience: { left: m, top: downY },
        courses: { left: vw - rect.width - m, top: upY },
        contact: { left: vw - rect.width - m, top: downY },
      }
      const target = positions[currentSection]
      if (target) gsap.set(el, target)
      else gsap.set(el, { left: m, top: centerY })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentSection])

  const addMsg = useCallback((role, content) => {
    setMessages((prev) => {
      if (prev.length >= MAX_SESSION_MSGS) return prev
      return [...prev, { role, content }]
    })
  }, [])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    addMsg('user', text)
    setBusy(true)

    try {
      const updated = [...messages, { role: 'user', content: text }]
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      const reply = data.reply || staticFallback

      addMsg('assistant', reply)

      if (data.toolCalls?.length) {
        for (const tc of data.toolCalls) {
          if (tc.name === 'navigate_to') {
            addMsg('tool', JSON.stringify({ name: 'navigate_to', args: tc.args }))
          }
        }
      }
    } catch {
      addMsg('assistant', staticFallback)
    } finally {
      setBusy(false)
    }
  }, [input, busy, messages, addMsg])

  const handleNavAction = useCallback((route, anchor) => {
    navigate(route)
    if (anchor) {
      setTimeout(() => {
        const el = document.querySelector(anchor)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
    setOpen(false)
  }, [navigate])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <>
      <div
        ref={groupRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '16px',
          zIndex: 9998,
          transform: 'translateY(-50%)',
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {(() => {
            const rightSide = (() => {
              const el = groupRef.current
              if (el) {
                const left = parseFloat(el.style.left)
                if (!isNaN(left)) return left > window.innerWidth / 2
              }
              return ['about', 'skills', 'certifications', 'courses', 'contact', 'education'].includes(currentSection)
            })()
            return (
              <>
                {!open && (
                  <div
                  style={{
                    position: 'absolute',
                    [rightSide ? 'right' : 'left']: 'calc(100% + 8px)',
                    bottom: 'calc(100% + 3px)',
                    background: '#0d0b21',
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    border: '1px solid rgba(138, 92, 255, 0.25)',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    fontSize: '0.7rem',
                    color: '#a1a1c2',
                    maxWidth: 'calc(100vw - 60px)',
                    userSelect: 'none',
                    cursor: 'default',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    [rightSide ? 'right' : 'left']: '-2px',
                    bottom: '-2px',
                    width: '11px',
                    height: '11px',
                    background: '#0d0b21',
                    borderRight: rightSide ? '1px solid rgba(138, 92, 255, 0.25)' : 'none',
                    borderBottom: '1px solid rgba(138, 92, 255, 0.25)',
                    borderLeft: rightSide ? 'none' : '1px solid rgba(138, 92, 255, 0.25)',
                    transform: 'rotate(0deg)',
                    borderRadius: rightSide ? '0 0 0 3px' : '0 0 3px 0',
                  }} />
                  {`✦ Ask about ${currentSection ? sectionLabels[currentSection] : (pageLabels[location.pathname] || 'anything')}`}
                </div>
              )}
              </>
            )
          })()}
          <button
          className="mchat-fab"
          onClick={() => setOpen((o) => !o)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.7rem 1.2rem',
            background: 'transparent',
            border: 'none',
            borderRadius: '9999px',
            transformOrigin: 'center',
            transform: 'scale(calc(1 + (var(--active, 0) * 0.1)))',
            transition: 'transform 0.3s ease-in-out',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.setProperty('--active', '1') }}
          onMouseLeave={(e) => { e.currentTarget.style.setProperty('--active', '0') }}
          aria-label="Toggle chat assistant"
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            background: '#0d0b21',
            boxShadow: 'inset 0 0.5px hsl(0, 0%, 100%), inset 0 -1px 2px 0 hsl(0, 0%, 0%), 0px 4px 10px -4px hsla(0, 0%, 0%, 1), 0 0 0 calc(var(--active, 0) * 0.375rem) hsl(260, 97%, 50%)',
            transition: 'all 0.3s ease-in-out',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            background: 'hsla(260, 97%, 61%, 0.75)',
            backgroundImage: 'radial-gradient(at 51% 89%, hsla(266, 45%, 74%, 1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(266, 36%, 60%, 1) 0px, transparent 50%), radial-gradient(at 22% 91%, hsla(266, 36%, 60%, 1) 0px, transparent 50%)',
            backgroundPosition: 'top',
            opacity: 'var(--active, 0)',
            transition: 'opacity 0.3s ease-in-out',
            zIndex: 2,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% + 2px)',
            height: 'calc(100% + 2px)',
            overflow: 'hidden',
            borderRadius: '9999px',
            zIndex: -10,
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(0deg)',
              transformOrigin: 'left',
              width: '100%',
              height: '2rem',
              background: '#fff',
              mask: 'linear-gradient(transparent 0%, white 120%)',
              WebkitMask: 'linear-gradient(transparent 0%, white 120%)',
              animation: 'mchatFabRotate 2s linear infinite',
            }} />
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{
            width: '1.3rem',
            position: 'relative',
            zIndex: 10,
            color: '#fff',
          }}>
            <path className="chat-sparkle-path" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="currentColor" d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z" />
            <path className="chat-sparkle-path" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="currentColor" d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z" />
            <path className="chat-sparkle-path" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="currentColor" d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z" />
          </svg>
          <span style={{
            position: 'relative',
            zIndex: 10,
            backgroundImage: 'linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 100%, var(--active, 0)) 120%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            fontSize: '0.8rem',
            color: 'transparent',
            fontWeight: 600,
          }}>
            {open ? 'Close' : 'Chat'}
          </span>
        </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mchat-panel"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: 999999,
              background: 'rgba(13, 11, 33, 0.95)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(138, 92, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#37d8ff',
                  boxShadow: '0 0 8px rgba(55, 216, 255, 0.6)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f5f5ff' }}>
                Portfolio Assistant
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(138, 92, 255, 0.2)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#a1a1c2',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
                aria-label="Close chat"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div
              ref={listRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#a1a1c2',
                    fontSize: '0.85rem',
                    padding: '40px 16px',
                    lineHeight: 1.6,
                  }}
                >
                  <i className="fa-solid fa-robot" style={{ fontSize: '2rem', color: '#8a5cff', marginBottom: '12px', opacity: 0.6 }} />
                  <div>Ask me anything about Hassan's work, skills, or projects!</div>
                </div>
              )}

              {messages.map((msg, i) => {
                if (msg.role === 'tool') {
                  try {
                    const tc = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content
                    if (tc.name === 'navigate_to') {
                      return (
                        <div key={i} style={{ textAlign: 'center', padding: '4px 0' }}>
                          <button
                            onClick={() => handleNavAction(tc.args.route, tc.args.anchor)}
                            style={{
                              background: 'rgba(138, 92, 255, 0.15)',
                              border: '1px solid rgba(138, 92, 255, 0.3)',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              color: '#37d8ff',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                            }}
                          >
                            <i className="fa-solid fa-location-arrow" style={{ marginRight: 6 }} />
                            Take me there
                          </button>
                        </div>
                      )
                    }
                  } catch {
                    // invalid tool call, skip
                  }
                  return null
                }

                const isUser = msg.role === 'user'
                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: isUser
                        ? 'linear-gradient(135deg, rgba(138, 92, 255, 0.3), rgba(55, 216, 255, 0.1))'
                        : 'rgba(255,255,255,0.06)',
                      borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      padding: '10px 14px',
                      color: '#f5f5ff',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      border: `1px solid ${isUser ? 'rgba(138, 92, 255, 0.15)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {msg.content}
                  </div>
                )
              })}

              {busy && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '14px 14px 14px 4px',
                    padding: '12px 18px',
                    color: '#a1a1c2',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#8a5cff', marginRight: 4, animation: 'mchatBounce 1.2s infinite' }} />
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#8a5cff', marginRight: 4, animation: 'mchatBounce 1.2s infinite 0.2s' }} />
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#8a5cff', animation: 'mchatBounce 1.2s infinite 0.4s' }} />
                </div>
              )}
            </div>

            <div
              style={{
                padding: '10px 12px',
                paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
                borderTop: '1px solid rgba(138, 92, 255, 0.15)',
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Hassan's work..."
                disabled={busy || messages.length >= MAX_SESSION_MSGS}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(138, 92, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#f5f5ff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || busy}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8a5cff, #37d8ff)',
                  color: '#fff',
                  fontSize: '1rem',
                  cursor: input.trim() && !busy ? 'pointer' : 'not-allowed',
                  opacity: input.trim() && !busy ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-label="Send message"
              >
                <i className="fa-solid fa-paper-plane" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes mchatFabRotate {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes mchatSparkleAnim {
          0%, 34%, 71%, 100% { transform: scale(1); }
          17% { transform: scale(1.2); }
          49% { transform: scale(1.2); }
          83% { transform: scale(1.2); }
        }
        .mchat-fab:hover .chat-sparkle-path {
          animation: mchatSparkleAnim 1.5s linear 0.5s infinite;
          transform-origin: center;
        }
        @keyframes mchatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .mchat-panel::-webkit-scrollbar { width: 4px; }
        .mchat-panel::-webkit-scrollbar-track { background: transparent; }
        .mchat-panel::-webkit-scrollbar-thumb { background: rgba(138, 92, 255, 0.3); border-radius: 2px; }
        input::placeholder { color: #6b6b8a; }
      `}</style>
    </>
  )
}
