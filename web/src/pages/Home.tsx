import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

export default function Home() {
  const [me, setMe] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGet("/api/me").then(setMe).catch(e => setErr(String(e)));
  }, []);

  return (
    <div>
      <h2>Inicio</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {me ? <p>Hola, <b>{me.displayName}</b></p> : <p>Cargando...</p>}
    </div>
  );
}
