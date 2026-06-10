import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import "./index.css";

// Code-splitting por ruta: la home carga al instante y el resto de páginas se
// descargan solo cuando se visitan (chunks separados generados por Vite).
const Servicios = lazy(() => import("./pages/Servicios.jsx"));
const ServicioDetalle = lazy(() => import("./pages/ServicioDetalle.jsx"));
const SobreMi = lazy(() => import("./pages/SobreMi.jsx"));
const Opiniones = lazy(() => import("./pages/Opiniones.jsx"));
const Contacto = lazy(() => import("./pages/Contacto.jsx"));
const PagoConfirmado = lazy(() => import("./pages/PagoConfirmado.jsx"));
const AvisoLegal = lazy(() => import("./pages/AvisoLegal.jsx"));
const Privacidad = lazy(() => import("./pages/Privacidad.jsx"));
const Cookies = lazy(() => import("./pages/Cookies.jsx"));
const AntiMultaitor = lazy(() => import("./pages/AntiMultaitor.jsx"));

// Indicador mínimo mientras se descarga el chunk de una página.
function PageLoader() {
  return (
    <div
      className="grid min-h-[55vh] place-items-center bg-white"
      role="status"
      aria-label="Cargando página"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-gold/30 border-t-gold" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
