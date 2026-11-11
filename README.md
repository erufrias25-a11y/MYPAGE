# ERU FRIAS — Portafolio fotográfico

Para retomar el proyecto con otro agente, comienza por [CONTEXTO_PROYECTO.md](CONTEXTO_PROYECTO.md) y [AGENTS.md](AGENTS.md). Allí se conservan decisiones, fuentes autorizadas, estructura, estado real y tareas pendientes.

Una web estática, en español y adaptable a móvil, preparada para GitHub Pages. La portada presenta seis fotografías destacadas y el acceso a las sesiones; cada sesión abre su propia galería. Las imágenes se pueden ampliar y recorrer con botones, flechas del teclado o gestos táctiles. Escape cierra la ampliación.

Tiene **cuatro páginas separadas**, tal como confirmó el usuario: `index.html` (Inicio), `sesiones.html`, `sobre-mi.html` y `contacto.html`. Las galerías conservan direcciones compartibles dentro de Sesiones, por ejemplo `sesiones.html#sesion=luz-natural`.

El diseño sigue la [referencia de composición recibida](docs/referencias/pinterest-composicion.png), adaptada a la decisión explícita de **fondo blanco**, logos reales de ERU FRIAS y acentos azules. La portada coloca las fotos a la izquierda y el texto con el enlace a la derecha; revela otra foto bajo una ventana circular con feather, con bordes rectos y definidos en el contenedor. Usa fotos horizontales curadas que cambian al azar cada cuatro segundos con una disolución. Sesiones reúne 25 portadas que enlazan a las 23 galerías independientes, en columnas de ancho uniforme, con mezcla de orientaciones, proporciones originales y espacio constante. Al pasar el cursor o enfocar una foto, aparece un color plano opaco con el título de la sesión y un botón para abrirla. Las categorías son Retrato, Celebraciones, Familia, Gastronomía y Arte.

La portada, las categorías y los títulos y descripciones de sesiones usan los textos definidos por el fotógrafo. Los datos personales que aún falten se registran en [contenido pendiente](docs/CONTENIDO_PENDIENTE.md), sin avisos provisionales en las páginas públicas.

## Vista previa local

Desde esta carpeta:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abre http://127.0.0.1:4173. Para detener el servidor, pulsa Control+C en su terminal. Abre el sitio mediante este servidor, porque los módulos JavaScript no funcionan correctamente al abrir el HTML con doble clic.

## Publicación

