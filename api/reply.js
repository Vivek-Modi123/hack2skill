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
    const email = String(req.body?.email || "").trim();
    const tone = String(req.body?.tone || "professional");

    if (!email) {
      return res.status(400).json({ error: "Email text is required." });
    }

    const prompt = `
Draft a concise, context-aware email reply.

Tone: ${tone}
Email context:
${email}

Return only the reply text. Do not add a subject line.
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

    const reply =
      data.output_text ||
      (data.output || [])
        .flatMap(item => item.content || [])
        .map(item => item.text || "")
        .join("");

    return res.status(200).json({
      reply: reply.trim()
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Unexpected server error."
    });
  }
}
