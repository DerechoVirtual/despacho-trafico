// Prerender del SPA a HTML estático por ruta.
//
// Vercel reescribe todas las rutas a /index.html (SPA), así que el HTML que ven
// Google, Bing y los bots de redes ANTES de ejecutar JS es siempre el de la home.
// Este script corre DESPUÉS de `vite build` y genera un dist/<ruta>/index.html
// propio por cada página. Vercel sirve esos ficheros estáticos antes de aplicar
// el rewrite, así que cada URL entrega su HTML/meta correctos sin depender de JS.
//
// Dos modos:
//  1) COMPLETO (preferido): lanza un navegador headless (Puppeteer), renderiza
//     cada ruta y guarda el DOM completo → el sitio deja de comportarse como un
//     SPA para los rastreadores (contenido + meta + Open Graph reales).
//  2) FALLBACK: si no hay navegador disponible, inyecta por texto el title,
//     description, canonical, robots y Open Graph (incluida la imagen) por ruta.
//
// Pase lo que pase, termina con código 0 para no bloquear nunca el despliegue.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, createReadStream } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://despachotrafico.org";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

function pathToFileUrl(p) {
  return new URL(`file://${p.replace(/\\/g, "/")}`).href;
}

function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceTag(html, regex, replacement) {
  return regex.test(html) ? html.replace(regex, replacement) : html;
}

// --- Modo FALLBACK: inyección de meta por texto -----------------------------
function injectMeta(base, { title, description, path, noindex, image }) {
  const url = SITE + path;
  const t = esc(title);
  const d = esc(description);
  const img = SITE + image;
  const robots = noindex ? "noindex, follow" : "index, follow, max-image-preview:large";

  let html = base;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  html = replaceTag(html, /<meta\s+name="description"[\s\S]*?>/i, `<meta name="description" content="${d}" />`);
  html = replaceTag(html, /<meta\s+name="robots"[\s\S]*?>/i, `<meta name="robots" content="${robots}" />`);
  html = replaceTag(html, /<link\s+rel="canonical"[\s\S]*?>/i, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:url"[\s\S]*?>/i, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:title"[\s\S]*?>/i, `<meta property="og:title" content="${t}" />`);
  html = replaceTag(html, /<meta\s+property="og:description"[\s\S]*?>/i, `<meta property="og:description" content="${d}" />`);
  html = replaceTag(html, /<meta\s+property="og:image"[\s\S]*?>/i, `<meta property="og:image" content="${img}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:image"[\s\S]*?>/i, `<meta name="twitter:image" content="${img}" />`);
  return html;
}

// --- Servidor estático con fallback SPA (para que Puppeteer rinda rutas) -----
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain",
};
function startServer(shell) {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      try {
        const urlPath = decodeURIComponent(req.url.split("?")[0]);
        const file = join(DIST, urlPath);
        // Documentos HTML y rutas SPA → siempre el shell limpio desde memoria,
        // así reescribir dist/*/index.html durante el bucle no contamina el render.
        if (extname(file) === "" || extname(file) === ".html") {
          resp.writeHead(200, { "Content-Type": "text/html" });
          resp.end(shell);
          return;
        }
        if (!existsSync(file)) { resp.writeHead(404); resp.end(); return; }
        resp.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
        createReadStream(file).pipe(resp);
      } catch {
        resp.writeHead(404); resp.end();
      }
    });
    server.listen(0, "127.0.0.1", () => res(server));
  });
}

// Lanza un navegador headless probando, en orden:
//  1) @sparticuz/chromium + puppeteer-core  → entorno Vercel/Lambda (Linux)
//  2) puppeteer (con su Chromium)           → máquina local
async function launchBrowser() {
  // 1) Vercel / serverless
  try {
    const chromium = (await import("@sparticuz/chromium")).default;
    const pc = (await import("puppeteer-core")).default;
    const executablePath = await chromium.executablePath();
    if (executablePath) {
      const b = await pc.launch({
        args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: { width: 1280, height: 800 },
        executablePath,
        headless: chromium.headless ?? true,
      });
      console.log("[prerender] navegador: @sparticuz/chromium");
      return b;
    }
  } catch (e) {
    console.warn("[prerender] @sparticuz no disponible:", e?.message || e);
  }
  // 2) Local
  try {
    const puppeteer = (await import("puppeteer")).default;
    const b = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    console.log("[prerender] navegador: puppeteer (local)");
    return b;
  } catch (e) {
    console.warn("[prerender] puppeteer local no disponible:", e?.message || e);
  }
  return null;
}

async function fullRender(routes, base) {
  let server;
  const browser = await launchBrowser();
  if (!browser) return false;
  try {
    server = await startServer(base);
    const port = server.address().port;
    const origin = `http://127.0.0.1:${port}`;

    for (const route of routes) {
      const page = await browser.newPage();
      // No cargar el widget externo del chatbot durante el prerender.
      await page.setRequestInterception(true);
      page.on("request", (r) => {
        if (/asistente-trafico\.vercel\.app/.test(r.url())) return r.abort();
        r.continue();
      });
      await page.goto(origin + route.path, { waitUntil: "load", timeout: 30000 });
      await page
        .waitForFunction(
          'document.getElementById("root") && document.getElementById("root").childElementCount > 0',
          { timeout: 15000 }
        )
        .catch(() => {});
      let html = await page.content();
      if (!/<!DOCTYPE/i.test(html)) html = "<!DOCTYPE html>\n" + html;
      const outDir = join(DIST, route.path);
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, "index.html"), html, "utf8");
      await page.close();
    }
    console.log(`[prerender] modo COMPLETO: ${routes.length} rutas renderizadas con navegador.`);
    return true;
  } catch (e) {
    console.warn("[prerender] fallo en render completo:", e?.message || e);
    return false;
  } finally {
    if (server) server.close();
    if (browser) await browser.close();
  }
}

