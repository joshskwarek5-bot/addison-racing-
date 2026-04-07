import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("races")
      .collect()
      .then((races) => races.sort((a, b) => b.dates.start - a.dates.start));
  },
});

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("races")
      .collect()
      .then((races) =>
        races
          .filter((r) => r.status === "upcoming")
          .sort((a, b) => a.dates.start - b.dates.start)
      );
  },
});

export const getById = query({
  args: { id: v.id("races") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    trackName: v.string(),
    trackLocation: v.string(),
    trackMapUrl: v.optional(v.string()),
    dates: v.object({ start: v.number(), end: v.number() }),
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("races", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("races"),
    title: v.optional(v.string()),
    trackName: v.optional(v.string()),
    trackLocation: v.optional(v.string()),
    trackMapUrl: v.optional(v.string()),
    dates: v.optional(v.object({ start: v.number(), end: v.number() })),
    gateInfo: v.optional(v.string()),
    notes: v.optional(v.string()),
    weatherNotes: v.optional(v.string()),
    checklistItems: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("upcoming"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, { id, ...fields }) => {
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const updateItinerary = mutation({
  args: {
    id: v.id("races"),
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
  },
  handler: async (ctx, { id, itinerary }) => {
    await ctx.db.patch(id, { itinerary });
  },
});

export const updateMyRaces = mutation({
  args: {
    id: v.id("races"),
    myRaces: v.array(
      v.object({
        name: v.string(),
        estimatedTime: v.string(),
        day: v.number(),
        gridPosition: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { id, myRaces }) => {
    await ctx.db.patch(id, { myRaces });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("races"),
    status: v.union(
      v.literal("upcoming"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

export const remove = mutation({
  args: { id: v.id("races") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
