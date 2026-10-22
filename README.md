# FrontEdge — Frontend Mastery (PWA)

An installable mobile app (Android + iOS) for frontend developers of every level: 21 tracks, 53 deep-dive terms, roadmaps, interview + coding Q&A, mock tests (by topic, experience or company pattern), live news and a Gemini-powered AI Mentor.

## What's inside

| Feature | Where |
|---|---|
| **Complete syllabus: 478 terms in 21 tracks**, organised into modules — HTML, CSS, JavaScript, TypeScript, jQuery, React, Next.js, Angular, Vue, State, Web APIs, Networking, Performance, Security, Testing, Tooling, Accessibility, PWA, Git/CI/CD, System Design, **AI-Integrated Frontend** | `src/data/syllabus/*.js` |
| Every term: one-liner, explanation, key points, flow diagram, code with a comment on every line, interview Q&A, coding Q&A, common mistakes, module roadmap, prev/next | `src/components/Learn.jsx` |
| Track syllabus page: modules with progress, level filters, in-track search, Continue button | `#/cat/<track>` |
| Track roadmap (diagram + timeline) | `#/roadmap/<track>` |
| Quick-revise flashcards per track / saved / all | `#/revise/<track>` |
| Mock tests: curated MCQs + auto-generated questions from all 478 terms, interview & coding rounds; by topic, experience or company pattern | `src/components/Mock.jsx`, `src/data/mock.js` |
| AI Mentor (Groq / Gemini / OpenRouter / Claude / OpenAI) with offline library fallback | `api/chat.js`, `src/components/Chat.jsx` |
| Progress, streaks, saved terms, light/dark theme, text size, offline download | `#/saved` |

Tracks load on demand (one small chunk each) and are cached by the service worker for offline use.

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

Add a term inside a module in `src/data/syllabus/<track>.js` using the `t('id', 'Name', 'B'|'I'|'A', { one, ex, pts, flow, code, iq, cq, err })` helper (format documented in `src/data/normalize.js`). Run `npm run catalog` (also runs automatically before dev/build) — it validates every term and rebuilds `src/data/catalog.json`, so the term appears in its track, search, roadmaps, flashcards, mock tests and the AI catalog. Add MCQs as rows in `RAW` in `src/data/mock.js`. Diagrams use Mermaid syntax (keep labels inside `["..."]`, avoid `<` `>`).

## A note on company mock tests

Company patterns are compiled from commonly reported interview experiences. Companies change formats and questions often, so no app can guarantee an exact match. Keep `COMPANIES` in `mock.js` updated as you collect fresh reports (e.g. from your community or users' submissions).
