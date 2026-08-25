// Placement (1st/2nd/3rd) and completion badges earned from Challenges — rendered with the
// exact same diamond BadgeIcon used by every other Achievements card (see BadgeIcon.js /
// ProfileScreen.js), but computed here instead of hand-seeded per athlete like the
// tiered/program badges in achievements.js, since these key off a specific challenge
// instance's leaderboard/result rather than a lifetime stat counter.
//
// Both badge kinds are keyed by the specific challenge's `id`. Every recurring challenge
// (e.g. a weekly "HYROX 8K") gets a brand-new id each time mockData.js reissues it for a new
// period, so the same conceptual challenge naturally earns a NEW, independent badge instance
// each period it's earned in (e.g. "1st Place — HYROX 8K" from two different weeks are two
// different badge ids), while the de-dup below guarantees at most one badge per
// (athlete, challenge id, kind) — i.e. never more than one per period.
//
// Icon art is shared per rank/kind (not per challenge) via `iconId` — see ProfileScreen.js,
// which passes `iconId ?? id` into BadgeIcon — so there are only 4 placeholder images to
// manage (1st/2nd/3rd place, completion) no matter how many challenges exist.

const PLACE_META = {
  1: { label: "1st Place", emoji: "🥇" },
  2: { label: "2nd Place", emoji: "🥈" },
  3: { label: "3rd Place", emoji: "🥉" },
};

// `challengeIds`: which challenges to check this athlete's placement on — same list
// ProfileScreen already uses to build the "Challenges" tab (athlete.challengeIds).
// `initials`: how to find this athlete's row in a challenge's (already-ranked) leaderboard —
// same lookup ProfileScreen already does for that tab.
export function computePlacementBadges({ challenges, challengeIds, initials }) {
  const seen = new Set();
  const badges = [];
  for (const challengeId of challengeIds || []) {
    if (seen.has(challengeId)) continue; // never award the same challenge instance twice
    seen.add(challengeId);
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) continue;
    const entry = challenge.leaderboard.find((e) => e.initials === initials);
    const place = PLACE_META[entry?.rank];
    if (!place) continue;
    badges.push({
      id: `placement-${challenge.id}`,
      iconId: `placement-${entry.rank}`,
      title: `${place.label} — ${challenge.title}`,
      emoji: place.emoji,
      detail: `${challenge.category} · ${challenge.duration} · ended ${challenge.endDate}`,
      earned: true,
      kind: "placement",
      place: entry.rank,
    });
  }
  return badges;
}

// `completedChallengeIds`: challenge ids this athlete has verifiably hit the goal on (i.e.
// submitted via the existing photo-proof flow and had it confirmed). For "You" this is
// exactly the challenges where `joined && progress === 100` — see athletes.js — passed in as
// a plain id list so this function stays agnostic to where the list came from; other athletes
// don't carry a live joined/progress pair per challenge in this mock app, so their completions
// are hand-seeded the same way athlete.challengeIds already is.
export function computeCompletionBadges({ challenges, completedChallengeIds }) {
  const seen = new Set();
  const badges = [];
  for (const challengeId of completedChallengeIds || []) {
    if (seen.has(challengeId)) continue;
    seen.add(challengeId);
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) continue;
    badges.push({
      id: `completion-${challenge.id}`,
      iconId: "completion",
      title: `${challenge.title} — Completed`,
      emoji: "✅",
      detail: `${challenge.category} · Goal: ${challenge.goal}`,
      earned: true,
      kind: "completion",
    });
  }
  return badges;
}
