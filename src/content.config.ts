import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const schedule = defineCollection({
  loader: glob({ base: './src/content/schedule', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    time: z.string(),
    title: z.string(),
    description: z.string().optional(),
    location: z.string().optional(),
    order: z.number(),
  }),
});

const faq = defineCollection({
  loader: glob({ base: './src/content/faq', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
  }),
});

const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.{json,yaml,yml}' }),
  schema: z.object({
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
    order: z.number().optional(),
  }),
});

const sponsors = defineCollection({
  loader: glob({ base: './src/content/sponsors', pattern: '**/*.{json,yaml,yml}' }),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().optional(),
    tier: z.enum(['friend', 'bronze', 'silver', 'gold']).optional(),
    order: z.number().optional(),
    active: z.boolean().default(true),
  }),
});

export const collections = { schedule, faq, gallery, sponsors };
