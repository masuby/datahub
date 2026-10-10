import type { Locale } from "@/i18n/config";

/** STUB — replaced by the faq-contact build slice. Contract: section 08, id=contact, contains ContactForm. */
export async function Contact({ lang }: { lang: Locale }) {
  void lang;
  return <section id="contact" />;
}
