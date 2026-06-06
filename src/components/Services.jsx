import { Link } from "react-router-dom";
import { servicios } from "../data/servicios.js";
import ServiceIcon from "./ServiceIcon.jsx";

function ServiceCard({ service }) {
  const to = `/servicios/${service.slug}`;
  if (service.destacado) {
    return (
      <div className="bg-navy rounded-2xl p-7 shadow-sm flex flex-col gap-5 border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-start gap-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/20 text-gold shrink-0">
            <ServiceIcon name={service.icon} />
          </span>
          <div className="pt-1">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] text-gold mb-1">
              Defensa penal
            </span>
            <h3 className="font-semibold text-white text-lg leading-snug">
              {service.cardTitulo}
            </h3>
          </div>
        </div>
        <p className="text-white/70 text-[15px] leading-relaxed flex-1">
          {service.resumen}
        </p>
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-gold font-semibold text-sm hover:gap-2 transition-all duration-200 mt-auto"
        >
          Ver este servicio
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm flex flex-col gap-5 border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/15 text-gold-dark shrink-0">
        <ServiceIcon name={service.icon} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-navy text-lg leading-snug mb-2">
          {service.cardTitulo}
        </h3>
        <p className="text-slate-600 text-[15px] leading-relaxed">
          {service.resumen}
        </p>
      </div>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-gold-dark font-semibold text-sm hover:gap-2 transition-all duration-200 mt-auto"
      >
        Ver este servicio
        <span aria-hidden="true">→</span>
      </Link>
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
          {servicios.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/servicios"
            className="inline-flex items-center justify-center rounded-full border-2 border-navy px-7 py-3 font-semibold text-navy transition hover:bg-navy hover:text-white"
          >
            Ver todos los servicios y honorarios
          </Link>
        </div>
      </div>
    </section>
  );
}
