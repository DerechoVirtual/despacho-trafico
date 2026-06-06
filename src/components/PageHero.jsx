import { Link } from "react-router-dom";

/**
 * Cabecera de página interior, con migas de pan opcionales.
 * crumbs: [{ to, label }] (el último sin 'to' se muestra como actual).
 */
export default function PageHero({ eyebrow, title, subtitle, crumbs, imagen }) {
  return (
    <section
      className="relative overflow-hidden bg-navy text-white"
      style={
        imagen
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(15,44,77,.95) 0%, rgba(15,44,77,.78) 55%, rgba(15,44,77,.55) 100%), url('${imagen}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {crumbs && (
          <nav className="mb-5 text-sm text-white/60" aria-label="Migas de pan">
            {crumbs.map((c, i) => (
              <span key={i}>
                {c.to ? (
                  <Link to={c.to} className="hover:text-gold">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
