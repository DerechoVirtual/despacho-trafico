// Helper de Google Drive vía REST (OAuth refresh token) + Excel con SheetJS.
//
// Organiza la facturación del despacho dentro de Google Drive así:
//   Facturación / Despacho de tráfico /
//     Facturas (PDF) / <AAAA> / <AAAA-MM mes> / factura-<nº>.pdf     ← PDFs por MES
//     Resumen trimestral (Excel) / <AAAA> / <AAAA-Tn (rango)> /
//                                  Facturas <AAAA-Tn>.xlsx           ← Excel por TRIMESTRE
//
// Variables de entorno (Vercel): GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN
//
// La credencial es OAuth en nombre del usuario (cuenta lexiaipro1@gmail.com) con scope
// https://www.googleapis.com/auth/drive. Las cuentas de servicio NO sirven para escribir
// en el Drive de un Gmail personal (no tienen cuota → storageQuotaExceeded).

import * as XLSXns from "xlsx";
const XLSX = XLSXns.default || XLSXns;

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FILES_URL = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files";
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Carpeta raíz de la facturación dentro del Drive.
export const CARPETA_BASE = ["Facturación", "Despacho de tráfico"];

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const TRIM_RANGO = { 1: "enero-marzo", 2: "abril-junio", 3: "julio-septiembre", 4: "octubre-diciembre" };

// Partes de la fecha en horario de Madrid (para no equivocar el mes/trimestre en los bordes).
export function partesFecha(date = new Date()) {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
  const [year, month, day] = f.split("-").map(Number); // en-CA → AAAA-MM-DD
  const q = Math.floor((month - 1) / 3) + 1;
  return {
    year, month, day,
    mm: String(month).padStart(2, "0"),
    dd: String(day).padStart(2, "0"),
    mesNombre: MESES[month - 1],
    trimestre: q,
    trimRango: TRIM_RANGO[q],
    iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

export function rutaMesPDF(p) {
  return [...CARPETA_BASE, "Facturas (PDF)", String(p.year), `${p.year}-${p.mm} ${p.mesNombre}`];
}
export function rutaTrimestreExcel(p) {
  return [...CARPETA_BASE, "Resumen trimestral (Excel)", String(p.year), `${p.year}-T${p.trimestre} (${p.trimRango})`];
}

// --- OAuth -----------------------------------------------------------------
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

// --- Carpetas --------------------------------------------------------------
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
    body: JSON.stringify({ name: nombre, mimeType: "application/vnd.google-apps.folder", parents: [parentId] }),
  });
  if (!create.ok) throw new Error(`Drive crear carpeta ${create.status}: ${(await create.text()).slice(0, 150)}`);
  return (await create.json()).id;
}

async function resolverCarpeta(at, ruta) {
  let parent = "root";
  for (const nombre of ruta) parent = await findOrCreateFolder(at, nombre, parent);
  return parent;
}

async function buscarArchivo(at, nombre, folderId) {
  const q = `name='${escQ(nombre)}' and '${folderId}' in parents and trashed=false`;
  const r = await fetch(
    `${FILES_URL}?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)&spaces=drive&pageSize=1`,
    { headers: { Authorization: `Bearer ${at}` } }
  );
  if (!r.ok) return null;
  return (await r.json()).files?.[0] || null;
}

