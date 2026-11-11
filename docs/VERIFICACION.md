# Verificación de la entrega

Historial de comprobaciones anteriores al 11 de noviembre de 2026, en la copia local del proyecto, zona America/Santo_Domingo.

Estado editorial: el fotógrafo confirmó el texto de Inicio, cinco categorías y títulos y descripciones de las sesiones. Las páginas públicas no muestran avisos provisionales; los datos personales opcionales que no han sido confirmados permanecen sin inventar.

## Estado actual (10 de noviembre de 2026)

Se incorporaron ocho galerías nuevas, con Sesión 21 al principio. Tras retirar una imagen de Sesión 21 por solicitud del usuario, el estado actual es **23 sesiones, 312 fotos y 936 exportaciones WebP (103,8 MB)**; la cuadrícula mantiene 25 tarjetas. La auditoría SHA-256 cubre 740 imágenes de 25 carpetas autorizadas (732 contenidos únicos; ocho copias repetidas) y confirma cero duplicados entre las 312 seleccionadas. Las nuevas incorporaciones se eligieron por nombre de archivo, sin inspección visual, a solicitud del usuario. Los originales permanecen intactos.

El 10 de noviembre se añadió a Contacto un retrato editorial generado a partir de las dos fotos HEIC aportadas y la referencia visual del usuario. El 11 de noviembre el fotógrafo sustituyó ese retrato por `Smiling Portrait Among Greenery.png` y después aportó una versión con cambios; se conserva el original y la copia vigente `contact-portrait-20261111.webp` se exportó a WebP a 941 × 1672, sin recorte ni retoque. En Inicio, las seis destacadas usan el mismo formato 4:5 y se alinean arriba, sin desnivel vertical entre columnas.

## Versión anterior: cuatro páginas e identidad ERU FRIAS

Se generaron `index.html`, `sesiones.html`, `sobre-mi.html` y `contacto.html`, con navegación relativa, cabecera y visor compartidos. La referencia de Pinterest está recibida, revisada y conservada en `referencias/pinterest-composicion.png`. Se aplicó la preferencia explícita de fondo BLANCO, logo ERU FRIAS y azules, con tipografía grande delante de tres fotografías superpuestas. Las tres pertenecen a las mismas seis destacadas de Inicio. Sesiones muestra 25 fotos de las 23 galerías en columnas de ancho uniforme, con orientaciones mezcladas y separación constante. Al pasar el cursor o enfocar una foto, aparece un color plano opaco, el título grande, una descripción breve disponible y un botón para abrir la sesión. Los controles usan iconos Lucide locales; el subconjunto y su aviso ISC están en `dist/assets/icons/`. `editorial.css` aplica la composición final sobre los estilos base y de marca.

El 8 de noviembre se restauró la portada superpuesta que aparece en `preview-desktop.png`: título «MIRAR. SENTIR. RECORDAR.» y tres fotos seleccionadas. Se retiró el diseño de tres columnas que había reemplazado la composición, junto con datos personales y movimiento de fotos no documentados como aprobados. La plantilla volvió a generarse desde `templates/`.

También se aplicaron los comentarios de la portada: “FOTOGRAFÍA” quedó junto al logo; se retiraron los lemas y contador señalados, la etiqueta «LA SELECCIÓN», el texto descriptivo redundante, las categorías/números de todas las fotos y el cierre que se marcó como incoherente. En el navegador se comprobó que permanecen las seis fotos destacadas y sus controles, sin esas etiquetas.

Se definió una escala común de texto para toda la interfaz: título display, H1/H2/H3, cuerpo, UI y metadatos; tamaños fluidos, interlineado por nivel, límites de ancho de lectura y ajustes móviles. La vista previa confirmó la jerarquía en la portada de escritorio; el validador confirmó cuatro páginas, contenido y activos.

La navegación principal se presenta en mayúsculas. Se retiró la función de favoritos de la cabecera, las tarjetas, el visor y el recorrido de sesiones; el portafolio ya no muestra controles de likes ni una página de selección personal.

Tras los comentarios visuales del 8 de noviembre, la descripción de la portada se alineó con el contenedor principal, el título de la selección pasó a «Algunas historias que conviene conocer» y se retiró el enlace redundante situado bajo las seis tarjetas. El CTA «Ver todas las sesiones» permanece como acceso a la página completa.

