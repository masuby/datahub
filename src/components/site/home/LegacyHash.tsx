"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { localePath, type Locale } from "@/i18n/config";
import { withCampaign } from "../MobileMenu";

/**
 * Sections of the old single page that are pages now. A link shared before
 * the split (`/#team`, `/sw#contact`) still lands on the home page, which
 * has no such section any more; it is forwarded to the page, campaign tag
 * kept — on arrival, and if a fragment link on the page changes the hash.
 * Fragments never reach the server, so this cannot be a redirect.
 */
const HOME_MOVED: Readonly<Record<string, string>> = {
  estimator: "/services#estimator",
  process: "/process",
  security: "/security",
  team: "/team",
  faq: "/faq",
  contact: "/contact",
};

/**
 * `moved` maps a fragment to the locale-free page it moved to; the default
 * is the home page's list. A service page passes its own: it used to end
 * with the contact form (`/services/automation#contact`).
 */
export function LegacyHash({ lang, moved = HOME_MOVED }: { lang: Locale; moved?: Readonly<Record<string, string>> }) {
  const router = useRouter();
  useEffect(() => {
    const forward = () => {
      const id = window.location.hash.slice(1);
      // Own keys only: `#constructor` is not a page.
      const to = Object.prototype.hasOwnProperty.call(moved, id) ? moved[id] : undefined;
      if (!to || document.getElementById(id)) return;
      router.replace(withCampaign(localePath(lang, to)));
    };
    forward();
    window.addEventListener("hashchange", forward);
    return () => window.removeEventListener("hashchange", forward);
  }, [router, lang, moved]);
  return null;
}
