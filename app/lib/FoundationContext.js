"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  FOUNDATION_WINDOW_END,
  getBonusForDate,
  getChallengeForDate,
  getMissedFoundationChallenges,
  isFoundationComplete,
} from "@/app/lib/foundationRunningData";

const FoundationContext = createContext(null);

// The Challenges page is statically prerendered by Next.js, so computing `new Date()` during
// render would bake whatever date the last build happened to run on into the served HTML —
// every visitor would see build day's challenge until the next deploy. Instead `today` starts
// null (matching on both the server-rendered pass and the client's first hydration pass, so
// there's no hydration mismatch) and is only resolved client-side after mount, where it always
// reflects the visitor's real current date regardless of when the page was last built. A
// once-a-minute check keeps a long-open tab from getting stuck on yesterday's date.
function useToday() {
  const [today, setToday] = useState(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setToday((prev) => (prev && prev.toDateString() === now.toDateString() ? prev : now));
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  return today;
}

// Per-athlete Foundation state — completions and everything derived from them (today's
// challenge, the missed-challenge backlog, completion status). Client-only, same as every
// other piece of app state in this mock app (see AGENTS notes: only auth is real Supabase).
export function FoundationProvider({ children }) {
  // challengeId -> { value, proof, completedAt } — `proof` matches the shape ChallengesContext
  // already uses: { photoUrl, verification, detectedValue }.
  const [completions, setCompletions] = useState({});
  const today = useToday();

  const completedIds = new Set(Object.keys(completions));

  const markComplete = (challengeId, value, proof) => {
    setCompletions((prev) => ({
      ...prev,
      [challengeId]: { value, proof, completedAt: new Date().toISOString() },
    }));
  };

  const todayChallenge = today ? getChallengeForDate(today) : null;
  const bonusChallenge = today ? getBonusForDate(today) : null;
  const missedChallenges = today ? getMissedFoundationChallenges(today, completedIds) : [];
  const windowEnded = today ? today >= FOUNDATION_WINDOW_END : false;
  const complete = today ? isFoundationComplete(today, completedIds) : false;

  return (
    <FoundationContext.Provider
      value={{
        completions,
        completedIds,
        markComplete,
        todayChallenge,
        bonusChallenge,
        missedChallenges,
        windowEnded,
        isFoundationComplete: complete,
        isReady: today !== null,
      }}
    >
      {children}
    </FoundationContext.Provider>
  );
}

export function useFoundation() {
  const ctx = useContext(FoundationContext);
  if (!ctx) {
    throw new Error("useFoundation must be used within a FoundationProvider");
  }
  return ctx;
}
