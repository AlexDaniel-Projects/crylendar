import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";

import { postgresUrl } from "../drizzle.config";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

function randomName() {
  const config: Config = { dictionaries: [adjectives, animals, colors], style: "lowerCase", separator: "-" };
  return uniqueNamesGenerator(config);
}

const queryClient = postgres(postgresUrl);
const db = drizzle(queryClient, { schema });

if (process.env.NODE_ENV === "production") {
  await migrate(db, { migrationsFolder: "./drizzle" });
}

const app = new Hono();

if (process.env.NODE_ENV === "production") {
  app.use("*", cors({ origin: "https://crylendar.org" }));
} else {
  app.use("*", cors({ origin: "*" }));
}

async function ensurePublicCalendar(token: string, name: string) {
  const calendar = await db.query.calendars.findFirst({
    where: eq(schema.calendars.token, token),
  });
  if (!calendar) {
    console.log(`Pre-creating calendar ${name}`);
    await db.insert(schema.calendars).values({ name, token }).returning();
  }
}
await ensurePublicCalendar("public", "public calendar");
await ensurePublicCalendar("public-2", "another public calendar");

app.get("/calendars/:id/", async (c) => {
  const token = c.req.param("id");
  const calendar = await db.query.calendars.findFirst({
    where: eq(schema.calendars.token, token),
    with: {
      data: {
        columns: {
          date: true,
          value: true,
        },
      },
    },
  });
  if (!calendar) {
    return c.json({ error: "Calendar not found" }, 404);
  }
  const result = calendar;
  result.data = Object.fromEntries(result.data.map((item) => [item.date, item.value]));
  return c.json(result);
});

app.post("/calendars/", async (c) => {
  const body = await c.req.json();
  const name = body.name || "new calendar";
  const newCalendar = await db
    .insert(schema.calendars)
    .values({
      name,
      token: `${name.replace(/\W/g, "-").replace(/-+/g, "-")}-${randomName()}`,
    })
    .returning();
  return c.json(newCalendar);
});

// endpoint for setting a single date
app.put("/calendars/:id/data/", async (c) => {
  const token = c.req.param("id");
  const body = await c.req.json();
  const date = body.date;
  let value = body.value;

  if (!date) {
    return c.json({ error: "Date not found" }, 404);
  }
  if (!new Date(date).toISOString().split("T")[0]) {
    return c.json({ error: "Date must be a valid calendar date" }, 400);
  }
  if (date > new Date().toISOString().split("T")[0]) {
    return c.json({ error: "Date must not be larger than current date" }, 400);
  }
  if (value === undefined) {
    value = null;
  } else {
    if (typeof value !== "string") {
      return c.json({ error: "Value must be a string" }, 400);
    }
    if (value.length > 4) {
      return c.json({ error: "Value is too long" }, 400);
    }
  }

  const calendar = await db.query.calendars.findFirst({
    where: eq(schema.calendars.token, token),
  });
  if (!calendar) {
    return c.json({ error: "Calendar not found" }, 404);
  }

  const result = await db
    .insert(schema.calendarEntries)
    .values({
      calendarId: calendar.id,
      date,
      value,
    })
    .onConflictDoUpdate({
      target: [schema.calendarEntries.calendarId, schema.calendarEntries.date],
      set: { value },
    });
  return c.json(result);
});

const port = +(process.env.APP_PORT || 3000);
console.log(`Server is running on port ${port}`);

serve({ fetch: app.fetch, port });
