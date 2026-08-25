"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAthlete } from "@/app/lib/athletes";
import { useChallenges } from "@/app/lib/ChallengesContext";
import { computeCompletionBadges } from "@/app/lib/challengeBadges";
import { computeStreakBadges } from "@/app/lib/streaks";
import { useAuth } from "@/app/lib/AuthContext";
import { supabase } from "@/app/lib/supabase";
import { getInitials } from "@/app/lib/initials";
import BadgeIcon from "@/app/components/BadgeIcon";
import ReportIssueModal from "@/app/components/ReportIssueModal";

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 22V4" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const typeStyles = {
  Run: "bg-rival-red/15 text-rival-red",
  Strength: "bg-orange-500/15 text-orange-400",
  Ride: "bg-sky-500/15 text-sky-400",
};

function ProfilePostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const submitComment = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: `local-${prev.length}-${text.slice(0, 4)}`, user: "You", text }]);
    setDraft("");
  };

  return (
    <article className="border-b border-border-subtle bg-black px-4 py-4">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            typeStyles[post.type] ?? "bg-zinc-800 text-zinc-300"
          }`}
        >
          {post.type}
        </span>
        <span className="text-xs text-zinc-500">{post.time}</span>
      </div>

      <p className="mt-2 text-sm font-semibold text-white">{post.title}</p>
      <p className="mt-1 text-sm text-zinc-400">{post.caption}</p>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-border-subtle bg-surface p-3">
        {post.stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-extrabold text-white">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-5">
        <button onClick={toggleLike} aria-pressed={liked} className="flex items-center gap-1.5 text-sm font-medium">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={liked ? "#ff1f3d" : "none"}
            stroke={liked ? "#ff1f3d" : "currentColor"}
            strokeWidth="2"
            className={liked ? "" : "text-zinc-400"}
          >
            <path
              d="M12 21s-7.5-4.6-10-9.3C.5 8.2 2.3 4.5 6 4c2.1-.3 4 .8 6 3 2-2.2 3.9-3.3 6-3 3.7.5 5.5 4.2 4 7.7C19.5 16.4 12 21 12 21Z"
              strokeLinejoin="round"
            />
          </svg>
          <span className={liked ? "text-rival-red" : "text-zinc-400"}>{likes}</span>
        </button>

        <button onClick={() => setShowComments((v) => !v)} className="flex items-center gap-1.5 text-sm font-medium text-zinc-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {comments.length}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-2 border-t border-border-subtle pt-3">
          {comments.length === 0 && <p className="text-xs text-zinc-500">No comments yet. Be the first.</p>}
          {comments.map((c) => (
            <p key={c.id} className="text-sm text-zinc-300">
              <span className="font-semibold text-white">{c.user}</span> {c.text}
            </p>
          ))}
          <form onSubmit={submitComment} className="flex items-center gap-2 pt-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment..."
              className="min-w-0 flex-1 rounded-full border border-border-subtle bg-surface px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
            />
            <button
              type="submit"
              className="flex min-h-11 shrink-0 items-center rounded-full bg-rival-red px-4 text-xs font-bold text-white disabled:opacity-40"
              disabled={!draft.trim()}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

const TABS = ["Activity", "Challenges", "Achievements"];

export default function ProfileScreen({ id }) {
  const router = useRouter();
  const athlete = getAthlete(id);
  const { challenges } = useChallenges();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Activity");
  const [following, setFollowing] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [realProfile, setRealProfile] = useState(null);

  const isSelf = id === "you";

  useEffect(() => {
    if (!isSelf || !user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, home_gym")
        .eq("id", user.id)
        .single();
      if (cancelled) return;
      if (error) {
        console.error(error);
        setRealProfile({});
      } else {
        setRealProfile(data || {});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isSelf, user]);

  const profileLoading = isSelf && Boolean(user) && realProfile === null;

  if (!athlete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <p className="text-lg font-bold text-white">Athlete not found</p>
        <button onClick={() => router.push("/")} className="rounded-full bg-rival-red px-5 py-2.5 text-sm font-bold text-white">
          Back to Home
        </button>
      </div>
    );
  }

  const displayName = isSelf ? realProfile?.full_name || user?.firstName || "Athlete" : athlete.name;
  const displayHandle = isSelf
    ? realProfile?.username
      ? `@${realProfile.username}`
      : "Add a username"
    : athlete.handle;
  const displayHomeGym = isSelf ? realProfile?.home_gym || "Add your home gym" : athlete.homeGym;
  const displayInitials = isSelf ? getInitials({ firstName: displayName, email: user?.email }) : athlete.initials;

  const joinedChallenges = athlete.challengeIds
    .map((cid) => {
      const challenge = challenges.find((c) => c.id === cid);
      if (!challenge) return null;
      const entry = challenge.leaderboard.find((e) => e.initials === athlete.initials);
      return { challenge, entry };
    })
    .filter(Boolean);

  // Placement (1st/2nd/3rd) badges are deliberately not wired in here — deferred along with
  // community/competitive leaderboard challenges; see computePlacementBadges in
  // challengeBadges.js, which is kept but unused for now. Only completion + streak badges
  // are active for this individual-only pass.
  const challengeBadges = [
    ...computeCompletionBadges({ challenges, completedChallengeIds: athlete.completedChallengeIds }),
    ...computeStreakBadges(athlete.streaks),
  ];
  const allAchievements = [...athlete.achievements, ...challengeBadges];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <button onClick={() => router.back()} aria-label="Back" className="text-zinc-300 hover:text-white">
          <BackIcon />
        </button>
        <h1 className="truncate text-base font-bold text-white">{profileLoading ? "" : displayHandle}</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 pb-10">
        <div className="border-b border-border-subtle bg-surface px-4 pb-5 pt-6">
          <div className="flex items-start gap-4">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rival-red to-rival-red-dim text-2xl font-extrabold text-white">
              {profileLoading ? "" : displayInitials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-extrabold text-white">{profileLoading ? "Loading…" : displayName}</p>
              <p className="truncate text-sm text-zinc-500">{profileLoading ? "" : displayHandle}</p>
              <p className="mt-1 flex items-center gap-1 truncate text-xs text-zinc-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M6 21V9l6-5 6 5v12M10 21v-6h4v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {profileLoading ? "" : displayHomeGym}
              </p>
            </div>
            {isSelf && (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => router.push("/settings")}
                  aria-label="Edit profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-zinc-300 transition hover:bg-surface-raised hover:text-white"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={() => setShowReportIssue(true)}
                  aria-label="Report an issue"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-zinc-400 transition hover:bg-surface-raised hover:text-white"
                >
                  <FlagIcon />
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x divide-border-subtle rounded-xl border border-border-subtle">
            <div className="px-2 py-2.5 text-center">
              <p className="text-base font-extrabold text-white">{athlete.followers.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">Followers</p>
            </div>
            <div className="px-2 py-2.5 text-center">
              <p className="text-base font-extrabold text-white">{athlete.following.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">Following</p>
            </div>
            <div className="px-2 py-2.5 text-center">
              <p className="flex items-center justify-center gap-1 text-base font-extrabold text-white">
                {athlete.streak}
                <span aria-hidden>🔥</span>
              </p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">Day Streak</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {athlete.sportBadges.map((b) => (
              <span
                key={b.label}
                className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-black px-3 py-1.5 text-xs font-semibold text-zinc-200"
              >
                <span aria-hidden>{b.emoji}</span>
                {b.label}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border-subtle bg-black p-3">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">Total Workouts</p>
              <p className="mt-1 text-xl font-extrabold text-white">{athlete.stats.totalWorkouts}</p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-black p-3">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">Lifetime Miles</p>
              <p className="mt-1 text-xl font-extrabold text-white">
                {athlete.runningStats.lifetimeMiles.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-black p-3">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">PRs Broken</p>
              <p className="mt-1 text-xl font-extrabold text-white">{athlete.runningStats.totalPRsBroken}</p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-black p-3">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">PRs This Year</p>
              <p className="mt-1 text-xl font-extrabold text-white">{athlete.runningStats.prsBrokenThisYear}</p>
            </div>
          </div>

          {!isSelf && (
            <button
              onClick={() => setFollowing((v) => !v)}
              className={`mt-4 flex min-h-11 w-full items-center justify-center rounded-full text-sm font-extrabold tracking-wide transition ${
                following
                  ? "border border-rival-red text-rival-red hover:bg-rival-red/10"
                  : "bg-rival-red text-white hover:bg-red-600"
              }`}
            >
              {following ? "FOLLOWING" : "FOLLOW"}
            </button>
          )}
        </div>

        <div className="sticky top-[49px] z-20 flex border-b border-border-subtle bg-black/95 backdrop-blur">
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

        {activeTab === "Activity" && (
          <div>
            {athlete.posts.map((post) => (
              <ProfilePostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {activeTab === "Challenges" && (
          <div className="space-y-3 p-4">
            {joinedChallenges.length === 0 && (
              <p className="text-sm text-zinc-500">Not participating in any challenges yet.</p>
            )}
            {joinedChallenges.map(({ challenge, entry }) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className="block rounded-xl border border-border-subtle bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{challenge.title}</p>
                  <span className="rounded-full bg-rival-red/15 px-2 py-0.5 text-[10px] font-bold text-rival-red">
                    {challenge.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {entry
                    ? `Rank #${entry.rank} · ${entry.score.toLocaleString()} ${challenge.unit}`
                    : "Participating"}
                </p>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "Achievements" && (
          <div className="grid grid-cols-2 gap-3 p-4">
            {allAchievements.map((a) => (
              <div
                key={a.id}
                className={`rounded-xl border p-4 text-center ${
                  a.earned ? "border-rival-red/40 bg-rival-red/5" : "border-border-subtle bg-surface opacity-50"
                }`}
              >
                <BadgeIcon id={a.iconId ?? a.id} earned={a.earned} />
                <p className="mt-2 text-sm font-bold text-white">{a.title}</p>
                <p className="mt-1 text-[11px] text-zinc-500">{a.detail}</p>
                {a.kind === "tiered" && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {Array.from({ length: a.tierCount }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${i < a.tier ? "bg-rival-red" : "bg-zinc-700"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showReportIssue && <ReportIssueModal onClose={() => setShowReportIssue(false)} />}
    </div>
  );
}
