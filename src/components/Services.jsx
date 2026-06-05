import { useState } from "react";

const services = [
  {
    id: 1,
    title: "Alegaciones a la denuncia",
    description:
      "Acabas de recibir la multa y aún estás a tiempo. Redactamos y presentamos un escrito defendiendo tu caso para que la Administración la archive antes de que vaya a más.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    featured: false,
  },
  {
    id: 2,
    title: "Identificación del conductor",
    description:
      "Te exigen decir quién conducía y un error aquí se paga caro. Te asesoramos y respondemos correctamente para evitar una sanción aún mayor.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
        />
      </svg>
    ),
    featured: false,
  },
  {
    id: 3,
    title: "Recurso de reposición",
    description:
      "Ya te han sancionado, pero la pelea no ha terminado. Recurrimos la resolución ante el propio organismo que te multó buscando su anulación.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
    featured: false,
  },
  {
    id: 4,
    title: "Oposición al apremio",
    description:
      "Te reclaman el pago con recargo o te amenazan con un embargo. Frenamos el procedimiento de cobro cuando tiene defectos que lo invalidan.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
    ),
    featured: false,
  },
  {
    id: 5,
    title: "Defensa penal de tráfico",
    description:
      "Alcoholemia, drogas, conducir sin carnet o a velocidad temeraria son delitos (arts. 379 a 385 del Código Penal). Aquí te juegas mucho: te defendemos en el juzgado con todas las garantías.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    featured: true,
  },
  {
    id: 6,
    title: "Carnet y licencias",
    description:
      "¿Te quedas sin puntos o pierdes la vigencia del permiso? Te ayudamos con la recuperación del carnet y los trámites de licencias para que vuelvas a conducir cuanto antes.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 9a2 2 0 10-4 0v5a2 2 0 01-2 2h6m-6-4h4m8 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    featured: false,
  },
];

function ServiceCard({ service }) {
  if (service.featured) {
    return (
      <div className="bg-navy rounded-2xl p-7 shadow-sm flex flex-col gap-5 border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-start gap-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/20 text-gold shrink-0">
            {service.icon}
          </span>
          <div className="pt-1">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] text-gold mb-1">
              Defensa penal
            </span>
            <h3 className="font-semibold text-white text-lg leading-snug">
              {service.title}
            </h3>
          </div>
        </div>
        <p className="text-white/70 text-[15px] leading-relaxed flex-1">
          {service.description}
        </p>
        <a
          href="#contacto"
          className="inline-flex items-center gap-1 text-gold font-semibold text-sm hover:gap-2 transition-all duration-200 mt-auto"
        >
          Consúltanos
          <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm flex flex-col gap-5 border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/15 text-gold-dark shrink-0">
        {service.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-navy text-lg leading-snug mb-2">
          {service.title}
        </h3>
        <p className="text-slate-600 text-[15px] leading-relaxed">
          {service.description}
        </p>
      </div>
      <a
        href="#contacto"
        className="inline-flex items-center gap-1 text-gold-dark font-semibold text-sm hover:gap-2 transition-all duration-200 mt-auto"
      >
        Consúltanos
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

export default function Services() {
  return (
    <section id="servicios" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
            En qué te ayudamos
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-navy mt-3 mb-4 leading-tight">
            Nuestros servicios
          </h2>
          <p className="text-slate-600 text-[17px] leading-relaxed">
            Nos ocupamos de todo el proceso, desde la primera carta hasta la
            resolución final. Tú solo nos cuentas qué ha pasado.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
