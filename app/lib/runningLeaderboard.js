// Section 14 — a per-level, per-day leaderboard for the athlete's single locked challenge.
// There's no backend in this app (see AGENTS notes), so "other athletes' results" are a
// deterministic mock field derived from the challenge id — the same handful of competitors
// with the same scores every time this exact challenge is viewed, rather than random noise that
// would reshuffle on every render. Real ranking data would come from other athletes' own
// submissions once there's a backend to source them from.

const MOCK_ATHLETES = [
  { name: "Maya Kowalski", initials: "MK" },
  { name: "Coach Rex", initials: "CR" },
  { name: "Priya Shah", initials: "PS" },
  { name: "Deshawn Walker", initials: "DW" },
  { name: "Marcus Lee", initials: "ML" },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function firstNumber(str) {
  const match = /([\d.]+)/.exec(str || "");
  return match ? parseFloat(match[1]) : null;
}

// The ranking metric is always the *other* measurement from the one the challenge fixes —
// Time-based challenges fix duration, so the leaderboard measures distance covered; Distance-
// based challenges fix distance, so it measures completion time.
export function getLeaderboardUnit(challenge) {
  return challenge.measurement_type === "Time" ? "mi" : "min";
}

// Generates this challenge's mock field, scored around a plausible easy-run pace (9-13 min/mi)
// so rankings look sane relative to the fixed duration/distance.
export function getMockLeaderboardEntries(challenge) {
  return MOCK_ATHLETES.map((athlete, i) => {
    const hash = hashString(`${challenge.id}:${athlete.name}`);
    const paceMinPerMile = 9 + (hash % 400) / 100; // 9.00-12.99 min/mi
    let score;
    if (challenge.measurement_type === "Time") {
      const minutes = firstNumber(challenge.duration) ?? 20;
      score = Math.round((minutes / paceMinPerMile) * 100) / 100; // miles covered
    } else {
      const miles = firstNumber(challenge.distance) ?? 2;
      score = Math.round(miles * paceMinPerMile * 10) / 10; // minutes to finish
    }
    return { id: `mock-${challenge.id}-${i}`, name: athlete.name, initials: athlete.initials, score };
  });
}

// Time-based -> more distance is better (descending). Distance-based -> less time is better
// (ascending).
export function rankLeaderboard(challenge, entries) {
  const higherIsBetter = challenge.measurement_type === "Time";
  return [...entries]
    .sort((a, b) => (higherIsBetter ? b.score - a.score : a.score - b.score))
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}
