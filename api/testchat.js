function detectKeyType(key) {
  if (!key) return 'missing'
  if (key.startsWith('gsk_')) return 'groq_key (WRONG — this is a Groq key, not Gemini!)'
  if (key.startsWith('AIza')) return 'google_cloud_key (valid format)'
  if (key.startsWith('AQ.')) return 'gemini_ai_studio_key (valid format)'
  return 'unknown_format'
}

async function tryModel(key, version, model) {
  const label = `${version}/${model}`
  const body = {
    contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }],
    generationConfig: { temperature: 0, maxOutputTokens: 10 },
  }
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${key}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    )
    const text = await r.text()
    let parsed
    try { parsed = JSON.parse(text) } catch { parsed = null }
    return { status: r.status, ok: r.ok, snippet: text.substring(0, 300) }
  } catch (e) {
    return { error: e.message }
  }
}

export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY

  const keyType = detectKeyType(key)

  const output = {
    key_configured: !!key,
    key_length: key ? key.length : 0,
    key_prefix: key ? key.substring(0, 6) + '...' : null,
    key_type_detected: keyType,
    groq_key_configured: !!groqKey,
    warning: null,
    tests: {},
  }

  if (!key) {
    output.warning = 'GEMINI_API_KEY is not set in Vercel environment variables.'
    return res.status(200).json(output)
  }

  if (key.startsWith('gsk_')) {
    output.warning = 'GEMINI_API_KEY is set to a Groq key (gsk_...). Fix: set the actual Gemini key (starts with AIza or AQ.) from https://aistudio.google.com/app/apikey'
  }

  // Try the recommended model
  const result = await tryModel(key, 'v1beta', 'gemini-2.0-flash')
  output.tests['v1beta/gemini-2.0-flash'] = result

  if (result.ok) {
    output.summary = 'PASS'
  } else if (result.status === 429) {
    output.summary = 'QUOTA_EXCEEDED (key is valid, free tier limit hit)'
  } else if (result.status === 403 || result.status === 400) {
    // Try one more model to confirm
    output.tests['v1/gemini-2.0-flash'] = await tryModel(key, 'v1', 'gemini-2.0-flash')
    output.tests['v1beta/gemini-1.5-flash'] = await tryModel(key, 'v1beta', 'gemini-1.5-flash')
    output.summary = 'FAIL'
  } else {
    output.summary = `UNEXPECTED (${result.status})`
  }

  res.status(200).json(output)
}
