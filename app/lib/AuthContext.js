"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "rival_auth_user";

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
      cachedUser = raw ? JSON.parse(raw) : null;
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
