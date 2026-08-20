"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { seedDeals } from "@/app/lib/exploreSeedData";

// Mirrors EventsContext.js exactly — same seed-then-persist localStorage pattern, same
// report/block shape, just for deals instead of events. Kept as a fully separate store (not
// a shared "listings" context) since the request asked for two distinct Contexts.
const DealsContext = createContext(null);
const STORAGE_KEY = "rival_deals_v1";
const HIDDEN_DEALS_KEY = "rival_deals_hidden_v1";

let cachedRaw;
let cachedDeals = seedDeals;
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
      cachedDeals = raw ? JSON.parse(raw) : seedDeals;
    } catch {
      cachedDeals = seedDeals;
    }
  }
  return cachedDeals;
}

function getServerSnapshot() {
  return seedDeals;
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeDeals(nextDeals) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDeals));
  } catch {
    // Storage full or unavailable — posts/reports just won't survive a reload.
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

// "Not interested" is personal and silent (no notification to the business, not a report,
// not visible to admin) — so it's keyed per-email, same pattern as ContentGuidelinesModal's
// per-email ack map, rather than a single flat list like the old global block store was.
const EMPTY_HIDDEN = {};
let cachedHiddenRaw;
let cachedHiddenMap = EMPTY_HIDDEN;
const hiddenListeners = new Set();

function readHiddenRaw() {
  try {
    return localStorage.getItem(HIDDEN_DEALS_KEY);
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
    localStorage.setItem(HIDDEN_DEALS_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — the hide just won't survive a reload.
  }
  cachedHiddenRaw = undefined;
  hiddenListeners.forEach((listener) => listener());
}

export function DealsProvider({ children }) {
  const deals = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hiddenMap = useSyncExternalStore(subscribeHidden, getHiddenSnapshot, getHiddenServerSnapshot);

  const addDeal = (data, postedByEmail) => {
    const deal = {
      id: `dl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: "approved",
      reports: [],
      createdAt: new Date().toISOString(),
      postedByEmail,
      ...data,
    };
    writeDeals([deal, ...deals]);
    return deal;
  };

  const reportDeal = (id, reason, note) => {
    writeDeals(
      deals.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "reported",
              reports: [...(d.reports || []), { reason, note: note || null, reportedAt: new Date().toISOString() }],
            }
          : d
      )
    );
  };

  const hideDeal = (dealId, email) => {
    if (!email || !dealId) return;
    const current = hiddenMap[email] || [];
    if (current.includes(dealId)) return;
    writeHiddenMap({ ...hiddenMap, [email]: [...current, dealId] });
  };

  const value = {
    deals,
    addDeal,
    reportDeal,
    getDeal: (id) => deals.find((d) => d.id === id),
    hideDeal,
    isDealHidden: (dealId, email) => Boolean(email && (hiddenMap[email] || []).includes(dealId)),
  };

  return <DealsContext.Provider value={value}>{children}</DealsContext.Provider>;
}

export function useDeals() {
  const ctx = useContext(DealsContext);
  if (!ctx) {
    throw new Error("useDeals must be used within a DealsProvider");
  }
  return ctx;
}
