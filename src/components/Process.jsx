import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Nos envías tu multa",
    description:
      "Súbenos una foto del boletín o de la notificación de la sanción. En un minuto y desde el móvil.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "La estudiamos gratis",
    description:
      "Revisamos plazos, la notificación, el radar o el atestado y buscamos cualquier error de forma que la haga anulable.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Te decimos la verdad",
    description:
      "Si tu multa tiene recurso, peleamos por ella. Y si no es viable, te lo decimos con honestidad para que no gastes de más.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97Zm-12.75 0L3.375 15.696c-.122.499.106 1.028.589 1.202a5.987 5.987 0 0 0 2.031.352 5.987 5.987 0 0 0 2.031-.352c.483-.174.711-.703.589-1.202L5.25 4.97Z"
        />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Recurrimos por ti",
    description:
      "Presentamos las alegaciones y los recursos en tu nombre y te mantenemos informado en cada paso hasta la resolución.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
  },
];

export default function Process() {
  return (
    <section id="proceso" className="py-20 md:py-28" style={{ backgroundColor: "#ffffff" }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Cabecera centrada */}
        <div className="mb-14 text-center md:mb-18">
          <p
            className="mb-3 text-xs font-bold uppercase tracking-widest"
            style={{ color: "#C9A84C" }}
          >
            ASÍ DE FÁCIL
          </p>
          <h2
            className="mb-4 text-3xl font-display font-bold md:text-4xl lg:text-5xl"
            style={{ color: "#0F1F3D" }}
          >
            Cómo trabajamos
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg leading-relaxed"
            style={{ color: "#475569" }}
          >
            Tú no te desplazas: lo hacemos todo{" "}
            <span className="font-semibold" style={{ color: "#0F1F3D" }}>
              online
            </span>
            . En cuatro pasos sencillos pasamos de tu multa a tu defensa.
          </p>
        </div>

        {/* Grid de pasos */}
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Línea conectora horizontal (solo lg) */}
          <div
            className="absolute inset-x-0 top-14 hidden h-px lg:block"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, transparent 3%, #C9A84C44 20%, #C9A84C44 80%, transparent 97%)",
              zIndex: 0,
            }}
          />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col items-start rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                backgroundColor: "#F8F6F0",
                border: "1px solid #E8E2D4",
                zIndex: 1,
              }}
            >
              {/* Número grande dorado */}
              <span
                className="mb-1 block select-none font-display text-5xl font-extrabold leading-none opacity-25"
                style={{ color: "#C9A84C" }}
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Círculo con icono */}
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#0F1F3D",
                  color: "#C9A84C",
                  boxShadow: "0 4px 14px 0 rgba(201,168,76,0.25)",
                }}
              >
                {step.icon}
              </div>

              {/* Título */}
              <h3
                className="mb-2 text-lg font-semibold leading-snug"
                style={{ color: "#0F1F3D" }}
              >
                {step.title}
              </h3>

              {/* Descripción */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#64748b" }}
              >
                {step.description}
              </p>

              {/* Conector flecha entre tarjetas (sm, 2 col) — decorativo */}
              {index < steps.length - 1 && (
                <span
                  className="absolute -right-3 top-14 hidden sm:flex lg:hidden z-10 h-6 w-6 items-center justify-center rounded-full text-xs"
                  style={{
                    backgroundColor: "#C9A84C",
                    color: "#0F1F3D",
                    boxShadow: "0 2px 6px rgba(201,168,76,0.4)",
                  }}
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3 w-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 8a.75.75 0 0 1 .75-.75h8.69L9.22 5.03a.75.75 0 0 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.22-2.22H2.75A.75.75 0 0 1 2 8Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA centrado */}
        <div className="mt-14 flex justify-center md:mt-16">
          <a
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 font-semibold shadow-lg transition hover:-translate-y-0.5"
            style={{
              backgroundColor: "#C9A84C",
              color: "#0F1F3D",
              boxShadow: "0 8px 24px rgba(201,168,76,0.40)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#b8973f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#C9A84C";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="mr-2 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Empieza ahora: estudia mi multa
          </a>
        </div>
      </div>
    </section>
  );
}
