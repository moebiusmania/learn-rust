export const locales = ['en', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, { short: string; name: string; htmlLang: string }> = {
  en: { short: 'EN', name: 'English', htmlLang: 'en' },
  it: { short: 'IT', name: 'Italiano', htmlLang: 'it' },
};

export const tracks = ['basic', 'intermediate', 'advanced'] as const;
export type Track = (typeof tracks)[number];

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
