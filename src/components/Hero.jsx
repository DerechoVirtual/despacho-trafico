import { useState } from "react";
import { enviarConsulta } from "../lib/enviarConsulta.js";

export default function Hero() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nombre: "", telefono: "", tipo: "", web: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await enviarConsulta({
        nombre: form.nombre,
        telefono: form.telefono,
        tipoMulta: form.tipo,
        descripcion: "(Consulta rápida desde el formulario de inicio)",
        web: form.web, // honeypot anti-spam (los humanos no lo ven)
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-between bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(15,44,77,.94) 0%, rgba(15,44,77,.72) 45%, rgba(15,44,77,.30) 100%), url('/imagenes/hero.jpg')",
      }}
    >
      {/* Capa siglo XXII: aurora + retícula fina sobre la foto */}
      <div className="aurora-navy" aria-hidden="true" />
      <div className="grid-navy" aria-hidden="true" />

      {/* Contenido principal */}
      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-12 flex-1 flex items-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Columna izquierda: copy */}
          <div className="flex flex-col gap-6">
            {/* Eyebrow pill */}
            <div className="hero-enter inline-flex items-center self-start">
              <span className="rounded-full border border-gold/70 bg-navy-900/30 px-4 py-1.5 text-xs font-semibold tracking-widest text-gold uppercase backdrop-blur-sm">
                Especialistas en Derecho de Tráfico
              </span>
            </div>

            {/* H1 */}
            <h1
              className="hero-enter font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              style={{ "--rd": "120ms" }}
            >
              ¿Te han multado? Recurre tu sanción y{" "}
              <span className="text-gold-grad">protege tus puntos.</span>
            </h1>

            {/* Subtítulo */}
            <p
              className="hero-enter text-white/80 text-lg leading-relaxed max-w-xl"
              style={{ "--rd": "240ms" }}
            >
              Estudiamos tu multa <strong className="text-white">GRATIS</strong> y
              te decimos con total honestidad si tiene recurso. Si lo tiene,
              peleamos por ti hasta el final. Sin tecnicismos, sin
              desplazamientos y en toda España.
            </p>

            {/* CTAs */}
            <div className="hero-enter flex flex-wrap gap-4 mt-2" style={{ "--rd": "360ms" }}>
              <a
                href="#contacto"
                className="btn-shine pulse-gold inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
              >
                Estudia mi multa gratis
              </a>
              <a
                href="#proceso"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/60 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Ver cómo trabajamos
              </a>
            </div>

            {/* Fila de confianza */}
            <div
              className="hero-enter mt-6 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
              style={{ "--rd": "480ms" }}
            >
              {/* Item 1 */}
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>+100 expedientes gestionados</span>
              </div>
              {/* Item 2 */}
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Toda España · 100% online</span>
              </div>
              {/* Item 3 */}
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Carlos Rivero · Colegiado ICAM 12.345</span>
              </div>
            </div>
          </div>

          {/* Columna derecha: tarjeta formulario */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="hero-enter glass-card w-full max-w-sm rounded-2xl p-8 shadow-2xl ring-1 ring-gold/25"
              style={{ "--rd": "300ms" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-green-700 font-semibold text-lg">
                    ¡Gracias! Te contactaremos en menos de 48 h.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Revisaremos tu caso y te llamamos con total honestidad.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-navy text-xl font-bold mb-1">
                    Consulta gratis en 1 minuto
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Cuéntanos lo justo y te llamamos.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Nombre */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="nombre"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >
                        Nombre
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        placeholder="Tu nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition"
                      />
                    </div>
                    {/* Teléfono */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="telefono"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >
                        Teléfono
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        placeholder="600 000 000"
                        value={form.telefono}
                        onChange={handleChange}
                        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition"
                      />
                    </div>
                    {/* Tipo de multa */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="tipo"
                        className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                      >
                        Tipo de multa
                      </label>
                      <select
                        id="tipo"
                        name="tipo"
                        required
                        value={form.tipo}
                        onChange={handleChange}
                        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition bg-white"
                      >
                        <option value="" disabled>
                          Selecciona una opción
                        </option>
                        <option value="movil">Móvil al volante</option>
                        <option value="velocidad">Exceso de velocidad</option>
                        <option value="aparcamiento">Aparcamiento</option>
                        <option value="alcoholemia">
                          Alcoholemia / delito
                        </option>
                        <option value="carnet">Carnet y puntos</option>
                        <option value="otra">Otra</option>
                      </select>
                    </div>
                    {/* Honeypot anti-spam: invisible para humanos */}
                    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                      <label htmlFor="hero-web">No rellenes este campo</label>
                      <input
                        id="hero-web"
                        name="web"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.web}
                        onChange={handleChange}
                      />
                    </div>
                    {error && (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                        {error}
                      </p>
                    )}
                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-shine inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark mt-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {sending ? "Enviando…" : "Quiero que estudien mi multa"}
                    </button>
                  </form>
                  <p className="mt-4 text-center text-xs text-gray-400">
                    Sin compromiso. Tus datos están protegidos (RGPD).
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Franja de urgencia */}
      <div className="relative w-full bg-gold/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-center gap-3 text-navy-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-semibold text-center">
            Solo tienes{" "}
            <strong className="underline underline-offset-2">
              20 días naturales
            </strong>{" "}
            para recurrir desde que te notifican. No dejes que se pase el plazo.
          </p>
        </div>
      </div>
    </section>
  );
}
