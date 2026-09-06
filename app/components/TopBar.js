"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";
import { getInitials } from "@/app/lib/initials";

function AdminIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M12 3 4 6v6c0 4.5 3.2 7.5 8 9 4.8-1.5 8-4.5 8-9V6l-8-3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9.5 12 2 2 3.5-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BusinessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M5 21V7l7-4 7 4v14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6M9 10h.01M15 10h.01M9 14h.01M15 14h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TopBar() {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const isTrainer = Boolean(user?.isTrainer);
  const isBusiness = Boolean(user?.isBusiness);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await logOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border-subtle bg-background/90 px-4 py-3 backdrop-blur">
      <h1 className="text-xl font-extrabold tracking-tight">
        <Link href="/" className="text-foreground">
          KAIROS<span className="text-rival-red">.</span>
        </Link>
      </h1>
      <div className="flex items-center gap-4">
        {isTrainer && (
          <Link
            href="/admin"
            aria-label="Admin"
            className="-my-1.5 flex h-11 w-11 items-center justify-center text-foreground-secondary hover:text-foreground"
          >
            <AdminIcon />
          </Link>
        )}
        {isBusiness && (
          <Link
            href="/business"
            aria-label="Business dashboard"
            className="-my-1.5 flex h-11 w-11 items-center justify-center text-foreground-secondary hover:text-foreground"
          >
            <BusinessIcon />
          </Link>
        )}
        <button
          aria-label="Notifications"
          className="relative text-foreground-secondary hover:text-foreground"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rival-red" />
        </button>
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rival-red to-rival-red-dim text-xs font-bold text-white"
            >
              {getInitials(user)}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-lg">
                <Link
                  href="/profile/you"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-foreground-secondary hover:bg-black/40"
                >
                  View Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2.5 text-left text-sm text-rival-red hover:bg-black/40"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-border-subtle px-3.5 py-1.5 text-xs font-semibold text-foreground-secondary hover:border-border-strong hover:text-foreground"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
