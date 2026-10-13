import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Lessons live in src/content/lessons/<lang>/<track>/<NN>-<slug>.mdx.
 * The same file name must exist for every locale so the language switcher
 * can map a page 1:1 to its translation.
 */
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Estimated reading + experimenting time, in minutes. */
    duration: z.number().int().positive(),
    /** Optional short labels shown as chips, e.g. ["ownership", "stack vs heap"]. */
    tags: z.array(z.string()).default([]),
  }),
});

/** Track metadata and the "key concepts" shown on each track overview page. */
const tracks = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tracks' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    intro: z.string(),
    concepts: z.array(z.object({ title: z.string(), text: z.string() })),
  }),
});

export const collections = { lessons, tracks };
