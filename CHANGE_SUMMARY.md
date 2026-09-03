# V0.1 Docs Review — Change Summary

This reviewed update is ready to overlay onto the existing repository.

## Kept from the first V0.1 docs pass

- rewrote English and Chinese READMEs around the actual product architecture;
- Web App as primary product surface;
- AIRP/RP generality;
- Ancient China as first official world pack;
- SillyTavern as first planned first-party runtime integration;
- non-omniscience, identity permissions, expert lenses, host-final-decision invariants;
- Traveler Forum as a first-class subsystem;
- open-source collaboration as project lore;
- eight Ancient China systems mapped to generic core capabilities;
- dual lore + engineering maintainer log.

## Additional review changes

- strengthened both READMEs with the Traveler Forum / open-source-lore hook;
- updated `CONTRIBUTING.md` for world packs, Traveler Forum data, evidence semantics, and dual maintainer logs;
- rewrote `docs/PROMPT_OUTPUT_SPEC.md` to match the V0.1 canonical config and runtime invariants;
- rewrote `docs/ROADMAP.md` around the new architecture and SillyTavern path;
- added `docs/CURRENT_IMPLEMENTATION_STATUS.md` so the repository clearly distinguishes specified behavior from what the current code skeleton actually implements;
- updated `integrations/sillytavern/README.md` to match the runtime specification and no-second-API-key boundary;
- added a public-facing lore tagline to `docs/REPOSITORY_META.md`.

## Important implementation note

The current TypeScript skeleton still uses provisional IDs (`administration`, `fiscal`, etc.). The V0.1 documents intentionally define the next stable generic IDs (`accountability-execution`, `ledger-evidence-crosscheck`, `red-team`, etc.). Code migration should be the next implementation task; the docs do not falsely claim it is already complete.
