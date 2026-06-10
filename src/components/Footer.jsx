import { Link } from "react-router-dom";
import { servicios } from "../data/servicios.js";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy-900 text-slate-300">
      {/* Capa decorativa: hairline dorado + retícula + aurora sutil */}
      <div className="hairline-gold" />
      <div className="grid-navy" aria-hidden="true" />
      <div className="aurora-navy" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy font-display text-xl font-bold text-gold ring-1 ring-gold/30 transition-transform duration-300 group-hover:scale-105">
              R
            </span>
            <span className="font-display text-xl text-white">
              Rivero <strong className="text-gold">Abogados</strong>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Especialistas en la defensa de multas y sanciones de tráfico en toda España.
          </p>
          <p className="mt-4 text-sm">
            <a href="tel:+34900000000" className="transition hover:text-gold">📞 900 000 000</a>
            <br />
            <a href="mailto:info@riveroabogados.es" className="transition hover:text-gold">
              info@riveroabogados.es
            </a>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-gold">
              ICAM 12.345
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-300">
              RGPD · Secreto profesional
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-300">
              100% online
            </span>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Servicios</h4>
          {servicios.map((s) => (
            <Link
              key={s.slug}
              to={`/servicios/${s.slug}`}
              className="group block py-1 text-sm transition hover:text-gold"
            >
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                {s.cardTitulo}
              </span>
            </Link>
          ))}
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Despacho</h4>
          <Link to="/sobre-mi" className="group block py-1 text-sm transition hover:text-gold">
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">Sobre mí</span>
          </Link>
          <Link to="/opiniones" className="group block py-1 text-sm transition hover:text-gold">
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">Opiniones</span>
          </Link>
          <Link to="/#faq" className="group block py-1 text-sm transition hover:text-gold">
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">Preguntas frecuentes</span>
          </Link>
          <Link to="/contacto" className="group block py-1 text-sm transition hover:text-gold">
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">Contacto</span>
          </Link>
          <Link to="/anti-multaitor" className="group block py-1 text-sm transition hover:text-gold">
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">🛡️ Anti Multaitor</span>
          </Link>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Legal</h4>
          <Link to="/aviso-legal" className="group block py-1 text-sm transition hover:text-gold">
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">Aviso legal</span>
          </Link>
          <Link to="/privacidad" className="group block py-1 text-sm transition hover:text-gold">
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">Política de privacidad</span>
          </Link>
          <Link to="/cookies" className="group block py-1 text-sm transition hover:text-gold">
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">Política de cookies</span>
          </Link>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">
              ¿Te acaban de multar?
            </p>
            <p className="mt-1 text-sm text-slate-300">
              El plazo de 20 días corre. Estudiamos tu multa gratis.
            </p>
            <Link
              to="/contacto"
              className="btn-shine mt-3 inline-flex items-center justify-center rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-gold-dark"
            >
              Consulta gratis
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-[13px]">
          <p>
            © {year} Rivero Abogados — Carlos Rivero García, Colegiado nº 12.345 ICAM.
            Todos los derechos reservados.
          </p>
          <p className="mt-1 text-slate-500">
            Esta web tiene fines informativos y no constituye asesoramiento jurídico hasta
            la firma de la hoja de encargo.
          </p>
        </div>
      </div>
    </footer>
  );
}
