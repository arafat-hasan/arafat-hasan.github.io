/**
 * Site-wide constants and configuration
 * This file contains all static application configuration.
 * For environment-specific values (e.g., SITE_URL, GA_MEASUREMENT_ID), see .env
 */

export const SITE_CONFIG = {
    // Core metadata
    name: 'Arafat Hasan',
    title: 'Arafat Hasan - Software Engineer & Problem Solver',
    description: 'Software engineer specializing in resilient architectures and systems thinking. Exploring technology, philosophy, geopolitics, and literature through critical analysis.',
    url: 'https://arafathasan.com',
    author: 'Arafat Hasan',
    email: 'opendoor.arafat[at]gmail[dot]com',
    emailHref: 'mailto:opendoor.arafat[at]gmail[dot]com',

    // SEO-specific configuration
    seo: {
        jobTitle: 'Software Engineer',
        knowsAbout: [
            'Software Engineering',
            'Distributed Systems',
            'System Architecture',
            'Philosophy',
            'Geopolitics',
            'Literature',
        ],
        language: 'en-US',
        ogImage: '/og-image.jpg',
        logo: '/favicon-512x512.png',
    },

    // RSS feed configuration
    rss: {
        title: 'Arafat Hasan - Writings',
        description: 'Technical insights, philosophical essays, and critical analysis on software engineering, geopolitics, literature, and systems thinking.',
    },
} as const;

export const SOCIAL_LINKS = {
    github: {
        name: 'GitHub',
        url: 'https://github.com/arafat-hasan/',
        username: 'arafat-hasan',
    },
    linkedin: {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/arafat-hasan/',
        username: 'arafat-hasan',
    },
    x: {
        name: 'X',
        url: 'https://x.com/Arafat_HJ',
        username: 'Arafat_HJ',
    },
    stackoverflow: {
        name: 'StackOverflow',
        url: 'https://stackoverflow.com/users/6470402/arafat-hasan',
        username: 'arafat-hasan',
    },
    substack: {
        name: 'Substack',
        url: 'https://substack.com/@arafathasan',
        username: 'arafathasan',
    },
} as const;

/**
 * Writing categories configuration
 * Used for multi-domain content organization
 */
export const WRITING_CATEGORIES = {
    tech: {
        name: 'Tech',
        slug: 'tech',
        description: 'Software engineering, programming, algorithms, and system design',
        color: 'blue',
    },
    geopolitics: {
        name: 'Geo-Politics',
        slug: 'geopolitics',
        description: 'International relations, political analysis, current affairs',
        color: 'red',
    },
    literature: {
        name: 'Literature',
        slug: 'literature',
        description: 'Book reviews, literary analysis, reading notes',
        color: 'green',
    },
    philosophy: {
        name: 'Philosophy',
        slug: 'philosophy',
        description: 'Philosophical musings, ethical discussions, thought experiments',
        color: 'purple',
    },
    fiction: {
        name: 'Fiction',
        slug: 'fiction',
        description: 'Short stories, creative writing, narrative experiments',
        color: 'orange',
    },
    activities: {
        name: 'Activities',
        slug: 'activities',
        description: 'Cycling adventures, hiking trips, and outdoor explorations',
        color: 'teal',
    },
} as const;

export const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Resume', href: '/resume' },
    { name: 'Writing', href: '/writing' },
    { name: 'Contact', href: '/contact' },
] as const;

export const FOOTER_LINKS = [
    {
        name: 'GitHub',
        href: SOCIAL_LINKS.github.url,
        external: true,
    },
    {
        name: 'LinkedIn',
        href: SOCIAL_LINKS.linkedin.url,
        external: true,
    },
    {
        name: 'Email',
        href: SITE_CONFIG.emailHref,
        external: false,
    },
] as const;

