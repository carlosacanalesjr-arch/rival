"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { seedEvents } from "@/app/lib/exploreSeedData";

// Same useSyncExternalStore + localStorage pattern as ExerciseContentContext/MediaContext —
// this app has no backend, so this is the only way posted events survive a reload. Unlike
// those two (which only ever hold trainer *overlays* on top of programsData.js), there's no
// separate seed-data module for events, so this store itself seeds from exploreSeedData.js
// the first time it's ever read, then persists everything (seed + posts) from then on.
const EventsContext = createContext(null);
const STORAGE_KEY = "rival_events_v1";
const HIDDEN_EVENTS_KEY = "rival_events_hidden_v1";

let cachedRaw;
let cachedEvents = seedEvents;
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
      cachedEvents = raw ? JSON.parse(raw) : seedEvents;
    } catch {
      cachedEvents = seedEvents;
    }
  }
  return cachedEvents;
}

function getServerSnapshot() {
  return seedEvents;
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeEvents(nextEvents) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
  } catch {
    // Storage full or unavailable — posts/reports just won't survive a reload.
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

// "Not interested" is personal and silent (no notification to the host, not a report, not
// visible to admin) — so it's keyed per-email, same pattern as ContentGuidelinesModal's
// per-email ack map. Scoped to this content type only, same as DealsContext's separate store —
// there's no shared "business profile" record tying a host's events and deals together.
const EMPTY_HIDDEN = {};
let cachedHiddenRaw;
let cachedHiddenMap = EMPTY_HIDDEN;
const hiddenListeners = new Set();

function readHiddenRaw() {
  try {
    return localStorage.getItem(HIDDEN_EVENTS_KEY);
  } catch {
    return null;
  }
}

function getHiddenSnapshot() {
  const raw = readHiddenRaw();
  if (raw !== cachedHiddenRaw) {
    cachedHiddenRaw = raw;
    try {
      cachedHiddenMap = raw ? JSON.parse(raw) : EMPTY_HIDDEN;
    } catch {
      cachedHiddenMap = EMPTY_HIDDEN;
    }
  }
  return cachedHiddenMap;
}

function getHiddenServerSnapshot() {
  return EMPTY_HIDDEN;
}

function subscribeHidden(callback) {
  hiddenListeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    hiddenListeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeHiddenMap(next) {
  try {
    localStorage.setItem(HIDDEN_EVENTS_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — the hide just won't survive a reload.
  }
  cachedHiddenRaw = undefined;
  hiddenListeners.forEach((listener) => listener());
}

export function EventsProvider({ children }) {
  const events = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hiddenMap = useSyncExternalStore(subscribeHidden, getHiddenSnapshot, getHiddenServerSnapshot);

  // New posts go live immediately (reactive moderation via reporting, not pre-review — there's
  // no reviewer/admin queue in this app, so requiring pre-approval would leave posts stuck
  // forever). postedByEmail is how a business finds its own posts in the dashboard, since
  // business accounts have no separate stable id beyond their email.
  const addEvent = (data, postedByEmail) => {
    const event = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: "approved",
      reports: [],
      createdAt: new Date().toISOString(),
      postedByEmail,
      ...data,
    };
    writeEvents([event, ...events]);
    return event;
  };

  const reportEvent = (id, reason, note) => {
    writeEvents(
      events.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "reported",
              reports: [...(e.reports || []), { reason, note: note || null, reportedAt: new Date().toISOString() }],
            }
          : e
      )
    );
  };

  const hideEvent = (eventId, email) => {
    if (!email || !eventId) return;
    const current = hiddenMap[email] || [];
    if (current.includes(eventId)) return;
    writeHiddenMap({ ...hiddenMap, [email]: [...current, eventId] });
  };

  const value = {
    events,
    addEvent,
    reportEvent,
    getEvent: (id) => events.find((e) => e.id === id),
    hideEvent,
    isEventHidden: (eventId, email) => Boolean(email && (hiddenMap[email] || []).includes(eventId)),
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return ctx;
}
