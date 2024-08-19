import { relations } from "drizzle-orm";
import { date, index, pgTable, unique, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const calendars = pgTable(
  "calendars",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 200 }),
    token: varchar("token", { length: 255 }).unique(),
    createdAt: date("created_at").defaultNow(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex().on(table.token),
    };
  },
);

export const calendarsRelations = relations(calendars, ({ many }) => ({
  data: many(calendarEntries),
}));

export const calendarEntries = pgTable(
  "calendar_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    date: date("date"),
    value: varchar("value", { length: 16 }),
    calendarId: uuid("calendar_id").references(() => calendars.id),
    createdAt: date("created_at").defaultNow(),
  },
  (table) => {
    return {
      calendarIdIdx: index().on(table.calendarId),
      dateUnique: unique().on(table.calendarId, table.date),
    };
  },
);

export const calendarEntriesRelations = relations(calendarEntries, ({ one }) => ({
  calendar: one(calendars, {
    fields: [calendarEntries.calendarId],
    references: [calendars.id],
  }),
}));
