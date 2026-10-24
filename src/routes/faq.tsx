import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionTitle, RegisterButton } from "@/components/Layout";
import { Mail } from "lucide-react";
import { EMAIL, FAQS, INSTAGRAM } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Sensors Week 2026" },
      { name: "description", content: "Answers about eligibility, fees, venues and help for Sensors Week 2026 at BMSCE." },
      { property: "og:title", content: "FAQ | Sensors Week 2026" },
      { property: "og:description", content: "Common questions about Sensors Week 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <SectionTitle kicker="Help" title="Frequently Asked" />
      <Accordion type="single" collapsible className="glass rounded-2xl px-6">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`q${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-10 text-center"><p className="mb-4 text-muted-foreground">Still curious? Ask our bot, or just</p><RegisterButton /></div>

      <div className="glass mt-12 rounded-2xl p-6 text-center sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary sm:text-xs">Contact us</p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-3 inline-flex items-center gap-2 font-display text-base font-bold text-primary hover:underline sm:text-lg"
        >
          <Mail className="size-5 shrink-0" />
          {EMAIL}
        </a>
        <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
          BMS College of Engineering, Basavanagudi, Bengaluru ·{" "}
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-primary">@bmsce_ieeepes</a>
        </p>
      </div>
    </section>
  );
}
