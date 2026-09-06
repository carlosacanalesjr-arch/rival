"use client";

import { useState } from "react";
import { useFoundation } from "@/app/lib/FoundationContext";
import { analyzePhoto, valuesMatch } from "@/app/lib/photoVerification";
import { DAY_LABELS, MEASUREMENT_UNITS, RUN_TYPE_LABELS, challengeHasLeaderboard } from "@/app/lib/foundationRunningData";
import { getLeaderboardUnit, getMockLeaderboardEntries, rankLeaderboard } from "@/app/lib/runningLeaderboard";
import { FirstLevelPicker, LevelSwitchConfirmModal, RunningLevelDropdown } from "@/app/components/RunningLevelPicker";

const MAX_BYTES = 4 * 1024 * 1024;

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="3.5" />
    </svg>
  );
}

// The prescription line under a challenge's title — e.g. "18 min", "2 mi", or
// "4 × 200m, 1 min recovery" for uniform interval work. Mixed-distance sets (e.g. Week 5's
// "1 × 800m + 2 × 400m") store work_interval as a comma-separated "800m, 400m, 400m (mixed
// set)" string with repetitions as the total rep count — the name field already spells out
// the per-rep breakdown, so this just adds the recovery note instead of a garbled "N × ...".
function formatPrescription(challenge) {
  if (challenge.repetitions && challenge.work_interval) {
    if (challenge.work_interval.includes(",")) {
      return challenge.recovery_interval ? `${challenge.recovery_interval} recovery between reps` : null;
    }
    const recovery = challenge.recovery_interval ? `, ${challenge.recovery_interval} recovery` : "";
    return `${challenge.repetitions} × ${challenge.work_interval}${recovery}`;
  }
  if (challenge.duration) return challenge.duration;
  if (challenge.distance) return challenge.distance;
  return null;
}

