"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrograms } from "@/app/lib/ProgramsContext";
import { getActiveWeeks, getDaysForWeek, getCompletedDays, getEnrollmentStatus } from "@/app/lib/programsData";
import { firePushNotification } from "@/app/lib/notifications";
import ImageSlot from "@/app/components/ImageSlot";

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ direction, className }) {
  const d = direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DayRow({ day, isComplete, onToggle, mediaKey }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-pressed={isComplete}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition ${
        isComplete ? "border-emerald-500/40 bg-emerald-500/10" : "border-border-subtle bg-surface"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition ${
          isComplete ? "bg-emerald-500 text-black" : "border border-border-subtle text-zinc-400"
        }`}
      >
        {isComplete ? <CheckIcon /> : day.day}
      </span>
      {/* stopPropagation so uploading/replacing/removing the thumbnail doesn't also toggle day-complete */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0">
        <ImageSlot
          mediaKey={mediaKey}
          alt={day.label}
          compact
          showLabel={false}
          className="h-10 w-10 rounded-lg"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">{day.label}</p>
        {day.source?.exercises?.length > 0 ? (
          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {day.source.exercises.map((e) => e.name).join(" · ")}
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-zinc-500">{isComplete ? "Complete" : "Pending"}</p>
        )}
      </div>
      {isComplete && (
        <span className="shrink-0 text-[11px] font-bold text-emerald-400">Done</span>
      )}
    </div>
  );
}

function WeekPanel({ program, week, onDayToggle }) {
  const days = getDaysForWeek(program, week);
  const completed = getCompletedDays(program, week.week);
  return (
    <div className="w-full shrink-0 snap-center px-4">
      <div className="pt-2">
        <p className="text-xs font-semibold text-zinc-500">
          Week {week.week} of {program.duration}
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-white">{week.title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{week.focus}</p>
      </div>
      <div className="mt-4 space-y-2 pb-10">
        {days.map((day) => (
          <DayRow
            key={day.day}
            day={day}
            isComplete={completed.includes(day.day)}
            onToggle={() => onDayToggle(week, day, days.length)}
            mediaKey={`day-thumb:${program.id}:${week.week}:${day.day}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TrainingFlow({ id }) {
  const router = useRouter();
  const { programs, toggleDayComplete } = usePrograms();
  const program = programs.find((p) => p.id === id);

  const scrollRef = useRef(null);
  const hasScrolledOnce = useRef(false);
  const toastTimer = useRef(null);
  const [viewedWeek, setViewedWeek] = useState(program?.currentWeek ?? null);
  const [toast, setToast] = useState(null);

  const weeks = program ? getActiveWeeks(program) : [];
  const status = program ? getEnrollmentStatus(program) : "not-enrolled";

  // Scroll to the athlete's current pending week whenever it changes — on first mount
  // (auto, no animation) and again whenever completing a week auto-advances it (smooth, so
  // the jump to the next week reads as a deliberate transition, not a page glitch).
  useEffect(() => {
    if (!program || weeks.length === 0 || !scrollRef.current) return;
    const index = weeks.findIndex((w) => w.week === program.currentWeek);
    const target = index === -1 ? 0 : index;
    const child = scrollRef.current.children[target];
    if (!child) return;
    child.scrollIntoView({ behavior: hasScrolledOnce.current ? "smooth" : "auto", inline: "center", block: "nearest" });
    hasScrolledOnce.current = true;
    setViewedWeek(weeks[target]?.week ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.currentWeek, program?.id]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  if (!program) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <p className="text-lg font-bold text-white">Program not found</p>
        <button
          onClick={() => router.push("/programs")}
          className="rounded-full bg-rival-red px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to Programs
        </button>
      </div>
    );
  }

  if (status === "not-enrolled") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <p className="text-lg font-bold text-white">You haven&apos;t started {program.title} yet</p>
        <button
          onClick={() => router.push(`/programs/${id}`)}
          className="rounded-full bg-rival-red px-5 py-2.5 text-sm font-bold text-white"
        >
          View Program
        </button>
      </div>
    );
  }

  const showToast = (title, body) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ title, body });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  const handleDayToggle = (week, day, totalDays) => {
    const wasComplete = getCompletedDays(program, week.week).includes(day.day);
    const completedCountBefore = getCompletedDays(program, week.week).length;
    toggleDayComplete(program.id, week.week, day.day, totalDays);

    if (wasComplete) return; // unchecking — no celebration, no notification

    const willFinishWeek = completedCountBefore + 1 >= totalDays;
    const isCurrentWeek = week.week === program.currentWeek;

    if (willFinishWeek && isCurrentWeek) {
      if (week.week >= program.duration) {
        showToast("Program complete! 🏆", `You finished all ${program.duration} weeks of ${program.title}.`);
        firePushNotification("Program complete! 🏆", `You finished ${program.title}.`);
      } else {
        const nextWeek = week.week + 1;
        showToast("Week complete!", `Nice work — moving on to Week ${nextWeek}.`);
        firePushNotification("Week complete!", `Moving on to Week ${nextWeek} of ${program.title}.`);
      }
    } else {
      showToast("Nice work!", "Day complete.");
      firePushNotification("Nice work! 💪", "Day complete.");
    }
  };

  const viewedIndex = weeks.findIndex((w) => w.week === viewedWeek);

  const goToIndex = (index) => {
    const clamped = Math.max(0, Math.min(weeks.length - 1, index));
    const child = scrollRef.current?.children[clamped];
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    const week = weeks[index]?.week;
    if (week && week !== viewedWeek) setViewedWeek(week);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <button onClick={() => router.push("/programs")} aria-label="Back" className="text-zinc-300 hover:text-white">
          <BackIcon />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-base font-bold text-white">{program.title}</h1>
        <button
          onClick={() => router.push(`/programs/${id}`)}
          className="shrink-0 text-xs font-semibold text-rival-red"
        >
          Details
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        <button
          onClick={() => goToIndex(viewedIndex - 1)}
          disabled={viewedIndex <= 0}
          aria-label="Previous week"
          className="rounded-full p-2 text-zinc-400 transition hover:text-white disabled:opacity-20"
        >
          <ChevronIcon direction="left" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-white">
            Week {viewedWeek} of {program.duration}
          </p>
          {viewedWeek === program.currentWeek && (
            <p className="mt-0.5 text-[10px] font-bold tracking-wide text-rival-red">CURRENT WEEK</p>
          )}
        </div>
        <button
          onClick={() => goToIndex(viewedIndex + 1)}
          disabled={viewedIndex >= weeks.length - 1}
          aria-label="Next week"
          className="rounded-full p-2 text-zinc-400 transition hover:text-white disabled:opacity-20"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-wrap justify-center gap-1.5 px-4 pb-3">
        {weeks.map((w, i) => {
          const days = getDaysForWeek(program, w);
          const isWeekComplete = getCompletedDays(program, w.week).length >= days.length;
          const isViewed = w.week === viewedWeek;
          return (
            <button
              key={w.week}
              onClick={() => goToIndex(i)}
              aria-label={`Jump to Week ${w.week}`}
              className={`h-2 rounded-full transition-all ${
                isViewed ? "w-5 bg-rival-red" : isWeekComplete ? "w-2 bg-emerald-500" : "w-2 bg-zinc-700"
              }`}
            />
          );
        })}
      </div>

      <main
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {weeks.map((w) => (
          <WeekPanel key={w.week} program={program} week={w} onDayToggle={handleDayToggle} />
        ))}
      </main>

      {toast && (
        <div className="fixed inset-x-0 top-16 z-50 flex justify-center px-4" aria-live="polite">
          <div className="animate-toast-in flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-raised px-4 py-3 shadow-lg">
            <span className="text-lg" aria-hidden>
              🔔
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">{toast.title}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{toast.body}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
