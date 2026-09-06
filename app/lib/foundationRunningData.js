// Running -> locked, day-based calendars, one per level (Foundation, Intermediate, Advanced —
// see Section 12/13 of the spec). Every athlete on a given level sees the exact same challenge
// on the exact same calendar date (see Section "CORE PRINCIPLE") — there is no per-athlete
// rolling schedule and nothing here is browsable. Only Foundation has seeded content today; all
// 12 weeks (Months 1-3), including the weekend Recovery Stretch body-focus/duration, are filled
// in. Intermediate/Advanced are registered in LEVEL_CHALLENGES with no content yet — see
// hasLevelContent — architecture first, content later, same approach Month 1 used for Months
// 2-3 before they were seeded.
//
// The *content* calendar below is global and per-level, not per-athlete — but each athlete's
// personal 3-month completion window and missed-challenge backlog are anchored to whenever they
// personally switched onto that level (see Section 13), not to this file's calendar anchor.
// That per-athlete window math lives in FoundationContext.js; this file only answers "what's
// the content for level L on date D" and "what's level L's full required list."

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

// Global calendar anchor — Week 1, Monday. Content for a given date is resolved against this
// single shared date, the same for every athlete on a level, regardless of when they personally
// joined it. Stored as a UTC-midnight Date so week/day math below is never off-by-one across
// timezones or DST changes.
export const FOUNDATION_START_DATE_ISO = "2026-08-31";
const [ANCHOR_Y, ANCHOR_M, ANCHOR_D] = FOUNDATION_START_DATE_ISO.split("-").map(Number);
const FOUNDATION_START = new Date(Date.UTC(ANCHOR_Y, ANCHOR_M - 1, ANCHOR_D));

// Every level's completion window is the same length (12 weeks) — see Section 13: switching
// into a level always grants a full personal runway of this length from the switch date.
export const RUNNING_WINDOW_WEEKS = 12;

// Reads a Date's LOCAL calendar fields (so "today" always means the athlete's own local
// calendar day, not UTC's) and re-expresses them as a UTC-midnight instant purely so calendar
// days can be diffed with plain integer math below.
function toUTCDateOnly(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

// A given athlete's personal window-close date for a level, given when they switched onto it.
export function getWindowEnd(windowStart) {
  return new Date(toUTCDateOnly(windowStart).getTime() + RUNNING_WINDOW_WEEKS * 7 * 86400000);
}

// Returns a local-midnight Date for the given week/day slot. Deliberately built by reading
// FOUNDATION_START's UTC calendar fields and re-constructing a *local* Date (rather than doing
// raw epoch-ms arithmetic) so this round-trips correctly through getWeekDayForDate's
// local-getter-based toUTCDateOnly in every timezone, including ones behind UTC.
export function dateForWeekDay(weekNumber, dayOfWeek) {
  const offsetDays = (weekNumber - 1) * 7 + (dayOfWeek - 1);
  const utcMarker = new Date(FOUNDATION_START.getTime() + offsetDays * 86400000);
  return new Date(utcMarker.getUTCFullYear(), utcMarker.getUTCMonth(), utcMarker.getUTCDate());
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
  });
}

