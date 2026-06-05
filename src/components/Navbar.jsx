import { useState, useEffect } from "react";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#multas", label: "Tipos de multa" },
  { href: "#proceso", label: "Cómo trabajamos" },
  { href: "#casos", label: "Casos" },
  { href: "#faq", label: "FAQ" },
  { href: "#despacho", label: "El despacho" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior */}
      <div className="bg-navy-900 text-[13px] text-slate-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
          <span className="hidden sm:block">
            ⚖️ Despacho de ámbito nacional · Atendemos en toda España
          </span>
          <span className="sm:hidden">⚖️ Toda España</span>
          <a href="tel:+34900000000" className="font-semibold text-gold hover:text-white">
            📞 900 000 000
          </a>
        </div>
      </div>

      {/* Navegación principal */}
      <nav
        className={`border-b border-black/5 bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#inicio" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy font-display text-xl font-bold text-gold">
              R
            </span>
            <span className="font-display text-xl text-navy">
              Rivero <strong className="text-gold-dark">Abogados</strong>
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[15px] font-medium text-ink transition hover:text-gold-dark"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contacto"
              className="rounded-full bg-navy px-5 py-2.5 font-semibold text-white transition hover:bg-navy-700"
            >
              Consulta gratis
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="text-3xl leading-none text-navy lg:hidden"
            aria-label="Abrir menú"
          >
            {open ? "×" : "☰"}
          </button>
        </div>

        {/* Menú móvil */}
        {open && (
          <div className="border-t border-black/5 bg-white px-6 py-3 lg:hidden">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-black/5 py-3 font-medium text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full bg-navy px-5 py-3 text-center font-semibold text-white"
            >
              Consulta gratis
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
