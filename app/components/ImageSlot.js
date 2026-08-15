"use client";

import { useRef, useState } from "react";
import { useMedia } from "@/app/lib/MediaContext";

// ~4MB raw file size guard — data URLs inflate ~33% on top of that, and localStorage
// (the only persistence available in this all-client-side app) tops out around 5-10MB.
const MAX_BYTES = 4 * 1024 * 1024;

function ImageIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Reusable placeholder / upload slot backed by MediaContext. Renders a dashed "Add image"
// box when empty, or the stored image with replace/remove controls once one is set. Used
// for program hero banners, day thumbnails, and exercise thumbnails — callers control
// exact sizing/rounding via `className` on the outer wrapper.
export default function ImageSlot({
  mediaKey,
  alt = "",
  label = "Add image",
  showLabel = true,
  compact = false,
  className = "",
}) {
  const { imageUrl, setImage, removeImage } = useMedia(mediaKey);
  const inputRef = useRef(null);
  const [error, setError] = useState(null);

  const openPicker = () => inputRef.current?.click();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(compact ? null : "Choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(compact ? null : "Image is too large (max 4MB).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {imageUrl ? (
        <>
          <button
            type="button"
            onClick={openPicker}
            aria-label="Replace image"
            className="block h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- runtime data URLs, not static assets */}
            <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
          </button>
          {!compact && (
            <button
              type="button"
              onClick={openPicker}
              aria-label="Replace image"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
            >
              <PencilIcon />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeImage();
            }}
            aria-label="Remove image"
            className={`absolute flex items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black ${
              compact ? "right-1 top-1 h-4 w-4" : "right-1.5 top-9 h-6 w-6"
            }`}
          >
            <XIcon />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          aria-label={label}
          className="flex h-full w-full flex-col items-center justify-center gap-1 border border-dashed border-zinc-700 bg-surface-raised text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-300"
        >
          <ImageIcon size={compact ? 15 : 20} />
          {showLabel && <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>}
        </button>
      )}

      {error && (
        <p className="absolute inset-x-0 bottom-0 bg-black/80 px-1 py-0.5 text-center text-[9px] text-rival-red">
          {error}
        </p>
      )}
    </div>
  );
}
