import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import CountUp from "../components/CountUp.jsx";
import { useSeo } from "../lib/seo.js";

const hitos = [
  {
    year: "2008",
    titulo: "Licenciatura en Derecho",
    texto:
      "Me licencio en Derecho con la idea fija de dedicarme al ciudadano de a pie. Desde el primer día me interesó el Derecho Administrativo: la relación —casi siempre desigual— entre la Administración y las personas.",
  },
  {
    year: "2010",
    titulo: "Colegiación en el ICAM (nº 12.345)",
    texto:
      "Juro como abogado en el Ilustre Colegio de Abogados de Madrid. Empiezo defendiendo expedientes administrativos y contencioso-administrativos. Ahí descubro el patrón: miles de sanciones de tráfico mal notificadas, mal motivadas o directamente prescritas.",
  },
  {
    year: "2013",
    titulo: "Primer gran caso contra un radar",
    texto:
      "Consigo la anulación de una multa de velocidad demostrando que el cinemómetro no tenía la verificación metrológica en vigor. Aquel auto me marcó: entendí que pelear los detalles técnicos podía tumbar sanciones que parecían imposibles.",
  },
  {
    year: "2016",
    titulo: "Nace Rivero Abogados",
    texto:
      "Fundo el despacho con una especialidad clara: defensa de conductores frente a multas y sanciones de tráfico. Nada de cartera dispersa. Un solo foco, hecho bien.",
  },
  {
    year: "2019",
    titulo: "Batalla contra los apremios indebidos",
    texto:
      "Empiezo a frenar de forma sistemática providencias de apremio basadas en sanciones que nunca se notificaron correctamente. Decenas de embargos detenidos. La Administración da por firme lo que nunca llegó al ciudadano: ahí es donde ganamos.",
  },
  {
    year: "2022",
    titulo: "100% online y ámbito nacional",
    texto:
      "Llevo el despacho al terreno digital. Da igual dónde te multen: hoy defiendo expedientes en toda España sin que el cliente se mueva de casa. Más cerca, más rápido, igual de combativo.",
  },
  {
    year: "Hoy",
    titulo: "Más de 100 expedientes y sumando",
    texto:
      "Más de un centenar de conductores defendidos, sanciones archivadas, puntos recuperados y embargos frenados. Cada expediente es una persona agobiada por una multa injusta. Esa es la pelea que sigo eligiendo cada mañana.",
  },
];

const stats = [
  { value: 100, prefix: "+", l: "expedientes gestionados" },
  { value: 15, l: "años ejerciendo" },
  { value: 34700, suffix: " €", l: "en sanciones gestionadas" },
  { n: "ICAM 12.345", l: "abogado colegiado" },
];

