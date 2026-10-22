# FrontEdge — Frontend Mastery (PWA)

An installable mobile app (Android + iOS) for frontend developers of every level: 21 tracks, 53 deep-dive terms, roadmaps, interview + coding Q&A, mock tests (by topic, experience or company pattern), live news and a Gemini-powered AI Mentor.

## What's inside

| Feature | Where |
|---|---|
| 21 tracks: HTML, CSS, JS (ES2025), TypeScript, jQuery, React 19, Next.js, Angular 17–20, Vue 3, State, Web APIs, Networking, Performance, Security, Testing, Tooling, A11y, PWA, DevOps, System Design, **AI-Integrated Frontend** | `src/data/categories.js` |
| Each term: one-liner, explanation, flow diagram, implementation with a comment on every line, interview Q&A, coding Q&A, term roadmap, "study next" | `src/data/terms/*.js` |
| Diagrammatic roadmap page for every track | `#/roadmap/<track>` |
| Mock tests: MCQ (timed, auto-scored, review), interview flashcards, coding round — filtered by topic, experience (Fresher → Architect) or company (TCS, Infosys, Wipro, HCL, Accenture, Capgemini, Cognizant, Publicis Sapient, Deloitte, Flipkart, Amazon, Google, Microsoft, startups) | `src/data/mock.js` |
| AI Mentor (Gemini) that answers and links to the exact term to study; falls back to offline topic search without a key | `api/chat.js`, `src/components/Chat.jsx` |
| Live trending articles (DEV.to API) + curated Release Watch | `api/news.js`, `src/data/index.js` |
| Saved terms, "mastered" progress, test history (stored on device) | `src/lib.js` |
| Offline + install to home screen | `public/manifest.webmanifest`, `public/sw.js` |

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173  (AI + news need Vercel: run `npx vercel dev`)
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. vercel.com → **Add New → Project** → import the repo. Framework is detected as **Vite** (build `npm run build`, output `dist`).
3. **Settings → Environment Variables**:
   - One AI key (the first one found is used, or force one with `AI_PROVIDER`):
     `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
   - `AI_MODEL` — optional model override for the chosen provider
4. Deploy. Open the URL on a phone:
   - **Android (Chrome):** tap **Install app** on the home screen.
   - **iPhone (Safari):** Share → **Add to Home Screen**.

Before going public, add rate limiting to `/api/chat` (e.g. Upstash Redis) so nobody can run up your AI bill.

## Publishing to Play Store / App Store

- **Play Store:** go to https://www.pwabuilder.com, enter your Vercel URL, generate the Android (TWA) package, upload the `.aab` to Play Console, and host the generated `assetlinks.json` at `public/.well-known/assetlinks.json`.
- **App Store:** wrap with Capacitor (`npm i @capacitor/core @capacitor/cli @capacitor/ios`, `npx cap init`, `npx cap add ios`, set `webDir: "dist"`), build in Xcode. Apple rejects apps that are "just a website", so add native value before submitting (push notifications, offline downloads, haptics).

## Adding content

Copy any object in `src/data/terms/*.js` and change the fields — it appears automatically in its track, search, mock tests and the AI catalog. Add MCQs as rows in `RAW` in `src/data/mock.js`. Diagrams use Mermaid syntax (keep labels inside `["..."]`, avoid `<` `>`).

## A note on company mock tests

Company patterns are compiled from commonly reported interview experiences. Companies change formats and questions often, so no app can guarantee an exact match. Keep `COMPANIES` in `mock.js` updated as you collect fresh reports (e.g. from your community or users' submissions).
