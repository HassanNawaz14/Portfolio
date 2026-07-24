import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

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
      <motion.button
        className="mchat-fab"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 9998,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '1.5px solid rgba(138, 92, 255, 0.4)',
          background: 'rgba(13, 11, 33, 0.75)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          color: '#f5f5ff',
          fontSize: '1.2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 12px rgba(138, 92, 255, 0.3)',
          transition: 'all 0.3s ease',
        }}
        aria-label="Toggle chat assistant"
      >
        <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-comment-dots'}`} />
      </motion.button>

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
              zIndex: 9997,
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
