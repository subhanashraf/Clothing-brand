"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, ShoppingBag, User } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/translations"
import { useCart } from "@/lib/cart/context"
import { createClient } from "@/lib/supabase/client"
import { usePathname } from "next/navigation";

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { locale, dir } = useI18n()
  const { itemCount } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
   const pathname = usePathname();

  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    setMounted(true)
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Separate auth effect - runs after initial render
  useEffect(() => {
    let mounted = true
    
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        
        // First, check session from localStorage (fast)
        const session = supabase.auth.getSession()
        
        if (mounted) {
          const { data } = await session
          if (data?.session?.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email
            })
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Delay auth check to prioritize rendering
    const timer = setTimeout(() => {
      if (mounted) checkAuth()
    }, 100)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  const navLinks = [
    { href: "/", label: t("nav.home", locale) },
    { href: "/products", label: t("nav.products", locale) },
    { href: "/about", label: t("nav.about", locale) },
    { href: "/contact", label: t("nav.contact", locale) },
  ]

  // Memoize buttons to prevent unnecessary re-renders
  const authButtons = !isLoading ? (
    user ? (
      <Link href="/dashboard" prefetch={false}>
        <Button variant="ghost" size="sm" className="rounded-xl gap-2">
          <User className="h-4 w-4" />
          {t("nav.dashboard", locale)}
        </Button>
      </Link>
    ) : (
      <>
        <Link href="/auth/login" prefetch={false}>
          <Button variant="ghost" size="sm" className="rounded-xl">
            {t("nav.login", locale)}
          </Button>
        </Link>
        <Link href="/auth/sign-up" prefetch={false}>
          <Button size="sm" className="rounded-xl px-4">
            {t("nav.signup", locale)}
          </Button>
        </Link>
      </>
    )
  ) : (
    // Loading skeleton
    <div className="flex items-center gap-2">
      <div className="h-9 w-16 bg-muted rounded-xl animate-pulse"></div>
      <div className="h-9 w-20 bg-muted rounded-xl animate-pulse"></div>
    </div>
  )
   const textColor =
    pathname === "/" 
      ? isScrolled && theme === "light" 
        ? "text-black" 
        : "text-white"
      : "text-foreground";
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
          {/* Logo - Always visible immediately */}
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className={`font-semibold ${textColor} text-xl tracking-tight`}>ClothEx</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className= {`text-sm font-medium ${textColor}  hover:text-muted-foreground transition-colors`}
                prefetch={false}
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
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            {/* Cart - Always visible */}
            <Link href="/checkout" prefetch={false}>
              <Button variant="ghost" size="icon" className="rounded-xl relative">
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium`}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span className="sr-only">{t("nav.cart", locale)}</span>
              </Button>
            </Link>

            {/* Auth buttons with loading state */}
            <div className="hidden sm:flex items-center gap-2">
              {authButtons}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
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
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-border">
                {!isLoading ? (
                  user ? (
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} prefetch={false}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <User className="h-4 w-4" />
                        {user.email?.split('@')[0] || t("nav.dashboard", locale)}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} prefetch={false}>
                        <Button variant="ghost" className="w-full justify-start">
                          {t("nav.login", locale)}
                        </Button>
                      </Link>
                      <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)} prefetch={false}>
                        <Button className="w-full">{t("nav.signup", locale)}</Button>
                      </Link>
                    </>
                  )
                ) : (
                  // Loading skeleton for mobile
                  <>
                    <div className="h-9 w-full bg-muted rounded-xl animate-pulse"></div>
                    <div className="h-9 w-full bg-muted rounded-xl animate-pulse"></div>
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