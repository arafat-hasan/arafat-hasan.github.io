import { defineCollection, z } from 'astro:content';

/**
 * Writing collection - Multi-domain content platform
 * Categories: tech, geopolitics, literature, philosophy, fiction, activities
 */
const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['tech', 'geopolitics', 'literature', 'philosophy', 'fiction', 'activities']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    featuredImage: z.string().optional(), // Featured image for posts
    url: z.string().optional(), // Custom URL slug (without category prefix)
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
  writing,
  gallery,
};
