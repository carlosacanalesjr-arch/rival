"use client";

import ImageSlot from "@/app/components/ImageSlot";

// Rhombus mask — applied twice (outer frame + inner clip) so the frame color still reads
// as a diamond-shaped ring around the image/placeholder rather than a rectangle showing
// through the corners.
const DIAMOND_CLIP = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";

// Distinct, Garmin-Connect-style diamond badge icon shared by every Achievements card
// (distance milestones, tiered program badges, and the PR Breaker/Mileage stat cards).
// The image itself is a shared per-badge-type asset (keyed by badge id, same for every
// athlete) via the same ImageSlot/MediaContext pattern used for program hero banners and
// exercise thumbnails — trainers can set artwork per badge, athletes just see the result.
export default function BadgeIcon({ id, earned }) {
  return (
    <div
      className={`relative mx-auto h-16 w-16 shrink-0 p-1 ${
        earned ? "bg-gradient-to-br from-rival-red to-rival-red-dim" : "bg-surface-raised"
      }`}
      style={{ clipPath: DIAMOND_CLIP }}
    >
      <div className="relative h-full w-full overflow-hidden" style={{ clipPath: DIAMOND_CLIP }}>
        <ImageSlot mediaKey={`badge-${id}`} alt="" showLabel={false} compact className="h-full w-full" />
      </div>
    </div>
  );
}
