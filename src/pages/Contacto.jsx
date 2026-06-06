import PageHero from "../components/PageHero.jsx";
import Contact from "../components/Contact.jsx";
import { useSeo } from "../lib/seo.js";

const pasos = [
  {
    n: "1",
    t: "Nos escribes",
    d: "Rellena el formulario con los datos de tu multa. Un minuto, desde el móvil.",
  },
  {
    n: "2",
    t: "Estudiamos tu caso",
    d: "Revisamos plazos, notificación y posibles defectos. El estudio es gratis.",
  },
  {
    n: "3",
    t: "Te llamamos",
    d: "En 24-48 h te decimos con honestidad si tu sanción tiene defensa.",
  },
];

export default function Contacto() {
  useSeo({
    title: "Contacto — Consulta gratis tu multa | Rivero Abogados",
    description:
      "Contacta con Rivero Abogados. Estudiamos tu multa de tráfico gratis y sin compromiso. Atención en toda España, 100% online. Respondemos en 24-48 horas.",
    path: "/contacto",
  });

  return (
    <>
      <PageHero
        eyebrow="Primer paso"
        title="Cuéntanos tu multa"
        subtitle="Estamos a un mensaje de distancia. Te decimos sin compromiso si tu sanción tiene defensa, y solo recurrimos si vemos posibilidades reales."
        imagen="/imagenes/carlos-cliente.jpg"
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Contacto" }]}
      />

      {/* Cómo funciona */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-3">
          {pasos.map((p) => (
            <div key={p.n} className="rounded-2xl border border-black/5 bg-cream p-6 text-center">
              <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-gold">
                {p.n}
              </span>
              <h3 className="font-semibold text-navy">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario reutilizable (envía email a Carlos) */}
      <Contact />
    </>
  );
}
