import { useState } from "react";
import { agendarLlamada } from "../../lib/antimultaitor.js";

const FRANJAS = [
  { value: "Mañana (9-14h)", emoji: "🌅" },
  { value: "Tarde (14-19h)", emoji: "🌇" },
  { value: "Indiferente", emoji: "🕐" },
];

export default function LeadForm({ verdict, transcript }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    franja: "Indiferente",
    rgpd: false,
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.nombre.trim()) return setError("Dinos tu nombre, por favor.");
    if (!form.telefono.trim()) return setError("Necesitamos un teléfono para llamarte.");
    if (!form.rgpd) return setError("Debes aceptar la Política de privacidad para continuar.");

    setSending(true);
    try {
      await agendarLlamada({
        nombre: form.nombre,
        telefono: form.telefono,
        email: form.email,
        franja: form.franja,
        verdict,
        transcript,
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div id="am-agendar" className="relative z-10 mx-auto max-w-2xl px-5 pb-20">
        <div className="am-glass am-rise rounded-3xl p-8 text-center sm:p-12">
          <div className="am-core am-float mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full text-4xl">
            ✓
          </div>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            ¡Hecho, {form.nombre.trim().split(" ")[0]}!
          </h2>
          <p className="mx-auto mt-3 max-w-md text-indigo-100/75">
            Tu caso ya está en manos del equipo de Rivero Abogados. Te llamaremos en la
            franja de <strong className="text-white">{form.franja.toLowerCase()}</strong> para
            contarte cómo plantar cara a tu multa.
          </p>
          <p className="am-mono mt-6 text-xs uppercase tracking-[0.2em] text-cyan-300/70">
            Anti Multaitor está de tu lado 🛡️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="am-agendar" className="relative z-10 mx-auto max-w-2xl px-5 pb-20">
      <div className="am-glass rounded-3xl p-7 sm:p-10">
        <p className="am-mono mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
          Último paso
        </p>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Agenda tu llamada gratuita
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-indigo-100/65">
          Un abogado especialista revisará tu análisis y te dirá exactamente qué hacer.
          Sin coste y sin compromiso.
        </p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-indigo-200/70">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={change}
                className="am-input w-full rounded-xl px-4 py-3"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-indigo-200/70">Teléfono</label>
              <input
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={change}
                className="am-input w-full rounded-xl px-4 py-3"
                placeholder="612 345 678"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-indigo-200/70">
              Email <span className="text-indigo-200/40">(opcional)</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              className="am-input w-full rounded-xl px-4 py-3"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-indigo-200/70">
              ¿Cuándo prefieres que te llamemos?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {FRANJAS.map((f) => {
                const active = form.franja === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, franja: f.value }))}
                    className={`am-option am-glass rounded-xl px-2 py-3 text-center text-sm ${
                      active ? "am-option-active" : ""
                    }`}
                  >
                    <span className="block text-lg">{f.emoji}</span>
                    <span className="mt-1 block text-xs text-white">{f.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="rgpd"
              checked={form.rgpd}
              onChange={change}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 accent-cyan-400"
            />
            <span className="text-xs leading-relaxed text-indigo-200/65">
              He leído y acepto la{" "}
              <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">
                Política de privacidad
              </a>{" "}
              y doy mi consentimiento para que Rivero Abogados trate mis datos y me contacte
              sobre mi consulta.
            </span>
          </label>

          {error ? (
            <p className="rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={sending}
            className="am-ring flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {sending ? "Enviando…" : "📞 Quiero que me llamen"}
          </button>
        </form>
      </div>
    </div>
  );
}
