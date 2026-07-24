import { buildPortfolioKnowledge } from '../src/lib/buildPortfolioKnowledge.js'

const SYSTEM_PROMPT_BASE = `You are a helpful portfolio assistant for Hassan Nawaz. Your role:
- Answer questions about Hassan's background, skills, projects, education, and experience using the knowledge base below.
- Help visitors navigate the portfolio by suggesting routes and sections.
- Keep answers concise (2-4 sentences unless asked for detail).
- If asked about topics unrelated to Hassan or his portfolio, politely decline: "I'm Hassan's portfolio assistant — I can only help with questions about Hassan and his work."
- You have a "navigate_to" function available. Use it when someone asks where to find something or wants to go to a specific page/section.

Knowledge base:
`

const navigateToTool = {
  name: 'navigate_to',
  description: 'Navigate the user to a specific page and optionally scroll to a section on that page',
  parameters: {
    type: 'object',
    properties: {
      route: {
        type: 'string',
        description: 'The route path to navigate to (e.g. "/", "/projects", "/quicksite", "/building", "/profiles")',
      },
      anchor: {
        type: 'string',
        description: 'Optional section anchor to scroll to (e.g. "#skills", "#experience", "#about")',
      },
    },
    required: ['route'],
  },
}

async function callGemini(messages, knowledge) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  const systemContent = SYSTEM_PROMPT_BASE + knowledge

  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const body = {
    system_instruction: { parts: [{ text: systemContent }] },
    contents,
    tools: [{ functionDeclarations: [navigateToTool] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
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
  const candidate = data.candidates?.[0]
  if (!candidate) {
    const reason = data.promptFeedback?.blockReason || 'unknown'
    throw new Error(`No candidate from Gemini (blocked: ${reason})`)
  }

  const part = candidate.content?.parts?.[0]
  if (!part) return { reply: '', toolCalls: null }

  if (part.functionCall) {
    return {
      reply: '',
      toolCalls: [{
        name: part.functionCall.name,
        args: part.functionCall.args,
      }],
    }
  }

  return { reply: part.text || '', toolCalls: null }
}

async function callGrok(messages, knowledge) {
  const apiKey = process.env.GROK_API_KEY
  if (!apiKey) throw new Error('GROK_API_KEY not set')

  const systemContent = SYSTEM_PROMPT_BASE + knowledge

  const grokMessages = [
    { role: 'system', content: systemContent },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  const body = {
    model: 'grok-2',
    messages: grokMessages,
    tools: [{ type: 'function', function: navigateToTool }],
    temperature: 0.7,
    max_tokens: 1024,
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
  const choice = data.choices?.[0]
  if (!choice) throw new Error('No choice returned from Grok')

  const toolCalls = choice.message?.tool_calls?.map((tc) => ({
    name: tc.function.name,
    args: JSON.parse(tc.function.arguments),
  })) || null

  return { reply: choice.message?.content || '', toolCalls }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body || {}

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    if (messages.length > 100) {
      return res.status(400).json({ error: 'Too many messages' })
    }

    for (const m of messages) {
      if (typeof m.content !== 'string' || m.content.length > 4000) {
        return res.status(400).json({ error: 'Invalid message content' })
      }
    }

    const knowledge = buildPortfolioKnowledge()

    try {
      const result = await callGemini(messages, knowledge)
      return res.status(200).json(result)
    } catch (geminiError) {
      console.warn('Gemini failed, trying Grok:', geminiError.message)
      const isQuota = geminiError.message.includes('quota') || geminiError.message.includes('429')
      try {
        const result = await callGrok(messages, knowledge)
        return res.status(200).json(result)
      } catch (grokError) {
        console.error('Both providers failed:', grokError.message)
        const msg = isQuota
          ? "I'm currently unavailable because the AI service quota has been reached. Hassan needs to enable billing on his Google AI account at https://ai.google.dev. In the meantime, try adding a GROK_API_KEY as a fallback."
          : "I'm sorry, I'm having trouble connecting right now. Please try again later."
        return res.status(200).json({ reply: msg, toolCalls: null })
      }
    }
  } catch (err) {
    console.error('Chat handler error:', err)
    return res.status(200).json({
      reply: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      toolCalls: null,
      _debug: `Handler error: ${err.message}`,
    })
  }
}
