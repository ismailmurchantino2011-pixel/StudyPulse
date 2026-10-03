import { pgTable, uuid, text, integer, real, timestamp, index } from "drizzle-orm/pg-core";

// Each browser gets an anonymous device id so its study data stays separate.
export const cards = pgTable(
  "cards",
  {
    id: uuid().primaryKey().defaultRandom(),
    deviceId: text("device_id").notNull(),
    front: text().notNull(),
    back: text().notNull(),
    category: text().notNull().default("General"),
    repetitions: integer().notNull().default(0),
    interval: integer().notNull().default(0),
    easeFactor: real("ease_factor").notNull().default(2.5),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("cards_device_due_idx").on(t.deviceId, t.dueAt)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid().primaryKey().defaultRandom(),
    deviceId: text("device_id").notNull(),
    cardId: uuid("card_id").notNull().references(() => cards.id, { onDelete: "cascade" }),
    quality: integer().notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reviews_device_idx").on(t.deviceId, t.reviewedAt)],
);

export const focusSessions = pgTable(
  "focus_sessions",
  {
    id: uuid().primaryKey().defaultRandom(),
    deviceId: text("device_id").notNull(),
    minutes: integer().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("focus_device_idx").on(t.deviceId, t.completedAt)],
);
