import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STATUS_COLOR = {
  ok: ['#00ff88', 'rgba(0,255,136,0.12)', '1px solid rgba(0,255,136,0.35)'],
  warn: ['#ffb84d', 'rgba(255,184,77,0.12)', '1px solid rgba(255,184,77,0.35)'],
  bad: ['#ff5b6e', 'rgba(255,91,110,0.12)', '1px solid rgba(255,91,110,0.35)'],
}

function Badge({ tone = 'bad', children }) {
  const [color, bg, border] = STATUS_COLOR[tone] || STATUS_COLOR.bad
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: bg,
        color,
        border,
        borderRadius: '99px',
        padding: '3px 12px',
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
      {children}
    </span>
  )
}

function KeyRow({ label, info, note }) {
  const present = info?.present
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 4px',
        borderBottom: '1px solid rgba(138,92,255,0.1)',
        fontSize: '0.85rem',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ color: '#f5f5ff', fontWeight: 600 }}>{label}</div>
        {note && <div style={{ color: '#a1a1c2', fontSize: '0.7rem', marginTop: 2 }}>{note}</div>}
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <span style={{ color: '#a1a1c2', fontSize: '0.75rem', textAlign: 'right' }}>
          {present ? [info.prefix, info.length ? `${info.length} chars` : null, info.format].filter(Boolean).join(' · ') : 'not set'}
        </span>
        <Badge tone={present ? 'ok' : 'bad'}>{present ? 'SET' : 'MISSING'}</Badge>
      </span>
    </div>
  )
}

