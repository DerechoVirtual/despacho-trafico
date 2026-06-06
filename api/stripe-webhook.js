// Webhook de Stripe. Al completarse un pago (checkout.session.completed):
//   1) crea/recupera el usuario y perfil del cliente en Supabase
//   2) abre su expediente y le marca los documentos que debe subir (según el servicio)
//   3) le envía un email de CONFIRMACIÓN de pago y otro de BIENVENIDA a la plataforma
//   4) avisa al despacho de la nueva venta
//
// Variables de entorno (Vercel): STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET,
//   SUPABASE_URL, SUPABASE_SECRET_KEY, CRM_URL, NOTIFY_EMAIL (+ las de Gmail)

import crypto from "node:crypto";
import { getServicio, DOC_TITULOS, MODO_TEST } from "./_lib/servicios.js";
import { enviarEmail, esc } from "./_lib/gmail.js";
import { generarFacturaHTML, calcularImportes } from "./_lib/factura.js";
import {
  crearUsuario,
  actualizarPerfil,
  reemplazarExpediente,
  reemplazarDocumentos,
  crearNotificacion,
} from "./_lib/supabase.js";

// Necesitamos el cuerpo SIN parsear para validar la firma de Stripe.
export const config = { api: { bodyParser: false } };

async function leerRaw(req) {
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
}

function verificarFirma(raw, firma, secreto) {
  if (!firma || !secreto) return false;
  const partes = Object.fromEntries(
    firma.split(",").map((kv) => kv.split("=").map((s) => s.trim()))
  );
  const t = partes.t;
  const v1 = partes.v1;
  if (!t || !v1) return false;
  const esperado = crypto
    .createHmac("sha256", secreto)
    .update(`${t}.${raw.toString("utf8")}`)
    .digest("hex");
  const a = Buffer.from(esperado);
  const b = Buffer.from(v1);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const eur = (cents) =>
  (cents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });

function tempPassword() {
  const base = crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "");
  return `Rivero-${base}9`;
}

