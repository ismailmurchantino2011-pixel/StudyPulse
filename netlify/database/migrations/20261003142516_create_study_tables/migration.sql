CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"device_id" text NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	"interval" integer DEFAULT 0 NOT NULL,
	"ease_factor" real DEFAULT 2.5 NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "focus_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"device_id" text NOT NULL,
	"minutes" integer NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"device_id" text NOT NULL,
	"card_id" uuid NOT NULL,
	"quality" integer NOT NULL,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "cards_device_due_idx" ON "cards" ("device_id","due_at");--> statement-breakpoint
CREATE INDEX "focus_device_idx" ON "focus_sessions" ("device_id","completed_at");--> statement-breakpoint
CREATE INDEX "reviews_device_idx" ON "reviews" ("device_id","reviewed_at");--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_card_id_cards_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE;