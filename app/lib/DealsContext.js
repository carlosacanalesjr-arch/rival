"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { seedDeals } from "@/app/lib/exploreSeedData";

// Mirrors EventsContext.js exactly — same seed-then-persist localStorage pattern, same
// report/block shape, just for deals instead of events. Kept as a fully separate store (not
// a shared "listings" context) since the request asked for two distinct Contexts.
const DealsContext = createContext(null);
const STORAGE_KEY = "rival_deals_v1";
const BLOCKED_BUSINESSES_KEY = "rival_deals_blocked_businesses_v1";

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

const EMPTY_BLOCKED_BUSINESSES = [];
let cachedBlockedRaw;
let cachedBlockedBusinesses = EMPTY_BLOCKED_BUSINESSES;
const blockedListeners = new Set();

function readBlockedRaw() {
  try {
    return localStorage.getItem(BLOCKED_BUSINESSES_KEY);
  } catch {
    return null;
  }
}

function getBlockedSnapshot() {
  const raw = readBlockedRaw();
  if (raw !== cachedBlockedRaw) {
    cachedBlockedRaw = raw;
    try {
      cachedBlockedBusinesses = raw ? JSON.parse(raw) : EMPTY_BLOCKED_BUSINESSES;
    } catch {
      cachedBlockedBusinesses = EMPTY_BLOCKED_BUSINESSES;
    }
  }
  return cachedBlockedBusinesses;
}

function getBlockedServerSnapshot() {
  return EMPTY_BLOCKED_BUSINESSES;
}

function subscribeBlocked(callback) {
  blockedListeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    blockedListeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeBlockedBusinesses(next) {
  try {
    localStorage.setItem(BLOCKED_BUSINESSES_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — the block just won't survive a reload.
  }
  cachedBlockedRaw = undefined;
  blockedListeners.forEach((listener) => listener());
}

export function DealsProvider({ children }) {
  const deals = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const blockedBusinesses = useSyncExternalStore(subscribeBlocked, getBlockedSnapshot, getBlockedServerSnapshot);

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

  const blockBusiness = (businessEmail) => {
    if (!businessEmail || blockedBusinesses.includes(businessEmail)) return;
    writeBlockedBusinesses([...blockedBusinesses, businessEmail]);
  };

  const value = {
    deals,
    addDeal,
    reportDeal,
    getDeal: (id) => deals.find((d) => d.id === id),
    blockedBusinesses,
    blockBusiness,
    isBusinessBlocked: (businessEmail) => blockedBusinesses.includes(businessEmail),
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
