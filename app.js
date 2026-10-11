const CLAVE_SESIONES = "diario-de-estudio-sesiones";
const CLAVE_METAS = "diario-de-estudio-metas-semanales";
const formulario = document.querySelector("#formulario-sesion");
const campoFecha = document.querySelector("#fecha");
const campoTema = document.querySelector("#tema");
const campoMinutos = document.querySelector("#minutos");
const listaSesiones = document.querySelector("#lista-sesiones");
const formularioObjetivo = document.querySelector("#formulario-objetivo");
const selectorObjetivo = document.querySelector("#objetivo-semana");
const minutosObjetivo = document.querySelector("#objetivo-minutos");
const avisoObjetivo = document.querySelector("#objetivo-aviso");
let selectedGoalWeek = null;

function fechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function leerSesiones() {
  try {
    const texto = localStorage.getItem(CLAVE_SESIONES);
    if (texto === null) return { available: true, sessions: [] };
    const guardadas = JSON.parse(texto);
    return Array.isArray(guardadas)
      ? { available: true, sessions: guardadas }
      : { available: false, sessions: [] };
  } catch {
    return { available: false, sessions: [] };
  }
}

function leerMetas() {
  try {
    const texto = localStorage.getItem(CLAVE_METAS);
    if (texto === null) return { available: true, entries: [] };
    const entries = JSON.parse(texto);
    return Array.isArray(entries)
      ? { available: true, entries }
      : { available: false, entries: null };
  } catch {
    return { available: false, entries: null };
  }
}

function guardarMeta(weekStart, input, today) {
  const stored = leerMetas();
  if (!stored.available) return { saved: false, reason: "unavailable" };
  const minutes = parseGoalMinutes(input);
  const result = updateGoalEntry(stored.entries, weekStart, minutes, today);
  if (!result.updated) return { saved: false, reason: result.reason };

  try {
    localStorage.setItem(CLAVE_METAS, JSON.stringify(result.entries));
    return { saved: true, entries: result.entries };
  } catch {
    return { saved: false, reason: "write-error" };
  }
}

const datosSesiones = leerSesiones();
const sesiones = datosSesiones.sessions;
const displaySessions = sesiones.filter((session) => {
  if (!session || typeof session.fecha !== "string" || typeof session.tema !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(session.fecha)) return false;
  const [year, month, day] = session.fecha.split("-").map(Number);
  if (fechaLocal(new Date(year, month - 1, day, 12)) !== session.fecha) return false;
  return Number.isFinite(Number(session.minutos)) && Number(session.minutos) > 0;
});
campoFecha.value = fechaLocal(new Date());
campoMinutos.addEventListener("input", () => campoMinutos.setCustomValidity(""));
campoTema.addEventListener("input", () => campoTema.setCustomValidity(""));

function calcularRacha() {
  const diasConSesion = new Set(displaySessions.map((sesion) => sesion.fecha));
  const dia = new Date();
  dia.setHours(12, 0, 0, 0);

  if (!diasConSesion.has(fechaLocal(dia))) {
    dia.setDate(dia.getDate() - 1);
  }

  let racha = 0;
  while (diasConSesion.has(fechaLocal(dia))) {
    racha++;
    dia.setDate(dia.getDate() - 1);
  }
  return racha;
}

function calcularMejorRacha() {
  const hoy = fechaLocal(new Date());
  const dias = [...new Set(displaySessions.map((sesion) => sesion.fecha))]
    .filter((fecha) => fecha <= hoy)
    .sort();
  let mejor = 0;
  let seguida = 0;
  let anterior;

  for (const fecha of dias) {
    if (anterior) {
      anterior.setDate(anterior.getDate() + 1);
    }
    seguida = anterior && fechaLocal(anterior) === fecha ? seguida + 1 : 1;
    mejor = Math.max(mejor, seguida);
    const [anio, mes, dia] = fecha.split("-").map(Number);
    anterior = new Date(anio, mes - 1, dia, 12);
  }
  return mejor;
}

function mostrarMinutosSemana() {
  const hoy = new Date();
  const lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 12);
  lunes.setDate(lunes.getDate() - (lunes.getDay() + 6) % 7);
  const inicioSemana = fechaLocal(lunes);
  const fechaHoy = fechaLocal(hoy);
  let total = 0;

  for (const sesion of displaySessions) {
    const minutos = Number(sesion.minutos);
    if (sesion.fecha >= inicioSemana && sesion.fecha <= fechaHoy && Number.isFinite(minutos) && minutos > 0) {
      total += minutos;
    }
  }

  document.querySelector("#minutos-semana").textContent =
    new Intl.NumberFormat("es", { maximumFractionDigits: 10 }).format(total);
}

function mostrarDiasMes() {
  const hoy = fechaLocal(new Date());
  const mesActual = hoy.slice(0, 7);
  const dias = new Set(
    displaySessions.map((sesion) => sesion.fecha)
      .filter((fecha) => fecha.startsWith(mesActual) && fecha <= hoy)
  );

  document.querySelector("#dias-mes").textContent = dias.size;
  document.querySelector("#unidad-dias-mes").textContent = dias.size === 1 ? "día" : "días";
}

