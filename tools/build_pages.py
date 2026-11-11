from pathlib import Path
from html import escape


def build():
    project = Path(__file__).resolve().parents[1]
    templates = project / 'templates'
    layout = (templates / 'layout.html').read_text()
    pages = [
        ('index.html', 'inicio.html', 'Inicio', 'ERU FRIAS — Fotografía', 'Todo lo que vemos tiene una historia detrás. Vivimos los momentos y guardamos los recuerdos a través de la fotografía.'),
        ('sesiones.html', 'sesiones.html', 'Sesiones', 'Sesiones — ERU FRIAS', 'Retrato, celebraciones, familia, gastronomía y arte, contados a través de la fotografía.'),
        ('sobre-mi.html', 'sobre-mi.html', 'Sobre mí', 'Sobre mí — ERU FRIAS', 'Conoce el trabajo fotográfico de ERU FRIAS.'),
        ('contacto.html', 'contacto.html', 'Contacto', 'Contacto — ERU FRIAS', 'Ponte en contacto con ERU FRIAS para conversar sobre tu próxima sesión o proyecto.'),
    ]
    destination = project / 'dist'
    destination.mkdir(exist_ok=True)
    for filename, template, label, title, description in pages:
        navigation = ''.join(f'<a href="{entry[0]}"' + (' aria-current="page"' if entry[0] == filename else '') + f'>{entry[2]}</a>' for entry in pages)
        values = {'title': escape(title), 'description': escape(description), 'page': filename.removesuffix('.html'), 'navigation': navigation, 'content': (templates / template).read_text(), 'preload': '<link rel="preload" as="image" href="assets/photos/mar-y-cielo-03-960.webp">' if filename == 'index.html' else ''}
        result = layout
        for key, value in values.items():
            result = result.replace('{{' + key + '}}', value)
        (destination / filename).write_text(result)
    print('Built: index.html, sesiones.html, sobre-mi.html, contacto.html')


if __name__ == '__main__':
    build()
