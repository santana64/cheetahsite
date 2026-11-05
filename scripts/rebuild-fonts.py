"""Optional font regeneration; ordinary Next.js builds use committed WOFF2 files.

Requires fonttools==4.61.1 and brotli==1.2.1. Uses the inherited HTTPS proxy and
normal certificate validation. Downloads must match the pinned source hashes.
"""
from pathlib import Path
import hashlib
import json
import tempfile
import urllib.request
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent / 'public' / 'fonts'
manifest = json.loads((ROOT / 'sources.json').read_text())
unicodes = (
    list(range(0x250)) + list(range(0x1E00, 0x1F00))
    + list(range(0x2000, 0x2070)) + list(range(0x20A0, 0x20D0))
    + list(range(0x2190, 0x2200)) + [0x2212]
)
with tempfile.TemporaryDirectory(prefix='cheetah-fonts-') as temp:
    generated = []
    for item in manifest['fonts']:
        with urllib.request.urlopen(item['source_url'], timeout=60) as response:
            original = response.read()
        if hashlib.sha256(original).hexdigest() != item['source_sha256']:
            raise RuntimeError(f"Source checksum mismatch: {item['file']}")
        source = Path(temp) / item['file'].replace('.woff2', '.ttf')
        source.write_bytes(original)
        if item['file'].endswith('.ttf'):
            # Preserve IBM's reserved family name by using unmodified originals.
            encoded = original
        else:
            options = subset.Options()
            options.flavor = 'woff2'
            options.name_IDs = ['*']
            font = subset.load_font(str(source), options)
            selection = subset.Subsetter(options=options)
            selection.populate(unicodes=unicodes)
            selection.subset(font)
            output = Path(temp) / item['file']
            subset.save_font(font, str(output), options)
            encoded = output.read_bytes()
        if hashlib.sha256(encoded).hexdigest() != item['artifact_sha256']:
            raise RuntimeError(f"Generated checksum mismatch: {item['file']}; check tool versions")
        generated.append((item['file'], encoded))
    # Do not replace any files until every artifact has passed verification.
    for filename, encoded in generated:
        (ROOT / filename).write_bytes(encoded)
        print(f'Verified {filename}: {len(encoded)} bytes')
