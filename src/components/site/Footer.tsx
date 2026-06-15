import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-12">
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
          <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
        </nav>

        <p className="text-xs text-muted-2">
          © {year} DataHub. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