function mostrarObjetivos() {
  const metas = leerMetas();
  const vista = buildWeeklyGoalView(
    datosSesiones.available ? sesiones : null,
    metas.available ? metas.entries : null,
    fechaLocal(new Date())
  );
  document.querySelector("#objetivos-error-metas").hidden = metas.available;
  document.querySelector("#objetivos-error-sesiones").hidden = datosSesiones.available;
  const lista = document.querySelector("#lista-objetivos");
  lista.replaceChildren();
  selectorObjetivo.replaceChildren();
  if (selectedGoalWeek === null) selectedGoalWeek = vista.weeks[11].start;

  for (const semana of vista.weeks) {
    const formatear = (valor) => {
      const [anio, mes, dia] = valor.split("-").map(Number);
      return new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric" })
        .format(new Date(anio, mes - 1, dia, 12));
    };
    const fila = document.createElement("li");
    fila.className = `objetivo-semana objetivo-${semana.status}`;
    fila.dataset.weekStart = semana.start;
    fila.textContent = `Lunes ${formatear(semana.start)} — domingo ${formatear(semana.end)} · ` +
      `${semana.progressText} · ${semana.achievementText}`;
    if (semana.progressMinutes === null) fila.textContent += ` · Objetivo: ${semana.goalText}`;
    lista.append(fila);
    const option = document.createElement("option");
    option.value = semana.start;
    option.textContent = `Lunes ${formatear(semana.start)} — domingo ${formatear(semana.end)}`;
    selectorObjetivo.append(option);
  }
  if (!vista.weeks.some((week) => week.start === selectedGoalWeek)) {
    const oldOption = document.createElement("option");
    oldOption.value = selectedGoalWeek;
    oldOption.textContent = `Semana ${selectedGoalWeek} (fuera de las 12 visibles)`;
    selectorObjetivo.append(oldOption);
  }
  selectorObjetivo.value = selectedGoalWeek;
}

selectorObjetivo.addEventListener("change", () => {
  selectedGoalWeek = selectorObjetivo.value;
  mostrarObjetivos();
  const metas = leerMetas();
  const week = metas.available ? resolveGoals(metas.entries, fechaLocal(new Date())).weeks
    .find((item) => item.start === selectedGoalWeek) : null;
  minutosObjetivo.value = week && week.status !== "blocked" ? String(week.minutes) : "";
  avisoObjetivo.textContent = week && week.status === "blocked"
    ? "Objetivo no disponible: esta semana tiene datos dudosos y no se puede editar."
    : metas.available ? "" : "No se pueden leer las metas guardadas.";
});

formularioObjetivo.addEventListener("submit", (event) => {
  event.preventDefault();
  const today = fechaLocal(new Date());
  mostrarObjetivos();
  const result = guardarMeta(selectedGoalWeek, minutosObjetivo.value, today);
  if (!result.saved) {
    avisoObjetivo.textContent = {
      "out-of-window": "La semana seleccionada salió de las 12 visibles; la edición no se ha guardado.",
      "invalid-minutes": "La meta debe ser un número positivo de minutos.",
      blocked: "Objetivo no disponible: esta semana tiene datos dudosos y no se puede editar.",
      unavailable: "No se pueden leer las metas guardadas; la edición no se ha guardado.",
      "write-error": "No se pudo guardar la meta; la edición no se ha guardado."
    }[result.reason];
    return;
  }
  mostrarObjetivos();
  avisoObjetivo.textContent = "Meta guardada.";
});

function mostrarMapa() {
  const contenedor = document.querySelector("#mapa-semanas");
  const contenido = document.querySelector("#mapa-contenido");
  const error = document.querySelector("#mapa-error");
  const resultado = buildHeatMap(datosSesiones.available ? sesiones : null, fechaLocal(new Date()));
  contenedor.replaceChildren();
  document.querySelector("#mapa-detalle").hidden = true;
  contenido.hidden = !resultado.available;
  error.hidden = resultado.available;
  if (!resultado.available) return;

  for (const semana of resultado.weeks) {
    const columna = document.createElement("div");
    columna.className = "mapa-semana";
    for (const dia of semana) {
      const casilla = document.createElement("button");
      casilla.type = "button";
      casilla.className = `mapa-dia ${dia.level}`;
      casilla.dataset.date = dia.date;
      const [anio, mes, numero] = dia.date.split("-").map(Number);
      const fecha = new Intl.DateTimeFormat("es", {
        day: "numeric", month: "long", year: "numeric"
      }).format(new Date(anio, mes - 1, numero, 12));
      casilla.setAttribute("aria-label", dia.future
        ? `${fecha}: día futuro`
        : `${fecha}: ${new Intl.NumberFormat("es", { maximumSignificantDigits: 15 }).format(dia.minutes)} min`);
      columna.append(casilla);
    }
    contenedor.append(columna);
  }
}

