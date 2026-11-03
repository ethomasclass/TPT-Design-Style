#!/usr/bin/env python3
"""Download Google Fonts as local .woff2 files and write a fonts.css next to them.

  python3 fetch_fonts.py <out_dir> "Rye" "Alfa Slab One" "Atkinson Hyperlegible:400,700" "Playfair Display:700,900"

Local fonts render reliably in headless Chromium (the Google Fonts CDN is often blocked or slow
there) and keep exported images identical every time. Link the result with
<link rel="stylesheet" href="fonts/fonts.css"> from a page in <out_dir>/..
"""
import os, re, subprocess, sys, urllib.parse

out = sys.argv[1]
specs = sys.argv[2:]
if not specs:
    sys.exit(__doc__)
os.makedirs(out, exist_ok=True)
fams = []
for spec in specs:
    name, _, weights = spec.partition(':')
    fams.append('family=' + urllib.parse.quote_plus(name) + (f':wght@{";".join(weights.split(","))}' if weights else ''))
url = 'https://fonts.googleapis.com/css2?' + '&'.join(fams) + '&display=swap'
ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
ca = ['--cacert', '/root/.ccr/ca-bundle.crt'] if os.path.exists('/root/.ccr/ca-bundle.crt') else []
css = subprocess.run(['curl', '-sSf', *ca, '-A', ua, url], capture_output=True, text=True, check=True).stdout
lines = ['/* Local copies of Google Fonts (latin subset). */']
for sub, body in re.findall(r'/\* (\S+) \*/\s*@font-face \{(.*?)\}', css, re.S):
    if sub != 'latin':
        continue
    fam = re.search(r"font-family: '([^']+)'", body).group(1)
    style = re.search(r'font-style: (\w+)', body).group(1)
    wt = re.search(r'font-weight: (\d+)', body).group(1)
    src = re.search(r'url\((\S+?)\)', body).group(1)
    fn = f"{fam.lower().replace(' ', '-')}-{wt}{'-italic' if style == 'italic' else ''}.woff2"
    subprocess.run(['curl', '-sSf', *ca, '-o', os.path.join(out, fn), src], check=True)
    lines.append(f"@font-face {{ font-family: '{fam}'; font-style: {style}; font-weight: {wt}; font-display: block; src: url({fn}) format('woff2'); }}")
open(os.path.join(out, 'fonts.css'), 'w').write('\n'.join(lines) + '\n')
print(f'{len(lines) - 1} font faces -> {out}/fonts.css')
