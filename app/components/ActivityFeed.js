"use client";

import { useState } from "react";
import Link from "next/link";
import { feedPosts } from "@/app/lib/mockData";

const typeStyles = {
  Run: "bg-rival-red/15 text-rival-red",
  Strength: "bg-orange-500/15 text-orange-400",
  Ride: "bg-sky-500/15 text-sky-400",
};

function WorkoutPost({ post }) {
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
    setComments((prev) => [
      ...prev,
      { id: `local-${prev.length}-${text.slice(0, 4)}`, user: "You", text },
    ]);
    setDraft("");
  };

  return (
    <article className="border-b border-border-subtle bg-black px-4 py-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/profile/${post.user.athleteId}`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rival-red to-rival-red-dim text-xs font-bold text-white">
            {post.user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {post.user.name}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {post.user.handle} · {post.time}
            </p>
          </div>
        </Link>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            typeStyles[post.type] ?? "bg-zinc-800 text-zinc-300"
          }`}
        >
          {post.type}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-white">{post.title}</p>
      <p className="mt-1 text-sm text-zinc-400">{post.caption}</p>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-border-subtle bg-surface p-3">
        {post.stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-extrabold text-white">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-5">
        <button
          onClick={toggleLike}
          aria-pressed={liked}
          className="flex items-center gap-1.5 text-sm font-medium"
        >
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
          <span className={liked ? "text-rival-red" : "text-zinc-400"}>
            {likes}
          </span>
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-400"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {comments.length}
        </button>

        <button
          className="ml-auto text-zinc-400 hover:text-white"
          aria-label="Share workout"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m22 2-7 20-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-2 border-t border-border-subtle pt-3">
          {comments.length === 0 && (
            <p className="text-xs text-zinc-500">No comments yet. Be the first.</p>
          )}
          {comments.map((c) => (
            <p key={c.id} className="text-sm text-zinc-300">
              <span className="font-semibold text-white">{c.user}</span>{" "}
              {c.text}
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

export default function ActivityFeed() {
  return (
    <section className="mt-6">
      <h2 className="px-4 text-base font-bold text-white">Activity</h2>
      <div className="mt-3">
        {feedPosts.map((post) => (
          <WorkoutPost key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
