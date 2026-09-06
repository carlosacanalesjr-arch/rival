"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/app/components/AuthHeader";
import { supabase } from "@/app/lib/supabase";
import SportInterestsChecklist from "@/app/components/SportInterestsChecklist";

export default function SelectSportsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValid = selected.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setError("");
    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You need to be logged in to continue.");
      setSubmitting(false);
      return;
    }
    // TODO: sport_interests save is non-blocking until the Supabase schema-cache bug
    // (profiles.sport_interests not recognized by PostgREST — see open support ticket)
    // is resolved. Re-enable strict error handling (block Continue, show red error)
    // once that's fixed.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ sport_interests: selected })
      .eq("id", user.id);
    if (updateError) {
      console.error("Failed to save sport_interests:", updateError);
    }
    setSubmitting(false);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-6 pb-12">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-foreground">Select your sports</h2>
          <p className="mt-1 text-sm text-muted-2">
            Pick what you&apos;re into so we can show you relevant deals and content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <SportInterestsChecklist value={selected} onChange={setSelected} />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white transition hover:bg-red-600 disabled:opacity-40"
          >
            {submitting ? "Saving…" : "Continue"}
          </button>
        </form>
      </main>
    </div>
  );
}