function SubmitFoundationModal({ challenge, onClose, onSubmit }) {
  const [step, setStep] = useState("form"); // "form" | "analyzing" | "result"
  const [value, setValue] = useState("");
  const [leaderboardValue, setLeaderboardValue] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const unit = MEASUREMENT_UNITS[challenge.measurement_type] || "";
  // The leaderboard always ranks by the measurement the challenge *doesn't* fix (Section 14) —
  // e.g. a fixed-duration Base Run ranks by distance covered — so eligible challenges collect
  // that as a second number, separate from the primary result the photo verifies against.
  const leaderboardEligible = challengeHasLeaderboard(challenge);
  const leaderboardUnit = leaderboardEligible ? getLeaderboardUnit(challenge) : null;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setPhotoError("Image is too large (max 4MB).");
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const canSubmit =
    value.trim().length > 0 &&
    !Number.isNaN(parseFloat(value)) &&
    Boolean(photoUrl) &&
    (!leaderboardEligible || (leaderboardValue.trim().length > 0 && !Number.isNaN(parseFloat(leaderboardValue))));

  const runAnalysis = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStep("analyzing");
    const { detectedValue } = await analyzePhoto(photoUrl);
    const entered = parseFloat(value);
    const verification = valuesMatch(entered, detectedValue) ? "confirmed" : "needs_review";
    setAnalysis({ detectedValue, verification });
    setStep("result");
  };

  const finalize = () => {
    const entered = parseFloat(value);
    onSubmit(
      entered,
      { photoUrl, verification: analysis.verification, detectedValue: analysis.detectedValue },
      leaderboardEligible ? parseFloat(leaderboardValue) : null
    );
  };

  const tryAgain = () => {
    setPhotoUrl(null);
    setAnalysis(null);
    setStep("form");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-border-subtle bg-surface p-5 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Submit Photo + Result</h3>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-2">{challenge.name}</p>

        {step === "form" && (
          <form onSubmit={runAnalysis} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted" htmlFor="foundation-result-value">
                Your result {unit ? `(${unit})` : ""}
              </label>
              <input
                id="foundation-result-value"
                autoFocus
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={unit === "reps" ? "e.g. 6" : "e.g. 18"}
                className="mt-1.5 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-3 focus:border-rival-red focus:outline-none"
              />
            </div>

            {leaderboardEligible && (
              <div>
                <label className="text-xs font-medium text-muted" htmlFor="foundation-leaderboard-value">
                  {leaderboardUnit === "mi" ? "Distance covered" : "Finish time"} ({leaderboardUnit})
                  <span className="ml-1 text-muted-3">— for today&apos;s leaderboard</span>
                </label>
                <input
                  id="foundation-leaderboard-value"
                  inputMode="decimal"
                  value={leaderboardValue}
                  onChange={(e) => setLeaderboardValue(e.target.value)}
                  placeholder={leaderboardUnit === "mi" ? "e.g. 1.8" : "e.g. 16.5"}
                  className="mt-1.5 w-full rounded-xl border border-border-subtle bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-3 focus:border-rival-red focus:outline-none"
                />
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-muted">
                Proof photo <span className="text-muted-3">(required)</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted-2">
                A screenshot from Garmin, Strava, Apple Health, another wearable, or a treadmill display.
              </p>
              <input type="file" accept="image/*" id="foundation-proof-photo" className="hidden" onChange={handleFile} />
              {photoUrl ? (
                <label
                  htmlFor="foundation-proof-photo"
                  className="mt-2 block cursor-pointer overflow-hidden rounded-xl border border-border-subtle"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- runtime data URL, not a static asset */}
                  <img src={photoUrl} alt="Proof preview" className="h-40 w-full object-cover" />
                </label>
              ) : (
                <label
                  htmlFor="foundation-proof-photo"
                  className="mt-2 flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border-subtle bg-background text-muted-2 hover:border-border-strong hover:text-foreground-secondary"
                >
                  <CameraIcon />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">Add photo</span>
                </label>
              )}
              {photoError && <p className="mt-1 text-xs text-rival-red">{photoError}</p>}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white disabled:opacity-40"
            >
              SUBMIT
            </button>
          </form>
        )}

        {step === "analyzing" && (
          <div className="mt-8 flex flex-col items-center gap-3 pb-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-subtle border-t-rival-red" />
            <p className="text-sm text-muted">Analyzing your photo…</p>
          </div>
        )}

        {step === "result" && analysis && (
          <div className="mt-4">
            {analysis.verification === "confirmed" ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                <p className="text-sm font-bold text-emerald-400">✓ Confirmed</p>
                <p className="mt-1 text-xs text-muted">
                  Your photo shows about {analysis.detectedValue} {unit}, matching your entry of {value} {unit}.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                <p className="text-sm font-bold text-amber-400">⚠ Needs Review</p>
                <p className="mt-1 text-xs text-muted">
                  {analysis.detectedValue == null
                    ? "We couldn't read a result from this photo. It'll be flagged for manual review."
                    : `We couldn't confirm this matches your photo. You entered ${value} ${unit}, but the photo appears to show about ${analysis.detectedValue} ${unit}.`}
                </p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {analysis.verification !== "confirmed" && (
                <button
                  onClick={tryAgain}
                  className="flex-1 rounded-full border border-border-subtle py-3 text-sm font-bold text-foreground hover:bg-surface-raised"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={finalize}
                className="flex-1 rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white hover:bg-red-600"
              >
                {analysis.verification === "confirmed" ? "Done" : "Submit for Review"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, isBonus, isDone, onSubmit }) {
  const prescription = formatPrescription(challenge);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-4">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
          isBonus ? "from-amber-400 to-amber-600" : "from-rival-red to-orange-500"
        }`}
        aria-hidden
      />
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            isBonus ? "bg-amber-500/15 text-amber-400" : "bg-rival-red/15 text-rival-red"
          }`}
        >
          {RUN_TYPE_LABELS[challenge.run_type]}
        </span>
        {isBonus && (
          <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-400">
            Bonus — optional
          </span>
        )}
        {isDone && (
          <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            ✓ Done
          </span>
        )}
      </div>
      <h3 className="mt-2 text-lg font-extrabold text-foreground">{challenge.name}</h3>
      {prescription && <p className="mt-0.5 text-sm text-muted">{prescription}</p>}
      {challenge.bodyFocus && <p className="mt-0.5 text-xs text-muted-2">{challenge.bodyFocus} focus</p>}

      {!isDone && (
        <button
          onClick={() => onSubmit(challenge)}
          className={`mt-4 flex min-h-12 w-full items-center justify-center rounded-full text-sm font-extrabold tracking-wide text-white transition ${
            isBonus ? "bg-amber-500 hover:bg-amber-600" : "bg-rival-red hover:bg-red-600"
          }`}
        >
          Submit Photo + Result
        </button>
      )}
    </div>
  );
}

// Section 14 — today's challenge only, never mixed across levels, no leaderboard at all for
// Recovery/Recovery Stretch or interval-shaped run types (see challengeHasLeaderboard). Since
// this component only ever renders for `todayChallenge`, it's structurally the *live, still-open*
// board for today — there's no historical view here, so "locks at end of day" is enforced simply
// by this board disappearing (replaced by tomorrow's) the moment the calendar day rolls over.
function DailyLeaderboard({ challenge, selfCompletion }) {
  const unit = getLeaderboardUnit(challenge);
  const entries = getMockLeaderboardEntries(challenge);
  if (selfCompletion?.leaderboardValue != null) {
    entries.push({ id: "self", name: "You", initials: "YO", score: selfCompletion.leaderboardValue, isSelf: true });
  }
  const ranked = rankLeaderboard(challenge, entries);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">Today&apos;s Leaderboard</h3>
          <span className="flex items-center gap-1 rounded-full bg-rival-red/15 px-2 py-0.5 text-[10px] font-bold text-rival-red">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-rival-red" />
            LIVE
          </span>
        </div>
        <span className="text-[10px] text-muted-2">Locks at midnight</span>
      </div>
      <ul className="mt-2 divide-y divide-border-subtle">
        {ranked.map((entry) => (
          <li
            key={entry.id}
            className={`flex items-center gap-3 px-4 py-2.5 ${entry.isSelf ? "bg-rival-red/5" : ""}`}
          >
            <span
              className={`w-5 shrink-0 text-sm font-extrabold ${
                entry.rank === 1 ? "text-yellow-400" : entry.rank === 2 ? "text-foreground-secondary" : entry.rank === 3 ? "text-orange-400" : "text-muted-2"
              }`}
            >
              {entry.rank}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-raised text-[11px] font-bold text-foreground">
              {entry.initials}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {entry.name}
              {entry.isSelf && <span className="ml-1.5 text-[10px] font-bold text-rival-red">YOU</span>}
            </span>
            <span className="shrink-0 text-right text-sm font-bold text-foreground">
              {entry.score}
              <span className="ml-1 text-[10px] font-normal text-muted-2">{unit}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MissedChallengeRow({ challenge, onSubmit }) {
  const prescription = formatPrescription(challenge);
  return (
    <button
      onClick={() => onSubmit(challenge)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface p-3 text-left transition hover:bg-surface-raised"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-foreground">{challenge.name}</p>
        <p className="mt-0.5 text-xs text-muted-2">
          {RUN_TYPE_LABELS[challenge.run_type]} · {DAY_LABELS[challenge.day_of_week]}, Week {challenge.week_number}
          {prescription ? ` · ${prescription}` : ""}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-rival-red/15 px-3 py-1.5 text-xs font-bold text-rival-red">Complete</span>
    </button>
  );
}

export default function FoundationScreen() {
  const {
    levels,
    activeLevel,
    hasChosenLevel,
    selectLevel,
    hasContent,
    todayChallenge,
    bonusChallenge,
    missedChallenges,
    completions,
    completedIds,
    markComplete,
    windowEnded,
    isReady,
  } = useFoundation();
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [confirmedName, setConfirmedName] = useState(null);
  const [missedOpen, setMissedOpen] = useState(false);
  const [pendingLevel, setPendingLevel] = useState(null); // level awaiting switch confirmation

  const handleSubmit = (value, proof, leaderboardValue) => {
    markComplete(activeChallenge.id, value, proof, leaderboardValue);
    setConfirmedName(activeChallenge.name);
    setActiveChallenge(null);
    setTimeout(() => setConfirmedName(null), 2500);
  };

  const levelHasContent = activeLevel ? hasContent(activeLevel) : false;

  return (
    <div>
      <div className="px-4 pt-5">
        <div className="flex items-center gap-2">
          {isReady && hasChosenLevel ? (
            <RunningLevelDropdown levels={levels} activeLevel={activeLevel} onRequestSwitch={setPendingLevel} />
          ) : (
            <p className="text-xs font-bold uppercase tracking-wide text-rival-red">Running</p>
          )}
        </div>
        <p className="mt-2 text-sm text-muted">
          One locked challenge a day, on a shared calendar — everyone on a level sees the same thing on the same date.
        </p>
      </div>

      {isReady && !hasChosenLevel && (
        <FirstLevelPicker levels={levels} hasContent={hasContent} onChoose={selectLevel} />
      )}

      {isReady && hasChosenLevel && !levelHasContent && (
        <div className="mx-4 mt-4 flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border-subtle p-8 text-center">
          <p className="text-sm font-bold text-foreground">{activeLevel} is coming soon</p>
          <p className="text-xs text-muted-2">
            This level&apos;s calendar hasn&apos;t been built yet — check back once it launches.
          </p>
        </div>
      )}

      {isReady && hasChosenLevel && levelHasContent && (
        <>
          {windowEnded && missedChallenges.length > 0 && (
            <div className="mx-4 mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
              Your 3-month {activeLevel} window has ended with {missedChallenges.length} challenge
              {missedChallenges.length === 1 ? "" : "s"} still outstanding. Finish them below to complete {activeLevel}.
            </div>
          )}

          <div className="mt-4 space-y-3 px-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-2">Today</p>
              {todayChallenge ? (
                <>
                  <ChallengeCard
                    challenge={todayChallenge}
                    isDone={completedIds.has(todayChallenge.id)}
                    onSubmit={setActiveChallenge}
                  />
                  {challengeHasLeaderboard(todayChallenge) && (
                    <DailyLeaderboard challenge={todayChallenge} selfCompletion={completions[todayChallenge.id]} />
                  )}
                </>
              ) : (
                <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-border-subtle text-xs text-muted-2">
                  Nothing scheduled yet — check back soon.
                </div>
              )}
            </div>

            {bonusChallenge && (
              <ChallengeCard
                challenge={bonusChallenge}
                isBonus
                isDone={completedIds.has(bonusChallenge.id)}
                onSubmit={setActiveChallenge}
              />
            )}
          </div>
        </>
      )}

      {!isReady && (
        <div className="mt-4 px-4">
          <div className="h-28 animate-pulse rounded-2xl border border-border-subtle bg-surface" />
        </div>
      )}

      {isReady && hasChosenLevel && levelHasContent && (
        <section className="mt-6 px-4 pb-2">
          <button
            onClick={() => setMissedOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl border border-border-subtle bg-surface px-4 py-3.5"
          >
            <span className="text-sm font-bold text-foreground">Missed Challenges ({missedChallenges.length})</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-muted transition-transform ${missedOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {missedOpen && (
            <div className="mt-2 space-y-2">
              {missedChallenges.length === 0 ? (
                <p className="px-1 py-2 text-xs text-muted-2">Nothing missed — you&apos;re caught up.</p>
              ) : (
                missedChallenges.map((c) => <MissedChallengeRow key={c.id} challenge={c} onSubmit={setActiveChallenge} />)
              )}
            </div>
          )}
        </section>
      )}

      {confirmedName && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-rival-red px-4 py-2 text-xs font-bold text-white shadow-lg">
          {confirmedName} submitted ✓
        </div>
      )}

      {activeChallenge && (
        <SubmitFoundationModal challenge={activeChallenge} onClose={() => setActiveChallenge(null)} onSubmit={handleSubmit} />
      )}

      {pendingLevel && (
        <LevelSwitchConfirmModal
          fromLevel={activeLevel}
          toLevel={pendingLevel}
          onCancel={() => setPendingLevel(null)}
          onConfirm={() => {
            selectLevel(pendingLevel);
            setPendingLevel(null);
          }}
        />
      )}
    </div>
  );
}
