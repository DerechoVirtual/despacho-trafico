// Utilidades compartidas de los endpoints públicos: parseo defensivo del body,
// saneado de strings, validación ligera y rate-limiting en memoria.
//
// El rate-limit es "best-effort": en serverless cada instancia caliente tiene su
// propio mapa, así que no es un límite global exacto, pero corta en seco los
// bursts de un mismo cliente (spam, scripts), que es lo que nos interesa.

const CONTROL_CHARS = new RegExp("[\u0000-\u001F\u007F]", "g");

/** Devuelve el body como objeto, venga ya parseado o como string. */
export function parseBody(req) {
  let data = req.body;
  if (!data || typeof data === "string") {
    try {
      data = JSON.parse(data || "{}");
    } catch {
      data = {};
    }
  }
  return typeof data === "object" && data !== null ? data : {};
}

/** Convierte a string, recorta espacios, elimina caracteres de control y capa longitud. */
export function str(v, max = 300) {
  if (v === undefined || v === null) return "";
  return String(v).replace(CONTROL_CHARS, "").trim().slice(0, max);
}

/** Validación laxa de email (suficiente para descartar basura evidente). */
export function isEmail(s = "") {
  return /^[^\s@]{1,80}@[^\s@]{1,120}\.[^\s@]{2,24}$/.test(s);
}

/** Validación laxa de teléfono: dígitos, espacios, +, -, paréntesis. */
export function isPhone(s = "") {
  const digits = (s.match(/\d/g) || []).length;
  return digits >= 7 && digits <= 15 && /^[\d\s+().-]+$/.test(s);
}

/** IP del cliente detrás del proxy de Vercel. */
export function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

// --- Rate limit en memoria (ventana simple) ---------------------------------
const buckets = new Map();
const SWEEP_EVERY = 120_000; // limpieza periódica para no crecer sin límite
let lastSweep = Date.now();

/**
 * true si la petición SUPERA el límite (hay que rechazarla).
 * key: nombre del endpoint; limit: peticiones permitidas por ventana.
 */
export function rateLimited(req, { key = "global", limit = 8, windowMs = 60_000 } = {}) {
  const now = Date.now();
  if (now - lastSweep > SWEEP_EVERY) {
    lastSweep = now;
    for (const [k, v] of buckets) {
      if (now - v.start > windowMs * 2) buckets.delete(k);
    }
  }
  const id = `${key}:${clientIp(req)}`;
  const b = buckets.get(id);
  if (!b || now - b.start > windowMs) {
    buckets.set(id, { start: now, count: 1 });
    return false;
  }
  b.count += 1;
  return b.count > limit;
}

/** Responde 405 si el método no es el esperado. Devuelve true si cortó. */
export function rejectMethod(req, res, method = "POST") {
  if (req.method === method) return false;
  res.setHeader("Allow", method);
  res.status(405).json({ ok: false, error: "Método no permitido" });
  return true;
}

/** Responde 429 con mensaje amable. */
export function tooMany(res) {
  return res.status(429).json({
    ok: false,
    error: "Has hecho demasiadas peticiones seguidas. Espera un minuto y vuelve a intentarlo.",
  });
}

/**
 * Honeypot anti-spam: el campo "web" está oculto para humanos; si llega
 * relleno es un bot. Se responde como si todo hubiera ido bien (para no dar
 * pistas) pero sin hacer nada.
 */
export function isSpamBot(data) {
  return typeof data.web === "string" && data.web.trim().length > 0;
}
