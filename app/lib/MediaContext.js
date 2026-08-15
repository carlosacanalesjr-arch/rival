"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

// Placeholder media store for program/day/exercise images and video links until a real
// backend exists. Everything else in this app is either hardcoded seed data or
// localStorage (see AuthContext), so this follows the same external-store pattern: a flat
// map of `key -> { imageUrl?, videoUrl? }` persisted to localStorage as data URLs, keyed by
// strings the callers build themselves (e.g. `program-hero:${program.id}`).
const MediaContext = createContext(null);
const STORAGE_KEY = "rival_program_media_v1";

const EMPTY_MEDIA = {};
let cachedRaw;
let cachedMedia = EMPTY_MEDIA;
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
      cachedMedia = raw ? JSON.parse(raw) : {};
    } catch {
      cachedMedia = {};
    }
  }
  return cachedMedia;
}

function getServerSnapshot() {
  return EMPTY_MEDIA;
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeMedia(nextMedia) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMedia));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — uploads just won't survive a reload.
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

export function MediaProvider({ children }) {
  const media = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setEntryField = (key, field, value) => {
    writeMedia({ ...media, [key]: { ...media[key], [field]: value } });
  };

  const clearEntryField = (key, field) => {
    const existing = media[key];
    if (!existing || !(field in existing)) return;
    const nextEntry = { ...existing };
    delete nextEntry[field];
    const next = { ...media };
    if (Object.keys(nextEntry).length === 0) delete next[key];
    else next[key] = nextEntry;
    writeMedia(next);
  };

  const value = {
    setImage: (key, dataUrl) => setEntryField(key, "imageUrl", dataUrl),
    removeImage: (key) => clearEntryField(key, "imageUrl"),
    setVideoUrl: (key, url) => setEntryField(key, "videoUrl", url),
    removeVideoUrl: (key) => clearEntryField(key, "videoUrl"),
    getEntry: (key) => media[key],
  };

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia(key) {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  const entry = ctx.getEntry(key);
  return {
    imageUrl: entry?.imageUrl || null,
    videoUrl: entry?.videoUrl || null,
    setImage: (dataUrl) => ctx.setImage(key, dataUrl),
    removeImage: () => ctx.removeImage(key),
    setVideoUrl: (url) => ctx.setVideoUrl(key, url),
    removeVideoUrl: () => ctx.removeVideoUrl(key),
  };
}
