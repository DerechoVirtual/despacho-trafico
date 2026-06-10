export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,44,77,.86), rgba(10,31,55,.92)), url('/imagenes/consulta.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Capa siglo XXII */}
      <div className="aurora-navy" aria-hidden="true" />
      <div className="grid-navy" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:py-24" data-reveal>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
          No lo dejes pasar
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
          El plazo para recurrir corre.{" "}
          <span className="text-gold-grad">Cada día cuenta.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-200">
          Muchas multas tienen errores que las hacen anulables, pero los plazos son
          cortos. Cuéntanos tu caso hoy y lo estudiamos gratis, sin compromiso.
        </p>
        <a
          href="#contacto"
          className="btn-shine pulse-gold mt-8 inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
        >
          Estudiar mi multa ahora
        </a>
      </div>
    </section>
  );
}
