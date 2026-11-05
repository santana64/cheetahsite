# Self-hosted CheetahSoft typography

Archivo (display), Inter Tight (interface), IBM Plex Mono (data) are bundled
under their respective SIL Open Font License 1.1 files in this directory.
The original authors and copyright statements are retained in those licenses
and in font naming tables. No font service is contacted at build or runtime.

`next/font/local` generates first-party asset URLs and `font-display: swap`.
The display/UI families are preloaded; the three monospace weights load only
when used. Variable weights remain available. Archivo and Inter Tight use Latin WOFF2 subsets (240,232 bytes total).
IBM Plex Mono retains its original, unmodified TTF files because its OFL
reserves the name Plex. Monospace files are not preloaded.

`sources.json` pins the official Google Fonts repository commit, source URLs,
original and artifact SHA-256 checksums, unicode ranges and tool versions. The two WOFF2 files
are subsets for Latin text, French accented characters, punctuation, currency,
arrows and the minus sign. Broader scripts require new subsets and QA.

## Optional regeneration

Normal development and CI need only the committed font files. To reproduce:

```sh
python3 -m venv /tmp/cheetah-font-venv
/tmp/cheetah-font-venv/bin/pip install fonttools==4.61.1 brotli==1.2.1
/tmp/cheetah-font-venv/bin/python scripts/rebuild-fonts.py
```

Run from the repository root. Network access is limited to the source URLs in
`sources.json` (`raw.githubusercontent.com`). TLS and checksums are mandatory.
The script verifies all artifacts before replacing any committed file.

## Control Field V2 optimized variants

The application now loads Archivo-Display.woff2 (width pinned at100, weights600–900),
InterTight-UI.woff2 (weights400–700), and ControlFieldMono-{Regular,Medium,SemiBold}.woff2.
The first two preserve their existing Latin/symbol glyph set; only unused variation
ranges are removed. The mono files are WOFF2 Latin/symbol subsets of the original
IBM Plex Mono sources. Their family/PostScript names are changed to **Control Field
Mono** to respect the reserved Plex name; they are not claimed as an independently
designed typeface. Original copyright, authorship and OFL terms still apply.

Original source files and licenses are retained. `variants.json` records input hashes,
recipes and approved output hashes. Run `python3 scripts/optimize-fonts.py` with the
pinned FontTools4.61.1/Brotli1.2.1 after source reconstruction. It verifies every input
and output before replacing any optimized asset. Payload of the five loaded font
files:170260bytes instead of652732bytes; actual route transfer depends on weights used.
