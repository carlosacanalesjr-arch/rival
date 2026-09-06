"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import { BackIcon } from "@/app/components/admin/AdminIcons";

export default function AdminLevelPicker({ programId }) {
  const router = useRouter();
  const { programs } = usePrograms();
  const program = programs.find((p) => p.id === programId);

  if (!program) return <p className="text-sm text-muted-2">Program not found.</p>;

  const levels = Object.keys(program.levels || {});

  return (
    <div>
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <BackIcon /> Programs
      </button>
      <h1 className="mt-3 text-xl font-extrabold text-foreground">{program.title}</h1>
      <p className="mt-1 text-sm text-muted-2">Pick a level to edit.</p>
      <div className="mt-4 space-y-2">
        {levels.map((level) => (
          <Link
            key={level}
            href={`/admin/${programId}/${level}`}
            className="block rounded-xl border border-border-subtle bg-surface p-3 text-sm font-bold text-foreground transition hover:border-rival-red/40"
          >
            {level}
          </Link>
        ))}
      </div>
    </div>
  );
}
