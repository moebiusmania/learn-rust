import type { Locale } from '@/i18n/config';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes a site-relative path with the deploy base (GitHub Pages project path). */
export function url(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const withSlash = clean.endsWith('/') || clean.includes('#') || /\.\w+$/.test(clean) ? clean : `${clean}/`;
  return `${base}${withSlash}`;
}

export function localeUrl(lang: Locale, ...segments: string[]): string {
  return url(['', lang, ...segments.filter(Boolean)].join('/'));
}

/** Same page in another locale: swaps the first path segment after the base. */
export function switchLocale(pathname: string, to: Locale): string {
  const rest = pathname.slice(base.length).split('/').filter(Boolean).slice(1);
  return localeUrl(to, ...rest);
}
