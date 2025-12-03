// components/home/ClientSections.tsx
"use client"

import dynamic from "next/dynamic"

// Import client-side sections dynamically
const HeroSection = dynamic(() => import("./hero-section"))
const FAQSection = dynamic(() => import("./FAQSection"))

export function ClientSections({ componenet }: { componenet: string }) {
  return (
    <>
    { componenet === "Hero" ? <HeroSection /> : null }
    { componenet === "FQA" ?    
      <FAQSection />
        : null }
    </>
  )
}
