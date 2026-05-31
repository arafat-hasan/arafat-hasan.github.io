import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['tech', 'geopolitics', 'literature', 'philosophy', 'fiction', 'activities']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    featuredImage: image().optional(),
    url: z.string().optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    location: z.string(),
    collection: z.string().optional(),
    image: z.string(),
    thumbnail: z.string().optional(),
    alt: z.string(),
    featured: z.boolean().default(false),
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
