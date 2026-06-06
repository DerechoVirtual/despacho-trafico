// Helper de envío de email vía Gmail API (OAuth refresh token).
// Reutiliza las variables de entorno ya configuradas en Vercel:
//   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, FROM_EMAIL, NOTIFY_EMAIL

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

export function b64url(str) {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function encHeader(str) {
  return `=?UTF-8?B?${Buffer.from(str, "utf-8").toString("base64")}?=`;
}

export function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

// Envía un correo.
// { to, subject, html, text, replyTo, fromName, attachments?: [{filename, mimeType, contentBase64}] }
export async function enviarEmail({ to, subject, html, text, replyTo, fromName, attachments }) {
  const env = process.env;
  if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) {
    throw new Error("Faltan variables de entorno de Gmail");
  }
  const from = env.FROM_EMAIL || env.NOTIFY_EMAIL;
  const alt = "alt_" + Math.random().toString(36).slice(2);

  // Cuerpo (texto + html) en multipart/alternative.
  const cuerpo = [
    `--${alt}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    text || "",
    `--${alt}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    html || "",
    `--${alt}--`,
    "",
  ].join("\r\n");

  const cabeceras = [
    `From: ${fromName ? `${fromName} ` : "Rivero Abogados "}<${from}>`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encHeader(subject)}`,
    "MIME-Version: 1.0",
  ].filter((l) => l !== null);

  let mime;
  if (attachments && attachments.length) {
    const mix = "mix_" + Math.random().toString(36).slice(2);
    const partes = [
      ...cabeceras,
      `Content-Type: multipart/mixed; boundary="${mix}"`,
      "",
      `--${mix}`,
      `Content-Type: multipart/alternative; boundary="${alt}"`,
      "",
      cuerpo,
    ];
    for (const a of attachments) {
      partes.push(
        `--${mix}`,
        `Content-Type: ${a.mimeType}; name="${a.filename}"`,
        "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${a.filename}"`,
        "",
        a.contentBase64.replace(/(.{76})/g, "$1\r\n"),
      );
    }
    partes.push(`--${mix}--`, "");
    mime = partes.join("\r\n");
  } else {
    mime = [
      ...cabeceras,
      `Content-Type: multipart/alternative; boundary="${alt}"`,
      "",
      cuerpo,
    ].join("\r\n");
  }

  const accessToken = await getAccessToken(env);
  const r = await fetch(SEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: b64url(mime) }),
  });
  if (!r.ok) throw new Error(`Gmail send ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return true;
}
