import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../lib/api";

type Item = { id: string; text: string; is_done: number; };

export default function Shopping() {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const refresh = async () => {
    setErr("");
    try {
      setItems(await apiGet<Item[]>("/api/shopping?list=principal"));
    } catch (e:any) { setErr(String(e)); }
  };

  useEffect(() => { refresh(); }, []);

  const add = async () => {
    const t = text.trim();
    if (!t) return;
    await apiSend("/api/shopping", "POST", { text: t });
    setText("");
    refresh();
  };

  const toggle = async (it: Item) => {
    await apiSend("/api/shopping", "PUT", { id: it.id, is_done: it.is_done ? 0 : 1 });
    refresh();
  };

  return (
    <div>
      <h2>Compra</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Añadir rápido" style={{ flex: 1 }} />
        <button onClick={add}>Añadir</button>
      </div>

      <ul style={{ paddingLeft: 18 }}>
        {items.map(it => (
          <li key={it.id} style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={!!it.is_done} onChange={() => toggle(it)} />
              <span style={{ textDecoration: it.is_done ? "line-through" : "none" }}>{it.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
