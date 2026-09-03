# Current Implementation Status

Last updated: 2026-09-03

This file exists to keep the public repository honest while V0.1 specifications move ahead of the initial code skeleton.

## Implemented now

- pnpm monorepo skeleton;
- `packages/core` basic TypeScript types and early Prompt Builder;
- `packages/pack-ancient-china` early roles, modules, and expert data;
- `apps/web` minimal Vite + TypeScript visual builder;
- identity-based recommendation demo;
- one-line export;
- compact prompt export;
- legacy manifest export;
- planned SillyTavern integration directory.

## Specified but not yet fully implemented

- V0.1 canonical manifest shape;
- generic capability IDs such as `accountability-execution` and `red-team`;
- full identity/permission profiles;
- resident / on-demand / disabled activation modes;
- fact / claim / inference / hypothesis / unknown data flow;
- full-prompt exporter;
- Traveler Forum thread/reply/curated-note data models and retrieval;
- all eight Ancient China system UIs;
- token modes;
- manifest migration / compatibility validation;
- SillyTavern runtime behavior.

## Known migration gap

The first code skeleton still uses provisional module IDs such as `administration`, `fiscal`, `motives`, and `intelligence`. V0.1 documents define language-neutral generic IDs that should become the stable persisted identifiers.

Do not treat the provisional IDs as a compatibility promise. The next implementation milestone should migrate code and fixtures before manifests are considered stable.

## Status vocabulary

- **specified** — accepted in documentation;
- **implemented** — exists in code;
- **validated** — backed by tests or proportionate manual evidence;
- **integrated** — available through a product surface;
- **stable** — compatibility policy applies.
