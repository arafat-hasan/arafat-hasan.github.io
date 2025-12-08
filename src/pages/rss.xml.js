import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../config/constants';
import { getWritingUrl } from '../utils/getWritingUrl';

export async function GET(context) {
    const writings = await getCollection('writing', ({ data }) => !data.draft);

    // Sort by published date (newest first)
    const sortedWritings = writings.sort(
        (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
    );

    return rss({
        title: SITE_CONFIG.rss.title,
        description: SITE_CONFIG.rss.description,
        site: context.site,
        xmlns: {
            atom: 'http://www.w3.org/2005/Atom',
        },
        items: sortedWritings.map((post) => ({
            title: post.data.title,
            pubDate: post.data.publishedAt,
            description: post.data.description || post.data.excerpt || '',
            link: getWritingUrl(post),
            categories: [post.data.category, ...(post.data.tags || [])],
        })),
        customData: `<language>en-us</language>
<atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />`,
    });
}
