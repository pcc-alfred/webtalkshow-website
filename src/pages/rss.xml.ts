import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const episodes = await getCollection('episodes');
  const sortedEpisodes = episodes.sort((a, b) => b.data.number - a.data.number);

  return rss({
    title: 'The Web Talk Show',
    description: "Learn what happens 'behind-the-scenes' in the day-to-day of different industries, and get inspired with what's possible.",
    site: context.site!,
    xmlns: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
    items: sortedEpisodes.map((episode) => ({
      title: `#${episode.data.number}: ${episode.data.title}`,
      pubDate: episode.data.date,
      description: episode.data.description,
      link: `/episodes/${episode.id}/`,
    })),
    customData: `<language>en-us</language>
<copyright>© ${new Date().getFullYear()} The Web Talk Show</copyright>
<itunes:author>Armando J. Perez-Carreno</itunes:author>
<itunes:summary>Learn what happens 'behind-the-scenes' in the day-to-day of different industries, and get inspired with what's possible.</itunes:summary>
<itunes:owner>
  <itunes:name>Armando J. Perez-Carreno</itunes:name>
</itunes:owner>
<itunes:image href="https://webtalk.show/og-image.jpg"/>
<itunes:category text="Technology"/>
<itunes:category text="Business"/>`,
  });
}
