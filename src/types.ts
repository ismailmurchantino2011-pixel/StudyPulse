export type Tab = "study" | "deck" | "focus" | "tutor" | "progress";

export type Profile = "junior" | "academic" | "adult";

export interface Card {
  id: string;
  front: string;
  back: string;
  category: string;
  repetitions: number;
  interval: number;
  easeFactor: number;
  dueAt: string;
  createdAt: string;
}

export interface NewCard {
  front: string;
  back: string;
  category: string;
}

export interface Stats {
  total: number;
  due: number;
  learned: number;
  streak: number;
  reviewsToday: number;
  focusToday: number;
  accuracy: number | null;
  week: { date: string; reviews: number; focusMinutes: number }[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
