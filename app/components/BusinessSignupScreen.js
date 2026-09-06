"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/app/components/AuthHeader";
import { useAuth } from "@/app/lib/AuthContext";
import { inputClass, Field, ChipGroup, PasswordField } from "@/app/components/authFormKit";

const BUSINESS_TYPES = ["Gym", "Box", "Studio", "Event Organizer", "Brand / Sponsor", "Other"];
const REQUIRED_FIELDS = ["businessName", "firstName", "lastName", "email", "password", "city", "state"];

export default function BusinessSignupScreen() {
  const router = useRouter();
  const { signUpBusiness } = useAuth();

  const [form, setForm] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    state: "",
    website: "",
  });
  const [businessType, setBusinessType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const requiredFilled = REQUIRED_FIELDS.every((key) => form[key].trim().length > 0);
  const isValid = requiredFilled && form.password.length >= 8 && Boolean(businessType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setError("");
    setSubmitting(true);
    try {
      await signUpBusiness({
        businessName: form.businessName.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        city: form.city.trim(),
        state: form.state.trim(),
        website: form.website.trim() || null,
        businessType,
      });
      router.push(`/verify-email?email=${encodeURIComponent(form.email.trim())}`);
    } catch (err) {
      setError(err.message || "Couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader showBack />
      <main className="mx-auto w-full max-w-md flex-1 px-6 pb-12">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-foreground">Create your business account</h2>
          <p className="mt-1 text-sm text-muted-2">List your gym, run events, and reach athletes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Business name">
            <input
              value={form.businessName}
              onChange={update("businessName")}
              placeholder="Iron Athletics Gym"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact first name">
              <input
                value={form.firstName}
                onChange={update("firstName")}
                placeholder="Jordan"
                autoComplete="given-name"
                className={inputClass}
              />
            </Field>
            <Field label="Contact last name">
              <input
                value={form.lastName}
                onChange={update("lastName")}
                placeholder="Blake"
                autoComplete="family-name"
                className={inputClass}
              />
            </Field>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input value={form.city} onChange={update("city")} placeholder="Austin" className={inputClass} />
            </Field>
            <Field label="State">
              <input value={form.state} onChange={update("state")} placeholder="TX" className={inputClass} />
            </Field>
          </div>

          <Field label="Business type">
            <ChipGroup options={BUSINESS_TYPES} value={businessType} onChange={setBusinessType} />
          </Field>

          <Field label="Website (optional)">
            <input
              value={form.website}
              onChange={update("website")}
              placeholder="https://yourgym.com"
              className={inputClass}
            />
          </Field>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white transition hover:bg-red-600 disabled:opacity-40"
          >
            {submitting ? "Creating account…" : "Create Business Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-2">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="font-semibold text-rival-red hover:text-red-400">
            Log in
          </button>
        </p>
      </main>
    </div>
  );
}
