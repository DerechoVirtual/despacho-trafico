import { useEffect } from "react";

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

function setCanonical(path) {
  let el = document.head.querySelector('link[rel="canonical"]');
  const prev = el ? el.getAttribute("href") : null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", SITE + (path || "/"));
  return { el, prev };
}

/**
 * Hook de SEO por página: actualiza title, description, canonical y OG.
 */
export function useSeo({ title, description, path }) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    const restorers = [];
    const d = setMeta("name", "description", description);
    if (d) restorers.push(() => d.el.setAttribute("content", d.prev ?? ""));
    const ogt = setMeta("property", "og:title", title);
    if (ogt) restorers.push(() => ogt.el.setAttribute("content", ogt.prev ?? ""));
    const ogd = setMeta("property", "og:description", description);
    if (ogd) restorers.push(() => ogd.el.setAttribute("content", ogd.prev ?? ""));
    const can = setCanonical(path);
    if (can.prev) restorers.push(() => can.el.setAttribute("href", can.prev));

    return () => {
      document.title = prevTitle;
      restorers.forEach((fn) => fn());
    };
  }, [title, description, path]);
}
