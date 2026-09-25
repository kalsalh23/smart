/** Quick check: counts from products and orders tables. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REF = "ebhvolyskuxuinfthslu";
const envFile = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const token = envFile
  .split("\n")
  .find((l) => l.startsWith("SUPABASE_ACCESS_TOKEN="))
  .split("=")[1]
  .trim();

async function q(sql) {
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
  return [res.status, await res.text()];
}

console.log(await q("select count(*) from public.products;"));
console.log(await q("select slug, brand, price, featured from public.products limit 5;"));
console.log(await q("select tablename, policyname from pg_policies where schemaname='public';"));