function ProbeCard({ title, result }) {
  if (!result) return null
  if (!result.tested) {
    return (
      <div className="debug-card" style={{ opacity: 0.75 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontWeight: 700, color: '#f5f5ff' }}>{title}</span>
          <Badge tone="bad">SKIPPED</Badge>
        </div>
        <p style={{ color: '#a1a1c2', fontSize: '0.82rem', margin: '8px 0 0' }}>{result.reason}</p>
      </div>
    )
  }

  if (result.models) {
    return (
      <div className="debug-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: '#f5f5ff' }}>{title}</span>
          <Badge tone={result.anyOk ? 'ok' : 'bad'}>{result.anyOk ? 'PARTIAL' : 'FAILED (all models)'}</Badge>
        </div>
        {result.models.map((m, i) => (
          <div
            key={i}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              marginBottom: 6,
              background: m.ok ? 'rgba(0,255,136,0.05)' : 'rgba(255,91,110,0.05)',
              border: `1px solid ${m.ok ? 'rgba(0,255,136,0.2)' : 'rgba(255,91,110,0.25)'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ color: '#e0e0f0', fontSize: '0.82rem', fontWeight: 600 }}>{m.model}</span>
              <span style={{ color: '#a1a1c2', fontSize: '0.75rem' }}>HTTP {m.http ?? 'ERR'} · {m.ms}ms</span>
            </div>
            {m.ok ? (
              <div style={{ color: '#00ff88', fontSize: '0.78rem', marginTop: 2 }}>Reply: &ldquo;{m.reply}&rdquo;</div>
            ) : (
              <details style={{ marginTop: 2 }}>
                <summary style={{ color: '#ff5b6e', fontSize: '0.76rem', cursor: 'pointer' }}>
                  [{m.type}] {m.hint}
                </summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem', color: '#c8b8ff', marginTop: 6 }}>{m.message}</pre>
              </details>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="debug-card" style={{ borderColor: result.ok ? 'rgba(0,255,136,0.3)' : 'rgba(255,91,110,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontWeight: 700, color: '#f5f5ff' }}>{title}</span>
        <Badge tone={result.ok ? 'ok' : 'bad'}>{result.ok ? 'HEALTHY' : 'FAILED'}</Badge>
      </div>
      <div style={{ color: '#a1a1c2', fontSize: '0.8rem', marginTop: 8 }}>
        {result.ok ? (
          <span style={{ color: '#00ff88' }}>
            {result.model} · HTTP {result.http} · {result.ms}ms · Reply: &ldquo;{result.reply}&rdquo;
          </span>
        ) : (
          <>
            <div>
              HTTP {result.http ?? 'ERR'} · {result.ms}ms · <span style={{ color: '#ff5b6e' }}>[{result.type}]</span>
            </div>
            <div style={{ color: '#ffb84d', marginTop: 4 }}>{result.hint}</div>
            <details style={{ marginTop: 4 }}>
              <summary style={{ color: '#ff5b6e', fontSize: '0.76rem', cursor: 'pointer' }}>Raw error message</summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem', color: '#c8b8ff', marginTop: 6 }}>{result.message}</pre>
            </details>
          </>
        )}
      </div>
    </div>
  )
}

function EndpointTest({ label, path, buildBody }) {
  const [state, setState] = useState('idle')
  const [result, setResult] = useState(null)
  const [elapsed, setElapsed] = useState(null)

  const run = useCallback(async () => {
    setState('loading')
    setResult(null)
    const t0 = Date.now()
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildBody()),
      })
      const data = await res.json()
      setResult({ http: res.status, data })
    } catch (e) {
      setResult({ http: null, data: { error: String(e && e.message || e) } })
    } finally {
      setElapsed(Date.now() - t0)
      setState('done')
    }
  }, [path, buildBody])

  return (
    <div className="debug-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, color: '#f5f5ff' }}>{label}</div>
          <div style={{ color: '#a1a1c2', fontSize: '0.75rem', fontFamily: 'monospace' }}>{path}</div>
        </div>
        <button
          onClick={run}
          disabled={state === 'loading'}
          style={{
            background: 'linear-gradient(135deg, #8a5cff, #37d8ff)',
            border: 'none',
            color: '#fff',
            cursor: state === 'loading' ? 'wait' : 'pointer',
            borderRadius: 8,
            padding: '7px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            opacity: state === 'loading' ? 0.6 : 1,
            flexShrink: 0,
          }}
        >
          {state === 'loading' ? 'Testing…' : 'Run live test'}
        </button>
      </div>
      {state === 'done' && result && (
        <div style={{ marginTop: 10 }}>
          <div style={{ color: '#a1a1c2', fontSize: '0.75rem', marginBottom: 6 }}>
            HTTP {result.http ?? 'ERR'} · {elapsed}ms
          </div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(138,92,255,0.2)',
              borderRadius: 8,
              padding: 10,
              fontSize: '0.72rem',
              color: '#c8b8ff',
              maxHeight: 220,
              overflow: 'auto',
              margin: 0,
            }}
          >
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function APIDebugger() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const runProbe = useCallback(async () => {
    const res = await fetch('/api/debug')
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)
    return json
  }, [])

  useEffect(() => {
    let cancelled = false
    runProbe()
      .then((json) => { if (!cancelled) setData(json) })
      .catch((e) => { if (!cancelled) setError(String(e && e.message || e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [runProbe])

  const rerun = useCallback(() => {
    setLoading(true)
    setError(null)
    runProbe()
      .then((json) => setData(json))
      .catch((e) => setError(String(e && e.message || e)))
      .finally(() => setLoading(false))
  }, [runProbe])

  if (!data && !loading && !error) return null

  const overallOk = !!(data && ((data.live?.gemini?.ok) || (data.live?.groq?.anyOk)))

  return (
    <div className="sub-page">
      <nav className="sub-page-nav">
        <Link to="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to Core
        </Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ margin: 0, color: '#f5f5ff', fontSize: '1.5rem' }}>
            <i className="fa-solid fa-syringe" style={{ color: '#37d8ff', marginRight: 10 }} />
            AI API Debugger
          </h1>
          <Badge tone="warn">Dev tool</Badge>
        </div>
        <p style={{ color: '#a1a1c2', fontSize: '0.85rem', margin: '0 0 18px' }}>
          Live diagnosis of the Gemini + Groq (fallback) APIs that power the chat bot and the welcome greeting.
        </p>

        {loading && (
          <div className="debug-card" style={{ textAlign: 'center', color: '#a1a1c2' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '1.5rem', color: '#8a5cff' }} />
            <span style={{ marginLeft: 10 }}>Running live probes against Google + Groq…</span>
          </div>
        )}

        {error && (
          <div className="debug-card" style={{ borderColor: 'rgba(255,91,110,0.4)' }}>
            <span style={{ color: '#ff5b6e', fontWeight: 700 }}>Could not reach /api/debug</span>
            <p style={{ color: '#a1a1c2', fontSize: '0.82rem', margin: '6px 0 0' }}>
              {error} — run this via <code style={{ color: '#37d8ff' }}>vercel dev</code> or open it on the deployed Vercel site.
            </p>
          </div>
        )}

        {data && (
          <>
            <div className="debug-card" style={{ borderColor: overallOk ? 'rgba(0,255,136,0.3)' : 'rgba(255,91,110,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: overallOk ? '#00ff88' : '#ff5b6e' }}>
                  {overallOk ? '✔ At least one provider works in this environment' : '✖ Neither provider works in this environment'}
                </span>
                <button
                  onClick={rerun}
                  style={{
                    background: 'rgba(138,92,255,0.15)',
                    border: '1px solid rgba(138,92,255,0.35)',
                    color: '#f5f5ff',
                    cursor: 'pointer',
                    borderRadius: 8,
                    padding: '7px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  <i className="fa-solid fa-rotate" style={{ marginRight: 6 }} />
                  Re-run diagnostics
                </button>
              </div>
              <p style={{ color: '#a1a1c2', fontSize: '0.8rem', margin: '8px 0 0' }}>
                Environment: <b style={{ color: '#e0e0f0' }}>{data.environment}</b> · Probed model:{' '}
                <b style={{ color: '#e0e0f0' }}>{data.model_probed}</b> · {data.generated_at}
              </p>
            </div>

            <h3 style={{ color: '#8a5cff', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '22px 0 8px' }}>
              Key configuration (masked)
            </h3>
            <div className="debug-card" style={{ paddingTop: 4 }}>
              <KeyRow label="GEMINI_API_KEY" info={data.keys.GEMINI_API_KEY} />
              <KeyRow label="GROQ_API_KEY" info={data.keys.GROQ_API_KEY} />
              <KeyRow
                label="GROK_API_KEY"
                info={data.keys.GROK_API_KEY}
                note="used as Groq fallback when GROQ_API_KEY is absent — must be a Groq gsk_ key"
              />
            </div>

            <h3 style={{ color: '#8a5cff', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '22px 0 8px' }}>
              Live provider probes
            </h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <ProbeCard title="Gemini (primary)" result={data.live.gemini} />
              <ProbeCard title="Groq (fallback)" result={data.live.groq} />
            </div>

            <h3 style={{ color: '#8a5cff', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '22px 0 8px' }}>
              Exact diagnosis
            </h3>
            <div className="debug-card" style={{ paddingTop: 10 }}>
              {data.diagnosis.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, color: '#e0e0f0', fontSize: '0.85rem', padding: '4px 0' }}>
                  <span style={{ color: '#37d8ff' }}>›</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#8a5cff', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '22px 0 8px' }}>
              Recommended fixes
            </h3>
            <div className="debug-card" style={{ paddingTop: 10 }}>
              {data.fixes.length === 0 && <div style={{ color: '#00ff88', fontSize: '0.85rem' }}>No fixes needed.</div>}
              {data.fixes.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, color: '#ffb84d', fontSize: '0.85rem', padding: '4px 0' }}>
                  <span>⚠</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#8a5cff', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '22px 0 8px' }}>
              End-to-end endpoint tests
            </h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <EndpointTest
                label="Chat bot — /api/chat"
                path="/api/chat"
                buildBody={() => ({ messages: [{ role: 'user', content: 'Hello, who are you?' }] })}
              />
              <EndpointTest
                label="Welcome greeting — /api/greeting"
                path="/api/greeting"
                buildBody={() => ({ announcements: [] })}
              />
            </div>
          </>
        )}

        <style>{`
          .debug-card {
            background: rgba(20,17,45,0.75);
            border: 1px solid rgba(138,92,255,0.2);
            border-radius: 14px;
            padding: 16px;
          }
        `}</style>
      </div>
    </div>
  )
}