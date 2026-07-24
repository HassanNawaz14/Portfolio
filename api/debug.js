export default function handler(req, res) {
  const geminiVal = process.env.GEMINI_API_KEY
  const grokVal = process.env.GROK_API_KEY

  res.status(200).json({
    gemini_configured: !!geminiVal,
    gemini_value_length: typeof geminiVal === 'string' ? geminiVal.length : 'not a string',
    gemini_first_chars: typeof geminiVal === 'string' && geminiVal.length > 0 ? geminiVal.substring(0, 4) : null,
    gemini_type: typeof geminiVal,
    gemini_has_key: 'GEMINI_API_KEY' in process.env,
    grok_configured: !!grokVal,
    grok_value_length: typeof grokVal === 'string' ? grokVal.length : 'not a string',
    grok_type: typeof grokVal,
    grok_has_key: 'GROK_API_KEY' in process.env,
    all_gemini_keys: Object.keys(process.env).filter(k => k.toLowerCase().includes('gemini')),
    tip: !!geminiVal === false && 'GEMINI_API_KEY' in process.env
      ? 'GEMINI_API_KEY exists but has an EMPTY value in Vercel. Go to Vercel Dashboard → Settings → Environment Variables, click on GEMINI_API_KEY, check the value box is not empty, ensure "Production" is checked, then Redeploy.'
      : null,
  })
}
