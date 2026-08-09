import Link from "next/link";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
      <h1 className="text-xl font-extrabold tracking-tight text-white">
        RIVAL<span className="text-rival-red">.</span>
      </h1>
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative text-zinc-300 hover:text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rival-red" />
        </button>
        <Link
          href="/profile/you"
          aria-label="Your profile"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rival-red to-rival-red-dim text-xs font-bold text-white"
        >
          YO
        </Link>
      </div>
    </header>
  );
}
