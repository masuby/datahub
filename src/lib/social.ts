/**
 * DataHub's social media profiles (iteration-3 §A), in the order the site
 * shows them: Instagram, Facebook, TikTok, LinkedIn.
 *
 * The addresses come from NEXT_PUBLIC_SOCIAL_* env vars, so they can be set
 * without a code edit; like the contact details (src/lib/contact-info.ts),
 * each is referenced as a full literal because Next.js inlines NEXT_PUBLIC_
 * values at build time, and an empty value counts as unset. Until a profile
 * has an address, its icon is still shown, but not as a link.
 *
 * Only an https:// address on the network's own domain is accepted: a typo,
 * or an env var pointing anywhere else, leaves the icon unlinked rather than
 * sending visitors somewhere unexpected.
 */

export type SocialId = "instagram" | "facebook" | "tiktok" | "linkedin";

export type SocialProfile = {
  id: SocialId;
  /** The network's own name, as its brand writes it (the same in every language). */
  name: string;
  /** The profile's address, or "" while there is none yet. */
  href: string;
};

/** The domains each network's profile addresses live on. */
const HOSTS: Record<SocialId, readonly string[]> = {
  instagram: ["instagram.com"],
  facebook: ["facebook.com", "fb.com"],
  tiktok: ["tiktok.com"],
  linkedin: ["linkedin.com"],
};

/** `raw` as a profile address of `id`, or "" when it is missing or not one. */
function profileUrl(id: SocialId, raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const ours = HOSTS[id].some((d) => host === d || host.endsWith(`.${d}`));
    return url.protocol === "https:" && ours && !url.username && !url.password ? url.href : "";
  } catch {
    return "";
  }
}

export const SOCIAL_PROFILES: readonly SocialProfile[] = [
  { id: "instagram", name: "Instagram", href: profileUrl("instagram", process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM) },
  { id: "facebook", name: "Facebook", href: profileUrl("facebook", process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK) },
  { id: "tiktok", name: "TikTok", href: profileUrl("tiktok", process.env.NEXT_PUBLIC_SOCIAL_TIKTOK) },
  { id: "linkedin", name: "LinkedIn", href: profileUrl("linkedin", process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN) },
];
