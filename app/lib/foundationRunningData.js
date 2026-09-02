// Running -> Foundation: a fully locked, day-based calendar. Every athlete sees the exact
// same challenge on the exact same calendar date (see Section "CORE PRINCIPLE" in the spec) —
// there is no per-athlete rolling schedule and nothing here is browsable. Only Month 1
// (Weeks 1-4) is seeded; Weeks 5+ intentionally don't exist yet (see WEEKS_DATA below) so the
// UI must degrade gracefully once the calendar runs past what's defined.

export const RUN_TYPES = {
  BASE: "BASE",
  SPEED_REPEATS: "SPEED_REPEATS",
  RECOVERY: "RECOVERY",
  SPEED_INTERVALS: "SPEED_INTERVALS",
  SHAKEOUT: "SHAKEOUT",
  LONG_RUN: "LONG_RUN",
  RECOVERY_STRETCH: "RECOVERY_STRETCH",
};

export const RUN_TYPE_LABELS = {
  [RUN_TYPES.BASE]: "Base Run",
  [RUN_TYPES.SPEED_REPEATS]: "Speed – Repeats",
  [RUN_TYPES.RECOVERY]: "Recovery",
  [RUN_TYPES.SPEED_INTERVALS]: "Speed – Intervals",
  [RUN_TYPES.SHAKEOUT]: "Shakeout",
  [RUN_TYPES.LONG_RUN]: "Long Run",
  [RUN_TYPES.RECOVERY_STRETCH]: "Recovery Stretch",
};

const RUN_TYPE_DESCRIPTIONS = {
  [RUN_TYPES.BASE]: "An easy, conversational-pace run to build your aerobic foundation.",
  [RUN_TYPES.SPEED_REPEATS]: "Short, fast repeats with full recovery to build speed and running economy.",
  [RUN_TYPES.RECOVERY]: "A light, easy-effort session to promote recovery without added training stress.",
  [RUN_TYPES.SPEED_INTERVALS]: "Alternating fast/easy intervals to build speed under mild fatigue.",
  [RUN_TYPES.SHAKEOUT]: "A very easy, short effort to stay loose between harder sessions.",
  [RUN_TYPES.LONG_RUN]: "Your longest effort of the week, run at an easy, sustainable pace.",
  [RUN_TYPES.RECOVERY_STRETCH]: "A guided stretch/mobility session to aid recovery.",
};

const BONUS_DESCRIPTION =
  "Optional short accelerations to sharpen turnover. Bonus — doesn't count toward Foundation completion.";

// measurement_type -> the unit shown next to the manual-entry field.
export const MEASUREMENT_UNITS = {
  Time: "min",
  Distance: "mi",
  "Distance Intervals": "reps",
  "Time Intervals": "reps",
  Interval: "reps",
  Stretch: "min",
};

const DAY_LABELS = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" };
const DAY_ABBR = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 7: "sun" };
export { DAY_LABELS };

// Global calendar anchor — Week 1, Monday. Every athlete's "today" is resolved against this
// single shared date, not against when they personally joined. Stored as a UTC-midnight Date
// so week/day math below is never off-by-one across timezones or DST changes.
export const FOUNDATION_START_DATE_ISO = "2026-08-31";
const [ANCHOR_Y, ANCHOR_M, ANCHOR_D] = FOUNDATION_START_DATE_ISO.split("-").map(Number);
const FOUNDATION_START = new Date(Date.UTC(ANCHOR_Y, ANCHOR_M - 1, ANCHOR_D));

const FOUNDATION_WINDOW_WEEKS = 12;
export const FOUNDATION_WINDOW_END = new Date(FOUNDATION_START.getTime() + FOUNDATION_WINDOW_WEEKS * 7 * 86400000);

