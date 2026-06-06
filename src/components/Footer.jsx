import { Link } from "react-router-dom";
import { servicios } from "../data/servicios.js";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy font-display text-xl font-bold text-gold">
              R
            </span>
            <span className="font-display text-xl text-white">
              Rivero <strong className="text-gold">Abogados</strong>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm">
            Especialistas en la defensa de multas y sanciones de tráfico en toda España.
          </p>
          <p className="mt-4 text-sm">
            <a href="tel:+34900000000" className="hover:text-gold">📞 900 000 000</a>
            <br />
            <a href="mailto:info@riveroabogados.es" className="hover:text-gold">
              info@riveroabogados.es
            </a>
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Servicios</h4>
          {servicios.map((s) => (
            <Link
              key={s.slug}
              to={`/servicios/${s.slug}`}
              className="block py-1 text-sm hover:text-gold"
            >
              {s.cardTitulo}
            </Link>
          ))}
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Despacho</h4>
          <Link to="/sobre-mi" className="block py-1 text-sm hover:text-gold">Sobre mí</Link>
          <Link to="/opiniones" className="block py-1 text-sm hover:text-gold">Opiniones</Link>
          <Link to="/#faq" className="block py-1 text-sm hover:text-gold">Preguntas frecuentes</Link>
          <Link to="/contacto" className="block py-1 text-sm hover:text-gold">Contacto</Link>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Legal</h4>
          <Link to="/aviso-legal" className="block py-1 text-sm hover:text-gold">Aviso legal</Link>
          <Link to="/privacidad" className="block py-1 text-sm hover:text-gold">Política de privacidad</Link>
          <Link to="/cookies" className="block py-1 text-sm hover:text-gold">Política de cookies</Link>
        </div>
      </div>

      <div className="border-t border-white/10">
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
