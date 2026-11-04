# TpT Design Style

A Claude skill for making **Teachers Pay Teachers listings**: a square thumbnail, 16:9 preview images, and a
paste-ready product description, all built to the same quality bar and checked before they're delivered.

| Output | Size |
|---|---|
| Thumbnail / cover | 2000 × 2000 |
| Product preview (real screenshots + feature list) | 1920 × 1080 |
| Printables preview (real handout pages) | 1920 × 1080 |
| Description (plain text with symbol headers, ~300 words) | `description.txt` |

![Example thumbnail](.claude/skills/tpt-listing/examples/the-tank-thumbnail.jpg)

## Install

**Everywhere (claude.ai, the desktop app, Claude Code on the web):** download
[`tpt-listing-skill.zip`](tpt-listing-skill.zip) and upload it in Claude's settings, under Capabilities → Skills.

**In Claude Code:** sessions that include this repo load the skill automatically from
`.claude/skills/tpt-listing/`. To use it in every project on your computer, copy that folder to
`~/.claude/skills/tpt-listing/`.

Then ask for something like *"make a TpT thumbnail, previews and description for this product"*.

## What's inside

```
.claude/skills/tpt-listing/
  SKILL.md              the workflow: gather facts, pick a style, build, check, describe, deliver
  reference/styles.md   eight distinct cover styles (playbill, pop burst, newspaper, field journal, ...)
  templates/            thumbnail.html, preview.html, printables.html, description.txt
  scripts/render.mjs    HTML -> PNG with font, missing-image and overflow checks + a 300px search-size copy
  scripts/fetch_fonts.py  downloads Google Fonts as local files for reliable rendering
  examples/             a finished listing (The Tank, a Transportation Revolution game)
```

Rendering needs Node with Playwright (preinstalled on Claude's cloud machines) and `curl` for fonts.

## Logo

The Well Rounded Social Studies logo lives in `brand/logo/`:

| File | Use |
|---|---|
| `wrss-logo-navy.png` | 1080 × 1080, globe on a navy square. Use where the logo sits on its own. |
| `wrss-logo-transparent.png` | 1080 × 1080, globe and stand on a transparent background. Use on the navy lesson plan header and other navy surfaces. |

The logo goes on TpT images and teacher docs only, never on student pages.

## Updating the zip

After editing the skill, rebuild the upload file from the repo root:

```bash
cd .claude/skills && zip -r ../../tpt-listing-skill.zip tpt-listing && cd ../..
```
