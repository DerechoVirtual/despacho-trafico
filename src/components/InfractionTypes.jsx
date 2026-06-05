import { useState } from "react";

const infractions = [
  "Móvil al volante",
  "Exceso de velocidad",
  "Aparcamiento indebido",
  "Carril bus o VAO",
  "Conducir sin ITV",
  "No identificar al conductor",
  "Alcoholemia",
  "Drogas al volante",
  "Saltarse un semáforo en rojo",
  "Conducir sin permiso",
  "Negativa a la prueba de alcoholemia",
  "Documentación o seguro",
];

function GoldDot() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="currentColor"
      className="text-gold shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

export default function InfractionTypes() {
  return (
    <section id="multas" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — imagen */}
          <div className="relative">
            <img
              src="/imagenes/multa.png"
              alt="Agente de tráfico tramitando una multa"
              className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3] lg:aspect-[3/4]"
            />
            {/* Decorative accent */}
            <div
              className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl bg-gold/20 -z-10"
              aria-hidden="true"
            />
            <div
              className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-navy/10 -z-10"
              aria-hidden="true"
            />
          </div>

          {/* RIGHT — contenido */}
          <div className="flex flex-col gap-6">
            {/* Eyebrow */}
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold">
              ¿Qué te ha pasado?
            </p>

            {/* Heading */}
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.6rem] leading-tight text-navy">
              Tipos de multa
              <br />
              que recurrimos
            </h2>

            {/* Paragraph */}
            <p className="text-navy/70 text-base leading-relaxed max-w-prose">
              Estas son las sanciones que defendemos a diario. Cada una tiene
              sus propios plazos y resquicios legales: por eso conviene que la
              vea un especialista antes de pagar.
            </p>

            {/* Pills grid */}
            <div className="flex flex-wrap gap-3">
              {infractions.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 bg-white border border-black/5 rounded-full px-4 py-2 text-sm font-medium text-navy shadow-sm"
                >
                  <GoldDot />
                  {label}
                </span>
              ))}
            </div>

            {/* CTA block */}
            <div className="mt-2 flex flex-col gap-4">
              <p className="text-navy/60 text-sm italic">
                ¿No ves la tuya? Cuéntanos tu caso igualmente.
              </p>
              <div>
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
                >
                  Cuéntanos tu multa
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="ml-2 w-4 h-4"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
