import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Servicios from "./pages/Servicios.jsx";
import ServicioDetalle from "./pages/ServicioDetalle.jsx";
import SobreMi from "./pages/SobreMi.jsx";
import Opiniones from "./pages/Opiniones.jsx";
import Contacto from "./pages/Contacto.jsx";
import PagoConfirmado from "./pages/PagoConfirmado.jsx";
import AvisoLegal from "./pages/AvisoLegal.jsx";
import Privacidad from "./pages/Privacidad.jsx";
import Cookies from "./pages/Cookies.jsx";
import AntiMultaitor from "./pages/AntiMultaitor.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/:slug" element={<ServicioDetalle />} />
          <Route path="/sobre-mi" element={<SobreMi />} />
          <Route path="/opiniones" element={<Opiniones />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/pago-confirmado" element={<PagoConfirmado />} />
        </Route>
        <Route path="/anti-multaitor" element={<AntiMultaitor />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cookies" element={<Cookies />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