export default function SobreMi() {
  useSeo({
    title: "Sobre Carlos Rivero — Abogado de Tráfico | Rivero Abogados",
    description:
      "Carlos Rivero García, abogado colegiado ICAM 12.345 especializado en la defensa de multas de tráfico. 15 años peleando sanciones injustas frente a la DGT y los Ayuntamientos.",
    path: "/sobre-mi",
  });

  return (
    <>
      <PageHero
        eyebrow="Quién te defiende"
        title="Carlos Rivero García"
        subtitle="Abogado especializado en sanciones de tráfico. Llevo 15 años con una sola obsesión: que la Administración no se salga con la suya cuando multa mal."
        imagen="/imagenes/sobre-mi-carlos.jpg"
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Sobre mí" }]}
      />

      {/* Intro con retrato */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="relative" data-reveal="left">
            <div className="frame-gold shadow-xl">
              <img
                src="/imagenes/abogado.jpg"
                alt="Carlos Rivero García, abogado de tráfico"
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl object-cover"
              />
            </div>
            <div
              className="float-y absolute bottom-5 left-5 flex items-center gap-3 rounded-xl bg-navy px-4 py-3 shadow-2xl ring-1 ring-gold/40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <p className="text-xs font-medium tracking-wide text-gold">COLEGIADO ICAM</p>
                <p className="text-sm font-bold leading-tight text-white">nº 12.345</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5" data-reveal="right">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">
              Mi historia
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-navy md:text-4xl">
              No me dedico a "llevar multas". Me dedico a no dejar pasar ni una.
            </h2>
            <p className="leading-relaxed text-slate-600">
              Me llamo Carlos Rivero y soy abogado desde 2010. Pronto entendí
              algo que mucha gente sufre en silencio: el sistema sancionador de
              tráfico es una máquina enorme y, como toda máquina, comete fallos
              constantemente. Notificaciones que nunca llegan, radares sin
              verificar, plazos que se incumplen, providencias de apremio sobre
              multas que el ciudadano jamás vio.
            </p>
            <p className="leading-relaxed text-slate-600">
              La mayoría de la gente paga por miedo o por desconocimiento. Y casi
              siempre que paga, está pagando un error de la propia Administración.
              Mi trabajo consiste en encontrar ese error y usarlo para defenderte.
            </p>
            <p className="leading-relaxed text-slate-600">
              Por eso especialicé todo el despacho en una sola cosa: el Derecho de
              tráfico. Sin dispersión. Conozco a fondo los procedimientos de la
              DGT, de las Jefaturas Provinciales y de los Ayuntamientos, y sé
              dónde mirar para tumbar una sanción que parece firme.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-navy py-16 text-white">
        <div className="aurora-navy" aria-hidden="true" />
        <div className="grid-navy" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className="card-lift rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
              data-reveal
              style={{ "--rd": `${i * 100}ms` }}
            >
              <p className="font-display text-3xl font-bold text-gold md:text-4xl">
                {typeof s.value === "number" ? (
                  <CountUp value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} />
                ) : (
                  s.n
                )}
              </p>
              <p className="mt-2 text-sm text-slate-300">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lucha contra el Estado */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="order-2 flex flex-col gap-5 lg:order-1" data-reveal="left">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">
              Mi forma de trabajar
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-navy md:text-4xl">
              David contra Goliat, pero con el reglamento en la mano
            </h2>
            <p className="leading-relaxed text-slate-600">
              Enfrentarse a la Administración intimida. Tienen recursos, tiempo y
              la presunción de que "siempre tienen razón". Pero esa presunción se
              rompe en cuanto demuestras un defecto en el procedimiento. Y yo me
              he pasado quince años aprendiendo exactamente dónde se rompe.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "He conseguido anular multas de radar por falta de verificación metrológica del cinemómetro.",
                "He frenado embargos demostrando que la sanción original nunca se notificó como exige la ley.",
                "He logrado el archivo de expedientes por caducidad y por prescripción cuando la Administración se durmió en los plazos.",
                "He protegido el saldo de puntos de decenas de conductores anulando las sanciones que se los descontaban.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#b08d44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="leading-relaxed text-slate-600">{t}</span>
                </li>
              ))}
            </ul>
            <p className="leading-relaxed text-slate-600">
              No prometo imposibles. Si tu multa no tiene recorrido, te lo digo a
              la cara y te ahorro el dinero. Pero si lo tiene, peleo hasta el
              último recurso.
            </p>
          </div>
          <div className="order-1 lg:order-2" data-reveal="right">
            <div className="frame-gold shadow-xl">
              <img
                src="/imagenes/sobre-mi-carlos.jpg"
                alt="Carlos Rivero trabajando en un expediente de tráfico"
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-dark">
              Trayectoria
            </p>
            <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
              Quince años, una misma pelea
            </h2>
          </div>

          <ol className="relative border-l-2 border-gold/40">
            {hitos.map((h, i) => (
              <li
                key={h.year}
                className="mb-10 ml-6 last:mb-0"
                data-reveal
                style={{ "--rd": `${Math.min(i, 3) * 80}ms` }}
              >
                <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-gold shadow-md shadow-gold/50 ring-4 ring-cream" />
                <span className="text-sm font-bold text-gold-dark">{h.year}</span>
                <h3 className="mt-1 font-display text-xl font-bold text-navy">
                  {h.titulo}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600">{h.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cita / filosofía */}
      <section
        className="text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,44,77,.9), rgba(10,31,55,.94)), url('/imagenes/justicia.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
          <svg viewBox="0 0 32 32" fill="currentColor" className="mx-auto mb-6 h-12 w-12 text-gold opacity-80">
            <path d="M10 8C5.6 8 2 11.6 2 16v8h8v-8H6c0-2.2 1.8-4 4-4V8zm16 0c-4.4 0-8 3.6-8 8v8h8v-8h-4c0-2.2 1.8-4 4-4V8z" />
          </svg>
          <p className="font-display text-2xl font-medium leading-relaxed md:text-3xl">
            "Una multa injusta no se paga: se recurre. Mi trabajo es demostrar
            que la Administración también se equivoca, y que tú no tienes por qué
            asumir su error."
          </p>
          <p className="mt-6 font-semibold text-gold">
            — Carlos Rivero García, abogado ICAM 12.345
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 text-center md:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            ¿Hablamos de tu multa?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Cuéntame qué te ha pasado. Estudio tu caso gratis y te digo con
            honestidad si merece la pena pelearlo.
          </p>
          <Link
            to="/contacto"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
          >
            Contactar con Carlos
          </Link>
        </div>
      </section>
    </>
  );
}
