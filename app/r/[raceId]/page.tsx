"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import {
  MapPin, Calendar, Flag, CheckSquare, Square,
  Navigation, Info, Zap, User, ChevronRight
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { CountdownTimer } from "@/components/countdown-timer";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { ChecklistCard } from "@/components/checklist-card";
import { CalendarExport } from "@/components/calendar-export";
import { formatDateRange, formatDateShort } from "@/lib/utils";

const DEFAULT_CHECKLIST = [
  "Sunglasses", "Sunscreen", "Earplugs", "Hat", "Snacks",
  "Water bottle", "Comfortable shoes", "Lawn chairs / blankets", "Cash", "Camera",
];

type RsvpStatus = "accepted" | "maybe" | "declined";

export default function GuestPage() {
  const { raceId } = useParams<{ raceId: string }>();
  const race = useQuery(api.rsvps.getRaceById, { raceId: raceId as Id<"races"> });

  const upsertRsvp         = useMutation(api.rsvps.upsert);
  const updateSelectedRaces = useMutation(api.rsvps.updateSelectedRaces);
  const markCalendarAdded   = useMutation(api.rsvps.markCalendarAdded);

  // Name entry step
  const [name, setName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [nameError, setNameError] = useState("");

  // RSVP state
  const [rsvpId, setRsvpId] = useState<Id<"rsvps"> | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus | null>(null);
  const [selectedRaces, setSelectedRaces] = useState<Set<string>>(new Set());
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [calendarDone, setCalendarDone] = useState(false);

  if (race === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!race) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
        <div className="text-center">
          <Flag className="w-12 h-12 text-[#6B6B7E] mx-auto mb-4" />
          <h1 className="font-outfit font-700 text-2xl text-[#F0F0F5] mb-2">Race Not Found</h1>
          <p className="text-[#6B6B7E]">This link may be invalid or the event has been removed.</p>
        </div>
      </div>
    );
  }

  const checklist = race.checklistItems ?? DEFAULT_CHECKLIST;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(race.trackLocation)}`;
  const showRaceSelector = rsvpStatus === "accepted" || rsvpStatus === "maybe";

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setNameError("Enter your name to RSVP"); return; }
    setNameError("");
    setNameSubmitted(true);
  }

  async function handleRsvp(status: RsvpStatus) {
    if (!name.trim()) return;
    setRsvpLoading(true);
    setRsvpStatus(status);
    try {
      const id = await upsertRsvp({
        raceId: raceId as Id<"races">,
        name: name.trim(),
        status,
        selectedRaces: Array.from(selectedRaces),
      });
      setRsvpId(id as Id<"rsvps">);
    } finally {
      setRsvpLoading(false);
    }
  }

  async function toggleRace(raceName: string) {
    const next = new Set(selectedRaces);
    if (next.has(raceName)) next.delete(raceName);
    else next.add(raceName);
    setSelectedRaces(next);
    if (rsvpId) {
      await updateSelectedRaces({ id: rsvpId, selectedRaces: Array.from(next) }).catch(() => {});
    }
  }

  async function handleCalendarAdded() {
    if (rsvpId) {
      await markCalendarAdded({ id: rsvpId }).catch(() => {});
    }
    setCalendarDone(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">

      {/* ===================== HERO ===================== */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-100" />
        <div className="glow-orb glow-orange w-[700px] h-[700px] -top-40 -left-20 opacity-50" />
        <div className="glow-orb glow-blue   w-[400px] h-[400px] bottom-0 right-0 opacity-40" />
        <div className="absolute top-0 left-0 right-0 checkered-strip" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/20 mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">
              You're invited to come watch
            </span>
          </div>

          <h1 className="font-outfit font-800 text-[clamp(2.5rem,8vw,4.5rem)] text-[#F0F0F5] leading-none tracking-tight mb-4 animate-fade-up delay-1">
            {race.trackName}
          </h1>
          <p className="font-outfit text-[#6B6B7E] text-lg mb-8 animate-fade-up delay-2">{race.title}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-up delay-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF4D00]" />
              <span className="font-jetbrains text-sm text-[#F0F0F5]">{formatDateRange(race.dates.start, race.dates.end)}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-[#6B6B7E]" />
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#F0F0F5] hover:text-[#FF4D00] transition-colors">
              <MapPin className="w-4 h-4 text-[#FF4D00]" />
              <span className="text-sm">{race.trackLocation}</span>
            </a>
          </div>

          <div className="flex justify-center animate-fade-up delay-4 overflow-x-auto">
            <CountdownTimer targetTimestamp={race.dates.start} size="md" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L1440 0V40H0Z" fill="#0a0a0f" />
          </svg>
        </div>
      </section>

      {/* ===================== RSVP ===================== */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-up">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-[#FF4D00]" />
              <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">RSVP</span>
              <div className="h-px w-8 bg-[#FF4D00]" />
            </div>
            <h2 className="font-outfit font-700 text-2xl sm:text-3xl text-[#F0F0F5]">Will you be there?</h2>
          </div>

          {!nameSubmitted ? (
            /* Step 1: Enter name */
            <form onSubmit={handleNameSubmit} className="animate-fade-up delay-1">
              <div className="bg-[#12121a] border border-white/8 rounded-2xl p-6">
                <label className="block text-xs font-medium text-[#6B6B7E] uppercase tracking-wider mb-3">
                  First, what's your name?
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7E]" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                      className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[#F0F0F5] placeholder:text-[#6B6B7E] font-outfit focus:border-[#FF4D00]/50 focus:ring-1 focus:ring-[#FF4D00]/20 transition-colors"
                    />
                  </div>
                  <button type="submit"
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF4D00] to-[#ff6a20] text-white font-outfit font-600 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,77,0,0.35)] transition-all duration-200">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {nameError && <p className="text-xs text-[#FF3B5C] mt-2">{nameError}</p>}
              </div>
            </form>
          ) : (
            /* Step 2: Pick status */
            <div className="space-y-4 animate-fade-up delay-1">
              <div className="bg-[#12121a] border border-white/8 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF4D00]/15 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#FF4D00]" />
                </div>
                <span className="font-outfit font-600 text-[#F0F0F5]">{name}</span>
                <button onClick={() => { setNameSubmitted(false); setRsvpStatus(null); setRsvpId(null); }}
                  className="ml-auto text-xs text-[#6B6B7E] hover:text-[#F0F0F5] transition-colors">
                  Change
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {([
                  { status: "accepted" as const, label: "I'm Coming",    activeClass: "bg-[#00E87A] border-[#00E87A] text-black", inactiveClass: "border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/10" },
                  { status: "maybe"    as const, label: "Maybe",          activeClass: "bg-[#FFB800] border-[#FFB800] text-black", inactiveClass: "border-[#FFB800]/30 text-[#FFB800] hover:bg-[#FFB800]/10" },
                  { status: "declined" as const, label: "Can't Make It", activeClass: "bg-[#FF3B5C] border-[#FF3B5C] text-white", inactiveClass: "border-[#FF3B5C]/30 text-[#FF3B5C] hover:bg-[#FF3B5C]/10" },
                ]).map(({ status, label, activeClass, inactiveClass }) => (
                  <button key={status} onClick={() => handleRsvp(status)} disabled={rsvpLoading}
                    className={`flex-1 min-h-14 px-4 py-3 rounded-xl border-2 font-outfit font-600 text-sm transition-all duration-200 disabled:opacity-50 ${rsvpStatus === status ? `${activeClass} scale-[1.02] shadow-lg` : `${inactiveClass} hover:-translate-y-0.5`}`}>
                    {label}
                  </button>
                ))}
              </div>

              {rsvpStatus && (
                <p className="text-center text-sm animate-fade-in" style={{ color: rsvpStatus === "accepted" ? "#00E87A" : rsvpStatus === "maybe" ? "#FFB800" : "#FF3B5C" }}>
                  {rsvpStatus === "accepted" && `Awesome ${name}! Addison will be pumped to see you.`}
                  {rsvpStatus === "maybe"    && `Got it, ${name} — hope you can make it!`}
                  {rsvpStatus === "declined" && `No worries ${name} — next time!`}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===================== MEET THE RACER ===================== */}
      <section className="py-0 relative overflow-hidden">
        <div className="relative h-[420px] sm:h-[520px]">
          <img
            src="/addison-555.jpg"
            alt="Addison #555 cornering at speed"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* gradient overlays — left and bottom */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end px-8 sm:px-12 pb-12 sm:pb-16 max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-[#FF4D00]" />
              <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">MRA 2026</span>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-jetbrains font-bold text-[#FF4D00] text-6xl sm:text-7xl leading-none">#555</span>
              <span className="font-outfit font-800 text-3xl sm:text-4xl text-[#F0F0F5] leading-none">Addison</span>
            </div>
            <p className="text-[#6B6B7E] text-sm leading-relaxed max-w-xs">
              Middleweight Supersport · Middleweight Superbike · Amateur classes. Racing all season on the Suzuki.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== RACE SCHEDULE ===================== */}
      {race.myRaces.length > 0 && (
        <section className="py-16 px-6 bg-[#12121a]/40">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2 animate-fade-up">
              <div className="h-px w-8 bg-[#FF4D00]" />
              <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">On Track</span>
            </div>
            <h2 className="font-outfit font-700 text-2xl sm:text-3xl text-[#F0F0F5] mb-2 animate-fade-up delay-1">
              Addison's Race Schedule
            </h2>
            <p className="text-[#6B6B7E] text-sm mb-8 animate-fade-up delay-1">
              Estimated times - races can run early or late, be there 15 min ahead.
            </p>

            <div className="space-y-3 animate-fade-up delay-2">
              {race.myRaces.map((r, i) => {
                const isSelected = selectedRaces.has(r.name);
                return (
                  <button key={i} onClick={() => showRaceSelector && toggleRace(r.name)}
                    disabled={!showRaceSelector}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${showRaceSelector ? "cursor-pointer" : "cursor-default"} ${isSelected && showRaceSelector ? "bg-[#FF4D00]/8 border-[#FF4D00]/30" : "bg-[#12121a] border-white/8 hover:border-white/15"}`}>
                    {showRaceSelector && (
                      <div className="flex-shrink-0">
                        {isSelected ? <CheckSquare className="w-5 h-5 text-[#FF4D00]" /> : <Square className="w-5 h-5 text-[#6B6B7E]" />}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-[#F0F0F5] text-sm">{r.name}</p>
                      {r.gridPosition && <p className="text-xs text-[#6B6B7E] mt-0.5">Grid Position P{r.gridPosition}</p>}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-jetbrains font-bold text-[#FF4D00] text-sm">{r.estimatedTime}</p>
                      <p className="text-xs text-[#6B6B7E] font-jetbrains">{formatDateShort(r.day)}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {showRaceSelector && (
              <p className="text-xs text-[#6B6B7E] text-center mt-4 animate-fade-in">
                Tap races above to mark which ones you plan to watch
              </p>
            )}
          </div>
        </section>
      )}

      {/* ===================== ITINERARY ===================== */}
      {race.itinerary.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2 animate-fade-up">
              <div className="h-px w-8 bg-[#FF4D00]" />
              <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">Schedule</span>
            </div>
            <h2 className="font-outfit font-700 text-2xl sm:text-3xl text-[#F0F0F5] mb-8 animate-fade-up delay-1">
              Weekend Schedule
            </h2>
            <div className="bg-[#12121a] border border-white/6 rounded-2xl p-6 animate-fade-up delay-2">
              <ItineraryTimeline items={race.itinerary as any} />
            </div>
          </div>
        </section>
      )}

      {/* ===================== ADD TO CALENDAR ===================== */}
      <section className="py-16 px-6 bg-[#12121a]/40">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2 animate-fade-up">
            <div className="h-px w-8 bg-[#FF4D00]" />
            <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">Calendar</span>
            <div className="h-px w-8 bg-[#FF4D00]" />
          </div>
          <h2 className="font-outfit font-700 text-2xl sm:text-3xl text-[#F0F0F5] mb-2 animate-fade-up delay-1">
            Don't miss it
          </h2>
          <p className="text-[#6B6B7E] text-sm mb-2 animate-fade-up delay-1">
            Add to your calendar - includes the full schedule and a reminder the day before.
          </p>
          {calendarDone && (
            <p className="text-xs text-[#00E87A] mb-4 animate-fade-in">Added! You'll get a reminder the day before.</p>
          )}
          <div className="animate-fade-up delay-2">
            <CalendarExport race={race as any} rsvpId={rsvpId ?? undefined} onAdded={handleCalendarAdded} />
          </div>
        </div>
      </section>

      {/* ===================== CHECKLIST ===================== */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2 animate-fade-up">
            <div className="h-px w-8 bg-[#FF4D00]" />
            <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">Prep</span>
          </div>
          <h2 className="font-outfit font-700 text-2xl sm:text-3xl text-[#F0F0F5] mb-2 animate-fade-up delay-1">
            What to Bring
          </h2>
          <p className="text-[#6B6B7E] text-sm mb-6 animate-fade-up delay-1">
            Racetracks aren't stadiums. No shade, no seats, full sun all day. Come prepared.
          </p>
          <div className="bg-[#12121a] border border-white/6 rounded-2xl p-6 animate-fade-up delay-2">
            <ChecklistCard items={checklist} interactive={true} />
          </div>
        </div>
      </section>

      {/* ===================== TRACK INFO ===================== */}
      {(race.gateInfo || race.notes || race.weatherNotes) && (
        <section className="py-16 px-6 bg-[#12121a]/40">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2 animate-fade-up">
              <div className="h-px w-8 bg-[#FF4D00]" />
              <span className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest">Logistics</span>
            </div>
            <h2 className="font-outfit font-700 text-2xl sm:text-3xl text-[#F0F0F5] mb-8 animate-fade-up delay-1">
              Getting There
            </h2>
            <div className="space-y-4 animate-fade-up delay-2">
              {race.gateInfo && (
                <div className="bg-[#12121a] border border-white/8 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Navigation className="w-4 h-4 text-[#FF4D00]" />
                    <span className="text-xs font-medium text-[#FF4D00] uppercase tracking-wider">Directions + Parking</span>
                  </div>
                  <p className="text-sm text-[#F0F0F5] leading-relaxed">{race.gateInfo}</p>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#FF4D00] hover:text-[#ff6a20] transition-colors">
                    <MapPin className="w-3.5 h-3.5" /> Open in Maps
                  </a>
                </div>
              )}
              {race.notes && (
                <div className="bg-[#12121a] border border-white/8 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Track Notes</span>
                  </div>
                  <p className="text-sm text-[#F0F0F5] leading-relaxed">{race.notes}</p>
                </div>
              )}
              {race.weatherNotes && (
                <div className="bg-[#12121a] border border-[#FFB800]/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#FFB800] font-bold text-sm">!</span>
                    <span className="text-xs font-medium text-[#FFB800] uppercase tracking-wider">Weather Heads-Up</span>
                  </div>
                  <p className="text-sm text-[#FFB800] leading-relaxed">{race.weatherNotes}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================== FOOTER ===================== */}
      <footer className="py-12 px-6 border-t border-white/6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF4D00] to-[#ff6a20] flex items-center justify-center">
              <Flag className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-outfit font-700 text-[#F0F0F5]">Addison Racing</span>
          </div>
          <p className="text-xs text-[#6B6B7E]">Powered by pure adrenaline</p>
          <div className="checkered-strip mt-6 max-w-xs mx-auto rounded-full opacity-30" />
        </div>
      </footer>
    </div>
  );
}
