import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  races: defineTable({
    title: v.string(),
    trackName: v.string(),
    trackLocation: v.string(),
    trackMapUrl: v.optional(v.string()),
    dates: v.object({
      start: v.number(),
      end: v.number(),
    }),
    myRaces: v.array(
      v.object({
        name: v.string(),
        estimatedTime: v.string(),
        day: v.number(),
        gridPosition: v.optional(v.number()),
      })
    ),
    itinerary: v.array(
      v.object({
        time: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        day: v.number(),
        type: v.union(
          v.literal("race"),
          v.literal("practice"),
          v.literal("qualifying"),
          v.literal("social"),
          v.literal("travel"),
          v.literal("other")
        ),
      })
    ),
    gateInfo: v.optional(v.string()),
    notes: v.optional(v.string()),
    weatherNotes: v.optional(v.string()),
    checklistItems: v.optional(v.array(v.string())),
    status: v.union(
      v.literal("upcoming"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
  }),

  // Self-serve RSVPs - guests type their own name, no invite needed
  rsvps: defineTable({
    raceId: v.id("races"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.union(
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("maybe")
    ),
    selectedRaces: v.optional(v.array(v.string())),
    addedToCalendar: v.optional(v.boolean()),
    reminderSent: v.optional(v.boolean()),
    rsvpAt: v.number(),
  }).index("by_race", ["raceId"]),
});
