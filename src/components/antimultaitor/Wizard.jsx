import { useState } from "react";
import { PREGUNTAS } from "../../data/antimultaitorPreguntas.js";
import QuestionStep from "./QuestionStep.jsx";

export default function Wizard({ answers, onAnswer, foto, setFoto, onFinish, onExit }) {
  const [step, setStep] = useState(0);
  const total = PREGUNTAS.length;
  const q = PREGUNTAS[step];
  const isLast = step === total - 1;
  const value = answers[q.id];

  const answered =
    q.tipo === "multi"
      ? Array.isArray(value) && value.length > 0
      : q.tipo === "fechas"
      ? value && (value.infraccion || value.notificacion)
      : q.tipo === "foto"
      ? !!foto
      : value != null && value !== "";

  const canNext = q.opcional || answered;
  const progress = Math.round(((step + (answered ? 1 : 0)) / total) * 100);

  function goNext() {
    if (isLast) onFinish();
    else setStep((s) => Math.min(total - 1, s + 1));
  }
  function goBack() {
    if (step === 0) onExit();
    else setStep((s) => s - 1);
  }
  function autoAdvance() {
    window.setTimeout(() => {
      if (isLast) onFinish();
      else setStep((s) => Math.min(total - 1, s + 1));
    }, 300);
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-5 py-6 sm:py-10">
      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="am-mono uppercase tracking-[0.2em] text-cyan-300/80">
            Anti Multaitor · escaneando
          </span>
          <span className="am-mono text-indigo-200/70">
            {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="am-ring h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>
      </div>

      {/* Pregunta */}
      <div key={step} className="am-rise flex-1">
        <p className="am-mono mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300/80">
          {q.eyebrow}
        </p>
        <div className="mb-2 flex items-start gap-3">
          <span className="text-3xl leading-none sm:text-4xl">{q.icono}</span>
          <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
            {q.pregunta}
          </h2>
        </div>
        {q.ayuda ? (
          <p className="mb-7 max-w-2xl text-sm leading-relaxed text-indigo-200/65 sm:text-base">
            {q.ayuda}
          </p>
        ) : null}

        <QuestionStep
          q={q}
          value={value}
          onChange={(v) => onAnswer(q.id, v)}
          foto={foto}
          setFoto={setFoto}
          onAutoAdvance={q.tipo === "single" ? autoAdvance : undefined}
        />
      </div>

      {/* Controles */}
      <div className="sticky bottom-0 mt-8 flex items-center justify-between gap-3 bg-gradient-to-t from-[#05060f] via-[#05060f]/90 to-transparent py-4">
        <button
          type="button"
          onClick={goBack}
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-indigo-100 transition hover:border-white/35 hover:bg-white/5"
        >
          ← {step === 0 ? "Salir" : "Atrás"}
        </button>

        <div className="flex items-center gap-3">
          {q.opcional ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-indigo-200/70 transition hover:text-white"
            >
              Omitir
            </button>
          ) : null}

          {q.tipo !== "single" ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={`rounded-full px-6 py-3 text-sm font-bold transition ${
                canNext
                  ? "am-ring text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
                  : "cursor-not-allowed bg-white/8 text-indigo-200/40"
              }`}
            >
              {isLast ? "🛡️ Analizar mi multa" : "Siguiente →"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
