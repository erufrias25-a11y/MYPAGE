import argparse
import json
from pathlib import Path
from PIL import Image, ImageOps


def prepare(source, only_missing=False):
    project = Path(__file__).resolve().parents[1]
    manifest = json.loads((project / 'curation.json').read_text())
    destination = project / 'dist' / 'assets' / 'photos'
    destination.mkdir(parents=True, exist_ok=True)
    sessions = []
    photos = []
    original_bytes = 0
    for session in manifest['sessions']:
        public_session = {key: session[key] for key in ['id', 'title', 'category', 'description']}
        public_session['cover'] = f"{session['id']}-01"
        sessions.append(public_session)
        for number, entry in enumerate(session['files'], 1):
            original_path = source / entry.get('folder', session['folder']) / entry['file']
            original_bytes += original_path.stat().st_size
            identifier = entry['id']
            with Image.open(original_path) as original:
                width, height = original.size
                if original.getexif().get(274) in {5, 6, 7, 8}:
                    width, height = height, width
                sizes = [(limit, quality) for limit, quality in [(480, 78), (960, 83), (1920, 87)] if not only_missing or not (destination / f'{identifier}-{limit}.webp').exists()]
                if sizes:
                    original.draft('RGB', (3840, 3840))
                    original.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                    picture = ImageOps.exif_transpose(original).convert('RGB')
                    for limit, quality in sizes:
                        resized = picture.copy()
                        resized.thumbnail((limit, limit), Image.Resampling.LANCZOS)
                        resized.save(destination / f'{identifier}-{limit}.webp', 'WEBP', quality=quality, method=6)
            photos.append({'id': identifier, 'session': session['id'], 'alt': entry['alt'], 'width': width, 'height': height})
        print(f"Ready: {session['id']} ({len(session['files'])})", flush=True)
    data = {'sessions': sessions, 'photos': photos}
    temporary = project / 'dist' / 'gallery-data.js.tmp'
    temporary.write_text('export const gallery = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
    temporary.replace(project / 'dist' / 'gallery-data.js')
    output_bytes = sum(path.stat().st_size for path in destination.glob('*.webp'))
    print(f'{len(photos)} photographs, {len(sessions)} sessions, {len(photos) * 3} WebP files')
    print(f'Original selection: {original_bytes / 1024 / 1024:.1f} MB; web assets: {output_bytes / 1024 / 1024:.1f} MB')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Create web copies of the curated photographs; originals are only read.')
    parser.add_argument('--source', type=Path, required=True, help='Directory containing the original session folders')
    parser.add_argument('--only-missing', action='store_true', help='Keep existing web copies when adding photographs without changing their sources')
    arguments = parser.parse_args()
    prepare(arguments.source.expanduser(), arguments.only_missing)
