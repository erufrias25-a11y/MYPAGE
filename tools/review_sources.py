import argparse
import hashlib
import json
import math
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw


def review(source, output):
    project = Path(__file__).resolve().parents[1]
    manifest = json.loads((project / 'curation.json').read_text())
    consolidated = {'jardin-de-recuerdos': ['Photos-1-001 (8)'], 'dulce-espera': ['Photos-3-001']}
    output.mkdir(parents=True, exist_ok=True)
    inventory = []
    for session in manifest['sessions']:
        candidates = []
        seen = set()
        folders = [session['folder']] + consolidated.get(session['id'], [])
        for folder in folders:
            for path in sorted((source / folder).iterdir()):
                if not path.is_file() or path.suffix.lower() not in {'.jpg', '.jpeg', '.png', '.webp'}:
                    continue
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                if digest in seen:
                    continue
                seen.add(digest)
                candidates.append({'folder': folder, 'file': path.name, 'sha256': digest})
        inventory.append({'id': session['id'], 'title': session['title'], 'candidates': candidates})
        canvas = Image.new('RGB', (1440, math.ceil(len(candidates) / 6) * 255 + 35), 'white')
        draw = ImageDraw.Draw(canvas)
        draw.text((10, 10), f"{session['id']} | {len(candidates)} unique source files", fill='#102a5c')
        for index, entry in enumerate(candidates):
            path = source / entry['folder'] / entry['file']
            column, row = index % 6, index // 6
            with Image.open(path) as original:
                original.draft('RGB', (460, 460))
                picture = ImageOps.exif_transpose(original).convert('RGB')
                picture.thumbnail((232, 216))
                canvas.paste(picture, (column * 240 + (240 - picture.width) // 2, row * 255 + 35))
            draw.text((column * 240 + 5, row * 255 + 255), f"{index:02d} {entry['file'][:29]}", fill='#102a5c')
        canvas.save(output / f"{session['id']}.jpg", quality=88)
        print(f"Ready: {session['id']} ({len(candidates)})", flush=True)
    (output / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Read-only contact sheets of authorized session sources, without exact duplicates')
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    arguments = parser.parse_args()
    review(arguments.source.expanduser(), arguments.output.expanduser())
