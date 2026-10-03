import type { Config, Context } from "@netlify/functions";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { cards } from "../../db/schema.js";
import { getDeviceId, missingDevice } from "../../db/device.js";

type CardInput = { front?: unknown; back?: unknown; category?: unknown };

function clean(input: CardInput) {
  const front = typeof input.front === "string" ? input.front.trim().slice(0, 2000) : "";
  const back = typeof input.back === "string" ? input.back.trim().slice(0, 4000) : "";
  const category =
    (typeof input.category === "string" ? input.category.trim().slice(0, 80) : "") || "General";
  return front && back ? { front, back, category } : null;
}

export default async (req: Request, context: Context) => {
  const deviceId = getDeviceId(req);
  if (!deviceId) return missingDevice();
  const id = context.params.id;
  const own = (cardId: string) => and(eq(cards.id, cardId), eq(cards.deviceId, deviceId));

  if (!id && req.method === "GET") {
    const rows = await db
      .select()
      .from(cards)
      .where(eq(cards.deviceId, deviceId))
      .orderBy(asc(cards.dueAt));
    return Response.json(rows);
  }

  if (!id && req.method === "POST") {
    const body = await req.json().catch(() => null);
    const list: CardInput[] = Array.isArray(body?.cards) ? body.cards : [body ?? {}];
    const values = list.map(clean).filter((c) => c !== null).slice(0, 50);
    if (values.length === 0) {
      return Response.json({ error: "La ficha necesita pregunta y respuesta." }, { status: 400 });
    }
    const inserted = await db
      .insert(cards)
      .values(values.map((v) => ({ ...v, deviceId })))
      .returning();
    return Response.json(inserted, { status: 201 });
  }

  if (id && req.method === "PUT") {
    const values = clean((await req.json().catch(() => ({}))) as CardInput);
    if (!values) {
      return Response.json({ error: "La ficha necesita pregunta y respuesta." }, { status: 400 });
    }
    const [updated] = await db.update(cards).set(values).where(own(id)).returning();
    return updated ? Response.json(updated) : Response.json({ error: "No encontrada" }, { status: 404 });
  }

  if (id && req.method === "DELETE") {
    await db.delete(cards).where(own(id));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: ["/api/cards", "/api/cards/:id"],
};
