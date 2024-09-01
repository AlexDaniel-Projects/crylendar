ALTER TABLE "calendar_entries" ADD COLUMN "created_at" date DEFAULT now();--> statement-breakpoint
ALTER TABLE "calendars" ADD COLUMN "created_at" date DEFAULT now();