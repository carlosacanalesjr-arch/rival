"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import { getWeeksForLevel } from "@/app/lib/programsData";
import { BackIcon } from "@/app/components/admin/AdminIcons";

export default function AdminWeekList({ programId, levelKey }) {
  const router = useRouter();
  const { programs } = usePrograms();
  const program = programs.find((p) => p.id === programId);

  if (!program) return <p className="text-sm text-zinc-500">Program not found.</p>;

  const weeks = getWeeksForLevel(program, levelKey);
  const backHref = program.levels ? `/admin/${programId}` : "/admin";
  const backLabel = program.levels ? "Levels" : "Programs";

  return (
    <div>
      <button
        onClick={() => router.push(backHref)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <BackIcon /> {backLabel}
      </button>
      <h1 className="mt-3 text-xl font-extrabold text-white">
        {program.title}
        {program.levels && <span className="text-zinc-500"> · {levelKey}</span>}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">Pick a week to edit.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {weeks.map((w) => (
          <Link
            key={w.week}
            href={`/admin/${programId}/${levelKey}/${w.week}`}
            className="rounded-xl border border-border-subtle bg-surface p-3 text-sm font-bold text-white transition hover:border-rival-red/40"
          >
            Week {w.week}
            <span className="mt-0.5 block truncate text-[11px] font-normal text-zinc-500">{w.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
