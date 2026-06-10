import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { servicios } from "../data/servicios.js";
import ServiceIcon from "./ServiceIcon.jsx";

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
  const progressRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        // Barra de progreso de lectura (transform, sin reflow)
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${p})`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const openServ = () => {
    clearTimeout(closeTimer.current);
    setServOpen(true);
  };
  const delayedClose = () => {
    closeTimer.current = setTimeout(() => setServOpen(false), 150);
  };

  const linkClass = ({ isActive }) =>
    `nav-link whitespace-nowrap text-[15px] font-medium transition hover:text-gold-dark ${
      isActive ? "nav-active text-gold-dark" : "text-ink"
    }`;

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior */}
      <div className="relative bg-navy-900 text-[13px] text-slate-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
          <span className="hidden sm:block">
            ⚖️ Despacho de ámbito nacional · Atendemos en toda España
          </span>
          <span className="sm:hidden">⚖️ Toda España</span>
          <a href="tel:+34900000000" className="font-semibold text-gold transition hover:text-white">
            📞 900 000 000
          </a>
        </div>
        <div className="hairline-gold absolute inset-x-0 bottom-0" />
      </div>

      {/* Navegación principal */}
      <nav
        className={`glass-nav relative border-b border-black/5 transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-navy/10" : ""
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy font-display text-xl font-bold text-gold shadow-md shadow-navy/30 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-gold/30">
              R
            </span>
            <span className="font-display text-xl text-navy">
              Rivero <strong className="text-gold-dark">Abogados</strong>
            </span>
          </Link>

          <div className="hidden items-center gap-3 lg:flex xl:gap-6">
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
                    <span
                      className={`ml-1 inline-block text-xs transition-transform duration-300 ${
                        servOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </NavLink>
                  {servOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                      <div className="menu-pop w-80 overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-2xl ring-1 ring-gold/15 backdrop-blur-xl">
                        <div className="hairline-gold" />
                        {servicios.map((s) => (
                          <Link
                            key={s.slug}
                            to={`/servicios/${s.slug}`}
                            onClick={() => setServOpen(false)}
                            className="group/item flex items-center gap-3 border-b border-black/5 px-5 py-3 text-sm text-ink transition last:border-0 hover:bg-cream"
                          >
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/12 text-gold-dark transition group-hover/item:bg-gold/25">
                              <ServiceIcon name={s.icon} className="h-5 w-5" />
                            </span>
                            <span className="flex-1 font-medium">{s.cardTitulo}</span>
                            <span className="rounded-full bg-navy/5 px-2.5 py-1 text-xs font-semibold text-gold-dark">
                              {s.precio}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : l.to.startsWith("/#") ? (
                <Link
                  key={l.to}
                  to={l.to}
                  className="nav-link whitespace-nowrap text-[15px] font-medium text-ink transition hover:text-gold-dark"
                >
                  {l.label}
                </Link>
              ) : (
                <NavLink key={l.to} to={l.to} className={linkClass}>
                  {l.label}
                </NavLink>
              )
            )}
            <Link
              to="/anti-multaitor"
              className="btn-shine inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 font-semibold text-white transition hover:brightness-110"
              style={{
                backgroundImage: "linear-gradient(135deg,#22d3ee,#8b5cf6)",
                boxShadow: "0 8px 22px -10px rgba(139,92,246,0.8)",
              }}
            >
              🛡️ Anti Multaitor
            </Link>
            <a
              href="https://proyecto-crm-abogados.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-full border border-navy/25 px-4 py-2.5 font-semibold text-navy transition hover:border-navy hover:bg-navy/5 xl:px-5"
            >
              <span className="hidden xl:inline">Acceso a la plataforma</span>
              <span className="xl:hidden">Plataforma</span>
            </a>
            <Link
              to="/contacto"
              className="btn-shine whitespace-nowrap rounded-full bg-navy px-5 py-2.5 font-semibold text-white shadow-md shadow-navy/25 transition hover:bg-navy-700"
            >
              Consulta gratis
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="text-3xl leading-none text-navy transition-transform duration-200 active:scale-90 lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? "×" : "☰"}
          </button>
        </div>

        {/* Progreso de lectura */}
        <span ref={progressRef} className="scroll-progress" aria-hidden="true" />

        {/* Menú móvil */}
        {open && (
          <div className="menu-pop border-t border-black/5 bg-white/95 px-6 py-3 backdrop-blur-xl lg:hidden">
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
                className="flex items-center justify-between border-b border-black/5 py-2.5 pl-4 text-sm text-slate-600"
              >
                <span>{s.cardTitulo}</span>
                <span className="text-xs font-semibold text-gold-dark">{s.precio}</span>
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
            <Link
              to="/anti-multaitor"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full px-5 py-3 text-center font-semibold text-white"
              style={{ backgroundImage: "linear-gradient(135deg,#22d3ee,#8b5cf6)" }}
            >
              🛡️ Anti Multaitor
            </Link>
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
