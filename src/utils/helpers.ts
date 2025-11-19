/**
 * Utility functions for the website
 */

/**
 * Format a date for display
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format a date for ISO datetime attribute
 */
export function formatDateISO(date: Date): string {
    return date.toISOString();
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate reading time estimate
 */
export function estimateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Slugify a string for URLs
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
