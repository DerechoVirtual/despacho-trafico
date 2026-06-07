// Imagen OG (vista previa en redes) por ruta. Cada URL tiene la suya, generada
// con gpt-image-2. Las rutas no listadas (legales, pago) usan la imagen de marca.
// Se usa tanto en el cliente (src/lib/seo.js) como en el prerender de build
// (scripts/prerender-meta.mjs), por lo que es un módulo de datos sin dependencias.

export const OG_DEFAULT = "/imagenes/og-image.jpg";

export const ogImages = {
  "/": "/imagenes/og/home.jpg",
  "/servicios": "/imagenes/og/servicios.jpg",
  "/servicios/alegaciones": "/imagenes/og/alegaciones.jpg",
  "/servicios/identificacion-conductor": "/imagenes/og/identificacion-conductor.jpg",
  "/servicios/recurso-reposicion": "/imagenes/og/recurso-reposicion.jpg",
  "/servicios/oposicion-apremio": "/imagenes/og/oposicion-apremio.jpg",
  "/servicios/defensa-penal": "/imagenes/og/defensa-penal.jpg",
  "/servicios/carnet-licencias": "/imagenes/og/carnet-licencias.jpg",
  "/anti-multaitor": "/imagenes/og/anti-multaitor.jpg",
  "/sobre-mi": "/imagenes/og/sobre-mi.jpg",
  "/opiniones": "/imagenes/og/opiniones.jpg",
  "/contacto": "/imagenes/og/contacto.jpg",
};

export function ogImageFor(path) {
  return ogImages[path] || OG_DEFAULT;
}
