"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeader from "@/app/components/AuthHeader";
import { supabase } from "@/app/lib/supabase";
import { inputClass, Field } from "@/app/components/authFormKit";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const isValid = email.length > 0 && /^\d{8}$/.test(code);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setError("");
    setResendMessage("");
    setSubmitting(true);
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });
      if (verifyError) throw verifyError;
      const accountType = data?.user?.user_metadata?.accountType || "athlete";
      router.push(accountType === "athlete" ? "/select-sports" : "/");
    } catch (err) {
      setError(err.message || "That code is invalid or has expired.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || resending) return;
    setError("");
    setResendMessage("");
    setResending(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (resendError) throw resendError;
      setResendMessage("A new code is on its way.");
    } catch (err) {
      setError(err.message || "Couldn't resend the code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader showBack />
      <main className="mx-auto w-full max-w-md flex-1 px-6 pb-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-foreground">Check your email</h2>
          <p className="mt-1 text-sm text-muted-2">
            {email ? (
              <>
                Enter the 8-digit code we sent to <span className="text-foreground-secondary">{email}</span>.
              </>
            ) : (
              "Enter the 8-digit code we emailed you."
            )}
          </p>
        </div>

        {!email && (
          <p className="mb-4 text-center text-sm text-red-500">
            We couldn&apos;t tell which email to verify. Please sign up again.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Confirmation code">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              placeholder="12345678"
              className={`${inputClass} text-center text-lg tracking-[0.35em]`}
            />
          </Field>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {resendMessage && <p className="text-sm text-muted">{resendMessage}</p>}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white transition hover:bg-red-600 disabled:opacity-40"
          >
            {submitting ? "Verifying…" : "Verify"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-2">
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!email || resending}
            className="font-semibold text-rival-red hover:text-red-400 disabled:opacity-40"
          >
            {resending ? "Resending…" : "Resend code"}
          </button>
        </p>
      </main>
    </div>
  );
}