El repositorio es `https://github.com/erufrias25-a11y/MYPAGE`, rama `main` (público). GitHub Actions publicó el sitio en GitHub Pages. Dominio configurado: [erufrias.work](https://erufrias.work). Los DNS ya resuelven a GitHub Pages; el certificado HTTPS está pendiente de emisión. También se configuró `www.erufrias.work` como alias CNAME.

El flujo de GitHub Pages se conserva en el proyecto como configuración técnica:

1. Los cambios se suben a la rama `main` del repositorio indicado. No se suben las fotografías originales de Descargas.
2. GitHub Pages usa **GitHub Actions** como origen.
3. El flujo `Publicar portafolio` valida y publica exclusivamente `dist/` al actualizar `main`.
4. URL establecida por GitHub Pages: `https://erufrias25-a11y.github.io/MYPAGE/`. `erufrias.work` ya sirve la publicación por HTTP; espera a que Pages emita el certificado antes de usar su URL HTTPS.

La validación DNS ya observa los cuatro registros A del dominio raíz y el CNAME de `www`. GitHub todavía no ha emitido el certificado HTTPS, por lo que el dominio puede tardar en abrirse de forma segura. Guía oficial: [publicar Pages con GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Personalizar

- `dist/site-config.js`: marca `ERU FRIAS` y texto de portada. El correo se muestra únicamente cuando está configurado. Los títulos, categorías y descripciones de las sesiones se mantienen en `curation.json`.
- `templates/layout.html`: estructura compartida, navegación y visor.
- `templates/inicio.html`, `templates/sesiones.html`, `templates/sobre-mi.html`, `templates/contacto.html`: contenido de cada página. Después de editar plantillas, ejecuta `python3 tools/build_pages.py`; los cuatro HTML de `dist/` son salidas generadas.
- `dist/styles.css`: estilos base. `dist/brand.css`: paleta y tipografía de marca. `dist/editorial.css`: composición final de la pila, cuadrícula de sesiones, fondos blancos y adaptación móvil; se aplica en último lugar.
- `dist/assets/brand/contact-portrait-20261111.webp`: versión actual del retrato elegido por el fotógrafo para Contacto.
- Los controles usan el subconjunto local de [Lucide](https://lucide.dev/icons), en `dist/assets/icons/lucide.svg`, con licencia ISC y aviso incluido junto a los iconos. Así no se añade una dependencia de red.
- `curation.json`: selección, orden, títulos de sesiones y descripciones accesibles. Cada archivo apunta a una carpeta autorizada directamente dentro de Descargas.

La interfaz es un portafolio fotográfico; no tiene likes, favoritos ni selección personal guardada. No hay servicios externos, rastreadores, cuentas ni solicitudes a bancos de imágenes.

La portada revela una segunda foto con una máscara circular de borde difuminado que sigue al puntero. El botón de la portada ofrece el mismo cambio con teclado y tacto. Esta respuesta directa funciona también con `prefers-reduced-motion`; las transiciones decorativas respetan esa preferencia. Las fotografías originales no se animan ni se alteran.

Las animaciones respetan la preferencia **Reducir movimiento** configurada en el sistema operativo.

## Identidad visual

La fuente autorizada es `~/Downloads/Mi identidad`, independiente de las 25 carpetas fotográficas autorizadas. Se revisaron sus PNG, la composición del PSD y los seis PDF. Se utiliza la marca gráfica `ERU FRIAS`, el logo aportado y la paleta `#2563FF`, `#102A5C`, `#00A3FF`, `#E6ECF5`, `#051F33`. La guía especifica Neue Haas Grotesk Display; como no incluye archivos de fuente web, se utiliza si está instalada y se conserva Helvetica Neue/Arial como alternativa.

Las copias de logo e icono están en `dist/assets/brand/`. Para copiarlas de nuevo, sin tocar los originales:

```sh
python3 tools/prepare_brand.py --source "$HOME/Downloads/Mi identidad"
python3 tools/build_pages.py
node tools/validate.mjs
```

Los PDF y el PSD no se publican con el sitio. La presentación personal del documento de identidad no se ha convertido automáticamente en una biografía fotográfica. La referencia de Pinterest está recibida y conservada en `docs/referencias/`; sus imágenes y textos personales no se utilizan en las galerías. Detalles de integración: [identidad visual](docs/IDENTIDAD_VISUAL.md).

## Actualizar fotografías

Las 312 fotografías seleccionadas están ya exportadas y versionables en `dist/assets/photos/`, en tres tamaños WebP (936 archivos, aproximadamente 103,8 MB). Se puede publicar la web sin instalar dependencias ni acceder de nuevo a Descargas.

Solo para regenerar las copias tras modificar la selección, con Python 3.9 o superior y Pillow:

```sh
python3 -m pip install -r requirements.txt
python3 tools/prepare_images.py --source ~/Downloads
python3 tools/build_pages.py
node tools/validate.mjs
```

El proceso lee los originales, aplica su orientación y genera nuevas copias RGB sin metadatos EXIF ni GPS. No altera ni mueve los archivos fuente. Si se elimina una fotografía de la selección, sus exportaciones anteriores deben retirarse de `dist/assets/photos/` antes de volver a publicar.

Consulta [la curaduría](docs/CURADURIA.md) y [la verificación](docs/VERIFICACION.md) para revisar la selección y el estado de entrega. La fotografía conserva los derechos de su autor; este proyecto no concede una licencia de uso de las imágenes.
