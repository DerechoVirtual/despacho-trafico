import { useState } from "react";

const faqs = [
  {
    q: "¿Cuánto tiempo tengo para recurrir una multa?",
    a: "En vía administrativa el plazo suele ser de 20 días naturales desde que te notifican, tanto para alegaciones como para el recurso. Por eso conviene actuar cuanto antes: cada día cuenta.",
  },
  {
    q: "¿Merece la pena recurrir o es mejor pagar con el descuento?",
    a: "Depende de tu caso. Lo estudiamos gratis y solo te recomendamos recurrir si vemos posibilidades reales. Si no las hay, te lo decimos con honestidad.",
  },
  {
    q: "¿Puedo recurrir aunque ya haya pasado el plazo de pronto pago?",
    a: "Sí. Aunque pierdas el descuento, existen fases posteriores —recurso de reposición, vía contencioso-administrativa u oposición a la providencia de apremio— en las que aún se puede actuar.",
  },
  {
    q: "¿Recuperaré los puntos del carnet si gano?",
    a: "Si la sanción se anula, no se descuentan los puntos asociados a ella. Defender la multa es precisamente la vía para proteger tu saldo de puntos.",
  },
  {
    q: "Me han denunciado por alcoholemia o por el móvil, ¿qué hago?",
    a: "Son infracciones muy graves e incluso delito. Analizamos si el procedimiento, el aparato de medición o la notificación tienen defectos que abran una vía de defensa. No firmes ni asumas nada sin asesorarte.",
  },
  {
    q: "¿Tengo que desplazarme hasta el despacho?",
    a: "No. Trabajamos en toda España de forma online: nos envías la documentación y nosotros nos encargamos de todo el trámite.",
  },
  {
    q: "¿Qué necesitáis para empezar?",
    a: "Solo el boletín de denuncia o la notificación de la sanción y tus datos de contacto. Con eso hacemos el estudio de viabilidad.",
  },
  {
    q: "¿La primera consulta tiene algún coste?",
    a: "No. El estudio de viabilidad de tu multa es gratuito y sin compromiso. Primero miramos si tiene recurso y luego decides.",
  },
];

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 text-gold-dark transition-transform duration-300 ${
        open ? "rotate-180" : "rotate-0"
      }`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FAQItem({ item, index, openIndex, setOpenIndex }) {
  const isOpen = openIndex === index;

  function handleToggle() {
    setOpenIndex(isOpen ? null : index);
  }

  return (
    <div
      className={`mb-3 overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
        isOpen
          ? "border-gold/45 shadow-lg shadow-gold/10 ring-1 ring-gold/20"
          : "border-black/5"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between p-5 text-left font-semibold text-navy transition-colors duration-150 hover:bg-cream/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span className="pr-4 leading-snug">{item.q}</span>
        <ChevronIcon open={isOpen} />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pt-1 leading-relaxed text-slate-600">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        {/* Cabecera */}
        <div className="mb-12 text-center" data-reveal>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-dark">
            DUDAS FRECUENTES
          </p>
          <h2 className="font-display mb-4 text-3xl font-bold text-navy md:text-4xl">
            Preguntas frecuentes
          </h2>
          <div className="hairline-gold mx-auto mb-5 w-24" />
          <p className="mx-auto max-w-xl text-base text-slate-500 md:text-lg">
            Resolvemos las dudas que más nos plantean antes de recurrir una
            multa.
          </p>
        </div>

        {/* Acordeón */}
        <div role="list" data-reveal>
          {faqs.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              index={index}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center" data-reveal>
          <p className="mb-6 text-base text-slate-500 md:text-lg">
            ¿Tienes otra duda? Escríbenos y te respondemos sin compromiso.
          </p>
          <a
            href="#contacto"
            className="btn-shine inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
          >
            Escríbenos
          </a>
        </div>
      </div>
    </section>
  );
}
