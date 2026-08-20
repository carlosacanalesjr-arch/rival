"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/TopBar";
import BottomNav from "@/app/components/BottomNav";
import SegmentedControl from "@/app/components/explore/SegmentedControl";
import EventCard from "@/app/components/explore/EventCard";
import DealCard from "@/app/components/explore/DealCard";
import EventsFilterBar from "@/app/components/explore/EventsFilterBar";
import DealsFilterBar from "@/app/components/explore/DealsFilterBar";
import { useAuth } from "@/app/lib/AuthContext";
import { useEvents } from "@/app/lib/EventsContext";
import { useDeals } from "@/app/lib/DealsContext";
import { submitReport } from "@/app/lib/ReportsContext";

const SEGMENTS = ["Races & Events", "Deals"];

function matchesDateRange(dateStr, fromStr, toStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return true;
  if (fromStr && date < new Date(fromStr)) return false;
  if (toStr && date > new Date(toStr)) return false;
  return true;
}

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { events, reportEvent, isEventHidden } = useEvents();
  const { deals, reportDeal, isDealHidden } = useDeals();

  const [segment, setSegment] = useState(SEGMENTS[0]);
  const [eventFilters, setEventFilters] = useState({ type: "All", location: "", dateFrom: "", dateTo: "" });
  const [dealFilters, setDealFilters] = useState({ category: "All", location: "" });

  // "Normal browsing" excludes anything reported (hidden pending review, per Apple guideline
  // 1.2) and anything this athlete has personally marked "Not interested" in.
  const visibleEvents = useMemo(
    () =>
      events.filter((e) => {
        if (e.status === "reported") return false;
        if (isEventHidden(e.id, user?.email)) return false;
        if (eventFilters.type !== "All" && e.type !== eventFilters.type) return false;
        if (eventFilters.location && !e.location.toLowerCase().includes(eventFilters.location.toLowerCase())) return false;
        if (!matchesDateRange(e.date, eventFilters.dateFrom, eventFilters.dateTo)) return false;
        return true;
      }),
    [events, eventFilters, isEventHidden, user?.email]
  );

  const visibleDeals = useMemo(
    () =>
      deals.filter((d) => {
        if (d.status === "reported") return false;
        if (isDealHidden(d.id, user?.email)) return false;
        if (dealFilters.category !== "All" && d.category !== dealFilters.category) return false;
        if (dealFilters.location && !d.location.toLowerCase().includes(dealFilters.location.toLowerCase())) return false;
        return true;
      }),
    [deals, dealFilters, isDealHidden, user?.email]
  );

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-black">
      <TopBar />

      <main className="mx-auto w-full max-w-md flex-1 pb-24">
        <div className="px-4 pt-5">
          <h1 className="text-xl font-extrabold text-white">Explore</h1>
          <p className="mt-1 text-sm text-zinc-400">Races, events, and deals from the community.</p>
        </div>

        <div className="px-4 pt-4">
          <SegmentedControl options={SEGMENTS} selected={segment} onSelect={setSegment} />
        </div>

        {segment === "Races & Events" ? (
          <>
            <div className="mt-4">
              <EventsFilterBar filters={eventFilters} onChange={setEventFilters} />
            </div>
            <div className="space-y-3 px-4">
              {visibleEvents.length === 0 ? (
                <p className="mt-6 text-center text-sm text-zinc-500">No events match those filters.</p>
              ) : (
                visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onOpen={(id) => router.push(`/explore/events/${id}`)}
                    onReport={(id, reason, note) => {
                      reportEvent(id, reason, note);
                      submitReport({
                        kind: "event",
                        itemId: id,
                        itemLabel: event.title,
                        reason,
                        details: note || null,
                        reporterEmail: user?.email || null,
                      });
                    }}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mt-4">
              <DealsFilterBar filters={dealFilters} onChange={setDealFilters} />
            </div>
            <div className="space-y-3 px-4">
              {visibleDeals.length === 0 ? (
                <p className="mt-6 text-center text-sm text-zinc-500">No deals match those filters.</p>
              ) : (
                visibleDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onOpen={(id) => router.push(`/explore/deals/${id}`)}
                    onReport={(id, reason, note) => {
                      reportDeal(id, reason, note);
                      submitReport({
                        kind: "deal",
                        itemId: id,
                        itemLabel: deal.title,
                        reason,
                        details: note || null,
                        reporterEmail: user?.email || null,
                      });
                    }}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
