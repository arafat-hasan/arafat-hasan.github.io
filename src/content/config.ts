import { defineCollection, z } from 'astro:content';

/**
 * Blog collection (legacy - will be migrated to 'writing')
 * Keeping for backward compatibility during migration
 */
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

/**
 * Writing collection - Multi-domain content platform
 * Categories: tech, geopolitics, literature, philosophy, fiction
 */
const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['tech', 'geopolitics', 'literature', 'philosophy', 'fiction']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

/**
 * Activities collection - Cycling, hiking, and other adventures
 */
const activities = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    activityType: z.enum(['cycling', 'hiking', 'running', 'other']),
    location: z.string(),
    distance: z.number().optional(), // in km
    duration: z.string().optional(), // e.g., "4h 30m"
    elevation: z.number().optional(), // in meters
    featuredImage: z.string(),
    images: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    gpxFile: z.string().optional(), // future enhancement
  }),
});

/**
 * Gallery collection - Travel photography and experiences
 */
const gallery = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    location: z.string(),
    collection: z.string().optional(), // e.g., "Japan 2024", "Iceland 2023"
    image: z.string(),
    thumbnail: z.string().optional(),
    alt: z.string(),
    camera: z.string().optional(),
    settings: z.object({
      aperture: z.string().optional(),
      shutter: z.string().optional(),
      iso: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  blog,
  writing,
  activities,
  gallery,
};
