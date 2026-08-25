"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import AdminLevelPicker from "@/app/components/admin/AdminLevelPicker";

// Must match FLAT_LEVEL_KEY in app/lib/ExerciseContentContext.js.
const FLAT_LEVEL_KEY = "flat";

// Resolves against the live ProgramsContext (not the static seed data) so programs added at
// runtime — e.g. via the spreadsheet importer — route correctly too, not just the seed set.
export default function AdminProgramRouter({ programId }) {
  const router = useRouter();
  const { programs } = usePrograms();
  const program = programs.find((p) => p.id === programId);

  useEffect(() => {
    if (!program) {
      router.replace("/admin");
    } else if (!program.levels) {
      router.replace(`/admin/${programId}/${FLAT_LEVEL_KEY}`);
    }
  }, [program, programId, router]);

  if (!program || !program.levels) return null; // redirecting
  return <AdminLevelPicker programId={programId} />;
}
