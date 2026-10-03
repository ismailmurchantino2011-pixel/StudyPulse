import type { Config, Context } from "@netlify/functions";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { cards, reviews } from "../../db/schema.js";
import { getDeviceId, missingDevice } from "../../db/device.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// SuperMemo SM-2: quality 0-5 updates the ease factor and the next interval.
function sm2(repetitions: number, interval: number, easeFactor: number, quality: number) {
  const ef = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  if (quality < 3) {
    return { repetitions: 0, interval: 0, easeFactor: ef };
  }
  const next = repetitions === 0 ? 1 : repetitions === 1 ? 6 : Math.round(interval * ef);
  return { repetitions: repetitions + 1, interval: next, easeFactor: Math.round(ef * 100) / 100 };
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const deviceId = getDeviceId(req);
  if (!deviceId) return missingDevice();

  const { quality } = await req.json().catch(() => ({}));
  if (!Number.isInteger(quality) || quality < 0 || quality > 5) {
    return Response.json({ error: "La calificación debe estar entre 0 y 5." }, { status: 400 });
  }

  const where = and(eq(cards.id, context.params.id), eq(cards.deviceId, deviceId));
  const [card] = await db.select().from(cards).where(where);
  if (!card) return Response.json({ error: "No encontrada" }, { status: 404 });

  const next = sm2(card.repetitions, card.interval, card.easeFactor, quality);
  // Failed cards come back in 10 minutes within the same session.
  const dueAt = new Date(Date.now() + (next.interval === 0 ? 10 * 60 * 1000 : next.interval * DAY_MS));

  const [updated] = await db.update(cards).set({ ...next, dueAt }).where(where).returning();
  await db.insert(reviews).values({ deviceId, cardId: card.id, quality });

  return Response.json(updated);
};

export const config: Config = {
  path: "/api/cards/:id/review",
};
