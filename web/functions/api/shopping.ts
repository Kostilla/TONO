import { Env, json, getAccessEmail } from "./_util";

const nowMs = () => Date.now();
const uid = () => crypto.randomUUID();

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const email = getAccessEmail(ctx.request);
  if (!email) return json({ error: "Unauthorized" }, 401);

  const url = new URL(ctx.request.url);
  const list = url.searchParams.get("list") || "principal";

  const res = await ctx.env.DB.prepare(
    `SELECT * FROM shopping_items WHERE list_name=?1 ORDER BY is_done ASC, updated_at DESC`
  ).bind(list).all();

  return json(res.results);
};

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const email = getAccessEmail(ctx.request);
  if (!email) return json({ error: "Unauthorized" }, 401);

  const body = await ctx.request.json().catch(() => ({} as any));
  const text = String(body.text || "").trim();
  if (!text) return json({ error: "text is required" }, 400);

  const item = {
    id: uid(),
    text,
    qty: body.qty ? String(body.qty) : null,
    category: body.category ? String(body.category) : null,
    is_done: 0,
    list_name: body.list_name ? String(body.list_name) : "principal",
    added_by: email,
    updated_at: nowMs()
  };

  await ctx.env.DB.prepare(`
    INSERT INTO shopping_items (id, text, qty, category, is_done, list_name, added_by, updated_at)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
  `).bind(item.id, item.text, item.qty, item.category, item.is_done, item.list_name, item.added_by, item.updated_at).run();

  return json(item, 201);
};

export const onRequestPut: PagesFunction<Env> = async (ctx) => {
  const email = getAccessEmail(ctx.request);
  if (!email) return json({ error: "Unauthorized" }, 401);

  const body = await ctx.request.json().catch(() => ({} as any));
  const id = String(body.id || "");
  if (!id) return json({ error: "id is required" }, 400);

  await ctx.env.DB.prepare(`
    UPDATE shopping_items
    SET is_done = COALESCE(?2, is_done),
        text = COALESCE(?3, text),
        qty = COALESCE(?4, qty),
        category = COALESCE(?5, category),
        updated_at = ?6
    WHERE id=?1
  `).bind(
    id,
    body.is_done !== undefined ? (body.is_done ? 1 : 0) : null,
    body.text !== undefined ? String(body.text) : null,
    body.qty !== undefined ? String(body.qty) : null,
    body.category !== undefined ? String(body.category) : null,
    nowMs()
  ).run();

  const row = await ctx.env.DB.prepare(`SELECT * FROM shopping_items WHERE id=?1`).bind(id).first();
  return json(row);
};

export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const email = getAccessEmail(ctx.request);
  if (!email) return json({ error: "Unauthorized" }, 401);

  const url = new URL(ctx.request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "id query param required" }, 400);

  await ctx.env.DB.prepare(`DELETE FROM shopping_items WHERE id=?1`).bind(id).run();
  return json({ ok: true });
};
