"use client";

import { useState } from "react";

const items = [
  {
    key: "home",
    label: "Home",
    icon: (
      <path d="M3 11.5 12 4l9 7.5M5 10v9.5a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    key: "explore",
    label: "Explore",
    icon: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-13.5-2 5.5-5.5 2 2-5.5 5.5-2Z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    key: "challenges",
    label: "Challenges",
    icon: <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    key: "board",
    label: "Board",
    icon: <path d="M4 21V10M12 21V3M20 21v-7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export default function BottomNav() {
  const [active, setActive] = useState("home");

  return (
    <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-border-subtle bg-black/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isActive ? "#ff1f3d" : "#7a7a7a"}
              strokeWidth="2"
            >
              {item.icon}
            </svg>
            <span
              className={`text-[10px] font-medium ${
                isActive ? "text-rival-red" : "text-zinc-500"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
