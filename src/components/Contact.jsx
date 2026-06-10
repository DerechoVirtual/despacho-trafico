import { useState } from "react";
import { Link } from "react-router-dom";
import { enviarConsulta } from "../lib/enviarConsulta.js";

export default function Contact() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipoMulta: "",
    descripcion: "",
    rgpd: false,
    web: "", // honeypot anti-spam
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.nombre.trim()) return setError("Por favor, introduce tu nombre y apellidos.");
    if (!form.telefono.trim()) return setError("Por favor, introduce tu teléfono.");
    if (!form.email.trim()) return setError("Por favor, introduce tu email.");
    if (!form.rgpd) return setError("Debes aceptar la Política de privacidad para continuar.");

    setSending(true);
    try {
      await enviarConsulta(form);
      setSuccess(
        `¡Gracias, ${form.nombre.trim().split(" ")[0]}! Hemos recibido tu consulta. Te responderemos en 24-48 horas laborables.`
      );
      setForm({
        nombre: "",
        telefono: "",
        email: "",
        tipoMulta: "",
        descripcion: "",
        rgpd: false,
        web: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";

  return (
    <section id="contacto" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Cabecera centrada */}
        <div className="text-center mb-12" data-reveal>
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-3">
            PRIMER PASO
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-navy font-bold mb-5">
            Cuéntanos tu multa
          </h2>
          <div className="hairline-gold mx-auto mb-5 w-24" />
          <p className="text-navy/70 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Rellena el formulario y te decimos sin compromiso si tu sanción
            tiene defensa. Respondemos en 24-48 horas laborables.
          </p>
        </div>

        {/* Layout 2 columnas */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          {/* IZQUIERDA — Formulario */}
          <div
            className="bg-white border border-black/5 rounded-2xl p-8 shadow-lg ring-1 ring-gold/10"
            data-reveal="left"
          >
            <form onSubmit={handleSubmit} noValidate>
              {/* Fila 1: Nombre + Teléfono */}
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="nombre" className="font-medium text-navy text-sm">
                    Nombre y apellidos
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ana García López"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="font-medium text-navy text-sm">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    name="telefono"
                    required
                    value={form.telefono}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="612 345 678"
                  />
                </div>
              </div>

              {/* Fila 2: Email + Tipo de multa */}
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="email" className="font-medium text-navy text-sm">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="ana@ejemplo.com"
                  />
                </div>
                <div>
                  <label htmlFor="tipoMulta" className="font-medium text-navy text-sm">
                    Tipo de multa
                  </label>
                  <select
                    id="tipoMulta"
                    name="tipoMulta"
                    value={form.tipoMulta}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="movil">Móvil</option>
                    <option value="velocidad">Exceso de velocidad</option>
                    <option value="aparcamiento">Aparcamiento</option>
                    <option value="carril-bus">Carril bus</option>
                    <option value="sin-itv">Sin ITV</option>
                    <option value="no-identificar">No identificar conductor</option>
                    <option value="alcoholemia">Alcoholemia / delito</option>
                    <option value="carnet-puntos">Carnet y puntos</option>
                    <option value="otra">Otra</option>
                  </select>
                </div>
              </div>

              {/* Textarea */}
              <div className="mb-5">
                <label htmlFor="descripcion" className="font-medium text-navy text-sm">
                  Cuéntanos brevemente qué ha pasado
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={4}
                  value={form.descripcion}
                  onChange={handleChange}
                  className={inputClass + " resize-none"}
                  placeholder="Ej: Me han puesto una multa de 200 € por usar el móvil. Tengo el boletín de denuncia y quiero recurrir..."
                />
              </div>

              {/* Honeypot anti-spam: invisible para humanos */}
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="contact-web">No rellenes este campo</label>
                <input
                  id="contact-web"
                  name="web"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.web}
                  onChange={handleChange}
                />
              </div>

              {/* Checkbox RGPD */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rgpd"
                    required
                    checked={form.rgpd}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20 accent-gold cursor-pointer"
                  />
                  <span className="text-sm text-navy/80 leading-relaxed">
                    He leído y acepto la{" "}
                    <Link to="/privacidad" className="text-gold-dark underline">
                      Política de privacidad
                    </Link>{" "}
                    y doy mi consentimiento para que Rivero Abogados trate mis
                    datos con el fin de gestionar mi consulta.
                  </span>
                </label>
              </div>

              {/* Mensaje de error */}
              {error && (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              {/* Mensaje de éxito */}
              {success && (
                <p className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {success}
                </p>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={sending}
                className="btn-shine w-full rounded-xl bg-gold px-6 py-4 font-semibold text-navy-900 shadow-md shadow-gold/30 transition hover:bg-gold-dark hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? "Enviando…" : "Enviar mi consulta gratis"}
              </button>
            </form>
          </div>

          {/* DERECHA — Aside */}
          <aside
            className="relative overflow-hidden bg-navy text-white rounded-2xl p-8 shadow-lg ring-1 ring-gold/20"
            data-reveal="right"
          >
            <div className="grid-navy" aria-hidden="true" />
            <h3 className="font-display text-2xl font-bold mb-7">Habla con nosotros</h3>

            <ul className="space-y-5 mb-8">
              <li className="flex items-start gap-4">
                <span className="shrink-0 mt-0.5 text-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Teléfono</p>
                  <a href="tel:900000000" className="text-white font-medium hover:text-gold transition">900 000 000</a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="shrink-0 mt-0.5 text-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Email</p>
                  <a href="mailto:info@riveroabogados.es" className="text-white font-medium hover:text-gold transition">info@riveroabogados.es</a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="shrink-0 mt-0.5 text-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Sede</p>
                  <p className="text-white font-medium">Alicante · atención nacional online</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="shrink-0 mt-0.5 text-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Horario</p>
                  <p className="text-white font-medium">Lunes a viernes, 9:00 - 19:00</p>
                </div>
              </li>
            </ul>

            <a
              href="https://wa.me/34900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white rounded-full px-6 py-3 font-semibold inline-flex items-center gap-2 hover:brightness-110 transition shadow-md mb-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Escríbenos por WhatsApp
            </a>

            <div className="border-t border-white/10 pt-6">
              <p className="text-gold font-semibold text-sm mb-2">Tus datos están seguros.</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Tratamos tu información con total confidencialidad y conforme al
                RGPD. Nunca la compartiremos con terceros.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
