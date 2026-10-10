"use client";

import { useEffect } from "react";

/**
 * Keeps campaign attribution alive across in-site navigation.
 *
 * Posters and statuses link to `/?ref=<channel>`. If the visitor then opens a
 * service page before writing to us, the query string is gone — so on first
 * load the sanitised tag is copied to sessionStorage["dh-ref"], and the
 * contact form falls back to it. sessionStorage, not a cookie: nothing about
 * the visitor leaves their browser except inside the form they choose to send.
 */
export const REF_STORAGE_KEY = "dh-ref";

export function sanitizeRef(raw: string | null | undefined): string {
  return (raw ?? "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
}

export function readRef(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const fromUrl = sanitizeRef(params.get("ref") ?? params.get("utm_source"));
  if (fromUrl) return fromUrl;
  try {
    return sanitizeRef(sessionStorage.getItem(REF_STORAGE_KEY));
  } catch {
    return "";
  }
}

export function RefKeeper() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = sanitizeRef(params.get("ref") ?? params.get("utm_source"));
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
