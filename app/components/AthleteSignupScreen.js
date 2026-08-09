"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/app/components/AuthHeader";
import { useAuth } from "@/app/lib/AuthContext";
import { inputClass, Field, ChipGroup, PasswordField } from "@/app/components/authFormKit";

const SPORTS = ["HYROX", "DEKA", "Running", "Strength & Conditioning", "CrossFit", "Weightlifting"];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Elite"];
const REQUIRED_FIELDS = ["firstName", "lastName", "username", "email", "password", "dob", "city", "state"];

export default function AthleteSignupScreen() {
  const router = useRouter();
  const { signUpAthlete } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    dob: "",
    city: "",
    state: "",
    homeGym: "",
  });
  const [sport, setSport] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const requiredFilled = REQUIRED_FIELDS.every((key) => form[key].trim().length > 0);
  const isValid = requiredFilled && form.password.length >= 8 && Boolean(sport) && Boolean(skillLevel);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    signUpAthlete({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      dob: form.dob,
      city: form.city.trim(),
      state: form.state.trim(),
      homeGym: form.homeGym.trim() || null,
      primarySport: sport,
      skillLevel,
    });
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <AuthHeader showBack />
      <main className="mx-auto w-full max-w-md flex-1 px-6 pb-12">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-white">Create your athlete account</h2>
          <p className="mt-1 text-sm text-zinc-500">Set up your profile and start competing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <input
                value={form.firstName}
                onChange={update("firstName")}
                placeholder="Alex"
                autoComplete="given-name"
                className={inputClass}
              />
            </Field>
            <Field label="Last name">
              <input
                value={form.lastName}
                onChange={update("lastName")}
                placeholder="Rivera"
                autoComplete="family-name"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Username">
            <input
              value={form.username}
              onChange={update("username")}
              placeholder="alexrivera"
              autoComplete="username"
              className={inputClass}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          <PasswordField
            value={form.password}
            onChange={update("password")}
            showPassword={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />

          <Field label="Date of birth">
            <input type="date" value={form.dob} onChange={update("dob")} className={inputClass} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input value={form.city} onChange={update("city")} placeholder="Austin" className={inputClass} />
            </Field>
            <Field label="State">
              <input value={form.state} onChange={update("state")} placeholder="TX" className={inputClass} />
            </Field>
          </div>

          <Field label="Primary sport">
            <ChipGroup options={SPORTS} value={sport} onChange={setSport} />
          </Field>

          <Field label="Skill level">
            <ChipGroup options={SKILL_LEVELS} value={skillLevel} onChange={setSkillLevel} />
          </Field>

          <Field label="Home gym (optional)">
            <input
              value={form.homeGym}
              onChange={update("homeGym")}
              placeholder="e.g. CrossFit Downtown"
              className={inputClass}
            />
          </Field>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white transition hover:bg-red-600 disabled:opacity-40"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="font-semibold text-rival-red hover:text-red-400">
            Log in
          </button>
        </p>
      </main>
    </div>
  );
}
