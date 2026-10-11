function formatGoalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getGoalWeeks(today) {
  if (typeof today !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    throw new RangeError("Invalid local date");
  }

  const [year, month, day] = today.split("-").map(Number);
  const monday = new Date(year, month - 1, day, 12);
  if (formatGoalDate(monday) !== today) {
    throw new RangeError("Invalid local date");
  }
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7 - 11 * 7);

  const weeks = [];
  for (let index = 0; index < 12; index++) {
    const start = formatGoalDate(monday);
    monday.setDate(monday.getDate() + 6);
    weeks.push({ start, end: formatGoalDate(monday) });
    monday.setDate(monday.getDate() + 1);
  }
  return weeks;
}

function parseGoalMinutes(input) {
  if (typeof input !== "string") return null;
  const text = input.trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(text)) return null;
  const minutes = Number(text.replace(",", "."));
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
}

function goalWeekStart(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  if (formatGoalDate(date) !== value) return null;
  date.setDate(date.getDate() - (date.getDay() + 6) % 7);
  return formatGoalDate(date);
}

function resolveGoals(entries, today) {
  if (!Array.isArray(entries)) return { available: false, weeks: null };
  const weeks = getGoalWeeks(today).map((week) => ({
    ...week, status: "default", minutes: 30
  }));
  const visible = new Map(weeks.map((week) => [week.start, week]));
  const seen = new Set();

  for (const entry of entries) {
    const start = goalWeekStart(entry && entry.semana);
    const week = visible.get(start);
    if (!week) continue;
    const valid = entry.semana === start &&
      typeof entry.minutos === "number" && Number.isFinite(entry.minutos) && entry.minutos > 0;
    if (seen.has(start) || !valid) {
      week.status = "blocked";
      week.minutes = null;
    } else {
      week.status = "explicit";
      week.minutes = entry.minutos;
    }
    seen.add(start);
  }
  return { available: true, weeks };
}

function updateGoalEntry(entries, weekStart, minutes, today) {
  if (!Array.isArray(entries)) {
    return { updated: false, reason: "unavailable", entries };
  }

  const selected = resolveGoals(entries, today).weeks.find((week) => week.start === weekStart);
  if (!selected) {
    return { updated: false, reason: "out-of-window", entries };
  }
  if (selected.status === "blocked") {
    return { updated: false, reason: "blocked", entries };
  }
  if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes <= 0) {
    return { updated: false, reason: "invalid-minutes", entries };
  }

  const replacement = { semana: weekStart, minutos: minutes };
  const index = entries.findIndex((entry) => goalWeekStart(entry && entry.semana) === weekStart);
  const updatedEntries = [...entries];
  if (index === -1) updatedEntries.push(replacement);
  else updatedEntries[index] = replacement;
  return { updated: true, entries: updatedEntries };
}

function decimalMinutes(minutes) {
  const [mantissa, power = "0"] = String(minutes).split("e");
  const fraction = mantissa.split(".")[1] || "";
  const exponent = Number(power) - fraction.length;
  const digits = BigInt(mantissa.replace(".", ""));
  return exponent >= 0
    ? { units: digits * 10n ** BigInt(exponent), places: 0 }
    : { units: digits, places: -exponent };
}

function sumWeeklyMinutesExact(sessions, today, weeks) {
  if (!Array.isArray(sessions)) return { available: false, totals: null };

  const sums = Object.fromEntries(weeks.map((week) =>
    [week.start, { units: 0n, places: 0 }]));
  for (const session of sessions) {
    if (!session || typeof session !== "object" || Array.isArray(session)) continue;
    const start = goalWeekStart(session.fecha);
    if (start === null || !Object.hasOwn(sums, start) || session.fecha > today) continue;
    if (typeof session.tema !== "string" || !session.tema.trim()) continue;

    const rawMinutes = session.minutos;
    if (typeof rawMinutes !== "number" &&
        (typeof rawMinutes !== "string" || !rawMinutes.trim())) continue;
    const minutes = Number(rawMinutes);
    if (!Number.isFinite(minutes) || minutes <= 0) continue;
    const part = decimalMinutes(minutes);
    const sum = sums[start];
    const places = Math.max(sum.places, part.places);
    sums[start] = {
      units: sum.units * 10n ** BigInt(places - sum.places) +
        part.units * 10n ** BigInt(places - part.places),
      places
    };
  }
  const totals = {};
  const roundedTotals = {};
  for (const week of weeks) {
    const { units, places } = sums[week.start];
    const divisor = 10n ** BigInt(places);
    totals[week.start] = Number(`${units}e-${places}`);
    roundedTotals[week.start] = Number((units * 2n + divisor) / (2n * divisor));
  }
  return { available: true, totals, roundedTotals };
}

function sumWeeklyMinutes(sessions, today, weeks) {
  const result = sumWeeklyMinutesExact(sessions, today, weeks);
  return { available: result.available, totals: result.totals };
}

function roundGoalMinuteTotal(value) {
  return Math.round(value);
}

function buildWeeklyGoalView(sessions, entries, today) {
  const weeks = getGoalWeeks(today);
  const goals = resolveGoals(entries, today);
  const progress = sumWeeklyMinutesExact(sessions, today, weeks);

  return { weeks: weeks.map((week, index) => {
    const goal = goals.available ? goals.weeks[index] : null;
    const goalStatus = goal ? goal.status : "unavailable";
    const goalMinutes = goal && goal.status !== "blocked"
      ? roundGoalMinuteTotal(goal.minutes) : null;
    const progressMinutes = progress.available
      ? progress.roundedTotals[week.start] : null;
    const comparable = goalMinutes !== null && progressMinutes !== null;
    const status = !comparable ? "unavailable"
      : progressMinutes >= goalMinutes ? "achieved" : "pending";

    return {
      ...week,
      goalStatus,
      goalMinutes,
      progressMinutes,
      goalText: goalMinutes === null ? "Objetivo no disponible" : `${goalMinutes} min`,
      progressText: progressMinutes === null ? "Progreso no disponible"
        : goalMinutes === null ? `${progressMinutes} min estudiados; objetivo no disponible`
          : `${progressMinutes} de ${goalMinutes} min`,
      status,
      achievementText: status === "achieved" ? "Meta cumplida"
        : status === "pending" ? "Meta pendiente" : "Logro no disponible"
    };
  }) };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getGoalWeeks, parseGoalMinutes, resolveGoals, updateGoalEntry,
    sumWeeklyMinutes, roundGoalMinuteTotal, buildWeeklyGoalView };
}
