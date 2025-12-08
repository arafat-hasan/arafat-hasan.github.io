import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const writings = await getCollection('writing', ({ data }) => !data.draft);

    // Sort by published date (newest first)
    const sortedWritings = writings.sort(
        (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
    );

    return rss({
        title: 'Arafat Hasan - Writings',
        description: 'Technical insights, philosophical essays, and critical analysis on software engineering, geopolitics, literature, and systems thinking.',
        site: context.site,
        items: sortedWritings.map((post) => ({
            title: post.data.title,
            pubDate: post.data.publishedAt,
            description: post.data.description || post.data.excerpt || '',
            link: `/writing/${post.slug}/`,
            categories: [post.data.category, ...(post.data.tags || [])],
            author: 'Arafat Hasan',
        })),
        customData: `<language>en-us</language>`,
    });
}
