const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { getGoalWeeks, parseGoalMinutes, resolveGoals, updateGoalEntry, sumWeeklyMinutes,
  roundGoalMinuteTotal, buildWeeklyGoalView } = require("../weekly-goals.js");

test("returns exactly 12 Monday-to-Sunday intervals, oldest first, when today is Monday", () => {
  const weeks = getGoalWeeks("2026-10-05");
  assert.equal(weeks.length, 12);
  assert.deepEqual(weeks[0], { start: "2026-07-20", end: "2026-07-26" });
  assert.deepEqual(weeks[11], { start: "2026-10-05", end: "2026-10-11" });
  assert.ok(weeks.every((week, index) => index === 0 || weeks[index - 1].end < week.start));
});

test("Sunday remains in its own current week, without a future week", () => {
  const weeks = getGoalWeeks("2026-10-04");
  assert.deepEqual(weeks[0], { start: "2026-07-13", end: "2026-07-19" });
  assert.deepEqual(weeks[11], { start: "2026-09-28", end: "2026-10-04" });
});

test("crosses month, year and leap-day boundaries", () => {
  const weeks = getGoalWeeks("2026-01-01");
  assert.deepEqual(weeks[0], { start: "2025-10-13", end: "2025-10-19" });
  assert.deepEqual(weeks[11], { start: "2025-12-29", end: "2026-01-04" });
  assert.deepEqual(getGoalWeeks("2024-03-01")[11], {
    start: "2024-02-26", end: "2024-03-03"
  });
});

