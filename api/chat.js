import { buildPortfolioKnowledge } from '../src/lib/buildPortfolioKnowledge.js'

const SYSTEM_PROMPT_BASE = `You are a helpful portfolio assistant for Hassan Nawaz. Your role:
- Answer questions about Hassan's background, skills, projects, education, and experience using the knowledge base below.
- Help visitors navigate the portfolio by suggesting routes and sections.
- Keep answers concise (2-4 sentences unless asked for detail).
- If asked about topics unrelated to Hassan or his portfolio, politely decline: "I'm Hassan's portfolio assistant — I can only help with questions about Hassan and his work."
- You have a "navigate_to" function available. Use it when someone asks where to find something or wants to go to a specific page/section.

Knowledge base:
`

const GEMINI_MODEL = 'gemini-flash-lite-latest'

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
        description: 'Optional section anchor to scroll to (e.g. "#skills", "#education", "#about")',
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
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
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

  const parts = candidate.content?.parts || []
  const funcPart = parts.find((p) => p.functionCall)
  if (funcPart) {
    return {
      reply: '',
      toolCalls: [{
        name: funcPart.functionCall.name,
        args: funcPart.functionCall.args,
      }],
    }
  }

  const textPart = parts.find((p) => typeof p.text === 'string' && !p.thought)
  if (!textPart) return { reply: '', toolCalls: null }
  return { reply: textPart.text, toolCalls: null }
}

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']

function extractInlineToolCalls(content) {
  if (typeof content !== 'string') return { clean: content || '', toolCalls: null }
  const re = /<function=([a-zA-Z_][\w-]*)>(.*?)<\/function>/gs
  const toolCalls = []
  let m
  while ((m = re.exec(content)) !== null) {
    try {
      toolCalls.push({ name: m[1], args: JSON.parse(m[2]) })
    } catch {
      // malformed inline call — skip
    }
  }
  if (!toolCalls.length) return { clean: content, toolCalls: null }
  return { clean: content.replace(re, '').trim(), toolCalls }
}

async function callGroq(messages, knowledge) {
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set')

  const systemContent = SYSTEM_PROMPT_BASE + knowledge

  const groqMessages = [
    { role: 'system', content: systemContent },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  let lastErr
  for (const model of GROQ_MODELS) {
    try {
      const body = {
        model,
        messages: groqMessages,
        tools: [{ type: 'function', function: navigateToTool }],
        temperature: 0.7,
        max_tokens: 1024,
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
      const choice = data.choices?.[0]
      if (!choice) throw new Error('No choice returned from Groq')

      const structuredToolCalls = choice.message?.tool_calls?.map((tc) => ({
        name: tc.function.name,
        args: JSON.parse(tc.function.arguments),
      })) || null

      const { clean, toolCalls: inlineToolCalls } = extractInlineToolCalls(choice.message?.content)

      return { reply: clean, toolCalls: structuredToolCalls || inlineToolCalls }
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
      console.warn('Gemini failed, trying Groq:', geminiError.message)
      try {
        const result = await callGroq(messages, knowledge)
        return res.status(200).json(result)
      } catch (groqError) {
        console.error('Both providers failed:', groqError.message)
        return res.status(200).json({
          reply: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          toolCalls: null,
        })
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
