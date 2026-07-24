export default function handler(req, res) {
  const hasGemini = !!process.env.GEMINI_API_KEY
  const hasGrok = !!process.env.GROK_API_KEY

  res.status(200).json({
    gemini_configured: hasGemini,
    grok_configured: hasGrok,
    gemini_prefix: hasGemini ? process.env.GEMINI_API_KEY.substring(0, 4) + '...' : null,
    node_version: process.version,
    env_note: 'If both are false, set GEMINI_API_KEY and GROK_API_KEY in Vercel Dashboard → Settings → Environment Variables, then redeploy.',
  })
}
