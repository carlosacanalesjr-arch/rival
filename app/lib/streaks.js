// Weekly streak badges — one tiered badge per distance sport (Running, Biking, Rowing,
// SkiErg), reusing the exact same tiered-badge machinery as HYROX/DEKA/etc
// (computeTieredBadge/getTierProgress in achievements.js) — "count" here is consecutive
// weeks-with-a-completed-Weekly-challenge instead of a program level, but the tier math
// doesn't care which.
//
// A sport's streak increments when the athlete completes ANY Weekly challenge in that sport
// during a given week (any distance counts — Row 5K one week, Row 25K the next, still the
// same Rowing streak) and resets to 0 the first week that passes with none completed. Streak
// counts are hand-authored per athlete (see athletes.js), the same way every other lifetime
// stat in this mock app is (programStats, runningStats) — a real backend would derive this
// from completion timestamps grouped by ISO week rather than storing the count directly.
import { computeTieredBadge } from "@/app/lib/achievements";

export const STREAK_SPORTS = ["Running", "Biking", "Rowing", "SkiErg"];

export function buildStreakTiers(sport) {
  return [
    { tier: 1, threshold: 4, label: `${sport} Streak — 4 Weeks`, emoji: "🥉" },
    { tier: 2, threshold: 8, label: `${sport} Streak — 8 Weeks`, emoji: "🥈" },
    { tier: 3, threshold: 12, label: `${sport} Streak — 12 Weeks`, emoji: "🥇" },
  ];
}

// `streaks`: { Running, Biking, Rowing, SkiErg } -> current consecutive-week count (0 if
// none/reset). Always returns one badge per sport, even at 0, so a broken/reset streak is
// visible on the profile rather than just disappearing.
export function computeStreakBadges(streaks = {}) {
  return STREAK_SPORTS.map((sport) => {
    const weeks = streaks[sport] || 0;
    return computeTieredBadge({
      id: `streak-${sport.toLowerCase()}`,
      count: weeks,
      tiers: buildStreakTiers(sport),
      formatEarned: ({ tier }) =>
        `Current streak: ${weeks} consecutive week${weeks === 1 ? "" : "s"} of a ${sport} Weekly challenge`,
      formatLocked: ({ tier }) =>
        weeks === 0
          ? `No active streak — complete a Weekly ${sport} challenge to start one`
          : `${weeks} week${weeks === 1 ? "" : "s"} so far — reach ${tier.threshold} for ${tier.label}`,
    });
  });
}
