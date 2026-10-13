import { defaultLocale, isLocale, type Locale } from './config';

type Dict = Record<string, unknown>;

const uiFiles = import.meta.glob<Dict>('./locales/*/ui.json', { eager: true, import: 'default' });
const widgetFiles = import.meta.glob<Dict>('./locales/*/widgets/*.json', { eager: true, import: 'default' });

function uiFor(lang: Locale): Dict {
  return uiFiles[`./locales/${lang}/ui.json`] ?? {};
}

function lookup(dict: Dict, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') return (acc as Dict)[part];
    return undefined;
  }, dict);
}

function deepMerge(base: Dict, override: Dict): Dict {
  const out: Dict = { ...base };
  for (const [k, v] of Object.entries(override)) {
    const b = out[k];
    out[k] =
      v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b)
        ? deepMerge(b as Dict, v as Dict)
        : v;
  }
  return out;
}

/** Resolve the active locale from an Astro global (works inside MDX-rendered components too). */
export function getLang(astro: { currentLocale?: string; params?: Record<string, string | undefined>; url: URL }): Locale {
  if (isLocale(astro.currentLocale)) return astro.currentLocale;
  if (isLocale(astro.params?.lang)) return astro.params.lang;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const first = astro.url.pathname.slice(base.length).split('/').filter(Boolean)[0];
  return isLocale(first) ? first : defaultLocale;
}

/**
 * Returns a translator for UI strings. Missing keys fall back to the default
 * locale, then to the key itself so gaps are visible instead of blank.
 * `{name}` placeholders are interpolated from `vars`.
 */
export function useTranslations(lang: Locale) {
  const dict = uiFor(lang);
  const fallback = uiFor(defaultLocale);
  function t(key: string, vars?: Record<string, string | number>): string {
    const raw = lookup(dict, key) ?? lookup(fallback, key);
    if (typeof raw !== 'string') return key;
    return vars ? raw.replace(/\{(\w+)\}/g, (_, v) => String(vars[v] ?? `{${v}}`)) : raw;
  }
  /** Raw (possibly structured) value, e.g. arrays of cards. */
  function tr<T = unknown>(key: string): T {
    return (lookup(dict, key) ?? lookup(fallback, key)) as T;
  }
  return { t, tr };
}

/** Strings for an interactive widget: src/i18n/locales/<lang>/widgets/<name>.json */
export function widgetStrings<T = Dict>(lang: Locale, name: string): T {
  const base = widgetFiles[`./locales/${defaultLocale}/widgets/${name}.json`] ?? {};
  const local = widgetFiles[`./locales/${lang}/widgets/${name}.json`] ?? {};
  return deepMerge(base, local) as T;
}
