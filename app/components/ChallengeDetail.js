"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChallenges } from "@/app/lib/ChallengesContext";
import { analyzePhoto, valuesMatch } from "@/app/lib/photoVerification";

const MAX_BYTES = 4 * 1024 * 1024;

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-3">
      <p className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function StatusPill({ verification }) {
  if (verification === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
        ✓ Confirmed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
      ⚠ Needs Review
    </span>
  );
}

// Full-screen tap-to-view for a submission's attached proof photo.
function PhotoLightbox({ photoUrl, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- runtime data URL, not a static asset */}
      <img src={photoUrl} alt="Submission proof" className="max-h-full max-w-full rounded-lg object-contain" />
    </div>
  );
}

function SubmitResultModal({ challenge, onClose, onSubmit }) {
  const [step, setStep] = useState("form"); // "form" | "analyzing" | "result"
  const [value, setValue] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [analysis, setAnalysis] = useState(null); // { detectedValue, verification }

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

  const canSubmit = value.trim().length > 0 && !Number.isNaN(parseFloat(value)) && Boolean(photoUrl);

  const runAnalysis = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStep("analyzing");
    // TODO(real API): analyzePhoto is a mock — see app/lib/photoVerification.js for what a
    // real vision/OCR integration needs to replace here.
    const { detectedValue } = await analyzePhoto(photoUrl);
    const entered = parseFloat(value);
    const verification = valuesMatch(entered, detectedValue) ? "confirmed" : "needs_review";
    setAnalysis({ detectedValue, verification });
    setStep("result");
  };

  const finalize = () => {
    const entered = parseFloat(value);
    onSubmit(entered, { photoUrl, verification: analysis.verification, detectedValue: analysis.detectedValue });
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
          <h3 className="text-base font-bold text-white">Submit Result</h3>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500">{challenge.title}</p>

        {step === "form" && (
          <form onSubmit={runAnalysis} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400" htmlFor="result-value">
                Your result ({challenge.unit})
              </label>
              <input
                id="result-value"
                autoFocus
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 12.4"
                className="mt-1.5 w-full rounded-xl border border-border-subtle bg-black px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-400">
                Proof photo <span className="text-zinc-600">(required)</span>
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                A screenshot of your run app or watch showing your distance and time.
              </p>
              <input type="file" accept="image/*" id="proof-photo" className="hidden" onChange={handleFile} />
              {photoUrl ? (
                <label
                  htmlFor="proof-photo"
                  className="mt-2 block cursor-pointer overflow-hidden rounded-xl border border-border-subtle"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- runtime data URL, not a static asset */}
                  <img src={photoUrl} alt="Proof preview" className="h-40 w-full object-cover" />
                </label>
              ) : (
                <label
                  htmlFor="proof-photo"
                  className="mt-2 flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-700 bg-black text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
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
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-rival-red" />
            <p className="text-sm text-zinc-400">Analyzing your photo…</p>
          </div>
        )}

        {step === "result" && analysis && (
          <div className="mt-4">
            {analysis.verification === "confirmed" ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                <p className="text-sm font-bold text-emerald-400">✓ Confirmed</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Your photo shows about {analysis.detectedValue} {challenge.unit}, matching your entry of {value}{" "}
                  {challenge.unit}.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                <p className="text-sm font-bold text-amber-400">⚠ Needs Review</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {analysis.detectedValue == null
                    ? "We couldn't read a distance from this photo. It'll be flagged for manual review."
                    : `We couldn't confirm this matches your photo. You entered ${value} ${challenge.unit}, but the photo appears to show about ${analysis.detectedValue} ${challenge.unit}.`}
                </p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {analysis.verification !== "confirmed" && (
                <button
                  onClick={tryAgain}
                  className="flex-1 rounded-full border border-border-subtle py-3 text-sm font-bold text-white hover:bg-surface-raised"
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

export default function ChallengeDetail({ id }) {
  const router = useRouter();
  const { challenges, toggleJoin, submitResult } = useChallenges();
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const challenge = challenges.find((c) => c.id === id);

  if (!challenge) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <p className="text-lg font-bold text-white">Challenge not found</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-rival-red px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleSubmitResult = (value, proof) => {
    submitResult(challenge.id, value, proof);
    setShowModal(false);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="text-zinc-300 hover:text-white"
        >
          <BackIcon />
        </button>
        <h1 className="truncate text-base font-bold text-white">{challenge.title}</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 pb-28">
        <div className="relative overflow-hidden border-b border-border-subtle bg-surface px-4 pb-5 pt-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rival-red to-orange-500" aria-hidden />
          <span className="inline-block rounded-full bg-rival-red/15 px-2.5 py-1 text-[11px] font-bold text-rival-red">
            {challenge.category}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-white">{challenge.title}</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-300">Goal: {challenge.goal}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{challenge.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoTile label="Duration" value={challenge.duration} />
            <InfoTile label="Prize" value={challenge.prize} />
            <InfoTile label="Start Date" value={challenge.startDate} />
            <InfoTile label="End Date" value={challenge.endDate} />
            <InfoTile label="Participants" value={challenge.participants.toLocaleString()} />
          </div>

          <div className="mt-4 rounded-xl border border-border-subtle bg-black p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">Requirements</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Submit a photo of your run app or watch showing your result — no submission is accepted without one.
              We automatically check the photo against what you enter: matches are confirmed right away, and
              anything that doesn&apos;t match (or can&apos;t be read) is flagged for manual review instead of rejected.
            </p>
          </div>

          {challenge.joined && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Your progress</span>
                <span className="font-semibold text-white">{challenge.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rival-red to-orange-500"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <section className="mt-5">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Leaderboard</h3>
              <span className="flex items-center gap-1 rounded-full bg-rival-red/15 px-2 py-0.5 text-[10px] font-bold text-rival-red">
                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-rival-red" />
                LIVE
              </span>
            </div>
          </div>

          <ul className="mx-4 mt-3 divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle bg-surface">
            {challenge.leaderboard.map((entry) => (
              <li
                key={entry.id}
                className={`flex items-center gap-3 px-4 py-3 ${entry.isSelf ? "bg-rival-red/5" : ""}`}
              >
                <span
                  className={`w-5 shrink-0 text-sm font-extrabold ${
                    entry.rank === 1
                      ? "text-yellow-400"
                      : entry.rank === 2
                      ? "text-zinc-300"
                      : entry.rank === 3
                      ? "text-orange-400"
                      : "text-zinc-500"
                  }`}
                >
                  {entry.rank}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-bold text-white">
                  {entry.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 truncate text-sm font-medium text-white">
                    {entry.name}
                    {entry.isSelf && <span className="text-[10px] font-bold text-rival-red">YOU</span>}
                  </span>
                  {entry.proof && (
                    <span className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLightboxUrl(entry.proof.photoUrl)}
                        className="overflow-hidden rounded-md border border-border-subtle"
                        aria-label="View proof photo"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- runtime data URL, not a static asset */}
                        <img src={entry.proof.photoUrl} alt="" className="h-8 w-8 object-cover" />
                      </button>
                      <StatusPill verification={entry.proof.verification} />
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-right text-sm font-bold text-white">
                  {entry.score.toLocaleString()}
                  <span className="ml-1 text-[10px] font-normal text-zinc-500">{challenge.unit}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {confirmed && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-rival-red px-4 py-2 text-xs font-bold text-white shadow-lg">
          Result submitted ✓
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border-subtle bg-black/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        {challenge.joined ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-rival-red px-3 py-3 text-xs font-bold text-rival-red">
              ✓ Joined
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white hover:bg-red-600"
            >
              SUBMIT RESULT
            </button>
          </div>
        ) : (
          <button
            onClick={() => toggleJoin(challenge.id)}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white hover:bg-red-600"
          >
            JOIN CHALLENGE
          </button>
        )}
      </div>

      {showModal && (
        <SubmitResultModal
          challenge={challenge}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitResult}
        />
      )}

      {lightboxUrl && <PhotoLightbox photoUrl={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>
  );
}
