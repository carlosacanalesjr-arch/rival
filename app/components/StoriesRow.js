"use client";

import { useState } from "react";
import { stories as initialStories } from "@/app/lib/mockData";

export default function StoriesRow() {
  const [stories, setStories] = useState(initialStories);

  const markViewed = (id) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, viewed: true } : s))
    );
  };

  return (
    <section
      aria-label="Stories"
      className="no-scrollbar flex gap-4 overflow-x-auto border-b border-border-subtle bg-black px-4 py-3"
    >
      {stories.map((s) => (
        <button
          key={s.id}
          onClick={() => markViewed(s.id)}
          className="flex w-16 shrink-0 flex-col items-center gap-1.5"
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full p-[2px] ${
              s.viewed
                ? "bg-zinc-700"
                : "bg-gradient-to-tr from-rival-red-dim via-rival-red to-orange-500"
            }`}
          >
            <span className="flex h-full w-full items-center justify-center rounded-full bg-black">
              {s.isSelf ? (
                <span className="relative flex h-[92%] w-[92%] items-center justify-center rounded-full bg-surface-raised text-sm font-bold text-white">
                  {s.initials}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-rival-red text-[11px] leading-none text-white">
                    +
                  </span>
                </span>
              ) : (
                <span className="flex h-[92%] w-[92%] items-center justify-center rounded-full bg-surface-raised text-sm font-bold text-white">
                  {s.initials}
                </span>
              )}
            </span>
          </span>
          <span className="w-full truncate text-center text-[11px] text-zinc-400">
            {s.isSelf ? "Your Story" : s.name}
          </span>
        </button>
      ))}
    </section>
  );
}
