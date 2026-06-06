import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { useSeo } from "../lib/seo.js";

const CRM_URL = "https://proyecto-crm-abogados.vercel.app";

const PASOS = [
  {
    n: "1",
    titulo: "Revisa tu correo",
    texto:
      "Te hemos enviado dos emails: la confirmación del pago y la bienvenida a tu plataforma con tus datos de acceso.",
  },
  {
    n: "2",
    titulo: "Entra en tu plataforma",
    texto:
      "Accede con tu email y la contraseña temporal del correo de bienvenida. Cámbiala desde tu perfil al entrar.",
  },
  {
    n: "3",
    titulo: "Sube tu documentación",
    texto:
      "Desde 'Mi documentación' verás exactamente qué documentos necesitamos para tu caso. Súbelos y empezamos a trabajar.",
  },
];

export default function PagoConfirmado() {
  useSeo({
    title: "Pago confirmado | Rivero Abogados",
    description: "Tu pago se ha completado. Te explicamos los siguientes pasos.",
    path: "/pago-confirmado",
  });

  return (
    <>
      <PageHero
        eyebrow="¡Gracias por confiar en nosotros!"
        title="Pago confirmado"
        subtitle="Hemos recibido tu pago correctamente y ya hemos abierto tu expediente. Ahora solo quedan unos sencillos pasos para que empecemos a defender tu caso."
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Pago confirmado" }]}
      />

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">
              Todo listo. Estos son tus próximos pasos
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PASOS.map((p) => (
              <div
                key={p.n}
                className="rounded-2xl border border-black/5 bg-cream p-7 shadow-sm"
              >
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-navy-900">
                  {p.n}
                </span>
                <h3 className="font-display text-lg font-bold text-navy">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  {p.texto}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={CRM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 font-semibold text-navy-900 shadow-lg shadow-gold/40 transition hover:-translate-y-0.5 hover:bg-gold-dark"
            >
              Acceder a mi plataforma
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border-2 border-navy/15 px-8 py-4 font-semibold text-navy transition hover:border-navy/30 hover:bg-navy/5"
            >
              Volver al inicio
            </Link>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            ¿No te ha llegado el correo? Revisa tu carpeta de spam o escríbenos por
            WhatsApp y lo solucionamos al momento.
          </p>
        </div>
      </section>
    </>
  );
}
