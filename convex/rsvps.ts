import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByRace = query({
  args: { raceId: v.id("races") },
  handler: async (ctx, { raceId }) => {
    return await ctx.db
      .query("rsvps")
      .withIndex("by_race", (q) => q.eq("raceId", raceId))
      .collect()
      .then((r) => r.sort((a, b) => b.rsvpAt - a.rsvpAt));
  },
});

export const getRaceById = query({
  args: { raceId: v.id("races") },
  handler: async (ctx, { raceId }) => {
    return await ctx.db.get(raceId);
  },
});

// Called when guest submits RSVP - upsert by name+raceId
export const upsert = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if this name already RSVPed for this race
    const existing = await ctx.db
      .query("rsvps")
      .withIndex("by_race", (q) => q.eq("raceId", args.raceId))
      .collect()
      .then((r) => r.find((x) => x.name.toLowerCase() === args.name.toLowerCase()));

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        selectedRaces: args.selectedRaces,
        email: args.email ?? existing.email,
        phone: args.phone ?? existing.phone,
        rsvpAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("rsvps", {
      raceId: args.raceId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      status: args.status,
      selectedRaces: args.selectedRaces,
      addedToCalendar: false,
      reminderSent: false,
      rsvpAt: Date.now(),
    });
  },
});

export const updateSelectedRaces = mutation({
  args: {
    id: v.id("rsvps"),
    selectedRaces: v.array(v.string()),
  },
  handler: async (ctx, { id, selectedRaces }) => {
    await ctx.db.patch(id, { selectedRaces });
  },
});

export const markCalendarAdded = mutation({
  args: { id: v.id("rsvps") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { addedToCalendar: true });
  },
});

export const remove = mutation({
  args: { id: v.id("rsvps") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
