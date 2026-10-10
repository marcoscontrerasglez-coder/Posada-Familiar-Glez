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

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(TAB_NAME);
    if (!sheet) sheet = ss.insertSheet(TAB_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Fecha de envío","Asistencia","Nombre principal","Número de acompañantes","Nombres acompañantes","Participa intercambio","Participantes intercambio (nombre | talla | color)"]);
    }
    const participants = (data.participants || []).map(p => `${p.name} | ${p.size} | ${p.color}`).join("; ");
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.attendance || "",
      data.guestName || "",
      data.companions ?? "",
      data.companionNames || "",
      data.vestExchange || "",
      participants
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Apps Script funciona correctamente")
    .setMimeType(ContentService.MimeType.TEXT);
}

