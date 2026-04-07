"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronLeft, Plus, Trash2, Users, Link as LinkIcon, BarChart2, MapPin, Flag, CheckCircle, Copy, Check, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CountdownTimer } from "@/components/countdown-timer";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { ChecklistCard } from "@/components/checklist-card";
import { Input } from "@/components/ui/input";
import { AdminNav } from "@/components/admin-nav";
import { formatDateRange } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

const ITINERARY_TYPES = ["race","practice","qualifying","social","travel","other"] as const;

function RaceDetailContent({ raceId }: { raceId: string }) {
  const router = useRouter();
  const race = useQuery(api.races.getById, { id: raceId as Id<"races"> });
  const rsvps = useQuery(api.rsvps.listByRace, { raceId: raceId as Id<"races"> }) ?? [];
  const updateItinerary = useMutation(api.races.updateItinerary);
  const updateMyRaces   = useMutation(api.races.updateMyRaces);
  const updateStatus    = useMutation(api.races.updateStatus);
  const removeRace      = useMutation(api.races.remove);

  const [showItineraryEditor, setShowItineraryEditor] = useState(false);
  const [localItinerary, setLocalItinerary] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showMyRacesEditor, setShowMyRacesEditor] = useState(false);
  const [localMyRaces, setLocalMyRaces] = useState<any[]>([]);
  const [savingMyRaces, setSavingMyRaces] = useState(false);

  async function copyShareLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/r/${raceId}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  if (race === undefined) return <LoadingScreen />;
  if (!race) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#6B6B7E]">Race not found</div>;

  const accepted = rsvps.filter((r) => r.status === "accepted").length;
  const declined = rsvps.filter((r) => r.status === "declined").length;
  const maybe    = rsvps.filter((r) => r.status === "maybe").length;

  const checklist = race.checklistItems ?? [
    "Sunglasses","Sunscreen","Earplugs","Hat","Snacks",
    "Water bottle","Comfortable shoes","Lawn chairs / blankets","Cash","Camera",
  ];

  async function saveMyRaces() {
    setSavingMyRaces(true);
    await updateMyRaces({ id: race!._id, myRaces: localMyRaces });
    setSavingMyRaces(false);
    setShowMyRacesEditor(false);
  }

  function moveMyRace(i: number, dir: -1 | 1) {
    setLocalMyRaces((arr) => {
      const next = [...arr];
      const j = i + dir;
      if (j < 0 || j >= next.length) return arr;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function saveItinerary() {
    setSaving(true);
    await updateItinerary({ id: race!._id, itinerary: localItinerary });
    setSaving(false);
    setShowItineraryEditor(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="glow-orb glow-orange w-[500px] h-[500px] -top-20 -right-20 opacity-30" />
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      <AdminNav />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <Link href="/races" className="inline-flex items-center gap-1.5 text-sm text-[#6B6B7E] hover:text-[#F0F0F5] transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Races
        </Link>

        {/* Race header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge status={race.status} />
            </div>
            <h1 className="font-outfit font-800 text-3xl sm:text-4xl text-[#F0F0F5] leading-tight">{race.trackName}</h1>
            <p className="text-[#6B6B7E] mt-1">{race.title}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-[#6B6B7E]">
              <span className="font-jetbrains">{formatDateRange(race.dates.start, race.dates.end)}</span>
              {race.trackLocation && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{race.trackLocation}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="primary" size="sm" onClick={copyShareLink}>
              {linkCopied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
              {linkCopied ? "Copied!" : "Share Link"}
            </Button>
            <Link href={`/races/${raceId}/rsvps`}>
              <Button variant="secondary" size="sm"><BarChart2 className="w-3.5 h-3.5" /> RSVPs</Button>
            </Link>
          </div>
        </div>

        {/* Countdown */}
        {race.status === "upcoming" && (
          <div className="mb-8 animate-fade-up delay-1">
            <Card className="border-[#FF4D00]/15">
              <p className="text-xs font-jetbrains text-[#FF4D00] uppercase tracking-widest mb-3">Time Until Race</p>
              <CountdownTimer targetTimestamp={race.dates.start} size="md" />
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Itinerary + My Races */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Races */}
            <Card className="animate-fade-up delay-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-outfit font-700 text-base text-[#F0F0F5] flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#FF4D00]" /> My Race Schedule
                </h2>
                <Button variant="ghost" size="sm" onClick={() => { setLocalMyRaces([...race.myRaces]); setShowMyRacesEditor(true); }}>
                  Edit
                </Button>
              </div>

              {!showMyRacesEditor ? (
                race.myRaces.length === 0 ? (
                  <p className="text-[#6B6B7E] text-sm">No races added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {race.myRaces.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-xl border border-white/6">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-[#FF4D00]/10 text-[#FF4D00] text-[10px] font-jetbrains font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          <div>
                            <p className="text-sm font-medium text-[#F0F0F5]">{r.name}</p>
                            {r.gridPosition && <p className="text-xs text-[#6B6B7E]">Grid P{r.gridPosition}</p>}
                          </div>
                        </div>
                        <span className={`font-jetbrains text-sm font-bold ${r.estimatedTime === "TBD" ? "text-[#6B6B7E]" : "text-[#FF4D00]"}`}>{r.estimatedTime}</span>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  {localMyRaces.map((r, i) => (
                    <div key={i} className="p-3 bg-[#0a0a0f] rounded-xl border border-white/6 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button type="button" onClick={() => moveMyRace(i, -1)} disabled={i === 0}
                              className="p-0.5 text-[#6B6B7E] hover:text-[#F0F0F5] disabled:opacity-20 transition-colors">
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button type="button" onClick={() => moveMyRace(i, 1)} disabled={i === localMyRaces.length - 1}
                              className="p-0.5 text-[#6B6B7E] hover:text-[#F0F0F5] disabled:opacity-20 transition-colors">
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                          <Input
                            placeholder="Race name (e.g. MW SS)"
                            value={r.name}
                            onChange={(e) => setLocalMyRaces((arr) => arr.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Time or TBD"
                            value={r.estimatedTime}
                            onChange={(e) => setLocalMyRaces((arr) => arr.map((x, j) => j === i ? { ...x, estimatedTime: e.target.value } : x))}
                            className="flex-1 sm:w-36 sm:flex-none"
                          />
                          <button type="button" onClick={() => setLocalMyRaces((arr) => arr.filter((_, j) => j !== i))}
                            className="p-2 text-[#6B6B7E] hover:text-[#FF3B5C] transition-colors flex-shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm"
                    onClick={() => setLocalMyRaces((arr) => [...arr, { name: "", estimatedTime: "TBD", day: race.dates.start, gridPosition: undefined }])}>
                    <Plus className="w-3.5 h-3.5" /> Add Race
                  </Button>
                  <div className="flex gap-2 pt-2">
                    <Button variant="primary" size="sm" onClick={saveMyRaces} disabled={savingMyRaces}>
                      {savingMyRaces ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowMyRacesEditor(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Itinerary */}
            <Card className="animate-fade-up delay-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-outfit font-700 text-base text-[#F0F0F5]">Weekend Itinerary</h2>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => { setLocalItinerary([...race.itinerary]); setShowItineraryEditor(true); }}
                >
                  Edit
                </Button>
              </div>

              {!showItineraryEditor ? (
                race.itinerary.length === 0 ? (
                  <p className="text-[#6B6B7E] text-sm">No itinerary yet. Click Edit to build one.</p>
                ) : (
                  <ItineraryTimeline items={race.itinerary as any} />
                )
              ) : (
                <div className="space-y-3">
                  {localItinerary.map((item, i) => (
                    <div key={i} className="p-3 bg-[#0a0a0f] rounded-xl border border-white/6 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input placeholder="Time" value={item.time} onChange={(e) => setLocalItinerary((arr) => arr.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} />
                        <Input placeholder="Title" value={item.title} onChange={(e) => setLocalItinerary((arr) => arr.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                        <div className="flex gap-1">
                          <select value={item.type} onChange={(e) => setLocalItinerary((arr) => arr.map((x, j) => j === i ? { ...x, type: e.target.value } : x))}
                            className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-lg px-2 py-2 text-sm text-[#F0F0F5] focus:border-[#FF4D00]/50 transition-colors">
                            {ITINERARY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <button type="button" onClick={() => setLocalItinerary((arr) => arr.filter((_, j) => j !== i))} className="p-2 text-[#6B6B7E] hover:text-[#FF3B5C] transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <Input placeholder="Description (optional)" value={item.description ?? ""} onChange={(e) => setLocalItinerary((arr) => arr.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={() => setLocalItinerary((arr) => [...arr, { time: "", title: "", description: "", day: race.dates.start, type: "other" }])}>
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </Button>
                  <div className="flex gap-2 pt-2">
                    <Button variant="primary" size="sm" onClick={saveItinerary} disabled={saving}>{saving ? "Saving..." : "Save Itinerary"}</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowItineraryEditor(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right: Stats + Info */}
          <div className="space-y-4">
            {/* RSVP stats */}
            <Card className="animate-fade-up delay-2">
              <h3 className="font-outfit font-600 text-sm text-[#F0F0F5] mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF4D00]" /> Invite Stats
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Total",    value: rsvps.length, color: "text-[#F0F0F5]" },
                  { label: "Going",    value: accepted,     color: "text-[#00E87A]" },
                  { label: "Maybe",    value: maybe,        color: "text-blue-400" },
                  { label: "Declined", value: declined,     color: "text-[#FF3B5C]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-[#6B6B7E]">{label}</span>
                    <span className={`font-jetbrains text-sm font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="primary" size="sm" className="w-full" onClick={copyShareLink}>
                  {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {linkCopied ? "Copied!" : "Share"}
                </Button>
                <Link href={`/races/${raceId}/rsvps`}>
                  <Button variant="secondary" size="sm" className="w-full"><BarChart2 className="w-3.5 h-3.5" /> View All</Button>
                </Link>
              </div>
            </Card>

            {/* Track info */}
            {(race.gateInfo || race.notes || race.weatherNotes) && (
              <Card className="animate-fade-up delay-3">
                <h3 className="font-outfit font-600 text-sm text-[#F0F0F5] mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF4D00]" /> Track Info
                </h3>
                {race.gateInfo && <p className="text-xs text-[#6B6B7E] mb-3">{race.gateInfo}</p>}
                {race.notes && <p className="text-xs text-[#6B6B7E] mb-3">{race.notes}</p>}
                {race.weatherNotes && (
                  <p className="text-xs text-[#FFB800]">{race.weatherNotes}</p>
                )}
              </Card>
            )}

            {/* Checklist preview */}
            <Card className="animate-fade-up delay-4">
              <h3 className="font-outfit font-600 text-sm text-[#F0F0F5] mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#FF4D00]" /> Packing List
              </h3>
              <ChecklistCard items={checklist} interactive={false} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function RaceDetailPage() {
  const { raceId } = useParams<{ raceId: string }>();
  return <RaceDetailContent raceId={raceId} />;
}
