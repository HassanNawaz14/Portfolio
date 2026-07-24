export default async function handler(req, res) {
  const geminiKey = process.env.GEMINI_API_KEY
  const grokKey = process.env.GROK_API_KEY

  const results = {}

  // Test Gemini
  if (geminiKey) {
    try {
      const body = {
        system_instruction: { parts: [{ text: 'Reply with: OK' }] },
        contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 50 },
      }
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      )
      const text = await r.text()
      results.gemini = { status: r.status, ok: r.ok, snippet: text.substring(0, 300) }
    } catch (e) {
      results.gemini = { error: e.message }
    }
  } else {
    results.gemini = { skipped: 'no key' }
  }

  // Test Grok
  if (grokKey) {
    try {
      const body = {
        model: 'grok-2',
        messages: [{ role: 'user', content: 'Say OK' }],
        temperature: 0,
        max_tokens: 50,
      }
      const r = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${grokKey}` },
        body: JSON.stringify(body),
      })
      const text = await r.text()
      results.grok = { status: r.status, ok: r.ok, snippet: text.substring(0, 300) }
    } catch (e) {
      results.grok = { error: e.message }
    }
  } else {
    results.grok = { skipped: 'no key' }
  }

  res.status(200).json(results)
}
