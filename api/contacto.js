// Endpoint serverless de Vercel: recibe el formulario de contacto de la web
// y envía un correo a Carlos con los datos del cliente usando la Gmail API.
//
// Variables de entorno necesarias (configuradas en Vercel):
//   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN  -> OAuth de la cuenta emisora
//   NOTIFY_EMAIL  -> destinatario (carlosrivero@derechovirtual.org)
//   FROM_EMAIL    -> cuenta Gmail autorizada que figura como remitente

import {
  parseBody,
  str,
  isEmail,
  isPhone,
  rateLimited,
  rejectMethod,
  tooMany,
  isSpamBot,
} from "./_lib/http.js";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL =
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

const TIPOS = {
  movil: "Móvil al volante",
  velocidad: "Exceso de velocidad",
  aparcamiento: "Aparcamiento",
  "carril-bus": "Carril bus / VAO",
  "sin-itv": "Sin ITV",
  "no-identificar": "No identificar conductor",
  alcoholemia: "Alcoholemia / delito",
  "carnet-puntos": "Carnet y puntos",
  carnet: "Carnet y puntos",
  otra: "Otra",
};

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Codifica en base64url (requerido por la Gmail API) respetando UTF-8.
function b64url(str) {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Cabecera MIME con texto no-ASCII (RFC 2047) para asuntos con tildes.
function encHeader(str) {
  return `=?UTF-8?B?${Buffer.from(str, "utf-8").toString("base64")}?=`;
}

async function getAccessToken(env) {
  const body = new URLSearchParams({
    client_id: env.GMAIL_CLIENT_ID,
    client_secret: env.GMAIL_CLIENT_SECRET,
    refresh_token: env.GMAIL_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`OAuth ${r.status}: ${t.slice(0, 200)}`);
  }
  const j = await r.json();
  return j.access_token;
}

export default async function handler(req, res) {
  if (rejectMethod(req, res, "POST")) return;
  if (rateLimited(req, { key: "contacto", limit: 5, windowMs: 60_000 })) {
    return tooMany(res);
  }

  const data = parseBody(req);

  // Honeypot: si el campo oculto viene relleno es un bot. Respondemos OK
  // (sin dar pistas) pero no enviamos nada.
  if (isSpamBot(data)) return res.status(200).json({ ok: true });

  const nombre = str(data.nombre, 120);
  const telefono = str(data.telefono, 24);
  const email = str(data.email, 160);
  const tipoMulta = TIPOS[data.tipoMulta] || str(data.tipoMulta, 60) || "No indicado";
  const descripcion = str(data.descripcion, 5000) || "(Sin descripción)";
  const origen = str(data.origen, 200) || "/";

  if (!nombre || !telefono) {
    return res
      .status(400)
      .json({ ok: false, error: "Faltan datos obligatorios (nombre y teléfono)." });
  }
  if (!isPhone(telefono)) {
    return res
      .status(400)
      .json({ ok: false, error: "El teléfono no parece válido. Revísalo, por favor." });
  }
  if (email && !isEmail(email)) {
    return res
      .status(400)
      .json({ ok: false, error: "El email no parece válido. Revísalo, por favor." });
  }

  const env = process.env;
  if (
    !env.GMAIL_CLIENT_ID ||
    !env.GMAIL_CLIENT_SECRET ||
    !env.GMAIL_REFRESH_TOKEN ||
    !env.NOTIFY_EMAIL
  ) {
    console.error("Faltan variables de entorno de email");
    return res.status(500).json({
      ok: false,
      error: "El servicio de correo no está configurado. Escríbenos por WhatsApp.",
    });
  }

  const from = env.FROM_EMAIL || env.NOTIFY_EMAIL;
  const fecha = new Date().toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
  });

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1d2733">
      <div style="background:#0f2c4d;padding:24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">Nueva consulta desde la web</h1>
        <p style="color:#c8a45c;margin:6px 0 0;font-size:13px">Rivero Abogados · ${esc(fecha)}</p>
      </div>
      <div style="border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px;padding:24px">
        <table style="width:100%;border-collapse:collapse;font-size:15px">
          <tr><td style="padding:8px 0;color:#64748b;width:140px">Nombre</td><td style="padding:8px 0;font-weight:bold">${esc(nombre)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Teléfono</td><td style="padding:8px 0"><a href="tel:${esc(telefono)}">${esc(telefono)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0"><a href="mailto:${esc(email)}">${esc(email) || "—"}</a></td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Tipo de multa</td><td style="padding:8px 0">${esc(tipoMulta)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Descripción</td><td style="padding:8px 0;white-space:pre-wrap">${esc(descripcion)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Origen</td><td style="padding:8px 0;color:#94a3b8">${esc(origen)}</td></tr>
        </table>
        <p style="margin-top:20px;font-size:13px;color:#94a3b8">Responde directamente a este correo para contestar al cliente.</p>
      </div>
    </div>`;

  const texto = `Nueva consulta desde la web (${fecha})

Nombre: ${nombre}
Teléfono: ${telefono}
Email: ${email || "—"}
Tipo de multa: ${tipoMulta}
Descripción: ${descripcion}
Origen: ${origen}
`;

  const boundary = "rivero_" + Date.now().toString(36);
  const subject = encHeader(`📩 Nueva consulta web: ${nombre} (${tipoMulta})`);

  const mime = [
    `From: Rivero Abogados Web <${from}>`,
    `To: ${env.NOTIFY_EMAIL}`,
    email ? `Reply-To: ${nombre} <${email}>` : null,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    texto,
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    `--${boundary}--`,
    "",
  ]
    .filter((l) => l !== null)
    .join("\r\n");

  try {
    const accessToken = await getAccessToken(env);
    const r = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: b64url(mime) }),
    });
    if (!r.ok) {
      const t = await r.text();
      console.error("Gmail send error:", r.status, t.slice(0, 300));
      throw new Error("No se pudo enviar el correo.");
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error enviando consulta:", err.message);
    return res.status(500).json({
      ok: false,
      error:
        "No hemos podido enviar tu consulta en este momento. Inténtalo de nuevo o escríbenos por WhatsApp.",
    });
  }
}
