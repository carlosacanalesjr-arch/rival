"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/TopBar";
import BottomNav from "@/app/components/BottomNav";
import ScrollFadeRow from "@/app/components/explore/ScrollFadeRow";
import { useChallenges } from "@/app/lib/ChallengesContext";
import { CHALLENGE_CATEGORIES } from "@/app/lib/mockData";
import FoundationScreen from "@/app/components/FoundationScreen";

const CATEGORY_EMOJI = {
  Running: "🏃",
  Biking: "🚴",
  SkiErg: "🎿",
  Rowing: "🚣",
  "Olympic Weightlifting": "🏋️",
  HYROX: "🔥",
  DEKA: "⚡",
  "Strength & Conditioning": "💪",
  "Public Safety Prep": "🚒",
};

// Single-session "do it once and log it" challenges — everything else (weekly or monthly
// accumulation toward a distance/volume number, same progress-bar/leaderboard mechanic either
// way) is a Monthly challenge regardless of its actual 1-week/1-month `duration` field. The
// HYROX combos are matched by id prefix since there are 17 of them; the rest are one-offs
// named explicitly since there's exactly one per category today.
const DAILY_CHALLENGE_IDS = new Set([
  "c3", // Iron Grip
  "hyrox-simulation",
  "oly-new-snatch-pr",
  "deka-fit-finisher",
  "public-safety-foundation-finisher",
]);

function getCadence(challenge) {
  if (DAILY_CHALLENGE_IDS.has(challenge.id) || challenge.id.startsWith("hyrox-combo-")) return "daily";
  return "monthly";
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// "Aug 1, 2026" + "Aug 31, 2026" -> "Aug 1 – Aug 31, 2026"; different years keep both in full.
function formatDateRange(startDate, endDate) {
  const [startMonthDay, startYear] = startDate.split(", ");
  const [endMonthDay, endYear] = endDate.split(", ");
  if (startYear === endYear) return `${startMonthDay} – ${endMonthDay}, ${endYear}`;
  return `${startDate} – ${endDate}`;
}

// Garmin-style "select a category" dropdown — same trigger/menu/outside-click pattern as
// LevelSelector and FocusSelector in LevelFocusSelectors.js, sized full-width for the top of
// the Challenges page instead of an inline chip.
function CategoryDropdown({ categories, counts, selected, onSelect }) {
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between rounded-2xl border border-border-subtle bg-surface px-4 py-3.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-xl" aria-hidden>
            {CATEGORY_EMOJI[selected]}
          </span>
          <span className="truncate text-sm font-bold text-white">{selected}</span>
          <span className="shrink-0 text-xs text-zinc-500">{counts[selected] ?? 0}</span>
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-2xl border border-border-subtle bg-surface-raised shadow-lg"
        >
          {categories.map((category) => (
            <button
              key={category}
              role="option"
              aria-selected={category === selected}
              onClick={() => {
                setOpen(false);
                onSelect(category);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition ${
                category === selected ? "bg-rival-red/15 text-rival-red" : "text-zinc-300 hover:bg-black/40"
              }`}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden>{CATEGORY_EMOJI[category]}</span>
                {category}
              </span>
              <span className="text-xs text-zinc-500">{counts[category] ?? 0}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// One card in a horizontal challenge row — image/banner (a gradient standing in for a photo,
// since challenges have no imagery in the data model), title, date range, joined count, and a
// wide pill Join button, matching Garmin Connect's Challenges card layout.
function ChallengeCard({ challenge, onOpen, onToggleJoin }) {
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onOpen(challenge.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(challenge.id);
        }
      }}
      className="w-64 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-surface"
    >
      <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${challenge.accent}`}>
        <span className="text-5xl" aria-hidden>
          {CATEGORY_EMOJI[challenge.category]}
        </span>
        <span className="absolute right-2 top-2 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          {challenge.duration}
        </span>
      </div>

      <div className="p-3.5">
        <p className="truncate text-sm font-bold text-white">{challenge.title}</p>
        <p className="mt-0.5 text-xs text-zinc-400">{formatDateRange(challenge.startDate, challenge.endDate)}</p>
        <p className="mt-1.5 text-[11px] text-zinc-500">{challenge.participants.toLocaleString()} joined</p>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleJoin(challenge.id);
          }}
          className={`mt-2.5 flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-bold transition ${
            challenge.joined
              ? "border border-rival-red text-rival-red hover:bg-rival-red/10"
              : "bg-rival-red text-white hover:bg-red-600"
          }`}
        >
          {challenge.joined ? "Joined" : "Join"}
        </button>
      </div>
    </div>
  );
}

// One cadence row — "Daily Challenges" or "Monthly Challenges" — either a swipeable card row
// or a "Coming soon" placeholder when this category has nothing in that bucket yet.
function ChallengeRow({ title, items, onOpen, onToggleJoin }) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-base font-bold text-white">{title}</h2>
        <span className="text-xs text-zinc-500">
          {items.length} {items.length === 1 ? "challenge" : "challenges"}
        </span>
      </div>
      <div className="mt-3 px-4">
        {items.length > 0 ? (
          <ScrollFadeRow>
            {items.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} onOpen={onOpen} onToggleJoin={onToggleJoin} />
            ))}
          </ScrollFadeRow>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border-subtle text-xs text-zinc-500">
            Coming soon
          </div>
        )}
      </div>
    </section>
  );
}

export default function ChallengesScreen() {
  const router = useRouter();
  const { challenges, toggleJoin } = useChallenges();

  const categoriesWithItems = CHALLENGE_CATEGORIES.filter((category) =>
    challenges.some((c) => c.category === category)
  );
  const [selectedCategory, setSelectedCategory] = useState(categoriesWithItems[0] ?? CHALLENGE_CATEGORIES[0]);

  // Running no longer browses a list of challenges — it's a single locked daily calendar
  // (see FoundationScreen) — so its dropdown row reads "Foundation" instead of an item count.
  const counts = Object.fromEntries(
    categoriesWithItems.map((category) => [
      category,
      category === "Running" ? "Foundation" : challenges.filter((c) => c.category === category).length,
    ])
  );
  const items = challenges.filter((c) => c.category === selectedCategory);
  const dailyItems = items.filter((c) => getCadence(c) === "daily");
  const monthlyItems = items.filter((c) => getCadence(c) === "monthly");
  const isRunning = selectedCategory === "Running";

  const openChallenge = (id) => router.push(`/challenges/${id}`);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-black">
      <TopBar />

      <main className="mx-auto w-full max-w-md flex-1 pb-24">
        <div className="px-4 pt-5">
          <h1 className="text-xl font-extrabold text-white">Challenges</h1>
          <p className="mt-1 text-sm text-zinc-400">Join a challenge and climb the leaderboard.</p>
        </div>

        <div className="px-4 pt-4">
          <CategoryDropdown
            categories={categoriesWithItems}
            counts={counts}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {isRunning ? (
          <FoundationScreen />
        ) : (
          <>
            <ChallengeRow title="Daily Challenges" items={dailyItems} onOpen={openChallenge} onToggleJoin={toggleJoin} />
            <ChallengeRow
              title="Monthly Challenges"
              items={monthlyItems}
              onOpen={openChallenge}
              onToggleJoin={toggleJoin}
            />
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
