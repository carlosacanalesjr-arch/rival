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
const BLOCKED_HOSTS_KEY = "rival_events_blocked_hosts_v1";

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

// Blocking is scoped to this content type only (blocking a host here doesn't touch
// DealsContext's separate block list) — keeps each store self-contained, since there's no
// shared "business profile" record anywhere that ties a host's events and deals together.
const EMPTY_BLOCKED_HOSTS = [];
let cachedBlockedRaw;
let cachedBlockedHosts = EMPTY_BLOCKED_HOSTS;
const blockedListeners = new Set();

function readBlockedRaw() {
  try {
    return localStorage.getItem(BLOCKED_HOSTS_KEY);
  } catch {
    return null;
  }
}

function getBlockedSnapshot() {
  const raw = readBlockedRaw();
  if (raw !== cachedBlockedRaw) {
    cachedBlockedRaw = raw;
    try {
      cachedBlockedHosts = raw ? JSON.parse(raw) : EMPTY_BLOCKED_HOSTS;
    } catch {
      cachedBlockedHosts = EMPTY_BLOCKED_HOSTS;
    }
  }
  return cachedBlockedHosts;
}

function getBlockedServerSnapshot() {
  return EMPTY_BLOCKED_HOSTS;
}

function subscribeBlocked(callback) {
  blockedListeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    blockedListeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeBlockedHosts(next) {
  try {
    localStorage.setItem(BLOCKED_HOSTS_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — the block just won't survive a reload.
  }
  cachedBlockedRaw = undefined;
  blockedListeners.forEach((listener) => listener());
}

export function EventsProvider({ children }) {
  const events = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const blockedHosts = useSyncExternalStore(subscribeBlocked, getBlockedSnapshot, getBlockedServerSnapshot);

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

  const blockHost = (hostEmail) => {
    if (!hostEmail || blockedHosts.includes(hostEmail)) return;
    writeBlockedHosts([...blockedHosts, hostEmail]);
  };

  const value = {
    events,
    addEvent,
    reportEvent,
    getEvent: (id) => events.find((e) => e.id === id),
    blockedHosts,
    blockHost,
    isHostBlocked: (hostEmail) => blockedHosts.includes(hostEmail),
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
