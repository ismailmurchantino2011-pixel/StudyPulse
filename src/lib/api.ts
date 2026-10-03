import type { Card, ChatMessage, NewCard, Stats } from "../types";

function deviceId() {
  let id = localStorage.getItem("studypulse_device");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("studypulse_device", id);
  }
  return id;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", "X-Device-Id": deviceId(), ...init.headers },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Algo salió mal. Inténtalo de nuevo.");
  return data as T;
}

const post = (body: unknown): RequestInit => ({ method: "POST", body: JSON.stringify(body) });

export const api = {
  listCards: () => request<Card[]>("/api/cards"),
  createCards: (cards: NewCard[]) => request<Card[]>("/api/cards", post({ cards })),
  updateCard: (id: string, card: NewCard) =>
    request<Card>(`/api/cards/${id}`, { method: "PUT", body: JSON.stringify(card) }),
  deleteCard: (id: string) => request<void>(`/api/cards/${id}`, { method: "DELETE" }),
  review: (id: string, quality: number) => request<Card>(`/api/cards/${id}/review`, post({ quality })),
  stats: () => request<Stats>(`/api/stats?tz=${new Date().getTimezoneOffset()}`),
  logFocus: (minutes: number) => request("/api/focus", post({ minutes })),
  generateCards: (notes: string, count: number) =>
    request<{ cards: NewCard[] }>("/api/ai/generate", post({ notes, count })),
  tutor: (messages: ChatMessage[]) => request<{ content: string }>("/api/ai/tutor", post({ messages })),
};
