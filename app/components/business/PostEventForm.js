"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { useEvents } from "@/app/lib/EventsContext";
import { eventTypes } from "@/app/lib/exploreSeedData";
import ContentGuidelinesModal, { acknowledgeGuidelines, hasAcknowledgedGuidelines } from "@/app/components/explore/ContentGuidelinesModal";

const MAX_BYTES = 4 * 1024 * 1024;

const EMPTY = { title: "", type: "", date: "", location: "", description: "", registrationLink: "" };

export default function PostEventForm() {
  const { user } = useAuth();
  const { addEvent } = useEvents();
  const [form, setForm] = useState(EMPTY);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [posted, setPosted] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid =
    form.title.trim() && form.type && form.date.trim() && form.location.trim() && form.description.trim() && form.registrationLink.trim();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setImageError("Image is too large (max 4MB).");
      return;
    }
    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const doSubmit = () => {
    addEvent(
      {
        title: form.title.trim(),
        type: form.type,
        date: form.date.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        registrationLink: form.registrationLink.trim(),
        hostName: user.businessName,
        hostEmail: user.email,
        imageUrl,
      },
      user.email
    );
    setForm(EMPTY);
    setImageUrl(null);
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    if (!hasAcknowledgedGuidelines(user.email)) {
      setShowGuidelines(true);
      return;
    }
    doSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={form.title}
        onChange={update("title")}
        placeholder="Event name"
        className="min-h-11 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setForm((f) => ({ ...f, type }))}
            className={`min-h-11 rounded-full border px-4 text-xs font-bold transition ${
              form.type === type
                ? "border-rival-red bg-rival-red/15 text-rival-red"
                : "border-border-subtle bg-black text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          value={form.date}
          onChange={update("date")}
          placeholder="Date (e.g. Oct 18, 2026)"
          className="min-h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
        />
        <input
          value={form.location}
          onChange={update("location")}
          placeholder="Location"
          className="min-h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
        />
      </div>

      <textarea
        value={form.description}
        onChange={update("description")}
        placeholder="Description"
        rows={3}
        className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
      />

      <input
        value={form.registrationLink}
        onChange={update("registrationLink")}
        placeholder="Registration link (https://…)"
        className="min-h-11 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
      />

      <div>
        <label className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-surface text-xs font-semibold text-zinc-400 hover:border-zinc-500">
          {imageUrl ? "Image selected — tap to replace" : "Add a thumbnail image (optional)"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {imageError && <p className="mt-1 text-xs text-rival-red">{imageError}</p>}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="min-h-11 w-full rounded-full bg-rival-red text-sm font-extrabold tracking-wide text-white disabled:opacity-40"
      >
        POST EVENT
      </button>

      {posted && <p className="text-center text-xs font-semibold text-emerald-400">Event posted ✓</p>}

      {showGuidelines && (
        <ContentGuidelinesModal
          onCancel={() => setShowGuidelines(false)}
          onAgree={() => {
            acknowledgeGuidelines(user.email);
            setShowGuidelines(false);
            doSubmit();
          }}
        />
      )}
    </form>
  );
}
