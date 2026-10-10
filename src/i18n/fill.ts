/**
 * Fills `{slot}` placeholders. Translations never concatenate fragments in
 * code — word order differs between English and Kiswahili — so every variable
 * part of a sentence is a named slot in the dictionary string.
 *
 * Its own module (no "server-only") so client components that receive a
 * dictionary sub-tree as props can fill it too.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
