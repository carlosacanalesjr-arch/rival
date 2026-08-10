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

  return (
    <ProgramsContext.Provider value={{ programs, toggleEnroll, updateEnrolledLevel }}>
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
