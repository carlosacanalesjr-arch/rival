"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import {
  RUNNING_LEVELS,
  getBonusForDate,
  getChallengeForDate,
  getMissedFoundationChallenges,
  getWindowEnd,
  hasLevelContent,
  isFoundationComplete,
} from "@/app/lib/foundationRunningData";

const FoundationContext = createContext(null);

// The Challenges page is statically prerendered by Next.js, so computing `new Date()` during
// render would bake whatever date the last build happened to run on into the served HTML —
// every visitor would see build day's challenge until the next deploy. Instead `today` starts
// null (matching on both the server-rendered pass and the client's first hydration pass, so
// there's no hydration mismatch) and is only resolved client-side after mount, where it always
// reflects the visitor's real current date regardless of when the page was last built. A
// once-a-minute check keeps a long-open tab from getting stuck on yesterday's date.
function useToday() {
  const [today, setToday] = useState(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setToday((prev) => (prev && prev.toDateString() === now.toDateString() ? prev : now));
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  return today;
}

// ---------------------------------------------------------------------------
// Persisted store — level choice + per-level (windowStart, completions), keyed per athlete.
// This app has no backend (see AGENTS notes: only auth is real Supabase), so localStorage is
// the only way a level choice or a completion survives a reload — same useSyncExternalStore +
// localStorage pattern as ExerciseContentContext/MediaContext. Keyed by email the same way
// ContentGuidelinesModal keys its acknowledgements, with "guest" as the fallback for the
// athlete-facing pages that don't require a real login in this mock app.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "rival_running_levels_v1";

function emptyLevelState() {
  return { windowStart: null, completions: {} };
}

function emptyAccountState() {
  return {
    activeLevel: null, // null = athlete hasn't picked a starting level yet (Section 13)
    levels: Object.fromEntries(RUNNING_LEVELS.map((level) => [level, emptyLevelState()])),
  };
}

let cachedRaw;
let cachedStore = {};
const listeners = new Set();

function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot() {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedStore = raw ? JSON.parse(raw) : {};
    } catch {
      cachedStore = {};
    }
  }
  return cachedStore;
}

const EMPTY_STORE = {};
function getServerSnapshot() {
  return EMPTY_STORE;
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeStore(nextStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStore));
  } catch {
    // Storage full or unavailable — level choice and completions just won't survive a reload.
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

// Per-athlete Foundation/Intermediate state — level choice, per-level completions, and
// everything derived from them (today's challenge, the missed-challenge backlog, completion
// status). Client-only, same as every other piece of app state in this mock app.
export function FoundationProvider({ children }) {
  const { user } = useAuth();
  const accountKey = user?.email || "guest";
  const today = useToday();

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const account = store[accountKey] || emptyAccountState();
  const activeLevel = account.activeLevel;

  const updateAccount = (updater) => {
    const current = store[accountKey] || emptyAccountState();
    writeStore({ ...store, [accountKey]: updater(current) });
  };

  // Both the first-ever level choice (Section 13's "on first use") and any later switch use the
  // same operation: set it active and start a fresh personal window from right now. Nothing
  // before this moment is ever considered assigned to the athlete on this level (see
  // getMissedFoundationChallenges), and prior progress on every other level is left untouched.
  const selectLevel = (level) => {
    updateAccount((acc) => ({
      ...acc,
      activeLevel: level,
      levels: {
        ...acc.levels,
        [level]: { ...(acc.levels[level] || emptyLevelState()), windowStart: new Date().toISOString() },
      },
    }));
  };

  const markComplete = (challengeId, value, proof, leaderboardValue) => {
    if (!activeLevel) return;
    updateAccount((acc) => ({
      ...acc,
      levels: {
        ...acc.levels,
        [activeLevel]: {
          ...acc.levels[activeLevel],
          completions: {
            ...acc.levels[activeLevel].completions,
            [challengeId]: {
              value,
              proof,
              leaderboardValue: leaderboardValue ?? null,
              completedAt: new Date().toISOString(),
            },
          },
        },
      },
    }));
  };

  const completionsFor = (level) => account.levels[level]?.completions || {};
  const completedIdsFor = (level) => new Set(Object.keys(completionsFor(level)));
  const windowStartFor = (level) => {
    const iso = account.levels[level]?.windowStart;
    return iso ? new Date(iso) : null;
  };

  // Foundation-specific status (Section 11's "Foundation Complete" badge on the Profile page is
  // always about the Foundation level itself, independent of whichever level is currently
  // active in the Running screen's dropdown).
  const foundationWindowStart = windowStartFor("Foundation");
  const foundationCompletedIds = completedIdsFor("Foundation");
  const foundationComplete = today
    ? isFoundationComplete("Foundation", today, foundationWindowStart, foundationCompletedIds)
    : false;

  // Active-level-scoped data for the Running screen itself.
  const activeWindowStart = activeLevel ? windowStartFor(activeLevel) : null;
  const completions = activeLevel ? completionsFor(activeLevel) : {};
  const completedIds = activeLevel ? completedIdsFor(activeLevel) : new Set();
  const todayChallenge = today && activeLevel ? getChallengeForDate(activeLevel, today) : null;
  const bonusChallenge = today && activeLevel ? getBonusForDate(activeLevel, today) : null;
  const missedChallenges =
    today && activeLevel ? getMissedFoundationChallenges(activeLevel, today, activeWindowStart, completedIds) : [];
  const windowEnded = today && activeWindowStart ? today >= getWindowEnd(activeWindowStart) : false;
  const isActiveLevelComplete =
    today && activeLevel ? isFoundationComplete(activeLevel, today, activeWindowStart, completedIds) : false;

  return (
    <FoundationContext.Provider
      value={{
        levels: RUNNING_LEVELS,
        activeLevel,
        hasChosenLevel: activeLevel !== null,
        selectLevel,
        hasContent: hasLevelContent,

        completions,
        completedIds,
        markComplete,
        todayChallenge,
        bonusChallenge,
        missedChallenges,
        windowEnded,
        isActiveLevelComplete,

        foundationCompletedIds,
        isFoundationComplete: foundationComplete,

        isReady: today !== null,
      }}
    >
      {children}
    </FoundationContext.Provider>
  );
}

export function useFoundation() {
  const ctx = useContext(FoundationContext);
  if (!ctx) {
    throw new Error("useFoundation must be used within a FoundationProvider");
  }
  return ctx;
}
