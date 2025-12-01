import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using Premium SaaS services.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <div className="prose prose-lg text-muted-foreground">
            <p className="text-sm text-muted-foreground mb-8">Last updated: November 29, 2025</p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using Premium SaaS, you agree to be bound by these Terms of Service and all applicable
              laws and regulations.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Use of Service</h2>
            <p className="mb-4">
              You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use
              the service in any way that violates any applicable law or regulation.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Accounts</h2>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Payment Terms</h2>
            <p className="mb-4">
              All purchases are final. Refunds may be issued at our discretion. Subscription fees are billed in advance
              on a monthly or annual basis.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              The service and its original content, features, and functionality are owned by Premium SaaS and are
              protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              Premium SaaS shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use of the service.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via
              email or through the service.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Contact</h2>
            <p className="mb-4">For questions about these Terms, please contact us at legal@premiumsaas.com.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
