# Design source

- `spec.md` — the implementation spec for the 2026 redesign (tokens, type, the
  no-box rule system, motion, every section, the sample dashboards).
- `copy.en.md`, `copy.sw.md` — the copy decks. **These are the source of the
  dictionaries**; `src/i18n/dictionaries/en.ts` and `sw.ts` are generated:

  ```bash
  python scripts/deck2ts.py docs/design/copy.en.md src/i18n/dictionaries/en.ts en
  python scripts/deck2ts.py docs/design/copy.sw.md src/i18n/dictionaries/sw.ts sw
  ```

  `sw.ts` is type-checked against `en.ts`, so a missing or extra key fails the
  build. Identifier fields (`anchor`, `figure`, `status`) must be identical in
  both decks — they are data keys, not display text.
- `contrast.mjs` — recomputes the WCAG contrast table in `spec.md`. Re-run it
  whenever a colour token changes.
