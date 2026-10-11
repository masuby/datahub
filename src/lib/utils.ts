import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Binds each " & " to the word before it (a no-break space), so a heading
 * that wraps never starts a line with "&": "Dashboards & business
 * intelligence" in a narrow, balanced column.
 */
export function bindAmpersands(text: string): string {
  return text.replace(/ & /g, " & ");
}
