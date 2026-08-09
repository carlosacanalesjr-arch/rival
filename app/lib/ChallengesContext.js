"use client";

import { createContext, useContext, useState } from "react";
import { challenges as initialChallenges } from "@/app/lib/mockData";

const ChallengesContext = createContext(null);

function recalcRanks(list) {
  return [...list]
    .sort((a, b) => b.score - a.score)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

function withSelfAdded(list) {
  if (list.some((e) => e.isSelf)) return recalcRanks(list);
  return recalcRanks([
    ...list,
    { id: "self", name: "You", initials: "YO", score: 0, isSelf: true },
  ]);
}

function withSelfRemoved(list) {
  return recalcRanks(list.filter((e) => !e.isSelf));
}

function withSelfScore(list, score) {
  const exists = list.some((e) => e.isSelf);
  const next = exists
    ? list.map((e) => (e.isSelf ? { ...e, score } : e))
    : [...list, { id: "self", name: "You", initials: "YO", score, isSelf: true }];
  return recalcRanks(next);
}

export function ChallengesProvider({ children }) {
  const [challenges, setChallenges] = useState(() =>
    initialChallenges.map((c) => ({ ...c, leaderboard: recalcRanks(c.leaderboard) }))
  );

  const toggleJoin = (id) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const joined = !c.joined;
        return {
          ...c,
          joined,
          participants: joined ? c.participants + 1 : Math.max(0, c.participants - 1),
          leaderboard: joined ? withSelfAdded(c.leaderboard) : withSelfRemoved(c.leaderboard),
        };
      })
    );
  };

  const submitResult = (id, score) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, leaderboard: withSelfScore(c.leaderboard, score) } : c))
    );
  };

  return (
    <ChallengesContext.Provider value={{ challenges, toggleJoin, submitResult }}>
      {children}
    </ChallengesContext.Provider>
  );
}

export function useChallenges() {
  const ctx = useContext(ChallengesContext);
  if (!ctx) {
    throw new Error("useChallenges must be used within a ChallengesProvider");
  }
  return ctx;
}
