// Helper de Google Drive vía REST (OAuth refresh token, sin dependencias npm).
// Sube la factura en PDF a la carpeta  Facturación / Despacho de tráfico  del Drive.
// Variables de entorno (Vercel): GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN
//
// La credencial es OAuth en nombre del usuario (cuenta lexiaipro1@gmail.com) con
// scope https://www.googleapis.com/auth/drive. Las cuentas de servicio NO sirven
// para escribir en el Drive de un Gmail personal (no tienen cuota → storageQuotaExceeded).

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FILES_URL = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files";

// Ruta de carpetas (de la raíz hacia dentro) donde se guardan las facturas.
export const CARPETA_FACTURAS = ["Facturación", "Despacho de tráfico"];

function cfg() {
  const env = process.env;
  const client_id = env.GDRIVE_CLIENT_ID;
  const client_secret = env.GDRIVE_CLIENT_SECRET;
  const refresh_token = env.GDRIVE_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) {
    throw new Error("Faltan variables de entorno de Google Drive (GDRIVE_*)");
  }
  return { client_id, client_secret, refresh_token };
}

async function getAccessToken() {
  const { client_id, client_secret, refresh_token } = cfg();
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id, client_secret, refresh_token, grant_type: "refresh_token" }),
  });
  if (!r.ok) throw new Error(`Drive OAuth ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).access_token;
}

const escQ = (s) => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

// Busca una carpeta por nombre dentro de un padre; si no existe, la crea. Devuelve su id.
async function findOrCreateFolder(at, nombre, parentId) {
  const q =
    `mimeType='application/vnd.google-apps.folder' and trashed=false ` +
    `and name='${escQ(nombre)}' and '${parentId}' in parents`;
  const find = await fetch(
    `${FILES_URL}?q=${encodeURIComponent(q)}&fields=files(id,name)&spaces=drive&pageSize=1`,
    { headers: { Authorization: `Bearer ${at}` } }
  );
  if (!find.ok) throw new Error(`Drive buscar carpeta ${find.status}: ${(await find.text()).slice(0, 150)}`);
  const found = (await find.json()).files?.[0];
  if (found) return found.id;

  const create = await fetch(`${FILES_URL}?fields=id`, {
    method: "POST",
    headers: { Authorization: `Bearer ${at}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nombre,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    }),
  });
  if (!create.ok) throw new Error(`Drive crear carpeta ${create.status}: ${(await create.text()).slice(0, 150)}`);
  return (await create.json()).id;
}

// Resuelve la ruta de carpetas (creándolas si hace falta) y devuelve el id de la última.
async function resolverCarpeta(at, ruta) {
  let parent = "root";
  for (const nombre of ruta) parent = await findOrCreateFolder(at, nombre, parent);
  return parent;
}

// Devuelve el archivo existente con ese nombre dentro de la carpeta, o null.
async function buscarArchivo(at, nombre, folderId) {
  const q = `name='${escQ(nombre)}' and '${folderId}' in parents and trashed=false`;
  const r = await fetch(
    `${FILES_URL}?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)&spaces=drive&pageSize=1`,
    { headers: { Authorization: `Bearer ${at}` } }
  );
  if (!r.ok) return null;
  return (await r.json()).files?.[0] || null;
}

// Sube el PDF a  Facturación / Despacho de tráfico  (idempotente por nombre de archivo).
// Devuelve { ok, id, webViewLink, carpeta }.  Nunca lanza: ante error devuelve { ok:false, error }.
export async function subirFacturaADrive({ filename, bytes, ruta = CARPETA_FACTURAS }) {
  try {
    const at = await getAccessToken();
    const folderId = await resolverCarpeta(at, ruta);

    // Si el webhook se reintenta, no dupliques: reutiliza el archivo ya subido.
    const existente = await buscarArchivo(at, filename, folderId);
    if (existente) {
      return { ok: true, id: existente.id, webViewLink: existente.webViewLink, carpeta: ruta.join(" / "), yaExistia: true };
    }

    const boundary = "rivero" + Math.random().toString(36).slice(2);
    const metadata = { name: filename, parents: [folderId] };
    const pre = Buffer.from(
      `--${boundary}\r\n` +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      `\r\n--${boundary}\r\n` +
      "Content-Type: application/pdf\r\n\r\n",
      "utf8"
    );
    const post = Buffer.from(`\r\n--${boundary}--`, "utf8");
    const body = Buffer.concat([pre, Buffer.from(bytes), post]);

    const up = await fetch(`${UPLOAD_URL}?uploadType=multipart&fields=id,webViewLink`, {
      method: "POST",
      headers: { Authorization: `Bearer ${at}`, "Content-Type": `multipart/related; boundary=${boundary}` },
      body,
    });
    if (!up.ok) throw new Error(`Drive subida ${up.status}: ${(await up.text()).slice(0, 200)}`);
    const j = await up.json();
    return { ok: true, id: j.id, webViewLink: j.webViewLink, carpeta: ruta.join(" / ") };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
