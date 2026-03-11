# gifmaker.lol — Next.js + Kling AI

## Setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub (replace the current files)
2. Go to vercel.com → Import the repo
3. Add these environment variables in Vercel dashboard (Settings → Environment Variables):

```
KLING_ACCESS_KEY=your_access_key_here
KLING_SECRET_KEY=your_secret_key_here
```

4. Deploy — Vercel auto-detects Next.js

## How it works

- `/` — landing page
- `/create` — AI GIF generator UI
- `/api/generate` — server-side route that calls Kling API (keys never exposed to browser)

## File structure

```
pages/
  index.js          ← landing page
  create.js         ← GIF maker UI  
  api/
    generate.js     ← Kling API proxy (server-side)
styles/
  globals.css
package.json
```

## Notes

- Never put your API keys in the frontend code
- The `jsonwebtoken` package generates the JWT server-side
- Videos are ~5 seconds, looped in the browser (looks like a GIF)
- Each generation costs ~1 Kling credit
