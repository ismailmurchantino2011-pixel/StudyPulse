export function getDeviceId(req: Request): string | null {
  const id = req.headers.get("x-device-id");
  return id && /^[a-zA-Z0-9-]{8,64}$/.test(id) ? id : null;
}

export const missingDevice = () =>
  Response.json({ error: "Falta el identificador del dispositivo." }, { status: 400 });
