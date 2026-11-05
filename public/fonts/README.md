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
