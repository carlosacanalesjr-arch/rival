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

// Shared by every tiered badge family (PR Breaker, Mileage, HYROX, each DEKA type).
// `count` is whatever underlying number the family progresses on — a lifetime counter
// for PR Breaker/Mileage, or a highest-level-completed rank for HYROX/DEKA. The tier
// math (getTierProgress) doesn't care which; only the detail copy differs per family,
// which callers control via formatEarned/formatLocked.
function computeTieredBadge({ id, count, tiers, formatEarned, formatLocked }) {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);
  const { earnedTier, nextTier, earned } = getTierProgress(count, sorted);
  const display = earnedTier || sorted[0];
  const detail = earned
    ? formatEarned({ count, tier: earnedTier, tierCount: sorted.length })
    : formatLocked({ tier: sorted[0], tierCount: sorted.length });

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

function computeCounterBadge({ id, count, tiers, unitSingular, unitPlural }) {
  return computeTieredBadge({
    id,
    count,
    tiers,
    formatEarned: ({ count: c, tier }) =>
      `${c.toLocaleString()} ${pluralize(c, unitSingular, unitPlural)} · Tier ${tier.tier} of ${tiers.length}`,
    formatLocked: ({ tier }) => `${tier.threshold.toLocaleString()} ${pluralize(tier.threshold, unitSingular, unitPlural)} to unlock`,
  });
}

// Entry point: takes raw lifetime counters (the kind of numbers that will eventually come
// from aggregating real Supabase workout rows) and returns the fully computed badge list.
// None of the tier/earned state is stored directly — it's always derived from these counts.
export function computeRunningAchievements(rawStats = {}) {
  const { totalRuns = 0, longestRunKm = 0, totalPRsBroken = 0, lifetimeMiles = 0 } = rawStats;

  return [
    ...computeDistanceBadges({ totalRuns, longestRunKm }),
    computeCounterBadge({
      id: "pr-breaker",
      count: totalPRsBroken,
      tiers: PR_BREAKER_TIERS,
      unitSingular: "PR broken",
      unitPlural: "PRs broken",
    }),
    computeCounterBadge({
      id: "mileage-milestone",
      count: lifetimeMiles,
      tiers: MILEAGE_TIERS,
      unitSingular: "lifetime mile",
      unitPlural: "lifetime miles",
    }),
  ];
}

// HYROX and DEKA badges progress on "highest level completed" (an ordinal rank: 0 = never
// completed a level, 1/2/3 = highest level reached) rather than a lifetime counter, but it
// plugs into the exact same getTierProgress/computeTieredBadge machinery — the rank just
// stands in for "count" against threshold 1/2/3.
export const HYROX_TIERS = [
  { tier: 1, threshold: 1, label: "HYROX Beginner", emoji: "🥉" },
  { tier: 2, threshold: 2, label: "HYROX Intermediate", emoji: "🥈" },
  { tier: 3, threshold: 3, label: "HYROX Advanced", emoji: "🥇" },
];

export const DEKA_TYPES = ["FIT", "MILE", "STRONG", "ATLAS", "DOUBLE"];

function buildDekaTiers(type) {
  return [
    { tier: 1, threshold: 1, label: `DEKA ${type} — Level 1`, emoji: "🥉" },
    { tier: 2, threshold: 2, label: `DEKA ${type} — Level 2`, emoji: "🥈" },
    { tier: 3, threshold: 3, label: `DEKA ${type} — Level 3`, emoji: "🥇" },
  ];
}

function computeHyroxBadge(hyroxHighestLevel = 0) {
  return computeTieredBadge({
    id: "hyrox-completion",
    count: hyroxHighestLevel,
    tiers: HYROX_TIERS,
    formatEarned: ({ tier, tierCount }) => `Completed ${tier.label} · Tier ${tier.tier} of ${tierCount}`,
    formatLocked: ({ tier }) => `Complete ${tier.label} to unlock`,
  });
}

// A DEKA type's badge only appears once the athlete has started that type — an athlete who's
// never touched DEKA STRONG shouldn't see a locked "DEKA STRONG" card cluttering the tab.
function computeDekaBadges(dekaLevels = {}) {
  return DEKA_TYPES.filter((type) => (dekaLevels[type] || 0) > 0).map((type) => {
    const tiers = buildDekaTiers(type);
    return computeTieredBadge({
      id: `deka-${type.toLowerCase()}`,
      count: dekaLevels[type],
      tiers,
      formatEarned: ({ tier, tierCount }) => `Reached ${tier.label} · Tier ${tier.tier} of ${tierCount}`,
      formatLocked: ({ tier }) => `Reach ${tier.label} to unlock`,
    });
  });
}

// Second entry point alongside computeRunningAchievements — kept separate since HYROX/DEKA
// are their own program category, not running. Both feed the same flat Achievements list.
export function computeProgramAchievements(rawStats = {}) {
  const { hyroxHighestLevel = 0, dekaLevels = {} } = rawStats;
  return [computeHyroxBadge(hyroxHighestLevel), ...computeDekaBadges(dekaLevels)];
}