// ---------------------------------------------------------------------------
// FOUNDATION'S FULL CALENDAR (WEEKS 1-12 / MONTHS 1-3) — the exact, specific content from the
// spec. Weekend Long Run/Recovery Stretch alternates every week (odd weeks = Week A: Sat Long
// Run/Sun Recovery Stretch; even weeks = Week B, flipped).
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
  {
    week: 5,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "25-Minute Base Run", measurement_type: "Time", duration: "25 min" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "1 × 800m + 2 × 400m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "800m, 400m, 400m (mixed set)",
        recovery_interval: "1 min",
        repetitions: 3,
        bonus: { name: "6 × 20 sec Strides", measurement_type: "Time Intervals", work_interval: "20 sec", repetitions: 6 },
      },
      3: { run_type: RUN_TYPES.RECOVERY, name: "25-Minute Recovery Walk", measurement_type: "Time", duration: "25 min" },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "6 × 1 min Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "1 min Fast",
        recovery_interval: "1 min Easy",
        repetitions: 6,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "14-Minute Shakeout", measurement_type: "Time", duration: "14 min" },
      6: { run_type: RUN_TYPES.LONG_RUN, name: "3-Mile Long Run", measurement_type: "Distance", distance: "3 mi" },
      7: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Lower-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "20 min",
        bodyFocus: "Lower-Body",
      },
    },
  },
  {
    week: 6,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "1.75-Mile Base Run", measurement_type: "Distance", distance: "1.75 mi" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "1 × 600m + 2 × 400m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "600m, 400m, 400m (mixed set)",
        recovery_interval: "1 min",
        repetitions: 3,
        bonus: { name: "6 × 60m Strides", measurement_type: "Distance Intervals", work_interval: "60m", repetitions: 6 },
      },
      3: {
        run_type: RUN_TYPES.RECOVERY,
        name: "Full-Body Mobility, 15 min",
        measurement_type: "Stretch",
        duration: "15 min",
        bodyFocus: "Full-Body",
      },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "8 × 1 min Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "1 min Fast",
        recovery_interval: "1 min Easy",
        repetitions: 8,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "1.5-Mile Shakeout", measurement_type: "Distance", distance: "1.5 mi" },
      6: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Full-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "25 min",
        bodyFocus: "Full-Body",
      },
      7: { run_type: RUN_TYPES.LONG_RUN, name: "36-Minute Long Run", measurement_type: "Time", duration: "36 min" },
    },
  },
  {
    week: 7,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "30-Minute Base Run", measurement_type: "Time", duration: "30 min" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "2 × 800m + 2 × 400m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "800m, 800m, 400m, 400m (mixed set)",
        recovery_interval: "1 min",
        repetitions: 4,
        bonus: { name: "6 × 20 sec Strides", measurement_type: "Time Intervals", work_interval: "20 sec", repetitions: 6 },
      },
      3: { run_type: RUN_TYPES.RECOVERY, name: "30-Minute Recovery Walk", measurement_type: "Time", duration: "30 min" },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "6 × 1 min Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "1 min Fast",
        recovery_interval: "1 min Easy",
        repetitions: 6,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "16-Minute Shakeout", measurement_type: "Time", duration: "16 min" },
      6: { run_type: RUN_TYPES.LONG_RUN, name: "3.5-Mile Long Run", measurement_type: "Distance", distance: "3.5 mi" },
      7: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Upper-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "25 min",
        bodyFocus: "Upper-Body",
      },
    },
  },
  {
    week: 8,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "2.0-Mile Base Run", measurement_type: "Distance", distance: "2 mi" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "1 × 800m + 1 × 600m + 2 × 400m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "800m, 600m, 400m, 400m (mixed set)",
        recovery_interval: "1 min",
        repetitions: 4,
        bonus: { name: "6 × 60m Strides", measurement_type: "Distance Intervals", work_interval: "60m", repetitions: 6 },
      },
      3: {
        run_type: RUN_TYPES.RECOVERY,
        name: "Full-Body Mobility, 15 min",
        measurement_type: "Stretch",
        duration: "15 min",
        bodyFocus: "Full-Body",
      },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "8 × 1 min Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "1 min Fast",
        recovery_interval: "1 min Easy",
        repetitions: 8,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "1.75-Mile Shakeout", measurement_type: "Distance", distance: "1.75 mi" },
      6: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Full-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "30 min",
        bodyFocus: "Full-Body",
      },
      7: { run_type: RUN_TYPES.LONG_RUN, name: "40-Minute Long Run", measurement_type: "Time", duration: "40 min" },
    },
  },
  {
    week: 9,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "32-Minute Base Run", measurement_type: "Time", duration: "32 min" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "2 × 800m + 2 × 400m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "800m, 800m, 400m, 400m (mixed set)",
        recovery_interval: "1 min",
        repetitions: 4,
        bonus: { name: "6 × 20 sec Strides", measurement_type: "Time Intervals", work_interval: "20 sec", repetitions: 6 },
      },
      3: { run_type: RUN_TYPES.RECOVERY, name: "35-Minute Recovery Walk", measurement_type: "Time", duration: "35 min" },
      4: {
        // Holds at 7x for Weeks 9-10, then 8x for Weeks 11-12 — a deliberate two-week hold,
        // not the odd/even-week alternation Months 1-2 used. See the spec's Section 5 note.
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "7 × 1 min Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "1 min Fast",
        recovery_interval: "1 min Easy",
        repetitions: 7,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "18-Minute Shakeout", measurement_type: "Time", duration: "18 min" },
      // Hits the Foundation 4-mile cap (see the "not exceed 4 miles" rule at the top of the spec).
      6: { run_type: RUN_TYPES.LONG_RUN, name: "4-Mile Long Run", measurement_type: "Distance", distance: "4 mi" },
      7: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Lower-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "25 min",
        bodyFocus: "Lower-Body",
      },
    },
  },
  {
    week: 10,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "2.25-Mile Base Run", measurement_type: "Distance", distance: "2.25 mi" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "2 × 800m + 1 × 600m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "800m, 800m, 600m (mixed set)",
        recovery_interval: "1 min",
        repetitions: 3,
        bonus: { name: "6 × 60m Strides", measurement_type: "Distance Intervals", work_interval: "60m", repetitions: 6 },
      },
      3: {
        run_type: RUN_TYPES.RECOVERY,
        name: "Full-Body Mobility, 20 min",
        measurement_type: "Stretch",
        duration: "20 min",
        bodyFocus: "Full-Body",
      },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "7 × 1 min Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "1 min Fast",
        recovery_interval: "1 min Easy",
        repetitions: 7,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "2-Mile Shakeout", measurement_type: "Distance", distance: "2 mi" },
      6: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Full-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "30 min",
        bodyFocus: "Full-Body",
      },
      7: { run_type: RUN_TYPES.LONG_RUN, name: "44-Minute Long Run", measurement_type: "Time", duration: "44 min" },
    },
  },
  {
    week: 11,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "37-Minute Base Run", measurement_type: "Time", duration: "37 min" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "3 × 800m + 1 × 400m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "800m, 800m, 800m, 400m (mixed set)",
        recovery_interval: "1 min",
        repetitions: 4,
        bonus: { name: "6 × 20 sec Strides", measurement_type: "Time Intervals", work_interval: "20 sec", repetitions: 6 },
      },
      3: { run_type: RUN_TYPES.RECOVERY, name: "40-Minute Recovery Walk", measurement_type: "Time", duration: "40 min" },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "8 × 1 min Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "1 min Fast",
        recovery_interval: "1 min Easy",
        repetitions: 8,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "20-Minute Shakeout", measurement_type: "Time", duration: "20 min" },
      // Holds at the Foundation 4-mile cap rather than exceeding it (see Section 5 note).
      6: { run_type: RUN_TYPES.LONG_RUN, name: "4-Mile Long Run", measurement_type: "Distance", distance: "4 mi" },
      7: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Upper-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "30 min",
        bodyFocus: "Upper-Body",
      },
    },
  },
  {
    week: 12,
    days: {
      1: { run_type: RUN_TYPES.BASE, name: "2.5-Mile Base Run", measurement_type: "Distance", distance: "2.5 mi" },
      2: {
        run_type: RUN_TYPES.SPEED_REPEATS,
        name: "3 × 800m + 1 × 600m, Recovery: 1 min",
        measurement_type: "Distance Intervals",
        work_interval: "800m, 800m, 800m, 600m (mixed set)",
        recovery_interval: "1 min",
        repetitions: 4,
        bonus: { name: "6 × 60m Strides", measurement_type: "Distance Intervals", work_interval: "60m", repetitions: 6 },
      },
      3: {
        run_type: RUN_TYPES.RECOVERY,
        name: "Full-Body Mobility, 20 min",
        measurement_type: "Stretch",
        duration: "20 min",
        bodyFocus: "Full-Body",
      },
      4: {
        run_type: RUN_TYPES.SPEED_INTERVALS,
        name: "8 × 1 min Fast / 1 min Easy",
        measurement_type: "Interval",
        work_interval: "1 min Fast",
        recovery_interval: "1 min Easy",
        repetitions: 8,
      },
      5: { run_type: RUN_TYPES.SHAKEOUT, name: "2.25-Mile Shakeout", measurement_type: "Distance", distance: "2.25 mi" },
      6: {
        run_type: RUN_TYPES.RECOVERY_STRETCH,
        name: "Full-Body Recovery Stretch",
        measurement_type: "Stretch",
        duration: "30 min",
        bodyFocus: "Full-Body",
      },
      7: { run_type: RUN_TYPES.LONG_RUN, name: "48-Minute Long Run", measurement_type: "Time", duration: "48 min" },
    },
  },
];

