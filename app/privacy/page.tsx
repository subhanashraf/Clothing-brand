import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Premium SaaS collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <div className="prose prose-lg text-muted-foreground">
            <p className="text-sm text-muted-foreground mb-8">Last updated: November 29, 2025</p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or
              contact us for support.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to provide, maintain, and improve our services, process transactions,
              and communicate with you.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We do not share your personal information with third parties except as described in this policy or with
              your consent.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, or destruction.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Your Rights</h2>
            <p className="mb-4">
              You have the right to access, correct, or delete your personal information. Contact us to exercise these
              rights.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us at privacy@premiumsaas.com.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
