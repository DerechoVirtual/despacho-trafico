import { useEffect, useState } from "react";

const VIA_LABEL = {
  nulidad: "Nulidad de pleno derecho",
  anulabilidad: "Anulabilidad",
  defecto_procedimiento: "Defecto de procedimiento",
  varias: "Varias vías de defensa",
  ninguna: "Sin vía clara",
};

const NIVEL = {
  alta: { txt: "Probabilidad ALTA", grad: "from-emerald-400 to-cyan-400", c1: "#34d399", c2: "#22d3ee" },
  media: { txt: "Probabilidad MEDIA", grad: "from-cyan-400 to-violet-400", c1: "#22d3ee", c2: "#a78bfa" },
  baja: { txt: "Probabilidad BAJA", grad: "from-amber-400 to-orange-400", c1: "#fbbf24", c2: "#fb923c" },
  muy_baja: { txt: "Probabilidad MUY BAJA", grad: "from-rose-400 to-orange-400", c1: "#fb7185", c2: "#fb923c" },
};

function useCountUp(target, ms = 1300) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const tick = (t) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Fallback: garantiza el valor final aunque rAF esté pausado (pestaña en
    // segundo plano, reduced-motion, etc.).
    const fb = setTimeout(() => setN(target), ms + 300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fb);
    };
  }, [target, ms]);
  return n;
}

function Gauge({ prob, nivel }) {
  const conf = NIVEL[nivel] || NIVEL.media;
  const r = 86;
  const C = 2 * Math.PI * r;
  const shown = useCountUp(prob);
  const offset = C * (1 - shown / 100);
  return (
    <div className="relative grid h-56 w-56 place-items-center">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="amGauge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={conf.c1} />
            <stop offset="100%" stopColor={conf.c2} />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="url(#amGauge)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear", filter: "drop-shadow(0 0 8px rgba(34,211,238,0.5))" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-5xl font-bold text-white">{shown}%</span>
        <span className="am-mono mt-1 text-[11px] uppercase tracking-[0.18em] text-indigo-200/70">
          viabilidad
        </span>
      </div>
    </div>
  );
}

export default function Verdict({ verdict, onAgendar, onReiniciar }) {
  const conf = NIVEL[verdict.nivel] || NIVEL.media;
  const via = VIA_LABEL[verdict.via] || verdict.via;
  const buena = verdict.viable && verdict.probabilidad >= 40;

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-5 py-10 sm:py-14">
      {verdict.demo ? (
        <p className="am-mono mb-6 rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-center text-xs text-amber-200">
          MODO DEMO local · en producción este veredicto lo genera Gemini 3.5 Flash
        </p>
      ) : null}

      {/* Cabecera con gauge */}
      <div className="am-rise flex flex-col items-center text-center">
        <span
          className={`am-mono mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${
            buena
              ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-200"
              : "border-amber-300/40 bg-amber-400/10 text-amber-200"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current am-blink" />
          {buena ? "Vía de defensa detectada" : "Conviene una revisión humana"}
        </span>

        <Gauge prob={verdict.probabilidad} nivel={verdict.nivel} />

        <p className={`am-mono mt-4 bg-gradient-to-r ${conf.grad} bg-clip-text text-sm font-bold uppercase tracking-[0.18em] text-transparent`}>
          {conf.txt}
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          {verdict.titular}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-indigo-100/75">
          {verdict.resumen}
        </p>

        <span className="am-glass mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white">
          <span className="text-violet-300">⚖️</span> Vía principal:{" "}
          <strong className="text-white">{via}</strong>
        </span>
      </div>

      {/* CTA primaria */}
      <div className="am-rise mt-10">
        <button
          type="button"
          onClick={onAgendar}
          className="am-ring am-glow flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg font-bold text-white transition hover:brightness-110"
        >
          📞 {buena ? "Agendar mi llamada gratuita" : "Que un abogado lo revise gratis"}
        </button>
        <p className="mt-2 text-center text-xs text-indigo-200/50">
          Sin compromiso · te llamamos nosotros · primera valoración gratis
        </p>
      </div>

      {/* Motivos */}
      {verdict.motivos?.length ? (
        <div className="am-rise mt-12">
          <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
            <span>🔎</span> En qué nos apoyaríamos
          </h3>
          <div className="space-y-3">
            {verdict.motivos.map((m, i) => (
              <div key={i} className="am-glass rounded-2xl p-5">
                <p className="flex items-center gap-2 font-semibold text-cyan-200">
                  <span className="am-mono text-violet-300">{String(i + 1).padStart(2, "0")}</span>
                  {m.titulo}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-indigo-100/70">{m.explicacion}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* A favor / riesgos */}
      {(verdict.puntos_a_favor?.length || verdict.riesgos?.length) ? (
        <div className="am-rise mt-6 grid gap-4 sm:grid-cols-2">
          {verdict.puntos_a_favor?.length ? (
            <div className="am-glass rounded-2xl p-5">
              <p className="mb-3 font-semibold text-emerald-300">A tu favor</p>
              <ul className="space-y-2">
                {verdict.puntos_a_favor.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-indigo-100/75">
                    <span className="mt-0.5 text-emerald-300">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {verdict.riesgos?.length ? (
            <div className="am-glass rounded-2xl p-5">
              <p className="mb-3 font-semibold text-amber-300">A tener en cuenta</p>
              <ul className="space-y-2">
                {verdict.riesgos.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-indigo-100/75">
                    <span className="mt-0.5 text-amber-300">!</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Plazo / urgencia */}
      {verdict.plazo ? (
        <div className="am-rise mt-6 flex items-start gap-3 rounded-2xl border border-rose-300/25 bg-rose-500/10 p-5">
          <span className="text-2xl">⏱️</span>
          <div>
            <p className="font-semibold text-rose-200">El tiempo corre</p>
            <p className="mt-1 text-sm leading-relaxed text-rose-100/80">{verdict.plazo}</p>
          </div>
        </div>
      ) : null}

      {/* Descargo + reiniciar */}
      <p className="am-rise mt-10 text-center text-xs leading-relaxed text-indigo-200/40">
        {verdict.descargo}
      </p>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onReiniciar}
          className="text-sm font-medium text-indigo-200/60 underline-offset-4 transition hover:text-white hover:underline"
        >
          Analizar otra multa
        </button>
      </div>
    </div>
  );
}