function buildChallenge({ level, week, dayOfWeek, def, isBonus }) {
  const abbr = DAY_ABBR[dayOfWeek];
  return {
    id: `${level.toLowerCase()}-w${week}-${abbr}${isBonus ? "-bonus" : ""}`,
    sport: "Running",
    level,
    // Bonus (Strides) entries never set their own run_type in WEEKS_DATA since every bonus so
    // far rides along with that day's Speed – Repeats — default to it here so the UI's
    // RUN_TYPE_LABELS lookup never renders blank.
    run_type: def.run_type ?? (isBonus ? RUN_TYPES.SPEED_REPEATS : undefined),
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
    // The real calendar date this slot falls on, on the shared global calendar (Section 1's
    // day -> run_type mapping is identical across levels, so the same week/day math applies
    // regardless of which level this challenge belongs to). Used to test a challenge against an
    // athlete's *personal* window (see getMissedFoundationChallenges/isFoundationComplete)
    // without re-deriving it from week_number/day_of_week at every call site.
    assignedDate: dateForWeekDay(week, dayOfWeek),
    active: def.active ?? true,
  };
}

function buildLevelChallenges(level, weeksData) {
  return weeksData.flatMap(({ week, days }) =>
    Object.entries(days).flatMap(([dayOfWeek, def]) => {
      const day = Number(dayOfWeek);
      const entries = [buildChallenge({ level, week, dayOfWeek: day, def, isBonus: false })];
      if (def.bonus) entries.push(buildChallenge({ level, week, dayOfWeek: day, def: def.bonus, isBonus: true }));
      return entries;
    })
  );
}

