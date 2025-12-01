"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, ShoppingBag, User } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/translations"
import { useCart } from "@/lib/cart/context"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { locale, dir } = useI18n()
  const { itemCount } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)

    // Check auth
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: t("nav.home", locale) },
    { href: "/products", label: t("nav.products", locale) },
    { href: "/about", label: t("nav.about", locale) },
    { href: "/contact", label: t("nav.contact", locale) },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
      dir={dir}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-semibold text-foreground text-xl tracking-tight">ClothEx</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-xl"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="rounded-xl relative">
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">{t("nav.cart", locale)}</span>
              </Button>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="rounded-xl gap-2">
                    <User className="h-4 w-4" />
                    {t("nav.dashboard", locale)}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      {t("nav.login", locale)}
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="rounded-xl px-4">
                      {t("nav.signup", locale)}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-border">
                {user ? (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      {t("nav.dashboard", locale)}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        {t("nav.login", locale)}
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">{t("nav.signup", locale)}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
