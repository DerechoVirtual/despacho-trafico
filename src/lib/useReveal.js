import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Observador global de revelado al scroll.
 * Cualquier elemento con [data-reveal] recibe la clase .in-view al entrar en
 * el viewport (animaciones definidas en index.css). Un MutationObserver
 * registra también los nodos que React monte más tarde (rutas lazy, estados).
 *
 * Redes de seguridad (el contenido SIEMPRE acaba visible):
 * - prefers-reduced-motion o navegadores automatizados (prerender, bots con
 *   navigator.webdriver): todo se muestra al instante, sin animar.
 * - Si IntersectionObserver no existe o no responde (webviews raros): el
 *   estándar garantiza un callback inicial al observar; si en ~1,2 s no ha
 *   llegado ninguno, pasamos a modo "mostrar todo".
 */
export function useReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pendientes = () =>
      Array.from(document.querySelectorAll("[data-reveal]:not(.in-view)"));
    const mostrar = (el) => el.classList.add("in-view");

    const sinAnimacion =
      (typeof navigator !== "undefined" && navigator.webdriver === true) ||
      (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    let modoTodo = sinAnimacion || typeof IntersectionObserver === "undefined";
    let io = null;
    let ioRespondio = false;

    const activarModoTodo = () => {
      modoTodo = true;
      if (io) io.disconnect();
      // Clase global: muestra todo por CSS aunque las animaciones tampoco corran.
      document.documentElement.classList.add("reveal-all");
      pendientes().forEach(mostrar);
    };

    if (modoTodo) {
      document.documentElement.classList.add("reveal-all");
    } else {
      // El HTML prerenderizado llega con la clase puesta (se capturó en modo
      // bot); en un navegador sano la quitamos para recuperar las animaciones.
      document.documentElement.classList.remove("reveal-all");
    }

    if (!modoTodo) {
      io = new IntersectionObserver(
        (entries) => {
          ioRespondio = true;
          for (const e of entries) {
            if (e.isIntersecting) {
              mostrar(e.target);
              io.unobserve(e.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      pendientes().forEach((el) => io.observe(el));
    } else {
      pendientes().forEach(mostrar);
    }

    // Sonda: el observador DEBE emitir un callback inicial. Si no llega,
    // este entorno tiene IO roto → revelar todo y no esconder nada más.
    const sonda = setTimeout(() => {
      if (!modoTodo && !ioRespondio) activarModoTodo();
    }, 1200);

    // Nodos que React monte después (rutas lazy, cambios de estado).
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (modoTodo) pendientes().forEach(mostrar);
        else pendientes().forEach((el) => io.observe(el));
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(sonda);
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
}
