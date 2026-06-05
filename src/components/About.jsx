export default function About() {
  const checks = [
    "Colegiado nº 12.345 del Ilustre Colegio de Abogados de Madrid (ICAM)",
    "Atención personal y directa, sin intermediarios",
    "Cumplimiento del RGPD y secreto profesional garantizado",
    "Sede de referencia en Alicante · clientes en toda España",
  ];

  return (
    <section id="despacho" className="py-20 md:py-28" style={{ background: "#ffffff" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* COLUMNA IZQUIERDA — Imagen + badge */}
          <div className="relative">
            <img
              src="/imagenes/abogado.jpg"
              alt="Carlos Rivero García, abogado especialista en derecho de tráfico"
              className="w-full rounded-2xl shadow-xl object-cover"
            />

            {/* Badge colegiación */}
            <div
              className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl"
              style={{ backgroundColor: "#0f1f3d", color: "#ffffff" }}
            >
              {/* Icono escudo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
                style={{ width: 28, height: 28, color: "#c9a84c" }}
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <p className="text-xs font-medium" style={{ color: "#c9a84c", letterSpacing: "0.06em" }}>
                  COLEGIADO ICAM
                </p>
                <p className="text-sm font-bold leading-tight">nº 12.345</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA — Contenido */}
          <div className="flex flex-col gap-6">

            {/* Eyebrow */}
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#c9a84c" }}
            >
              Quién te defiende
            </p>

            {/* Título */}
            <h2
              className="font-display text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: "#0f1f3d" }}
            >
              Carlos Rivero García
            </h2>

            {/* Lead */}
            <p
              className="text-lg font-medium leading-relaxed"
              style={{ color: "#0f1f3d" }}
            >
              Abogado titular del despacho y especialista en expedientes sancionadores de tráfico.
            </p>

            {/* Párrafos */}
            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Llevamos años dedicados en exclusiva a una sola cosa: defender a conductores frente
              a multas y sanciones. Esa especialización es nuestra mayor ventaja. Conocemos los
              plazos, los defectos de forma y los argumentos que de verdad funcionan ante la
              Administración y los Tribunales.
            </p>

            <p className="leading-relaxed" style={{ color: "#475569" }}>
              Detrás de cada expediente hay una persona agobiada por una sanción injusta. Por eso
              te atendemos de tú a tú, te explicamos todo sin tecnicismos y damos la cara hasta
              el final.
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-3">
              {checks.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {/* Check icon */}
                  <span
                    className="mt-0.5 flex shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: "rgba(201,168,76,0.15)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 13, height: 13, color: "#c9a84c" }}
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: "#334155" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="pt-2">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 font-semibold shadow-lg transition hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#c9a84c",
                  color: "#0f1f3d",
                  boxShadow: "0 8px 24px rgba(201,168,76,0.40)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#b8962f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#c9a84c";
                }}
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
                  className="mr-2"
                  style={{ width: 18, height: 18 }}
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
