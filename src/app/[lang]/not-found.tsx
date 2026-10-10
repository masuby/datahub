import Link from "next/link";

/**
 * Placeholder 404 used while the routing is verified; replaced by the
 * designed, bilingual version during the rebuild.
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
      <p className="font-mono text-sm">404</p>
      <h1 className="text-3xl font-semibold">Page not found · Ukurasa haupatikani</h1>
      <Link href="/" className="underline">
        datahub.co.tz
      </Link>
    </main>
  );
}
