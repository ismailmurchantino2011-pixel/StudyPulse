import type { Config } from "@netlify/functions";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { cards, focusSessions, reviews } from "../../db/schema.js";
import { getDeviceId, missingDevice } from "../../db/device.js";

const dayKey = (d: Date, offset: number) =>
  new Date(d.getTime() - offset * 60_000).toISOString().slice(0, 10);

export default async (req: Request) => {
  const deviceId = getDeviceId(req);
  if (!deviceId) return missingDevice();

  // Client timezone offset in minutes (same sign as Date#getTimezoneOffset).
  const tz = Number(new URL(req.url).searchParams.get("tz")) || 0;
  const now = new Date();
  const since = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [cardTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      due: sql<number>`count(*) filter (where ${cards.dueAt} <= now())::int`,
      learned: sql<number>`count(*) filter (where ${cards.interval} >= 21)::int`,
    })
    .from(cards)
    .where(eq(cards.deviceId, deviceId));

  const recentReviews = await db
    .select({ quality: reviews.quality, reviewedAt: reviews.reviewedAt })
    .from(reviews)
    .where(and(eq(reviews.deviceId, deviceId), gte(reviews.reviewedAt, since)));

  const recentFocus = await db
    .select({ minutes: focusSessions.minutes, completedAt: focusSessions.completedAt })
    .from(focusSessions)
    .where(and(eq(focusSessions.deviceId, deviceId), gte(focusSessions.completedAt, since)));

  const reviewsByDay = new Map<string, number>();
  let correct = 0;
  for (const r of recentReviews) {
    const k = dayKey(r.reviewedAt, tz);
    reviewsByDay.set(k, (reviewsByDay.get(k) ?? 0) + 1);
    if (r.quality >= 3) correct++;
  }
  const focusByDay = new Map<string, number>();
  for (const f of recentFocus) {
    const k = dayKey(f.completedAt, tz);
    focusByDay.set(k, (focusByDay.get(k) ?? 0) + f.minutes);
  }

  const activeDays = new Set([...reviewsByDay.keys(), ...focusByDay.keys()]);
  const today = dayKey(now, tz);
  let streak = 0;
  // A streak survives if today has no activity yet but yesterday did.
  for (let i = activeDays.has(today) ? 0 : 1; i < 60; i++) {
    if (!activeDays.has(dayKey(new Date(now.getTime() - i * 86_400_000), tz))) break;
    streak++;
  }

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = dayKey(new Date(now.getTime() - (6 - i) * 86_400_000), tz);
    return { date, reviews: reviewsByDay.get(date) ?? 0, focusMinutes: focusByDay.get(date) ?? 0 };
  });

  return Response.json({
    ...cardTotals,
    streak,
    reviewsToday: reviewsByDay.get(today) ?? 0,
    focusToday: focusByDay.get(today) ?? 0,
    accuracy: recentReviews.length ? Math.round((correct / recentReviews.length) * 100) : null,
    week,
  });
};

export const config: Config = {
  path: "/api/stats",
};