Después se amplió el margen lateral del contenido con un gutter fluido; en pantallas pequeñas se reduce proporcionalmente. La cabecera y el pie conservan sus márgenes previos.

El 9 de noviembre el usuario aclaró que la variación debe venir de fotografías verticales y horizontales reales, no de anchos distintos ni tarjetas con huecos. Sesiones ahora muestra 25 fotos curadas de las 23 galerías, intercaladas entre sesiones, en cuatro columnas de igual ancho en escritorio, tres en tablet y dos en móvil. El algoritmo reparte las fotos entre columnas según su altura natural; cada imagen conserva su proporción original, sin recortes ni cajas vacías. La separación horizontal y vertical es de 12 px en escritorio, 10 px en tablet y 8 px en móvil. Cada tarjeta de portada abre la galería de su sesión; la galería muestra todas las fotos curadas de ese álbum y cada foto abre el visor. Al pasar el cursor o enfocar con teclado, aparece un color plano opaco con el título y un acceso a la galería; el bloque aparece centrado en altura, alineado a la izquierda y con tipografía reducida. La vista previa comprobó cuatro columnas en escritorio y dos a 390 px, con orientaciones mezcladas y separaciones uniformes.

El pie incorpora navegación secundaria, categorías existentes y el aviso de contenido provisional. El botón de movimiento manual se quitó; se conserva la preferencia del sistema. Se aumentó el tamaño del CTA «Explorar las sesiones» en escritorio y móvil.

La nueva indicación del 9 de noviembre sustituye la pila de portada por una foto con una ventana circular de feather que revela otra al moverse el puntero. El contenedor tiene forma rectangular, sin esquinas redondeadas, y feather amplio en sus cuatro bordes, independiente de la ventana circular del puntero. El fondo al 110 % se recorta en un contenedor del ancho del viewport para evitar desbordamiento horizontal. La portada baja con más separación respecto al header, ahora con una sombra tenue, y la fotografía principal se amplió ligeramente. La misma imagen alimenta un fondo limitado a la primera sección, al 110 % del ancho, con opacidad al 25 % y blur de 24 px, sincronizado con la foto activa. El CTA cambia a bloque azul con texto blanco al hover; en escritorio, las fotos quedan a la izquierda y el texto y el enlace se apilan a la derecha, centrados en altura. Solo entran fotos horizontales curadas; se seleccionan al azar y se cruzan con una disolución cada cuatro segundos. La selección cubre las sesiones que tienen fotos horizontales en la curaduría actual; las demás no se muestran en este efecto; la rotación se pausa con `prefers-reduced-motion` o al cambiar de pestaña. La zona de la foto permite alternar la imagen completa con teclado y tacto, sin botón ni texto visible. El árbol accesible del navegador confirma las dos capas y el botón de alternancia; se ocultó el encabezado auxiliar de portada y se quitó el aro del cursor por indicación del usuario; no se registró una prueba manual del movimiento del puntero ni del ciclo automático.

En la última revisión se confirmó que las tarjetas del mosaico ya enlazan a la galería de la sesión sin abrir una foto directamente. Desde la galería, las imágenes siguen abriendo el visor individual. Se eliminaron del visor el control de compartir y el texto descriptivo bajo la foto; siguen el título de la sesión, el contador, cerrar y navegación anterior/siguiente.

La comprobación en navegador recorrió «Donde entra la luz»: la portada abrió el álbum con sus 12 imágenes; al seleccionar la primera se abrió el visor con contador `01 / 12`, título de sesión y controles. El árbol accesible ya no expone compartir ni texto alternativo duplicado debajo de la foto. El validador pasó tras corregir una referencia opcional ausente que impedía inicializar el enrutamiento.

`python3 tools/build_pages.py` y `node tools/validate.mjs` verifican la nueva estructura: cuatro HTML, navegación relativa, activos existentes, selección y sintaxis JavaScript. El estado editorial, identidad y pendientes se documentan en `CONTEXTO_PROYECTO.md` y `IDENTIDAD_VISUAL.md`.

**Revisión visual actual completada:** la autorización explícita del 6 de noviembre revocó la pausa. El acceso normal al navegador volvió a funcionar y se revisaron las cuatro páginas y la interfaz afectada. Los rechazos históricos no son un bloqueo vigente y no se utilizaron vías alternativas para sortearlos.

## Comprobaciones actuales y datos de imágenes conservados

