"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/TopBar";
import BottomNav from "@/app/components/BottomNav";
import { usePrograms } from "@/app/lib/ProgramsContext";
import {
  programCategories,
  categoriesWithLevelSelector,
  getCardStatus,
  getEnrollmentStatus,
  getCompletionAction,
} from "@/app/lib/programsData";

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

function TrophyIcon({ className }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path
        d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const LEVEL_STYLES = {
  Beginner: { trigger: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400", option: "bg-emerald-500/15 text-emerald-400" },
  Intermediate: { trigger: "border-sky-500/40 bg-sky-500/15 text-sky-400", option: "bg-sky-500/15 text-sky-400" },
  Advanced: { trigger: "border-rival-red/40 bg-rival-red/15 text-rival-red", option: "bg-rival-red/15 text-rival-red" },
};

const PLACEHOLDER_TRIGGER_STYLE = "border-border-subtle bg-surface-raised text-zinc-400";

function LevelBadge({ level }) {
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${LEVEL_STYLES[level].trigger}`}>
      {level} <span className="text-[9px] font-bold opacity-80">· Completed ✓</span>
    </span>
  );
}

// variant "picker" is the pre-enrollment preview (no commitment yet, no confirm needed).
// variant "current" is a live enrollment: trigger is forced red with a dot, and switching
// to a different level requires the user to confirm before it's committed.
function LevelSelector({ selected, onSelect, variant = "picker" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handlePick = (level) => {
    setOpen(false);
    if (level === selected) return;
    if (variant === "current") {
      const confirmed = window.confirm(`Switch to ${level}? Your current progress will be saved.`);
      if (!confirmed) return;
    }
    onSelect(level);
  };

  const triggerStyle =
    variant === "current"
      ? "border-rival-red/40 bg-rival-red/15 text-rival-red"
      : selected
      ? LEVEL_STYLES[selected].trigger
      : PLACEHOLDER_TRIGGER_STYLE;

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${triggerStyle}`}
      >
        {variant === "current" && (
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse-live rounded-full bg-rival-red" aria-hidden />
        )}
        {selected || "Select Level"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-xl border border-border-subtle bg-surface-raised shadow-lg"
        >
          {LEVEL_OPTIONS.map((level) => (
            <button
              key={level}
              role="option"
              aria-selected={level === selected}
              onClick={() => handlePick(level)}
              className={`flex w-full items-center gap-1.5 px-3 py-2 text-left text-xs font-semibold transition ${
                level === selected ? LEVEL_STYLES[level].option : "text-zinc-300 hover:bg-black/40"
              }`}
            >
              {level === selected && variant === "current" && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rival-red" aria-hidden />
              )}
              {level}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EnrollButton({ status, onClick }) {
  if (status === "completed") {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-raised px-4 py-1.5 text-xs font-bold text-zinc-200"
      >
        <TrophyIcon className="text-yellow-400" />
        Completed ✓
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="rounded-full bg-rival-red px-4 py-1.5 text-xs font-bold text-white transition hover:bg-red-600"
    >
      {status === "enrolled" ? "✓ Enrolled" : "Enroll"}
    </button>
  );
}

// Shown only when the *live* cycle just finished (see getEnrollmentStatus), not the
// permanent card badge — otherwise this would stay glued on screen forever once a
// program is ever completed, even mid-way through a fresh round or level.
function CompletionActionButton({ action, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full border border-rival-red/40 bg-rival-red/10 py-2 text-xs font-bold text-rival-red transition hover:bg-rival-red/20"
    >
      {action.kind === "continue" ? "Continue" : "Level Up"}
      <span aria-hidden>→</span>
    </button>
  );
}

function ProgramCard({ program, onOpen, onChangeLevel, allPrograms, onCompletionAction }) {
  const showLevelSelector = categoriesWithLevelSelector.includes(program.category);
  // badgeStatus is the permanent "have you ever completed this" state used for the top
  // pill; liveStatus reflects the cycle actually in progress right now, so the
  // Continue/Level Up button only shows the instant a cycle finishes, not forever after.
  const badgeStatus = getCardStatus(program);
  const liveStatus = getEnrollmentStatus(program);
  const completionAction = liveStatus === "completed" ? getCompletionAction(program, allPrograms) : null;

  // enrolledLevel lives on the program record itself (via context), not local state,
  // so the picked/enrolled level survives card remounts (collapsing a category,
  // navigating away and back, etc.) instead of resetting to "Select Level".
  let levelControl = null;
  if (showLevelSelector) {
    if (badgeStatus === "completed" && program.enrolledLevel) {
      levelControl = <LevelBadge level={program.enrolledLevel} />;
    } else {
      levelControl = (
        <LevelSelector
          selected={program.enrolledLevel || null}
          onSelect={(newLevel) => onChangeLevel(program.id, newLevel)}
          variant={badgeStatus === "enrolled" ? "current" : "picker"}
        />
      );
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onOpen(program.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(program.id);
        }
      }}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-surface p-4"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rival-red to-orange-500" aria-hidden />

      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 truncate text-sm font-bold text-white">{program.title}</p>
        {levelControl}
      </div>

      <p className="mt-2 text-sm text-zinc-400">{program.shortDescription}</p>

      <div className="mt-3 flex items-center justify-end">
        <EnrollButton
          status={badgeStatus}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpen(program.id);
          }}
        />
      </div>

      {completionAction && (
        <CompletionActionButton
          action={completionAction}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompletionAction(program, completionAction);
          }}
        />
      )}
    </div>
  );
}

