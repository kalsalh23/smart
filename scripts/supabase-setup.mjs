/**
 * supabase-setup.mjs — runs scripts/schema.sql against the project via the
 * Management API. Reads SUPABASE_ACCESS_TOKEN from .env.local (never committed).
 * Run: node scripts/supabase-setup.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REF = "ebhvolyskuxuinfthslu";

const envFile = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const tokenLine = envFile
  .split("\n")
  .find((l) => l.startsWith("SUPABASE_ACCESS_TOKEN="));
const token = tokenLine?.split("=")[1]?.trim();
if (!token) {
  console.error("SUPABASE_ACCESS_TOKEN missing from .env.local");
  process.exit(1);
}

const sql = fs.readFileSync(path.join(ROOT, "scripts", "schema.sql"), "utf8");

const res = await fetch(
  `https://api.supabase.com/v1/projects/${REF}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  }
);

const body = await res.text();
console.log("status:", res.status);
console.log(body.slice(0, 2000) || "(empty — success)");
if (res.status >= 300) process.exit(1);
