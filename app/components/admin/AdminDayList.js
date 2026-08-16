"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import { getWeeksForLevel } from "@/app/lib/programsData";
import { BackIcon } from "@/app/components/admin/AdminIcons";

export default function AdminDayList({ programId, levelKey, week }) {
  const router = useRouter();
  const { programs } = usePrograms();
  const program = programs.find((p) => p.id === programId);

  if (!program) return <p className="text-sm text-zinc-500">Program not found.</p>;

  const weeks = getWeeksForLevel(program, levelKey);
  const weekData = weeks.find((w) => w.week === week);
  const dayCount = weekData?.days?.length || 4;

  return (
    <div>
      <button
        onClick={() => router.push(`/admin/${programId}/${levelKey}`)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <BackIcon /> Weeks
      </button>
      <h1 className="mt-3 text-xl font-extrabold text-white">
        Week {week}
        {weekData ? ` · ${weekData.title}` : ""}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">Pick a day to edit.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
          <Link
            key={day}
            href={`/admin/${programId}/${levelKey}/${week}/${day}`}
            className="rounded-xl border border-border-subtle bg-surface p-3 text-center text-sm font-bold text-white transition hover:border-rival-red/40"
          >
            Day {day}
          </Link>
        ))}
      </div>
    </div>
  );
}
