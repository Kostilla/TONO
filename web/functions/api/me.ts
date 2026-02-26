import { Env, json, getAccessEmail } from "./_util";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const email = getAccessEmail(ctx.request);
  if (!email) return json({ error: "Unauthorized (no Access email header)" }, 401);

  const display = email.split("@")[0];
  const now = Date.now();

  await ctx.env.DB.prepare(`
    INSERT INTO users (id, display_name, role, created_at)
    VALUES (?1, ?2, 'adult', ?3)
    ON CONFLICT(id) DO UPDATE SET display_name=excluded.display_name
  `).bind(email, display, now).run();

  const user = await ctx.env.DB.prepare(
    `SELECT id, display_name as displayName, role FROM users WHERE id=?1`
  ).bind(email).first();

  return json(user);
};
