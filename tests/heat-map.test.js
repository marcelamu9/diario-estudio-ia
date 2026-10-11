const test = require("node:test");
const assert = require("node:assert/strict");
const {
  getHeatMapPeriod, sumMinutesByDay, classifyHeatMapDay, buildHeatMap
} = require("../heat-map.js");

test("groups 84 local dates into 12 Monday-to-Sunday weeks", () => {
  const weeks = getHeatMapPeriod("2026-10-05");

  assert.equal(weeks.length, 12);
  assert.ok(weeks.every((week) => week.length === 7));
  assert.deepEqual(weeks[0][0], { date: "2026-07-20", future: false });
  assert.deepEqual(weeks[11][0], { date: "2026-10-05", future: false });
  assert.deepEqual(weeks[11][6], { date: "2026-10-11", future: true });
});

test("a Sunday finishes the current week with no future days", () => {
  const weeks = getHeatMapPeriod("2026-10-04");

  assert.equal(weeks[0][0].date, "2026-07-13");
  assert.equal(weeks[11][0].date, "2026-09-28");
  assert.equal(weeks[11][6].date, "2026-10-04");
  assert.ok(weeks.flat().every((day) => !day.future));
});

test("crosses year boundaries and leap day without gaps", () => {
  const year = getHeatMapPeriod("2026-01-01");
  assert.equal(year[0][0].date, "2025-10-13");
  assert.equal(year[11][0].date, "2025-12-29");
  assert.equal(year[11][3].date, "2026-01-01");
  assert.equal(year[11][6].date, "2026-01-04");

  const leap = getHeatMapPeriod("2024-03-01").flat();
  assert.equal(leap[0].date, "2023-12-11");
  assert.deepEqual(leap.slice(-4).map((day) => day.date), [
    "2024-02-29", "2024-03-01", "2024-03-02", "2024-03-03"
  ]);
});

test("keeps one calendar day per cell across both daylight saving changes", () => {
  const originalZone = process.env.TZ;
  process.env.TZ = "Europe/Madrid";
  try {
    for (const [today, surroundingDays] of [
      ["2026-03-30", ["2026-03-28", "2026-03-29", "2026-03-30"]],
      ["2026-10-26", ["2026-10-24", "2026-10-25", "2026-10-26"]]
    ]) {
      const days = getHeatMapPeriod(today).flat().map((day) => day.date);
      assert.equal(new Set(days).size, 84);
      assert.deepEqual(days.slice(-9, -6), surroundingDays);
    }
  } finally {
    if (originalZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalZone;
  }
});

test("uses the supplied local day and rejects impossible dates", () => {
  const period = getHeatMapPeriod("2026-10-02");
  assert.equal(period[11][4].date, "2026-10-02");
  assert.equal(period[11][4].future, false);
  assert.equal(period[11][5].future, true);
  assert.throws(() => getHeatMapPeriod("2026-02-30"), RangeError);
});

test("sums valid sessions by local date without changing the input", () => {
  const sessions = Object.freeze([
    Object.freeze({ fecha: "2026-10-01", tema: "A", minutos: 20 }),
    Object.freeze({ fecha: "2026-10-01", tema: "B", minutos: "15" }),
    Object.freeze({ fecha: "2026-10-02", tema: "C", minutos: 0.1 }),
    Object.freeze({ fecha: "2026-10-02", tema: "D", minutos: 0.2 }),
    Object.freeze({ fecha: "2026-07-12", tema: "Antes", minutos: 90 }),
    Object.freeze({ fecha: "2026-10-03", tema: "Futuro", minutos: 80 })
  ]);

  assert.deepEqual(sumMinutesByDay(sessions, "2026-10-02"), {
    available: true,
    totals: { "2026-10-01": 35, "2026-10-02": 0.3 }
  });
});

test("ignores malformed sessions but preserves other valid days", () => {
  const sessions = [
    null, {}, { fecha: "2026-02-30", tema: "X", minutos: 5 },
    { fecha: "2026-10-01", minutos: 5 },
    { fecha: "2026-10-01", tema: "", minutos: 5 },
    { fecha: "2026-10-01", tema: "X", minutos: 0 },
    { fecha: "2026-10-01", tema: "X", minutos: -2 },
    { fecha: "2026-10-01", tema: "X", minutos: "abc" },
    { fecha: "2026-10-01", tema: "X", minutos: Infinity },
    { fecha: "2026-10-01", tema: "Sí", minutos: 10 }
  ];
  assert.deepEqual(sumMinutesByDay(sessions, "2026-10-02"), {
    available: true, totals: { "2026-10-01": 10 }
  });
});

test("distinguishes no sessions from an unreadable collection", () => {
  assert.deepEqual(sumMinutesByDay([], "2026-10-02"), { available: true, totals: {} });
  for (const input of [null, {}, "not a collection", 42]) {
    assert.deepEqual(sumMinutesByDay(input, "2026-10-02"), {
      available: false, totals: null
    });
  }
});

test("classifies fixed minute thresholds and future days", () => {
  const today = "2026-10-02";
  for (const [minutes, expected] of [
    [0, "none"], [0.3, "level-1"], [29.999, "level-1"],
    [30, "level-2"], [59.999, "level-2"],
    [60, "level-3"], [119.999, "level-3"], [120, "level-4"]
  ]) {
    assert.equal(classifyHeatMapDay(today, minutes, today), expected);
  }
  assert.equal(classifyHeatMapDay("2026-10-03", 200, today), "future");
});

test("decimal totals communicate the same level they represent", () => {
  const { totals } = sumMinutesByDay([
    { fecha: "2026-10-01", tema: "A", minutos: 0.1 },
    { fecha: "2026-10-01", tema: "B", minutos: 0.2 },
    { fecha: "2026-10-02", tema: "C", minutos: 29.999 }
  ], "2026-10-02");
  assert.equal(String(totals["2026-10-01"]), "0.3");
  assert.equal(classifyHeatMapDay("2026-10-01", totals["2026-10-01"], "2026-10-02"), "level-1");
  assert.equal(classifyHeatMapDay("2026-10-02", totals["2026-10-02"], "2026-10-02"), "level-1");
});

test("builds a complete empty map with distinct future cells", () => {
  const result = buildHeatMap([], "2026-10-02");
  assert.equal(result.available, true);
  assert.equal(result.weeks.length, 12);
  assert.equal(result.weeks.flat().length, 84);
  assert.deepEqual(result.weeks[11][4], {
    date: "2026-10-02", future: false, minutes: 0, level: "none"
  });
  assert.deepEqual(result.weeks[11][5], {
    date: "2026-10-03", future: true, minutes: null, level: "future"
  });
});

test("builds levels from valid sessions without mutating input", () => {
  const sessions = Object.freeze([
    Object.freeze({ fecha: "2026-10-01", tema: "A", minutos: 20 }),
    Object.freeze({ fecha: "2026-10-01", tema: "B", minutos: 15 }),
    Object.freeze({ fecha: "2026-10-03", tema: "Future", minutos: 120 }),
    null
  ]);
  const result = buildHeatMap(sessions, "2026-10-02");
  assert.deepEqual(result.weeks[11][3], {
    date: "2026-10-01", future: false, minutes: 35, level: "level-2"
  });
  assert.equal(result.weeks[11][5].minutes, null);
});

test("an unreadable collection never appears as zero activity", () => {
  assert.deepEqual(buildHeatMap({ invalid: true }, "2026-10-02"), {
    available: false, weeks: null
  });
});
