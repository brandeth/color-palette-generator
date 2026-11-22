<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## When finishing work

After finishing a feature, implementation, integration or fix, end your reply with ready-to-copy git details, each in its own code block:

1. **Branch name**: `<type>/<kebab-case-scope>`, e.g. `feat/palette-type-menu`. Reuse the component's branch name when adding another state or variant of it.
2. **Commit title**: Conventional Commits, lowercase type, imperative, no trailing period, e.g. `feat: add landscape variant to PaletteTypeMenu`. Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`.
3. **Commit description**: a short body (bullet points are fine) saying what changed and why.

Never add a `Co-Authored-By` trailer or any other Claude/AI attribution to commits, commit messages or PR descriptions.