function toUTCDateOnly(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function dateForWeekDay(weekNumber, dayOfWeek) {
  const offsetDays = (weekNumber - 1) * 7 + (dayOfWeek - 1);
  return new Date(FOUNDATION_START.getTime() + offsetDays * 86400000);
}

// Resolves any real-world date to its slot on the shared calendar. Returns null for dates
// before the calendar starts (shouldn't happen in practice, but keeps this total).
export function getWeekDayForDate(date) {
  const d = toUTCDateOnly(date);
  const diffDays = Math.round((d - FOUNDATION_START) / 86400000);
  if (diffDays < 0) return null;
  return { week_number: Math.floor(diffDays / 7) + 1, day_of_week: (diffDays % 7) + 1 };
}

export function formatAssignedDate(weekNumber, dayOfWeek) {
  return dateForWeekDay(weekNumber, dayOfWeek).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ---------------------------------------------------------------------------
// MONTH 1 CALENDAR (WEEKS 1-4) — the exact, specific content from the spec. Weekend Long
// Run/Recovery Stretch alternates every week (odd weeks = Week A: Sat Long Run/Sun Recovery
// Stretch; even weeks = Week B, flipped). Do not add Week 5+ here until that content is
// actually written — see the spec's "Months 2-3" section.
// ---------------------------------------------------------------------------

const WEEKS_DATA = [
  {
    week: 1,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "18-Minute Base Run", measurement_type: "Time", duration: "18 min" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "4 × 200m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "200m",
        recovery_interval: "1 min",
        repetitions: 4,
        bonus: { name: "6 × 20 sec Strides", measurement_type: "Time Intervals", work_interval: "20 sec", repetitions: 6 },
      },
      3: { run_type: RUN_TYPES.RECOVERY, name: "15-Minute Recovery Walk", measurement_type: "Time", duration: "15 min" },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "6 × 30 sec Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "30 sec Fast",
        recovery_interval: "1 min Easy",
        repetitions: 6,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "10-Minute Shakeout", measurement_type: "Time", duration: "10 min" },
      6: { run_type: RUN_TYPES.LONG_RUN, name: "2-Mile Long Run", measurement_type: "Distance", distance: "2 mi" },
      7: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Lower-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "10 min",
        bodyFocus: "Lower-Body",
      },
    },
  },
  {
    week: 2,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "1.25-Mile Base Run", measurement_type: "Distance", distance: "1.25 mi" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "6 × 200m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "200m",
        recovery_interval: "1 min",
        repetitions: 6,
        bonus: { name: "6 × 60m Strides", measurement_type: "Distance Intervals", work_interval: "60m", repetitions: 6 },
      },
      3: {
        run_type: RUN_TYPES.RECOVERY,
        name: "10-Minute Full-Body Mobility",
        measurement_type: "Stretch",
        duration: "10 min",
        bodyFocus: "Full-Body",
      },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "8 × 30 sec Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "30 sec Fast",
        recovery_interval: "1 min Easy",
        repetitions: 8,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "1-Mile Shakeout", measurement_type: "Distance", distance: "1 mi" },
      6: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Full-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "15 min",
        bodyFocus: "Full-Body",
      },
      7: { run_type: RUN_TYPES.LONG_RUN, name: "28-Minute Long Run", measurement_type: "Time", duration: "28 min" },
    },
  },
  {
    week: 3,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "22-Minute Base Run", measurement_type: "Time", duration: "22 min" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "4 × 400m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "400m",
        recovery_interval: "1 min",
        repetitions: 4,
        bonus: { name: "6 × 20 sec Strides", measurement_type: "Time Intervals", work_interval: "20 sec", repetitions: 6 },
      },
      3: { run_type: RUN_TYPES.RECOVERY, name: "20-Minute Recovery Walk", measurement_type: "Time", duration: "20 min" },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "6 × 30 sec Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "30 sec Fast",
        recovery_interval: "1 min Easy",
        repetitions: 6,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "12-Minute Shakeout", measurement_type: "Time", duration: "12 min" },
      6: { run_type: RUN_TYPES.LONG_RUN, name: "2.5-Mile Long Run", measurement_type: "Distance", distance: "2.5 mi" },
      7: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Upper-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "20 min",
        bodyFocus: "Upper-Body",
      },
    },
  },
  {
    week: 4,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "1.5-Mile Base Run", measurement_type: "Distance", distance: "1.5 mi" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "6 × 400m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "400m",
        recovery_interval: "1 min",
        repetitions: 6,
        bonus: { name: "6 × 60m Strides", measurement_type: "Distance Intervals", work_interval: "60m", repetitions: 6 },
      },
      3: {
        run_type: RUN_TYPES.RECOVERY,
        name: "10-Minute Full-Body Mobility",
        measurement_type: "Stretch",
        duration: "10 min",
        bodyFocus: "Full-Body",
      },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "8 × 30 sec Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "30 sec Fast",
        recovery_interval: "1 min Easy",
        repetitions: 8,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "1.25-Mile Shakeout", measurement_type: "Distance", distance: "1.25 mi" },
      6: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Full-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "25 min",
        bodyFocus: "Full-Body",
      },
      7: { run_type: RUN_TYPES.LONG_RUN, name: "32-Minute Long Run", measurement_type: "Time", duration: "32 min" },
    },
  },
];

