export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: "OPENAI_API_KEY is not configured."
    });
  }

  try {
    const emails = Array.isArray(req.body?.emails) ? req.body.emails : [];

    if (!emails.length) {
      return res.status(400).json({ error: "No emails supplied." });
    }

    const prompt = `
You are AlphaMail AI, an email productivity assistant.
Analyze each email and return ONLY valid JSON.

For every email provide:
- summary: concise 1-2 sentence summary
- priority: Low, Medium, or High
- category: one useful category
- tasks: array of actionable tasks
- deadlines: array of deadlines or dates
- phishingRisk: Low, Medium, or High
- phishingReason: brief reason

Emails:
${JSON.stringify(emails, null, 2)}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI request failed."
      });
    }

    const text =
      data.output_text ||
      (data.output || [])
        .flatMap(item => item.content || [])
        .map(item => item.text || "")
        .join("");

    let results;

    try {
      results = JSON.parse(text);
    } catch {
      results = { raw: text };
    }

    return res.status(200).json({
      results: Array.isArray(results) ? results : results.results || results,
      provider: "openai"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Unexpected server error."
    });
  }
}
