"use client";

import { useEffect } from "react";
import { REF_STORAGE_KEY, refOf, sanitizeRef } from "./campaign";

/**
 * Keeps campaign attribution alive across in-site navigation.
 *
 * Posters and statuses link to `/?ref=<channel>`. If the visitor then opens a
 * service page before writing to us, the query string is gone — so on first
 * load the sanitised tag is copied to sessionStorage["dh-ref"], and the
 * contact form falls back to it. sessionStorage, not a cookie: nothing about
 * the visitor leaves their browser except inside the form they choose to send.
 *
 * RefScript already makes that copy while <head> is parsed, so a tap that
 * lands before hydration keeps the tag; this effect is the after-hydration
 * path, for a page where the script did not run. The rules themselves (what
 * a tag may contain, where it is read from) live in ./campaign; import them
 * from there.
 */
export function readRef(): string {
  if (typeof window === "undefined") return "";
  const fromUrl = refOf(window.location.search);
  if (fromUrl) return fromUrl;
  try {
    return sanitizeRef(sessionStorage.getItem(REF_STORAGE_KEY));
  } catch {
    return "";
  }
}

export function RefKeeper() {
  useEffect(() => {
    const ref = refOf(window.location.search);
    if (!ref) return;
    try {
      // First touch wins: the channel that brought them is the one to credit.
      if (!sessionStorage.getItem(REF_STORAGE_KEY)) sessionStorage.setItem(REF_STORAGE_KEY, ref);
    } catch {
      /* storage blocked: the URL still carries it on this page */
    }
  }, []);
  return null;
}
