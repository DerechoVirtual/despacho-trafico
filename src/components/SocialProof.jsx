import { useState } from "react";

const stats = [
  { number: "+100", label: "expedientes gestionados" },
  { number: "8", label: "tipos de infracción que cubrimos" },
  { number: "Nacional", label: "clientes en toda España" },
  { number: "ICAM 12.345", label: "abogado colegiado" },
];

const testimonials = [
  {
    text: "Me multaron por el móvil y di la multa por perdida. Ellos presentaron alegaciones y la archivaron. Recuperé mis 6 puntos.",
    cite: "Resuelto a favor del cliente · Valencia",
  },
  {
    text: "Tenía una multa de velocidad que parecía imposible. La Administración tardó demasiado y consiguieron que prescribiera.",
    cite: "Archivado por prescripción · Murcia",
  },
  {
    text: "Me llegó una providencia de apremio con embargo incluido. Presentaron oposición y frenaron el cobro.",
    cite: "Oposición al apremio estimada · Alicante",
  },
];

function QuoteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="currentColor"
      className="w-10 h-10 text-[#c8a45c] mb-4 opacity-80"
      aria-hidden="true"
    >
      <path d="M10 8C5.6 8 2 11.6 2 16v8h8v-8H6c0-2.2 1.8-4 4-4V8zm16 0c-4.4 0-8 3.6-8 8v8h8v-8h-4c0-2.2 1.8-4 4-4V8z" />
    </svg>
  );
}

export default function SocialProof() {
  return (
    <section
      id="casos"
      className="py-20 md:py-28 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,44,77,.94), rgba(10,31,55,.97)), url('/imagenes/justicia.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">

        {/* Cabecera centrada */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#c8a45c] mb-3">
            RESULTADOS REALES
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Casos de éxito
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto text-lg leading-relaxed">
            Datos de expedientes reales del despacho. Por respeto a nuestros
            clientes, todos los casos están anonimizados.
          </p>
        </div>

        {/* Banda de estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-[#c8a45c] mb-2 leading-none">
                {stat.number}
              </p>
              <p className="text-slate-300 text-sm leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col"
            >
              <QuoteIcon />
              <blockquote className="flex-1">
                <p className="text-slate-200 italic text-base leading-relaxed mb-5">
                  "{t.text}"
                </p>
                <cite className="not-italic font-semibold text-[#c8a45c] text-sm tracking-wide">
                  {t.cite}
                </cite>
              </blockquote>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
