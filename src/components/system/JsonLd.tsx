/**
 * Structured data as <script type="application/ld+json">.
 *
 * Carries the per-request nonce so the strict CSP keeps it, and escapes "<" as
 * recommended by the Next.js JSON-LD guide, so no string in the data can ever
 * close the script element early.
 */
export function JsonLd({ data, nonce }: { data: object | object[]; nonce?: string }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          // React does not serialise `nonce` to the client tree, so server
          // HTML and client render always disagree on this attribute.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
