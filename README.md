# Invitación web para Posada Navideña

Plantilla adaptable para publicar gratis con GitHub Pages. Incluye portada navideña, música opcional, detalles del evento, enlaces/mapa de Google Maps y confirmación con acompañantes e intercambio de chalecos.

## 1. Personaliza el evento
Abre `script.js` y cambia los valores de `CONFIG`:
- `date`: fecha del evento.
- `time`: hora.
- `place`: nombre del salón o lugar.
- `address`: dirección que se mostrará.
- `mapsQuery`: dirección o nombre exacto que Google Maps debe buscar.

También puedes ajustar los textos directamente en `index.html`.

## 2. Agrega música
1. Crea una carpeta llamada `assets`.
2. Coloca ahí un archivo llamado `navideno.mp3` que tengas permiso de usar.
3. En `index.html`, busca el bloque `<audio id="backgroundMusic"...>` y descomenta:
   `<source src="assets/navideno.mp3" type="audio/mpeg">`
4. El visitante debe tocar **Activar música**: los navegadores suelen bloquear el audio automático.

Usa una canción propia o con licencia adecuada; no incluyas música con copyright si no tienes permiso.

## 3. Guardar respuestas en Google Sheets
GitHub Pages sirve archivos estáticos; por sí solo no almacena los formularios. Para recibir confirmaciones:

1. Crea una hoja de cálculo en Google Sheets.
2. Copia el ID de la URL: `https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`.
3. Abre **Extensiones → Apps Script**, pega el contenido de `google-apps-script.gs`.
4. Reemplaza `PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET` por el ID real.
5. En Apps Script, selecciona **Implementar → Nueva implementación → Aplicación web**.
6. Elige **Ejecutar como: tú** y el acceso que permita a tus invitados enviar respuestas. Revisa las opciones de acceso disponibles en tu cuenta.
7. Autoriza el script y copia la URL de la aplicación web que termina en `/exec`.
8. Pega esa URL en `sheetsEndpoint` en `script.js`.
9. Haz una prueba y verifica que aparezca una fila en la hoja.

El envío usa `no-cors`, por lo que el navegador no permite confirmar la respuesta del servidor leyendo su contestación. Después de probar, verifica en Google Sheets que la fila haya llegado. No guardes datos sensibles.

## 4. Publicar en GitHub Pages
1. En GitHub, crea un repositorio, por ejemplo `posada-navidena`.
2. Sube `index.html`, `styles.css`, `script.js`, `google-apps-script.gs` y `README.md` (y la carpeta `assets` si agregaste música).
3. Abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
6. Espera a que GitHub muestre el enlace público de la página.

## Qué hace el formulario
- Botones para confirmar o avisar que no asistirán.
- Nombre de quien confirma y cantidad de acompañantes.
- Campo opcional para nombres de acompañantes.
- Participación en intercambio: sí/no.
- Si participa, solicita nombre, talla y color de cada participante; se pueden agregar o quitar participantes.
- Si no participa, no pide datos del intercambio.

## Importante
La invitación incluye datos de ejemplo que debes reemplazar. El fondo utiliza una fotografía remota de Unsplash; para mayor control puedes añadir una imagen propia y actualizar `background` en `styles.css`.
