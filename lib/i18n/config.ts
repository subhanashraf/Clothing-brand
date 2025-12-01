export const locales = ["en", "ar", "cn", "ur", "es"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  cn: "中文",
  ur: "اردو",
  es: "Español",
}

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  ar: "🇸🇦",
  cn: "🇨🇳",
  ur: "🇵🇰",
  es: "🇪🇸",
}

// RTL languages
export const rtlLocales: Locale[] = ["ar", "ur"]

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}

export function getLocalizedField<T extends Record<string, unknown>>(item: T, field: string, locale: Locale): string {
  const localizedKey = `${field}_${locale}` as keyof T
  const defaultKey = field as keyof T

  return (item[localizedKey] as string) || (item[defaultKey] as string) || ""
}
