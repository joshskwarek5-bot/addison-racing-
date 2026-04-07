import { internalMutation } from "./_generated/server";
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const DAY_MS = 24 * 60 * 60 * 1000;

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

export const checkAndSendReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const upcoming = await ctx.db
      .query("races")
      .collect()
      .then((races) => races.filter((r) => r.status === "upcoming" && r.dates.start > now));

    for (const race of upcoming) {
      const daysUntil = (race.dates.start - now) / DAY_MS;
      const rsvps = await ctx.db
        .query("rsvps")
        .withIndex("by_race", (q) => q.eq("raceId", race._id))
        .collect()
        .then((r) => r.filter((x) => x.status === "accepted" || x.status === "maybe"));

      for (const rsvp of rsvps) {
        if (!rsvp.email || rsvp.reminderSent) continue;

        // 1 day out (0.5 - 1.5 days) — send final reminder
        if (daysUntil >= 0.5 && daysUntil <= 1.5) {
          const itinerarySummary = race.itinerary
            .slice(0, 5)
            .map((i) => `${i.time} - ${i.title}`)
            .join(", ");
          const checklist = (race.checklistItems ?? DEFAULT_CHECKLIST).join(", ");
          const msg = `Tomorrow is race day, ${rsvp.name}! ${race.trackName} - ${race.trackLocation}. ${race.weatherNotes ? `Weather: ${race.weatherNotes}. ` : ""}Schedule: ${itinerarySummary}. Don't forget: ${checklist}. ${race.gateInfo ?? ""}`;
          console.log("[REMINDER 1day]", rsvp.email, msg);
          await ctx.db.patch(rsvp._id, { reminderSent: true });
        }
      }
    }
  },
});

const crons = cronJobs();

crons.daily(
  "send race reminders",
  { hourUTC: 14, minuteUTC: 0 },
  internal.reminders.checkAndSendReminders
);

export default crons;
