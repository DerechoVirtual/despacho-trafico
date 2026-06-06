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
import { generarFacturaPDF, calcularImportes } from "./_lib/factura.js";
import { subirFacturaADrive, registrarFacturaEnExcel } from "./_lib/drive.js";
import {
  crearUsuario,
  actualizarPerfil,
  reemplazarExpediente,
  reemplazarDocumentos,
  crearNotificacion,
  crearBucketSiNoExiste,
  subirArchivo,
  urlFirmada,
  siguienteNumFactura,
  crearFactura,
  buscarImpago,
  actualizarImpago,
  buscarPerfilIdPorEmail,
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

// --- Impagos / pagos fallidos ----------------------------------------------
// Extrae el email, el servicio y el importe de cualquiera de los eventos de
// fallo y deja constancia en la tabla `facturas` (estado "fallida"), contando
// los intentos repetidos del mismo cliente para el mismo servicio.
async function registrarImpago(evento) {
  const obj = evento.data.object || {};
  let email = null, nombre = null, slug = null, amountCents = 0;

  if (evento.type.startsWith("checkout.session")) {
    const cd = obj.customer_details || {};
    email = cd.email || null;
    nombre = (cd.name || "").trim() || null;
    slug = obj.metadata?.slug || null;
    amountCents = obj.amount_total || 0;
  } else if (evento.type === "payment_intent.payment_failed") {
    slug = obj.metadata?.slug || null;
    amountCents = obj.amount || 0;
    email = obj.receipt_email ||
      obj.last_payment_error?.payment_method?.billing_details?.email || null;
    nombre = obj.last_payment_error?.payment_method?.billing_details?.name || null;
  } else if (evento.type === "charge.failed") {
    slug = obj.metadata?.slug || null;
    amountCents = obj.amount || 0;
    email = obj.billing_details?.email || obj.receipt_email || null;
    nombre = obj.billing_details?.name || null;
  }

  const servicio = getServicio(slug);
  const concepto = servicio?.nombre || "Pago de servicio (no completado)";
  // Importe de referencia: el real del servicio si lo conocemos; si no, lo del evento.
  const baseRef = servicio ? servicio.cents : Math.round(amountCents / 1.21) || amountCents;
  const importes = calcularImportes(baseRef, 21);

  const clienteId = email ? await buscarPerfilIdPorEmail(email).catch(() => null) : null;

  // ¿Ya había un impago de este cliente para este servicio? -> sumar intento.
  const previo = await buscarImpago(email, slug).catch(() => null);
  if (previo) {
    await actualizarImpago(previo.id, {
      intentos_fallidos: (previo.intentos_fallidos || 1) + 1,
      emitida_en: new Date().toISOString(),
    });
    return;
  }

  await crearFactura({
    cliente_id: clienteId,
    concepto,
    slug,
    base_cents: importes.baseCents,
    iva_cents: importes.ivaCents,
    total_cents: importes.totalCents,
    iva_pct: 21,
    estado: "fallida",
    intentos_fallidos: 1,
    metodo_pago: "Tarjeta - Stripe",
    stripe_session_id: evento.type.startsWith("checkout.session") ? obj.id : null,
    stripe_payment_intent:
      typeof obj.payment_intent === "string"
        ? obj.payment_intent
        : evento.type === "payment_intent.payment_failed"
        ? obj.id
        : null,
    email,
    nombre,
    emitida_en: new Date().toISOString(),
  });
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

  // Pagos fallidos / impagos: dejamos constancia en el CRM (no bloqueamos nada).
  const EVENTOS_FALLO = new Set([
    "payment_intent.payment_failed",
    "charge.failed",
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
  ]);
  if (EVENTOS_FALLO.has(evento.type)) {
    try {
      await registrarImpago(evento);
    } catch (e) {
      console.error("registrarImpago:", e.message);
    }
    // 200 siempre: es un registro best-effort, no queremos reintentos infinitos.
    return res.status(200).json({ received: true });
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
    // DNI/NIF recogido en el checkout (campo personalizado).
    const dni =
      (session.custom_fields || []).find((f) => f.key === "dni")?.text?.value?.trim().toUpperCase() ||
      null;

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
    // Numeración correlativa legal (con respaldo si la RPC fallara).
    let numeroFactura;
    try {
      numeroFactura = await siguienteNumFactura();
    } catch (e) {
      console.error("num factura RPC:", e.message);
      numeroFactura = `FRA-${ahora.getFullYear()}-${referencia}`;
    }

    // 1) Usuario + perfil
    const password = tempPassword();
    const { id, nuevo } = await crearUsuario(email, nombre, password);
    await actualizarPerfil(id, {
      rol: "cliente",
      nombre,
      email,
      telefono,
      dni,
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

    // 3) Factura en PDF (texto por Gemini 3.5 Flash, maquetado con pdf-lib)
    const { bytes: pdfBytes, fuente } = await generarFacturaPDF({
      numero: numeroFactura,
      fechaExpedicion: fechaFactura,
      fechaOperacion: fechaFactura,
      formaPago: "Tarjeta · Stripe",
      concepto: servicio.nombre,
      baseCents: servicio.cents,
      ivaPct: 21,
      cliente: {
        nombre,
        dni,
        email,
        direccion: cd.address?.line1 || null,
        cp: cd.address?.postal_code || null,
        ciudad: cd.address?.city || null,
      },
    });
    console.log("Factura PDF generada (texto:", fuente + "):", numeroFactura, pdfBytes.length, "bytes");

    // Guardar el PDF en Supabase Storage y obtener enlace de descarga firmado.
    const facturaPath = `${id}/factura-${numeroFactura}.pdf`;
    let enlaceFactura = null;
    try {
      await crearBucketSiNoExiste("facturas", false);
      await subirArchivo("facturas", facturaPath, pdfBytes, "application/pdf");
      enlaceFactura = await urlFirmada("facturas", facturaPath, 31536000); // 1 año
    } catch (e) {
      console.error("Storage factura:", e.message);
    }

    // Guardar TAMBIÉN la factura en Google Drive, ordenada por MES, y anotarla en el
    // Excel del TRIMESTRE. Best-effort: si fallara, no rompemos la venta.
    const driveRes = await subirFacturaADrive({
      filename: `factura-${numeroFactura}.pdf`,
      bytes: pdfBytes,
      fecha: ahora,
    });
    if (driveRes.ok) {
      console.log("Factura PDF en Drive:", numeroFactura, "→", driveRes.carpeta,
        driveRes.webViewLink || driveRes.id, driveRes.yaExistia ? "(ya existía)" : "(subida)");
    } else {
      console.error("Drive factura PDF:", driveRes.error);
    }

    const excelRes = await registrarFacturaEnExcel({
      fecha: ahora,
      claveUnica: numeroFactura,
      encabezados: [
        "Nº factura", "Fecha", "Cliente", "DNI/NIF", "Servicio",
        "Base (€)", "IVA (€)", "Total (€)", "Estado", "Método de pago", "Enlace PDF",
      ],
      fila: [
        numeroFactura,
        fechaFactura,
        nombre,
        dni || "",
        servicio.nombre,
        +(importes.baseCents / 100).toFixed(2),
        +(importes.ivaCents / 100).toFixed(2),
        +(importes.totalCents / 100).toFixed(2),
        "Pagada",
        "Tarjeta · Stripe",
        driveRes.webViewLink || enlaceFactura || "",
      ],
    });
    if (excelRes.ok) {
      console.log("Factura anotada en Excel:", excelRes.hoja, excelRes.yaEstaba ? "(ya estaba)" : "(añadida)");
    } else {
      console.error("Drive factura Excel:", excelRes.error);
    }

    // Registrar la VENTA en el CRM (tabla facturas) para "Ventas y evolución".
    try {
      await crearFactura({
        cliente_id: id,
        numero: numeroFactura,
        concepto: servicio.nombre,
        slug,
        base_cents: importes.baseCents,
        iva_cents: importes.ivaCents,
        total_cents: importes.totalCents,
        iva_pct: 21,
        estado: "pagada",
        metodo_pago: "Tarjeta - Stripe",
        stripe_session_id: session.id || null,
        stripe_payment_intent:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
        storage_path: facturaPath,
        email,
        nombre,
        emitida_en: ahora.toISOString(),
      });
    } catch (e) {
      console.error("crearFactura:", e.message);
    }

    const introFactura = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1d2733">
      <div style="background:#0f2c4d;padding:24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">Pago confirmado ✔ · Tu factura</h1>
        <p style="color:#c8a45c;margin:6px 0 0;font-size:13px">Rivero Abogados · ${esc(numeroFactura)}</p>
      </div>
      <div style="border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px;padding:24px">
        <p style="font-size:15px;line-height:1.6">Hola ${esc(nombre)}, hemos recibido tu pago correctamente. Adjuntamos tu <strong>factura en PDF</strong> por la contratación de <strong>${esc(servicio.nombre)}</strong> (total ${esc(totalReal)}, IVA incluido).</p>
        ${enlaceFactura ? `<p style="text-align:center;margin:22px 0"><a href="${esc(enlaceFactura)}" style="display:inline-block;background:#c8a45c;color:#0f2c4d;font-weight:bold;text-decoration:none;padding:12px 26px;border-radius:999px">Descargar factura (PDF)</a></p>` : ""}
        <p style="font-size:14px;line-height:1.6;color:#64748b">En un correo aparte te damos acceso a tu plataforma para subir la documentación. Si tienes cualquier duda, responde a este email.</p>
      </div>
    </div>`;

    await enviarEmail({
      to: email,
      subject: `Tu factura ${numeroFactura} · ${servicio.nombre} · Rivero Abogados`,
      html: introFactura,
      text: `Hola ${nombre},\n\nHemos recibido tu pago. Adjuntamos tu factura ${numeroFactura} en PDF por "${servicio.nombre}".\nBase: ${eur(importes.baseCents)} · IVA 21%: ${eur(importes.ivaCents)} · TOTAL: ${totalReal}\n${enlaceFactura ? `\nDescarga: ${enlaceFactura}\n` : ""}\nEn un correo aparte te enviamos el acceso a tu plataforma.\n\nRivero Abogados`,
      replyTo: process.env.NOTIFY_EMAIL,
      attachments: [
        {
          filename: `factura-${numeroFactura}.pdf`,
          mimeType: "application/pdf",
          contentBase64: Buffer.from(pdfBytes).toString("base64"),
        },
      ],
    });

    if (enlaceFactura) {
      await crearNotificacion(
        id,
        `Factura ${numeroFactura} disponible`,
        `Tu factura por ${servicio.nombre} (${totalReal}, IVA incluido) ya está disponible.`,
        ["plataforma", "email"],
        enlaceFactura
      ).catch((e) => console.error("notif factura:", e.message));
    }

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
      // Constancia clara y visible de si la factura quedó guardada en Google Drive
      // (PDF por mes) y anotada en el Excel del trimestre.
      const excelLinea = excelRes.ok
        ? `<p style="margin:6px 0 0;font-size:13px;color:#137333">Excel del trimestre: <strong>${esc(excelRes.hoja)}</strong>${excelRes.yaEstaba ? " (ya estaba anotada)" : " — fila añadida"}${excelRes.webViewLink ? ` · <a href="${esc(excelRes.webViewLink)}" style="color:#0b5394;font-weight:bold">abrir Excel →</a>` : ""}</p>`
        : `<p style="margin:6px 0 0;font-size:13px;color:#c5221f">⚠ No se pudo anotar en el Excel del trimestre (${esc(excelRes.error || "error")}).</p>`;
      const driveHtml = driveRes.ok
        ? `<div style="margin:16px 0;padding:14px 16px;border-radius:10px;background:#e7f6ec;border:1px solid #adddc0">
            <p style="margin:0;font-size:15px;color:#137333"><strong>✔ Factura guardada en Google Drive</strong></p>
            <p style="margin:6px 0 0;font-size:13px;color:#137333">Carpeta (por mes): <strong>${esc(driveRes.carpeta)}</strong>${driveRes.yaExistia ? " (ya estaba guardada)" : ""}</p>
            ${driveRes.webViewLink ? `<p style="margin:6px 0 0"><a href="${esc(driveRes.webViewLink)}" style="color:#0b5394;font-weight:bold">Abrir factura (PDF) en Google Drive →</a></p>` : ""}
            ${excelLinea}
          </div>`
        : `<div style="margin:16px 0;padding:14px 16px;border-radius:10px;background:#fce8e6;border:1px solid #f5b5af">
            <p style="margin:0;font-size:15px;color:#c5221f"><strong>⚠ La factura NO se pudo guardar en Google Drive</strong></p>
            <p style="margin:6px 0 0;font-size:13px;color:#c5221f">Motivo: ${esc(driveRes.error || "desconocido")}. (El cliente sí tiene su PDF por email y en la plataforma.)</p>
            ${excelLinea}
          </div>`;
      const driveTxt = (driveRes.ok
        ? `Google Drive (PDF por mes): GUARDADA en "${driveRes.carpeta}"${driveRes.yaExistia ? " (ya estaba)" : ""}${driveRes.webViewLink ? ` -> ${driveRes.webViewLink}` : ""}`
        : `Google Drive: NO guardada (${driveRes.error || "error"})`) +
        (excelRes.ok
          ? `\nExcel trimestre: ${excelRes.hoja}${excelRes.yaEstaba ? " (ya estaba)" : " (fila añadida)"}`
          : `\nExcel trimestre: NO anotada (${excelRes.error || "error"})`);

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
          ${driveHtml}
        </div>`,
        text: `Nueva venta: ${servicio.nombre}\nFactura ${numeroFactura}: ${totalReal} (IVA incl.)${MODO_TEST ? `\nMODO TEST: cobrado ${eur(cobradoCents)}` : ""}\nCliente: ${nombre} (${email})\nTel: ${telefono || "—"}\nExpediente: ${numExpediente}\n${driveTxt}`,
      }).catch((e) => console.error("aviso interno:", e.message));
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Fulfillment error:", err.message);
    // 500 para que Stripe reintente el evento.
    return res.status(500).json({ ok: false, error: "Fulfillment fallido" });
  }
}
