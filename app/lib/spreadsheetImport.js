import * as XLSX from "xlsx";

export const REQUIRED_COLUMNS = ["Week", "Day", "Exercise"];

// Reads a .xlsx or .csv File into an array of row objects keyed by column header — xlsx
// parses both formats through the same API, so one code path covers both upload types.
export async function readWorkbookRows(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

function cellText(value) {
  return String(value ?? "").trim();
}

// Converts the flat row list into this app's weeks/days/exercises structure (see
// app/lib/programsData.js), collecting per-row problems instead of throwing on the first
// bad row — a trainer fixing a typo in row 40 shouldn't have to guess whether row 12 was
// also broken.
export function parseProgramRows(rows) {
  if (!rows || rows.length === 0) {
    return { weeks: [], errors: ["The spreadsheet has no data rows."], duration: 0, sessionsPerWeek: "0 sessions/week", programName: "" };
  }

  const headerKeys = Object.keys(rows[0]);
  const missingColumns = REQUIRED_COLUMNS.filter((col) => !headerKeys.includes(col));
  if (missingColumns.length > 0) {
    return {
      weeks: [],
      errors: [`Missing required column(s): ${missingColumns.join(", ")}.`],
      duration: 0,
      sessionsPerWeek: "0 sessions/week",
      programName: "",
    };
  }

  const errors = [];
  let programName = "";
  const weekMap = new Map(); // week number -> Map(day number -> exercises[])

  rows.forEach((row, index) => {
    const rowNum = index + 2; // 1-based + header row, so this matches the row a trainer sees in Excel
    const weekRaw = row["Week"];
    const dayRaw = row["Day"];
    const exerciseName = cellText(row["Exercise"]);
    const setsRaw = row["Sets"];
    const nameCell = cellText(row["Program Name"]);
    if (nameCell && !programName) programName = nameCell;

    const isBlankRow = cellText(weekRaw) === "" && cellText(dayRaw) === "" && exerciseName === "";
    if (isBlankRow) return;

    const week = Number(weekRaw);
    const day = Number(dayRaw);

    if (!Number.isFinite(week) || week <= 0) {
      errors.push(`Row ${rowNum}: "Week" must be a positive number (got "${weekRaw}").`);
      return;
    }
    if (!Number.isFinite(day) || day <= 0) {
      errors.push(`Row ${rowNum}: "Day" must be a positive number (got "${dayRaw}").`);
      return;
    }
    if (!exerciseName) {
      errors.push(`Row ${rowNum}: "Exercise" is required.`);
      return;
    }

    const exercise = { name: exerciseName };
    if (cellText(setsRaw) !== "") {
      const sets = Number(setsRaw);
      if (!Number.isFinite(sets)) {
        errors.push(`Row ${rowNum}: "Sets" must be a number (got "${setsRaw}").`);
        return;
      }
      exercise.sets = sets;
    }
    if (cellText(row["Reps"])) exercise.reps = cellText(row["Reps"]);
    if (cellText(row["Rest"])) exercise.rest = cellText(row["Rest"]);
    if (cellText(row["RPE"])) exercise.rpe = cellText(row["RPE"]);
    if (cellText(row["Notes"])) exercise.notes = cellText(row["Notes"]);

    if (!weekMap.has(week)) weekMap.set(week, new Map());
    const dayMap = weekMap.get(week);
    if (!dayMap.has(day)) dayMap.set(day, []);
    dayMap.get(day).push(exercise);
  });

  const weekNumbers = [...weekMap.keys()].sort((a, b) => a - b);
  const weeks = weekNumbers.map((weekNum) => {
    const dayMap = weekMap.get(weekNum);
    const dayNumbers = [...dayMap.keys()].sort((a, b) => a - b);
    return {
      week: weekNum,
      title: `Week ${weekNum}`,
      days: dayNumbers.map((dayNum) => ({
        day: dayNum,
        label: `Day ${dayNum}`,
        exercises: dayMap.get(dayNum),
      })),
    };
  });

  const duration = weekNumbers.length > 0 ? Math.max(...weekNumbers) : 0;
  const dayCounts = weeks.map((w) => w.days.length);
  const maxDays = dayCounts.length ? Math.max(...dayCounts) : 0;
  const minDays = dayCounts.length ? Math.min(...dayCounts) : 0;
  const sessionsPerWeek =
    weeks.length === 0 ? "0 sessions/week" : minDays === maxDays ? `${maxDays} sessions/week` : `${minDays}-${maxDays} sessions/week`;

  return { weeks, errors, duration, sessionsPerWeek, programName };
}
