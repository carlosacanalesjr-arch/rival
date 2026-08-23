export const DISTANCE_MILESTONES = [
  { id: "first-mile", title: "First Mile", emoji: "🏁", detail: "Completed your first tracked run" },
  { id: "first-5k", title: "First 5K", emoji: "🎽", thresholdKm: 5, detail: "Completed a run of 5K or more" },
  { id: "first-10k", title: "First 10K", emoji: "🏃", thresholdKm: 10, detail: "Completed a run of 10K or more" },
  {
    id: "half-marathon",
    title: "Half Marathon Finisher",
    emoji: "🏅",
    thresholdKm: 21.1,
    detail: "Completed a run of 13.1 mi / 21.1K or more",
  },
  {
    id: "marathon",
    title: "Marathon Finisher",
    emoji: "🏆",
    thresholdKm: 42.2,
    detail: "Completed a run of 26.2 mi / 42.2K or more",
  },
  { id: "ultra", title: "Ultra Finisher", emoji: "🌋", thresholdKm: 50, detail: "Completed a run of 50K or more" },
];

// Ordered ascending — adding a new tier later is just another entry in this array.
export const PR_BREAKER_TIERS = [
  { tier: 1, threshold: 1, label: "PR Breaker", emoji: "🥉" },
  { tier: 2, threshold: 5, label: "PR Breaker II", emoji: "🥈" },
  { tier: 3, threshold: 10, label: "PR Breaker III", emoji: "🥇" },
];

export const MILEAGE_TIERS = [
  { tier: 1, threshold: 100, label: "Mileage Milestone", emoji: "🥉" },
  { tier: 2, threshold: 500, label: "Mileage Milestone II", emoji: "🥈" },
  { tier: 3, threshold: 1000, label: "Mileage Milestone III", emoji: "🥇" },
];

function computeDistanceBadges({ totalRuns = 0, longestRunKm = 0 } = {}) {
  return DISTANCE_MILESTONES.map((milestone) => ({
    ...milestone,
    earned: milestone.id === "first-mile" ? totalRuns > 0 : longestRunKm >= milestone.thresholdKm,
    kind: "single",
  }));
}

// Generic threshold walker: finds the highest tier reached and the next one to aim for.
// Works for any ascending list of { tier, threshold }, so adding e.g. a 25/50 tier later
// is just adding entries to PR_BREAKER_TIERS/MILEAGE_TIERS — no logic changes needed.
export function getTierProgress(count, tiers) {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);
  let earnedTier = null;
  let nextTier = null;
  for (const t of sorted) {
    if (count >= t.threshold) earnedTier = t;
    else if (!nextTier) nextTier = t;
  }
  return { earnedTier, nextTier, earned: Boolean(earnedTier) };
}

function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function computeTieredBadge({ id, count, tiers, unitSingular, unitPlural }) {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);
  const { earnedTier, nextTier, earned } = getTierProgress(count, sorted);
  const display = earnedTier || sorted[0];
  const detail = earned
    ? `${count.toLocaleString()} ${pluralize(count, unitSingular, unitPlural)} · Tier ${earnedTier.tier} of ${sorted.length}`
    : `${sorted[0].threshold.toLocaleString()} ${pluralize(sorted[0].threshold, unitSingular, unitPlural)} to unlock`;

  return {
    id,
    title: display.label,
    emoji: display.emoji,
    detail,
    earned,
    kind: "tiered",
    tier: earnedTier?.tier || 0,
    tierCount: sorted.length,
    count,
    nextThreshold: nextTier?.threshold ?? null,
  };
}

// Entry point: takes raw lifetime counters (the kind of numbers that will eventually come
// from aggregating real Supabase workout rows) and returns the fully computed badge list.
// None of the tier/earned state is stored directly — it's always derived from these counts.
export function computeRunningAchievements(rawStats = {}) {
  const { totalRuns = 0, longestRunKm = 0, totalPRsBroken = 0, lifetimeMiles = 0 } = rawStats;

  return [
    ...computeDistanceBadges({ totalRuns, longestRunKm }),
    computeTieredBadge({
      id: "pr-breaker",
      count: totalPRsBroken,
      tiers: PR_BREAKER_TIERS,
      unitSingular: "PR broken",
      unitPlural: "PRs broken",
    }),
    computeTieredBadge({
      id: "mileage-milestone",
      count: lifetimeMiles,
      tiers: MILEAGE_TIERS,
      unitSingular: "lifetime mile",
      unitPlural: "lifetime miles",
    }),
  ];
}
