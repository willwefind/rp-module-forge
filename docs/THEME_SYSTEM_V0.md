# Theme System V0 · 日间 / 夜间 / 护眼

Status: **design token proposal for forum-first prototype**  
Last updated: 2026-09-04

## 1. Principle

The three themes are not three unrelated skins. They are three values for the same semantic UI roles.

The product must be able to switch themes without changing information hierarchy, interaction meaning, reliability semantics, selected states, or world-pack identity.

```text
Theme = light conditions + surface treatment
Meaning = stable semantic tokens
```

Ancient China contributes atmosphere through paper, lacquer, cinnabar, tea-brown, sage and brass-like accents. It must not turn status semantics into decorative colors whose meaning changes by theme.

## 2. Theme names

- **日间｜纸白档案** — warm paper, high clarity, daylight reading.
- **夜间｜夜档** — lacquer-dark shell, warm dark reading surfaces, brightened cinnabar.
- **护眼｜青笺** — muted sage-grey paper, reduced glare, lower blue/white intensity for long reading.

The user-facing control should show all three directly. Do not bury eye-care mode behind a settings page.

Theme preference may persist locally. In V0 the saved preference is presentation-only and must never enter the canonical RP manifest.

## 3. Semantic tokens

Minimum shared token set:

```css
--surface-app
--surface-nav
--surface-panel
--surface-raised
--surface-reading
--surface-selected
--text-primary
--text-secondary
--text-muted
--text-inverse
--border-subtle
--border-strong
--action-primary
--action-primary-text
--action-hover
--accent-pack
--accent-pack-soft
--status-good
--status-good-soft
--status-warn
--status-warn-soft
--status-danger
--status-danger-soft
--shadow-soft
--focus-ring
```

Forum-specific components should consume these roles instead of hard-coded palette names.

## 4. Palette A · 日间｜纸白档案

| Role | Value |
| --- | --- |
| App background | `#F4EFE5` |
| Navigation / quiet surface | `#ECE4D8` |
| Main reading panel | `#FFFDF8` |
| Raised surface | `#FFFFFF` |
| Primary text | `#201A17` |
| Secondary text | `#4E443E` |
| Muted text | `#6E625A` |
| Border subtle | `#D8CFC2` |
| Border strong | `#B9AB9A` |
| Primary cinnabar | `#94362B` |
| Cinnabar soft | `#F1DEDA` |
| Brass accent | `#A47D43` |
| Focus ring | `#7C2B23` |

Approximate WCAG contrast checks:

- primary text / app background: **15.00:1**;
- primary text / reading panel: **16.91:1**;
- muted text / reading panel: **5.81:1**;
- white / primary cinnabar: **7.44:1**.

## 5. Palette B · 夜间｜夜档

| Role | Value |
| --- | --- |
| App background | `#15110F` |
| Navigation / quiet surface | `#1A1512` |
| Main reading panel | `#211B18` |
| Raised surface | `#2A221E` |
| Primary text | `#F3EBDD` |
| Secondary text | `#D9CEC1` |
| Muted text | `#B8ADA2` |
| Border subtle | `#3A302A` |
| Border strong | `#5B4B42` |
| Primary cinnabar | `#C85F4B` |
| Cinnabar soft | `#3B211D` |
| Brass accent | `#C09A5A` |
| Focus ring | `#E08570` |

Approximate WCAG contrast checks:

- primary text / app background: **15.85:1**;
- primary text / reading panel: **14.37:1**;
- muted text / reading panel: **7.72:1**;
- deep-ink text / primary cinnabar: **4.57:1**.

Night mode should not simply invert the day palette. Reading panels remain warm, and saturated red is brightened enough to keep controls legible.

## 6. Palette C · 护眼｜青笺

| Role | Value |
| --- | --- |
| App background | `#E2E7D8` |
| Navigation / quiet surface | `#D8DECE` |
| Main reading panel | `#EDF1E5` |
| Raised surface | `#F4F6EF` |
| Primary text | `#243028` |
| Secondary text | `#465148` |
| Muted text | `#59655D` |
| Border subtle | `#C4CDBB` |
| Border strong | `#9EAA98` |
| Primary cinnabar | `#804238` |
| Cinnabar soft | `#E2CDC6` |
| Muted olive / brass accent | `#81765B` |
| Focus ring | `#6B352E` |

Approximate WCAG contrast checks:

- primary text / app background: **10.90:1**;
- primary text / reading panel: **11.98:1**;
- muted text / reading panel: **5.32:1**;
- white / primary cinnabar: **7.62:1**.

Eye-care mode is intentionally **sage-grey and low-glare**, not a yellow overlay. It should remain visually designed rather than looking like a browser accessibility filter.

## 7. Status semantics

Status meaning must remain stable across all three themes.

Suggested semantic families:

- confirmed / corroborated / approved → restrained ink-green;
- contested / caution → ochre / tea-gold;
- deprecated / rejected / dangerous → cinnabar / muted red;
- archived / superseded → neutral grey / reduced emphasis.

The exact colors may vary by theme, but the same state must never swap semantic family merely for aesthetics.

## 8. Forum component behavior

### Topic rows

Use surface changes sparingly. The default forum list relies on dividers, typography, small seals and metadata rather than giant cards.

Selected / keyboard-focused rows may use `--surface-selected` plus a visible focus ring.

### Module release topics

A module release receives a small attachment / brass cue and a stronger title hierarchy, not a completely separate marketplace card language.

### Curated notes

老乡遗言库 entries should look more archival and reviewed than raw topics, but not more authoritative than current-world evidence.

### Maintainer notices

Maintenance records may use a narrow cinnabar rule / seal and marginal-note styling.

## 9. Motion and theme switching

Theme switching should be immediate but not jarring.

- animate surface and text colors around `120–180ms`;
- do not animate layout, font size or content position during theme change;
- respect `prefers-reduced-motion`;
- persist the explicit user choice locally.

## 10. Production acceptance

Before these tokens replace production Web styling:

1. test desktop and mobile forum prototype in all three themes;
2. verify hover, selected, focus-visible, disabled, archived, approved, contested and dangerous states;
3. manually inspect long Chinese reading passages, dense topic lists and code/JSON attachments;
4. ensure eye-care mode is still readable in brighter environments and night mode is not low-contrast;
5. confirm theme changes never alter canonical config or module data.