// Genera el HTML de una factura bonita con Gemini 3.5 Flash (modo rápido,
// thinkingBudget:0). Si Gemini falla, usa una plantilla de respaldo equivalente
// para que SIEMPRE se emita factura.
//
// Variable de entorno: GEMINI_API_KEY

const MODEL = "gemini-3.5-flash";
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const eur = (c) =>
  (c / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });

// Datos fijos del emisor.
export const EMISOR = {
  nombre: "Rivero Abogados",
  letrado: "Carlos Rivero García",
  colegiacion: "Colegiado nº 12.345 · ICAM",
  nif: "B-00000000",
  domicilio: "Alicante (España)",
  email: "carlosrivero@derechovirtual.org",
};

export function calcularImportes(baseCents, ivaPct = 21) {
  const ivaCents = Math.round(baseCents * (ivaPct / 100));
  return { baseCents, ivaCents, totalCents: baseCents + ivaCents, ivaPct };
}

function plantillaRespaldo(d) {
  const { baseCents, ivaCents, totalCents, ivaPct } = d.importes;
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#1d2733">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e7ebf0">
  <div style="background:#0f2c4d;padding:28px 32px;display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <div style="color:#fff;font-size:20px;font-weight:bold">${esc(EMISOR.nombre)}</div>
      <div style="color:#c8a45c;font-size:13px;margin-top:4px">${esc(EMISOR.letrado)} · ${esc(EMISOR.colegiacion)}</div>
    </div>
    <div style="text-align:right;color:#cdd8e6;font-size:12px">
      <div style="color:#fff;font-size:15px;font-weight:bold;letter-spacing:1px">FACTURA</div>
      <div style="margin-top:6px">Nº ${esc(d.numero)}</div>
      <div>${esc(d.fecha)}</div>
    </div>
  </div>
  <div style="padding:24px 32px">
    <table style="width:100%;font-size:13px;color:#64748b"><tr>
      <td style="vertical-align:top;width:50%">
        <div style="text-transform:uppercase;letter-spacing:.5px;font-size:11px;color:#94a3b8">Emisor</div>
        <div style="color:#1d2733;margin-top:4px">${esc(EMISOR.nombre)}<br>NIF ${esc(EMISOR.nif)}<br>${esc(EMISOR.domicilio)}<br>${esc(EMISOR.email)}</div>
      </td>
      <td style="vertical-align:top">
        <div style="text-transform:uppercase;letter-spacing:.5px;font-size:11px;color:#94a3b8">Cliente</div>
        <div style="color:#1d2733;margin-top:4px">${esc(d.cliente.nombre)}${d.cliente.dni ? "<br>DNI/NIE " + esc(d.cliente.dni) : ""}${d.cliente.direccion ? "<br>" + esc(d.cliente.direccion) : ""}${d.cliente.cp || d.cliente.ciudad ? "<br>" + esc([d.cliente.cp, d.cliente.ciudad].filter(Boolean).join(" ")) : ""}<br>${esc(d.cliente.email)}</div>
      </td>
    </tr></table>

    <table style="width:100%;border-collapse:collapse;margin-top:24px;font-size:14px">
      <thead><tr style="background:#f6efe2">
        <th style="text-align:left;padding:12px;color:#0f2c4d">Concepto</th>
        <th style="text-align:right;padding:12px;color:#0f2c4d;width:120px">Importe</th>
      </tr></thead>
      <tbody><tr>
        <td style="padding:12px;border-bottom:1px solid #eef1f5">${esc(d.concepto)}<div style="color:#94a3b8;font-size:12px;margin-top:2px">Honorarios profesionales (cuota fija)</div></td>
        <td style="padding:12px;border-bottom:1px solid #eef1f5;text-align:right">${eur(baseCents)}</td>
      </tr></tbody>
    </table>

    <table style="width:100%;max-width:260px;margin-left:auto;margin-top:16px;font-size:14px">
      <tr><td style="padding:4px 0;color:#64748b">Base imponible</td><td style="padding:4px 0;text-align:right">${eur(baseCents)}</td></tr>
      <tr><td style="padding:4px 0;color:#64748b">IVA (${ivaPct}%)</td><td style="padding:4px 0;text-align:right">${eur(ivaCents)}</td></tr>
      <tr><td style="padding:10px 0;border-top:2px solid #0f2c4d;font-weight:bold;color:#0f2c4d">TOTAL</td><td style="padding:10px 0;border-top:2px solid #0f2c4d;text-align:right;font-weight:bold;color:#0f2c4d">${eur(totalCents)}</td></tr>
    </table>

    <p style="margin-top:24px;font-size:12px;color:#94a3b8;line-height:1.6">Factura pagada mediante tarjeta a través de Stripe. Gracias por confiar en ${esc(EMISOR.nombre)}.${d.pie ? " " + esc(d.pie) : ""}</p>
  </div>
</div></body></html>`;
}

function limpiar(html) {
  return html
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

// Devuelve { html, fuente: "gemini"|"respaldo" }
export async function generarFacturaHTML(datos) {
  const d = { ...datos, importes: calcularImportes(datos.baseCents, datos.ivaPct ?? 21) };
  const key = process.env.GEMINI_API_KEY;
  const respaldo = plantillaRespaldo(d);
  if (!key) return { html: respaldo, fuente: "respaldo" };

  const { baseCents, ivaCents, totalCents, ivaPct } = d.importes;
  const prompt = `Eres un diseñador de facturas. Genera el código HTML COMPLETO de una factura profesional, elegante y lista para enviar por email (HTML + CSS en línea, sin JavaScript, compatible con clientes de correo, ancho máx 640px, apta para imprimir en A4).

Paleta de marca del despacho: azul marino #0f2c4d, dorado #c8a45c, fondo crema #f6efe2, texto #1d2733, gris #64748b. Tipografía Arial/Helvetica. Diseño limpio, con cabecera de marca, datos de emisor y cliente en dos columnas, una tabla de conceptos, un bloque de totales alineado a la derecha y un pie discreto.

DATOS DE LA FACTURA (úsalos EXACTAMENTE, no inventes otros importes ni datos):
- Emisor: ${EMISOR.nombre} — ${EMISOR.letrado} (${EMISOR.colegiacion}). NIF ${EMISOR.nif}. ${EMISOR.domicilio}. ${EMISOR.email}
- Nº de factura: ${d.numero}
- Fecha: ${d.fecha}
- Cliente: ${d.cliente.nombre}${d.cliente.dni ? " · DNI/NIE " + d.cliente.dni : ""}${d.cliente.direccion ? " · " + d.cliente.direccion : ""}${d.cliente.cp || d.cliente.ciudad ? " · " + [d.cliente.cp, d.cliente.ciudad].filter(Boolean).join(" ") : ""} · ${d.cliente.email}
- Concepto (una sola línea): "${d.concepto}" — Honorarios profesionales (cuota fija)
- Base imponible: ${eur(baseCents)}
- IVA (${ivaPct}%): ${eur(ivaCents)}
- TOTAL: ${eur(totalCents)}
- Nota de pie: "Factura pagada mediante tarjeta a través de Stripe. Gracias por confiar en ${EMISOR.nombre}."

Usa el formato de moneda en euros con el símbolo € y coma decimal (formato español), exactamente como te los doy.
Devuelve ÚNICAMENTE el HTML, empezando por <!DOCTYPE html>. No añadas explicaciones ni marques bloques de código.`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 4096,
      thinkingConfig: { thinkingBudget: 0 }, // rápido, sin razonamiento
    },
  };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      console.error("Gemini factura error", r.status, (await r.text()).slice(0, 300));
      return { html: respaldo, fuente: "respaldo" };
    }
    const j = await r.json();
    const text =
      j.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("") || "";
    const html = limpiar(text);
    if (!/<.*html|<body|<div/i.test(html) || html.length < 200) {
      return { html: respaldo, fuente: "respaldo" };
    }
    return { html, fuente: "gemini" };
  } catch (err) {
    console.error("Fallo generarFacturaHTML:", err.message);
    return { html: respaldo, fuente: "respaldo" };
  }
}
