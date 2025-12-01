import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about-content"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Premium SaaS and our mission to transform businesses with powerful, beautiful software.",
  openGraph: {
    title: "About Us | Premium SaaS",
    description: "Learn about Premium SaaS and our mission to transform businesses with powerful, beautiful software.",
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AboutContent />
      <Footer />
    </main>
  )
}
