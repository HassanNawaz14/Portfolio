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

  // Test Grok (try multiple model names)
  if (grokKey) {
    const models = ['grok-2', 'grok-beta', 'grok-2-1212']
    for (const model of models) {
      try {
        const body = {
          model,
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
        results[`grok_${model}`] = { status: r.status, ok: r.ok, snippet: text.substring(0, 200) }
        if (r.ok) break
      } catch (e) {
        results[`grok_${model}`] = { error: e.message }
      }
    }
  } else {
    results.grok = { skipped: 'no key' }
  }

  res.status(200).json(results)
}
