"use client";

import { useRouter } from "next/navigation";

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AuthHeader({ showBack = false, onBack }) {
  const router = useRouter();

  return (
    <header className="relative flex items-center justify-center px-4 py-4">
      {showBack && (
        <button
          onClick={onBack ?? (() => router.back())}
          aria-label="Back"
          className="absolute left-4 text-zinc-300 hover:text-white"
        >
          <BackIcon />
        </button>
      )}
      <h1 className="text-xl font-extrabold tracking-tight text-white">
        KAIROS<span className="text-rival-red">.</span>
      </h1>
    </header>
  );
}
