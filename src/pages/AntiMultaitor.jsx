import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo.js";
import { construirTranscript, analizarMulta } from "../lib/antimultaitor.js";
import Wizard from "../components/antimultaitor/Wizard.jsx";
import Analyzing from "../components/antimultaitor/Analyzing.jsx";
import Verdict from "../components/antimultaitor/Verdict.jsx";
import LeadForm from "../components/antimultaitor/LeadForm.jsx";

// Emblema generado con IA (gpt-image-2). Si no existe aún, se usa el núcleo CSS.
const EMBLEMA = "/imagenes/anti-multaitor-emblema.jpg";

function fallbackCliente() {
  return {
    viable: true,
    probabilidad: 50,
    nivel: "media",
    via: "varias",
    titular: "Tu caso merece una revisión humana",
    resumen:
      "No hemos podido completar el análisis automático, pero por lo que cuentas hay margen para estudiarlo. Un abogado de Rivero Abogados lo revisará gratis.",
    motivos: [],
    plazo: "Los plazos para recurrir corren rápido. Cuanto antes lo veamos, mejor.",
    siguiente_paso: "Agenda una llamada gratuita con el equipo.",
    descargo: "Análisis orientativo automatizado, no es un dictamen jurídico definitivo.",
    fallback: true,
  };
}

export default function AntiMultaitor() {
  useSeo({
    title: "Anti Multaitor · Descubre si puedes anular tu multa | Rivero Abogados",
    description:
      "Anti Multaitor, el asistente con IA que analiza tu multa de tráfico en 2 minutos y te dice si tiene posibilidades de anularse por nulidad o anulabilidad. Gratis y sin compromiso.",
    path: "/anti-multaitor",
  });

  const [phase, setPhase] = useState("intro"); // intro | wizard | analyzing | result
  const [answers, setAnswers] = useState({});
  const [foto, setFoto] = useState(null);
  const [verdict, setVerdict] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  const onAnswer = (id, value) => setAnswers((p) => ({ ...p, [id]: value }));

  async function finish() {
    setPhase("analyzing");
    const transcript = construirTranscript(answers);
    try {
      const v = await analizarMulta({ transcript, foto });
      setVerdict(v);
    } catch {
      setVerdict(fallbackCliente());
    }
    setPhase("result");
  }

  function reiniciar() {
    setAnswers({});
    setFoto(null);
    setVerdict(null);
    setPhase("intro");
  }

  function scrollAgendar() {
    document.getElementById("am-agendar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="am-page">
      {/* Topbar */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-indigo-100/80 transition hover:text-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 font-display text-base font-bold text-cyan-300">
            R
          </span>
          <span className="hidden sm:inline">Rivero Abogados</span>
        </Link>
        <span className="am-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">
          Gratis · 2 min · sin compromiso
        </span>
      </header>

      {phase === "intro" && <Intro onStart={() => setPhase("wizard")} />}

      {phase === "wizard" && (
        <Wizard
          answers={answers}
          onAnswer={onAnswer}
          foto={foto}
          setFoto={setFoto}
          onFinish={finish}
          onExit={() => setPhase("intro")}
        />
      )}

      {phase === "analyzing" && <Analyzing conFoto={!!foto} />}

      {phase === "result" && verdict && (
        <>
          <Verdict verdict={verdict} onAgendar={scrollAgendar} onReiniciar={reiniciar} />
          <LeadForm verdict={verdict} transcript={construirTranscript(answers)} />
        </>
      )}

      {/* Pie mínimo */}
      <footer className="relative z-10 border-t border-white/8 px-5 py-6 text-center">
        <p className="text-xs text-indigo-200/40">
          Anti Multaitor es una herramienta de orientación de{" "}
          <Link to="/" className="text-indigo-200/70 underline-offset-2 hover:underline">
            Rivero Abogados
          </Link>
          . No sustituye el asesoramiento jurídico personalizado.
        </p>
      </footer>
    </div>
  );
}

function Intro({ onStart }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-6 pb-16 text-center sm:pt-10">
      {/* Emblema */}
      <div className="relative mb-8 grid h-40 w-40 place-items-center sm:h-48 sm:w-48">
        <span className="absolute inset-0 rounded-full border border-cyan-300/20 [animation:am-pulse-ring_3s_ease-out_infinite]" />
        <span className="am-spin-slow absolute inset-1 rounded-full border border-dashed border-violet-300/20" />
        {imgOk ? (
          <img
            src={EMBLEMA}
            alt="Anti Multaitor"
            onError={() => setImgOk(false)}
            className="am-float h-36 w-36 rounded-full object-cover shadow-2xl shadow-violet-900/50 sm:h-44 sm:w-44"
          />
        ) : (
          <span className="am-core am-float grid h-28 w-28 place-items-center rounded-full text-5xl">
            🛡️
          </span>
        )}
      </div>

      <span className="am-mono mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 am-blink" /> Asistente con IA
      </span>

      <h1 className="am-gradient-text font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
        ANTI MULTAITOR
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-indigo-100/80 sm:text-xl">
        ¿Te han multado? Antes de pagar, deja que la inteligencia artificial analice tu
        sanción y te diga si puede <strong className="text-white">anularse</strong>. Velamos por
        tus derechos y por el dinero que te han quitado injustamente.
      </p>

      {/* Chips */}
      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
        {[
          { e: "⚖️", t: "Nulidad y anulabilidad", d: "Detecta defectos legales" },
          { e: "🔎", t: "Lee tu boletín", d: "Análisis del documento con IA" },
          { e: "🎯", t: "Plan de acción", d: "Veredicto claro en 2 minutos" },
        ].map((c) => (
          <div key={c.t} className="am-glass rounded-2xl p-4 text-left">
            <span className="text-2xl">{c.e}</span>
            <p className="mt-2 font-semibold text-white">{c.t}</p>
            <p className="text-sm text-indigo-200/55">{c.d}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onStart}
        className="am-ring am-glow mt-10 flex items-center justify-center gap-3 rounded-2xl px-9 py-5 text-lg font-bold text-white transition hover:brightness-110"
      >
        🛡️ Analizar mi multa gratis
      </button>
      <p className="mt-3 text-sm text-indigo-200/50">
        12 preguntas rápidas · puedes omitir las que no sepas · 100% confidencial
      </p>
    </section>
  );
}