- Comprobación previa al ajuste del 10 de noviembre: `python3 tools/build_pages.py` y `node tools/validate.mjs` pasaron con cuatro páginas, 23 sesiones, 313 fotografías y 939 WebP válidos (104,4 MB).
- Auditoría SHA-256 de las 740 fotografías directamente en las 25 carpetas permitidas: 732 contenidos únicos, ocho copias repetidas y cero duplicados exactos entre las imágenes elegidas.
- Inspección de las exportaciones WebP con Pillow: ninguno contiene EXIF ni XMP.
- Revisión visual de hojas de contacto por sesión y de la hoja final `seleccion.jpg`.
- Vista previa servida y abierta en el navegador en `http://127.0.0.1:4173/`.
- Portada: seis tarjetas destacadas y una pila de tres imágenes de esa misma selección, sin mostrar todas las 312 fotografías. Fondo blanco medido como `rgb(255, 255, 255)`.
- Galerías independientes comprobadas con el álbum anterior máximo de 12 fotografías y el álbum de 6; el índice se oculta al abrir cada sesión.
- Sesiones: 25 enlaces accesibles a las fotos, enlazados a sus 23 galerías; no hay etiquetas visibles, filtros, conteos ni flechas de carrusel.
- Visor modal: ampliación, botones anterior/siguiente, flecha derecha del teclado y cierre con Escape. El árbol accesible muestra solo el visor mientras está abierto.
- El visor muestra la foto seleccionada, el título de la sesión, el contador y controles para avanzar o cerrar; no incluye botón de compartir ni pie de descripción redundante. Los enlaces directos con parámetro de foto siguen abriendo la foto correspondiente.
- Última comprobación anterior: `python3 tools/build_pages.py` generó las cuatro páginas y `node tools/validate.mjs` pasó (15 sesiones, 158 fotografías, 474 activos; cifras históricas del 9 de noviembre). El árbol accesible de Inicio confirma el footer con logo, categorías, enlaces secundarios y Contacto; no expone un control manual de movimiento. El CTA «Explorar las sesiones» conserva su enlace a Sesiones.
- Cambio posterior: se retiraron las descripciones visibles que acompañaban a fotos individuales en el mosaico y en las galerías; el hover de Sesiones conserva el título de la sesión y su llamada para abrirla. Se quitaron del footer las cifras de sesiones y fotografías marcadas como innecesarias. Los textos alternativos siguen disponibles para tecnologías de asistencia. La regeneración y validación se ejecutaron después de estos cambios.
- Las pruebas de móvil descritas en el historial se hicieron antes de reemplazar el carrusel. El mosaico define dos columnas de igual ancho bajo 700 px y conserva proporciones naturales; verificado visualmente a 390 px, sin desbordamiento horizontal.
- Movimiento: la interfaz respeta `prefers-reduced-motion`; ya no hay un control manual en el pie. La preferencia del sistema no se cambió.
- Sobre mí y Contacto conservan avisos provisionales y no muestran correos, servicios ni biografía inventados. Las cuatro páginas se alcanzan desde la navegación compartida.
- La consola del navegador no registró errores ni advertencias durante la comprobación. No se detectaron imágenes fallidas entre las cargadas.
- `git diff --check` sin incidencias antes de la publicación. El commit inicial `9999a65` se subió a `erufrias25-a11y/MYPAGE`, rama `main`. El primer flujo `42968779692` falló porque el repositorio era privado. Tras hacerlo público, el flujo `42969876287` terminó correctamente y publicó el sitio con GitHub Pages.

## Límites y configuración pendiente

- URL publicada por Pages: `https://erufrias25-a11y.github.io/MYPAGE/`. El repositorio es público. En Spaceship se configuraron cuatro registros A para `erufrias.work` (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) y `www` como CNAME a `erufrias25-a11y.github.io`. `dig` confirma los cuatro A y el CNAME.
- GitHub Pages ya tiene el CNAME `erufrias.work`, pero `https_enforced` continúa en `false`. La consulta HTTPS falla por discrepancia del certificado del host; la propagación DNS está lista y queda pendiente que GitHub emita el certificado. La URL personalizada no se declara lista para HTTPS hasta comprobarla de nuevo.
- Los gestos táctiles están implementados, pero no se probaron en un teléfono físico. Las pruebas móviles se realizaron con el tamaño de ventana del navegador.
- El nombre público personal y el correo siguen vacíos en `../dist/site-config.js`. La marca gráfica ERU FRIAS procede de los materiales de identidad aportados; la biografía y el contexto de sesiones siguen pendientes, sin datos inventados.
- El servidor local se detiene cerrando su terminal o pulsando Control+C; puede reiniciarse con el comando del README. El dominio de Pages sirve la publicación; el dominio personalizado espera certificado HTTPS.

