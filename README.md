# Rust, for developers

An interactive, bilingual (EN/IT) Rust course for developers who already know how to
program. Three tracks (basic, intermediate, advanced) mixing explanations,
SVG/canvas visualizations and editable code that runs on the official Rust Playground.

Built with [Astro](https://astro.build) and [Bun](https://bun.sh). Static output,
no UI framework: interactive widgets are vanilla custom elements, styling is plain
modern CSS (cascade layers, nesting, `light-dark()`, OKLCH, container queries,
scroll-driven animations, cross-document view transitions).

## Run locally

```sh
bun install
bun run dev        # http://localhost:4321
bun run build      # static site in dist/
bun run preview
```

## Editing content

Lessons, track descriptions, UI strings and widget strings are all separate from
code. See [CONTRIBUTING.md](CONTRIBUTING.md) for where everything lives and how to
add a lesson, a language or a widget.

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to
`main`. One-time setup: in the repository go to **Settings → Pages → Build and
deployment** and set **Source** to **GitHub Actions**. The workflow reads the
site URL and base path from `actions/configure-pages`, so it works both for
`https://<user>.github.io/<repo>/` and for a custom domain.
