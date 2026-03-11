const FAL_KEY = process.env.FAL_API_KEY;
const FAL_BASE = "https://queue.fal.run";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!FAL_KEY) {
    return res.status(500).json({ error: "FAL_API_KEY not configured in Vercel environment variables." });
  }

  if (req.method === "POST") {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    try {
      const response = await fetch(`${FAL_BASE}/fal-ai/kling-video/v1.6/standard/text-to-video`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          duration: "5",
          aspect_ratio: "1:1",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.detail || data?.error || "FAL API error" });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    const { requestId } = req.query;
    if (!requestId) return res.status(400).json({ error: "requestId is required" });

    try {
      const response = await fetch(
        `${FAL_BASE}/fal-ai/kling-video/v1.6/standard/text-to-video/requests/${requestId}`,
        { headers: { "Authorization": `Key ${FAL_KEY}` } }
      );
      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.detail || "FAL API error" });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
