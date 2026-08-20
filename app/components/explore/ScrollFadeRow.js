"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_STEP = 150;

function ChevronRightIcon() {
  // Same right-chevron path as TrainingFlow.js's week-navigation button.
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  // Same left-chevron path used for every "back" button across the app.
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Wraps a horizontally-scrollable chip row with the edge-fade mask (fades relative to the
// container's own box, so it's correct at any scroll position with no JS — see the inline
// style below) plus supplementary tap-to-scroll chevrons for people who don't realize the
// row swipes. The chevrons are the only part that needs scroll-position awareness (to hide
// once there's nothing more to reveal in that direction); the fade itself stays pure CSS.
export default function ScrollFadeRow({ children }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // -1px epsilon so sub-pixel rounding at either true end doesn't leave a chevron stuck on.
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="no-scrollbar flex gap-2 overflow-x-auto"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)",
        }}
      >
        {children}
      </div>

      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll filters left"
          className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white shadow-lg transition hover:bg-black">
            <ChevronLeftIcon />
          </span>
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll filters right"
          className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white shadow-lg transition hover:bg-black">
            <ChevronRightIcon />
          </span>
        </button>
      )}
    </div>
  );
}
