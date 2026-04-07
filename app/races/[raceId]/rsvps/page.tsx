"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronLeft, Calendar, Copy, Check, Trash2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AdminNav } from "@/components/admin-nav";
import { Id } from "@/convex/_generated/dataModel";
import { formatDate } from "@/lib/utils";

type FilterStatus = "all" | "accepted" | "declined" | "maybe";

function RsvpsContent({ raceId }: { raceId: string }) {
  const race = useQuery(api.races.getById, { id: raceId as Id<"races"> });
  const rsvps = useQuery(api.rsvps.listByRace, { raceId: raceId as Id<"races"> }) ?? [];
  const removeRsvp = useMutation(api.rsvps.remove);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<"name" | "status" | "date">("date");
  const [copied, setCopied] = useState(false);

  const filtered = rsvps
    .filter((r) => filter === "all" || r.status === filter)
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return b.rsvpAt - a.rsvpAt;
      const order = { accepted: 0, maybe: 1, declined: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });

  const counts = {
    all:      rsvps.length,
    accepted: rsvps.filter((r) => r.status === "accepted").length,
    maybe:    rsvps.filter((r) => r.status === "maybe").length,
    declined: rsvps.filter((r) => r.status === "declined").length,
  };

  async function copyShareLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/r/${raceId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filters: Array<{ value: FilterStatus; label: string }> = [
    { value: "all",      label: `All (${counts.all})` },
    { value: "accepted", label: `Going (${counts.accepted})` },
    { value: "maybe",    label: `Maybe (${counts.maybe})` },
    { value: "declined", label: `Declined (${counts.declined})` },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="glow-orb glow-orange w-[400px] h-[400px] -top-20 -right-20 opacity-30" />
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      <AdminNav />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <Link href={`/races/${raceId}`} className="inline-flex items-center gap-1.5 text-sm text-[#6B6B7E] hover:text-[#F0F0F5] transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to {race?.trackName}
        </Link>

        <div className="animate-fade-up mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-outfit font-800 text-3xl text-[#F0F0F5]">RSVP Tracker</h1>
            <p className="text-[#6B6B7E] text-sm mt-1">{race?.trackName}</p>
          </div>
          <button
            onClick={copyShareLink}
            className="flex items-center gap-2 px-4 py-2 bg-[#12121a] border border-white/8 rounded-xl text-sm text-[#6B6B7E] hover:text-[#F0F0F5] hover:border-white/15 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-[#00E87A]" /> : <LinkIcon className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Share Link"}
          </button>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fade-up delay-1">
          {[
            { label: "Total RSVPs", value: counts.all,      color: "text-[#F0F0F5]" },
            { label: "Going",       value: counts.accepted,  color: "text-[#00E87A]" },
            { label: "Maybe",       value: counts.maybe,     color: "text-blue-400" },
            { label: "Declined",    value: counts.declined,  color: "text-[#FF3B5C]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#12121a] border border-white/6 rounded-xl p-4 text-center">
              <p className={`font-jetbrains font-bold text-2xl ${color}`}>{value}</p>
              <p className="text-xs text-[#6B6B7E] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up delay-2">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === f.value
                    ? "bg-[#FF4D00] text-white"
                    : "bg-[#12121a] border border-white/8 text-[#6B6B7E] hover:text-[#F0F0F5]"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto text-xs text-[#6B6B7E]">
            Sort:
            <button onClick={() => setSortBy("date")} className={sortBy === "date" ? "text-[#FF4D00]" : "hover:text-[#F0F0F5]"}>Recent</button>
            <span>/</span>
            <button onClick={() => setSortBy("status")} className={sortBy === "status" ? "text-[#FF4D00]" : "hover:text-[#F0F0F5]"}>Status</button>
            <span>/</span>
            <button onClick={() => setSortBy("name")} className={sortBy === "name" ? "text-[#FF4D00]" : "hover:text-[#F0F0F5]"}>Name</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#12121a] border border-white/6 rounded-2xl overflow-hidden animate-fade-up delay-3">
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-[#6B6B7E] mb-2">No RSVPs yet.</p>
              <p className="text-xs text-[#6B6B7E]/60">Share the link above so guests can RSVP.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((rsvp) => (
                <div key={rsvp._id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#F0F0F5]">{rsvp.name}</p>
                    {rsvp.email && <p className="text-xs text-[#6B6B7E]">{rsvp.email}</p>}
                  </div>

                  <Badge status={rsvp.status} />

                  {rsvp.selectedRaces && rsvp.selectedRaces.length > 0 && (
                    <div className="hidden lg:flex gap-1">
                      {rsvp.selectedRaces.slice(0, 2).map((r) => (
                        <span key={r} className="text-[10px] px-2 py-0.5 bg-[#FF4D00]/10 text-[#FF4D00] rounded-full">
                          {r.split(" ").slice(0, 2).join(" ")}
                        </span>
                      ))}
                    </div>
                  )}

                  {rsvp.addedToCalendar && (
                    <Calendar className="w-3.5 h-3.5 text-[#00E87A] flex-shrink-0" title="Added to calendar" />
                  )}

                  <span className="text-xs font-jetbrains text-[#6B6B7E] hidden sm:block">
                    {formatDate(rsvp.rsvpAt)}
                  </span>

                  <button
                    onClick={() => removeRsvp({ id: rsvp._id })}
                    className="p-1.5 text-[#6B6B7E] hover:text-[#FF3B5C] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Remove RSVP"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function RsvpsPage() {
  const { raceId } = useParams<{ raceId: string }>();
  return <RsvpsContent raceId={raceId} />;
}
