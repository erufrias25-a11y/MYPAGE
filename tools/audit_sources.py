import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path


def audit(source):
    project = Path(__file__).resolve().parents[1]
    permitted = ['Photos-1-001'] + [f'Photos-1-001 ({number})' for number in range(1, 14)] + ['Photos Jazm 2', 'Photos say', 'Photos-3-001'] + [f'sesion {number}' for number in range(16, 21)] + ['sesion 21 poner de primera', 'sesion 22', 'sesion 23']
    selected = json.loads((project / 'curation.json').read_text())['sessions']
    selected_paths = {f"{photo.get('folder', session['folder'])}/{photo['file']}" for session in selected for photo in session['files']}
    fingerprints = defaultdict(list)
    folders = []
    for name in permitted:
        directory = source / name
        files = sorted(path for path in directory.iterdir() if path.is_file() and path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'})
        for path in files:
            digest = hashlib.sha256()
            with path.open('rb') as stream:
                for chunk in iter(lambda: stream.read(1024 * 1024), b''):
                    digest.update(chunk)
            fingerprints[digest.hexdigest()].append(f'{name}/{path.name}')
        folders.append({'folder': name, 'direct_photographs': len(files), 'selected': sum(path.startswith(name + '/') for path in selected_paths)})
    duplicates = [paths for paths in fingerprints.values() if len(paths) > 1]
    for paths in duplicates:
        if len(set(paths) & selected_paths) > 1:
            raise ValueError(f'Duplicated selection: {paths}')
    path_hashes = {path: digest for digest, paths in fingerprints.items() for path in paths}
    selected_records = [{'id': photo['id'], 'session': session['id'], 'folder': photo.get('folder', session['folder']), 'file': photo['file'], 'sha256': path_hashes[f"{photo.get('folder', session['folder'])}/{photo['file']}"]} for session in selected for photo in session['files']]
    result = {'scope': '25 authorized sibling folders directly inside Downloads; no nested folders counted', 'folders': folders, 'photographs': sum(folder['direct_photographs'] for folder in folders), 'unique_file_contents': len(fingerprints), 'duplicate_copies': sum(len(paths) - 1 for paths in duplicates), 'exact_duplicate_groups': duplicates, 'selected': len(selected_paths), 'selected_duplicate_files': 0}
    destination = project / 'docs'
    destination.mkdir(exist_ok=True)
    (destination / 'source-audit.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    (destination / 'selection-audit.json').write_text(json.dumps({'maximum_per_session': 20, 'photos': selected_records}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: value for key, value in result.items() if key != 'exact_duplicate_groups'}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Read-only audit of the 25 authorized sibling photography folders')
    parser.add_argument('--source', type=Path, required=True)
    arguments = parser.parse_args()
    audit(arguments.source.expanduser())
