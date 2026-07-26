import { announcements } from '../src/content/announcements.js'

function buildGreetingPrompt(items) {
  const now = new Date().toISOString().split('T')[0]
  return [
    'You are Hassan Nawaz\'s portfolio welcome assistant.',
    `Today's date: ${now}`,
    '',
    'Below are the current announcements for the portfolio:',
    ...items.map((a) => `- ${a.date}: ${a.text}${a.link ? ` (${a.link})` : ''}`),
    '',
    'Write a warm, welcoming greeting of 1-2 sentences that introduces Hassan Nawaz and references the announcements above.',
    'Keep it concise, friendly, and professional. Do not use markdown — just plain text.',
  ].join('\n')
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.8, maxOutputTokens: 120 },
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

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768']

async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set')

  let lastErr
  for (const model of GROQ_MODELS) {
    try {
      const body = {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 120,
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errText = await res.text()
        lastErr = new Error(`Groq ${model} error ${res.status}: ${errText}`)
        continue
      }

      const data = await res.json()
      return data.choices?.[0]?.message?.content || ''
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr || new Error('All Groq models failed')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const staticFallback = "Welcome to Hassan Nawaz's portfolio — a space where data science meets creative engineering. Feel free to explore the projects, skills, and experiments that define this journey."

  try {
    const { announcements: clientAnnouncements } = req.body || {}
    const items = clientAnnouncements || announcements
    const prompt = buildGreetingPrompt(items)

    try {
      const greeting = await callGemini(prompt)
      return res.status(200).json({ greeting: greeting || staticFallback })
    } catch (geminiError) {
      console.warn('Gemini failed for greeting, falling back to Groq:', geminiError.message)
      try {
        const greeting = await callGroq(prompt)
        return res.status(200).json({ greeting: greeting || staticFallback })
      } catch (groqError) {
        console.error('Both AI providers failed for greeting:', groqError.message)
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