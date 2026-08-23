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

// Every program-completion badge below progresses on "highest level/cycle completed" (an
// ordinal rank: 0 = never completed one, 1/2/3 = highest reached) rather than a lifetime
// counter, but it plugs into the exact same getTierProgress/computeTieredBadge machinery —
// the rank just stands in for "count" against threshold 1/2/3.

// Pattern A: a single badge that's always visible, locked at rank 0 (HYROX, Olympic
// Weightlifting, CrossFit, Fire Dept Prep, Law Enforcement Prep).
function computeCompletionBadge(id, level, tiers, { verb = "Completed", verbLocked = "Complete" } = {}) {
  return computeTieredBadge({
    id,
    count: level,
    tiers,
    formatEarned: ({ tier, tierCount }) => `${verb} ${tier.label} · Tier ${tier.tier} of ${tierCount}`,
    formatLocked: ({ tier }) => `${verbLocked} ${tier.label} to unlock`,
  });
}

// Pattern B: a family of independent per-type badges that only appear once that specific
// type has been started (DEKA, Strength & Conditioning) — a type at rank 0 is omitted
// entirely rather than shown as a locked card, so athletes don't see clutter for disciplines
// they've never touched.
function computeStartedTypeBadges(types, levels, buildTiers, idPrefix, { verb = "Reached", verbLocked = "Reach" } = {}) {
  return types
    .filter((type) => (levels[type] || 0) > 0)
    .map((type) =>
      computeCompletionBadge(`${idPrefix}-${type.toLowerCase().replace(/\s+/g, "-")}`, levels[type], buildTiers(type), {
        verb,
        verbLocked,
      })
    );
}

export const HYROX_TIERS = [
  { tier: 1, threshold: 1, label: "HYROX Beginner", emoji: "🥉" },
  { tier: 2, threshold: 2, label: "HYROX Intermediate", emoji: "🥈" },
  { tier: 3, threshold: 3, label: "HYROX Advanced", emoji: "🥇" },
];

export const OLY_WEIGHTLIFTING_TIERS = [
  { tier: 1, threshold: 1, label: "Olympic Weightlifting Beginner", emoji: "🥉" },
  { tier: 2, threshold: 2, label: "Olympic Weightlifting Intermediate", emoji: "🥈" },
  { tier: 3, threshold: 3, label: "Olympic Weightlifting Advanced", emoji: "🥇" },
];

export const CROSSFIT_TIERS = [
  { tier: 1, threshold: 1, label: "CrossFit Beginner", emoji: "🥉" },
  { tier: 2, threshold: 2, label: "CrossFit Intermediate", emoji: "🥈" },
  { tier: 3, threshold: 3, label: "CrossFit Advanced", emoji: "🥇" },
];

// Public Safety Prep tracks a 3-cycle structure (Foundation -> Build -> Peak/Test-Ready).
// Law Enforcement Prep is ONE badge regardless of agency focus (Police/DPS Trooper/Border
// Patrol) — the underlying rank is just cycle progress, with no per-agency state at all.
export const FIRE_DEPT_PREP_TIERS = [
  { tier: 1, threshold: 1, label: "Fire Dept Prep — Foundation", emoji: "🥉" },
  { tier: 2, threshold: 2, label: "Fire Dept Prep — Build", emoji: "🥈" },
  { tier: 3, threshold: 3, label: "Fire Dept Prep — Peak", emoji: "🥇" },
];

export const LAW_ENFORCEMENT_PREP_TIERS = [
  { tier: 1, threshold: 1, label: "Law Enforcement Prep — Foundation", emoji: "🥉" },
  { tier: 2, threshold: 2, label: "Law Enforcement Prep — Build", emoji: "🥈" },
  { tier: 3, threshold: 3, label: "Law Enforcement Prep — Peak", emoji: "🥇" },
];

export const DEKA_TYPES = ["FIT", "MILE", "STRONG", "ATLAS", "DOUBLE"];

function buildDekaTiers(type) {
  return [
    { tier: 1, threshold: 1, label: `DEKA ${type} — Level 1`, emoji: "🥉" },
    { tier: 2, threshold: 2, label: `DEKA ${type} — Level 2`, emoji: "🥈" },
    { tier: 3, threshold: 3, label: `DEKA ${type} — Level 3`, emoji: "🥇" },
  ];
}

export const STRENGTH_TYPES = ["General", "Bodybuilding", "Glute Focus"];

function buildStrengthTiers(type) {
  return [
    { tier: 1, threshold: 1, label: `S&C ${type} — Level 1`, emoji: "🥉" },
    { tier: 2, threshold: 2, label: `S&C ${type} — Level 2`, emoji: "🥈" },
    { tier: 3, threshold: 3, label: `S&C ${type} — Level 3`, emoji: "🥇" },
  ];
}

// Entry point alongside computeRunningAchievements — kept separate since these are all
// their own program categories, not running. Both feed the same flat Achievements list.
export function computeProgramAchievements(rawStats = {}) {
  const {
    hyroxHighestLevel = 0,
    dekaLevels = {},
    strengthLevels = {},
    olyHighestLevel = 0,
    crossfitHighestLevel = 0,
    fireDeptCycle = 0,
    lawEnforcementCycle = 0,
  } = rawStats;

  return [
    computeCompletionBadge("hyrox-completion", hyroxHighestLevel, HYROX_TIERS),
    ...computeStartedTypeBadges(DEKA_TYPES, dekaLevels, buildDekaTiers, "deka"),
    ...computeStartedTypeBadges(STRENGTH_TYPES, strengthLevels, buildStrengthTiers, "strength"),
    computeCompletionBadge("oly-weightlifting-completion", olyHighestLevel, OLY_WEIGHTLIFTING_TIERS),
    computeCompletionBadge("crossfit-completion", crossfitHighestLevel, CROSSFIT_TIERS),
    computeCompletionBadge("fire-dept-prep", fireDeptCycle, FIRE_DEPT_PREP_TIERS),
    computeCompletionBadge("law-enforcement-prep", lawEnforcementCycle, LAW_ENFORCEMENT_PREP_TIERS),
  ];
}
