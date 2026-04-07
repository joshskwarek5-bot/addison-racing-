"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Flag, Users, CheckCircle, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { RaceCard } from "@/components/race-card";
import { CountdownTimer } from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const upcomingRaces = useQuery(api.races.listUpcoming) ?? [];

  const nextRace = upcomingRaces[0];
  const nextRaceRsvps = useQuery(
    api.rsvps.listByRace,
    nextRace ? { raceId: nextRace._id } : "skip"
  ) ?? [];

  const acceptedCount = nextRaceRsvps.filter((r) => r.status === "accepted").length;
  const totalRsvps    = nextRaceRsvps.length;

  const stats = [
    { label: "Upcoming Races", value: upcomingRaces.length, icon: Flag,        color: "text-[#FF4D00]" },
    { label: "Total RSVPs",    value: totalRsvps,            icon: Users,       color: "text-blue-400" },
    { label: "Confirmed",      value: acceptedCount,         icon: CheckCircle, color: "text-[#00E87A]" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="glow-orb glow-orange w-[600px] h-[600px] -top-40 -right-40 opacity-60" />
      <div className="glow-orb glow-blue w-[400px] h-[400px] bottom-0 -left-20 opacity-50" />
      <div className="grid-bg absolute inset-0 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/6 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4D00] to-[#ff6a20] flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-outfit font-700 text-[#F0F0F5] tracking-tight">Addison Racing</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/races" className="text-sm text-[#6B6B7E] hover:text-[#F0F0F5] transition-colors hidden sm:block">Races</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#FF4D00]" />
            <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">Race Day HQ</span>
          </div>
          <h1 className="font-outfit font-800 text-5xl sm:text-6xl lg:text-7xl text-[#F0F0F5] leading-none">
            Addison<br />
            <span className="text-gradient-orange">Racing</span>
          </h1>
          <p className="text-[#6B6B7E] text-lg mt-4 max-w-md">
            Your race weekends, your crew, all in one place.
          </p>
        </div>

        {/* Countdown */}
        {nextRace && (
          <div className="mb-10 animate-fade-up delay-1">
            <div className="bg-[#12121a] border border-[#FF4D00]/15 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest mb-1">Next Race</p>
                  <h2 className="font-outfit font-700 text-xl text-[#F0F0F5]">{nextRace.trackName}</h2>
                  <p className="text-[#6B6B7E] text-sm">{formatDate(nextRace.dates.start)}</p>
                </div>
                <Link href={`/races/${nextRace._id}`}>
                  <Button variant="secondary" size="sm">
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
              <CountdownTimer targetTimestamp={nextRace.dates.start} size="lg" />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10 animate-fade-up delay-2">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-[#12121a] border border-white/6 rounded-2xl p-5">
                <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="font-jetbrains font-bold text-3xl text-[#F0F0F5]">{stat.value}</p>
                <p className="text-xs text-[#6B6B7E] mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Upcoming races */}
        <div className="mb-10 animate-fade-up delay-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-outfit font-700 text-xl text-[#F0F0F5]">Upcoming Races</h2>
            <Link href="/races" className="text-sm text-[#FF4D00] hover:text-[#ff6a20] transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingRaces.length === 0 ? (
            <div className="bg-[#12121a] border border-white/6 rounded-2xl p-12 text-center">
              <Flag className="w-10 h-10 text-[#6B6B7E] mx-auto mb-3" />
              <p className="text-[#6B6B7E] mb-4">No upcoming races yet.</p>
              <Link href="/races/new">
                <Button variant="primary">Create Race Weekend</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingRaces.slice(0, 3).map((race, i) => (
                <RaceCard key={race._id} race={race} animationDelay={`${i * 0.08}s`} />
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="animate-fade-up delay-4">
          <h2 className="font-outfit font-700 text-xl text-[#F0F0F5] mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/races/new">
              <div className="bg-[#12121a] border border-white/6 rounded-2xl p-5 hover:border-[#FF4D00]/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <Flag className="w-6 h-6 text-[#FF4D00] mb-3" />
                <p className="font-outfit font-600 text-[#F0F0F5] text-sm">New Race Weekend</p>
                <p className="text-xs text-[#6B6B7E] mt-1">Add an upcoming event</p>
              </div>
            </Link>
            <Link href="/races">
              <div className="bg-[#12121a] border border-white/6 rounded-2xl p-5 hover:border-[#FF4D00]/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <Zap className="w-6 h-6 text-[#FF4D00] mb-3" />
                <p className="font-outfit font-600 text-[#F0F0F5] text-sm">View All Races</p>
                <p className="text-xs text-[#6B6B7E] mt-1">{upcomingRaces.length} upcoming</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
