import { Container } from "@/components/ui/Container";
import { AnimatedDots } from "@/components/ui/AnimatedDots";

export function Footer() {
  const year = new Date().getFullYear();
  // The extra bottom padding keeps the copyright clear of the floating WhatsApp
  // button, which is fixed to the bottom-right corner and would otherwise sit
  // on top of it.
  return (
    <footer className="relative overflow-hidden border-t border-border pt-12 pb-28 sm:pb-24">
      <AnimatedDots className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg accent-gradient text-background font-bold">
            D
          </span>
          <span>
            Data<span className="text-gradient">Hub</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-muted">
          <a href="#services" className="transition-colors hover:text-foreground">Services</a>
          <a href="#process" className="transition-colors hover:text-foreground">How we work</a>
          <a href="#why" className="transition-colors hover:text-foreground">Why DataHub</a>
          <a href="#about" className="transition-colors hover:text-foreground">About</a>
          <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
        </nav>

        <p className="text-center text-xs text-muted-2 sm:text-right">
          © {year} DataHub · Founded by Daniel Clement Masubi
          <br />
          Dar es Salaam, Tanzania · All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
