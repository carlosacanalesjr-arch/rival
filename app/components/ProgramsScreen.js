"use client";

import { useState } from "react";
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
import { LEVEL_STYLES, LevelSelector, FocusSelector } from "@/app/components/LevelFocusSelectors";
import ImageSlot from "@/app/components/ImageSlot";
import { getSectionSlug } from "@/app/components/ExerciseBreakdown";

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

function LevelBadge({ level }) {
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${LEVEL_STYLES[level].trigger}`}>
      {level} <span className="text-[9px] font-bold opacity-80">· Completed ✓</span>
    </span>
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
//
// action.kind "choice" (Public Safety Prep) shows both options side by side and lets the
// athlete pick; every other kind is a single action the data layer already decided on.
function CompletionActionButton({ action, onAction }) {
  if (action.kind === "choice") {
    return (
      <div className="mt-2 flex gap-2">
        <button
          onClick={(e) => onAction(e, { kind: "continue" })}
          className="flex-1 rounded-full border border-border-subtle bg-surface-raised py-2 text-xs font-bold text-zinc-200 transition hover:bg-black/40"
        >
          Repeat
        </button>
        {action.nextLevel && (
          <button
            onClick={(e) => onAction(e, { kind: "level-up", type: "same-program", nextLevel: action.nextLevel })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-rival-red/40 bg-rival-red/10 py-2 text-xs font-bold text-rival-red transition hover:bg-rival-red/20"
          >
            Level Up
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={(e) => onAction(e, action)}
      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full border border-rival-red/40 bg-rival-red/10 py-2 text-xs font-bold text-rival-red transition hover:bg-rival-red/20"
    >
      {action.kind === "continue" ? "Continue" : "Level Up"}
      <span aria-hidden>→</span>
    </button>
  );
}

function ProgramCard({ program, onOpen, onChangeLevel, onChangeFocus, allPrograms, onCompletionAction }) {
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
          category={program.category}
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
      className="relative cursor-pointer rounded-2xl border border-border-subtle bg-surface p-4"
    >
      {/* rounded-t-2xl (not parent overflow-hidden) clips this corner, so the LevelSelector /
          FocusSelector popovers lower in the card aren't clipped by an overflow-hidden ancestor. */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-rival-red to-orange-500" aria-hidden />

      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 truncate text-sm font-bold text-white">{program.title}</p>
        {levelControl}
      </div>

      <p className="mt-2 text-sm text-zinc-400">{program.shortDescription}</p>

      {program.focusOptions && (
        <div className="mt-2">
          <FocusSelector
            options={program.focusOptions}
            selected={program.enrolledFocus || null}
            onSelect={(focus) => onChangeFocus(program.id, focus)}
          />
        </div>
      )}

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
          onAction={(e, action) => {
            e.preventDefault();
            e.stopPropagation();
            onCompletionAction(program, action);
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
  // enrolledLevel covers categories with a level selector (DEKA, Running, S&C, Public Safety
  // Prep — one program record, level tracked separately); difficulty covers HYROX, where each
  // level is its own program record. Either way, the row's title alone doesn't always say which
  // level was completed (e.g. "5K" or "DEKA MILE" give no clue), so the badge spells it out.
  const completedLevel = program.enrolledLevel || program.difficulty || null;

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
          <p className="mt-0.5 text-xs text-zinc-500">
            {program.category}
            {program.enrolledFocus ? ` · ${program.enrolledFocus}` : ""}
          </p>
        </div>
        {badgeStatus === "completed" ? (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-subtle bg-surface-raised px-2.5 py-1 text-[11px] font-bold text-zinc-200">
            <TrophyIcon className="text-yellow-400" />
            {completedLevel ? `${completedLevel} Completed ✓` : "Completed ✓"}
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
          onAction={(e, action) => {
            e.preventDefault();
            e.stopPropagation();
            onCompletionAction(program, action);
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
  onChangeFocus,
  allPrograms,
  onCompletionAction,
}) {
  return (
    // No overflow-hidden here — it would clip the LevelSelector / FocusSelector popovers
    // inside each ProgramCard whenever they extend past this section's bottom edge. The
    // header below gets its own overflow-hidden instead, scoped just to the background image.
    <section className="rounded-2xl border border-border-subtle bg-surface">
      {/* A div, not a button, since ImageSlot's own corner button (trainer-only) can't nest
          inside a <button>. Sits above the collapsible list as a sibling, so expanding never
          touches it — the background image stays put regardless of isOpen. */}
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
        aria-expanded={isOpen}
        className="relative flex min-h-24 cursor-pointer flex-col justify-end overflow-hidden rounded-t-2xl"
      >
        <div className="absolute inset-0">
          <ImageSlot
            mediaKey={`category-bg:${getSectionSlug(category)}`}
            alt={`${category} background`}
            label="Add image"
            cornerControlsOnly
            className="h-full w-full"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-base font-bold text-white">{category}</p>
            <p className="mt-0.5 text-xs text-white/80">
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
            className={`shrink-0 text-white/80 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3 border-t border-border-subtle p-3">
          {programsInCategory.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onOpen={onOpenProgram}
              onChangeLevel={onChangeLevel}
              onChangeFocus={onChangeFocus}
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
  const { programs, updateEnrolledLevel, updateEnrolledFocus, levelUpProgram, continueProgram } = usePrograms();
  const [activeTab, setActiveTab] = useState("Browse");
  const [openCategories, setOpenCategories] = useState(() => new Set());

  // Enrolled-and-in-progress programs open straight into the training flow (their current
  // pending week), so reopening the app lands athletes where they left off instead of on
  // the static overview. Not-yet-enrolled and completed programs still open the overview.
  const openProgram = (id) => {
    const program = programs.find((p) => p.id === id);
    const status = program ? getEnrollmentStatus(program) : "not-enrolled";
    router.push(status === "enrolled" ? `/programs/${id}/train` : `/programs/${id}`);
  };
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
                  onChangeFocus={updateEnrolledFocus}
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
