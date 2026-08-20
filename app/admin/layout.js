"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isTrainer = Boolean(user?.isTrainer);

  // useAuth's getServerSnapshot is always null (auth is client-only, localStorage-backed),
  // so a fresh full page load briefly renders with user=null before React corrects to the
  // real client value. Without this guard, that transient null reads as "not a trainer" and
  // fires the redirect before the correction lands. Deferring via setTimeout (rather than
  // setting state directly in the effect body) pushes past the current commit's synchronous
  // work into a new macrotask, so any same-tick correction has already landed by the time
  // this flips true — only a genuinely non-trainer user gets redirected.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setHasMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (hasMounted && !isTrainer) router.replace("/");
  }, [hasMounted, isTrainer, router]);

  if (!hasMounted || !isTrainer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-sm text-zinc-500">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <Link href="/admin" className="text-sm font-extrabold text-white">
          Admin <span className="text-rival-red">·</span> Kairos
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="/admin"
            className={`text-xs font-semibold ${pathname === "/admin" ? "text-white" : "text-zinc-400 hover:text-white"}`}
          >
            Programs
          </Link>
          <Link
            href="/admin/reports"
            className={`text-xs font-semibold ${pathname === "/admin/reports" ? "text-white" : "text-zinc-400 hover:text-white"}`}
          >
            Reports
          </Link>
          <Link href="/" className="text-xs font-semibold text-zinc-400 hover:text-white">
            Back to app
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">{children}</main>
    </div>
  );
}
