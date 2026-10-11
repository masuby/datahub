/**
 * The hours estimator's sentence on its way to the contact form, which lives
 * on another page.
 *
 * "Add this to my message" leaves the sentence in sessionStorage["dh-prefill"]
 * and opens the contact page; the form takes it on mount. The page opens with
 * router.push, a client-side navigation, so this module survives it too: it
 * keeps its own copy, and where storage is blocked the form takes that one
 * instead of opening empty with nothing said. A full page load in between
 * still loses it without storage; there is nowhere else it could wait.
 */
export const PREFILL_STORAGE_KEY = "dh-prefill";

let pending = "";

/** Leaves `message` for the contact form. */
export function leavePrefill(message: string): void {
  pending = message;
  try {
    sessionStorage.setItem(PREFILL_STORAGE_KEY, message);
  } catch {
    /* storage blocked: the copy above still crosses a client-side navigation */
  }
}

/** The sentence left for the contact form, once: both copies are cleared as it is read. */
export function takePrefill(): string {
  let text = "";
  try {
    text = sessionStorage.getItem(PREFILL_STORAGE_KEY) ?? "";
    sessionStorage.removeItem(PREFILL_STORAGE_KEY);
  } catch {
    /* storage blocked: the copy in this module is the only one */
  }
  text = (text || pending).trim();
  pending = "";
  return text;
}
