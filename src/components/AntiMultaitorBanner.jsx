import { Link } from "react-router-dom";

export default function AntiMultaitorBanner() {
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6" data-reveal="zoom">
        <div className="card-lift relative overflow-hidden rounded-3xl border border-transparent bg-[#0b1020] px-7 py-12 shadow-2xl md:px-14 md:py-16">
          {/* Glow / malla decorativa */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(40rem 24rem at 8% -20%, rgba(34,211,238,0.22), transparent 60%), radial-gradient(40rem 24rem at 100% 120%, rgba(139,92,246,0.25), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(123,156,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(123,156,255,0.08) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
              maskImage: "radial-gradient(circle at 70% 30%, #000, transparent 75%)",
            }}
          />

          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <span
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Nuevo · Asistente con IA
              </span>
              <h2
                className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
                style={{
                  fontFamily: '"Space Grotesk", "Inter", sans-serif',
                }}
              >
                Descubre si tu multa{" "}
                <span
                  className="text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(100deg,#67e8f9,#a78bfa 60%,#f5c97a)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  se puede anular
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-indigo-100/75 md:text-lg">
                <strong className="text-white">Anti Multaitor</strong> es nuestro asistente con
                inteligencia artificial. Responde unas preguntas (o sube tu boletín) y en 2 minutos
                te dice si tiene posibilidades reales de prosperar por nulidad o anulabilidad.
                Gratis y sin compromiso.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  to="/anti-multaitor"
                  className="btn-shine inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-white transition hover:brightness-110"
                  style={{
                    backgroundImage: "linear-gradient(135deg,#22d3ee,#8b5cf6)",
                    boxShadow: "0 14px 40px -12px rgba(139,92,246,0.7)",
                  }}
                >
                  🛡️ Probar Anti Multaitor
                </Link>
                <span className="text-sm text-indigo-200/55">12 preguntas · 2 min · 100% confidencial</span>
              </div>
            </div>

            {/* Emblema */}
            <div className="relative hidden h-44 w-44 place-items-center md:grid">
              <span className="absolute inset-0 rounded-full border border-cyan-300/25 [animation:am-pulse-ring_3s_ease-out_infinite]" />
              <span className="absolute inset-3 rounded-full border border-dashed border-violet-300/25 am-spin-slow" />
              <img
                src="/imagenes/anti-multaitor-emblema.jpg"
                alt="Anti Multaitor"
                className="h-32 w-32 rounded-full object-cover"
                style={{ boxShadow: "0 0 50px rgba(34,211,238,0.45)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