// Flat list of every seeded Foundation challenge (required + bonus), Months 1-3.
export const FOUNDATION_CHALLENGES = buildLevelChallenges("Foundation", WEEKS_DATA);

// Levels the athlete can pick from today (Section 13 — Advanced isn't offered yet, but the
// architecture below is already level-generic so adding it later is just another key here).
export const RUNNING_LEVELS = ["Foundation", "Intermediate"];

// Per-level challenge lists. Intermediate has no seeded content yet (Section 12 — architecture
// first, content later, same as Foundation's Months 2-3 before they were written) — its empty
// array is what drives the "coming soon" empty state instead of fabricated placeholder content.
const LEVEL_CHALLENGES = {
  Foundation: FOUNDATION_CHALLENGES,
  Intermediate: [],
};

function levelChallenges(level) {
  return LEVEL_CHALLENGES[level] || [];
}

export function hasLevelContent(level) {
  return levelChallenges(level).length > 0;
}

// Excludes `active: false` placeholders — none currently exist, but the mechanism stays so a
// future not-yet-decided value (the way Weeks 5-12's Recovery Stretch content briefly was) can
// be seeded as an inactive placeholder without it being "today", missable, or completion-blocking.
export function getRequiredFoundationChallenges(level) {
  return levelChallenges(level).filter((c) => !c.is_bonus && c.active);
}

