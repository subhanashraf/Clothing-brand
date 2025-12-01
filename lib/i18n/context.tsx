"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, defaultLocale, isRTL } from "./config"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Get saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale | null
    if (savedLocale) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = isRTL(newLocale) ? "rtl" : "ltr"
    document.documentElement.lang = newLocale
  }

  const dir = isRTL(locale) ? "rtl" : "ltr"

  return <I18nContext.Provider value={{ locale, setLocale, dir }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
