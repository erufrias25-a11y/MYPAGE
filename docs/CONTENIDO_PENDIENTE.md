# Información pendiente

Los títulos, categorías y descripciones de las 23 sesiones ya fueron definidos por el fotógrafo y están guardados en `curation.json`. La portada también usa el texto que indicó. Las páginas públicas no muestran avisos de borrador.

## Datos personales aún opcionales

- Nombre profesional que desea mostrar, si debe aparecer además de la marca ERU FRIAS.
- Presentación o biografía personal para «Sobre mí».
- Servicios adicionales que desea anunciar.
- Correo y perfiles públicos, si desea cambiarlos o añadir otros.

No completar estos datos con información inferida. La página no muestra avisos cuando están vacíos.

## Título de una sesión

El usuario decidió conservar «Amarillo tropical» por ahora; puede cambiarse cuando defina otro título. Sus datos y descripción se encuentran en `curation.json` junto con las otras sesiones.

## Fuentes de contenido

- Metadatos públicos de sesiones: `curation.json`; salida generada: `dist/gallery-data.js`.
- Texto de portada y campos personales opcionales: `dist/site-config.js`.
- Las cuatro páginas se regeneran con `python3 tools/build_pages.py`.