function MyProgramRow({ program, onOpen, allPrograms, onCompletionAction }) {
  const percent = Math.round((program.currentWeek / program.duration) * 100);
  const badgeStatus = getCardStatus(program);
  const liveStatus = getEnrollmentStatus(program);
  const completionAction = liveStatus === "completed" ? getCompletionAction(program, allPrograms) : null;

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onOpen(program.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(program.id);
        }
      }}
      className="cursor-pointer rounded-2xl border border-border-subtle bg-surface p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{program.title}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{program.category}</p>
        </div>
        {badgeStatus === "completed" ? (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-subtle bg-surface-raised px-2.5 py-1 text-[11px] font-bold text-zinc-200">
            <TrophyIcon className="text-yellow-400" />
            Completed ✓
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-rival-red/15 px-2.5 py-1 text-[11px] font-bold text-rival-red">
            Week {program.currentWeek}/{program.duration}
          </span>
        )}
      </div>

      {badgeStatus !== "completed" && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Progress</span>
            <span className="font-semibold text-white">{percent}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rival-red to-orange-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {completionAction && (
        <CompletionActionButton
          action={completionAction}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompletionAction(program, completionAction);
          }}
        />
      )}
    </div>
  );
}

function CategoryDropdown({
  category,
  programsInCategory,
  isOpen,
  onToggle,
  onOpenProgram,
  onChangeLevel,
  allPrograms,
  onCompletionAction,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-base font-bold text-white">{category}</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {programsInCategory.length} program{programsInCategory.length === 1 ? "" : "s"}
          </p>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="space-y-3 border-t border-border-subtle p-3">
          {programsInCategory.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onOpen={onOpenProgram}
              onChangeLevel={onChangeLevel}
              allPrograms={allPrograms}
              onCompletionAction={onCompletionAction}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const TABS = ["Browse", "My Programs"];

export default function ProgramsScreen() {
  const router = useRouter();
  const { programs, updateEnrolledLevel, levelUpProgram, continueProgram } = usePrograms();
  const [activeTab, setActiveTab] = useState("Browse");
  const [openCategories, setOpenCategories] = useState(() => new Set());

  const openProgram = (id) => router.push(`/programs/${id}`);
  const myPrograms = programs.filter((p) => p.joined);

  // "continue" repeats the same program at the same level for a fresh 3-month block.
  // "level-up" / "same-program" re-enrolls that exact program at the next level (only
  // touches its own record). "level-up" / "different-program" (HYROX) just points at the
  // sibling level's page.
  const handleCompletionAction = (program, action) => {
    if (action.kind === "continue") {
      continueProgram(program.id);
      openProgram(program.id);
    } else if (action.type === "same-program") {
      levelUpProgram(program.id, action.nextLevel);
      openProgram(program.id);
    } else {
      openProgram(action.programId);
    }
  };

  const toggleCategory = (category) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-black">
      <TopBar />

      <main className="mx-auto w-full max-w-md flex-1 pb-6">
        <div className="px-4 pt-5">
          <h1 className="text-xl font-extrabold text-white">Programs</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Structured training plans across every discipline.
          </p>
        </div>

        <div className="sticky top-[57px] z-20 mt-4 flex border-b border-border-subtle bg-black/95 backdrop-blur">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 border-b-2 py-3 text-sm font-bold transition ${
                activeTab === tab ? "border-rival-red text-white" : "border-transparent text-zinc-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Browse" && (
          <div className="space-y-3 p-4">
            {programCategories.map((category) => {
              const categoryPrograms = programs.filter((p) => p.category === category);
              if (categoryPrograms.length === 0) return null;
              return (
                <CategoryDropdown
                  key={category}
                  category={category}
                  programsInCategory={categoryPrograms}
                  isOpen={openCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  onOpenProgram={openProgram}
                  onChangeLevel={updateEnrolledLevel}
                  allPrograms={programs}
                  onCompletionAction={handleCompletionAction}
                />
              );
            })}
          </div>
        )}

        {activeTab === "My Programs" && (
          <div className="p-4">
            {myPrograms.length === 0 ? (
              <div className="mt-8 flex flex-col items-center gap-3 text-center">
                <p className="text-sm font-bold text-white">No programs yet</p>
                <p className="text-sm text-zinc-500">
                  Enroll in a program from the Browse tab to start tracking your progress.
                </p>
                <button
                  onClick={() => setActiveTab("Browse")}
                  className="mt-2 rounded-full bg-rival-red px-5 py-2.5 text-sm font-bold text-white"
                >
                  Browse Programs
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myPrograms.map((program) => (
                  <MyProgramRow
                    key={program.id}
                    program={program}
                    onOpen={openProgram}
                    allPrograms={programs}
                    onCompletionAction={handleCompletionAction}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <div className="mx-auto w-full max-w-md">
        <BottomNav />
      </div>
    </div>
  );
}
