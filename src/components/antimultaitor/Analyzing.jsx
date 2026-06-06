import { useEffect, useState } from "react";

const PASOS = [
  "Conectando con el núcleo jurídico de Anti Multaitor…",
  "Leyendo los datos de tu expediente…",
  "Comprobando plazos: caducidad y prescripción…",
  "Revisando la notificación (arts. 40-44 Ley 39/2015)…",
  "Verificando homologación y calibración del radar…",
  "Comprobando el trámite de identificación del conductor…",
  "Rastreando defectos de procedimiento y de motivación…",
  "Contrastando con jurisprudencia de tráfico…",
  "Ponderando nulidad frente a anulabilidad…",
  "Calculando tu probabilidad de éxito…",
];

export default function Analyzing({ conFoto }) {
  const pasos = conFoto
    ? [PASOS[0], "Leyendo el documento que has subido…", ...PASOS.slice(1)]
    : PASOS;
  const [visibles, setVisibles] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setVisibles((v) => (v < pasos.length ? v + 1 : v));
    }, 1400);
    return () => clearInterval(id);
  }, [pasos.length]);

  return (
    <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      {/* Núcleo de IA */}
      <div className="relative mb-10 grid h-44 w-44 place-items-center">
        <span className="absolute inset-0 rounded-full border border-cyan-300/30 [animation:am-pulse-ring_2.6s_ease-out_infinite]" />
        <span className="absolute inset-0 rounded-full border border-violet-300/30 [animation:am-pulse-ring_2.6s_ease-out_infinite_0.9s]" />
        <span className="am-spin-slow absolute inset-2 rounded-full border-2 border-dashed border-cyan-300/25" />
        <span className="am-spin-rev absolute inset-6 rounded-full border border-violet-300/30" />
        <span className="am-core am-float grid h-24 w-24 place-items-center rounded-full text-4xl">
          🛡️
        </span>
      </div>

      <p className="am-mono mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
        Razonando · no cierres esta ventana
      </p>
      <h2 className="am-gradient-text mb-8 font-display text-3xl font-bold sm:text-4xl">
        Analizando tu caso
      </h2>

      {/* Log de razonamiento */}
      <div className="am-glass w-full rounded-2xl p-5 text-left">
        <ul className="space-y-2.5">
          {pasos.slice(0, visibles).map((p, i) => {
            const last = i === visibles - 1 && visibles < pasos.length;
            return (
              <li key={i} className="am-rise flex items-start gap-3 text-sm">
                {last ? (
                  <span className="mt-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-cyan-300/40 border-t-cyan-300" />
                ) : (
                  <span className="mt-0.5 shrink-0 text-emerald-300">✓</span>
                )}
                <span className={last ? "am-mono text-indigo-100" : "am-mono text-indigo-200/55"}>
                  {p}
                </span>
              </li>
            );
          })}
          {visibles >= pasos.length ? (
            <li className="am-rise flex items-start gap-3 text-sm">
              <span className="mt-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-violet-300/40 border-t-violet-300" />
              <span className="am-mono text-indigo-100">
                Redactando tu veredicto<span className="am-blink">_</span>
              </span>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
