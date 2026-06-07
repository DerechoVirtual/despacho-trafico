import { useEffect } from "react";
import { ogImageFor } from "../data/ogImages.js";

const SITE = "https://despachotrafico.org";

function setMeta(attr, key, content) {
  if (!content) return null;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const prev = el.getAttribute("content");
  el.setAttribute("content", content);
  return { el, prev, created };
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  const prev = el ? el.getAttribute("href") : null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return { el, prev };
}

/**
 * Hook de SEO por página: actualiza title, description, canonical, OG y robots.
 * - path: ruta absoluta de la página (p. ej. "/servicios"). Se usa para el
 *   canonical y og:url en el dominio de producción.
 * - noindex: true para páginas que NO deben indexarse (gracias, confirmaciones).
 */
export function useSeo({ title, description, path, noindex = false }) {
  useEffect(() => {
    const url = SITE + (path || "/");
    const prevTitle = document.title;
    if (title) document.title = title;

    const restorers = [];
    const push = (r) => r && restorers.push(r);
    const restoreMeta = (m, fallback) =>
      m && (() => m.el.setAttribute("content", m.prev ?? fallback));

    push(restoreMeta(setMeta("name", "description", description), ""));
    push(restoreMeta(setMeta("property", "og:title", title), ""));
    push(restoreMeta(setMeta("property", "og:description", description), ""));
    push(restoreMeta(setMeta("property", "og:url", url), ""));

    // Imagen de redes propia de cada ruta.
    const img = SITE + ogImageFor(path || "/");
    push(restoreMeta(setMeta("property", "og:image", img), ""));
    push(restoreMeta(setMeta("name", "twitter:image", img), ""));

    // Robots: por defecto indexable; noindex para páginas transaccionales.
    const robots = setMeta(
      "name",
      "robots",
      noindex
        ? "noindex, follow"
        : "index, follow, max-image-preview:large"
    );
    push(restoreMeta(robots, "index, follow, max-image-preview:large"));

    const can = setLink("canonical", url);
    if (can.prev) push(() => can.el.setAttribute("href", can.prev));

    return () => {
      document.title = prevTitle;
      restorers.forEach((fn) => fn());
    };
  }, [title, description, path, noindex]);
}