- 9 de noviembre: el contenedor de la foto principal de Inicio conserva forma rectangular sin esquinas redondeadas y aplica feather amplio en sus cuatro bordes para fundir la foto con el fondo. El fondo ampliado al 110 % se recorta en un contenedor de ancho viewport para evitar desbordamiento horizontal. Este efecto es independiente de la máscara circular del puntero. Las galerías de las 23 sesiones usan tres columnas en escritorio y dos en pantallas menores, con masonry de proporción natural y separación uniforme; las fotos destacadas de Inicio navegan al álbum correspondiente. Validación del proyecto ejecutada tras el cambio.

- 10 de noviembre: por solicitud del usuario se quitó el feather del perímetro de la foto de portada de Inicio; sus bordes quedan definidos y rectos. Se conserva el feather circular que revela la foto alterna bajo el puntero. `node tools/validate.mjs` pasó después del ajuste.
- 11 de noviembre: se excluyó también el ID retirado `sesion-21-06` de la selección aleatoria que alimenta la portada. Validación ejecutada tras el cambio.

## Capturas actuales

- `preview-desktop.png`: captura histórica de Inicio de escritorio, anterior al revelado circular actual.
- `preview-mobile.png`: captura histórica de Inicio a 390 píxeles, anterior al revelado circular actual.
- `preview-sesiones-desktop.png` y `preview-sesiones-mobile.png`: capturas históricas del carrusel, anteriores a la cuadrícula aplicada el 9 de noviembre.
- `preview-sobre-mi.png` y `preview-contacto.png`: páginas actuales de presentación y contacto, con contenido pendiente señalado.

Las capturas son estáticas; la vista previa local permite apreciar las animaciones. `seleccion.jpg` y las hojas por sesión muestran la selección actual. La auditoría actual de originales y metadatos está documentada para las 312 imágenes seleccionadas.


## Ajuste de curaduría del 10 de noviembre

A solicitud del usuario se quitó `sesion-21-06` (`LAUD-18.jpg`, la foto de pareja al aire libre) de la selección de Sesión 21. El original sigue intacto en su carpeta autorizada; se retiraron sus tres derivados WebP. El manifiesto, los datos publicados y la auditoría por hash suman 23 sesiones y 312 fotos (936 exportaciones). Se cambiaron los títulos provisionales de las sesiones 16–23 por etiquetas editoriales descriptivas, basadas en la categoría y los textos alternativos. La validación vigente se ejecutó el 11 de noviembre de 2026: 23 sesiones, 312 fotografías y 936 activos.

## Publicación y dominio (11 de noviembre de 2026)

- El usuario hizo público `erufrias25-a11y/MYPAGE`; el workflow `42969876287` publicó correctamente GitHub Pages.
- URL del sitio en Pages: `https://erufrias25-a11y.github.io/MYPAGE/`.
- Se configuró `erufrias.work` en Pages y los registros DNS de Spaceship. `dig` confirmó los cuatro A de GitHub Pages y `www` CNAME a `erufrias25-a11y.github.io`.
- `http://erufrias.work/` y `curl -k -I https://erufrias.work/` devolvieron `200` desde GitHub.com. La verificación TLS normal aún reporta un certificado que no corresponde al dominio y `https_enforced` es `false`; queda pendiente la emisión del certificado por GitHub. No habilitar enforcement hasta que TLS valide.
- Validación local después de actualizar los documentos: `python3 tools/build_pages.py`, `node tools/validate.mjs` y `git diff --check`; todo pasó. El validador encontró 23 sesiones, 312 fotografías y 936 activos (103.8 MB).


## Actualización editorial (11 de noviembre de 2026)

Se regeneraron `dist/gallery-data.js` desde `curation.json` y los cuatro HTML con `python3 tools/build_pages.py`. Se validó el proyecto con `node tools/validate.mjs` y `git diff --check`. Las cinco categorías quedan como Retrato, Celebraciones, Familia, Gastronomía y Arte; el pie no muestra avisos de borrador y las galerías usan los títulos y descripciones indicados por el fotógrafo. El encabezado de Sobre mí se cambió a «Pensar en grande».
