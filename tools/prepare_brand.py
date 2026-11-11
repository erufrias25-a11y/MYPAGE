import argparse
import shutil
from pathlib import Path


def prepare(source):
    project = Path(__file__).resolve().parents[1]
    destination = project / 'dist' / 'assets' / 'brand'
    destination.mkdir(parents=True, exist_ok=True)
    for original, exported in [('ERU  FRIAS.png', 'logo.png'), ('Relleno de color 2.png', 'mark.png')]:
        shutil.copyfile(source / original, destination / exported)
    print('Brand assets copied without changing the originals: logo.png, mark.png')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Copy the supplied identity assets into the website')
    parser.add_argument('--source', type=Path, required=True)
    arguments = parser.parse_args()
    prepare(arguments.source.expanduser())
