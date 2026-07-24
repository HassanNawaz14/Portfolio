export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(200).json({ error: 'GEMINI_API_KEY not set' })
  }

  try {
    const body = {
      system_instruction: { parts: [{ text: 'Reply with exactly: HELLO_WORLD_OK' }] },
      contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }],
      generationConfig: { temperature: 0, maxOutputTokens: 100 },
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    )

    const status = response.status
    const bodyText = await response.text()

    let parsed
    try { parsed = JSON.parse(bodyText) } catch { parsed = null }

    res.status(200).json({
      http_status: status,
      ok: response.ok,
      partial_response: parsed ? JSON.stringify(parsed).substring(0, 1000) : bodyText.substring(0, 500),
      candidate_count: parsed?.candidates?.length || 0,
      has_block_reason: parsed?.promptFeedback?.blockReason || null,
      error_message: parsed?.error?.message || null,
    })
  } catch (err) {
    res.status(200).json({ fetch_error: err.message, stack: err.stack?.substring(0, 300) })
  }
}
