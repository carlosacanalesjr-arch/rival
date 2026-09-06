"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

// Manual light/dark/system override on top of the prefers-color-scheme-only theming already in
// globals.css. "system" (the default, and the only behavior before this) leaves the OS/browser
// preference in charge; "light"/"dark" pin the app regardless of it, via a `data-theme` attribute
// on <html> that globals.css gives priority over the media query (see the `:not([data-theme=...])`
// guard there). Persisted in localStorage, same useSyncExternalStore pattern as
// ExerciseContentContext/MediaContext -- this app has no backend, so that's the only way the
// choice survives a reload.
const ThemeContext = createContext(null);
const STORAGE_KEY = "rival_theme_v1";
const THEMES = ["system", "light", "dark"];

let cachedRaw;
let cachedTheme = "system";
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
    cachedTheme = THEMES.includes(raw) ? raw : "system";
  }
  return cachedTheme;
}

// Server-rendered and first-hydration-pass markup has no access to localStorage, so both must
// agree on "system" -- the anti-flash inline script in layout.js (which runs before hydration,
// synchronously, from the same storage key) is what actually prevents a flash for a returning
// visitor with an explicit choice; this snapshot only has to avoid a hydration mismatch.
function getServerSnapshot() {
  return "system";
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage full or unavailable -- the choice just won't survive a reload.
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Re-applies on every render of a theme change (not just the initial mount) so switching in
  // Settings takes effect immediately without a reload.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
