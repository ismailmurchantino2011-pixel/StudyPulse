import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { focusSessions } from "../../db/schema.js";
import { getDeviceId, missingDevice } from "../../db/device.js";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const deviceId = getDeviceId(req);
  if (!deviceId) return missingDevice();

  const { minutes } = await req.json().catch(() => ({}));
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
    return Response.json({ error: "Duración no válida." }, { status: 400 });
  }
  const [session] = await db.insert(focusSessions).values({ deviceId, minutes }).returning();
  return Response.json(session, { status: 201 });
};

export const config: Config = {
  path: "/api/focus",
};
