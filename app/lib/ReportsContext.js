"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

// Centralized store for everything the admin "Reports" section needs to show: event/deal
// reports (Spam/Inappropriate/Misleading/Other, from ReportModal) and general app-feedback
// submissions (from ReportIssueModal), normalized into one shape so they can share one list.
// Kept separate from EventsContext/DealsContext's embedded per-item `reports[]` (which drives
// the existing "hide reported items from Explore" behavior) — this store is purely for admin
// visibility and doesn't affect what athletes see in Explore.
const ReportsContext = createContext(null);
const STORAGE_KEY = "rival_reports_v1";

const EMPTY_REPORTS = [];
let cachedRaw;
let cachedReports = EMPTY_REPORTS;
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
      cachedReports = raw ? JSON.parse(raw) : EMPTY_REPORTS;
    } catch {
      cachedReports = EMPTY_REPORTS;
    }
  }
  return cachedReports;
}

function getServerSnapshot() {
  return EMPTY_REPORTS;
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeReports(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — the report just won't survive a reload.
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

// Plain function (not a hook) so it can be called from DealDetailScreen/EventDetailScreen/
// ExploreScreen right alongside reportDeal/reportEvent, with no need to wrap those trees in
// a ReportsProvider — it reads/writes the same localStorage key the hook-based provider does.
// `kind` is "event" | "deal" | "app_feedback"; `reason`/`itemId`/`itemLabel` are null for
// app_feedback, `screenshotUrl` is only ever set for app_feedback.
export function submitReport({ kind, itemId = null, itemLabel = null, reason = null, details = null, screenshotUrl = null, reporterEmail = null }) {
  const report = {
    id: `rp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    itemId,
    itemLabel,
    reason,
    details,
    screenshotUrl,
    reporterEmail,
    reviewed: false,
    createdAt: new Date().toISOString(),
  };
  writeReports([report, ...getSnapshot()]);
  return report;
}

export function ReportsProvider({ children }) {
  const reports = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const markReviewed = (id) => {
    writeReports(reports.map((r) => (r.id === id ? { ...r, reviewed: true } : r)));
  };

  const value = { reports, addReport: submitReport, markReviewed };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return ctx;
}
