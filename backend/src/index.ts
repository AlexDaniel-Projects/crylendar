import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { postgresUrl } from "../drizzle.config";
import * as schema from "./schema";

const queryClient = postgres(postgresUrl);
const db = drizzle(queryClient, { schema });

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/calendars", async (c) => {
  const calendars = await db.query.calendars.findMany();
  return c.json(calendars);
});

app.get("/calendars/:id", async (c) => {
  const id = c.req.param("id");
  const calendar = await db.query.calendars.findFirst();
  return c.json(calendar);
});

app.post("/calendars", async (c) => {
  const body = await c.req.json();
  const newCalendar = await db.insert(schema.calendars).values({}).returning();
  return c.json(newCalendar);
});

app.get("/calendars", async (c) => {
  const calendars = await db.query.calendars.findMany();
  return c.json(calendars);
});

app.get("/test", async (c) => {
  const calendars = await db
    .insert(schema.calendars)
    .values({
      name: "hello",
    })
    .returning();
  return c.json(calendars);
});

const port = +(process.env.APP_PORT || 3000);
console.log(`Server is running on port ${port}`);

serve({ fetch: app.fetch, port });
