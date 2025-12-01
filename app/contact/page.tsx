import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactContent } from "@/components/contact-content"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Premium SaaS. We'd love to hear from you and help with any questions.",
  openGraph: {
    title: "Contact Us | Premium SaaS",
    description: "Get in touch with Premium SaaS. We'd love to hear from you and help with any questions.",
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ContactContent />
      <Footer />
    </main>
  )
}
