// Prerender de metadatos por ruta para el SPA.
//
// Vercel reescribe todas las rutas a /index.html (SPA), por lo que el HTML que
// reciben Google, Bing y los bots de redes sociales ANTES de ejecutar JavaScript
// es siempre el de la home: mismo <title>, misma description y mismo canonical
// en todas las páginas. Esto perjudica la indexación y las vistas previas.
//
// Este script, que corre DESPUÉS de `vite build`, genera un index.html estático
// por ruta (dist/<ruta>/index.html) con su <title>, description, canonical y
// Open Graph propios. Vercel sirve esos ficheros estáticos antes de aplicar el
// rewrite del SPA, así que cada URL entrega ya su meta correcta sin depender de JS.
//
// Es puro Node (sin navegador headless): no puede tumbar el build. Ante cualquier
// error registra un aviso y termina con código 0 para no bloquear el despliegue.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://despachotrafico.org";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Aplica una sustitución solo si el patrón existe; si no, deja el HTML intacto.
function replaceTag(html, regex, replacement) {
  return regex.test(html) ? html.replace(regex, replacement) : html;
}

function buildHtml(base, { title, description, path, noindex }) {
  const url = SITE + path;
  const t = esc(title);
  const d = esc(description);
  const robots = noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large";

  let html = base;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"[\s\S]*?>/i,
    `<meta name="description" content="${d}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+name="robots"[\s\S]*?>/i,
    `<meta name="robots" content="${robots}" />`
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"[\s\S]*?>/i,
    `<link rel="canonical" href="${url}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:url"[\s\S]*?>/i,
    `<meta property="og:url" content="${url}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:title"[\s\S]*?>/i,
    `<meta property="og:title" content="${t}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:description"[\s\S]*?>/i,
    `<meta property="og:description" content="${d}" />`
  );
  return html;
}

async function loadServicios() {
  // Importa los datos reales de servicios para no duplicar títulos/resúmenes.
  const mod = await import(
    pathToFileUrl(join(ROOT, "src", "data", "servicios.js"))
  );
  return mod.servicios || [];
}

function pathToFileUrl(p) {
  // import() necesita una URL file:// en Windows.
  return new URL(`file://${p.replace(/\\/g, "/")}`).href;
}

async function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.warn("[prerender-meta] dist/index.html no existe; se omite.");
    return;
  }
  const base = await readFile(indexPath, "utf8");

  const servicios = await loadServicios();

  const routes = [
    {
      path: "/servicios",
      title: "Servicios y honorarios | Rivero Abogados de Tráfico",
      description:
        "Alegaciones, identificación del conductor, recurso de reposición, oposición al apremio, defensa penal de tráfico y recuperación del carnet. Honorarios transparentes y cuota fija.",
    },
    ...servicios.map((s) => ({
      path: `/servicios/${s.slug}`,
      title: `${s.titulo} | Rivero Abogados de Tráfico`,
      description: s.resumen,
    })),
    {
      path: "/anti-multaitor",
      title:
        "Anti Multaitor · Descubre si puedes anular tu multa | Rivero Abogados",
      description:
        "Anti Multaitor, el asistente con IA que analiza tu multa de tráfico en 2 minutos y te dice si tiene posibilidades de anularse por nulidad o anulabilidad. Gratis y sin compromiso.",
    },
    {
      path: "/sobre-mi",
      title: "Sobre Carlos Rivero — Abogado de Tráfico | Rivero Abogados",
      description:
        "Carlos Rivero García, abogado colegiado ICAM 12.345 especializado en la defensa de multas de tráfico. 15 años peleando sanciones injustas frente a la DGT y los Ayuntamientos.",
    },
    {
      path: "/opiniones",
      title: "Opiniones de clientes | Rivero Abogados de Tráfico",
      description:
        "Lo que dicen los conductores a los que hemos defendido: multas anuladas, embargos frenados y puntos recuperados. Testimonios reales de clientes de Rivero Abogados.",
    },
    {
      path: "/contacto",
      title: "Contacto — Consulta gratis tu multa | Rivero Abogados",
      description:
        "Contacta con Rivero Abogados. Estudiamos tu multa de tráfico gratis y sin compromiso. Atención en toda España, 100% online. Respondemos en 24-48 horas.",
    },
    {
      path: "/aviso-legal",
      title: "Aviso legal — Rivero Abogados",
      description:
        "Aviso legal de Rivero Abogados, despacho especializado en la defensa de multas de tráfico en toda España.",
    },
    {
      path: "/privacidad",
      title: "Política de privacidad — Rivero Abogados",
      description:
        "Política de privacidad y tratamiento de datos personales de Rivero Abogados conforme al RGPD y la LOPDGDD.",
    },
    {
      path: "/cookies",
      title: "Política de cookies — Rivero Abogados",
      description:
        "Política de cookies del sitio web de Rivero Abogados: qué cookies usamos y cómo gestionarlas.",
    },
    {
      path: "/pago-confirmado",
      title: "Pago confirmado | Rivero Abogados",
      description: "Tu pago se ha completado. Te explicamos los siguientes pasos.",
      noindex: true,
    },
  ];

  let count = 0;
  for (const route of routes) {
    const html = buildHtml(base, route);
    const outDir = join(DIST, route.path);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html, "utf8");
    count++;
  }
  console.log(`[prerender-meta] ${count} rutas con meta estática generadas.`);
}

main().catch((err) => {
  // Nunca bloquear el build por un fallo del prerender.
  console.warn("[prerender-meta] aviso (no bloqueante):", err?.message || err);
  process.exit(0);
});
