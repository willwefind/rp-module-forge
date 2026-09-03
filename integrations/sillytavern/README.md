# SillyTavern Integration

Status: planned first-party integration.

It must consume the shared core package rather than reimplement RP Module Forge.

## Goals

- load / edit a Forge manifest inside SillyTavern
- apply generated content to the current RP
- support token-budget modes
- allow temporary expansion of expensive modules
- show active modules
- preserve Web App import/export compatibility

## Questions before implementation

- preferred injection targets
- World Info vs Author's Note vs system prompt
- per-character vs per-chat persistence
- temporary activation
- token-budget calculation
