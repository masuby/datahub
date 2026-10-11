"use client";

import { useLayoutEffect, useState, useSyncExternalStore, type ReactNode } from "react";

const subscribeNothing = () => () => {};

/**
 * Its picture (an <img> with a srcset, or a <picture>), drawn only in a
 * render that React commits straight away.
 *
 * Chromium keeps an image that was given a srcset (on itself or on a
 * <source> of its <picture>) before it was ever in the document alive for as
 * long as the page lives: the document's media-query matcher holds it, to
 * pick again when the viewport or the zoom changes, and lets go only when the
 * image leaves the document, which one never inserted never does. React
 * builds a page's elements before it inserts them, and on a client-side
 * navigation it throws away renders it does not commit; every such image then
 * kept its whole discarded render alive, header to footer (review P4: Home
 * and /services round trips added ~500 DOM nodes a visit, never freed until
 * a reload). An image with a plain src, or one inserted and later removed,
 * is freed as usual.
 *
 * So on a client mount the first render leaves the picture out (its box is
 * sized by CSS, so nothing moves) and a layout effect asks for it. That
 * render is synchronous: nothing can interrupt it, and React commits it
 * before the browser paints, so every image it makes is inserted at once.
 * The server HTML, and its hydration, draw the picture straight away as
 * before: the HTML parser inserts what it creates.
 */
export function CommittedPicture({ children }: { children: ReactNode }) {
  // true on the server and while its HTML hydrates; false on a client mount.
  const fromServer = useSyncExternalStore(
    subscribeNothing,
    () => false,
    () => true,
  );
  const [committed, setCommitted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the point: a synchronous render, after this commit, before paint
  useLayoutEffect(() => setCommitted(true), []);
  return fromServer || committed ? children : null;
}
