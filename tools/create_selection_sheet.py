import json
import math
from pathlib import Path
from PIL import Image, ImageDraw


def build():
    project = Path(__file__).resolve().parents[1]
    data = json.loads((project / 'dist/gallery-data.js').read_text().removeprefix('export const gallery = ').rstrip(';\n'))
    output = project / 'docs' / 'seleccion'
    output.mkdir(exist_ok=True)
    overview = Image.new('RGB', (1600, math.ceil(len(data['sessions']) / 5) * 350 + 45), 'white')
    overview_draw = ImageDraw.Draw(overview)
    overview_draw.text((12, 12), f"ERU FRIAS | {len(data['photos'])} photographs | {len(data['sessions'])} albums | maximum 12 per album", fill='#102a5c')
    report = ['# Selección visual actual', '', 'Generada con `python3 tools/create_selection_sheet.py` a partir de las galerías exportadas. Cada hoja muestra todas las fotografías de un álbum, con sus identificadores estables.', '']
    for session_index, session in enumerate(data['sessions']):
        photos = [photo for photo in data['photos'] if photo['session'] == session['id']]
        canvas = Image.new('RGB', (1280, math.ceil(len(photos) / 4) * 285 + 40), 'white')
        draw = ImageDraw.Draw(canvas)
        draw.text((12, 10), f"ERU FRIAS | {session['title']} | {len(photos)} photographs", fill='#102a5c')
        for index, photo in enumerate(photos):
            with Image.open(project / 'dist/assets/photos' / f"{photo['id']}-480.webp") as original:
                picture = original.convert('RGB')
                picture.thumbnail((310, 245))
                column, row = index % 4, index // 4
                canvas.paste(picture, (column * 320 + (320 - picture.width) // 2, row * 285 + 40))
            draw.text((column * 320 + 8, row * 285 + 292), photo['id'], fill='#102a5c')
        canvas.save(output / f"{session['id']}.jpg", quality=88)
        report += [f"## {session['title']} — {len(photos)} fotografías", '', f"![{session['title']}](seleccion/{session['id']}.jpg)", '']
        with Image.open(project / 'dist/assets/photos' / f"{session['cover']}-480.webp") as cover:
            picture = cover.convert('RGB')
            picture.thumbnail((310, 290))
            column, row = session_index % 5, session_index // 5
            overview.paste(picture, (column * 320 + (320 - picture.width) // 2, row * 350 + 45))
        overview_draw.text((column * 320 + 8, row * 350 + 339), f"{session['title']} | {len(photos)}", fill='#102a5c')
    overview.save(project / 'docs/seleccion.jpg', quality=88)
    (project / 'docs/SELECCION_VISUAL.md').write_text('\n'.join(report))
    print(f"Updated selection overview and {len(data['sessions'])} complete album sheets")


if __name__ == '__main__':
    build()
