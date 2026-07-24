export default function handler(req, res) {
  const allKeys = Object.keys(process.env).sort()
  const geminiVars = allKeys.filter(k => k.toLowerCase().includes('gemini'))
  const grokVars = allKeys.filter(k => k.toLowerCase().includes('grok'))

  const hasGemini = !!process.env.GEMINI_API_KEY
  const hasGrok = !!process.env.GROK_API_KEY

  res.status(200).json({
    gemini_configured: hasGemini,
    grok_configured: hasGrok,
    gemini_prefix: hasGemini ? process.env.GEMINI_API_KEY.substring(0, 6) + '...' : null,
    grok_prefix: hasGrok ? process.env.GROK_API_KEY.substring(0, 6) + '...' : null,
    matching_env_vars: {
      gemini_related: geminiVars,
      grok_related: grokVars,
    },
    total_env_vars: allKeys.length,
    sample_keys: allKeys.slice(0, 20),
    node_version: process.version,
  })
}
