# WebMCP Presentation & Demo

A Turkish presentation and an interactive shopping demo built with React,
TypeScript, and a Node.js mock API. Includes 12 synthetic products and 10 WebMCP
tools for search, product details, and cart actions.

## Quick start

Requires **Node.js 24** and **pnpm 11.25.0**.

```sh
# Install pnpm if needed
npm install --global pnpm@11.25.0

# Run from the project directory
pnpm install --frozen-lockfile
pnpm dev
```

- [Presentation](http://127.0.0.1:5173/presentation) — 11 slides. Use arrow keys to navigate.
- [Demo](http://127.0.0.1:5173/demo) — search, filters, product details, and cart.

No API key or environment variables are required to run the application.

## WebMCP

The UI works without WebMCP support. To try tools locally in Chrome, enable
`chrome://flags/#enable-webmcp-testing`, relaunch Chrome, and open `/demo`.
Use a compatible agent or WebMCP Inspector to discover and call tools.
Tools are registered only on `/demo`; the flag does not provide a chat agent.

Example prompt:

> Find black running shoes under 2,000 TRY in size 42, sorted by lowest price.
> Open the cheapest product, add one pair in size 42, and show the cart.

The UI and tools share the same search and cart handlers. Search state is stored
in the URL; the cart is kept in tab memory and resets on refresh.

## Commands

```sh
pnpm test          # Search and cart tests
pnpm typecheck     # TypeScript checks
pnpm build         # Type checking and production build
pnpm start         # Serve the build and mock API; run build first
pnpm format        # Format files with Prettier
pnpm format:check  # Check formatting
```

GitHub Actions runs formatting, tests, and the production build on pushes and
pull requests.

## Project structure

- `src/Presentation.tsx`, `src/slides.ts`, `src/TechnicalSlides.tsx` — presentation.
- `src/App.tsx`, `src/ProductCard.tsx` — shopping UI.
- `src/useSearch.ts` — shared search state and request handling.
- `src/tools.ts` — WebMCP tool definitions.
- `server/` — mock catalog, search, cart logic, and HTTP server.
- `tests/` — backend tests.

## Notes

This is an educational demo with simulated stock, no payments, and no production
authorization. Full functionality requires a Node.js server; static GitHub Pages
hosting alone is insufficient. Dependencies, build output, and local environment
files are excluded through `.gitignore`.

## Further reading

- [Presentation notes (Turkish)](docs/SUNUM.md)
- [Chrome and agent setup (Turkish)](docs/CHROME-AGENT.md)
- [WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp)
- [React hook](https://github.com/GoogleChromeLabs/use-webmcp-tool)