// Sube un archivo NUEVO (multipart) a una carpeta. Devuelve { id, webViewLink }.
async function subirNuevo(at, { name, parents, mimeType, bytes }) {
  const boundary = "rivero" + Math.random().toString(36).slice(2);
  const pre = Buffer.from(
    `--${boundary}\r\n` +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify({ name, parents }) +
    `\r\n--${boundary}\r\n` +
    `Content-Type: ${mimeType}\r\n\r\n`,
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
  return await up.json();
}

// Reemplaza el CONTENIDO de un archivo existente (mantiene el id). Devuelve { id, webViewLink }.
async function actualizarContenido(at, id, { mimeType, bytes }) {
  const up = await fetch(`${UPLOAD_URL}/${id}?uploadType=media&fields=id,webViewLink`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${at}`, "Content-Type": mimeType },
    body: Buffer.from(bytes),
  });
  if (!up.ok) throw new Error(`Drive actualizar ${up.status}: ${(await up.text()).slice(0, 200)}`);
  return await up.json();
}

async function descargarBytes(at, id) {
  const r = await fetch(`${FILES_URL}/${id}?alt=media`, { headers: { Authorization: `Bearer ${at}` } });
  if (!r.ok) throw new Error(`Drive descarga ${r.status}: ${(await r.text()).slice(0, 150)}`);
  return Buffer.from(await r.arrayBuffer());
}

// --- API pública -----------------------------------------------------------

// Sube el PDF de la factura a  Facturas (PDF) / AAAA / AAAA-MM mes  (idempotente por nombre).
// Nunca lanza: ante error devuelve { ok:false, error }.
export async function subirFacturaADrive({ filename, bytes, fecha = new Date() }) {
  try {
    const p = partesFecha(fecha);
    const ruta = rutaMesPDF(p);
    const at = await getAccessToken();
    const folderId = await resolverCarpeta(at, ruta);

    const existente = await buscarArchivo(at, filename, folderId);
    if (existente) {
      return { ok: true, id: existente.id, webViewLink: existente.webViewLink, carpeta: ruta.join(" / "), yaExistia: true };
    }
    const j = await subirNuevo(at, { name: filename, parents: [folderId], mimeType: "application/pdf", bytes });
    return { ok: true, id: j.id, webViewLink: j.webViewLink, carpeta: ruta.join(" / ") };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Añade una fila al Excel del TRIMESTRE  Resumen trimestral (Excel) / AAAA / AAAA-Tn (rango) /
// Facturas AAAA-Tn.xlsx. Crea el libro con cabecera si no existe. Idempotente por `claveUnica`
// (no añade dos veces la misma factura). Nunca lanza: ante error devuelve { ok:false, error }.
export async function registrarFacturaEnExcel({ fecha = new Date(), encabezados, fila, claveUnica }) {
  try {
    const p = partesFecha(fecha);
    const ruta = rutaTrimestreExcel(p);
    const nombre = `Facturas ${p.year}-T${p.trimestre}.xlsx`;
    const at = await getAccessToken();
    const folderId = await resolverCarpeta(at, ruta);
    const existente = await buscarArchivo(at, nombre, folderId);

    let wb, ws;
    if (existente) {
      wb = XLSX.read(await descargarBytes(at, existente.id), { type: "buffer" });
      ws = wb.Sheets[wb.SheetNames[0]];
      const filas = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });
      // ¿Ya está esta factura? (col A = clave). Evita duplicar en reintentos de Stripe.
      if (filas.some((r) => String(r[0]).trim() === String(claveUnica).trim())) {
        return { ok: true, webViewLink: existente.webViewLink, hoja: `${ruta.join(" / ")} / ${nombre}`, yaEstaba: true };
      }
      XLSX.utils.sheet_add_aoa(ws, [fila], { origin: -1 });
    } else {
      wb = XLSX.utils.book_new();
      ws = XLSX.utils.aoa_to_sheet([encabezados, fila]);
      ws["!cols"] = encabezados.map((h) => ({ wch: Math.max(12, String(h).length + 2) }));
      XLSX.utils.book_append_sheet(wb, ws, "Facturas");
    }

    const bytes = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const j = existente
      ? await actualizarContenido(at, existente.id, { mimeType: XLSX_MIME, bytes })
      : await subirNuevo(at, { name: nombre, parents: [folderId], mimeType: XLSX_MIME, bytes });
    return { ok: true, id: j.id, webViewLink: j.webViewLink, hoja: `${ruta.join(" / ")} / ${nombre}` };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
