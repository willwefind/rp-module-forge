# Architecture V0

```text
World Pack
   ↓
Identity Adapter
   ↓
Capability Modules
   ↓
Expert Packs
   ↓
Runtime Rules
   ↓
Session Patch
   ↓
Canonical Config
   ↓
Prompt Engine
   ├─ One-line
   ├─ Compact
   ├─ Full
   └─ Manifest
```

## Packages

### packages/core
Types, validation, config normalization, prompt generation and output formatters.

### packages/pack-ancient-china
Content only: roles, modules, experts, traveler notes and pack metadata.

### apps/web
Visual assembly, preview, import/export.

### integrations/sillytavern
Planned first-party adapter. Must consume the shared core rather than reimplement it.

## Future packs

- Europe
- Fantasy
- Cultivation
- Space Opera
- Cyberpunk
- Post-apocalypse
