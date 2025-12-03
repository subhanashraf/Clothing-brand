"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/translations"

export default function FAQSection() {
  const { locale, dir } = useI18n()

  return (
    <section className="w-full py-16 bg-background" dir={dir}>
      <div className="container mx-auto px-4">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10"
        >
          {t("FQA.title", locale)}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4 ">

            {/* Q1 */}
            <AccordionItem value="item-1" className="gradient-bg rounded-xl shadow p-4">
              <AccordionTrigger className="text-lg font-semibold">
                {t("FQA.q1", locale)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground">
                {t("FQA.a1", locale)}
              </AccordionContent>
            </AccordionItem>

            {/* Q2 */}
            <AccordionItem value="item-2" className="gradient-bg rounded-xl shadow p-4">
              <AccordionTrigger className="text-lg font-semibold">
                {t("FQA.q2", locale)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground">
                {t("FQA.a2", locale)}
              </AccordionContent>
            </AccordionItem>

            {/* Q3 */}
            <AccordionItem value="item-3" className="gradient-bg rounded-xl shadow p-4">
              <AccordionTrigger className="text-lg font-semibold">
                {t("FQA.q3", locale)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground">
                {t("FQA.a3", locale)}
              </AccordionContent>
            </AccordionItem>

            {/* Q4 */}
            <AccordionItem value="item-4" className="gradient-bg rounded-xl shadow p-4">
              <AccordionTrigger className="text-lg font-semibold">
                {t("FQA.q4", locale)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground">
                {t("FQA.a4", locale)}
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
