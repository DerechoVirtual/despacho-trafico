import { Link } from "react-router-dom";
import { servicios } from "../data/servicios.js";
import ServiceIcon from "../components/ServiceIcon.jsx";
import PageHero from "../components/PageHero.jsx";
import BotonPago from "../components/BotonPago.jsx";
import { useSeo } from "../lib/seo.js";

export default function Servicios() {
  useSeo({
    title: "Servicios y honorarios | Rivero Abogados de Tráfico",
    description:
      "Alegaciones, identificación del conductor, recurso de reposición, oposición al apremio, defensa penal de tráfico y recuperación del carnet. Honorarios transparentes y cuota fija.",
    path: "/servicios",
  });

  return (
    <>
      <PageHero
        eyebrow="En qué te ayudamos"
        title="Servicios de defensa de multas de tráfico"
        subtitle="Cubrimos todo el recorrido de un expediente sancionador, desde las primeras alegaciones hasta el juzgado. Honorarios claros, cuota fija y estudio inicial gratis."
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Servicios" }]}
      />

      {/* Grid de servicios */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicios.map((s) => (
              <Link
                key={s.slug}
                to={`/servicios/${s.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={s.imagen}
                    alt={s.titulo}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-xs font-semibold text-gold">
                    {s.precio}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <h2 className="font-semibold text-navy text-lg leading-snug">
                    {s.titulo}
                  </h2>
                  <p className="flex-1 text-[15px] leading-relaxed text-slate-600">
                    {s.resumen}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-gold-dark transition-all group-hover:gap-2">
                    Ver detalle <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tabla de honorarios */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-dark">
              Transparencia total
            </p>
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
              Honorarios
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Cuotas fijas, sin sorpresas. Sabes lo que pagas antes de empezar.
              Pago al firmar el encargo (honorarios + IVA).
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold">Servicio</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Cuota fija
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Contratar
                  </th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s, i) => (
                  <tr
                    key={s.slug}
                    className={i % 2 ? "bg-cream/60" : "bg-white"}
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/servicios/${s.slug}`}
                        className="font-medium text-navy hover:text-gold-dark"
                      >
                        {s.titulo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gold-dark whitespace-nowrap">
                      {s.precio}
                      {s.comprable && (
                        <span className="block text-xs font-normal text-slate-400">
                          + IVA
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {s.comprable ? (
                        <BotonPago
                          slug={s.slug}
                          className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-900 shadow shadow-gold/40 transition hover:bg-gold-dark"
                        >
                          Pagar
                        </BotonPago>
                      ) : (
                        <Link
                          to="/contacto"
                          className="inline-flex items-center justify-center rounded-full border border-navy/15 px-5 py-2 text-sm font-semibold text-navy transition hover:bg-navy/5"
                        >
                          Consúltanos
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Honorario medio por expediente: <strong>420,50 €</strong>. Todas las
            cantidades llevan IVA aparte.
          </p>

          <div className="mt-10 text-center">
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
            >
              Estudiar mi multa gratis
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
