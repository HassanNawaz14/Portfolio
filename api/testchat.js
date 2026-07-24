export default async function handler(req, res) {
  const geminiKey = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY

  const results = {}

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

  if (groqKey) {
    const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768']
    for (const model of models) {
      try {
        const body = {
          model,
          messages: [{ role: 'user', content: 'Say OK' }],
          temperature: 0,
          max_tokens: 10,
        }
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
          body: JSON.stringify(body),
        })
        const text = await r.text()
        results[`groq_${model}`] = { status: r.status, ok: r.ok, snippet: text.substring(0, 200) }
        if (r.ok) break
      } catch (e) {
        results[`groq_${model}`] = { error: e.message }
      }
    }
  } else {
    results.groq = { skipped: 'no key' }
  }

  res.status(200).json(results)
}
