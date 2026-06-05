import { useState, useEffect } from "react";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#multas", label: "Tipos de multa" },
  { href: "#proceso", label: "Cómo trabajamos" },
  { href: "#casos", label: "Casos de éxito" },
  { href: "#despacho", label: "El despacho" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/95 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
        <a href="#inicio" className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold font-display text-lg font-bold text-navy">
            R
          </span>
          <span className="font-display text-lg tracking-wide">
            Rivero <strong className="font-extrabold">Abogados</strong>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/85 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-dark"
          >
            Consulta gratis
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white"
          aria-label="Abrir menú"
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-navy/98 backdrop-blur px-6 pb-5 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-white/90 py-1.5 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="rounded-full bg-gold px-5 py-2 text-center text-sm font-semibold text-navy"
          >
            Consulta gratis
          </a>
        </nav>
      )}
    </header>
  );
}
