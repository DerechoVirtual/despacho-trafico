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

// Envía un correo. { to, subject, html, text, replyTo, fromName }
export async function enviarEmail({ to, subject, html, text, replyTo, fromName }) {
  const env = process.env;
  if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) {
    throw new Error("Faltan variables de entorno de Gmail");
  }
  const from = env.FROM_EMAIL || env.NOTIFY_EMAIL;
  const boundary = "rivero_" + Math.random().toString(36).slice(2);
  const mime = [
    `From: ${fromName ? `${fromName} ` : "Rivero Abogados "}<${from}>`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    text || "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    html || "",
    `--${boundary}--`,
    "",
  ]
    .filter((l) => l !== null)
    .join("\r\n");

  const accessToken = await getAccessToken(env);
  const r = await fetch(SEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: b64url(mime) }),
  });
  if (!r.ok) throw new Error(`Gmail send ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return true;
}
