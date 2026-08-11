"use client";

import { createContext, useContext, useState } from "react";
import { programs as initialPrograms } from "@/app/lib/programsData";

const ProgramsContext = createContext(null);

export function ProgramsProvider({ children }) {
  const [programs, setPrograms] = useState(initialPrograms);

  const toggleEnroll = (id) => {
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const joined = !p.joined;
        return {
          ...p,
          joined,
          currentWeek: joined ? 1 : 0,
          enrolledCount: joined ? p.enrolledCount + 1 : Math.max(0, p.enrolledCount - 1),
        };
      })
    );
  };

  const updateEnrolledLevel = (id, level) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, enrolledLevel: level } : p)));
  };

  // Agency focus (Police / DPS Trooper / Border Patrol) is just a phase-emphasis tag, not
  // tied to progress, so unlike level changes it never needs a confirm or a progress reset.
  const updateEnrolledFocus = (id, focus) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, enrolledFocus: focus } : p)));
  };

  // Re-enrolls the same program at a new level, restarting progress and resetting the
  // rounds-at-level counter. Only ever touches the one program record by id, so it never
  // affects any other program's enrollment. hasCompletedLevel is explicitly kept true (a
  // one-way ratchet) so the card-level "Completed" badge never disappears just because a
  // fresh cycle started.
  const levelUpProgram = (id, nextLevel) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              enrolledLevel: nextLevel,
              joined: true,
              currentWeek: 1,
              roundsCompletedAtLevel: 0,
              hasCompletedLevel: true,
            }
          : p
      )
    );
  };

  // Re-enrolls the same program at the *same* level for a fresh 3-month block, bumping
  // the completed-rounds count so a second completion at this level offers Level Up.
  const continueProgram = (id) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              joined: true,
              currentWeek: 1,
              roundsCompletedAtLevel: (p.roundsCompletedAtLevel || 0) + 1,
              hasCompletedLevel: true,
            }
          : p
      )
    );
  };

  return (
    <ProgramsContext.Provider
      value={{ programs, toggleEnroll, updateEnrolledLevel, updateEnrolledFocus, levelUpProgram, continueProgram }}
    >
      {children}
    </ProgramsContext.Provider>
  );
}

export function usePrograms() {
  const ctx = useContext(ProgramsContext);
  if (!ctx) {
    throw new Error("usePrograms must be used within a ProgramsProvider");
  }
  return ctx;
}
