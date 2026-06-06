import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { servicios } from "../data/servicios.js";

const LINKS = [
  { to: "/servicios", label: "Servicios", dropdown: true },
  { to: "/sobre-mi", label: "Sobre mí" },
  { to: "/opiniones", label: "Opiniones" },
  { to: "/#faq", label: "FAQ" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servOpen, setServOpen] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openServ = () => {
    clearTimeout(closeTimer.current);
    setServOpen(true);
  };
  const delayedClose = () => {
    closeTimer.current = setTimeout(() => setServOpen(false), 150);
  };

  const linkClass = ({ isActive }) =>
    `text-[15px] font-medium transition hover:text-gold-dark ${
      isActive ? "text-gold-dark" : "text-ink"
    }`;

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
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy font-display text-xl font-bold text-gold">
              R
            </span>
            <span className="font-display text-xl text-navy">
              Rivero <strong className="text-gold-dark">Abogados</strong>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) =>
              l.dropdown ? (
                <div
                  key={l.to}
                  className="relative"
                  onMouseEnter={openServ}
                  onMouseLeave={delayedClose}
                >
                  <NavLink to={l.to} className={linkClass}>
                    {l.label}
                    <span className="ml-1 text-xs">▾</span>
                  </NavLink>
                  {servOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                      <div className="w-72 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl">
                        {servicios.map((s) => (
                          <Link
                            key={s.slug}
                            to={`/servicios/${s.slug}`}
                            onClick={() => setServOpen(false)}
                            className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-3 text-sm text-ink transition last:border-0 hover:bg-cream"
                          >
                            <span className="font-medium">{s.cardTitulo}</span>
                            <span className="text-xs font-semibold text-gold-dark">
                              {s.precio}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : l.to.startsWith("/#") ? (
                <Link key={l.to} to={l.to} className="text-[15px] font-medium text-ink transition hover:text-gold-dark">
                  {l.label}
                </Link>
              ) : (
                <NavLink key={l.to} to={l.to} className={linkClass}>
                  {l.label}
                </NavLink>
              )
            )}
            <a
              href="https://proyecto-crm-abogados.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-navy/25 px-5 py-2.5 font-semibold text-navy transition hover:border-navy hover:bg-navy/5"
            >
              Acceso a la plataforma
            </a>
            <Link
              to="/contacto"
              className="rounded-full bg-navy px-5 py-2.5 font-semibold text-white transition hover:bg-navy-700"
            >
              Consulta gratis
            </Link>
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
            <Link
              to="/servicios"
              onClick={() => setOpen(false)}
              className="block border-b border-black/5 py-3 font-semibold text-ink"
            >
              Servicios
            </Link>
            {servicios.map((s) => (
              <Link
                key={s.slug}
                to={`/servicios/${s.slug}`}
                onClick={() => setOpen(false)}
                className="block border-b border-black/5 py-2.5 pl-4 text-sm text-slate-600"
              >
                {s.cardTitulo}
              </Link>
            ))}
            {LINKS.filter((l) => !l.dropdown).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block border-b border-black/5 py-3 font-medium text-ink"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://proyecto-crm-abogados.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full border border-navy/25 px-5 py-3 text-center font-semibold text-navy"
            >
              Acceso a la plataforma
            </a>
            <Link
              to="/contacto"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full bg-navy px-5 py-3 text-center font-semibold text-white"
            >
              Consulta gratis
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
