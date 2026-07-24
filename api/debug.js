export default function handler(req, res) {
  const geminiVal = process.env.GEMINI_API_KEY
  const grokVal = process.env.GROK_API_KEY

  res.status(200).json({
    gemini_configured: !!geminiVal,
    gemini_value_length: typeof geminiVal === 'string' ? geminiVal.length : 'not a string',
    gemini_first_chars: typeof geminiVal === 'string' && geminiVal.length > 0 ? geminiVal.substring(0, 8) : null,
    grok_configured: !!grokVal,
    grok_value_length: typeof grokVal === 'string' ? grokVal.length : 'not a string',
    grok_first_chars: typeof grokVal === 'string' && grokVal.length > 0 ? grokVal.substring(0, 8) : null,
    get_gemini_key: 'Go to https://aistudio.google.com/apikey (make sure you are logged in) and create a new API key. Copy-paste it into Vercel env vars.',
    get_grok_key: 'Go to https://x.ai/api and create an API key. Add as GROK_API_KEY in Vercel env vars.',
  })
}
