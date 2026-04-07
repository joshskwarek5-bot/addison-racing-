"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Trash2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin-nav";

const DEFAULT_CHECKLIST = [
  "Sunglasses", "Sunscreen", "Earplugs", "Hat", "Snacks",
  "Water bottle", "Comfortable shoes", "Lawn chairs / blankets", "Cash", "Camera",
];

const ITINERARY_TYPES = [
  { value: "race",       label: "Race",       color: "text-[#FF4D00]" },
  { value: "practice",   label: "Practice",   color: "text-blue-400" },
  { value: "qualifying", label: "Qualifying", color: "text-[#FFB800]" },
  { value: "social",     label: "Social",     color: "text-[#00E87A]" },
  { value: "travel",     label: "Travel",     color: "text-[#6B6B7E]" },
  { value: "other",      label: "Other",      color: "text-[#6B6B7E]" },
];

type ItineraryItem = { time: string; title: string; description: string; day: number; type: string };
type MyRace = { name: string; estimatedTime: string; day: number; gridPosition: string };

function NewRaceContent() {
  const router = useRouter();
  const createRace = useMutation(api.races.create);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    trackName: "",
    trackLocation: "",
    startDate: "",
    endDate: "",
    gateInfo: "",
    notes: "",
    weatherNotes: "",
  });

  const [myRaces, setMyRaces] = useState<MyRace[]>([
    { name: "", estimatedTime: "", day: 0, gridPosition: "" },
  ]);

  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { time: "", title: "", description: "", day: 0, type: "other" },
  ]);

  const [checklist, setChecklist] = useState<string[]>([...DEFAULT_CHECKLIST]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.startDate || !form.endDate) return;

    setLoading(true);
    try {
      const start = new Date(form.startDate).getTime();
      const end   = new Date(form.endDate).getTime();

      const id = await createRace({
        title:         form.title || `${form.trackName} Race Weekend`,
        trackName:     form.trackName,
        trackLocation: form.trackLocation,
        dates:         { start, end },
        myRaces: myRaces
          .filter((r) => r.name)
          .map((r) => ({
            name:          r.name,
            estimatedTime: r.estimatedTime,
            day:           r.day || start,
            gridPosition:  r.gridPosition ? parseInt(r.gridPosition) : undefined,
          })),
        itinerary: itinerary
          .filter((i) => i.title)
          .map((i) => ({
            time:        i.time,
            title:       i.title,
            description: i.description || undefined,
            day:         i.day || start,
            type:        i.type as any,
          })),
        gateInfo:      form.gateInfo || undefined,
        notes:         form.notes || undefined,
        weatherNotes:  form.weatherNotes || undefined,
        checklistItems: checklist,
        status: "upcoming",
      });

      router.push(`/races/${id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  const startTs = form.startDate ? new Date(form.startDate).getTime() : 0;
  const endTs   = form.endDate   ? new Date(form.endDate).getTime()   : 0;
  const dayOptions: Array<{ label: string; value: number }> = [];
  if (startTs) {
    const days = Math.ceil((endTs - startTs) / 86400000) + 1 || 1;
    for (let i = 0; i < Math.min(days, 4); i++) {
      dayOptions.push({ label: `Day ${i + 1}`, value: startTs + i * 86400000 });
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="glow-orb glow-orange w-[400px] h-[400px] -top-20 -right-20 opacity-30" />
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      <AdminNav />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Link href="/races" className="inline-flex items-center gap-1.5 text-sm text-[#6B6B7E] hover:text-[#F0F0F5] transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to Races
        </Link>

        <div className="animate-fade-up mb-8">
          <h1 className="font-outfit font-800 text-3xl text-[#F0F0F5]">New Race Weekend</h1>
          <p className="text-[#6B6B7E] text-sm mt-1">Create a race event and start inviting your crew.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" onKeyDown={(e) => { if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault(); }}>
          {/* Basic Info */}
          <section className="bg-[#12121a] border border-white/6 rounded-2xl p-6 animate-fade-up delay-1">
            <h2 className="font-outfit font-700 text-base text-[#F0F0F5] mb-5">Race Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Track Name *" placeholder="High Plains Raceway" value={form.trackName} onChange={(e) => setField("trackName", e.target.value)} required />
              <Input label="Location" placeholder="Deer Trail, CO" value={form.trackLocation} onChange={(e) => setField("trackLocation", e.target.value)} />
              <Input label="Event Title" placeholder="Round 3 - High Plains Raceway" value={form.title} onChange={(e) => setField("title", e.target.value)} />
              <div />
              <div>
                <label className="text-xs font-medium text-[#6B6B7E] uppercase tracking-wider block mb-1.5">Start Date *</label>
                <input type="datetime-local" value={form.startDate} onChange={(e) => setField("startDate", e.target.value)} required
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#F0F0F5] focus:border-[#FF4D00]/50 focus:ring-1 focus:ring-[#FF4D00]/20 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6B6B7E] uppercase tracking-wider block mb-1.5">End Date *</label>
                <input type="datetime-local" value={form.endDate} onChange={(e) => setField("endDate", e.target.value)} required
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#F0F0F5] focus:border-[#FF4D00]/50 focus:ring-1 focus:ring-[#FF4D00]/20 transition-colors" />
              </div>
            </div>
          </section>

          {/* My Races */}
          <section className="bg-[#12121a] border border-white/6 rounded-2xl p-6 animate-fade-up delay-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-outfit font-700 text-base text-[#F0F0F5]">My Races</h2>
              <Button type="button" variant="ghost" size="sm" onClick={() => setMyRaces((r) => [...r, { name: "", estimatedTime: "", day: startTs, gridPosition: "" }])}>
                <Plus className="w-3.5 h-3.5" /> Add Race
              </Button>
            </div>
            <div className="space-y-3">
              {myRaces.map((r, i) => (
                <div key={i} className="p-3 bg-[#0a0a0f] rounded-xl border border-white/6 space-y-2">
                  <Input placeholder="e.g. MW SS" value={r.name} onChange={(e) => setMyRaces((arr) => arr.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                  <div className="flex gap-2">
                    <Input placeholder="Time (e.g. 11:15 AM or TBD)" value={r.estimatedTime} onChange={(e) => setMyRaces((arr) => arr.map((x, j) => j === i ? { ...x, estimatedTime: e.target.value } : x))} className="flex-1" />
                    {dayOptions.length > 0 && (
                      <select value={r.day || startTs} onChange={(e) => setMyRaces((arr) => arr.map((x, j) => j === i ? { ...x, day: parseInt(e.target.value) } : x))}
                        className="bg-[#0a0a0f] border border-white/10 rounded-lg px-2 py-2.5 text-sm text-[#F0F0F5] focus:border-[#FF4D00]/50 transition-colors">
                        {dayOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    )}
                    {myRaces.length > 1 && (
                      <button type="button" onClick={() => setMyRaces((arr) => arr.filter((_, j) => j !== i))}
                        className="p-2.5 text-[#6B6B7E] hover:text-[#FF3B5C] transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Itinerary */}
          <section className="bg-[#12121a] border border-white/6 rounded-2xl p-6 animate-fade-up delay-3">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-outfit font-700 text-base text-[#F0F0F5]">Weekend Itinerary</h2>
              <Button type="button" variant="ghost" size="sm" onClick={() => setItinerary((arr) => [...arr, { time: "", title: "", description: "", day: startTs, type: "other" }])}>
                <Plus className="w-3.5 h-3.5" /> Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {itinerary.map((item, i) => (
                <div key={i} className="p-3 bg-[#0a0a0f] rounded-xl border border-white/6 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input placeholder="8:00 AM" value={item.time} onChange={(e) => setItinerary((arr) => arr.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} />
                    <Input placeholder="Gates Open" value={item.title} onChange={(e) => setItinerary((arr) => arr.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                    <div className="flex gap-2">
                      <select value={item.type} onChange={(e) => setItinerary((arr) => arr.map((x, j) => j === i ? { ...x, type: e.target.value } : x))}
                        className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-lg px-2 py-2.5 text-sm text-[#F0F0F5] focus:border-[#FF4D00]/50 transition-colors">
                        {ITINERARY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      {itinerary.length > 1 && (
                        <button type="button" onClick={() => setItinerary((arr) => arr.filter((_, j) => j !== i))}
                          className="p-2.5 text-[#6B6B7E] hover:text-[#FF3B5C] transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <Input placeholder="Optional description..." value={item.description} onChange={(e) => setItinerary((arr) => arr.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
                </div>
              ))}
            </div>
          </section>

          {/* Track Info */}
          <section className="bg-[#12121a] border border-white/6 rounded-2xl p-6 animate-fade-up delay-3">
            <h2 className="font-outfit font-700 text-base text-[#F0F0F5] mb-5">Track Info</h2>
            <div className="space-y-4">
              <Textarea label="Gate / Parking Info" placeholder="Enter off County Road 147. Park in Paddock B..." rows={3} value={form.gateInfo} onChange={(e) => setField("gateInfo", e.target.value)} />
              <Textarea label="Track Notes" placeholder="Best viewing spots, what to expect..." rows={3} value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
              <Textarea label="Weather Notes" placeholder="Hot and sunny. Bring sunscreen..." rows={2} value={form.weatherNotes} onChange={(e) => setField("weatherNotes", e.target.value)} />
            </div>
          </section>

          {/* Checklist */}
          <section className="bg-[#12121a] border border-white/6 rounded-2xl p-6 animate-fade-up delay-4">
            <h2 className="font-outfit font-700 text-base text-[#F0F0F5] mb-5">Packing Checklist</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {checklist.map((item) => (
                <div key={item} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0f] border border-white/8 rounded-full text-sm text-[#F0F0F5]">
                  {item}
                  <button type="button" onClick={() => setChecklist((arr) => arr.filter((i) => i !== item))} className="text-[#6B6B7E] hover:text-[#FF3B5C] transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add item..." value={newChecklistItem} onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newChecklistItem.trim()) { setChecklist((arr) => [...arr, newChecklistItem.trim()]); setNewChecklistItem(""); } }}} />
              <Button type="button" variant="secondary" onClick={() => { if (newChecklistItem.trim()) { setChecklist((arr) => [...arr, newChecklistItem.trim()]); setNewChecklistItem(""); }}}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </section>

          <div className="flex gap-3 animate-fade-up delay-5">
            <Button type="submit" variant="primary" size="lg" disabled={loading} className="flex-1 sm:flex-none">
              {loading ? "Creating..." : "Create Race Weekend"}
            </Button>
            <Link href="/races">
              <Button type="button" variant="secondary" size="lg">Cancel</Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NewRacePage() {
  return <NewRaceContent />;
}
