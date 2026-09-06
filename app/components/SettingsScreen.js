"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";
import { supabase } from "@/app/lib/supabase";
import SportInterestsChecklist from "@/app/components/SportInterestsChecklist";
import { Field, ChipGroup } from "@/app/components/authFormKit";
import { PRIMARY_SPORT_OPTIONS, SKILL_LEVEL_OPTIONS } from "@/app/lib/sportOptions";

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selected, setSelected] = useState([]);
  const [primarySport, setPrimarySport] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.isBusiness) return;
    let cancelled = false;
    (async () => {
      const [{ data, error: fetchError }, { data: authData }] = await Promise.all([
        supabase.from("profiles").select("sport_interests").eq("id", user.id).single(),
        supabase.auth.getUser(),
      ]);
      if (cancelled) return;
      if (fetchError) {
        // TODO: non-blocking until the Supabase schema-cache bug (profiles.sport_interests
        // not recognized by PostgREST — see open support ticket) is resolved. Re-enable
        // strict error handling (surface as a blocking error) once that's fixed.
        console.error("Failed to load sport_interests:", fetchError);
        setWarning("Couldn't load your saved sport interests right now.");
        setSelected([]);
      } else {
        setSelected(data?.sport_interests || []);
      }
      setPrimarySport(authData?.user?.user_metadata?.primarySport || "");
      setSkillLevel(authData?.user?.user_metadata?.skillLevel || "");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSave = async () => {
    setError("");
    setWarning("");
    setSaved(false);
    setSaving(true);
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { primarySport, skillLevel },
    });
    // TODO: sport_interests save is non-blocking until the Supabase schema-cache bug
    // (profiles.sport_interests not recognized by PostgREST — see open support ticket)
    // is resolved. Re-enable strict error handling (block on failure, show red error)
    // once that's fixed.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ sport_interests: selected })
      .eq("id", user.id);
    if (updateError) {
      console.error("Failed to save sport_interests:", updateError);
      setWarning("Sport interests couldn't be saved right now, but your other changes were.");
    }
    if (metadataError) {
      setError(metadataError.message || "Couldn't save your primary sport / skill level. Please try again.");
    } else {
      setSaved(true);
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-background/90 px-4 py-3 backdrop-blur">
        <button onClick={() => router.back()} aria-label="Back" className="text-foreground-secondary hover:text-foreground">
          <BackIcon />
        </button>
        <h1 className="text-base font-bold text-foreground">Settings</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-6">
        {!user ? (
          <p className="text-sm text-muted-2">You need to be logged in to view settings.</p>
        ) : user.isBusiness ? (
          <p className="text-sm text-muted-2">There&apos;s nothing to configure here yet for business accounts.</p>
        ) : loading ? (
          <p className="text-sm text-muted-2">Loading…</p>
        ) : (
          <section>
            <h2 className="text-lg font-extrabold text-foreground">Sport Profile</h2>
            <p className="mt-1 text-sm text-muted-2">Your primary sport and skill level.</p>

            <div className="mt-4 space-y-4">
              <Field label="Primary sport">
                <ChipGroup options={PRIMARY_SPORT_OPTIONS} value={primarySport} onChange={setPrimarySport} />
              </Field>
              <Field label="Skill level">
                <ChipGroup options={SKILL_LEVEL_OPTIONS} value={skillLevel} onChange={setSkillLevel} />
              </Field>
            </div>

            <h2 className="mt-8 text-lg font-extrabold text-foreground">Sport Interests</h2>
            <p className="mt-1 text-sm text-muted-2">
              Choose the sports you care about so we can show you relevant deals and content.
            </p>

            <div className="mt-4">
              <SportInterestsChecklist value={selected} onChange={setSelected} />
            </div>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            {warning && <p className="mt-3 text-sm text-amber-400">{warning}</p>}
            {saved && <p className="mt-3 text-sm text-emerald-400">Saved.</p>}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="mt-5 w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white transition hover:bg-red-600 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
