/**
 * Generate the correct URL for a writing post
 * Matches the logic in [...slug].astro to ensure consistency
 * between RSS feed generation and actual page routes
 * 
 * @param {Object} post - The writing post object from getCollection
 * @param {string} post.id - The file path (e.g., "tech/building-scalable-web-applications.md")
 * @param {Object} post.data - The frontmatter data
 * @param {string} post.data.category - The category (tech, critical, etc.)
 * @param {string} [post.data.url] - Optional custom URL slug
 * @returns {string} The full URL path (e.g., "/writing/tech/building-scalable-web-app")
 */
export function getWritingUrl(post) {
    // Extract filename from the post ID (remove directory and .md extension)
    const filename = post.id.split('/').pop()?.replace('.md', '') || '';

    // Use custom URL from frontmatter if available, otherwise use filename
    const slug = post.data.url || filename;

    // Construct the full URL path
    return `/writing/${post.data.category}/${slug}`;
}
