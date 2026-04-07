import { mutation } from "./_generated/server";

const DEFAULT_CHECKLIST = [
  "Sunglasses",
  "Sunscreen",
  "Earplugs",
  "Hat",
  "Snacks",
  "Water bottle",
  "Comfortable shoes",
  "Lawn chairs / blankets",
  "Cash",
  "Camera",
];

// Addison's 4 races every round (times TBD — update via admin)
const ADDI_RACES = (day: number) => [
  { name: "MW SS", estimatedTime: "TBD", day, gridPosition: undefined },
  { name: "Middleweight SB", estimatedTime: "TBD", day, gridPosition: undefined },
  { name: "Amateur Middleweight", estimatedTime: "TBD", day, gridPosition: undefined },
  { name: "Amateur Open", estimatedTime: "TBD", day, gridPosition: undefined },
];

function ts(dateStr: string, hour = 7): number {
  const d = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00`);
  return d.getTime();
}

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("races").collect();
    for (const r of existing) await ctx.db.delete(r._id);
    const existingRsvps = await ctx.db.query("rsvps").collect();
    for (const r of existingRsvps) await ctx.db.delete(r._id);

    // ── ROUND 1 ── May 9-10, 2026 | HPR ──────────────────────────────────
    const r1start = ts("2026-05-09");
    const r1end   = ts("2026-05-10", 18);
    const race1Id = await ctx.db.insert("races", {
      title: "Round 1 — Lapping w/ LegionMOTO",
      trackName: "High Plains Raceway",
      trackLocation: "Deer Trail, CO",
      dates: { start: r1start, end: r1end },
      myRaces: ADDI_RACES(ts("2026-05-10")),
      itinerary: [
        { time: "7:00 AM", title: "Gates Open", description: "Main gate off County Road 147. Paddock parking.", day: r1start, type: "travel" },
        { time: "8:30 AM", title: "Lapping Sessions (Day 1)", description: "Open lapping with LegionMOTO.", day: r1start, type: "practice" },
        { time: "8:00 AM", title: "Practice & Qualifying", day: ts("2026-05-10"), type: "qualifying" },
        { time: "TBD",     title: "MW SS Race",              description: "Addison on track.", day: ts("2026-05-10"), type: "race" },
        { time: "TBD",     title: "Middleweight SB Race",    description: "Addison on track.", day: ts("2026-05-10"), type: "race" },
        { time: "60 min",  title: "Lunch Break",             day: ts("2026-05-10"), type: "social" },
        { time: "TBD",     title: "Amateur Middleweight",    description: "Addison on track.", day: ts("2026-05-10"), type: "race" },
        { time: "TBD",     title: "Amateur Open",            description: "Addison on track — last race of the day.", day: ts("2026-05-10"), type: "race" },
      ],
      gateInfo: "Enter off County Road 147 (I-70 Exit 316). Day passes $20 cash at the gate. Park in Paddock B and walk to spectator area. Look for the orange canopy.",
      notes: "Best viewing at Turn 7 and the main straight. Bring layers — it can get cold in the morning even in May.",
      weatherNotes: "Typically sunny and breezy. Sunscreen is not optional.",
      checklistItems: [...DEFAULT_CHECKLIST, "Layers for morning cold", "Windbreaker"],
      status: "upcoming",
      createdAt: Date.now(),
    });

    // ── ROUND 2 ── June 6-7, 2026 | PMP ──────────────────────────────────
    const r2start = ts("2026-06-06");
    const r2end   = ts("2026-06-07", 18);
    await ctx.db.insert("races", {
      title: "Round 2 — Lapping w/ LegionMOTO",
      trackName: "Pueblo Motorsports Park",
      trackLocation: "Pueblo, CO",
      dates: { start: r2start, end: r2end },
      myRaces: ADDI_RACES(ts("2026-06-07")),
      itinerary: [
        { time: "7:30 AM", title: "Gates Open",               description: "South lot parking. Walk north to spectator area.", day: r2start, type: "travel" },
        { time: "8:30 AM", title: "Lapping Sessions (Day 1)", day: r2start, type: "practice" },
        { time: "8:00 AM", title: "Practice & Qualifying",    day: ts("2026-06-07"), type: "qualifying" },
        { time: "TBD",     title: "MW SS Race",               description: "Addison on track.", day: ts("2026-06-07"), type: "race" },
        { time: "TBD",     title: "Middleweight SB Race",     description: "Addison on track.", day: ts("2026-06-07"), type: "race" },
        { time: "60 min",  title: "Lunch Break",              day: ts("2026-06-07"), type: "social" },
        { time: "TBD",     title: "Amateur Middleweight",     description: "Addison on track.", day: ts("2026-06-07"), type: "race" },
        { time: "TBD",     title: "Amateur Open",             description: "Addison on track — last race of the day.", day: ts("2026-06-07"), type: "race" },
      ],
      gateInfo: "Entry on Pueblo Blvd. $15 spectator admission, cash preferred. Shaded seating near Turn 3 — get there early.",
      notes: "Pueblo is hotter than Denver. Bring twice as much water as you think you need.",
      weatherNotes: "Hot and sunny. High temps expected. No shade on the main straight.",
      checklistItems: [...DEFAULT_CHECKLIST, "Extra water (2+ liters)", "Portable fan", "Cooling towel"],
      status: "upcoming",
      createdAt: Date.now(),
    });

    // ── ROUND 3 ── July 11-12, 2026 | PMP ────────────────────────────────
    const r3start = ts("2026-07-11");
    const r3end   = ts("2026-07-12", 18);
    await ctx.db.insert("races", {
      title: "Round 3 — Lapping w/ LegionMOTO",
      trackName: "Pueblo Motorsports Park",
      trackLocation: "Pueblo, CO",
      dates: { start: r3start, end: r3end },
      myRaces: ADDI_RACES(ts("2026-07-12")),
      itinerary: [
        { time: "7:30 AM", title: "Gates Open",               day: r3start, type: "travel" },
        { time: "8:30 AM", title: "Lapping Sessions (Day 1)", day: r3start, type: "practice" },
        { time: "8:00 AM", title: "Practice & Qualifying",    day: ts("2026-07-12"), type: "qualifying" },
        { time: "TBD",     title: "MW SS Race",               description: "Addison on track.", day: ts("2026-07-12"), type: "race" },
        { time: "TBD",     title: "Middleweight SB Race",     description: "Addison on track.", day: ts("2026-07-12"), type: "race" },
        { time: "60 min",  title: "Lunch Break",              day: ts("2026-07-12"), type: "social" },
        { time: "TBD",     title: "Amateur Middleweight",     description: "Addison on track.", day: ts("2026-07-12"), type: "race" },
        { time: "TBD",     title: "Amateur Open",             description: "Addison on track — last race of the day.", day: ts("2026-07-12"), type: "race" },
      ],
      gateInfo: "Entry on Pueblo Blvd. $15 spectator admission, cash preferred.",
      notes: "July in Pueblo is peak heat. This is the hottest round of the season.",
      weatherNotes: "Extreme heat expected. Bring 3+ liters of water minimum.",
      checklistItems: [...DEFAULT_CHECKLIST, "Extra water (3+ liters)", "Portable fan", "Cooling towel", "Electrolytes"],
      status: "upcoming",
      createdAt: Date.now(),
    });

    // ── ROUND 4 ── Aug 7-9, 2026 | HPR (3-day event) ──────────────────────
    const r4start = ts("2026-08-07");
    const r4end   = ts("2026-08-09", 18);
    await ctx.db.insert("races", {
      title: "Round 4 — LegionSBK Endurance Series",
      trackName: "High Plains Raceway",
      trackLocation: "Deer Trail, CO",
      dates: { start: r4start, end: r4end },
      myRaces: ADDI_RACES(ts("2026-08-08")),
      itinerary: [
        { time: "7:00 AM", title: "Gates Open (Day 1)",        description: "HPR lapping day.", day: r4start, type: "travel" },
        { time: "8:30 AM", title: "Lapping w/ HPR",            day: r4start, type: "practice" },
        { time: "7:00 AM", title: "Gates Open (Day 2)",        day: ts("2026-08-08"), type: "travel" },
        { time: "8:00 AM", title: "Practice & Qualifying",     day: ts("2026-08-08"), type: "qualifying" },
        { time: "TBD",     title: "MW SS Race",                description: "Addison on track.", day: ts("2026-08-08"), type: "race" },
        { time: "TBD",     title: "Middleweight SB Race",      description: "Addison on track.", day: ts("2026-08-08"), type: "race" },
        { time: "60 min",  title: "Lunch Break",               day: ts("2026-08-08"), type: "social" },
        { time: "TBD",     title: "Amateur Middleweight",      description: "Addison on track.", day: ts("2026-08-08"), type: "race" },
        { time: "TBD",     title: "Amateur Open",              description: "Addison on track.", day: ts("2026-08-08"), type: "race" },
        { time: "7:00 AM", title: "Gates Open (Day 3)",        description: "LegionSBK Endurance races.", day: ts("2026-08-09"), type: "travel" },
        { time: "TBD",     title: "Endurance Races",           day: ts("2026-08-09"), type: "race" },
      ],
      gateInfo: "Enter off County Road 147. $25 weekend pass at the gate. Camp in the paddock available.",
      notes: "Biggest event of the season. 3-day format with lapping Friday, sprint races Saturday, endurance Sunday.",
      weatherNotes: "August at HPR can be hot during the day with afternoon storms. Keep an eye on weather.",
      checklistItems: [...DEFAULT_CHECKLIST, "Rain jacket", "Extra layers"],
      status: "upcoming",
      createdAt: Date.now(),
    });

    // ── ROUND 5 ── Sept 5-6, 2026 | HPR ──────────────────────────────────
    const r5start = ts("2026-09-05");
    const r5end   = ts("2026-09-06", 18);
    await ctx.db.insert("races", {
      title: "Round 5 — Lapping w/ LegionMOTO",
      trackName: "High Plains Raceway",
      trackLocation: "Deer Trail, CO",
      dates: { start: r5start, end: r5end },
      myRaces: ADDI_RACES(ts("2026-09-06")),
      itinerary: [
        { time: "7:00 AM", title: "Gates Open", day: r5start, type: "travel" },
        { time: "8:30 AM", title: "Lapping Sessions (Day 1)", day: r5start, type: "practice" },
        { time: "8:00 AM", title: "Practice & Qualifying",    day: ts("2026-09-06"), type: "qualifying" },
        { time: "TBD",     title: "MW SS Race",               description: "Addison on track.", day: ts("2026-09-06"), type: "race" },
        { time: "TBD",     title: "Middleweight SB Race",     description: "Addison on track.", day: ts("2026-09-06"), type: "race" },
        { time: "60 min",  title: "Lunch Break",              day: ts("2026-09-06"), type: "social" },
        { time: "TBD",     title: "Amateur Middleweight",     description: "Addison on track.", day: ts("2026-09-06"), type: "race" },
        { time: "TBD",     title: "Amateur Open",             description: "Addison on track — season finale!", day: ts("2026-09-06"), type: "race" },
      ],
      gateInfo: "Enter off County Road 147. Day passes $20 cash at the gate.",
      notes: "Season finale. Cooler temps in September make this one of the best events to watch.",
      weatherNotes: "September mornings can be cold. Bring layers.",
      checklistItems: [...DEFAULT_CHECKLIST, "Layers", "Windbreaker"],
      status: "upcoming",
      createdAt: Date.now(),
    });

    // ── Sample RSVPs for Round 1 ───────────────────────────────────────────
    const sampleRsvps = [
      { name: "Rylee",  status: "accepted" as const, selectedRaces: ["MW SS", "Middleweight SB", "Amateur Open"], addedToCalendar: true },
      { name: "Mom",    status: "accepted" as const, selectedRaces: ["MW SS"], addedToCalendar: false },
      { name: "Dad",    status: "maybe"    as const },
      { name: "Sierra", status: "accepted" as const, selectedRaces: ["Amateur Open"], addedToCalendar: true },
      { name: "Jake",   status: "declined" as const },
    ];

    for (const rsvp of sampleRsvps) {
      await ctx.db.insert("rsvps", {
        raceId: race1Id,
        name: rsvp.name,
        status: rsvp.status,
        selectedRaces: rsvp.selectedRaces,
        addedToCalendar: rsvp.addedToCalendar ?? false,
        reminderSent: false,
        rsvpAt: Date.now() - Math.random() * 7 * 86400000,
      });
    }

    return { races: 5, rsvps: sampleRsvps.length };
  },
});
