const ITEMS = [
  {
    title: "Primer estudio gratis",
    text: "Revisamos tu multa sin compromiso y te decimos la verdad: si conviene recurrir o no.",
    icon: (
      <path d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
    ),
  },
  {
    title: "Te lo explicamos claro",
    text: "Nada de palabras raras. Te contamos qué pasa y qué hacemos, en cristiano.",
    icon: (
      <path d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.7 9.7 0 0 1-4-.85L3 20l1.1-3.3A7.6 7.6 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
    ),
  },
  {
    title: "Todo 100% online",
    text: "No te desplazas. Nos mandas la multa y nos encargamos de todo el trámite por ti.",
    icon: (
      <path d="M3 5h18v11H3zM8 21h8M12 16v5M7 9l2.5 2.5L15 6" />
    ),
  },
  {
    title: "En toda España",
    text: "Da igual dónde te hayan multado. Te defendemos en cualquier punto del país.",
    icon: (
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    ),
  },
];

export default function TrustBar() {
  return (
    <section className="border-b border-black/5 bg-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <div
            key={it.title}
            className="group"
            data-reveal
            style={{ "--rd": `${i * 110}ms` }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold-dark ring-1 ring-gold/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/25 group-hover:shadow-lg group-hover:shadow-gold/30">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                {it.icon}
              </svg>
            </span>
            <h3 className="mt-4 text-[17px] font-semibold text-navy">{it.title}</h3>
            <p className="mt-1.5 text-[15px] text-slate-600">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