test("follows calendar weeks across both daylight-saving changes", () => {
  const originalZone = process.env.TZ;
  process.env.TZ = "Europe/Madrid";
  try {
    for (const [today, before, after] of [
      ["2026-03-29", "2026-03-23", "2026-03-29"],
      ["2026-10-25", "2026-10-19", "2026-10-25"]
    ]) {
      const weeks = getGoalWeeks(today);
      assert.deepEqual(weeks[11], { start: before, end: after });
      assert.deepEqual(getGoalWeeks(after)[11], weeks[11]);
      assert.deepEqual(getGoalWeeks(before)[11], weeks[11]);
    }
  } finally {
    if (originalZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalZone;
  }
});

test("uses the supplied today rather than the clock, and rejects invalid local dates", () => {
  assert.deepEqual(getGoalWeeks("2026-10-12")[11], {
    start: "2026-10-12", end: "2026-10-18"
  });
  assert.deepEqual(getGoalWeeks("2026-10-05")[11], {
    start: "2026-10-05", end: "2026-10-11"
  });
  for (const date of ["2026-02-30", "2026-10-5", "2026-13-01", null]) {
    assert.throws(() => getGoalWeeks(date), RangeError);
  }
});

test("parses positive finite decimal goals with comma or point without rounding", () => {
  for (const [input, expected] of [["30,5", 30.5], ["30.5", 30.5], [" 0,125 ", 0.125], ["30", 30], ["0.0001", 0.0001]]) {
    assert.equal(parseGoalMinutes(input), expected);
  }
  for (const input of ["", "  ", "abc", "30,5.2", "1e309", "Infinity", "NaN", "0", "-2", "-0.1", "1e-999", null]) {
    assert.equal(parseGoalMinutes(input), null, String(input));
  }
});

test("absent goals default to 30 while explicit 30 remains explicit", () => {
  const empty = resolveGoals([], "2026-10-06");
  assert.equal(empty.available, true);
  assert.equal(empty.weeks.length, 12);
  assert.deepEqual(empty.weeks[11], {
    start: "2026-10-05", end: "2026-10-11", status: "default", minutes: 30
  });
  const explicit = resolveGoals([{ semana: "2026-10-05", minutos: 30 }], "2026-10-06");
  assert.deepEqual(explicit.weeks[11], {
    start: "2026-10-05", end: "2026-10-11", status: "explicit", minutes: 30
  });
  assert.equal(explicit.weeks[10].status, "default");
});

test("identifiable invalid entries and duplicates block only their own week", () => {
  const entries = Object.freeze([
    Object.freeze({ semana: "2026-10-05", minutos: "40" }),
    Object.freeze({ semana: "2026-09-28", minutos: 20 }),
    Object.freeze({ semana: "2026-09-28", minutos: 25 }),
    Object.freeze({ semana: "2026-09-21", minutos: 12 }),
    Object.freeze({ semana: "2026-09-15", minutos: 15 }), // martes identificable, no lunes canónico
    Object.freeze({ semana: "2026-09-07", minutos: Infinity })
  ]);
  const original = entries.map((entry) => ({ ...entry }));
  const { weeks } = resolveGoals(entries, "2026-10-06");
  for (const start of ["2026-10-05", "2026-09-28", "2026-09-14", "2026-09-07"]) {
    const week = weeks.find((item) => item.start === start);
    assert.equal(week.status, "blocked", start);
    assert.equal(week.minutes, null);
  }
  assert.equal(weeks.find((item) => item.start === "2026-09-21").minutes, 12);
  assert.equal(weeks.find((item) => item.start === "2026-09-21").status, "explicit");
  assert.deepEqual(entries, original);
});

test("unidentifiable entries remain untouched and do not block any week", () => {
  const entries = Object.freeze([null, Object.freeze({ semana: "2026-02-30", minutos: 10 }),
    Object.freeze({ semana: "missing", minutos: 40 }), Object.freeze({ minutos: 12 }),
    Object.freeze({ semana: "2026-10-05", minutos: 0.5 })]);
  const result = resolveGoals(entries, "2026-10-06");
  assert.equal(result.available, true);
  assert.equal(result.weeks[11].status, "explicit");
  assert.equal(result.weeks[11].minutes, 0.5);
  assert.ok(result.weeks.slice(0, -1).every((week) => week.status === "default"));
  assert.equal(entries.length, 5);
});

test("unreadable goal collections are unavailable, not defaults", () => {
  for (const entries of [null, undefined, {}, "[]", 30]) {
    assert.deepEqual(resolveGoals(entries, "2026-10-06"), { available: false, weeks: null });
  }
  assert.equal(resolveGoals([], "2026-10-06").available, true);
});

test("edits only the selected visible week after Monday moves, without changing old or doubtful entries", () => {
  const old = Object.freeze({ semana: "2026-07-13", minutos: 7 });
  const unknown = Object.freeze({ semana: "unknown", minutos: 14 });
  const other = Object.freeze({ semana: "2026-10-05", minutos: 30 });
  const selected = Object.freeze({ semana: "2026-09-28", minutos: 12 });
  const entries = Object.freeze([old, unknown, other, selected, null]);
  const result = updateGoalEntry(entries, "2026-09-28", 30.5, "2026-10-12");
  assert.equal(result.updated, true);
  assert.notStrictEqual(result.entries, entries);
  assert.deepEqual(result.entries, [old, unknown, other,
    { semana: "2026-09-28", minutos: 30.5 }, null]);
  assert.strictEqual(result.entries[0], old);
  assert.strictEqual(result.entries[1], unknown);
  assert.strictEqual(result.entries[2], other);
  assert.strictEqual(result.entries[4], null);
  assert.deepEqual(entries, [old, unknown, other, selected, null]);
  assert.equal(resolveGoals(result.entries, "2026-10-12").weeks[9].minutes, 30.5);
  assert.equal(resolveGoals(result.entries, "2026-10-12").weeks[11].status, "default");
});

test("creates a goal for a selected historical week, preserving explicit 30 and other entries", () => {
  const explicit = Object.freeze({ semana: "2026-10-05", minutos: 30 });
  const old = Object.freeze({ semana: "2026-07-13", minutos: 9 });
  const entries = Object.freeze([explicit, old]);
  const result = updateGoalEntry(entries, "2026-09-21", 30, "2026-10-06");
  assert.equal(result.updated, true);
  assert.deepEqual(result.entries, [explicit, old, { semana: "2026-09-21", minutos: 30 }]);
  assert.strictEqual(result.entries[0], explicit);
  assert.equal(resolveGoals(result.entries, "2026-10-06").weeks.find(
    (week) => week.start === "2026-09-21").status, "explicit");
  assert.equal(resolveGoals(result.entries, "2026-10-06").weeks[11].minutes, 30);
});

test("rejects a selected week expelled from the twelve after Monday without writing or switching to current", () => {
  const entries = Object.freeze([Object.freeze({ semana: "2026-07-20", minutos: 15 })]);
  assert.equal(getGoalWeeks("2026-10-05")[0].start, "2026-07-20");
  const result = updateGoalEntry(entries, "2026-07-20", 60, "2026-10-12");
  assert.deepEqual(result, { updated: false, reason: "out-of-window", entries });
  assert.strictEqual(result.entries, entries);
});

test("refuses blocked and noncanonical selections while preserving all doubtful entries", () => {
  const entries = Object.freeze([
    Object.freeze({ semana: "2026-09-28", minutos: 5 }),
    Object.freeze({ semana: "2026-09-28", minutos: 8 }),
    Object.freeze({ semana: "2026-09-15", minutos: 10 }),
    Object.freeze({ semana: "2026-10-05", minutos: "bad" }),
    Object.freeze({ semana: "nonsense", minutos: 42 })
  ]);
  for (const week of ["2026-09-28", "2026-09-14", "2026-10-05"]) {
    const result = updateGoalEntry(entries, week, 50, "2026-10-06");
    assert.deepEqual(result, { updated: false, reason: "blocked", entries });
    assert.strictEqual(result.entries, entries);
  }
  assert.deepEqual(updateGoalEntry(entries, "2026-09-29", 50, "2026-10-06"),
    { updated: false, reason: "out-of-window", entries });
});

test("refuses invalid minutes and unavailable collections without changing the original", () => {
  const entries = Object.freeze([Object.freeze({ semana: "2026-10-05", minutos: 20 })]);
  for (const minutes of [0, -1, NaN, Infinity, "30", null]) {
    const result = updateGoalEntry(entries, "2026-10-05", minutes, "2026-10-06");
    assert.equal(result.updated, false);
    assert.strictEqual(result.entries, entries);
  }
  const unavailable = updateGoalEntry(null, "2026-10-05", 30, "2026-10-06");
  assert.deepEqual(unavailable, { updated: false, reason: "unavailable", entries: null });
});

test("sums every usable session in its week, including duplicates on one day, without rounding", () => {
  const weeks = getGoalWeeks("2026-10-06");
  const sessions = Object.freeze([
    Object.freeze({ fecha: "2026-10-05", tema: "Álgebra", minutos: 0.25 }),
    Object.freeze({ fecha: "2026-10-05", tema: "Física", minutos: 0.25 }),
    Object.freeze({ fecha: "2026-10-06", tema: "Lectura", minutos: "0.25" }),
    Object.freeze({ fecha: "2026-09-28", tema: "Repaso", minutos: 12.5 }),
    Object.freeze({ fecha: "2026-10-04", tema: "Repaso", minutos: 17.25 })
  ]);
  const result = sumWeeklyMinutes(sessions, "2026-10-06", weeks);
  assert.equal(result.available, true);
  assert.equal(result.totals["2026-10-05"], 0.75);
  assert.equal(result.totals["2026-09-28"], 29.75);
  assert.equal(result.totals["2026-09-21"], 0);
  assert.equal(Object.keys(result.totals).length, 12);
  assert.equal(sessions[0].minutos, 0.25);
  assert.equal(sessions[2].minutos, "0.25");
  assert.deepEqual(weeks[11], { start: "2026-10-05", end: "2026-10-11" });
});

test("excludes future dates, days outside the visible window and unusable topics", () => {
  const weeks = getGoalWeeks("2026-10-06");
  const sessions = Object.freeze([
    Object.freeze({ fecha: "2026-10-06", tema: " Válido ", minutos: 5 }),
    Object.freeze({ fecha: "2026-10-06", minutos: 100 }),
    Object.freeze({ fecha: "2026-10-06", tema: "", minutos: 100 }),
    Object.freeze({ fecha: "2026-10-06", tema: "  \t  ", minutos: 100 }),
    Object.freeze({ fecha: "2026-10-06", tema: 12, minutos: 100 }),
    Object.freeze({ fecha: "2026-10-07", tema: "Mañana", minutos: 100 }),
    Object.freeze({ fecha: "2026-10-11", tema: "Domingo futuro", minutos: 100 }),
    Object.freeze({ fecha: "2026-07-19", tema: "Antes", minutos: 100 })
  ]);
  assert.equal(sumWeeklyMinutes(sessions, "2026-10-06", weeks).totals["2026-10-05"], 5);
  assert.equal(sumWeeklyMinutes(sessions, "2026-10-07", weeks).totals["2026-10-05"], 105);
  assert.equal(sessions.length, 8);
});

test("ignores invalid dates, minutes and entries without altering the collection", () => {
  const invalidMinutes = [0, -1, NaN, Infinity, "", "   ", "bad", "Infinity", "0", {}, null];
  const sessions = Object.freeze([
    null, undefined, 12, [],
    ...["2026-02-30", "2026-13-01", "2026-10-6", "not-a-date"].map(
      (fecha) => Object.freeze({ fecha, tema: "Inválido", minutos: 90 })),
    ...invalidMinutes.map((minutos) => Object.freeze({ fecha: "2026-10-06", tema: "Inválido", minutos })),
    Object.freeze({ fecha: "2026-10-06", tema: "Correcto", minutos: "2.5" })
  ]);
  const result = sumWeeklyMinutes(sessions, "2026-10-06", getGoalWeeks("2026-10-06"));
  assert.equal(result.totals["2026-10-05"], 2.5);
  assert.equal(sessions.length, 20);
  assert.equal(sessions[0], null);
  assert.equal(sessions[8].minutos, 0);
});

test("attributes sessions across the year, leap day and both DST boundaries by local calendar", () => {
  const originalZone = process.env.TZ;
  process.env.TZ = "Europe/Madrid";
  try {
    for (const [today, start, dates] of [
      ["2026-01-01", "2025-12-29", ["2025-12-29", "2025-12-31", "2026-01-01"]],
      ["2024-03-03", "2024-02-26", ["2024-02-29", "2024-03-03"]],
      ["2026-03-29", "2026-03-23", ["2026-03-28", "2026-03-29"]],
      ["2026-10-25", "2026-10-19", ["2026-10-24", "2026-10-25"]]
    ]) {
      const sessions = dates.map((fecha) => ({ fecha, tema: "Estudio", minutos: 1 }));
      const result = sumWeeklyMinutes(sessions, today, getGoalWeeks(today));
      assert.equal(result.totals[start], dates.length, today);
    }
  } finally {
    if (originalZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalZone;
  }
});

test("unreadable session collections are unavailable rather than zero", () => {
  const weeks = getGoalWeeks("2026-10-06");
  for (const sessions of [null, undefined, {}, "[]", 0]) {
    assert.deepEqual(sumWeeklyMinutes(sessions, "2026-10-06", weeks),
      { available: false, totals: null });
  }
  assert.equal(sumWeeklyMinutes([], "2026-10-06", weeks).totals["2026-10-05"], 0);
});

test("rounds a weekly total and its goal independently, with halves rounding up", () => {
  for (const [value, expected] of [[0, 0], [29.49, 29], [29.5, 30],
    [29.99, 30], [30.5, 31], [30.9, 31]]) {
    assert.equal(roundGoalMinuteTotal(value), expected);
  }
});

test("builds twelve dated weeks with default and explicit 30 without persisting a default", () => {
  const entries = Object.freeze([Object.freeze({ semana: "2026-09-28", minutos: 30 })]);
  const view = buildWeeklyGoalView([], entries, "2026-10-06");
  assert.equal(view.weeks.length, 12);
  assert.deepEqual(view.weeks.map(({ start, end }) => ({ start, end })), getGoalWeeks("2026-10-06"));
  assert.deepEqual(view.weeks[11], {
    start: "2026-10-05", end: "2026-10-11", goalStatus: "default",
    goalMinutes: 30, progressMinutes: 0, goalText: "30 min",
    progressText: "0 de 30 min", status: "pending", achievementText: "Meta pendiente"
  });
  assert.equal(view.weeks[10].goalStatus, "explicit");
  assert.equal(view.weeks[10].goalMinutes, 30);
  assert.equal(view.weeks[10].status, "pending");
  assert.equal(entries.length, 1);
});

test("rounds the weekly sum once, compares the displayed integers and keeps source decimals", () => {
  const sessions = Object.freeze([
    Object.freeze({ fecha: "2026-10-05", tema: "A", minutos: 14.995 }),
    Object.freeze({ fecha: "2026-10-06", tema: "B", minutos: 14.995 }),
    Object.freeze({ fecha: "2026-10-06", tema: " ", minutos: 100 }),
    Object.freeze({ fecha: "2026-10-07", tema: "Futuro", minutos: 100 })
  ]);
  const current = buildWeeklyGoalView(sessions, [], "2026-10-06").weeks[11];
  assert.equal(current.progressMinutes, 30);
  assert.equal(current.progressText, "30 de 30 min");
  assert.equal(current.status, "achieved");
  assert.equal(current.achievementText, "Meta cumplida");
  assert.equal(sessions[0].minutos, 14.995);
  assert.equal(buildWeeklyGoalView([{ fecha: "2026-10-06", tema: "A", minutos: 29.5 }],
    [{ semana: "2026-10-05", minutos: 30.5 }], "2026-10-06").weeks[11].progressText, "30 de 31 min");
  const pending = buildWeeklyGoalView([{ fecha: "2026-10-06", tema: "A", minutos: 29.5 }],
    [{ semana: "2026-10-05", minutos: 30.5 }], "2026-10-06").weeks[11];
  assert.equal(pending.goalMinutes, 31);
  assert.equal(pending.status, "pending");
  assert.equal(pending.achievementText, "Meta pendiente");
});

test("ten decimal sessions reach the half-minute boundary before weekly rounding", () => {
  const sessions = Object.freeze(Array.from({ length: 10 }, () =>
    Object.freeze({ fecha: "2026-10-06", tema: "Estudio", minutos: 0.05 })));
  const goals = Object.freeze([Object.freeze({ semana: "2026-10-05", minutos: 0.5 })]);
  const week = buildWeeklyGoalView(sessions, goals, "2026-10-06").weeks[11];
  assert.equal(sumWeeklyMinutes(sessions, "2026-10-06", getGoalWeeks("2026-10-06"))
    .totals["2026-10-05"], 0.5);
  assert.equal(week.progressText, "1 de 1 min");
  assert.equal(week.status, "achieved");
  assert.equal(week.achievementText, "Meta cumplida");
  assert.equal(sessions[0].minutos, 0.05);
  assert.equal(goals[0].minutos, 0.5);
});

test("a decimal sum just below half a minute must not become a false achievement", () => {
  const sessions = [0.4, 0.09999999999999999].map((minutos) =>
    ({ fecha: "2026-10-06", tema: "Estudio", minutos }));
  const week = buildWeeklyGoalView(sessions,
    [{ semana: "2026-10-05", minutos: 0.5 }], "2026-10-06").weeks[11];
  assert.equal(week.progressMinutes, 0);
  assert.equal(week.progressText, "0 de 1 min");
  assert.equal(week.status, "pending");
  assert.equal(week.achievementText, "Meta pendiente");
});

test("recalculates achievement when a session or the selected week's goal changes", () => {
  const sessions = [{ fecha: "2026-09-28", tema: "Historia", minutos: 29.99 }];
  const entries = [{ semana: "2026-09-28", minutos: 30.5 }];
  const historic = (items, goals) => buildWeeklyGoalView(items, goals, "2026-10-06")
    .weeks.find((week) => week.start === "2026-09-28");
  assert.equal(historic(sessions, entries).status, "pending");
  assert.equal(historic(sessions, [{ semana: "2026-09-28", minutos: 30 }]).status, "achieved");
  assert.equal(historic([...sessions, { fecha: "2026-09-29", tema: "Más", minutos: 0.51 }],
    entries).status, "achieved");
  assert.equal(historic(sessions, entries).status, "pending");
});

test("unreadable sessions or goals and a blocked week never claim an achievement", () => {
  const sessions = [{ fecha: "2026-10-06", tema: "Estudio", minutos: 40 }];
  const goals = [{ semana: "2026-10-05", minutos: 30 }];
  const noSessions = buildWeeklyGoalView(null, goals, "2026-10-06").weeks[11];
  assert.equal(noSessions.goalMinutes, 30);
  assert.equal(noSessions.progressMinutes, null);
  assert.equal(noSessions.progressText, "Progreso no disponible");
  assert.equal(noSessions.status, "unavailable");
  assert.equal(noSessions.achievementText, "Logro no disponible");

  const noGoals = buildWeeklyGoalView(sessions, null, "2026-10-06").weeks[11];
  assert.equal(noGoals.progressMinutes, 40);
  assert.equal(noGoals.goalMinutes, null);
  assert.equal(noGoals.goalText, "Objetivo no disponible");
  assert.equal(noGoals.progressText, "40 min estudiados; objetivo no disponible");
  assert.equal(noGoals.status, "unavailable");
  assert.equal(noGoals.achievementText, "Logro no disponible");

  const blocked = buildWeeklyGoalView(sessions,
    [{ semana: "2026-10-05", minutos: "30" }], "2026-10-06").weeks[11];
  assert.equal(blocked.goalStatus, "blocked");
  assert.equal(blocked.goalText, "Objetivo no disponible");
  assert.equal(blocked.status, "unavailable");
  assert.equal(buildWeeklyGoalView(sessions,
    [{ semana: "2026-10-05", minutos: "30" }], "2026-10-06").weeks[10].status, "pending");
  const neither = buildWeeklyGoalView(null, null, "2026-10-06").weeks[11];
  assert.equal(neither.progressText, "Progreso no disponible");
  assert.equal(neither.goalText, "Objetivo no disponible");
  assert.equal(neither.status, "unavailable");
});

function createAppStorage(initial = {}, clock = null) {
  const stored = new Map(Object.entries(initial));
  let failRead = false;
  let failWrite = false;
  const element = () => ({ value: "", hidden: false, textContent: "", dataset: {}, children: [],
    listeners: {}, addEventListener(type, listener) { this.listeners[type] = listener; },
    dispatch(type) { this.listeners[type]({ preventDefault() {}, target: this }); },
    replaceChildren(...items) { this.children = items; },
    append(...items) { this.children.push(...items); }, setCustomValidity() {}, focus() {},
    reset() {}, reportValidity() {} });
  const nodes = new Map();
  const document = {
    querySelector(selector) {
      if (!nodes.has(selector)) nodes.set(selector, element());
      return nodes.get(selector);
    },
    addEventListener() {},
    createElement() { return element(); }
  };
  const localStorage = {
    getItem(key) {
      if (failRead && key === "diario-de-estudio-metas-semanales") throw Error("read denied");
      return stored.has(key) ? stored.get(key) : null;
    },
    setItem(key, value) {
      if (failWrite && key === "diario-de-estudio-metas-semanales") throw Error("quota");
      stored.set(key, value);
    }
  };
  const AppDate = clock ? class extends Date {
    constructor(...args) { super(...(args.length ? args : [clock.value])); }
  } : Date;
  const context = vm.createContext({ document, localStorage, Date: AppDate, Intl, Set, Map,
    buildHeatMap: () => ({ available: false }), parseGoalMinutes, updateGoalEntry,
    buildWeeklyGoalView, resolveGoals });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../app.js"), "utf8"), context);
  return { stored, context, nodes, failRead(value) { failRead = value; },
    failWrite(value) { failWrite = value; } };
}

test("absent goals use default without persisting and a decimal edit survives rereading without touching sessions", () => {
  const sessions = '[{"fecha":"2026-10-06","tema":"Lectura","minutos":12}]';
  const app = createAppStorage({ "diario-de-estudio-sesiones": sessions });
  assert.equal(app.context.leerMetas().available, true);
  assert.equal(app.context.leerMetas().entries.length, 0);
  assert.equal(app.stored.has("diario-de-estudio-metas-semanales"), false);
  assert.equal(app.context.guardarMeta("2026-10-05", "30,5", "2026-10-06").saved, true);
  assert.deepEqual(JSON.parse(app.stored.get("diario-de-estudio-metas-semanales")),
    [{ semana: "2026-10-05", minutos: 30.5 }]);
  assert.equal(app.stored.get("diario-de-estudio-sesiones"), sessions);
  assert.equal(app.context.leerMetas().entries[0].minutos, 30.5);
});

test("edits the explicitly selected historical week, reports invalid input, and refreshes achievement", () => {
  const clock = { value: new Date(2026, 9, 6, 12) };
  const sessionKey = "diario-de-estudio-sesiones";
  const goalKey = "diario-de-estudio-metas-semanales";
  const sessions = JSON.stringify([{ fecha: "2026-09-28", tema: "Historia", minutos: 29.99 }]);
  const app = createAppStorage({ [sessionKey]: sessions }, clock);
  const selection = app.nodes.get("#objetivo-semana");
  const input = app.nodes.get("#objetivo-minutos");
  const message = app.nodes.get("#objetivo-aviso");
  const form = app.nodes.get("#formulario-objetivo");
  selection.value = "2026-09-28";
  selection.dispatch("change");
  input.value = "30,5";
  form.dispatch("submit");
  assert.deepEqual(JSON.parse(app.stored.get(goalKey)), [{ semana: "2026-09-28", minutos: 30.5 }]);
  assert.match(app.nodes.get("#lista-objetivos").children[10].textContent, /30 de 31 min.*Meta pendiente/);
  input.value = "0";
  form.dispatch("submit");
  assert.match(message.textContent, /número positivo/);
  assert.equal(JSON.parse(app.stored.get(goalKey))[0].minutos, 30.5);
  input.value = "30.0";
  form.dispatch("submit");
  assert.match(app.nodes.get("#lista-objetivos").children[10].textContent, /30 de 30 min.*Meta cumplida/);
  assert.equal(selection.value, "2026-09-28");
  assert.equal(app.stored.get(sessionKey), sessions);
});

test("refreshes window on selection and refuses an expelled week on confirm without writing", () => {
  const clock = { value: new Date(2026, 9, 6, 12) };
  const key = "diario-de-estudio-metas-semanales";
  const original = JSON.stringify([{ semana: "2026-07-20", minutos: 15 }]);
  const app = createAppStorage({ [key]: original }, clock);
  const selection = app.nodes.get("#objetivo-semana");
  selection.value = "2026-07-20";
  selection.dispatch("change");
  clock.value = new Date(2026, 9, 12, 12);
  app.nodes.get("#objetivo-minutos").value = "60";
  app.nodes.get("#formulario-objetivo").dispatch("submit");
  assert.equal(app.stored.get(key), original);
  assert.match(app.nodes.get("#objetivo-aviso").textContent, /no se ha guardado/);
  assert.equal(app.nodes.get("#lista-objetivos").children[0].dataset.weekStart, "2026-07-27");
  assert.equal(selection.value, "2026-07-20");
  selection.value = "2026-10-05";
  selection.dispatch("change");
  assert.equal(selection.value, "2026-10-05");
  assert.equal(app.nodes.get("#lista-objetivos").children[11].dataset.weekStart, "2026-10-12");
});

test("session save immediately refreshes the selected goal and a blocked week cannot be overwritten", () => {
  const clock = { value: new Date(2026, 9, 6, 12) };
  const goalKey = "diario-de-estudio-metas-semanales";
  const raw = JSON.stringify([{ semana: "2026-09-28", minutos: "bad" }]);
  const app = createAppStorage({ [goalKey]: raw }, clock);
  const selection = app.nodes.get("#objetivo-semana");
  selection.value = "2026-09-28";
  selection.dispatch("change");
  app.nodes.get("#objetivo-minutos").value = "20";
  app.nodes.get("#formulario-objetivo").dispatch("submit");
  assert.equal(app.stored.get(goalKey), raw);
  assert.match(app.nodes.get("#objetivo-aviso").textContent, /no disponible/);
  selection.value = "2026-10-05";
  selection.dispatch("change");
  app.nodes.get("#fecha").value = "2026-10-06";
  app.nodes.get("#tema").value = "Lectura";
  app.nodes.get("#minutos").value = "30";
  app.nodes.get("#formulario-sesion").dispatch("submit");
  assert.match(app.nodes.get("#lista-objetivos").children[11].textContent, /30 de 30 min.*Meta cumplida/);
  assert.equal(selection.value, "2026-10-05");
  assert.equal(app.stored.get(goalKey), raw);
});

test("editing goals preserves invisible and doubtful entries and rejects blocked or invalid edits", () => {
  const key = "diario-de-estudio-metas-semanales";
  const entries = [{ semana: "2026-07-13", minutos: 5 }, null,
    { semana: "2026-09-15", minutos: 9 }, { semana: "2026-10-05", minutos: 30 }];
  const app = createAppStorage({ [key]: JSON.stringify(entries) });
  assert.equal(app.context.guardarMeta("2026-09-14", "40", "2026-10-06").saved, false);
  assert.equal(app.stored.get(key), JSON.stringify(entries));
  assert.equal(app.context.guardarMeta("2026-10-05", "", "2026-10-06").saved, false);
  assert.equal(app.stored.get(key), JSON.stringify(entries));
  assert.equal(app.context.guardarMeta("2026-10-05", "0.125", "2026-10-06").saved, true);
  assert.deepEqual(JSON.parse(app.stored.get(key)), [...entries.slice(0, 3),
    { semana: "2026-10-05", minutos: 0.125 }]);
});

test("unreadable goal collections and storage failures cannot report a successful save", () => {
  const key = "diario-de-estudio-metas-semanales";
  for (const raw of ["{", "{}", "null"]) {
    const app = createAppStorage({ [key]: raw });
    assert.equal(app.context.leerMetas().available, false);
    assert.equal(app.context.guardarMeta("2026-10-05", "30", "2026-10-06").saved, false);
    assert.equal(app.stored.get(key), raw);
  }
  const app = createAppStorage({ [key]: "[]" });
  app.failRead(true);
  assert.equal(app.context.guardarMeta("2026-10-05", "30", "2026-10-06").saved, false);
  app.failRead(false);
  app.failWrite(true);
  const result = app.context.guardarMeta("2026-10-05", "30", "2026-10-06");
  assert.equal(result.saved, false);
  assert.equal(result.reason, "write-error");
  assert.equal(app.stored.get(key), "[]");
});

test("renders twelve dated weeks with default, historical achievement and current pending progress", () => {
  const today = new Date();
  const localToday = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")].join("-");
  const weeks = getGoalWeeks(localToday);
  const sessions = [{ fecha: weeks[10].start, tema: "Historia", minutos: 29.99 },
    { fecha: localToday, tema: "  ", minutos: 100 }];
  const goals = [{ semana: weeks[10].start, minutos: 30 }];
  const app = createAppStorage({ "diario-de-estudio-sesiones": JSON.stringify(sessions),
    "diario-de-estudio-metas-semanales": JSON.stringify(goals) });
  const rows = app.nodes.get("#lista-objetivos").children;
  assert.equal(rows.length, 12);
  assert.equal(rows[0].dataset.weekStart, weeks[0].start);
  assert.match(rows[0].textContent, /0 de 30 min.*Meta pendiente/);
  assert.match(rows[10].textContent, /30 de 30 min.*Meta cumplida/);
  assert.match(rows[11].textContent, /0 de 30 min.*Meta pendiente/);
  assert.match(rows[11].textContent, /lunes|domingo|\d/);
  assert.equal(app.nodes.get("#objetivos-error-metas").hidden, true);
  assert.equal(app.nodes.get("#objetivos-error-sesiones").hidden, true);
  assert.equal(app.stored.get("diario-de-estudio-metas-semanales"), JSON.stringify(goals));
});

test("renders independent warnings and never turns unreadable data into zero or achieved", () => {
  for (const [sessions, goals, sessionError, goalError, progress, goal] of [
    ["{", "[]", false, true, "Progreso no disponible", "30 min"],
    ["[]", "{", true, false, "0 min estudiados; objetivo no disponible", "Objetivo no disponible"],
    ["{", "{", false, false, "Progreso no disponible", "Objetivo no disponible"]
  ]) {
    const app = createAppStorage({ "diario-de-estudio-sesiones": sessions,
      "diario-de-estudio-metas-semanales": goals });
    assert.equal(app.nodes.get("#objetivos-error-metas").hidden, goalError);
    assert.equal(app.nodes.get("#objetivos-error-sesiones").hidden, sessionError);
    const last = app.nodes.get("#lista-objetivos").children[11].textContent;
    assert.ok(last.includes(progress), last);
    assert.ok(last.toLowerCase().includes(goal.toLowerCase()), last);
    assert.ok(last.includes("Logro no disponible"), last);
    assert.ok(!last.includes("Meta cumplida"), last);
    assert.equal(app.stored.get("diario-de-estudio-sesiones"), sessions);
    assert.equal(app.stored.get("diario-de-estudio-metas-semanales"), goals);
  }
});
