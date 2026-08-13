import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const MAX_SESSION_MSGS = 50
const API_URL = '/api/chat'

const staticFallback = "I'm sorry, I'm having trouble connecting right now. Please try again later."

const suggestions = [
  { icon: 'fa-user-astronaut', label: 'Who is Hassan?', prompt: 'Who is Hassan Nawaz?' },
  { icon: 'fa-diagram-project', label: 'Featured projects', prompt: 'Show me your featured projects' },
  { icon: 'fa-rocket', label: 'About QuickSite', prompt: 'Tell me about QuickSite' },
  { icon: 'fa-envelope', label: 'Get in touch', prompt: 'How can I contact you?' },
]

const routeLabels = {
  '/': 'Home',
  '/quicksite': 'QuickSite',
  '/building': 'Lab Access',
  '/projects': 'Projects',
  '/profiles': 'Profiles',
}

const formatTime = (d = new Date()) =>
  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const sectionOrder = ['home', 'about', 'nav-strip', 'skills', 'certifications', 'experience', 'education', 'courses', 'contact', 'startup', 'currently-building', 'featured-projects', 'projects', 'profiles']

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

  const rightSideForSection = {
    about: true, skills: true, education: true, courses: true, contact: true,
  }

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
  const panelRef = useRef(null)

  useEffect(() => {
    const el = groupRef.current
    const panel = panelRef.current
    if (!el || !currentSection) return

    const m = 24
    const rect = el.getBoundingClientRect()
    const gw = rect.width
    const gh = rect.height
    const vw = window.innerWidth
    const vh = window.innerHeight

    const positions = {
      about: { left: vw - gw - m, bottom: m },
      'nav-strip': { left: m, bottom: vh / 2 - gh / 2 },
      skills: { left: vw - gw - m, bottom: vh / 2 - gh / 2 },
      certifications: { left: m, bottom: vh / 2 - gh / 2 },
      education: { left: vw - gw - m, bottom: m },
      experience: { left: m, bottom: m },
      courses: { left: vw - gw - m, bottom: vh / 2 - gh / 2 },
      contact: { left: vw - gw - m, bottom: m },
    }

    const target = positions[currentSection]
    if (target) {
      gsap.to(el, { ...target, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' })
      if (panel) {
        gsap.to(panel, { left: target.left, bottom: target.bottom + gh + 20, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' })
      }
    } else {
      gsap.to(el, { left: m, bottom: m, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' })
      if (panel) {
        gsap.to(panel, { left: m, bottom: m + gh + 20, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' })
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleResize = () => {
      const el = groupRef.current
      const panel = panelRef.current
      if (!el || !currentSection) return
      const m = 24
      const rect = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const positions = {
        about: { left: vw - rect.width - m, bottom: m },
        'nav-strip': { left: m, bottom: vh / 2 - rect.height / 2 },
        skills: { left: vw - rect.width - m, bottom: vh / 2 - rect.height / 2 },
        certifications: { left: m, bottom: vh / 2 - rect.height / 2 },
        education: { left: vw - rect.width - m, bottom: m },
        experience: { left: m, bottom: m },
        courses: { left: vw - rect.width - m, bottom: vh / 2 - rect.height / 2 },
        contact: { left: vw - rect.width - m, bottom: m },
      }
      const target = positions[currentSection]
      if (target) {
        gsap.set(el, target)
        if (panel) gsap.set(panel, { left: target.left, bottom: target.bottom + rect.height + 20 })
      } else {
        gsap.set(el, { left: m, bottom: m })
        if (panel) gsap.set(panel, { left: m, bottom: m + rect.height + 20 })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentSection])

  useEffect(() => {
    const panel = panelRef.current
    const el = groupRef.current
    if (!panel || !el || !currentSection) return
    const m = 24
    const rect = el.getBoundingClientRect()
    const gh = rect.height
    const vw = window.innerWidth
    const pw = 372
    const positions = {
      about: { left: vw - pw - m, bottom: m + gh + 20 },
      'nav-strip': { left: m, bottom: m },
      skills: { left: vw - pw - m, bottom: m },
      certifications: { left: m, bottom: m + gh + 20 },
      education: { left: vw - pw - m, bottom: m + gh + 20 },
      experience: { left: m, bottom: m + gh + 20 },
      courses: { left: vw - pw - m, bottom: m + gh + 20 },
      contact: { left: vw - pw - m, bottom: m + gh + 20 },
    }
    const target = positions[currentSection]
    if (target) gsap.set(panel, target)
    else gsap.set(panel, { left: m, bottom: m + gh + 20 })
  }, [currentSection, open])

  const addMsg = useCallback((role, content) => {
    setMessages((prev) => {
      if (prev.length >= MAX_SESSION_MSGS) return prev
      return [...prev, { role, content, time: formatTime() }]
    })
  }, [])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = useCallback(async (preset) => {
    const text = (preset ?? input).trim()
    if (!text || busy) return
    if (!preset) setInput('')
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

  const rightSide = !!rightSideForSection[currentSection]

  const botAvatar = (
    <div
      style={{
        width: '30px',
        height: '30px',
        minWidth: '30px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8a5cff, #37d8ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '0.72rem',
        boxShadow: '0 0 12px rgba(138, 92, 255, 0.45)',
      }}
    >
      <i className="fa-solid fa-robot" />
    </div>
  )

  return (
    <>
      <div
        ref={groupRef}
        style={{
          position: 'fixed',
          left: '24px',
          bottom: '24px',
          zIndex: 9998,
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            style={{
              display: open ? 'none' : undefined,
              position: 'absolute',
              [rightSide ? 'right' : 'left']: 'calc(100% + 10px)',
              bottom: 'calc(100% + 4px)',
              background: '#0d0b21',
              backdropFilter: 'blur(12px) saturate(180%)',
              WebkitBackdropFilter: 'blur(12px) saturate(180%)',
              border: '1px solid rgba(138, 92, 255, 0.25)',
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              color: '#a1a1c2',
              maxWidth: 'calc(100vw - 80px)',
              userSelect: 'none',
              cursor: 'default',
            }}
          >
            <div style={{
              position: 'absolute',
              [rightSide ? 'right' : 'left']: '-2px',
              bottom: '-2px',
              width: '14px',
              height: '14px',
              background: '#0d0b21',
              borderRight: rightSide ? '1px solid rgba(138, 92, 255, 0.25)' : 'none',
              borderBottom: '1px solid rgba(138, 92, 255, 0.25)',
              borderLeft: rightSide ? 'none' : '1px solid rgba(138, 92, 255, 0.25)',
              transform: 'rotate(0deg)',
              borderRadius: rightSide ? '0 0 0 4px' : '0 0 4px 0',
            }} />
            {`✦ Ask about ${currentSection ? sectionLabels[currentSection] : (pageLabels[location.pathname] || 'anything')}`}
          </div>
          <button
          className="chat-fab"
          onClick={() => setOpen((o) => !o)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.6rem',
            background: 'transparent',
            border: 'none',
            borderRadius: '9999px',
            transformOrigin: 'center',
            transform: `scale(calc(1 + (var(--active, 0) * 0.1)))`,
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
              animation: 'chatFabRotate 2s linear infinite',
            }} />
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{
            width: '1.5rem',
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
            fontSize: '0.9rem',
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
            ref={panelRef}
            className="chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              zIndex: 9999,
              width: '372px',
              maxWidth: 'calc(100vw - 48px)',
              height: '540px',
              maxHeight: 'calc(100vh - 140px)',
              background: 'linear-gradient(180deg, rgba(17, 14, 44, 0.95), rgba(10, 8, 26, 0.95))',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              border: '1px solid rgba(138, 92, 255, 0.28)',
              borderRadius: '20px',
              boxShadow: '0 24px 70px rgba(0,0,0,0.55), 0 0 40px rgba(138, 92, 255, 0.14), inset 0 1px 0 rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* ------- Header ------- */}
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(138, 92, 255, 0.16)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(90deg, rgba(138, 92, 255, 0.08), rgba(55, 216, 255, 0.04))',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8a5cff 0%, #37d8ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.95rem',
                    boxShadow: '0 0 16px rgba(138, 92, 255, 0.5)',
                  }}
                >
                  <i className="fa-solid fa-robot" />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    background: '#00ff88',
                    border: '2px solid #0f0e2c',
                    boxShadow: '0 0 8px rgba(0, 255, 136, 0.7)',
                  }}
                />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f5f5ff', letterSpacing: '-0.01em' }}>
                  Hassan's AI Assistant
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem' }}>
                  <span className="chat-status-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px rgba(0, 255, 136, 0.8)', flexShrink: 0 }} />
                  <span style={{ color: '#00ff88' }}>Online</span>
                  <span style={{ color: '#b9b3d9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    · Lost? Ask me!
                  </span>
                </div>
              </div>
              <div
                style={{
                  padding: '3px 10px',
                  borderRadius: '99px',
                  background: 'rgba(138, 92, 255, 0.12)',
                  border: '1px solid rgba(138, 92, 255, 0.25)',
                  color: '#b9a8ff',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {messages.length}/{MAX_SESSION_MSGS}
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(138, 92, 255, 0.22)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  color: '#a1a1c2',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#f5f5ff' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#a1a1c2' }}
                aria-label="Close chat"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* ------- Messages ------- */}
            <div
              ref={listRef}
              aria-live="polite"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '18px 12px 8px' }}>
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    style={{
                      width: '64px',
                      height: '64px',
                      margin: '0 auto 14px',
                      borderRadius: '20px',
                      background: 'radial-gradient(circle at 30% 25%, rgba(55, 216, 255, 0.35), rgba(138, 92, 255, 0.12) 60%, rgba(240, 86, 196, 0.08))',
                      border: '1px solid rgba(138, 92, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#37d8ff',
                      fontSize: '1.5rem',
                      boxShadow: '0 0 30px rgba(138, 92, 255, 0.25)',
                      animation: 'chatGlowFloat 3.5s ease-in-out infinite',
                    }}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles" />
                  </motion.div>
                  <div style={{ color: '#f5f5ff', fontWeight: 700, fontSize: '0.98rem', marginBottom: '4px' }}>
                    Hi, I'm Hassan's AI assistant
                  </div>
                  <div style={{ color: '#9a9abf', fontSize: '0.78rem', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto 16px' }}>
                    Ask me anything about his work, skills, or projects — or jump straight in with a suggestion.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {suggestions.map((s) => (
                      <button
                        key={s.prompt}
                        onClick={() => handleSend(s.prompt)}
                        disabled={busy}
                        className="chat-suggestion"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: 'rgba(138, 92, 255, 0.1)',
                          border: '1px solid rgba(138, 92, 255, 0.22)',
                          color: '#d6cdff',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(138, 92, 255, 0.2)'; e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(138, 92, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.22)'; e.currentTarget.style.transform = 'translateY(0)' }}
                      >
                        <i className={`fa-solid ${s.icon}`} style={{ color: '#37d8ff', fontSize: '0.85rem', width: '16px', textAlign: 'center' }} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                if (msg.role === 'tool') {
                  try {
                    const tc = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content
                    if (tc.name === 'navigate_to') {
                      const route = tc.args?.route || '/'
                      const anchor = tc.args?.anchor
                      const label = routeLabels[route] || route
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="chat-nav-card"
                          style={{
                            alignSelf: 'center',
                            width: '92%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '14px',
                            background: 'linear-gradient(90deg, rgba(138, 92, 255, 0.14), rgba(55, 216, 255, 0.07))',
                            border: '1px solid rgba(138, 92, 255, 0.3)',
                            boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              minWidth: '34px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, rgba(138, 92, 255, 0.3), rgba(55, 216, 255, 0.2))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#37d8ff',
                              fontSize: '0.9rem',
                            }}
                          >
                            <i className="fa-solid fa-location-arrow" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8f8fc0', marginBottom: '2px' }}>
                              Navigate to
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5f5ff' }}>
                              {label}{anchor ? <span style={{ color: '#37d8ff', fontWeight: 600 }}> · {anchor.slice(1)}</span> : null}
                            </div>
                          </div>
                          <button
                            onClick={() => handleNavAction(route, anchor)}
                            style={{
                              padding: '7px 14px',
                              borderRadius: '99px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #8a5cff, #37d8ff)',
                              color: '#fff',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(138, 92, 255, 0.5)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                            aria-label={`Take me to ${label}`}
                          >
                            Go <i className="fa-solid fa-arrow-right" style={{ marginLeft: 3, fontSize: '0.6rem' }} />
                          </button>
                        </motion.div>
                      )
                    }
                  } catch {
                    // invalid tool call, skip
                  }
                  return null
                }

                const isUser = msg.role === 'user'
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'flex',
                      flexDirection: isUser ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: '8px',
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '88%',
                    }}
                  >
                    {!isUser && botAvatar}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth: '100%' }}>
                      <div
                        style={{
                          background: isUser
                            ? 'linear-gradient(135deg, rgba(138, 92, 255, 0.38), rgba(55, 216, 255, 0.16))'
                            : 'rgba(255,255,255,0.065)',
                          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          padding: '10px 14px',
                          color: '#f5f5ff',
                          fontSize: '0.87rem',
                          lineHeight: 1.55,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          border: `1px solid ${isUser ? 'rgba(138, 92, 255, 0.28)' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: isUser ? '0 4px 14px rgba(138, 92, 255, 0.12)' : '0 2px 10px rgba(0,0,0,0.15)',
                        }}
                      >
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#5f5f82', marginTop: '4px', padding: '0 4px' }}>
                        {msg.time}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {busy && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px',
                    alignSelf: 'flex-start',
                  }}
                >
                  {botAvatar}
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.065)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span className="chat-type-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg, #8a5cff, #37d8ff)', animation: 'chatBounce 1.2s infinite' }} />
                    <span className="chat-type-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg, #37d8ff, #f056c4)', animation: 'chatBounce 1.2s infinite 0.18s' }} />
                    <span className="chat-type-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg, #f056c4, #8a5cff)', animation: 'chatBounce 1.2s infinite 0.36s' }} />
                    <span style={{ color: '#9a9abf', fontSize: '0.72rem', marginLeft: 4 }}>thinking…</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ------- Input ------- */}
            <div
              style={{
                padding: '12px 12px',
                paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
                borderTop: '1px solid rgba(138, 92, 255, 0.16)',
                background: 'linear-gradient(180deg, rgba(138, 92, 255, 0.03), transparent)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 6px 5px 16px',
                  borderRadius: '99px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(138, 92, 255, 0.25)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.45)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.25)' }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Hassan's work..."
                  disabled={busy || messages.length >= MAX_SESSION_MSGS}
                  aria-label="Message the assistant"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 0',
                    color: '#f5f5ff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    minWidth: '0',
                  }}
                />
                <motion.button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || busy}
                  whileTap={{ scale: 0.88 }}
                  style={{
                    width: '38px',
                    height: '38px',
                    minWidth: '38px',
                    borderRadius: '50%',
                    border: 'none',
                    background: input.trim() && !busy
                      ? 'linear-gradient(135deg, #8a5cff, #37d8ff)'
                      : 'rgba(138, 92, 255, 0.15)',
                    boxShadow: input.trim() && !busy ? '0 0 16px rgba(138, 92, 255, 0.35)' : 'none',
                    color: input.trim() && !busy ? '#fff' : '#6b6b8a',
                    fontSize: '0.9rem',
                    cursor: input.trim() && !busy ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    if (input.trim() && !busy) {
                      e.currentTarget.style.filter = 'brightness(1.18)'
                      e.currentTarget.style.boxShadow = '0 0 22px rgba(138, 92, 255, 0.55)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'none'
                    e.currentTarget.style.boxShadow = input.trim() && !busy ? '0 0 16px rgba(138, 92, 255, 0.35)' : 'none'
                  }}
                  aria-label="Send message"
                >
                  <i className="fa-solid fa-paper-plane" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes chatFabRotate {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes chatSparkleAnim {
          0%, 34%, 71%, 100% { transform: scale(1); }
          17% { transform: scale(1.2); }
          49% { transform: scale(1.2); }
          83% { transform: scale(1.2); }
        }
        .chat-fab:hover .chat-sparkle-path {
          animation: chatSparkleAnim 1.5s linear 0.5s infinite;
          transform-origin: center;
        }
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatGlowFloat {
          0%, 100% { transform: translateY(0); box-shadow: 0 0 30px rgba(138, 92, 255, 0.25); }
          50% { transform: translateY(-5px); box-shadow: 0 0 44px rgba(55, 216, 255, 0.3); }
        }
        .chat-panel::-webkit-scrollbar { width: 5px; }
        .chat-panel::-webkit-scrollbar-track { background: transparent; }
        .chat-panel::-webkit-scrollbar-thumb { background: rgba(138, 92, 255, 0.28); border-radius: 3px; }
        .chat-panel::-webkit-scrollbar-thumb:hover { background: rgba(138, 92, 255, 0.5); }
        input::placeholder { color: #6b6b8a; }
        .chat-suggestion:focus-visible,
        .chat-nav-card button:focus-visible,
        .chat-panel button:focus-visible {
          outline: 2px solid #37d8ff;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-type-dot, .chat-status-pulse, .chat-fab .chat-sparkle-path {
            animation: none !important;
          }
          *[style*="chatGlowFloat"] { animation: none !important; }
        }
      `}</style>
    </>
  )
}