# gifmaker.lol — Next.js + Kling AI (via fal.ai)

## Setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → Import the repo
3. Add this environment variable in Vercel dashboard (Settings → Environment Variables):

```
FAL_KEY=your_fal_ai_api_key_here
```

4. Deploy — Vercel auto-detects Next.js

## How it works

- `/` — landing page
- `/create` — AI GIF generator UI
- `/api/generate` — server-side route that calls fal.ai queue API (keys never exposed to browser)

## API Flow

1. **POST /api/generate** — Submits a prompt to fal.ai's Kling video queue, returns `request_id`
2. **GET /api/generate?requestId=xxx** — Polls the status (IN_QUEUE → IN_PROGRESS → COMPLETED)
3. **GET /api/generate?requestId=xxx&action=result** — Fetches the final video URL when COMPLETED

## File structure

```
pages/
  index.js          ← landing page
  create.js         ← GIF maker UI  
  api/
    generate.js     ← fal.ai queue API proxy (server-side)
styles/
  globals.css
package.json
```

## Notes

- Never put your API keys in the frontend code
- The fal.ai key is used server-side only via the API route
- Videos are ~5 seconds, looped in the browser (looks like a GIF)
- Each generation costs ~$0.05-0.10 on fal.ai
- Get your fal.ai key at: https://fal.ai/dashboard/keys
