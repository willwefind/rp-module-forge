# Prompt Output Specification V0

All exports come from the same canonical config.

## 1. One-line invocation

Minimal reminder when the current session already knows the system.

## 2. Compact prompt

Must include:
- identity and permissions
- active capability modules
- active expert packs
- non-omniscience rule
- fact / inference separation
- host-final-decision rule

## 3. Full prompt

Must include:
- module fiction / origin
- runtime model
- identity permissions
- selected modules
- expert behavior
- evidence rules
- adversarial reasoning
- traveler-note style
- UI examples
- forbidden behaviors
- session patch

## 4. Manifest

Suggested shape:

```json
{
  "schemaVersion": 1,
  "worldPack": "ancient-china",
  "role": "emperor",
  "modules": ["administration", "fiscal"],
  "experts": ["zhang-juzheng", "wang-yangming"],
  "legacyNotes": true,
  "omniscience": false,
  "hostFinalDecision": true,
  "sessionPatch": ""
}
```
