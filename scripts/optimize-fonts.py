"""Reproduce the site's optimized fonts from already verified bundled sources.

Run after rebuild-fonts.py when sources need refreshing. FontTools/Brotli versions,
input SHA256, recipes, and approved output SHA256 are pinned in variants.json.
No network request or verification override is performed here. Original assets
and OFL licenses remain available. IBM-derived subsets use a new family name
because the upstream license reserves Plex.
"""
from pathlib import Path
import hashlib
import json
import tempfile
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent / 'public' / 'fonts'
manifest = json.loads((ROOT / 'variants.json').read_text())
unicodes = (
    list(range(0x250)) + list(range(0x1E00, 0x1F00))
    + list(range(0x2000, 0x2070)) + list(range(0x20A0, 0x20D0))
    + list(range(0x2190, 0x2200)) + [0x2212]
)
verified = []
with tempfile.TemporaryDirectory(prefix='cheetah-font-variants-') as directory:
    for item in manifest['fonts']:
        source = ROOT / item['source_file']
        if hashlib.sha256(source.read_bytes()).hexdigest() != item['source_sha256']:
            raise RuntimeError(f"Input checksum mismatch: {source.name}")
        font = TTFont(source, recalcTimestamp=False)
        axes = {key: tuple(value) if isinstance(value, list) else value for key, value in item['axes'].items()}
        if axes:
            # These sources already contain the approved Latin/symbol subset.
            font = instantiateVariableFont(font, axes, inplace=True)
        weight = item['renamed_mono_weight']
        if weight:
            names = {
                1: 'Control Field Mono', 2: weight,
                3: f'CheetahSoft:ControlFieldMono-{weight}:1.0',
                4: f'Control Field Mono {weight}', 6: f'ControlFieldMono-{weight}',
                16: 'Control Field Mono', 17: weight,
                21: 'Control Field Mono', 22: weight,
            }
            for record in font['name'].names:
                if record.nameID in names:
                    record.string = names[record.nameID].encode(record.getEncoding())
            options = subset.Options()
            options.flavor = 'woff2'
            options.name_IDs = ['*']
            options.recalc_timestamp = False
            selection = subset.Subsetter(options=options)
            selection.populate(unicodes=unicodes)
            selection.subset(font)
        font.flavor = 'woff2'
        font.recalcTimestamp = False
        target = Path(directory) / item['file']
        font.save(target)
        encoded = target.read_bytes()
        if hashlib.sha256(encoded).hexdigest() != item['artifact_sha256']:
            raise RuntimeError(f"Output checksum mismatch: {item['file']}; check tool versions")
        verified.append((item['file'], encoded))
    for name, encoded in verified:
        (ROOT / name).write_bytes(encoded)
        print(f'Verified {name}: {len(encoded)} bytes')
