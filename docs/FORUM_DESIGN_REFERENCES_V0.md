# Forum Design References V0

Status: **design research note**  
Last updated: 2026-09-04

This note records the structural forum references used for the forum-first concept. It intentionally borrows interaction patterns rather than visual branding.

## Discourse

Reference: https://meta.discourse.org/categories

Borrow:

- category / tag navigation around a topic-first center column;
- dense topic listing as the default community surface;
- replies and chronology living inside the topic rather than on separate product cards;
- side navigation that keeps destinations reachable without dominating the reading area.

Do not copy:

- default Discourse brand styling;
- generic SaaS card density;
- category colors as the only way to distinguish meaning.

## V2EX

Reference: https://www.v2ex.com/help/node

Borrow:

- one primary Node / section per topic;
- clear primary classification that remains easy to understand;
- separate short URL / stable machine identity from the human-facing node name.

Use in our product:

- one forum primary section;
- cross-cutting identities / routes / situations expressed through tags instead of multiple primary sections.

## Stack Overflow

Reference: https://stackoverflow.com/help/tagging

Borrow:

- tags as cross-cutting discovery and filtering metadata;
- narrow tag meaning rather than vague decorative labels;
- tag browsing independent of the primary category.

Use in our product:

- identity tags;
- Agenda / development-route tags;
- capability / situation tags;
- review / reliability labels where they improve discovery.

Do not let tags become permission sources.

## Hacker News

Reference: https://news.ycombinator.com/

Borrow:

- high scan density;
- title-first rows;
- compact secondary metadata;
- many useful choices visible in one screen.

Do not copy:

- bare visual treatment;
- ultra-small typography;
- minimal interaction affordances that would hide our module and reliability semantics.

## Synthesis for 天道降维互助论坛

The working formula is:

**Discourse community shell + V2EX primary-node clarity + Stack Overflow tag dimension + Hacker News scan density + our own Night Archive / paper-lacquer visual language.**

The result should feel like a long-running traveler archive forum, not a reskinned modern SaaS dashboard and not a nostalgic Discuz clone.