export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(200).json({ error: 'no gemini key' })

  const results = {}
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-001', 'gemini-1.5-flash', 'gemini-1.5-pro']
  const versions = ['v1beta', 'v1']

  for (const version of versions) {
    for (const model of models) {
      const keyLabel = `v=${version} model=${model}`
      try {
        const body = {
          system_instruction: { parts: [{ text: 'Reply with: OK' }] },
          contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 10 },
        }
        const r = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${key}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        )
        const text = await r.text()
        results[keyLabel] = { status: r.status, ok: r.ok, snippet: text.substring(0, 300) }
      } catch (e) {
        results[keyLabel] = { error: e.message }
      }
    }
  }

  // Also try with Bearer auth instead of query param
  try {
    const body = {
      system_instruction: { parts: [{ text: 'Reply: OK' }] },
      contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
      generationConfig: { temperature: 0, maxOutputTokens: 10 },
    }
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify(body),
      }
    )
    const text = await r.text()
    results['Bearer auth v1beta gemini-2.0-flash'] = { status: r.status, ok: r.ok, snippet: text.substring(0, 300) }
  } catch (e) {
    results['Bearer auth'] = { error: e.message }
  }

  // Also try the old API format without system_instruction
  try {
    const body = {
      contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }],
      generationConfig: { temperature: 0, maxOutputTokens: 10 },
    }
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    )
    const text = await r.text()
    results['no system_instruction'] = { status: r.status, ok: r.ok, snippet: text.substring(0, 300) }
  } catch (e) {
    results['no system_instruction'] = { error: e.message }
  }

  res.status(200).json(results)
}
