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

export async function getTrackInfo(lang: Locale, track: Track) {
  const all = await getCollection('tracks');
  const entry = all.find((t) => t.id === `${lang}/${track}`);
  if (!entry) throw new Error(`Missing track metadata: src/content/tracks/${lang}/${track}.json`);
  return entry.data;
}
