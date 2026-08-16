"use client";

import { useState } from "react";
import { useMedia } from "@/app/lib/MediaContext";
import { useAuth } from "@/app/lib/AuthContext";

function VideoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="15" height="14" rx="2" />
      <path d="m22 8-5 4 5 4V8Z" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Small inline "add a video link" affordance for exercises, backed by MediaContext under
// the same key as the exercise's ImageSlot (an entry can hold both an imageUrl and a
// videoUrl — some exercises may only need one or the other). Adding/editing/removing the
// link is trainer-only; athletes can watch an existing link but not change it.
export default function VideoLinkField({ mediaKey }) {
  const { videoUrl, setVideoUrl, removeVideoUrl } = useMedia(mediaKey);
  const { user } = useAuth();
  const isTrainer = Boolean(user?.isTrainer);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEdit = () => {
    setDraft(videoUrl || "");
    setEditing(true);
  };

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed) setVideoUrl(trimmed);
    else removeVideoUrl();
    setEditing(false);
  };

  if (editing && isTrainer) {
    return (
      <div className="mt-1 flex items-center gap-1.5">
        <input
          type="url"
          inputMode="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          placeholder="Paste video URL"
          autoFocus
          className="min-w-0 flex-1 rounded-lg border border-border-subtle bg-black px-2 py-1 text-[11px] text-zinc-200 outline-none focus:border-rival-red"
        />
        <button type="button" onClick={save} className="shrink-0 text-[11px] font-bold text-rival-red">
          Save
        </button>
      </div>
    );
  }

  if (videoUrl) {
    return (
      <div className="mt-1 flex items-center gap-2.5">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-semibold text-rival-red"
        >
          <VideoIcon /> Watch video
        </a>
        {isTrainer && (
          <>
            <button type="button" onClick={startEdit} className="text-[10px] text-zinc-500 hover:text-zinc-300">
              Edit
            </button>
            <button
              type="button"
              onClick={removeVideoUrl}
              className="text-[10px] text-zinc-500 hover:text-zinc-300"
            >
              Remove
            </button>
          </>
        )}
      </div>
    );
  }

  if (!isTrainer) return null;

  return (
    <button
      type="button"
      onClick={startEdit}
      className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-300"
    >
      <LinkIcon /> Add video link
    </button>
  );
}
