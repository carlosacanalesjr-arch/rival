"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "rival_auth_user";

// Hardcoded trainer allowlist — this app has no backend/user database, so admin
// status is purely a client-side flag, not real server-side security. Derived at
// read time (not at each signUp*/logIn* call site) so it's the one place to
// maintain and re-derives live if the allowlist ever grows.
const TRAINER_EMAILS = new Set(["carlosa.canalesjr@gmail.com"]);

function computeIsTrainer(email) {
  return Boolean(email) && TRAINER_EMAILS.has(email.trim().toLowerCase());
}

let cachedRaw;
let cachedUser = null;
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
      const parsed = raw ? JSON.parse(raw) : null;
      cachedUser = parsed ? { ...parsed, isTrainer: computeIsTrainer(parsed.email) } : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

function getServerSnapshot() {
  return null;
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeUser(nextUser) {
  try {
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore unavailable storage
  }
  cachedRaw = undefined;
  listeners.forEach((listener) => listener());
}

export function AuthProvider({ children }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const signUpAthlete = (data) => {
    const nextUser = {
      accountType: "athlete",
      provider: "password",
      ...data,
      createdAt: new Date().toISOString(),
    };
    writeUser(nextUser);
    return nextUser;
  };

  const signUpBusiness = (data) => {
    const nextUser = {
      accountType: "business",
      provider: "password",
      ...data,
      createdAt: new Date().toISOString(),
    };
    writeUser(nextUser);
    return nextUser;
  };

  const logIn = ({ email }) => {
    const nextUser = {
      accountType: "athlete",
      provider: "password",
      email,
      firstName: email.split("@")[0],
    };
    writeUser(nextUser);
    return nextUser;
  };

  const logInWithProvider = (provider) => {
    const nextUser = {
      accountType: "athlete",
      provider,
      firstName: provider === "apple" ? "Apple User" : "Google User",
    };
    writeUser(nextUser);
    return nextUser;
  };

  const logOut = () => writeUser(null);

  return (
    <AuthContext.Provider
      value={{ user, signUpAthlete, signUpBusiness, logIn, logInWithProvider, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
