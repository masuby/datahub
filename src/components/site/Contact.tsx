import { Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedDots } from "@/components/ui/AnimatedDots";
import { ContactForm } from "./ContactForm";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_HREF,
  WHATSAPP_NUMBER,
} from "@/lib/contact-info";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden scroll-mt-20 border-t border-border py-24">
      <AnimatedDots className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Get in touch
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Let&apos;s talk about your data
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Tell us what you&apos;re working with and what you&apos;d like to
              achieve. We&apos;ll come back to you to scope a solution that fits
              your organisation — reach out whenever you&apos;re ready.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-foreground"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </span>
                {CONTACT_EMAIL}
              </a>
              {WHATSAPP_NUMBER && (
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                    <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  {WHATSAPP_DISPLAY} · WhatsApp
                </a>
              )}
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <MapPin className="h-5 w-5" strokeWidth={1.75} />
                </span>
                Tanzania · working with teams everywhere
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Clock className="h-5 w-5" strokeWidth={1.75} />
                </span>
                We typically reply within one business day
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
