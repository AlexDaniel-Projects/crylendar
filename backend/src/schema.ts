import { date, index, pgTable, unique, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const calendars = pgTable(
  "calendars",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 200 }),
    token: varchar("token", { length: 255 }).unique(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex().on(table.token),
    };
  },
);

export const calendarEntries = pgTable(
  "calendar_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    date: date("date"),
    value: varchar("value", { length: 16 }),
    calendarId: uuid("calendar_id").references(() => calendars.id),
  },
  (table) => {
    return {
      calendarIdIdx: index().on(table.calendarId),
      dateUnique: unique().on(table.calendarId, table.date),
    };
  },
);
