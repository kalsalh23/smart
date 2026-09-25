/**
 * Adds NEXT_PUBLIC_SUPABASE_ANON_KEY to the Vercel project via REST API.
 * Token is passed as argv[2] to keep it out of committed files.
 */
const token = process.argv[2];
if (!token) {
  console.error("usage: node scripts/vercel-env.mjs <token>");
  process.exit(1);
}

const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaHZvbHlza3V4dWluZnRoc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyODU1MDIsImV4cCI6MjEwNTg2MTUwMn0.Y8lrXqV_bIfpEQssDAbjwUVxCJiCpFO5b7Ow3TAOxic";
const PROJECT_SLUG = "violet";
const TEAM_SLUG = "kalsalh23s-projects";

async function api(path, options = {}) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

const teams = await api(`/v2/teams?slug=${TEAM_SLUG}`);
const teamId = teams.teams?.[0]?.id || undefined;
console.log("teamId:", teamId ?? "(none — personal scope)");

const qs = teamId ? `?teamId=${teamId}` : "";
const project = await api(`/v9/projects/${PROJECT_SLUG}${qs}`);
console.log("projectId:", project.id);

const existing = await api(`/v9/projects/${project.id}/env${qs}`);
const hasKey = (existing.envs || []).some(
  (e) => e.key === "NEXT_PUBLIC_SUPABASE_ANON_KEY"
);
const hasUrl = (existing.envs || []).some(
  (e) => e.key === "NEXT_PUBLIC_SUPABASE_URL"
);
console.log("existing envs:", (existing.envs || []).map((e) => e.key));

if (!hasKey) {
  await api(`/v10/projects/${project.id}/env${qs}`, {
    method: "POST",
    body: JSON.stringify({
      key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value: ANON_KEY,
      type: "encrypted",
      target: ["production", "preview", "development"],
    }),
  });
  console.log("added NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

if (!hasUrl) {
  await api(`/v10/projects/${project.id}/env${qs}`, {
    method: "POST",
    body: JSON.stringify({
      key: "NEXT_PUBLIC_SUPABASE_URL",
      value: "https://ebhvolyskuxuinfthslu.supabase.co",
      type: "encrypted",
      target: ["production", "preview", "development"],
    }),
  });
  console.log("added NEXT_PUBLIC_SUPABASE_URL");
}

console.log("env setup complete");
