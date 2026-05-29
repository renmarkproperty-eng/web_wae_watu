import "server-only";

const dictionaries = {
  id: () => import("./dictionaries/id.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export const locales = ["id", "en"] as const;
export const defaultLocale = "id";

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = (locale: Locale) => dictionaries[locale]();
