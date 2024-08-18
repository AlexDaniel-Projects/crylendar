ALTER TABLE "calendar_entries" ADD COLUMN "date" date;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "calendar_entries_calendar_id_index" ON "calendar_entries" USING btree ("calendar_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "calendars_token_index" ON "calendars" USING btree ("token");--> statement-breakpoint
ALTER TABLE "calendar_entries" ADD CONSTRAINT "calendar_entries_calendar_id_date_unique" UNIQUE("calendar_id","date");--> statement-breakpoint
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_token_unique" UNIQUE("token");