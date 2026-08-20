import { Redis } from "@upstash/redis";

// Server-only — the Upstash REST token must never reach the client bundle. This file is only
// ever imported from app/api/**/route.js handlers, which run exclusively on the server.
//
// Lazily constructed (not built at module scope) because `next build`'s page-data-collection
// step imports every route module to inspect its config exports (e.g. `dynamic`) without ever
// calling the handlers — constructing the client eagerly there would run before real request-time
// env vars are guaranteed to be present and crash the build on an invalid placeholder URL.
let client;

export function getRedis() {
  if (!client) {
    client = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return client;
}

export const REPORTS_KEY = "rival:reports";