// --- Plantillas de email ---------------------------------------------------
function emailBienvenida({ nombre, email, password, crmUrl, servicio, docs }) {
  const lista = docs
    .map(
      (clave) =>
        `<li style="margin:6px 0;line-height:1.5">${esc(DOC_TITULOS[clave] || clave)}</li>`
    )
    .join("");
  const listaTxt = docs.map((c) => `  - ${DOC_TITULOS[c] || c}`).join("\n");
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1d2733">
    <div style="background:#34221a;padding:28px;border-radius:12px 12px 0 0">
      <h1 style="color:#fff;margin:0;font-size:20px">Bienvenido a tu plataforma 🚀</h1>
      <p style="color:#c8a45c;margin:6px 0 0;font-size:13px">Rivero Abogados · Tu expediente ya está abierto</p>
    </div>
    <div style="border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px;padding:28px">
      <p style="font-size:15px">Hola ${esc(nombre)},</p>
      <p style="font-size:15px;line-height:1.6">Ya hemos abierto tu expediente para tu <strong>${esc(servicio)}</strong>. Desde tu plataforma privada podrás subir la documentación, ver el estado de tu caso y recibir todas las novedades.</p>

      <div style="background:#f6efe2;border-radius:12px;padding:18px;margin:20px 0">
        <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Tus datos de acceso</p>
        <p style="margin:4px 0;font-size:15px"><strong>Usuario:</strong> ${esc(email)}</p>
        <p style="margin:4px 0;font-size:15px"><strong>Contraseña temporal:</strong> <code style="background:#fff;padding:2px 8px;border-radius:6px">${esc(password)}</code></p>
        <p style="margin:8px 0 0;font-size:13px;color:#94a3b8">Por seguridad, cámbiala desde tu perfil tras el primer acceso.</p>
      </div>

      <p style="text-align:center;margin:24px 0">
        <a href="${esc(crmUrl)}" style="display:inline-block;background:#c8a45c;color:#34221a;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:999px">Acceder a mi plataforma</a>
      </p>

      <h2 style="font-size:16px;color:#34221a;margin:28px 0 8px">Tus primeros pasos</h2>
      <p style="font-size:15px;line-height:1.6;margin:0 0 8px">Para empezar a trabajar tu caso necesitamos que subas, desde el apartado <strong>"Mi documentación"</strong>, lo siguiente:</p>
      <ul style="font-size:15px;padding-left:20px;margin:8px 0">${lista}</ul>
      <p style="font-size:14px;line-height:1.6;color:#64748b;margin-top:16px">En cuanto recibamos y validemos tu documentación, comenzamos a preparar tu defensa. Si te falta algún documento, súbelo en cuanto puedas y nosotros te avisamos.</p>
      <p style="font-size:14px;color:#64748b;margin-top:24px">Un saludo,<br>Carlos Rivero García · Rivero Abogados</p>
    </div>
  </div>`;
  const text = `Bienvenido a tu plataforma — Rivero Abogados\n\nHola ${nombre},\n\nYa hemos abierto tu expediente para tu ${servicio}.\n\nAcceso: ${crmUrl}\nUsuario: ${email}\nContraseña temporal: ${password}\n(Cámbiala tras el primer acceso.)\n\nPrimeros pasos — sube en "Mi documentación":\n${listaTxt}\n\nEn cuanto validemos tu documentación empezamos a preparar tu defensa.\n\nCarlos Rivero García · Rivero Abogados`;
  return { html, text };
}

// --- Handler ---------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Método no permitido");
  }

  const raw = await leerRaw(req);
  const firma = req.headers["stripe-signature"];
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!verificarFirma(raw, firma, secreto)) {
    return res.status(400).json({ ok: false, error: "Firma no válida" });
  }

  let evento;
  try {
    evento = JSON.parse(raw.toString("utf8"));
  } catch {
    return res.status(400).json({ ok: false, error: "JSON no válido" });
  }

  // Responder rápido a eventos que no nos interesan.
  if (evento.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true });
  }

  const session = evento.data.object;
  if (session.payment_status !== "paid") {
    return res.status(200).json({ received: true });
  }

  try {
    const slug = session.metadata?.slug;
    const servicio = getServicio(slug);
    const cd = session.customer_details || {};
    const email = cd.email;
    const nombre = (cd.name || "").trim() || "cliente";
    const telefono = cd.phone || null;
    const cobradoCents = session.amount_total || 0; // lo realmente cobrado (1€ + IVA en modo test)
    const referencia = (session.id || "").replace("cs_", "").slice(0, 12).toUpperCase();
    const crmUrl = process.env.CRM_URL || "https://proyecto-crm-abogados.vercel.app";

    if (!email || !servicio) {
      console.error("Webhook sin email o servicio:", { email, slug });
      return res.status(200).json({ received: true });
    }

    // Importes de la FACTURA = importe real del servicio (aunque en test se cobre 1€).
    const importes = calcularImportes(servicio.cents, 21);
    const totalReal = eur(importes.totalCents);
    const ahora = new Date();
    const fechaFactura = ahora.toLocaleDateString("es-ES", {
      day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Madrid",
    });
    const numeroFactura = `RV-${ahora.getFullYear()}-${referencia}`;

    // 1) Usuario + perfil
    const password = tempPassword();
    const { id, nuevo } = await crearUsuario(email, nombre, password);
    await actualizarPerfil(id, {
      rol: "cliente",
      nombre,
      email,
      telefono,
      ciudad: cd.address?.city || null,
      cp: cd.address?.postal_code || null,
      direccion: cd.address?.line1 || null,
    });

    // 2) Expediente + documentos requeridos del servicio
    const numExpediente = `WEB-${referencia}`;
    await reemplazarExpediente(id, numExpediente, {
      infraccion: servicio.infraccion,
      estado: "Documentación pendiente",
      honorarios: Math.round(servicio.cents / 100),
      administracion: "Pendiente de asignar",
    });
    await reemplazarDocumentos(id, servicio.docs);
    await crearNotificacion(
      id,
      "Bienvenido: tu expediente está abierto",
      `Hemos abierto tu expediente para tu ${servicio.nombre}. El siguiente paso es subir la documentación pendiente desde "Mi documentación".`
    );

    // 3) Factura (generada con Gemini 3.5 Flash) -> email + adjunto
    const { html: facturaHtml, fuente } = await generarFacturaHTML({
      numero: numeroFactura,
      fecha: fechaFactura,
      concepto: servicio.nombre,
      baseCents: servicio.cents,
      ivaPct: 21,
      cliente: {
        nombre,
        email,
        direccion: cd.address?.line1 || null,
        cp: cd.address?.postal_code || null,
        ciudad: cd.address?.city || null,
      },
    });
    console.log("Factura generada por:", fuente, numeroFactura);

    const introFactura = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto 16px;color:#1d2733">
      <p style="font-size:15px;line-height:1.6">Hola ${esc(nombre)}, hemos recibido tu pago correctamente. Adjuntamos tu <strong>factura</strong> por la contratación de <strong>${esc(servicio.nombre)}</strong>. También puedes verla aquí abajo. En un correo aparte te damos acceso a tu plataforma.</p>
    </div>`;

    await enviarEmail({
      to: email,
      subject: `Tu factura ${numeroFactura} · ${servicio.nombre} · Rivero Abogados`,
      html: introFactura + facturaHtml,
      text: `Hola ${nombre},\n\nHemos recibido tu pago. Adjuntamos tu factura ${numeroFactura} por "${servicio.nombre}".\nBase: ${eur(importes.baseCents)} · IVA 21%: ${eur(importes.ivaCents)} · TOTAL: ${totalReal}\n\nEn un correo aparte te enviamos el acceso a tu plataforma.\n\nRivero Abogados`,
      replyTo: process.env.NOTIFY_EMAIL,
      attachments: [
        {
          filename: `factura-${numeroFactura}.html`,
          mimeType: "text/html",
          contentBase64: Buffer.from(facturaHtml, "utf-8").toString("base64"),
        },
      ],
    });

    const bienv = emailBienvenida({
      nombre,
      email,
      password,
      crmUrl,
      servicio: servicio.nombre,
      docs: servicio.docs,
    });
    await enviarEmail({
      to: email,
      subject: "Bienvenido a tu plataforma · Rivero Abogados",
      ...bienv,
      replyTo: process.env.NOTIFY_EMAIL,
    });

    // 4) Aviso interno al despacho
    if (process.env.NOTIFY_EMAIL) {
      await enviarEmail({
        to: process.env.NOTIFY_EMAIL,
        subject: `💰 Nueva venta web: ${servicio.nombre} (factura ${totalReal})`,
        html: `<div style="font-family:Arial,sans-serif">
          <h2 style="color:#0f2c4d">Nueva contratación online</h2>
          <p><strong>Servicio:</strong> ${esc(servicio.nombre)}<br>
          <strong>Factura:</strong> ${esc(numeroFactura)} · ${esc(totalReal)} (IVA incl.)<br>
          ${MODO_TEST ? `<strong>⚠️ MODO TEST:</strong> cobrado en Stripe ${esc(eur(cobradoCents))}<br>` : ""}
          <strong>Cliente:</strong> ${esc(nombre)} (${esc(email)})<br>
          <strong>Teléfono:</strong> ${esc(telefono || "—")}<br>
          <strong>Expediente:</strong> ${esc(numExpediente)}<br>
          <strong>Usuario ${nuevo ? "nuevo" : "ya existente"}</strong> en la plataforma.</p>
        </div>`,
        text: `Nueva venta: ${servicio.nombre}\nFactura ${numeroFactura}: ${totalReal} (IVA incl.)${MODO_TEST ? `\nMODO TEST: cobrado ${eur(cobradoCents)}` : ""}\nCliente: ${nombre} (${email})\nTel: ${telefono || "—"}\nExpediente: ${numExpediente}`,
      }).catch((e) => console.error("aviso interno:", e.message));
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Fulfillment error:", err.message);
    // 500 para que Stripe reintente el evento.
    return res.status(500).json({ ok: false, error: "Fulfillment fallido" });
  }
}
