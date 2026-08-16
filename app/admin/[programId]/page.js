import { redirect } from "next/navigation";
import { programs } from "@/app/lib/programsData";
import AdminLevelPicker from "@/app/components/admin/AdminLevelPicker";

// Must match FLAT_LEVEL_KEY in app/lib/ExerciseContentContext.js — kept as a literal here
// rather than imported, since that module is "use client" and this is a Server Component.
const FLAT_LEVEL_KEY = "flat";

export default async function AdminProgramPage({ params }) {
  const { programId } = await params;
  const program = programs.find((p) => p.id === programId);
  if (!program) redirect("/admin");
  if (!program.levels) redirect(`/admin/${programId}/${FLAT_LEVEL_KEY}`);
  return <AdminLevelPicker programId={programId} />;
}
