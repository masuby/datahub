import { notFound } from "next/navigation";

/**
 * Every URL that matches no page lands here (src/proxy.ts rewrites anything
 * un-prefixed into /en/...), so the 404 renders inside the root layout in the
 * visitor's language instead of needing the experimental globalNotFound.
 */
export default function CatchAll() {
  notFound();
}