function buildChallenge({ week, dayOfWeek, def, isBonus }) {
  const abbr = DAY_ABBR[dayOfWeek];
  return {
    id: `foundation-w${week}-${abbr}${isBonus ? "-bonus" : ""}`,
    sport: "Running",
    level: "Foundation",
    run_type: def.run_type,
    name: def.name,
    description: isBonus ? BONUS_DESCRIPTION : RUN_TYPE_DESCRIPTIONS[def.run_type],
    measurement_type: def.measurement_type,
    distance: def.distance ?? null,
    duration: def.duration ?? null,
    work_interval: def.work_interval ?? null,
    recovery_interval: def.recovery_interval ?? null,
    repetitions: def.repetitions ?? null,
    bodyFocus: def.bodyFocus ?? null,
    verification_type: "Photo + Manual Entry",
    repeatable: isBonus,
    is_bonus: isBonus,
    week_number: week,
    day_of_week: dayOfWeek,
    active: true,
  };
}

// Flat list of every seeded Foundation challenge (required + bonus), Month 1 only.
export const FOUNDATION_CHALLENGES = WEEKS_DATA.flatMap(({ week, days }) =>
  Object.entries(days).flatMap(([dayOfWeek, def]) => {
    const day = Number(dayOfWeek);
    const entries = [buildChallenge({ week, dayOfWeek: day, def, isBonus: false })];
    if (def.bonus) entries.push(buildChallenge({ week, dayOfWeek: day, def: def.bonus, isBonus: true }));
    return entries;
  })
);

export function getRequiredFoundationChallenges() {
  return FOUNDATION_CHALLENGES.filter((c) => !c.is_bonus);
}

export function getChallengeForDate(date) {
  const slot = getWeekDayForDate(date);
  if (!slot) return null;
  return (
    FOUNDATION_CHALLENGES.find(
      (c) => !c.is_bonus && c.week_number === slot.week_number && c.day_of_week === slot.day_of_week
    ) || null
  );
}

export function getBonusForDate(date) {
  const slot = getWeekDayForDate(date);
  if (!slot) return null;
  return (
    FOUNDATION_CHALLENGES.find(
      (c) => c.is_bonus && c.week_number === slot.week_number && c.day_of_week === slot.day_of_week
    ) || null
  );
}

// Every required challenge strictly before "today" that isn't in `completedIds` — this
// athlete's personal backlog. It is derived, not stored: a missed challenge simply stays in
// the shared schedule and keeps showing up here until this athlete completes it, which is
// exactly what keeps it from ever being "reassigned to the whole userbase" the following week.
export function getMissedFoundationChallenges(date, completedIds) {
  const slot = getWeekDayForDate(date);
  if (!slot) return [];
  return getRequiredFoundationChallenges().filter((c) => {
    if (completedIds.has(c.id)) return false;
    if (c.week_number > slot.week_number) return false;
    if (c.week_number === slot.week_number && c.day_of_week >= slot.day_of_week) return false;
    return true;
  });
}

// Whether every required challenge that has come due so far (out of what's currently seeded)
// has been completed. NOTE: this can only fully match the spec's "every required challenge in
// the 3-month window" once Weeks 5-52 are seeded — until then it evaluates completeness
// against Month 1 only, by design (see Section 4/7 of the spec: months 2-3 aren't built yet).
export function isFoundationComplete(date, completedIds) {
  const required = getRequiredFoundationChallenges();
  const slot = getWeekDayForDate(date);
  if (!slot) return false;
  const dueSoFar = required.filter(
    (c) => c.week_number < slot.week_number || (c.week_number === slot.week_number && c.day_of_week <= slot.day_of_week)
  );
  if (dueSoFar.length < required.length) return false; // more seeded content still ahead
  return dueSoFar.every((c) => completedIds.has(c.id));
}
