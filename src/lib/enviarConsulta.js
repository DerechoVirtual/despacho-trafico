/**
 * Envía los datos de una consulta al endpoint serverless /api/contacto,
 * que a su vez manda un correo a Carlos con los datos del cliente.
 *
 * Devuelve { ok: true } o lanza un Error con mensaje legible.
 */
export async function enviarConsulta(datos) {
  const res = await fetch("/api/contacto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...datos, origen: window.location.pathname }),
  });

  let payload = {};
  try {
    payload = await res.json();
  } catch {
    // respuesta no-JSON
  }

  if (!res.ok || !payload.ok) {
    throw new Error(
      payload.error ||
        "No hemos podido enviar tu consulta. Inténtalo de nuevo o escríbenos por WhatsApp."
    );
  }
  return payload;
}
