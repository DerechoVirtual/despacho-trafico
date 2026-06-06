import { useState } from "react";
import { irAlPago } from "../lib/checkout.js";

// Botón que inicia el pago con Stripe para un servicio (slug).
export default function BotonPago({ slug, children, className = "" }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function onClick() {
    setError("");
    setCargando(true);
    try {
      await irAlPago(slug); // redirige a Stripe
    } catch (e) {
      setError(e.message);
      setCargando(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={cargando}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {cargando ? "Redirigiendo al pago…" : children}
      </button>
      {error && (
        <span className="max-w-xs text-center text-xs text-red-600">{error}</span>
      )}
    </span>
  );
}
