"use client";

import ImageSlot from "@/app/components/ImageSlot";
import VideoLinkField from "@/app/components/VideoLinkField";

// Turns { sets, reps, duration, rest } into a single compact line, e.g. "3 × 12 · Rest 60 sec"
// or "25 min · Zone 2". Any subset of fields can be present depending on the exercise.
export function formatPrescription(item) {
  const parts = [];
  if (item.sets && item.reps) parts.push(`${item.sets} × ${item.reps}`);
  else if (item.reps) parts.push(item.reps);
  else if (item.sets) parts.push(`${item.sets} sets`);
  if (item.duration) parts.push(item.duration);
  if (item.intensity) parts.push(item.intensity);
  if (item.rest) parts.push(`Rest ${item.rest}`);
  return parts.join(" · ");
}

// Shared between the phase-accordion breakdown (ProgramDetail) and the day-thumbnail
// breakdown (TrainingFlow) so both views render exercise media identically and — critically
// — derive the exact same MediaContext key for a given exercise, so an image/video added in
// one view shows up in the other. Exercise items don't carry a stable id, so the key is
// built from position within program/week/day/section (`keyPrefix` is
// `${programId}:${week}:${day}`) — stable as long as the seed data for that slot isn't
// reordered.
export function ExerciseGroup({ title, items, keyPrefix }) {
  if (!items || items.length === 0) return null;
  const sectionSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="mt-2 first:mt-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{title}</p>
      <ul className="mt-1.5 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <ImageSlot
              mediaKey={`exercise:${keyPrefix}:${sectionSlug}:${i}`}
              alt={item.name}
              compact
              showLabel={false}
              className="h-11 w-11 shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-zinc-200">{item.name}</span>
                <span className="shrink-0 text-[11px] text-zinc-500">{formatPrescription(item)}</span>
              </div>
              {item.notes && <p className="mt-0.5 text-[11px] text-zinc-500">{item.notes}</p>}
              <VideoLinkField mediaKey={`exercise:${keyPrefix}:${sectionSlug}:${i}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
