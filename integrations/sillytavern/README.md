# SillyTavern Integration

Status: **planned first-party integration; not implemented yet**.

SillyTavern is the first official runtime target for RP Module Forge, but it is not a separate rules engine. The integration must consume the shared canonical config and Prompt Engine.

See [`../../docs/RUNTIME_SYSTEM_SPEC.md`](../../docs/RUNTIME_SYSTEM_SPEC.md) for the normative runtime contract.

## Product role

The Web App remains the primary assembly surface. The SillyTavern adapter is the runtime surface that lets a configured system stay visible and controllable during play.

Conceptually:

```text
Web App / imported manifest
          ↓
shared RP Module Forge core
          ↓
SillyTavern adapter
          ↓
approved current-chat context
          ↓
the model already configured in SillyTavern
```

## Intended capabilities

- import / inspect a Forge manifest;
- show resident, on-demand, and disabled systems;
- select Light / Standard / Full token mode;
- temporarily expand an on-demand capability;
- show why a capability or Traveler Forum note was activated;
- inject normalized rules through a documented SillyTavern mechanism;
- withdraw temporary instructions after the event while retaining accepted RP outcomes;
- preserve Web App manifest compatibility;
- respect per-chat scope and explicit user controls.

## Credential boundary

The adapter should use the model provider already configured by the active SillyTavern session.

It must **not**:

- ask for a second API key merely for RP Module Forge;
- store model credentials in Forge manifests;
- proxy model traffic through a Forge-owned server;
- silently read unrelated chats.

## Decisions still required before implementation

- exact supported injection targets and priority order;
- World Info / Author's Note / system-prompt interaction;
- per-character vs per-chat persistence;
- lifecycle for temporary module activation;
- token estimation policy;
- how accepted RP outcomes update session state;
- compatibility strategy across SillyTavern versions.
