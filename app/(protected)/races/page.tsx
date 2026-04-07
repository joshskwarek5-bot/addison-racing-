"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Flag, Plus } from "lucide-react";
import Link from "next/link";
import { RaceCard } from "@/components/race-card";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin-nav";

type FilterStatus = "all" | "upcoming" | "completed" | "cancelled";

function RacesContent() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const races = useQuery(api.races.list) ?? [];

  const filtered = filter === "all" ? races : races.filter((r) => r.status === filter);

  const filters: Array<{ value: FilterStatus; label: string }> = [
    { value: "all",       label: "All" },
    { value: "upcoming",  label: "Upcoming" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="glow-orb glow-orange w-[500px] h-[500px] -top-20 -right-20 opacity-40" />
      <div className="grid-bg absolute inset-0 pointer-events-none" />

      <AdminNav />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="font-outfit font-800 text-3xl sm:text-4xl text-[#F0F0F5]">Race Calendar</h1>
            <p className="text-[#6B6B7E] text-sm mt-1">{races.length} total events</p>
          </div>
          <Link href="/races/new">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4" /> New Race Weekend
            </Button>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 animate-fade-up delay-1 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === f.value
                  ? "bg-[#FF4D00] text-white"
                  : "bg-[#12121a] border border-white/8 text-[#6B6B7E] hover:text-[#F0F0F5] hover:border-white/15"
              }`}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 opacity-60">
                  {races.filter((r) => r.status === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Race grid */}
        {filtered.length === 0 ? (
          <div className="bg-[#12121a] border border-white/6 rounded-2xl p-16 text-center animate-fade-up delay-2">
            <Flag className="w-12 h-12 text-[#6B6B7E] mx-auto mb-4" />
            <p className="font-outfit font-600 text-[#F0F0F5] mb-2">No races found</p>
            <p className="text-sm text-[#6B6B7E] mb-6">
              {filter === "all" ? "Create your first race weekend to get started." : `No ${filter} races.`}
            </p>
            {filter === "all" && (
              <Link href="/races/new">
                <Button variant="primary">Create Race Weekend</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((race, i) => (
              <RaceCard
                key={race._id}
                race={race}
                className="animate-fade-up"
                animationDelay={`${i * 0.06}s`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function RacesPage() {
  return <RacesContent />;
}
