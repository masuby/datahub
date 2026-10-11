import "server-only";
import { defineDict } from "../dict";

/**
 * Strings the contact form needs now that "Interested in" takes any number of
 * choices (checkboxes, iteration 3 §B). `service.hint` sits in the legend
 * between the label and "optional", so the group reads "Interested in ·
 * choose any · optional" and is announced as "Interested in, choose any,
 * optional"; the Kiswahili says outright that more than one may be ticked
 * ("one or more"), with "si lazima" right after it keeping the field
 * optional. `service.invalid` replaces the radio-era "choose one of the
 * options". Contact passes `formExtra[lang]` to ContactForm as `extra`.
 */
export const formExtra = defineDict({
  en: {
    service: {
      hint: "choose any",
      invalid: "Please choose from the options listed.",
    },
  },
  sw: {
    service: {
      hint: "chagua moja au zaidi",
      invalid: "Tafadhali chagua kutoka kwenye machaguo yaliyoorodheshwa.",
    },
  },
});

export type FormExtra = (typeof formExtra)["en"];
