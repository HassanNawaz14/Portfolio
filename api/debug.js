export default function handler(req, res) {
  const geminiVal = process.env.GEMINI_API_KEY
  const groqVal = process.env.GROQ_API_KEY
  const grokVal = process.env.GROK_API_KEY

  res.status(200).json({
    gemini_configured: !!geminiVal,
    gemini_length: typeof geminiVal === 'string' ? geminiVal.length : 0,
    gemini_preview: typeof geminiVal === 'string' ? geminiVal.substring(0, 8) + '...' : null,
    groq_configured: !!groqVal,
    groq_length: typeof groqVal === 'string' ? groqVal.length : 0,
    groq_preview: typeof groqVal === 'string' ? groqVal.substring(0, 8) + '...' : null,
    grok_configured: !!grokVal,
    grok_length: typeof grokVal === 'string' ? grokVal.length : 0,
    note_gemini: 'Get key at https://aistudio.google.com/apikey',
    note_groq: 'Get key at https://console.groq.com/keys',
  })
}
