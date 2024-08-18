CREATE TABLE IF NOT EXISTS "calendar_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" varchar(16),
	"calendar_id" uuid
);
--> statement-breakpoint
ALTER TABLE "calendars" ADD COLUMN "token" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_entries" ADD CONSTRAINT "calendar_entries_calendar_id_calendars_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendars"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
