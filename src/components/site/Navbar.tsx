"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

const links = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "How we work" },
  { href: "#why", label: "Why DataHub" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg accent-gradient text-background font-bold">
            D
          </span>
          <span className="text-foreground">
            Data<span className="text-gradient">Hub</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full accent-gradient px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            Contact us
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-lg border border-border text-foreground"
        >
          <div className="space-y-1.5">
            <span className={cn("block h-0.5 w-5 bg-current transition", open && "translate-y-2 rotate-45")} />
            <span className={cn("block h-0.5 w-5 bg-current transition", open && "opacity-0")} />
            <span className={cn("block h-0.5 w-5 bg-current transition", open && "-translate-y-2 -rotate-45")} />
          </div>
        </button>
      </Container>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full accent-gradient px-4 py-2.5 text-center text-sm font-semibold text-background"
            >
              Contact us
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