const mapDays = document.querySelector("#mapa-semanas");
const mapDetail = document.querySelector("#mapa-detalle");
let detailMode = null;
let pointerFocusedDay = null;
let escapedDay = null;

function showDayDetail(day, mode) {
  mapDetail.textContent = day.getAttribute("aria-label");
  mapDetail.hidden = false;
  detailMode = mode;
}

function hideDayDetail() {
  mapDetail.hidden = true;
  detailMode = null;
}

mapDays.addEventListener("pointerover", (event) => {
  if (event.pointerType === "touch" || detailMode === "touch") return;
  const day = event.target.closest(".mapa-dia");
  if (day) showDayDetail(day, "pointer");
});

mapDays.addEventListener("pointerout", (event) => {
  if (event.pointerType !== "touch" && detailMode === "pointer" &&
      event.target.closest(".mapa-dia")) hideDayDetail();
});

mapDays.addEventListener("pointerdown", (event) => {
  const day = event.target.closest(".mapa-dia");
  if (!day) return;
  if (event.pointerType === "touch") showDayDetail(day, "touch");
  else pointerFocusedDay = day;
});

mapDays.addEventListener("focusin", (event) => {
  const day = event.target.closest(".mapa-dia");
  if (day && day !== escapedDay && day !== pointerFocusedDay && detailMode !== "touch") {
    showDayDetail(day, "keyboard");
  }
});

mapDays.addEventListener("focusout", () => {
  if (detailMode === "keyboard") hideDayDetail();
  pointerFocusedDay = null;
  escapedDay = null;
});

mapDays.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mapDetail.hidden) {
    escapedDay = event.target;
    hideDayDetail();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch" && detailMode === "touch" &&
      !event.target.closest(".mapa-dia") && !event.target.closest("#mapa-detalle")) {
    hideDayDetail();
  }
});

function mostrarSesiones() {
  listaSesiones.replaceChildren();

  if (!datosSesiones.available) {
    const mensaje = document.createElement("li");
    mensaje.className = "sin-sesiones";
    mensaje.textContent = "No se pueden leer las sesiones guardadas.";
    listaSesiones.append(mensaje);
    return;
  }

  if (displaySessions.length === 0) {
    const mensaje = document.createElement("li");
    mensaje.className = "sin-sesiones";
    mensaje.textContent = "Todavía no hay sesiones registradas.";
    listaSesiones.append(mensaje);
    return;
  }

  const ordenadas = [...displaySessions].sort((a, b) => b.fecha.localeCompare(a.fecha));
  for (const sesion of ordenadas) {
    const elemento = document.createElement("li");
    const detalles = document.createElement("div");
    const tema = document.createElement("p");
    const fecha = document.createElement("p");
    const minutos = document.createElement("span");

    tema.className = "sesion-tema";
    tema.textContent = sesion.tema;
    fecha.className = "sesion-fecha";
    const [anio, mes, dia] = sesion.fecha.split("-").map(Number);
    fecha.textContent = new Intl.DateTimeFormat("es", {
      day: "numeric", month: "long", year: "numeric"
    }).format(new Date(anio, mes - 1, dia));
    minutos.className = "sesion-minutos";
    minutos.textContent = `${sesion.minutos} min`;

    detalles.append(tema, fecha);
    elemento.append(detalles, minutos);
    listaSesiones.append(elemento);
  }
}

function mostrarRachas() {
  const racha = calcularRacha();
  const mejor = calcularMejorRacha();
  document.querySelector("#dias-racha").textContent = racha;
  document.querySelector("#racha-unidad").textContent =
    racha === 1 ? "día seguido" : "días seguidos";
  document.querySelector("#dias-mejor-racha").textContent = mejor;
  document.querySelector("#mejor-racha-unidad").textContent =
    mejor === 1 ? "día seguido" : "días seguidos";
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!datosSesiones.available) {
    campoTema.setCustomValidity("No se pueden guardar sesiones mientras los datos sean ilegibles.");
    campoTema.reportValidity();
    return;
  }
  const tema = campoTema.value.trim();
  const minutos = Number(campoMinutos.value);
  if (minutos <= 0) {
    campoMinutos.setCustomValidity("Introduce un número mayor que 0.");
    campoMinutos.reportValidity();
    return;
  }
  if (!tema || !Number.isFinite(minutos) || !campoFecha.value) return;

  sesiones.unshift({ fecha: campoFecha.value, tema, minutos });
  displaySessions.unshift(sesiones[0]);
  localStorage.setItem(CLAVE_SESIONES, JSON.stringify(sesiones));
  mostrarSesiones();
  mostrarRachas();
  mostrarMinutosSemana();
  mostrarDiasMes();
  mostrarMapa();
  mostrarObjetivos();
  formulario.reset();
  campoFecha.value = fechaLocal(new Date());
  campoTema.focus();
});

mostrarSesiones();
mostrarRachas();
mostrarMinutosSemana();
mostrarDiasMes();
mostrarObjetivos();
mostrarMapa();
