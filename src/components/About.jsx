export default function About() {
  const checks = [
    "Colegiado nº 12.345 del Ilustre Colegio de Abogados de Madrid (ICAM)",
    "Atención personal y directa, sin intermediarios",
    "Cumplimiento del RGPD y secreto profesional garantizado",
    "Sede de referencia en Alicante · clientes en toda España",
  ];

  return (
    <section id="despacho" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* COLUMNA IZQUIERDA — Imagen + badge */}
          <div className="relative" data-reveal="left">
            <div className="frame-gold shadow-xl">
              <img
                src="/imagenes/abogado.jpg"
                alt="Carlos Rivero García, abogado especialista en derecho de tráfico"
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl object-cover"
              />
            </div>

            {/* Badge colegiación */}
            <div className="float-y absolute bottom-5 left-5 flex items-center gap-3 rounded-xl bg-navy px-4 py-3 text-white shadow-2xl ring-1 ring-gold/40">
              {/* Icono escudo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 shrink-0 text-gold"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <p className="text-xs font-medium tracking-wider text-gold">
                  COLEGIADO ICAM
                </p>
                <p className="text-sm font-bold leading-tight">nº 12.345</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA — Contenido */}
          <div className="flex flex-col gap-6" data-reveal="right">

            {/* Eyebrow */}
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">
              Quién te defiende
            </p>

            {/* Título */}
            <h2 className="font-display text-4xl font-bold leading-tight text-navy md:text-5xl">
              Carlos Rivero García
            </h2>

            {/* Lead */}
            <p className="text-lg font-medium leading-relaxed text-navy">
              Abogado titular del despacho y especialista en expedientes sancionadores de tráfico.
            </p>

            {/* Párrafos */}
            <p className="leading-relaxed text-slate-600">
              Llevamos años dedicados en exclusiva a una sola cosa: defender a conductores frente
              a multas y sanciones. Esa especialización es nuestra mayor ventaja. Conocemos los
              plazos, los defectos de forma y los argumentos que de verdad funcionan ante la
              Administración y los Tribunales.
            </p>

            <p className="leading-relaxed text-slate-600">
              Detrás de cada expediente hay una persona agobiada por una sanción injusta. Por eso
              te atendemos de tú a tú, te explicamos todo sin tecnicismos y damos la cara hasta
              el final.
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-3">
              {checks.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/25">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-[13px] w-[13px] text-gold-dark"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="pt-2">
              <a
                href="#contacto"
                className="btn-shine inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
              >
                {/* Icono chat */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Habla con tu abogado
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
