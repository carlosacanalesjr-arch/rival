"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";

// Mirrors app/admin/layout.js exactly (same hasMounted-delay guard against the
// null-before-hydration flash, same redirect-away pattern) — just gated on isBusiness
// instead of isTrainer.
export default function BusinessLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const isBusiness = Boolean(user?.isBusiness);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setHasMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (hasMounted && !isBusiness) router.replace("/");
  }, [hasMounted, isBusiness, router]);

  if (!hasMounted || !isBusiness) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-sm text-zinc-500">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <Link href="/business" className="text-sm font-extrabold text-white">
          Business <span className="text-rival-red">·</span> Kairos
        </Link>
        <Link href="/" className="ml-auto text-xs font-semibold text-zinc-400 hover:text-white">
          Back to app
        </Link>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">{children}</main>
    </div>
  );
}
