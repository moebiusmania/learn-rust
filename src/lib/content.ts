import { getCollection, type CollectionEntry } from 'astro:content';
import { tracks, type Locale, type Track } from '@/i18n/config';

export type LessonEntry = CollectionEntry<'lessons'>;

export interface Lesson {
  entry: LessonEntry;
  lang: Locale;
  track: Track;
  /** URL slug, file name without the numeric order prefix. */
  slug: string;
  order: number;
}

function parseLessonId(id: string) {
  // id looks like "en/basic/01-toolchain"
  const [lang, track, file] = id.split('/');
  const match = /^(\d+)-(.+)$/.exec(file ?? '');
  if (!match) throw new Error(`Lesson file "${id}" must be named NN-slug.mdx`);
  return { lang: lang as Locale, track: track as Track, order: Number(match[1]), slug: match[2]! };
}

export async function getLessons(lang: Locale, track?: Track): Promise<Lesson[]> {
  const all = await getCollection('lessons');
  return all
    .map((entry) => ({ entry, ...parseLessonId(entry.id) }))
    .filter((l) => l.lang === lang && (!track || l.track === track))
    .sort((a, b) => tracks.indexOf(a.track) - tracks.indexOf(b.track) || a.order - b.order);
}

export type Glossary = CollectionEntry<'glossary'>['data'];
export type GlossaryTerm = Glossary['terms'][number];

/** The track glossary, or undefined if the track does not have one yet. */
export async function getGlossary(lang: Locale, track: Track): Promise<Glossary | undefined> {
  const all = await getCollection('glossary');
  return all.find((g) => g.id === `${lang}/${track}`)?.data;
}

/** Glossary ids referenced by <Term id="…"> in a lesson's MDX source. */
export function termIdsIn(lesson: Lesson): Set<string> {
  return new Set([...(lesson.entry.body ?? '').matchAll(/<Term\s+id="([^"]+)"/g)].map((m) => m[1]!));
}

/** Escapes text and turns `inline code` into <code>, for glossary strings rendered with set:html. */
export function inlineCode(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}

export async function getTrackInfo(lang: Locale, track: Track) {
  const all = await getCollection('tracks');
  const entry = all.find((t) => t.id === `${lang}/${track}`);
  if (!entry) throw new Error(`Missing track metadata: src/content/tracks/${lang}/${track}.json`);
  return entry.data;
}
