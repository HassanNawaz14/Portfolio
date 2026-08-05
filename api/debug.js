const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768']
const PROBE_PROMPT = 'Reply with exactly one word: OK'

function mask(key) {
  if (!key) return null
  if (key.length <= 10) return key.slice(0, 2) + '...'
  return key.slice(0, 4) + '...' + key.slice(-3)
}

function geminiKeyFormat(key) {
  if (!key) return 'missing'
  if (key.startsWith('AIza')) return 'google_cloud_api_key'
  if (key.startsWith('AQ.')) return 'gemini_ai_studio_key'
  if (key.startsWith('gsk_')) return 'groq_key (WRONG — this is a Groq key, not Gemini!)'
  return 'unknown_format'
}

function classifyError(body, provider) {
  const low = (body || '').toLowerCase()
  const has = (...keys) => keys.some((k) => low.includes(k))
  if (has('api key not valid', 'invalid api key', 'unauthenticated', 'unauthorized', 'bad key', 'missing credentials', 'invalid key', 'key_error', 'auth')) {
    return { type: 'INVALID_KEY', hint: 'The key is wrong, revoked, or doesn\'t belong to this API provider.' }
  }
  if (has('quota', 'rate limit', '429', 'daily limit', 'resource_exhausted', 'too many requests', 'over current quota', 'you exceeded your current quota')) {
    return { type: 'QUOTA', hint: 'The account has hit its quota / rate limit (free tier exhausted or plan limit). Wait for reset or upgrade billing.' }
  }
  if (has('billing', 'payment required', '402', 'account must be upgraded')) {
    return { type: 'BILLING', hint: 'Billing/payment problem on the account.' }
  }
  if (has('model not found', 'model_decommissioned', 'decommissioned', 'not found', 'no longer supported', 'does not exist', 'invalid model')) {
    return { type: 'MODEL_UNAVAILABLE', hint: 'The model name is invalid, retired, or not available in this region/plan.' }
  }
  if (has('permission', 'forbidden', '403', 'access denied', 'restricted')) {
    return { type: 'PERMISSIONS', hint: 'API access is not enabled for this key/project (e.g. Generative Language API not enabled).' }
  }
  if (has('blocked', 'safety', 'prompt_feedback', 'candidates blocked', 'content was blocked')) {
    return { type: 'BLOCKED', hint: 'Request was blocked by safety filters.' }
  }
  if (provider === 'gemini' && has('experimental_armor', 'armor')) {
    return { type: 'BLOCKED', hint: 'Request blocked by Google ARMOR safety filters.' }
  }
  if (has('timeout', 'econnrefused', 'econnreset', 'enotfound', 'fetch failed', 'socket', 'network')) {
    return { type: 'NETWORK', hint: 'Network error reaching the provider (DNS/TLS/region block/transient).' }
  }
  return { type: 'OTHER', hint: 'Unclassified error — see the message below.' }
}

