import type { APIRoute } from 'astro';
import { useTranslations } from '@/i18n';
import { defaultLocale } from '@/i18n/config';
import { url } from '@/lib/url';

/**
 * Web app manifest, generated so that every path carries the deploy base.
 * `id` and `scope` pin the installed app to this project: without them a
 * GitHub Pages project is indistinguishable from its siblings on the same origin.
 */
export const GET: APIRoute = () => {
  const { t } = useTranslations(defaultLocale);
  const root = url('/');
  const manifest = {
    id: root,
    name: t('site.title'),
    short_name: t('site.shortTitle'),
    description: t('site.description'),
    lang: defaultLocale,
    start_url: root,
    scope: root,
    display: 'standalone',
    background_color: '#f7f5f2',
    theme_color: '#f7f5f2',
    icons: [
      { src: url('/icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: url('/icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: url('/icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: url('/favicon.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
