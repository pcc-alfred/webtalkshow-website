import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

const BASE_URL = 'https://webtalk.show'

const slugify = (value: string) =>
  value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

export const GET: APIRoute = async () => {
  const episodes = await getCollection('episodes')

  const staticUrls = [
    '/',
    '/about',
    '/search',
    '/episodes',
    '/topics',
    '/guests',
  ]

  const episodeUrls = episodes.map((ep) => ({
    loc: `/episodes/${ep.id}`,
    lastmod: ep.data.date ? ep.data.date.toISOString().slice(0, 10) : null,
  }))

  const topicSet = new Set<string>()
  const guestSet = new Set<string>()
  const badGuestNames = new Set(['Atomic Blocks', 'Your Documents'])

  for (const ep of episodes) {
    for (const topic of ep.data.topics || []) topicSet.add(slugify(topic))
    for (const guest of ep.data.guests || []) {
      if (!badGuestNames.has(guest)) guestSet.add(slugify(guest))
    }
  }

  const topicUrls = [...topicSet].map((slug) => ({ loc: `/topics/${slug}`, lastmod: null }))
  const guestUrls = [...guestSet].map((slug) => ({ loc: `/guests/${slug}`, lastmod: null }))

  const all = [
    ...staticUrls.map((loc) => ({ loc, lastmod: null })),
    ...episodeUrls,
    ...topicUrls,
    ...guestUrls,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(({ loc, lastmod }) => `<url><loc>${BASE_URL}${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
