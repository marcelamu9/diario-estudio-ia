function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getHeatMapPeriod(today) {
  if (typeof today !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    throw new RangeError("Invalid local date");
  }

  const [year, month, day] = today.split("-").map(Number);
  const currentDay = new Date(year, month - 1, day, 12);
  if (formatLocalDate(currentDay) !== today) {
    throw new RangeError("Invalid local date");
  }

  const firstDay = new Date(year, month - 1, day, 12);
  firstDay.setDate(firstDay.getDate() - (firstDay.getDay() + 6) % 7 - 11 * 7);

  const weeks = [];
  for (let weekIndex = 0; weekIndex < 12; weekIndex++) {
    const week = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = formatLocalDate(firstDay);
      week.push({ date, future: date > today });
      firstDay.setDate(firstDay.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function isValidLocalDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  return formatLocalDate(new Date(year, month - 1, day, 12)) === value;
}

function sumMinutesByDay(sessions, today) {
  if (!Array.isArray(sessions)) return { available: false, totals: null };

  const firstDate = getHeatMapPeriod(today)[0][0].date;
  const totals = {};
  for (const session of sessions) {
    if (!session || typeof session !== "object" || Array.isArray(session)) continue;
    if (!isValidLocalDate(session.fecha) || session.fecha < firstDate || session.fecha > today) continue;
    if (typeof session.tema !== "string" || !session.tema.trim()) continue;

    const rawMinutes = session.minutos;
    if (typeof rawMinutes !== "number" &&
        (typeof rawMinutes !== "string" || !rawMinutes.trim())) continue;
    const minutes = Number(rawMinutes);
    if (!Number.isFinite(minutes) || minutes <= 0) continue;

    totals[session.fecha] = Number(((totals[session.fecha] || 0) + minutes).toPrecision(15));
  }
  return { available: true, totals };
}

function classifyHeatMapDay(date, minutes, today) {
  if (date > today) return "future";
  if (minutes === 0) return "none";
  if (minutes < 30) return "level-1";
  if (minutes < 60) return "level-2";
  if (minutes < 120) return "level-3";
  return "level-4";
}

function buildHeatMap(sessions, today) {
  const weeks = getHeatMapPeriod(today);
  const result = sumMinutesByDay(sessions, today);
  if (!result.available) return { available: false, weeks: null };

  return {
    available: true,
    weeks: weeks.map((week) => week.map((day) => {
      const minutes = day.future ? null : (result.totals[day.date] || 0);
      return {
        date: day.date,
        future: day.future,
        minutes,
        level: classifyHeatMapDay(day.date, minutes, today)
      };
    }))
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getHeatMapPeriod, sumMinutesByDay, classifyHeatMapDay, buildHeatMap };
}
