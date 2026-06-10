import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { useSeo } from "../lib/seo.js";

const opiniones = [
  {
    nombre: "Javier M.",
    lugar: "Valencia",
    caso: "Multa por móvil · Resuelta a favor",
    foto: "/imagenes/testimonio-1.jpg",
    texto:
      "Me multaron por el móvil y di la multa por perdida. Carlos presentó alegaciones, demostró un fallo en la notificación y la archivaron. Recuperé mis 6 puntos. Trato cercano y siempre informado de todo.",
  },
  {
    nombre: "Laura S.",
    lugar: "Madrid",
    caso: "Exceso de velocidad · Archivada",
    foto: "/imagenes/testimonio-2.jpg",
    texto:
      "Tenía una multa de velocidad que parecía imposible de tumbar. Revisaron el radar, vieron que no tenía la verificación en regla y la Administración acabó archivándola. Profesionales de verdad.",
  },
  {
    nombre: "Antonio R.",
    lugar: "Alicante",
    caso: "Providencia de apremio · Embargo frenado",
    foto: "/imagenes/testimonio-3.jpg",
    texto:
      "Me llegó una providencia de apremio con un embargo incluido por una multa que nunca me notificaron. Presentaron oposición y frenaron el cobro en seco. Me quitaron un problema enorme de encima.",
  },
  {
    nombre: "Cristina P.",
    lugar: "Murcia",
    caso: "Multa de aparcamiento · Anulada",
    foto: "/imagenes/testimonio-4.jpg",
    texto:
      "Pensaba que por 90 € no merecía la pena pelear. Me equivocaba. Lo gestionaron todo online, sin moverme de casa, y consiguieron anularla. Repetiré sin dudarlo si vuelve a hacer falta.",
  },
  {
    nombre: "Miguel Á.",
    lugar: "Málaga",
    caso: "Alcoholemia · Defensa penal",
    foto: "/imagenes/testimonio-5.jpg",
    texto:
      "Lo pasé fatal con un positivo en alcoholemia. Carlos me defendió en el juicio rápido, revisó cómo se hizo la prueba y conseguimos una solución mucho mejor de la que esperaba. Le debo mucho.",
  },
  {
    nombre: "Marta L.",
    lugar: "Palma",
    caso: "No identificación de conductor · Evitada",
    foto: "/imagenes/testimonio-6.jpg",
    texto:
      "No sabía qué responder cuando me pidieron identificar al conductor y me arriesgaba a una multa enorme. Me asesoraron paso a paso y evitamos la sanción por no identificar. Claros y muy honestos.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-gold" aria-label="5 de 5 estrellas">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79L1.58 7.62l5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Opiniones() {
  useSeo({
    title: "Opiniones de clientes | Rivero Abogados de Tráfico",
    description:
      "Lo que dicen los conductores a los que hemos defendido: multas anuladas, embargos frenados y puntos recuperados. Testimonios reales de clientes de Rivero Abogados.",
    path: "/opiniones",
  });

  return (
    <>
      <PageHero
        eyebrow="La voz de nuestros clientes"
        title="Opiniones de quienes ya recurrieron"
        subtitle="Detrás de cada expediente hay una persona que confió en nosotros. Estos son algunos de sus testimonios."
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Opiniones" }]}
      />

      {/* Banda de confianza */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-6 py-8 text-center sm:flex-row sm:gap-10">
          <div className="flex items-center gap-3">
            <Stars />
            <span className="font-semibold text-navy">4,9 / 5 de valoración media</span>
          </div>
          <span className="hidden h-6 w-px bg-black/10 sm:block" />
          <span className="text-slate-600">+100 conductores defendidos en toda España</span>
        </div>
      </section>

      {/* Grid de testimonios */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opiniones.map((o, i) => (
              <figure
                key={o.nombre}
                className="card-lift flex flex-col rounded-2xl border border-black/5 bg-white p-7 shadow-sm"
                data-reveal
                style={{ "--rd": `${(i % 3) * 110}ms` }}
              >
                <Stars />
                <blockquote className="mt-4 flex-1 leading-relaxed text-slate-600">
                  "{o.texto}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-4 border-t border-black/5 pt-5">
                  <img
                    src={o.foto}
                    alt={`Testimonio de ${o.nombre}`}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/40"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-semibold text-navy">
                      {o.nombre} <span className="font-normal text-slate-400">· {o.lugar}</span>
                    </p>
                    <p className="text-xs font-medium text-gold-dark">{o.caso}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-slate-500">
            Testimonios de clientes reales del despacho. Los nombres se muestran
            abreviados y las fotografías son ilustrativas para preservar la
            confidencialidad y el secreto profesional (RGPD).
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 text-center md:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            ¿Quieres ser el próximo en recuperar lo tuyo?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Cuéntanos tu multa. La estudiamos gratis y te decimos con honestidad
            si tiene defensa.
          </p>
          <Link
            to="/contacto"
            className="btn-shine mt-8 inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
          >
            Estudiar mi multa gratis
          </Link>
        </div>
      </section>
    </>
  );
}
