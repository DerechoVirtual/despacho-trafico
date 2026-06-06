// Helper de Supabase vía REST con la service-role key (sin dependencias npm).
// Variables de entorno (Vercel): SUPABASE_URL, SUPABASE_SECRET_KEY

function cfg() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Faltan SUPABASE_URL / SUPABASE_SECRET_KEY");
  return { url, key };
}

function authHeaders() {
  const { key } = cfg();
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

// --- Auth Admin -----------------------------------------------------------
// Crea un usuario de acceso. Si ya existe, devuelve { id, nuevo:false }.
export async function crearUsuario(email, nombre, password) {
  const { url } = cfg();
  const r = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre },
    }),
  });
  if (r.ok) {
    const j = await r.json();
    return { id: j.id, nuevo: true };
  }
  const txt = await r.text();
  if (/registered|already|exists|duplicate/i.test(txt)) {
    const id = await buscarPerfilIdPorEmail(email);
    if (id) return { id, nuevo: false };
  }
  throw new Error(`crearUsuario ${r.status}: ${txt.slice(0, 200)}`);
}

export async function buscarPerfilIdPorEmail(email) {
  const { url } = cfg();
  const r = await fetch(
    `${url}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id`,
    { headers: authHeaders() }
  );
  if (!r.ok) return null;
  const rows = await r.json();
  return rows[0]?.id || null;
}

// --- Tablas (PostgREST) ----------------------------------------------------
async function rest(path, method, body, prefer) {
  const { url } = cfg();
  const headers = authHeaders();
  if (prefer) headers.Prefer = prefer;
  const r = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`${method} ${path} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

export async function actualizarPerfil(id, datos) {
  return rest(`profiles?id=eq.${id}`, "PATCH", datos, "return=minimal");
}

export async function reemplazarExpediente(clienteId, numExpediente, datos) {
  await rest(
    `expedientes?cliente_id=eq.${clienteId}&num_expediente=eq.${encodeURIComponent(numExpediente)}`,
    "DELETE"
  ).catch(() => {});
  return rest("expedientes", "POST", [{ cliente_id: clienteId, num_expediente: numExpediente, ...datos }], "return=minimal");
}

export async function reemplazarDocumentos(clienteId, claves) {
  await rest(`documentos?cliente_id=eq.${clienteId}`, "DELETE").catch(() => {});
  const filas = claves.map((clave) => ({
    cliente_id: clienteId,
    requerido_clave: clave,
    estado: "pendiente",
  }));
  return rest("documentos", "POST", filas, "return=minimal");
}

export async function crearNotificacion(clienteId, titulo, mensaje, canales = ["plataforma", "email"], enlace = null) {
  return rest("notificaciones", "POST", [{ cliente_id: clienteId, titulo, mensaje, canales, enlace }], "return=minimal");
}

// --- Numeración correlativa de factura (RPC) -------------------------------
export async function siguienteNumFactura() {
  const { url } = cfg();
  const r = await fetch(`${url}/rest/v1/rpc/siguiente_num_factura`, {
    method: "POST",
    headers: authHeaders(),
    body: "{}",
  });
  if (!r.ok) throw new Error(`siguienteNumFactura ${r.status}: ${(await r.text()).slice(0, 150)}`);
  return (await r.json()); // p.ej. "FRA-2026-00001"
}

// --- Storage ---------------------------------------------------------------
export async function crearBucketSiNoExiste(bucket, isPublic = false) {
  const { url } = cfg();
  const r = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ id: bucket, name: bucket, public: isPublic }),
  });
  // 200 creado, 409/400 "already exists" -> ok
  if (!r.ok) {
    const t = await r.text();
    if (!/exist|already|duplicate/i.test(t)) console.error("crearBucket:", r.status, t.slice(0, 150));
  }
  return true;
}

// Sube bytes (Uint8Array/Buffer) a {bucket}/{path}. Sobrescribe si existe.
export async function subirArchivo(bucket, path, bytes, contentType) {
  const { url, key } = cfg();
  const r = await fetch(`${url}/storage/v1/object/${bucket}/${encodeURI(path)}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": contentType,
      "x-upsert": "true",
      "cache-control": "3600",
    },
    body: Buffer.from(bytes),
  });
  if (!r.ok) throw new Error(`subirArchivo ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return true;
}

// Devuelve una URL firmada (descarga) válida `expiresIn` segundos.
export async function urlFirmada(bucket, path, expiresIn = 31536000) {
  const { url } = cfg();
  const r = await fetch(`${url}/storage/v1/object/sign/${bucket}/${encodeURI(path)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ expiresIn }),
  });
  if (!r.ok) throw new Error(`urlFirmada ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  return `${url}/storage/v1${j.signedURL || j.signedUrl}`;
}
