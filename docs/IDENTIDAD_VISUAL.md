# Identidad visual aplicada

Fuente autorizada: `/Users/mvp/Downloads/Mi identidad`, creada por el usuario para aportar su identidad y línea gráfica. Es una fuente de marca separada de las 17 carpetas autorizadas para las galerías; no cambia las cinco exclusiones fotográficas.

## Material revisado

- `ERU  FRIAS.png`: firma gráfica «ERU FRIAS» con símbolo azul y azul marino. Se inspeccionó la imagen original.
- `Relleno de color 2.png`: símbolo de marca sobre fondo azul marino. Se inspeccionó el original y se usa como icono del sitio.
- `IDENTIDAD.psd`: composición de identidad, revisada mediante su imagen compuesta. Contiene concepto personal, paleta, tipografía, bocetos y resultados.
- Los seis PDF `UlisesFriasMesa de trabajo ...`: se renderizaron y revisaron visualmente, además de extraer texto para identificar la tipografía. Cubren presentación, concepto, paleta, tipografía, bocetos y resultados.

La marca pública visible en el logo es **ERU FRIAS**. Se usa esa firma gráfica como marca del sitio. El nombre profesional personal que el usuario desea mostrar, su biografía fotográfica, servicios y contacto siguen pendientes de la conversación. No se reutilizaron identificadores académicos ni datos ajenos al propósito del portafolio.

## Aplicación

| Elemento | Aplicación en la web |
| --- | --- |
| Azul `#2563FF` | Botones principales, acentos y estados activos |
| Azul marino `#102A5C` | Texto y estructura principal |
| Cian `#00A3FF` | Detalles de acento |
| Gris azulado `#E6ECF5` | Superficies secundarias y detalles |
| Blanco `#FFFFFF` | Fondo de las cuatro páginas, carrusel y visor, confirmado expresamente por el usuario |
| Azul profundo `#051F33` | Disponible en la paleta, sin usarlo como fondo de página |
| Logo aportado | Cabecera y pie de las cuatro páginas |
| Símbolo aportado | Icono de pestaña |
| Neue Haas Grotesk Display | Primera opción local de tipografía, con Helvetica Neue y Arial como alternativas |

La carpeta no contiene archivos tipográficos web. No se extrajeron ni redistribuyeron fuentes incrustadas en PDF. La presentación tipográfica toma el carácter limpio y ligero de la guía usando la fuente local disponible.

Los PNG se copiaron sin alterar sus bytes a `dist/assets/brand/logo.png` y `mark.png`, mediante `tools/prepare_brand.py`. Los originales y los documentos de identidad permanecen intactos en Descargas. La guía completa y el PSD no se copiaron al directorio público.

`dist/brand.css` aplica la paleta y tipografía sobre `dist/styles.css`; `dist/editorial.css`, cargado al final, adapta la composición a la referencia y mantiene blancos los fondos. Las plantillas compartidas contienen los logos y títulos. `dist/site-config.js` conserva `brandName: 'ERU FRIAS'`; el nombre personal sigue vacío.

## Referencia de interfaz recibida

El 6 de noviembre de 2026 se recibió y revisó la [captura de Pinterest](referencias/pinterest-composicion.png). Muestra una pila central de fotografías giradas, letras grandes delante de las fotos y un índice horizontal de galerías con flechas y un rótulo grande. El usuario confirmó «Fondo blanco, con tus azules y logos. Mantenemos la tipografía grande, las fotos superpuestas y las animaciones» y autorizó avanzar.

El fondo negro de la captura se sustituyó por blanco. La portada usa tres imágenes de la selección autorizada, tipografía oscura y azul, movimiento suave por capas y seis destacadas. Sesiones adopta el carrusel de cubiertas verticales con títulos y conteos, controles, filtros y teclado. No se copiaron identidad, biografía, fotografías ni textos personales del fotógrafo de referencia. Los documentos de `Mi identidad` siguen siendo la fuente de marca, no un diseño web que deba copiarse literalmente.

## Pendiente

- Incorporar la información personal y de sesiones que el usuario aporte.
- Comprobar gestos en un teléfono físico y ejecutar la publicación en GitHub cuando se solicite. La revisión de las cuatro páginas en navegador ya se retomó con la autorización del 6 de noviembre; el bloqueo anterior quedó superado por los canales normales.
