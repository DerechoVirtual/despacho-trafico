/**
 * Inicia el pago de un servicio: pide al backend una sesión de Stripe Checkout
 * y redirige al cliente a la pasarela de pago segura de Stripe.
 *
 * Devuelve nada (redirige) o lanza un Error con mensaje legible.
 */
export async function irAlPago(slug) {
  const res = await fetch("/api/crear-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug }),
  });

  let payload = {};
  try {
    payload = await res.json();
  } catch {
    /* respuesta no-JSON */
  }

  if (!res.ok || !payload.ok || !payload.url) {
    throw new Error(
      payload.error ||
        "No hemos podido iniciar el pago. Inténtalo de nuevo o escríbenos por WhatsApp."
    );
  }

  window.location.href = payload.url;
}
