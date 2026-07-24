export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(200).json({ error: 'no gemini key' })

  const results = {}
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-001', 'gemini-1.5-flash']
  const versions = ['v1beta', 'v1']

  // Test standard endpoints
  for (const version of versions) {
    for (const model of models) {
      const label = `${version}/${model} (query key)`
      try {
        const body = {
          system_instruction: { parts: [{ text: 'Reply OK' }] },
          contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 10 },
        }
        const r = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${key}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        )
        const text = await r.text()
        results[label] = { status: r.status, snippet: text.substring(0, 200) }
      } catch (e) {
        results[label] = { error: e.message }
      }
    }
  }

  // Try alternate base URL: ai.googleapis.com
  try {
    const r = await fetch(
      `https://ai.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Hi' }] }] }),
      }
    )
    const text = await r.text()
    results['ai.googleapis.com (query key)'] = { status: r.status, snippet: text.substring(0, 200) }
  } catch (e) {
    results['ai.googleapis.com'] = { error: e.message }
  }

  res.status(200).json(results)
}
