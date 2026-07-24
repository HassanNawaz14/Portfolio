const STATIC_GREETING = "Welcome to Hassan Nawaz's portfolio — a space where data science meets creative engineering. Feel free to explore the projects, skills, and experiments that define this journey."

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.status(200).json({ greeting: STATIC_GREETING })
}