"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";

// Backed by /api/reports (Upstash Redis via app/lib/kv.js) instead of localStorage, since
// admin reports need to be visible across every device/browser a report was submitted from —
// see app/lib/kv.js and the two route handlers for the actual storage. No Context/Provider is
// needed here anymore: submitReport is a plain function usable from anywhere (submitting a
// report never required being an admin), and useReports is a self-contained hook used only by
// AdminReportsList, which is already gated behind the trainer-only /admin route.
export async function submitReport(data) {
  try {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`submitReport failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    // Best-effort — every call site fires this alongside a local UI update (report modal
    // closing, "submitted" message) that shouldn't block or fail just because the network did.
    console.error(err);
    return null;
  }
}

export function useReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;

    fetch("/api/reports", { headers: { "x-user-email": user.email } })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled) return;
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const markReviewed = async (id) => {
    if (!user?.email) return;
    // Optimistic — the admin queue should feel instant, and the PATCH below confirms it server-side.
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, reviewed: true } : r)));
    try {
      await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "x-user-email": user.email },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return { reports, loading, markReviewed };
}
