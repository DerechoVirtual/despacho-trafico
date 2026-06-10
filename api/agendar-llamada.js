// Endpoint serverless de Vercel: recibe la solicitud de "agendar llamada" del
// lead magnet Anti Multaitor y envía a Carlos un email con los datos del cliente
// + el análisis completo de Anti Multaitor + sus respuestas. Usa la Gmail API
// (mismas credenciales OAuth que api/contacto.js).
//
// Variables de entorno (ya configuradas en Vercel):
//   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, NOTIFY_EMAIL, FROM_EMAIL

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
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

const VIA = {
  nulidad: "Nulidad de pleno derecho",
  anulabilidad: "Anulabilidad",
  defecto_procedimiento: "Defecto de procedimiento",
  varias: "Varias vías",
  ninguna: "Sin vía clara",
};

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function b64url(str) {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
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
  if (!r.ok) throw new Error(`OAuth ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).access_token;
}

export default async function handler(req, res) {
  if (rejectMethod(req, res, "POST")) return;
  if (rateLimited(req, { key: "agendar", limit: 5, windowMs: 60_000 })) {
    return tooMany(res);
  }

  const data = parseBody(req);
  if (isSpamBot(data)) return res.status(200).json({ ok: true });

  const nombre = str(data.nombre, 120);
  const telefono = str(data.telefono, 24);
  const email = str(data.email, 160);
  const franja = str(data.franja, 60) || "Indiferente";

  // Veredicto y respuestas: saneados y con topes de tamaño (vienen del cliente).
  const v = data.verdict && typeof data.verdict === "object" ? data.verdict : {};
  const verdict = {
    probabilidad: typeof v.probabilidad === "number" ? v.probabilidad : undefined,
    via: str(v.via, 40),
    titular: str(v.titular, 300),
    resumen: str(v.resumen, 2000),
    plazo: str(v.plazo, 400),
    motivos: (Array.isArray(v.motivos) ? v.motivos : []).slice(0, 8).map((m) => ({
      titulo: str(m?.titulo, 160),
      explicacion: str(m?.explicacion, 600),
    })),
  };
  const transcript = (Array.isArray(data.transcript) ? data.transcript : [])
    .slice(0, 40)
    .map((t) => ({
      pregunta: str(t?.pregunta, 300),
      respuesta: str(t?.respuesta, 800),
    }));

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
      error: "El servicio no está disponible ahora mismo. Escríbenos por WhatsApp.",
    });
  }

  const from = env.FROM_EMAIL || env.NOTIFY_EMAIL;
  const fecha = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
  const prob = typeof verdict.probabilidad === "number" ? `${verdict.probabilidad}%` : "—";
  const via = VIA[verdict.via] || verdict.via || "—";

  const motivosHtml = (verdict.motivos || [])
    .map(
      (m) =>
        `<li style="margin-bottom:8px"><strong>${esc(m.titulo)}</strong><br><span style="color:#475569">${esc(m.explicacion)}</span></li>`
    )
    .join("");

  const respuestasHtml = transcript
    .map(
      (t) =>
        `<tr><td style="padding:6px 10px;color:#64748b;vertical-align:top;width:46%">${esc(t.pregunta)}</td><td style="padding:6px 10px;font-weight:600">${esc(t.respuesta)}</td></tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">
    <div style="background:linear-gradient(135deg,#0b1020,#1e1b4b);padding:24px;border-radius:14px 14px 0 0">
      <h1 style="color:#fff;margin:0;font-size:20px">🛡️ Nuevo lead de Anti Multaitor</h1>
      <p style="color:#22d3ee;margin:6px 0 0;font-size:13px">Quiere agendar llamada · ${esc(fecha)}</p>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 14px 14px;padding:24px">
      <table style="width:100%;border-collapse:collapse;font-size:15px;margin-bottom:18px">
        <tr><td style="padding:8px 0;color:#64748b;width:160px">Nombre</td><td style="padding:8px 0;font-weight:bold">${esc(nombre)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Teléfono</td><td style="padding:8px 0"><a href="tel:${esc(telefono)}">${esc(telefono)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0"><a href="mailto:${esc(email)}">${esc(email) || "—"}</a></td></tr>
        <tr><td style="padding:8px 0;color:#64748b">Franja preferida</td><td style="padding:8px 0">${esc(franja)}</td></tr>
      </table>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin-bottom:18px">
        <p style="margin:0 0 6px;font-size:12px;letter-spacing:1px;color:#7c3aed;font-weight:bold">VEREDICTO DE ANTI MULTAITOR</p>
        <p style="margin:0 0 10px;font-size:17px;font-weight:bold">${esc(verdict.titular || "—")}</p>
        <p style="margin:0 0 10px"><span style="display:inline-block;background:#ecfeff;color:#0e7490;border-radius:999px;padding:3px 12px;font-weight:bold;margin-right:6px">Viabilidad: ${esc(prob)}</span><span style="display:inline-block;background:#f5f3ff;color:#6d28d9;border-radius:999px;padding:3px 12px;font-weight:bold">Vía: ${esc(via)}</span></p>
        <p style="margin:0 0 12px;color:#334155">${esc(verdict.resumen || "")}</p>
        ${motivosHtml ? `<ul style="margin:0;padding-left:18px;font-size:14px">${motivosHtml}</ul>` : ""}
        ${verdict.plazo ? `<p style="margin:12px 0 0;font-size:13px;color:#b91c1c"><strong>⏱ Plazo:</strong> ${esc(verdict.plazo)}</p>` : ""}
      </div>

      <p style="margin:0 0 6px;font-size:12px;letter-spacing:1px;color:#64748b;font-weight:bold">RESPUESTAS DEL CUESTIONARIO</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
        ${respuestasHtml || `<tr><td style="padding:10px;color:#94a3b8">(Sin respuestas registradas)</td></tr>`}
      </table>

      <p style="margin-top:18px;font-size:13px;color:#94a3b8">Responde a este correo o llama al cliente en la franja indicada.</p>
    </div>
  </div>`;

  const textoMotivos = (verdict.motivos || [])
    .map((m) => `  - ${m.titulo}: ${m.explicacion}`)
    .join("\n");
  const textoResp = transcript.map((t) => `  ${t.pregunta}: ${t.respuesta}`).join("\n");
  const texto = `Nuevo lead de Anti Multaitor (${fecha})

Nombre: ${nombre}
Teléfono: ${telefono}
Email: ${email || "—"}
Franja preferida: ${franja}

VEREDICTO ANTI MULTAITOR
Titular: ${verdict.titular || "—"}
Viabilidad: ${prob} · Vía: ${via}
Resumen: ${verdict.resumen || "—"}
Motivos:
${textoMotivos || "  (sin motivos)"}
Plazo: ${verdict.plazo || "—"}

RESPUESTAS:
${textoResp || "  (sin respuestas)"}
`;

  const boundary = "rivero_am_" + Date.now().toString(36);
  const subject = encHeader(`🛡️ Anti Multaitor — ${nombre} quiere llamada (viabilidad ${prob})`);

  const mime = [
    `From: Anti Multaitor · Rivero Abogados <${from}>`,
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
      console.error("Gmail send error:", r.status, (await r.text()).slice(0, 300));
      throw new Error("No se pudo enviar el correo.");
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error agendar-llamada:", err.message);
    return res.status(500).json({
      ok: false,
      error: "No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.",
    });
  }
}
