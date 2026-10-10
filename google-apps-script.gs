/*
 * Backend opcional para guardar confirmaciones en Google Sheets.
 * 1) Crea una hoja de cálculo de Google.
 * 2) Extensiones > Apps Script. Pega este código.
 * 3) En Project Settings / Configuración del proyecto, define SCRIPT_SPREADSHEET_ID
 *    como propiedad del script con el ID de tu hoja, o reemplaza SHEET_ID abajo.
 * 4) Implementar > Nueva implementación > Aplicación web.
 *    Ejecutar como: tú. Acceso: cualquier usuario con el enlace.
 * 5) Copia la URL terminada en /exec a CONFIG.sheetsEndpoint en script.js.
 *
 * Nota: como la web será pública, comparte el enlace solo con invitados y evita
 * recopilar información que no necesites. Las respuestas se guardan en la hoja.
 */
const SHEET_ID = "1okjDnEA5N46jnfR0H6kqRvq8sfzqjQ7Qv3X5n4liKL4";
const TAB_NAME = "Respuestas";

function obtenerHoja_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let hoja = ss.getSheetByName(TAB_NAME);

  if (!hoja) {
    hoja = ss.insertSheet(TAB_NAME);
  }

  return hoja;
}

function responderJSON_(datos) {
  return ContentService
    .createTextOutput(JSON.stringify(datos))
    .setMimeType(ContentService.MimeType.JSON);
}

// Prueba que Apps Script puede abrir la hoja.
function doGet(e) {
  try {
    const hoja = obtenerHoja_();

    return responderJSON_({
      ok: true,
      mensaje: "Conexión correcta",
      hoja: hoja.getName(),
      spreadsheet: hoja.getParent().getName()
    });
  } catch (error) {
    console.error("Error en doGet: " + error.stack);
    throw error;
  }
}

// Recibe la confirmación y guarda sus campos en una fila.
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("La solicitud llegó sin datos.");
    }

    const datos = JSON.parse(e.postData.contents);
    const hoja = obtenerHoja_();

    // Conserva los encabezados existentes y agrega campos nuevos.
    let encabezados = [];

    if (hoja.getLastRow() > 0) {
      encabezados = hoja
        .getRange(1, 1, 1, hoja.getLastColumn())
        .getValues()[0]
        .filter(String);
    }

    const campos = Object.keys(datos);
    encabezados = [
      ...new Set(["Fecha de recepción", ...encabezados, ...campos])
    ];

    hoja.getRange(1, 1, 1, encabezados.length)
      .setValues([encabezados]);

    const fila = encabezados.map(campo => {
      if (campo === "Fecha de recepción") {
        return new Date();
      }

      const valor = datos[campo];

      if (valor === undefined || valor === null) {
        return "";
      }

      return typeof valor === "object"
        ? JSON.stringify(valor)
        : valor;
    });

    hoja.appendRow(fila);
    SpreadsheetApp.flush();

    console.log("Confirmación guardada: " + datos.guestName);

    return responderJSON_({
      ok: true,
      mensaje: "Confirmación guardada"
    });

  } catch (error) {
    console.error("Error en doPost: " + error.stack);
    throw error;
  }
}
