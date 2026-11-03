#!/usr/bin/env node
// Render a TpT listing image from an HTML file to PNG, plus a small copy for the legibility check.
//
//   node render.mjs <page.html> <width> <height> <out.png> [--small 300]
//
// The page is opened straight from disk (file://), so images and fonts referenced with relative
// paths just work. The small copy (default 300 px wide) shows roughly how the image looks in TpT
// search results: if the title isn't readable there, it's too small.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [html, w, h, out, ...rest] = process.argv.slice(2);
if (!html || !w || !h || !out) {
  console.error('usage: node render.mjs <page.html> <width> <height> <out.png> [--small 300]');
  process.exit(1);
}
const smallW = rest[0] === '--small' ? Number(rest[1]) : 300;

let chromium;
try { ({ chromium } = await import('playwright')); } catch {
  const root = execSync('npm root -g').toString().trim();
  ({ chromium } = createRequire(root + '/')('playwright'));
}
const pre = '/opt/pw-browsers/chromium';                       // preinstalled on Claude's cloud machines
const browser = await chromium.launch(existsSync(pre) && !process.env.PLAYWRIGHT_BROWSERS_PATH ? { executablePath: pre } : {});
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const problems = [];
page.on('pageerror', (e) => problems.push('page error: ' + e.message));
page.on('requestfailed', (r) => problems.push('failed to load: ' + r.url()));
await page.goto(pathToFileURL(resolve(html)).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// Every font family the page actually uses must be loaded; otherwise text silently falls back.
const missing = await page.evaluate(() => {
  const used = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    used.add(JSON.stringify([cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, ''), cs.fontWeight, cs.fontStyle]));
  }
  const generic = ['serif', 'sans-serif', 'cursive', 'monospace', 'system-ui', 'Georgia', 'Arial', 'Impact'];
  return [...used].map((u) => JSON.parse(u)).filter(([f, w, st]) => !generic.includes(f) && !document.fonts.check(`${st} ${w} 20px "${f}"`))
    .map(([f, w]) => `${f} ${w}`);
});
if (missing.length) problems.push('fonts not loaded (text is falling back): ' + [...new Set(missing)].join(', '));
const overflow = await page.evaluate(() => {
  const W = innerWidth, H = innerHeight, bad = [];
  for (const el of document.querySelectorAll('[data-check]')) {
    const r = el.getBoundingClientRect();
    if (r.left < 0 || r.top < 0 || r.right > W || r.bottom > H) bad.push(el.dataset.check);
    if (el.scrollWidth > el.clientWidth + 1) bad.push(el.dataset.check + ' (text wider than its box)');
  }
  return bad;
});
if (overflow.length) problems.push('outside the canvas: ' + overflow.join(', '));
await page.waitForTimeout(300);
await page.screenshot({ path: out });
const small = out.replace(/\.png$/i, '') + `-${smallW}px.png`;
const sp = await browser.newPage({ viewport: { width: smallW, height: Math.round((smallW * h) / w) } });
await sp.setContent(`<body style="margin:0"><img src="data:image/png;base64,${readFileSync(out).toString('base64')}" style="width:100%;display:block"></body>`);
await sp.evaluate(() => document.querySelector('img').decode());
await sp.screenshot({ path: small });
await browser.close();
console.log(`wrote ${out} (${w}x${h}) and ${small}`);
if (problems.length) { console.log('CHECK:\n  ' + problems.join('\n  ')); process.exitCode = 2; }