async function probeGemini() {
  const key = process.env.GEMINI_API_KEY
  if (!key) return { tested: false, reason: 'GEMINI_API_KEY not set in this environment' }
  const t0 = Date.now()
  try {
    const res = await fetch(
      `${GEMINI_ENDPOINT}?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: PROBE_PROMPT }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      }
    )
    const body = await res.text()
    const ms = Date.now() - t0
    let parsed = null
    try { parsed = JSON.parse(body) } catch { /* non-JSON body */ }

    if (res.ok && parsed?.candidates?.[0]) {
      return {
        tested: true,
        ok: true,
        model: GEMINI_MODEL,
        http: res.status,
        ms,
        type: 'ok',
        reply: (parsed.candidates[0]?.content?.parts?.[0]?.text || '').trim().slice(0, 50),
      }
    }

    const message = parsed?.error?.message || body.slice(0, 500)
    const cls = classifyError(body, 'gemini')
    return {
      tested: true,
      ok: false,
      model: GEMINI_MODEL,
      http: res.status,
      ms,
      type: cls.type,
      hint: cls.hint,
      message: message.slice(0, 500),
    }
  } catch (e) {
    const cls = classifyError(String(e?.message || e), 'gemini')
    return {
      tested: true,
      ok: false,
      model: GEMINI_MODEL,
      http: null,
      ms: Date.now() - t0,
      type: cls.type,
      hint: cls.hint,
      message: String(e?.message || e).slice(0, 500),
    }
  }
}

async function probeGroq() {
  const key = process.env.GROQ_API_KEY || process.env.GROK_API_KEY
  if (!key) return { tested: false, reason: 'GROQ_API_KEY / GROK_API_KEY not set in this environment' }
  const models = []
  for (const model of GROQ_MODELS) {
    const t0 = Date.now()
    try {
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: PROBE_PROMPT }], max_tokens: 10 }),
      })
      const body = await res.text()
      const ms = Date.now() - t0
      let parsed = null
      try { parsed = JSON.parse(body) } catch { /* non-JSON body */ }

      if (res.ok) {
        models.push({
          model,
          ok: true,
          http: res.status,
          ms,
          type: 'ok',
          reply: (parsed?.choices?.[0]?.message?.content || '').trim().slice(0, 50),
        })
        continue
      }

      const message = parsed?.error?.message || body.slice(0, 500)
      const cls = classifyError(body, 'groq')
      models.push({
        model,
        ok: false,
        http: res.status,
        ms,
        type: cls.type,
        hint: cls.hint,
        message: message.slice(0, 500),
      })
    } catch (e) {
      const cls = classifyError(String(e?.message || e), 'groq')
      models.push({
        model,
        ok: false,
        http: null,
        ms: Date.now() - t0,
        type: cls.type,
        hint: cls.hint,
        message: String(e?.message || e).slice(0, 500),
      })
    }
  }
  return { tested: true, models, anyOk: models.some((m) => m.ok) }
}

export default async function handler(req, res) {
  try {
    const geminiKey = process.env.GEMINI_API_KEY
    const groqKey = process.env.GROQ_API_KEY
    const grokKey = process.env.GROK_API_KEY

    const gemini = await probeGemini()
    const groq = await probeGroq()

    const diagnosis = []
    const fixes = []

    if (!geminiKey) {
      diagnosis.push('GEMINI_API_KEY is NOT set in this environment. Gemini can never succeed here.')
      fixes.push('Set GEMINI_API_KEY in the Vercel environment variables (or .env locally).')
    } else if (gemini.ok) {
      diagnosis.push('Gemini API is healthy — live probe returned a reply.')
    } else {
      diagnosis.push(`Gemini API FAILED — HTTP ${gemini.http} [${gemini.type}]: ${gemini.message}`)
      fixes.push(`Gemini: fix "${gemini.type}" — ${gemini.hint || 'see message above.'}`)
    }

    if (!groqKey && !grokKey) {
      diagnosis.push('GROQ_API_KEY / GROK_API_KEY are NOT set in this environment. The Groq fallback can never succeed here.')
      fixes.push('Set GROQ_API_KEY (or GROK_API_KEY) in the Vercel environment variables (or .env locally).')
    } else if (groq.anyOk) {
      diagnosis.push('Groq fallback is healthy — at least one model returned a reply.')
      if (groq.models.some((m) => !m.ok)) {
        diagnosis.push(`Some Groq models fail (${groq.models.filter((m) => !m.ok).map((m) => `${m.model}[${m.type}]`).join(', ')}) — harmless while an earlier model works.`)
        fixes.push('Remove decommissioned models (e.g. mixtral-8x7b-32768) from GROQ_MODELS in api/chat.js to make the fallback fully clean.')
      }
    } else {
      diagnosis.push('Groq fallback FAILED — no model returned a reply.')
      fixes.push('Groq: check the key and the exact error of the first model in the probe list.')
    }

    if (gemini.tested && groq.tested) {
      if (gemini.ok || groq.anyOk) {
        diagnosis.push('At least one provider works here, so the chat and greeting endpoints should reply with AI text in this environment.')
      } else {
        diagnosis.push('BOTH providers fail here — chat and greeting will serve their static fallback messages.')
      }
    }

    if (gemini.http === 429 && gemini.type === 'QUOTA') {
      fixes.push('Gemini quota: wait for the free-tier reset, upgrade billing, or create a new Google AI Studio project with a fresh free quota.')
    }

    res.status(200).json({
      generated_at: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'local/dev',
      model_probed: GEMINI_MODEL,
      keys: {
        GEMINI_API_KEY: {
          present: !!geminiKey,
          prefix: mask(geminiKey),
          length: geminiKey ? geminiKey.length : 0,
          format: geminiKeyFormat(geminiKey),
        },
        GROQ_API_KEY: { present: !!groqKey, prefix: mask(groqKey), length: groqKey ? groqKey.length : 0 },
        GROK_API_KEY: {
          present: !!grokKey,
          prefix: mask(grokKey),
          length: grokKey ? grokKey.length : 0,
          note: 'used as Groq fallback if GROQ_API_KEY is absent (should be a Groq gsk_ key)',
        },
      },
      live: { gemini, groq },
      diagnosis,
      fixes,
    })
  } catch (err) {
    res.status(500).json({ error: 'Debugger crashed: ' + (err?.message || err) })
  }
}
