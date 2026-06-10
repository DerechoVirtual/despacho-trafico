// Crea una sesión de Stripe Checkout para un servicio del despacho y devuelve
// la URL a la que redirigir al cliente. POST { slug }
//
// Variables de entorno (Vercel): STRIPE_API_KEY

import { getServicio, TAX_RATE } from "./_lib/servicios.js";
import { parseBody, str, rateLimited, rejectMethod, tooMany } from "./_lib/http.js";

const API = "https://api.stripe.com/v1";

// Solo construimos las URLs de retorno sobre hosts nuestros; ante cualquier
// otra cosa (cabecera Host manipulada) caemos al dominio canónico.
const BASE_CANONICA = "https://despachotrafico.org";
function baseSegura(req) {
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
  const valido =
    host === "despachotrafico.org" ||
    host === "www.despachotrafico.org" ||
    host.endsWith(".vercel.app") ||
    host.startsWith("localhost:") ||
    host === "localhost";
  return valido ? `${proto}://${host}` : BASE_CANONICA;
}

function form(params) {
  const body = new URLSearchParams();
  const add = (k, v) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((vv, i) => add(`${k}[${i}]`, vv));
    else if (typeof v === "object") for (const kk in v) add(`${k}[${kk}]`, v[kk]);
    else body.append(k, String(v));
  };
  for (const k in params) add(k, params[k]);
  return body;
}

export default async function handler(req, res) {
  if (rejectMethod(req, res, "POST")) return;
  if (rateLimited(req, { key: "checkout", limit: 10, windowMs: 60_000 })) {
    return tooMany(res);
  }

  const data = parseBody(req);
  const slug = str(data.slug, 60);
  const servicio = getServicio(slug);
  if (!servicio) return res.status(400).json({ ok: false, error: "Servicio no válido" });

  const key = process.env.STRIPE_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: "Pago no configurado" });

  const base = baseSegura(req);

  const params = {
    mode: "payment",
    locale: "es",
    "line_items[0][price]": servicio.price,
    "line_items[0][quantity]": 1,
    "line_items[0][tax_rates][0]": TAX_RATE,
    success_url: `${base}/pago-confirmado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/servicios/${slug}`,
    "metadata[slug]": slug,
    "payment_intent_data[metadata][slug]": slug,
    "phone_number_collection[enabled]": "true",
    billing_address_collection: "required",
    // DNI/NIF del cliente: obligatorio para emitir factura completa (RD 1619/2012).
    "custom_fields[0][key]": "dni",
    "custom_fields[0][label][type]": "custom",
    "custom_fields[0][label][custom]": "DNI / NIF (necesario para tu factura)",
    "custom_fields[0][type]": "text",
    "custom_fields[0][text][minimum_length]": 8,
    "custom_fields[0][text][maximum_length]": 9,
    "custom_fields[0][optional]": "false",
    custom_text: {
      submit: {
        message:
          "Al contratar, abrimos tu expediente y te damos acceso a tu plataforma para subir la documentación.",
      },
    },
  };

  try {
    const r = await fetch(`${API}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form(params),
    });
    const j = await r.json();
    if (!r.ok) {
      console.error("Stripe checkout error:", JSON.stringify(j.error || j).slice(0, 300));
      return res.status(500).json({ ok: false, error: "No se pudo iniciar el pago." });
    }
    return res.status(200).json({ ok: true, url: j.url });
  } catch (err) {
    console.error("crear-checkout:", err.message);
    return res.status(500).json({ ok: false, error: "No se pudo iniciar el pago." });
  }
}
