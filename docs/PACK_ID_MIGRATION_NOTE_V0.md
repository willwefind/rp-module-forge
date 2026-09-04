# Pack ID Migration Note V0

Status: **compatibility note / migration deferred**  
Last updated: 2026-09-04

The first product-facing pack is now presented as:

```text
东方古代 → 架空王朝
```

The current stable engineering identifiers remain:

```text
worldPack.id = ancient-china
permission profile ids = ancient-china:...
repository package path = packages/pack-ancient-china/
```

This mismatch is intentional for the current checkpoint.

Human-facing labels may change without mutating stable machine identity. Renaming the machine IDs is a separate migration task because those IDs are already referenced by manifests, legacy migration, permission profiles, forum data, tests and exports.

A future migration must include:

1. one chosen new stable pack ID;
2. deterministic `ancient-china` → new-ID import migration;
3. permission-profile ID mapping;
4. Traveler Forum world-pack/provenance migration;
5. compatibility fixtures for old manifests;
6. no permission change caused by migration;
7. explicit schema/version policy if required.

Until then:

- ordinary UI should say **架空王朝**;
- docs should describe it under the **东方古代** Realm;
- machine-facing JSON may still expose `ancient-china`;
- no code should infer that 武侠 / 修仙 share this pack merely because they live in the same Realm.
