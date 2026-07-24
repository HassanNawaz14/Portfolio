function detectKeyType(key) {
  if (!key) return 'missing'
  if (key.startsWith('gsk_')) return 'groq_key (WRONG — this is a Groq key, not Gemini!)'
  if (key.startsWith('AIza')) return 'google_cloud_key'
  if (key.startsWith('AQ.')) return 'gemini_ai_studio_key'
  return 'unknown_format'
}

export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY

  const output = {
    key_configured: !!key,
    key_length: key ? key.length : 0,
    key_prefix: key ? key.substring(0, 6) + '...' : null,
    key_type_detected: detectKeyType(key),
    groq_key_configured: !!groqKey,
    warning: null,
    note: 'API testing is disabled to preserve quota. Only the chat widget makes API calls.',
  }

  if (!key) {
    output.warning = 'GEMINI_API_KEY is not set in Vercel environment variables.'
  } else if (key.startsWith('gsk_')) {
    output.warning = 'GEMINI_API_KEY is set to a Groq key (gsk_...). Fix: set the actual Gemini key from https://aistudio.google.com/app/apikey'
  }

  res.status(200).json(output)
}