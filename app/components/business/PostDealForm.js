"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { useDeals } from "@/app/lib/DealsContext";
import { dealCategories } from "@/app/lib/exploreSeedData";
import ContentGuidelinesModal, { acknowledgeGuidelines, hasAcknowledgedGuidelines } from "@/app/components/explore/ContentGuidelinesModal";

const MAX_BYTES = 4 * 1024 * 1024;

const EMPTY = { title: "", category: "", discount: "", expiry: "", description: "" };

export default function PostDealForm() {
  const { user } = useAuth();
  const { addDeal } = useDeals();
  const [form, setForm] = useState(EMPTY);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [posted, setPosted] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid = form.title.trim() && form.category && form.discount.trim() && form.expiry.trim() && form.description.trim();

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
    addDeal(
      {
        title: form.title.trim(),
        category: form.category,
        discount: form.discount.trim(),
        expiry: form.expiry.trim(),
        description: form.description.trim(),
        businessName: user.businessName,
        businessEmail: user.email,
        location: `${user.city}, ${user.state}`,
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
        placeholder="Deal title"
        className="min-h-11 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        {dealCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setForm((f) => ({ ...f, category }))}
            className={`min-h-11 rounded-full border px-4 text-xs font-bold transition ${
              form.category === category
                ? "border-rival-red bg-rival-red/15 text-rival-red"
                : "border-border-subtle bg-black text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          value={form.discount}
          onChange={update("discount")}
          placeholder="Discount (e.g. 20% off)"
          className="min-h-11 rounded-xl border border-border-subtle bg-surface px-3 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
        />
        <input
          value={form.expiry}
          onChange={update("expiry")}
          placeholder="Expires (e.g. Sep 30, 2026)"
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
        POST DEAL
      </button>

      {posted && <p className="text-center text-xs font-semibold text-emerald-400">Deal posted ✓</p>}

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
