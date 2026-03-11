import jwt from "jsonwebtoken";

const ACCESS_KEY = process.env.KLING_ACCESS_KEY;
const SECRET_KEY = process.env.KLING_SECRET_KEY;
const KLING_BASE = "https://api.klingai.com";

function generateJWT() {
  const payload = {
    iss: ACCESS_KEY,
    exp: Math.floor(Date.now() / 1000) + 1800,
    nbf: Math.floor(Date.now() / 1000) - 5,
  };
  return jwt.sign(payload, SECRET_KEY, { algorithm: "HS256" });
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!ACCESS_KEY || !SECRET_KEY) {
    return res.status(500).json({ error: "API keys not configured. Add KLING_ACCESS_KEY and KLING_SECRET_KEY to Vercel environment variables." });
  }

  const token = generateJWT();

  // POST /api/generate — create a new video task
  if (req.method === "POST") {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    try {
      const response = await fetch(`${KLING_BASE}/v1/videos/text2video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model_name: "kling-v1-6",
          prompt,
          negative_prompt: "blurry, low quality, static, ugly, watermark",
          cfg_scale: 0.5,
          mode: "std",
          aspect_ratio: "1:1",
          duration: "5",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.message || "Kling API error" });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET /api/generate?taskId=xxx — poll task status
  if (req.method === "GET") {
    const { taskId } = req.query;
    if (!taskId) return res.status(400).json({ error: "taskId is required" });

    try {
      const response = await fetch(`${KLING_BASE}/v1/videos/text2video/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.message || "Kling API error" });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
