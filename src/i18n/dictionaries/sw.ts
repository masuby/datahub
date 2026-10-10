import "server-only";
import type { Dictionary } from "../get-dictionary";
import en from "./en";

/**
 * TEMPORARY — mirrors English so the app compiles while the reviewed
 * Kiswahili copy deck is produced. Replaced by the generated dictionary
 * before any deployment. Never ship this file.
 */
const sw: Dictionary = en;

export default sw;
