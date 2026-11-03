---
name: tpt-listing
description: Create Teachers Pay Teachers (TpT) listing materials for a classroom product - a square thumbnail/cover image, 16:9 preview images (the product, and the printables), and a short product description formatted to paste straight into TpT's description box. Use whenever the user asks for a TpT thumbnail, cover, preview slides or images, product listing, product description, or marketing images for a lesson, game, worksheet or resource they sell or plan to sell, even if they only say "make it look like my other listings" or share examples of covers.
---

# TpT listing: thumbnail, previews and description

Produces, for one product:

| File | Size | What it is |
|---|---|---|
| `thumbnail.png` | 2000 × 2000 | Square cover shown in TpT search and on the product page |
| `preview.png` | 1920 × 1080 | The product itself: real screenshots plus a feature list |
| `preview-printables.png` | 1920 × 1080 | Real printable pages side by side, each named |
| `description.txt` | ~300 words | Paste-ready plain text with symbol headers |

Each image is built as an HTML page and rendered to PNG with Playwright, so it can be edited and
re-rendered in seconds. Work in a `tpt/` folder inside the user's project (e.g. `brand/tpt/`) and keep
the HTML sources next to the PNGs, so the user can ask for changes later.

## 1. Gather the facts first

Collect these before designing. Read the product itself (its files, the website, the handouts) rather
than asking for what you can look up. Ask only for what you can't find.

- **Product name** and the **subject buyers search for** (the unit or topic, e.g. "Transportation
  Revolution"). The subject is often more important to buyers than the product name.
- **Grades, subject, time needed, tech needed** (projector? Chromebooks? logins?).
- **Everything included**, with counts: pages, questions, activities, screens, answer keys, lesson plan.
- **Concepts taught**, with the named examples, laws, cases and dates the product actually covers.
- **Visual assets:** character art, logos, mascots, screenshots, handout page images. If the product is a
  website or app, take fresh screenshots with Playwright at 1600 × 900 and device scale 1.5.
- **The seller's existing covers** (examples they share). The new one should be a *different style*
  from those, but at the same quality level.
- **Anything they want featured** (specific characters, an object like a ship or train).

## 2. Pick a style

Choose one from `reference/styles.md` that fits the topic and differs from the seller's recent covers.
Say in one line which style you chose and why. Use the same palette and fonts for all three images.

Fonts: download them locally once, into the folder that holds the HTML:

```bash
python3 <skill>/scripts/fetch_fonts.py brand/tpt/fonts "Rye" "Alfa Slab One" "Lobster" "Atkinson Hyperlegible:400,700"
```

## 3. Build the images

Copy the templates from `templates/` into the work folder, then fill and restyle them:

- `thumbnail.html`: kicker ribbon → product name → **subject banner** → tagline → characters with speech
  bubbles + a "what you get" ticket → a hero object → real sample pages fanned from a corner →
  grade/tech pills.
- `preview.html`: a feature panel on the left (name, subject, 4–5 "bold claim + small proof" lines),
  real screenshots on the right with short labels, one real handout.
- `printables.html`: the real printable pages in a row, each with a name and a one-line purpose.

Render each one:

```bash
node <skill>/scripts/render.mjs brand/tpt/thumbnail.html 2000 2000 brand/tpt/thumbnail.png
node <skill>/scripts/render.mjs brand/tpt/preview.html 1920 1080 brand/tpt/preview.png
node <skill>/scripts/render.mjs brand/tpt/printables.html 1920 1080 brand/tpt/preview-printables.png
```

`render.mjs` also writes a `-300px.png` copy (about TpT search-result size) and prints a **CHECK** list
if fonts failed to load, an image is missing, or an element marked `data-check` runs off the canvas.

## 4. Look at every render before showing it

Open the PNG **and** the 300px copy with the Read tool after every render. Fix and re-render until all of
these are true. The first render is almost never right; collisions and clipped titles are common.

- [ ] The subject (e.g. TRANSPORTATION REVOLUTION) is readable in the 300px copy, not only the product name.
- [ ] Nothing overlaps that shouldn't: title vs. dates, characters vs. text, labels vs. each other.
- [ ] No text is cut off at an edge or by another element; no word is hidden behind smoke, a sheet, etc.
- [ ] Every screenshot and page is real and current (re-capture if the product changed).
- [ ] Characters' faces are large and unobstructed; speech bubbles point at the right person.
- [ ] Lots of dark-on-light contrast; no small light text on a busy background.
- [ ] The thumbnail says what the buyer gets (e.g. "Interactive website + reading & worksheets").

## 5. Write the description

Start from `templates/description.txt`. Rules:

- **Paste-ready plain text.** No markdown (`**`, `#`, `|` tables). Use capitals for headers, ━ dividers,
  ①②③ for steps, ✔ for included items, • for bullets. Show it in the reply inside a code block so the
  user can copy it exactly, and save it as `description.txt`.
- **Short:** about 250–350 words. Sections: hook → How it works → What's included → Concepts taught
  (+ a one-line Skills list) → Grades / Time / Tech.
- **Concepts taught** lists the actual historical (or subject) content, with the named examples, laws,
  court cases and dates. Buyers and admins search for these terms.
- **Every claim matches the product.** Counts, page numbers, grade levels and features must be true
  right now. Check them against the files.
- **AI disclosure:** if voices or art were AI-generated, include one plain sentence saying so, and tell
  the user to check TpT's current policy on whether it is required.
- After pasting, the user should preview the listing; if a symbol shows as a box, swap it for a plain one.

## 6. Watch for these before calling it done

- **Trademarks.** Don't put TV show, brand, or character names you don't own (e.g. "Shark Tank") in the
  images, the title or the description. Describe the idea instead ("students are the sharks", "a
  pitch-and-invest game"). If the user's own handouts use a trademark in their title, point it out.
- **Mismatches between the parts of the product.** Compare the handouts with the website or slides:
  formulas, labels, numbers, facts and dates. If a worksheet says one thing and the screen shows another,
  stop and ask which one to change before making the listing promise either.
- **Spoilers.** Answer keys, reveal results and payouts stay out of the previews.
- **Private details.** Don't show passwords, logins, students' names or private links in screenshots or
  the description. Tell the user where buyers get access (usually inside the purchased PDF).

## 7. Deliver

Send the three PNGs and `description.txt` with SendUserFile (if available), paste the description in a
code block, and keep each source HTML next to its PNG so later tweaks ("make the subject bigger", "add
handout samples at the bottom") are a quick edit and re-render. Commit them if the folder is a git repo
the user is working in.

See `examples/` for a finished set (The Tank, a Transportation Revolution game) to calibrate quality.
