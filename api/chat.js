// api/chat.js — Vercel serverless function: AI study assistant with switchable providers.
// The browser sends { question, history, catalog } and gets back { answer, termIds }.
// Keys stay on the server and are never exposed to the phone.
//
// Pick a provider with AI_PROVIDER (or just set ONE key — it is auto-detected):
//   gemini     → GEMINI_API_KEY      (Google AI Studio, free tier)
//   groq       → GROQ_API_KEY        (console.groq.com, free tier, very fast)
//   openrouter → OPENROUTER_API_KEY  (openrouter.ai, has free models)
//   anthropic  → ANTHROPIC_API_KEY   (console.anthropic.com, paid)
//   openai     → OPENAI_API_KEY      (platform.openai.com, paid)
// Optional: AI_MODEL to override the default model for the chosen provider.

const DEFAULT_MODELS = {
  gemini: 'gemini-2.5-flash',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'meta-llama/llama-3.3-70b-instruct:free',
  anthropic: 'claude-haiku-5-5',
  openai: 'gpt-4o-mini'
};
const KEY_VARS = {
  gemini: 'GEMINI_API_KEY',
  groq: 'GROQ_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY'
};

function pickProvider() {
  const wanted = (process.env.AI_PROVIDER || '').toLowerCase();
  if (KEY_VARS[wanted] && process.env[KEY_VARS[wanted]]) return wanted;
  return Object.keys(KEY_VARS).find((p) => process.env[KEY_VARS[p]]) || null; // first key found
}

// OpenAI-compatible chat endpoint (Groq, OpenRouter, OpenAI share this format)
async function openAiCompatible(url, key, model, system, messages, extraHeaders = {}) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key, ...extraHeaders },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 2048,
      messages: [{ role: 'system', content: system }, ...messages.map((m) => ({ role: m.role, content: m.text }))]
    })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || 'AI error');
  return data.choices?.[0]?.message?.content || '';
}

async function callProvider(provider, key, model, system, messages) {
  if (provider === 'gemini') {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
        generationConfig: { temperature: 0.4, maxOutputTokens: 2048 }
      })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || 'AI error');
    return data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  }
  if (provider === 'anthropic') {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model, max_tokens: 2048, temperature: 0.4, system,
        messages: messages.map((m) => ({ role: m.role, content: m.text }))
      })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || 'AI error');
    return data.content?.filter((c) => c.type === 'text').map((c) => c.text).join('') || '';
  }
  if (provider === 'groq') return openAiCompatible('https://api.groq.com/openai/v1/chat/completions', key, model, system, messages);
  if (provider === 'openrouter') return openAiCompatible('https://openrouter.ai/api/v1/chat/completions', key, model, system, messages, { 'X-Title': 'FrontEdge' });
  return openAiCompatible('https://api.openai.com/v1/chat/completions', key, model, system, messages);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const provider = pickProvider();
  if (!provider) return res.status(503).json({ error: 'NO_KEY' }); // UI falls back to offline smart search
  const key = process.env[KEY_VARS[provider]];
  const model = process.env.AI_MODEL || process.env.GEMINI_MODEL || DEFAULT_MODELS[provider];

  const { question = '', history = [], catalog = [] } = req.body || {};
  if (!question.trim() || question.length > 4000) return res.status(400).json({ error: 'Bad question' });

  // The catalog is the list of term ids + names in the app, so the model can point users to the right page.
  const catalogText = catalog.slice(0, 400).map((t) => `${t.id} | ${t.name} | ${t.cat}`).join('\n');
  const system = `You are FrontEdge Mentor, a senior frontend engineer helping developers of every level
(fresher to architect) who are stuck in live projects, coding platforms or interview prep.
Rules:
- Answer clearly and practically. Prefer short code samples where EVERY line has a comment explaining what it does and why.
- Mention version-specific behaviour when relevant (e.g. React 19, Angular signals, ES2024+).
- At the very end output one line exactly like: TERMS: id1, id2, id3 — choosing up to 3 ids from the catalog below that the user should study next. Use only ids that exist.
Catalog (id | name | category):
${catalogText}`;

  // Normalise to alternating user/assistant turns; keep the last 8 for cost and speed
  const messages = [
    ...history.slice(-8).map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', text: m.text })),
    { role: 'user', text: question }
  ];
  while (messages.length && messages[0].role !== 'user') messages.shift(); // most APIs require a user turn first

  try {
    const text = (await callProvider(provider, key, model, system, messages)) || 'No answer.';
    const match = text.match(/TERMS:\s*(.+)\s*$/m);              // pull the suggested term ids out
    const termIds = match ? match[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
    const answer = text.replace(/TERMS:.*$/m, '').trim();        // hide the machine line from the user
    res.status(200).json({ answer, termIds, provider });
  } catch (e) {
    res.status(502).json({ error: e.message || 'AI request failed' });
  }
}
