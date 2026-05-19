const FAL_KEY = process.env.FAL_KEY;
const FAL_QUEUE_BASE = "https://queue.fal.run";
const MODEL = "fal-ai/kling-video/v1.6/standard/text-to-video";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!FAL_KEY) {
    return res.status(500).json({ error: "FAL_KEY not configured in Vercel environment variables." });
  }

  // POST — Submit a new video generation request to the queue
  if (req.method === "POST") {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    try {
      const response = await fetch(`${FAL_QUEUE_BASE}/${MODEL}`, {
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
        return res.status(response.status).json({ error: data?.detail || data?.error || "fal.ai API error" });
      }

      // Return the request_id and the exact URLs from fal.ai for polling
      return res.status(200).json({
        request_id: data.request_id,
        status: data.status,
        status_url: data.status_url,
        response_url: data.response_url,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET — Proxy a status check or result fetch to fal.ai
  // Accepts a `url` query param (the full fal.ai URL to proxy)
  if (req.method === "GET") {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "url query parameter is required" });

    // Only allow proxying to fal.run domains for security
    if (!url.startsWith("https://queue.fal.run/")) {
      return res.status(400).json({ error: "Invalid URL — only fal.ai queue URLs are allowed" });
    }

    try {
      const response = await fetch(url, {
        headers: { "Authorization": `Key ${FAL_KEY}` },
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.detail || "fal.ai API error" });
      }

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
