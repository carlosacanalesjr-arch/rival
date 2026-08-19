"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { useEvents } from "@/app/lib/EventsContext";
import { useDeals } from "@/app/lib/DealsContext";
import SegmentedControl from "@/app/components/explore/SegmentedControl";
import PostEventForm from "@/app/components/business/PostEventForm";
import PostDealForm from "@/app/components/business/PostDealForm";

const SEGMENTS = ["Post an Event", "Post a Deal"];

const STATUS_STYLE = {
  approved: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  reported: "border-rival-red/40 bg-rival-red/10 text-rival-red",
};

function MyPostsList({ title, items, labelKey }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface p-3">
            <p className="min-w-0 flex-1 truncate text-sm text-zinc-200">{item[labelKey]}</p>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLE[item.status] || STATUS_STYLE.approved}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BusinessDashboardScreen() {
  const { user } = useAuth();
  const { events } = useEvents();
  const { deals } = useDeals();
  const [segment, setSegment] = useState(SEGMENTS[0]);

  const myEvents = useMemo(() => events.filter((e) => e.postedByEmail === user.email), [events, user.email]);
  const myDeals = useMemo(() => deals.filter((d) => d.postedByEmail === user.email), [deals, user.email]);

  return (
    <div>
      <h1 className="text-xl font-extrabold text-white">Business Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-400">Post races, events, and deals for {user.businessName}.</p>

      <div className="mt-4">
        <SegmentedControl options={SEGMENTS} selected={segment} onSelect={setSegment} />
      </div>

      <div className="mt-4">{segment === "Post an Event" ? <PostEventForm /> : <PostDealForm />}</div>

      <MyPostsList title="Your events" items={myEvents} labelKey="title" />
      <MyPostsList title="Your deals" items={myDeals} labelKey="title" />
    </div>
  );
}
