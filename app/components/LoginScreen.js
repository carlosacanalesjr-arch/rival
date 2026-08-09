"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/app/components/AuthHeader";
import { useAuth } from "@/app/lib/AuthContext";
import { inputClass, Field, PasswordField } from "@/app/components/authFormKit";

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.02-1.26 2.83-.9.87-1.98 1.36-3.02 1.27-.12-1.09.42-2.24 1.24-3.02.87-.83 2.06-1.35 3.04-1.08zM20.6 17.2c-.5 1.15-.74 1.66-1.38 2.68-.9 1.44-2.16 3.23-3.73 3.24-1.4.02-1.76-.9-3.66-.9-1.9 0-2.3.88-3.7.92-1.55.05-2.74-1.55-3.65-2.98-1.98-3.06-3.5-8.66-1.46-12.44 1.02-1.87 2.83-3.05 4.8-3.08 1.5-.02 2.9.98 3.66.98.75 0 2.42-1.21 4.08-1.03.7.03 2.65.28 3.9 2.1-.1.06-2.33 1.32-2.3 3.95.02 3.13 2.85 4.18 2.88 4.19-.02.08-.44 1.48-1.44 2.96z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.48-1.13 2.73-2.4 3.57v2.96h3.88c2.27-2.09 3.57-5.17 3.57-8.72z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-2.96c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.05C3.25 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.32A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.58.38-2.32V6.63H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.37l4-3.05z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.63l4 3.05C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { logIn, logInWithProvider } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    logIn({ email: email.trim(), password });
    router.push("/");
  };

  const handleProvider = (provider) => {
    logInWithProvider(provider);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <AuthHeader showBack />
      <main className="mx-auto w-full max-w-md flex-1 px-6 pb-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-zinc-500">Log in to keep the streak going.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white transition hover:bg-red-600 disabled:opacity-40"
          >
            Log In
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border-subtle" />
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">or continue with</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleProvider("apple")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            <AppleIcon />
            Sign in with Apple
          </button>
          <button
            onClick={() => handleProvider("google")}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border-subtle bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <button onClick={() => router.push("/welcome")} className="font-semibold text-rival-red hover:text-red-400">
            Sign up
          </button>
        </p>
      </main>
    </div>
  );
}