async function metaOnly(routes, base) {
  let n = 0;
  for (const route of routes) {
    const html = injectMeta(base, route);
    const outDir = join(DIST, route.path);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html, "utf8");
    n++;
  }
  console.log(`[prerender] modo FALLBACK (meta): ${n} rutas con meta estática.`);
}

async function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.warn("[prerender] dist/index.html no existe; se omite.");
    return;
  }
  const base = await readFile(indexPath, "utf8");

  const [{ servicios }, { ogImageFor }] = await Promise.all([
    import(pathToFileUrl(join(ROOT, "src", "data", "servicios.js"))),
    import(pathToFileUrl(join(ROOT, "src", "data", "ogImages.js"))),
  ]);

  const base_routes = [
    { path: "/", title: "Abogados de Multas de Tráfico en toda España | Rivero Abogados",
      description: "¿Te han multado? Estudiamos tu multa GRATIS y te decimos si tiene recurso. Especialistas en sanciones de tráfico, alcoholemia, recursos y puntos del carnet. Toda España, 100% online." },
    { path: "/servicios", title: "Servicios y honorarios | Rivero Abogados de Tráfico",
      description: "Alegaciones, identificación del conductor, recurso de reposición, oposición al apremio, defensa penal de tráfico y recuperación del carnet. Honorarios transparentes y cuota fija." },
    ...servicios.map((s) => ({
      path: `/servicios/${s.slug}`,
      title: `${s.titulo} | Rivero Abogados de Tráfico`,
      description: s.resumen,
    })),
    { path: "/anti-multaitor", title: "Anti Multaitor · Descubre si puedes anular tu multa | Rivero Abogados",
      description: "Anti Multaitor, el asistente con IA que analiza tu multa de tráfico en 2 minutos y te dice si tiene posibilidades de anularse por nulidad o anulabilidad. Gratis y sin compromiso." },
    { path: "/sobre-mi", title: "Sobre Carlos Rivero — Abogado de Tráfico | Rivero Abogados",
      description: "Carlos Rivero García, abogado colegiado ICAM 12.345 especializado en la defensa de multas de tráfico. 15 años peleando sanciones injustas frente a la DGT y los Ayuntamientos." },
    { path: "/opiniones", title: "Opiniones de clientes | Rivero Abogados de Tráfico",
      description: "Lo que dicen los conductores a los que hemos defendido: multas anuladas, embargos frenados y puntos recuperados. Testimonios reales de clientes de Rivero Abogados." },
    { path: "/contacto", title: "Contacto — Consulta gratis tu multa | Rivero Abogados",
      description: "Contacta con Rivero Abogados. Estudiamos tu multa de tráfico gratis y sin compromiso. Atención en toda España, 100% online. Respondemos en 24-48 horas." },
    { path: "/aviso-legal", title: "Aviso legal — Rivero Abogados",
      description: "Aviso legal de Rivero Abogados, despacho especializado en la defensa de multas de tráfico en toda España." },
    { path: "/privacidad", title: "Política de privacidad — Rivero Abogados",
      description: "Política de privacidad y tratamiento de datos personales de Rivero Abogados conforme al RGPD y la LOPDGDD." },
    { path: "/cookies", title: "Política de cookies — Rivero Abogados",
      description: "Política de cookies del sitio web de Rivero Abogados: qué cookies usamos y cómo gestionarlas." },
    { path: "/pago-confirmado", title: "Pago confirmado | Rivero Abogados",
      description: "Tu pago se ha completado. Te explicamos los siguientes pasos.", noindex: true },
  ];

  const routes = base_routes.map((r) => ({ ...r, image: ogImageFor(r.path) }));

  const ok = await fullRender(routes, base);
  if (!ok) await metaOnly(routes, base);
}

main().catch((err) => {
  console.warn("[prerender] aviso (no bloqueante):", err?.message || err);
  process.exit(0);
});
