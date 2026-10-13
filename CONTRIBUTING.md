# Authoring guide

Everything a content author needs. Content is decoupled from code: you can
fix a sentence or a translation without touching any component.

## Where things live

| What | Path |
| --- | --- |
| Lessons (MDX) | `src/content/lessons/<lang>/<track>/<NN>-<slug>.mdx` |
| Track metadata + "key concepts" | `src/content/tracks/<lang>/<track>.json` |
| UI strings (nav, buttons, home page) | `src/i18n/locales/<lang>/ui.json` |
| Widget strings | `src/i18n/locales/<lang>/widgets/<widget-name>.json` |
| Interactive widgets | `src/components/widgets/<WidgetName>.astro` |
| Content components (Playground, Callout, Compare) | `src/components/content/` |

Languages: `en`, `it`. Tracks: `basic`, `intermediate`, `advanced`.

**The same lesson file name must exist in every language**: the language switcher maps
`/en/basic/ownership/` to `/it/basic/ownership/` by swapping the first segment. The URL slug
is the file name without the `NN-` order prefix.

## Lesson frontmatter

```yaml
---
title: Ownership and moves
description: One sentence, shown under the title and in the track overview.
duration: 20          # minutes, integer
tags: [ownership, stack vs heap]
---
```

Start the body with a short intro paragraph (no H1, the layout renders the title).
Use `##` for sections (they populate "On this page") and `###` for subsections.
End with a `## Key takeaways` (`## Punti chiave` in Italian) bullet list.

## Components available in MDX (no imports needed)

All files in `src/components/content/` and `src/components/widgets/` are auto-registered by file name.

```mdx
<Callout type="note|tip|warn|runtime|compare" title="Optional title">
Markdown content. type="compare" accepts from="Java" to render "Coming from Java".
type="runtime" is for "under the hood" notes about the runtime/compiler.
</Callout>

<Compare left="TypeScript" right="Rust">
```ts
// exactly two fenced blocks
```

```rust
// ...
```
</Compare>

<Playground title="Optional title" expectError>
```rust
fn main() {
    // must be a complete program with fn main
}
```
</Playground>
```

- `Playground` is editable and runs on play.rust-lang.org (stable, edition 2024).
  Use `expectError` when the snippet is *meant* to fail compilation (teaching an error).
  Every Playground snippet must compile (or fail as intended) with
  `rustc --edition 2024`. Verify it locally before committing.
- Plain fenced ```` ```rust ```` blocks are static, use them for fragments.

### MDX pitfalls

- In prose, `{`, `}` and `<` are MDX syntax. Wrap Rust like `Vec<T>` or `{:?}` in
  backticks, or escape them (`\{`, `&lt;`).
- Leave a blank line between a component's opening tag and a fenced block inside it,
  and before the closing tag, as in the examples above.

## Writing style

- Audience: experienced developers coming from other languages. Do not explain what a
  loop, a function or a variable is. Explain what is *different* in Rust and *why*.
- Compare with JavaScript/TypeScript, Python, Java/C#, Go and C/C++ where it helps.
- Mention the runtime/compiler angle ("under the hood") when relevant.
- No gamification: no points, scores, badges, streaks or "level up" language.
- Italian: natural technical Italian. Keep established English terms (ownership,
  borrow checker, trait, lifetime, crate, closure, thread, panic) and use
  Italian articles with them (il borrow checker, i trait, la closure, il crate).

## Creating a widget

Use `src/components/widgets/CompilePipeline.astro` as the reference:

1. Strings: `src/i18n/locales/en/widgets/<kebab-name>.json` and the same keys in `it/`.
   Strings may contain inline HTML such as `<code>`, rendered with `set:html`.
2. Markup is rendered at build time inside
   `<WidgetFrame tag="my-widget" title=… subtitle=… icon=…>` (icons: see `Icon.astro`).
3. Behaviour lives in a bundled `<script>` that defines the custom element
   (`customElements.define('my-widget', …)`). Pass data to the client via `data-*`
   attributes (JSON-encoded for structures). No UI frameworks.
4. Styling: scoped `<style>`, design tokens from `src/styles/global.css` only
   (`--accent`, `--stack`, `--heap`, `--owner`, `--borrow`, `--borrow-mut`, `--invalid`,
   `--surface*`, `--border*`, `--text*`, `--radius*`, `--ease-*`…). Colors must work in
   both light and dark themes, which they do automatically if you use the tokens.
   Reuse the shared primitives: `.widget-caption`, `.widget-controls`, `.btn`, `.btn-sm`,
   `.btn-ghost`, `.seg`, `.code-lines` + `.ln`/`.is-active`/`.is-error`/`.is-dim`,
   `.steps-dots`, `.widget-canvas`.
5. For highlighted Rust inside a widget, use `highlightRustLines()` from
   `src/scripts/rust-highlight.ts` in the frontmatter and render with `set:html`.
6. Prefer SVG for diagrams (with CSS transitions on attributes/transforms), and
   `<canvas>` for animations with many moving elements (use `devicePixelRatio`, read
   colors by resolving them on a hidden probe element (`probe.style.color = 'var(--accent)'`
   then `getComputedStyle(probe).color`; reading the custom property directly returns the
   unresolved `light-dark(...)` string, which canvas cannot use), redraw on theme
   change via `matchMedia('(prefers-color-scheme: dark)')` and a `MutationObserver` on
   `document.documentElement[data-theme]`, and respect `prefers-reduced-motion`).
7. Must be keyboard accessible and readable at 360px width (the frame is a size
   container named `widget`, use `@container widget (width < 30rem)`).

## Building

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # static output in dist/
```
