import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function LegalLayout({ title, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = `${title} — Rivero Abogados`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta ? meta.getAttribute("content") : null;
    if (meta) {
      meta.setAttribute(
        "content",
        `${title} de Rivero Abogados, despacho especialista en multas y sanciones de tráfico.`
      );
    }
    return () => {
      document.title = prev;
      if (meta && prevDesc !== null) meta.setAttribute("content", prevDesc);
    };
  }, [title]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy font-display text-xl font-bold text-gold">
              R
            </span>
            <span className="font-display text-xl text-navy">
              Rivero <strong className="text-gold-dark">Abogados</strong>
            </span>
          </Link>
          <Link
            to="/#contacto"
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Consulta gratis
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="font-display text-3xl font-bold text-navy md:text-4xl">{title}</h1>
        <p className="mb-8 mt-2 text-sm font-semibold text-gold-dark">
          Última actualización: junio de 2026
        </p>
        <div className="legal-content space-y-4 text-slate-600 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-navy">
          {children}
        </div>
        <Link to="/" className="mt-10 inline-block font-semibold text-gold-dark hover:underline">
          ← Volver al inicio
        </Link>
      </main>

      <footer className="border-t border-black/5 bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-6 text-[13px] text-slate-500">
          <p>© {new Date().getFullYear()} Rivero Abogados — Colegiado nº 12.345 ICAM.</p>
          <p className="mt-1">
            <Link to="/aviso-legal" className="hover:text-gold-dark">Aviso legal</Link> ·{" "}
            <Link to="/privacidad" className="hover:text-gold-dark">Privacidad</Link> ·{" "}
            <Link to="/cookies" className="hover:text-gold-dark">Cookies</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
