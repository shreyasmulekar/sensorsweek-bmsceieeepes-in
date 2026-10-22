import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionTitle, RegisterButton } from "@/components/Layout";
import { FAQS } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Sensors Week 2026" },
      { name: "description", content: "Answers about eligibility, fees, venues and help for Sensors Week 2026 at BMSCE." },
      { property: "og:title", content: "FAQ | Sensors Week 2026" },
      { property: "og:description", content: "Common questions about Sensors Week 2026." },
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
    </section>
  );
}
