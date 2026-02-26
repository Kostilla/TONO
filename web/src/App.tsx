import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Shopping from "./pages/Shopping";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 12 }}>
        <nav style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <Link to="/">Inicio</Link>
          <Link to="/shopping">Compra</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shopping" element={<Shopping />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

