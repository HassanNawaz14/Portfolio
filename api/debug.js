export default function handler(req, res) {
  const geminiVal = process.env.GEMINI_API_KEY
  const grokVal = process.env.GROK_API_KEY

  res.status(200).json({
    gemini_configured: !!geminiVal,
    gemini_valid_format: typeof geminiVal === 'string' && geminiVal.startsWith('AIza'),
    gemini_value_length: typeof geminiVal === 'string' ? geminiVal.length : 'not a string',
    gemini_first_chars: typeof geminiVal === 'string' && geminiVal.length > 0 ? geminiVal.substring(0, 6) : null,
    grok_configured: !!grokVal,
    grok_value_length: typeof grokVal === 'string' ? grokVal.length : 'not a string',
    grok_first_chars: typeof grokVal === 'string' && grokVal.length > 0 ? grokVal.substring(0, 6) : null,
    note_gemini: 'Gemini API keys from Google AI Studio always start with "AIza". If yours doesn\'t, you have a wrong/expired key.',
    fix_gemini: 'Get a new key at https://aistudio.google.com/apikey',
    fix_grok: 'Get a key at https://x.ai/api',
  })
}
