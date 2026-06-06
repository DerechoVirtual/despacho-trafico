import { useParams, Link, Navigate } from "react-router-dom";
import { servicios, getServicio } from "../data/servicios.js";
import ServiceIcon from "../components/ServiceIcon.jsx";
import PageHero from "../components/PageHero.jsx";
import BotonPago from "../components/BotonPago.jsx";
import { useSeo } from "../lib/seo.js";

function Check() {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15">
      <svg viewBox="0 0 24 24" fill="none" stroke="#b08d44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

export default function ServicioDetalle() {
  const { slug } = useParams();
  const s = getServicio(slug);

  useSeo({
    title: s
      ? `${s.titulo} | Rivero Abogados de Tráfico`
      : "Servicio | Rivero Abogados",
    description: s ? s.resumen : "",
    path: `/servicios/${slug}`,
  });

  if (!s) return <Navigate to="/servicios" replace />;

  const otros = servicios.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        title={s.titulo}
        subtitle={s.hero}
        imagen={s.imagen}
        crumbs={[
          { to: "/", label: "Inicio" },
          { to: "/servicios", label: "Servicios" },
          { label: s.cardTitulo },
        ]}
      />

      {/* Precio destacado */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
              <ServiceIcon name={s.icon} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Honorarios (cuota fija)
              </p>
              <p className="font-display text-2xl font-bold text-navy">
                {s.precio}
                {s.precio !== "Consúltanos" && (
                  <span className="ml-1 text-sm font-normal text-slate-500">
                    + IVA
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            {s.comprable && (
              <BotonPago
                slug={s.slug}
                className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
              >
                Contratar y pagar online · {s.precio}
              </BotonPago>
            )}
            <Link
              to="/contacto"
              className={
                s.comprable
                  ? "inline-flex items-center justify-center rounded-full border-2 border-navy/15 px-7 py-3 font-semibold text-navy transition hover:border-navy/30 hover:bg-navy/5"
                  : "inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
              }
            >
              Consulta gratis sobre este servicio
            </Link>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">
              En qué consiste
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">{s.detalle}</p>

            <h3 className="mt-10 font-display text-xl font-bold text-navy">
              ¿Cuándo deberías acudir a nosotros?
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {s.cuando.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <Check />
                  <span className="leading-relaxed text-slate-600">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Aside: qué incluye */}
          <aside className="h-fit rounded-2xl border border-black/5 bg-cream p-7 shadow-sm">
            <h3 className="font-display text-xl font-bold text-navy">
              Qué incluye el servicio
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {s.incluye.map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[15px] leading-relaxed text-slate-700">
                    {i}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/contacto"
              className="mt-7 block rounded-full bg-navy px-6 py-3 text-center font-semibold text-white transition hover:bg-navy-700"
            >
              Quiero que estudien mi caso
            </Link>
          </aside>
        </div>
      </section>

      {/* Otros servicios */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-navy md:text-3xl">
            Otros servicios que te pueden interesar
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {otros.map((o) => (
              <Link
                key={o.slug}
                to={`/servicios/${o.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                  <ServiceIcon name={o.icon} />
                </span>
                <h3 className="font-semibold text-navy">{o.titulo}</h3>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-gold-dark transition-all group-hover:gap-2">
                  Ver detalle <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
