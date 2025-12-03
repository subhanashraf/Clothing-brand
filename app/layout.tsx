import  React, { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Noto_Sans_Arabic, Noto_Sans_SC } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n/context"
import { CartProvider } from "@/lib/cart/context"
import { PageLoader } from "@/components/PageLoader"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic" })
const notoSC = Noto_Sans_SC({ subsets: ["latin"], variable: "--font-chinese", weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: {
    default: "ClothEx - Premium Clothing Export Brand",
    template: "%s | ClothEx",
  },
  description:
    "Premium quality garments crafted for global markets. Experience excellence in every stitch with our export-quality clothing collection.",
  keywords: ["clothing", "export", "garments", "fashion", "premium", "wholesale", "textile", "apparel"],
  authors: [{ name: "ClothEx" }],
  generator: "v0.app",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClothEx",
    title: "ClothEx - Premium Clothing Export Brand",
    description: "Premium quality garments crafted for global markets. Experience excellence in every stitch.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClothEx - Premium Clothing Export Brand",
    description: "Premium quality garments crafted for global markets. Experience excellence in every stitch.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoArabic.variable} ${notoSC.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <CartProvider>
               <Suspense fallback={<PageLoader />}>
                {children}
              </Suspense>
              <Toaster position="top-right" richColors />
            </CartProvider>
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