export function getChallengeForDate(level, date) {
  const slot = getWeekDayForDate(date);
  if (!slot) return null;
  return (
    levelChallenges(level).find(
      (c) => !c.is_bonus && c.active && c.week_number === slot.week_number && c.day_of_week === slot.day_of_week
    ) || null
  );
}

export function getBonusForDate(level, date) {
  const slot = getWeekDayForDate(date);
  if (!slot) return null;
  return (
    levelChallenges(level).find(
      (c) => c.is_bonus && c.active && c.week_number === slot.week_number && c.day_of_week === slot.day_of_week
    ) || null
  );
}

// Every required challenge assigned between this athlete's personal window start on this level
// (see Section 13 — set when they switched onto it, not the global calendar anchor) and today,
// that isn't in `completedIds` — this athlete's personal backlog. It is derived, not stored: a
// missed challenge simply stays in the shared schedule and keeps showing up here until this
// athlete completes it, which is exactly what keeps it from ever being "reassigned to the whole
// userbase" the following week. Days before `windowStart` are excluded outright — they were
// never assigned to this athlete on this level, so there's nothing to have missed.
export function getMissedFoundationChallenges(level, today, windowStart, completedIds) {
  if (!windowStart) return [];
  const todayUTC = toUTCDateOnly(today);
  const startUTC = toUTCDateOnly(windowStart);
  return getRequiredFoundationChallenges(level).filter((c) => {
    if (completedIds.has(c.id)) return false;
    const assignedUTC = toUTCDateOnly(c.assignedDate);
    if (assignedUTC < startUTC) return false;
    if (assignedUTC >= todayUTC) return false;
    return true;
  });
}

// Whether every required challenge that has come due so far within this athlete's personal
// window on this level (assigned between `windowStart` and today, inclusive) has been
// completed. A level with no seeded content yet (Intermediate/Advanced) can never be complete.
export function isFoundationComplete(level, today, windowStart, completedIds) {
  if (!windowStart) return false;
  const required = getRequiredFoundationChallenges(level);
  if (required.length === 0) return false;
  const todayUTC = toUTCDateOnly(today);
  const startUTC = toUTCDateOnly(windowStart);
  const dueSoFar = required.filter((c) => {
    const assignedUTC = toUTCDateOnly(c.assignedDate);
    return assignedUTC >= startUTC && assignedUTC <= todayUTC;
  });
  if (dueSoFar.length < required.length) return false; // more seeded content still ahead
  return dueSoFar.every((c) => completedIds.has(c.id));
}

// Section 14 — Recovery/Recovery Stretch are completion-based, not performance-based, so they
// never get a leaderboard. The two ranking rules the spec defines (distance-in-fixed-time for
// "Time", completion-time for "Distance") only cover measurement_type "Time"/"Distance" — Speed
// – Repeats/Intervals use interval-shaped measurement types the spec doesn't define a ranking
// rule for, so (rather than inventing one) they're treated the same as Recovery: no leaderboard.
const NO_LEADERBOARD_RUN_TYPES = new Set([RUN_TYPES.RECOVERY, RUN_TYPES.RECOVERY_STRETCH]);
export function challengeHasLeaderboard(challenge) {
  if (!challenge || challenge.is_bonus) return false;
  if (NO_LEADERBOARD_RUN_TYPES.has(challenge.run_type)) return false;
  return challenge.measurement_type === "Time" || challenge.measurement_type === "Distance";
}
