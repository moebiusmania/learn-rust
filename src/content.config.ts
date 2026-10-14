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

/**
 * Per-track glossary: src/content/glossary/<lang>/<track>.json.
 * Lessons link to an entry with <Term id="…">; `see` lists related entry ids.
 * Inline `code` in `term`, `aka` and `definition` is rendered as <code>.
 */
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/glossary' }),
  schema: z
    .object({
      intro: z.string(),
      terms: z.array(
        z.object({
          id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are kebab-case'),
          term: z.string(),
          aka: z.array(z.string()).default([]),
          definition: z.string(),
          see: z.array(z.string()).default([]),
        }),
      ),
    })
    .superRefine(({ terms }, ctx) => {
      const ids = new Set<string>();
      for (const t of terms) {
        if (ids.has(t.id)) ctx.addIssue({ code: 'custom', message: `Duplicate glossary id "${t.id}"` });
        ids.add(t.id);
      }
      for (const t of terms)
        for (const ref of t.see)
          if (!ids.has(ref)) ctx.addIssue({ code: 'custom', message: `"${t.id}" sees unknown glossary id "${ref}"` });
    }),
});

export const collections = { lessons, tracks, glossary };
