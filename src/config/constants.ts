/**
 * Site-wide constants and configuration
 */

export const SITE_CONFIG = {
    name: 'Arafat Hasan',
    title: 'Arafat Hasan - Software Engineer & Problem Solver',
    description: 'Software engineer with 4 years of experience building efficient and reliable systems. Expertise in backend engineering, DevOps, and machine learning.',
    url: 'https://arafathasan.com',
    author: 'Arafat Hasan',
    email: 'opendoor.arafat[at]gmail[dot]com',
    emailHref: 'mailto:opendoor.arafat[at]gmail[dot]com',
} as const;

export const SOCIAL_LINKS = {
    github: {
        name: 'GitHub',
        url: 'https://github.com/arafat-hasan',
        username: 'arafat-hasan',
    },
    linkedin: {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/arafat-hasan',
        username: 'arafat-hasan',
    },
} as const;

export const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Resume', href: '/resume' },
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
