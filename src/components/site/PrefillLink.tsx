"use client";

import type { ReactNode } from "react";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { leavePrefill } from "@/components/system/prefill";

/**
 * "Start with this package →": a link to the contact page that leaves
 * `message` (the package, its price and an opening for the visitor to
 * finish) for the form there, which takes it on mount (system/prefill). The
 * campaign tag rides along like on any other link (HeaderShell's click
 * handler). Without JavaScript it is a plain link to the empty form.
 */
export function PrefillLink({
  href,
  message,
  children,
  className,
}: {
  href: string;
  message: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <LinkArrow href={href} className={className} onClick={() => leavePrefill(message)}>
      {children}
    </LinkArrow>
  );
}
