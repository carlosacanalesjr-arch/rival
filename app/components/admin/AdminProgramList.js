"use client";

import Link from "next/link";
import { usePrograms } from "@/app/lib/ProgramsContext";

export default function AdminProgramList() {
  const { programs } = usePrograms();

  const byCategory = {};
  for (const p of programs) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold text-white">Programs</h1>
      <p className="mt-1 text-sm text-zinc-500">Pick a program to edit its exercises.</p>
      <div className="mt-4 space-y-6">
        {Object.entries(byCategory).map(([category, list]) => (
          <div key={category}>
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{category}</p>
            <div className="mt-2 space-y-2">
              {list.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/${p.id}`}
                  className="block rounded-xl border border-border-subtle bg-surface p-3 text-sm font-bold text-white transition hover:border-rival-red/40"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
