"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";

export default function AdminLayout({ children }) {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isTrainer = Boolean(user?.isTrainer);

  // `initializing` tracks the real supabase.auth.getSession() round trip (see
  // AuthContext.js) rather than guessing at how long client hydration takes — a hard page
  // load or refresh on an /admin/* URL needs to actually wait for that session check before
  // it's safe to conclude "not a trainer" and redirect, since until it resolves `user` is
  // indistinguishable from a genuinely logged-out visitor.
  useEffect(() => {
    if (!initializing && !isTrainer) router.replace("/");
  }, [initializing, isTrainer, router]);

  if (initializing || !isTrainer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-2">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-background/90 px-4 py-3 backdrop-blur">
        <Link href="/admin" className="text-sm font-extrabold text-foreground">
          Admin <span className="text-rival-red">·</span> Kairos
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="/admin"
            className={`text-xs font-semibold ${pathname === "/admin" ? "text-foreground" : "text-muted hover:text-foreground"}`}
          >
            Programs
          </Link>
          <Link
            href="/admin/reports"
            className={`text-xs font-semibold ${pathname === "/admin/reports" ? "text-foreground" : "text-muted hover:text-foreground"}`}
          >
            Reports
          </Link>
          <Link href="/" className="text-xs font-semibold text-muted hover:text-foreground">
            Back to app
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">{children}</main>
    </div>
  );
}
