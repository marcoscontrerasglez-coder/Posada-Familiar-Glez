/*
 * CONFIGURA AQUÍ LOS DATOS REALES DEL EVENTO.
 * Para guardar respuestas, publica el Apps Script incluido en este proyecto
 * como aplicación web y pega su URL en SHEETS_ENDPOINT.
 */
const CONFIG = {
  date: "Sábado 24 de diciembre de 2026",
  time: "8:00 p. m.",
  place: "Salos de eventos ",
  address: "Francisco Castrejón 75, 9na Demarcació a un costado del Jardin de niños (Carlos Obregon Santacilia),Col, el Bondho, Mixquiahula de Juarez, Hgo.",
  mapsQuery: "Francisco Castrejón 75, 9na Demarcación, 42700 Mixquiahuala, Hgo.",
  sheetsEndpoint: "https://script.google.com/macros/s/AKfycbyuOBq_79BVGaS7CPoXm0-2JQRfpzIN1ZnRqGpZujWpPKPAYmEt_CXV1azhOwxJa6kl/exec"
};

const $ = (id) => document.getElementById(id);
["heroDate","detailDate"].forEach(id => $(id).textContent = CONFIG.date);
["heroTime","detailTime"].forEach(id => $(id).textContent = CONFIG.time);
$("heroPlace").textContent = CONFIG.place;
$("detailPlace").textContent = CONFIG.place;
$("detailAddress").textContent = CONFIG.address;
$("mapAddressText").textContent = CONFIG.address;
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
$("mapsLink").href = mapsUrl;
$("mapsButton").href = mapsUrl;
$("mapFrame").src = "https://maps.google.com/maps?q=" + encodeURIComponent(CONFIG.mapsQuery) + "&t=&z=15&ie=UTF8&iwloc=&output=embed";

const audio = $("backgroundMusic");
const musicToggle = $("musicToggle");
musicToggle.addEventListener("click", async () => {
  if (audio.paused) {
    if (!audio.querySelector("source")) {
      $("rsvpStatus").textContent = "Agrega tu archivo assets/navideno.mp3 y descomenta su etiqueta source en index.html para activar la música.";
      return;
    }
    try { await audio.play(); musicToggle.textContent = "♫ Pausar música"; musicToggle.setAttribute("aria-pressed","true"); }
    catch { musicToggle.textContent = "No se pudo reproducir"; }
  } else {
    audio.pause(); musicToggle.textContent = "♫ Activar música"; musicToggle.setAttribute("aria-pressed","false");
  }
});

$("yesBtn").addEventListener("click", () => {
  $("rsvpForm").hidden = false;
  $("rsvpStatus").textContent = "";
  $("guestName").focus();
  $("rsvpForm").scrollIntoView({behavior:"smooth",block:"start"});
});
$("noBtn").addEventListener("click", async () => {
  const response = {attendance:"No", guestName:"", companions:0, companionNames:"", vestExchange:"No aplica", participants:[], submittedAt:new Date().toISOString()};
  const status = $("rsvpStatus");
  if (!CONFIG.sheetsEndpoint) {
    status.textContent = "Gracias por avisarnos. Para registrar también las respuestas de quienes no asistirán, configura Google Sheets en este sitio.";
    return;
  }
  try {
    await fetch(CONFIG.sheetsEndpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(response)});
    status.textContent = "¡Gracias por avisarnos!";
  } catch { status.textContent = "No se pudo enviar. Intenta de nuevo o contacta al organizador."; }
});

const participantsList = $("participantsList");
function addParticipant(data = {}) {
  const index = participantsList.children.length + 1;
  const card = document.createElement("div");
  card.className = "participant-card";
  card.innerHTML = `
    <div class="participant-card-top"><strong>Participante ${index}</strong><button type="button" class="remove-person">Eliminar</button></div>
    <label>Nombre completo *</label><input class="p-name" required placeholder="Nombre del participante" value="">
    <div class="participant-fields">
      <div><label>Talla de chaleco *</label><select class="p-size" required><option value="">Elegir talla</option><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option><option>XXXL</option><option>Infantil</option></select></div>
      <div><label>Color preferido *</label><input class="p-color" required placeholder="Ej. rojo, verde" value=""></div>
    </div>`;
  card.querySelector(".p-name").value = data.name || "";
  card.querySelector(".p-size").value = data.size || "";
  card.querySelector(".p-color").value = data.color || "";
  card.querySelector(".remove-person").addEventListener("click", () => {card.remove(); renumberParticipants();});
  participantsList.appendChild(card);
  renumberParticipants();
}
function renumberParticipants(){[...participantsList.children].forEach((c,i)=>c.querySelector("strong").textContent=`Participante ${i+1}`);}
$("addParticipant").addEventListener("click",()=>addParticipant());
document.querySelectorAll('input[name="vestExchange"]').forEach(radio => radio.addEventListener("change", () => {
  const yes = document.querySelector('input[name="vestExchange"]:checked')?.value === "Sí";
  $("participantsSection").hidden = !yes;
  participantsList.querySelectorAll("input,select").forEach(el=>el.required=yes);
  if (yes && participantsList.children.length === 0) addParticipant();
}));
$("companions").addEventListener("change", () => {
  $("companionNamesWrap").hidden = Number($("companions").value) === 0;
});

$("rsvpForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = $("formStatus");
  if (!$("rsvpForm").reportValidity()) return;
  const exchange = document.querySelector('input[name="vestExchange"]:checked')?.value || "No";
  const participants = exchange === "Sí" ? [...participantsList.children].map(card => ({
    name:card.querySelector(".p-name").value.trim(),
    size:card.querySelector(".p-size").value,
    color:card.querySelector(".p-color").value.trim()
  })) : [];
  const response = {
    attendance:"Sí",
    guestName:$("guestName").value.trim(),
    companions:Number($("companions").value),
    companionNames:$("companionNames").value.trim(),
    vestExchange:exchange,
    participants,
    submittedAt:new Date().toISOString()
  };
  if (!CONFIG.sheetsEndpoint) {
    status.textContent = "El formulario está validado, pero falta configurar Google Sheets. Consulta README.md para conectarlo y recibir respuestas.";
    return;
  }
  const submit = $("submitBtn"); submit.disabled = true; submit.textContent = "Enviando…";
  try {
    await fetch(CONFIG.sheetsEndpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(response)});
    status.textContent = "¡Confirmación enviada! Gracias por ayudarnos a organizar la posada.";
    $("rsvpForm").reset(); participantsList.innerHTML=""; $("participantsSection").hidden=true; $("companionNamesWrap").hidden=true;
  } catch {
    status.textContent = "No se pudo enviar la respuesta. Revisa tu conexión e inténtalo de nuevo.";
  } finally { submit.disabled = false; submit.innerHTML = 'Enviar confirmación <span>→</span>'; }
});
