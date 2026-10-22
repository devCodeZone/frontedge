// api/news.js — Vercel serverless function: live frontend news from the public DEV.to API
// GET /api/news?tag=react  → latest top articles for that tag (default: a frontend mix)

const TAGS = ['javascript', 'react', 'typescript', 'webdev', 'angular', 'nextjs', 'css', 'ai'];

export default async function handler(req, res) {
  try {
    const tag = (req.query.tag || '').toString().toLowerCase();         // optional filter from the UI
    const tags = TAGS.includes(tag) ? [tag] : ['javascript', 'react', 'webdev', 'ai'];

    // fetch every tag in parallel; top=7 means "most popular in the last 7 days"
    const lists = await Promise.all(
      tags.map((t) =>
        fetch(`https://dev.to/api/articles?tag=${t}&top=7&per_page=12`, {
          headers: { 'User-Agent': 'FrontEdge-App' }
        })
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      )
    );

    // flatten, de-duplicate by id, keep only the fields the app shows
    const seen = new Set();
    const items = lists
      .flat()
      .filter((a) => a && !seen.has(a.id) && seen.add(a.id))
      .sort((a, b) => (b.positive_reactions_count || 0) - (a.positive_reactions_count || 0))
      .slice(0, 30)
      .map((a) => ({
        id: a.id,
        title: a.title,
        url: a.url,
        author: a.user?.name,
        tags: a.tag_list,
        reactions: a.positive_reactions_count,
        published: a.published_at,
        readMin: a.reading_time_minutes
      }));

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600'); // cache 30 min at the edge
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ items: [], error: 'News source unavailable' });
  }
}
