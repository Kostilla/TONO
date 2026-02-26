export type Env = { DB: D1Database };

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export function getAccessEmail(req: Request) {
  return (
    req.headers.get("Cf-Access-Authenticated-User-Email") ||
    req.headers.get("cf-access-authenticated-user-email") ||
    ""
  ).toLowerCase();
}
