# RP Module Forge

An open-source modular assistance-system builder for AIRP and text roleplay.

Build an in-world support system from:
- world packs
- identity / permission adapters
- capability modules
- expert reasoning packs
- traveler legacy notes
- runtime rules

Export the same configuration as:
1. one-line invocation
2. compact injection prompt
3. full setting + injection prompt
4. machine-readable manifest

The first official content pack is **Ancient China**.

> Core rule: the system is not omniscient. It improves analysis, evidence checking and decision support; current-world facts must still come from RP context, observation, investigation or evidence.

## Product surfaces

- **Web App** — primary cross-platform builder
- **SillyTavern integration** — planned first-party adapter
- Future adapters may include browser extensions, MCP or other RP platforms

All surfaces should share the same core configuration and prompt-generation logic.

## Local development

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

## Status

Public V0. Fast iteration expected.

## License

MIT
