"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

// Persisted overlay for trainer-authored day/exercise content, layered on top of the
// placeholder scaffolding in programsData.js at render time. Follows the same
// useSyncExternalStore + localStorage pattern as AuthContext/MediaContext — this app has
// no backend, so this is the only way admin edits can survive a reload.
const ExerciseContentContext = createContext(null);
const STORAGE_KEY = "rival_exercise_content_v1";

export const FLAT_LEVEL_KEY = "flat";

// Resolves which level's content a given day belongs to. Programs without a `levels` map
// (most categories) always use FLAT_LEVEL_KEY. Leveled programs (Fire Dept Prep) use an
// explicit level when the caller already knows it (the admin editor, from its route),
// falling back to the athlete's own enrolledLevel — the same fallback getActiveWeeks uses
// in programsData.js — so athlete-facing views build the exact same key without needing
// to know the level explicitly.
export function resolveLevelKey(program, explicitLevel) {
  if (!program?.levels) return FLAT_LEVEL_KEY;
  return explicitLevel || program.enrolledLevel || Object.keys(program.levels)[0];
}

export function buildDayKey(programId, levelKey, week, day) {
  return `${programId}:${levelKey}:${week}:${day}`;
}

let cachedRaw;
let cachedContent = {};
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
      cachedContent = raw ? JSON.parse(raw) : {};
    } catch {
      cachedContent = {};
    }
  }
  return cachedContent;
}

const EMPTY_CONTENT = {};
function getServerSnapshot() {
  return EMPTY_CONTENT;
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeContent(nextContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
  } catch {
    // Storage full or unavailable — edits just won't survive a reload.
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

export function ExerciseContentProvider({ children }) {
  const content = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setDayOverride = (key, dayContent) => {
    writeContent({ ...content, [key]: { ...dayContent, updatedAt: new Date().toISOString() } });
  };

  const clearDayOverride = (key) => {
    if (!(key in content)) return;
    const next = { ...content };
    delete next[key];
    writeContent(next);
  };

  const value = { getDayOverride: (key) => content[key], setDayOverride, clearDayOverride };

  return <ExerciseContentContext.Provider value={value}>{children}</ExerciseContentContext.Provider>;
}

function emptyDay() {
  return { warmup: [], exercises: [], cooldown: [] };
}

// The one hook every render site (athlete-facing views and the admin editor) uses to
// read/write a day's content. `baseDay` is the placeholder/seed day (or undefined);
// `levelOverride` lets the admin editor pass an explicit level from its route instead of
// relying on the athlete's enrolledLevel.
export function useDayContent(program, week, day, baseDay, levelOverride) {
  const ctx = useContext(ExerciseContentContext);
  if (!ctx) {
    throw new Error("useDayContent must be used within an ExerciseContentProvider");
  }

  const levelKey = resolveLevelKey(program, levelOverride);
  const key = buildDayKey(program.id, levelKey, week, day);
  const override = ctx.getDayOverride(key);
  const content = override || baseDay || emptyDay();

  const setDay = (nextDayContent) => ctx.setDayOverride(key, nextDayContent);
  const resetDay = () => ctx.clearDayOverride(key);

  const mutateSection = (section, updater) => {
    const current = override || baseDay || emptyDay();
    setDay({ ...current, [section]: updater(current[section] || []) });
  };

  const addExercise = (section, item) => mutateSection(section, (items) => [...items, item]);

  // Full replace, not a merge — the editor always reconstructs a complete item from its
  // form, so merging would let cleared fields silently keep their old stale value.
  const updateExercise = (section, index, nextItem) =>
    mutateSection(section, (items) => items.map((it, i) => (i === index ? nextItem : it)));

  const removeExercise = (section, index) =>
    mutateSection(section, (items) => items.filter((_, i) => i !== index));

  return {
    content,
    isOverridden: Boolean(override),
    levelKey,
    key,
    setDay,
    resetDay,
    addExercise,
    updateExercise,
    removeExercise,
  };
}
