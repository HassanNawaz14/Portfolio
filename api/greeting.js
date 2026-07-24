import { announcements } from '../src/content/announcements.js'

function buildGreetingPrompt(clientAnnouncements) {
  const items = clientAnnouncements || announcements
  const now = new Date().toISOString().split('T')[0]

  return [
    'You are Hassan Nawaz\'s portfolio welcome assistant.',
    `Today's date: ${now}`,
    '',
    'Below are the current announcements for the portfolio:',
    ...items.map((a) => `- ${a.date}: ${a.text}${a.link ? ` (${a.link})` : ''}`),
    '',
    'Write a warm, welcoming greeting of 2-3 sentences that introduces Hassan Nawaz and references the most relevant announcement above.',
    'Keep it concise, friendly, and professional. Do not use markdown — just plain text.',
  ].join('\n')
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.8, maxOutputTokens: 200 },
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  )

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGrok(prompt) {
  const apiKey = process.env.GROK_API_KEY
  if (!apiKey) throw new Error('GROK_API_KEY not set')

  const body = {
    model: 'grok-2-latest',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 200,
  }

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Grok API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { announcements: clientAnnouncements } = req.body || {}
    const prompt = buildGreetingPrompt(clientAnnouncements)

    const staticFallback = "Welcome to Hassan Nawaz's portfolio — a space where data science meets creative engineering. Feel free to explore the projects, skills, and experiments that define this journey."

    try {
      const greeting = await callGemini(prompt)
      return res.status(200).json({ greeting: greeting || staticFallback })
    } catch (geminiError) {
      console.warn('Gemini failed for greeting, falling back to Grok:', geminiError.message)
      try {
        const greeting = await callGrok(prompt)
        return res.status(200).json({ greeting: greeting || staticFallback })
      } catch (grokError) {
        console.error('Both AI providers failed for greeting:', grokError.message)
        return res.status(200).json({ greeting: staticFallback })
      }
    }
  } catch (err) {
    console.error('Greeting handler error:', err)
    return res.status(200).json({
      greeting: "Welcome to Hassan Nawaz's portfolio — a space where data science meets creative engineering.",
    })
  }
}
