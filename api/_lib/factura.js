// Genera la factura en PDF (diseño PREMIUM con pdf-lib) cumpliendo los datos
// obligatorios de una factura en España (RD 1619/2012, art. 6). El texto del
// concepto y la nota de cortesía los redacta Gemini 3.5 Flash; si falla, hay
// textos de respaldo. El PDF SIEMPRE se genera.
//
// Variable de entorno: GEMINI_API_KEY

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const MODEL = "gemini-3.5-flash";

// DATOS FISCALES DEL EMISOR — datos de PRUEBA inventados (despacho ficticio del
// curso). NIF con letra de control válida. Sustituir si se usa en real.
export const EMISOR = {
  nombre: "Rivero Abogados",
  titular: "Carlos Rivero García",
  nif: "48635129L", // DNI de prueba (letra de control correcta)
  via: "Avenida de Maisonnave, 28 - 4º C",
  cp: "03003",
  ciudad: "Alicante",
  provincia: "Alicante",
  pais: "España",
  colegiacion: "Colegiado nº 12.345 · Ilustre Colegio de Abogados de Madrid (ICAM)",
  email: "carlosrivero@derechovirtual.org",
  telefono: "+34 965 123 456",
};

// Paleta
const NAVY = rgb(0.055, 0.16, 0.28);
const GOLD = rgb(0.78, 0.64, 0.36);
const CREAM = rgb(0.972, 0.952, 0.917);
const GRAY = rgb(0.42, 0.47, 0.53);
const LGRAY = rgb(0.6, 0.64, 0.69);
const DARK = rgb(0.1, 0.14, 0.19);
const HAIR = rgb(0.86, 0.88, 0.91);

export function calcularImportes(baseCents, ivaPct = 21) {
  const ivaCents = Math.round(baseCents * (ivaPct / 100));
  return { baseCents, ivaCents, totalCents: baseCents + ivaCents, ivaPct };
}

const eur = (c) =>
  (c / 100).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

function wansi(s = "") {
  return String(s)
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-").replace(/…/g, "...")
    .replace(/[^\x00-\xFF€]/g, "");
}

// --- Gemini: textos de la factura -----------------------------------------
async function textosFactura(concepto) {
  const fallback = {
    descripcion:
      "Honorarios profesionales por la dirección letrada y la prestación del servicio jurídico contratado.",
    nota: `Le agradecemos la confianza depositada en ${EMISOR.nombre}. El pago de esta factura se ha efectuado con tarjeta a través de la pasarela segura Stripe.`,
    fuente: "respaldo",
  };
  const key = process.env.GEMINI_API_KEY;
  if (!key) return fallback;
  const prompt = `Eres el sistema de facturación del despacho ${EMISOR.nombre} (abogacía de tráfico, España). Para una factura del servicio "${concepto}", redacta en español jurídico, profesional y elegante:
- "descripcion": UNA frase (máx 20 palabras) describiendo el concepto facturado para la línea de la factura.
- "nota": UNA o dos frases formales de cortesía para el pie, agradeciendo la confianza e indicando que el pago se ha realizado con tarjeta mediante la pasarela Stripe.
Devuelve solo JSON.`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.5, maxOutputTokens: 512,
      responseMimeType: "application/json",
      responseSchema: { type: "object", properties: { descripcion: { type: "string" }, nota: { type: "string" } }, required: ["descripcion", "nota"] },
      thinkingConfig: { thinkingBudget: 0 },
    },
  };
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) { console.error("Gemini factura txt", r.status, (await r.text()).slice(0, 200)); return fallback; }
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("") || "";
    const o = JSON.parse(text);
    if (!o.descripcion || !o.nota) return fallback;
    return { descripcion: o.descripcion, nota: o.nota, fuente: "gemini" };
  } catch (e) { console.error("textosFactura:", e.message); return fallback; }
}

function wrap(text, font, size, maxWidth) {
  const palabras = wansi(text).split(/\s+/);
  const out = [];
  let cur = "";
  for (const p of palabras) {
    const t = cur ? `${cur} ${p}` : p;
    if (font.widthOfTextAtSize(t, size) > maxWidth && cur) { out.push(cur); cur = p; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
}

// --- PDF -------------------------------------------------------------------
// datos: { numero, fechaExpedicion, fechaOperacion, formaPago, concepto,
//          baseCents, ivaPct, cliente:{nombre,dni,direccion,cp,ciudad,email} }
export async function generarFacturaPDF(datos) {
  const { numero, fechaExpedicion, fechaOperacion, formaPago, concepto, cliente } = datos;
  const { baseCents, ivaCents, totalCents, ivaPct } = calcularImportes(datos.baseCents, datos.ivaPct ?? 21);
  const { descripcion, nota, fuente } = await textosFactura(concepto);

  const doc = await PDFDocument.create();
  doc.setTitle(`Factura ${numero} - ${EMISOR.nombre}`);
  doc.setAuthor(EMISOR.nombre);
  doc.setSubject(`Factura ${concepto}`);
  const page = doc.addPage([595.28, 841.89]);
  const W = 595.28, H = 841.89, M = 54;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const T = (s, x, y, size, f = font, color = DARK) => page.drawText(wansi(s), { x, y, size, font: f, color });
  const R = (s, xR, y, size, f = font, color = DARK) => {
    const t = wansi(s); page.drawText(t, { x: xR - f.widthOfTextAtSize(t, size), y, size, font: f, color });
  };
  const hr = (y, x1 = M, x2 = W - M, c = HAIR, th = 1) =>
    page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness: th, color: c });

  // ---- Cabecera: marca + título FACTURA ----
  let y = H - M;
  T("RIVERO", M, y - 18, 26, bold, NAVY);
  const wR = bold.widthOfTextAtSize("RIVERO", 26);
  T("ABOGADOS", M + wR + 8, y - 18, 16, font, GOLD);
  T("Defensa en expedientes sancionadores de tráfico", M, y - 34, 9, font, GRAY);
  R("FACTURA", W - M, y - 8, 24, font, NAVY);
  R(numero, W - M, y - 26, 11, bold, GOLD);
  hr(y - 46, M, W - M, GOLD, 1.5);

  // ---- Emisor / Destinatario ----
  y -= 70;
  T("EMISOR", M, y, 8.5, bold, LGRAY);
  T("FACTURAR A", W / 2 + 6, y, 8.5, bold, LGRAY);
  y -= 15;
  const emisor = [
    [EMISOR.nombre, bold], [`${EMISOR.titular} · NIF ${EMISOR.nif}`, font],
    [`${EMISOR.via}`, font], [`${EMISOR.cp} ${EMISOR.ciudad} (${EMISOR.provincia}) · ${EMISOR.pais}`, font],
    [EMISOR.colegiacion, font], [`${EMISOR.email} · ${EMISOR.telefono}`, font],
  ];
  const dest = [
    [cliente.nombre || "—", bold],
    [`DNI/NIF: ${cliente.dni || "—"}`, font],
    [cliente.direccion || "—", font],
    [[cliente.cp, cliente.ciudad].filter(Boolean).join(" ") || "—", font],
    [cliente.email || "", font],
  ];
  const rows = Math.max(emisor.length, dest.length);
  for (let i = 0; i < rows; i++) {
    if (emisor[i]) T(emisor[i][0], M, y - i * 13.5, 9.5, emisor[i][1], i === 0 ? NAVY : DARK);
    if (dest[i]) T(dest[i][0], W / 2 + 6, y - i * 13.5, 9.5, dest[i][1], i === 0 ? NAVY : DARK);
  }
  y -= rows * 13.5 + 22;

  // ---- Franja de metadatos ----
  const cellY = y;
  page.drawRectangle({ x: M, y: cellY - 34, width: W - 2 * M, height: 40, color: CREAM });
  const metas = [
    ["FECHA DE EXPEDICIÓN", fechaExpedicion],
    ["FECHA DE OPERACIÓN", fechaOperacion],
    ["FORMA DE PAGO", formaPago],
    ["RÉGIMEN", "General de IVA"],
  ];
  const cw = (W - 2 * M) / metas.length;
  metas.forEach((m, i) => {
    const x = M + 14 + i * cw;
    T(m[0], x, cellY - 12, 7, bold, LGRAY);
    T(m[1], x, cellY - 26, 9.5, font, DARK);
  });
  y = cellY - 34 - 28;

  // ---- Tabla de conceptos ----
  const cBase = W - M - 250, cIva = W - M - 130, cTot = W - M;
  T("CONCEPTO", M, y, 8.5, bold, NAVY);
  R("BASE", cBase + 30, y, 8.5, bold, NAVY);
  R(`IVA ${ivaPct}%`, cIva + 30, y, 8.5, bold, NAVY);
  R("TOTAL", cTot, y, 8.5, bold, NAVY);
  y -= 8; hr(y); y -= 18;

  T(concepto, M, y, 11.5, bold, DARK);
  R(eur(baseCents), cBase + 30, y, 10.5, font, DARK);
  R(eur(ivaCents), cIva + 30, y, 10.5, font, DARK);
  R(eur(totalCents), cTot, y, 10.5, font, DARK);
  let dy = y - 15;
  for (const l of wrap(descripcion, font, 9, cBase - M - 10)) { T(l, M, dy, 9, font, GRAY); dy -= 12; }
  const tablaBottom = Math.min(dy + 4, y - 16);
  hr(tablaBottom);

  // ---- Totales ----
  let ty = tablaBottom - 26;
  const lblX = W - M - 230, valX = W - M;
  T("Base imponible", lblX, ty, 10.5, font, GRAY); R(eur(baseCents), valX, ty, 10.5, font, DARK); ty -= 17;
  T(`Cuota de IVA (${ivaPct}%)`, lblX, ty, 10.5, font, GRAY); R(eur(ivaCents), valX, ty, 10.5, font, DARK); ty -= 14;
  page.drawRectangle({ x: lblX - 14, y: ty - 26, width: valX - lblX + 28, height: 30, color: NAVY });
  T("TOTAL FACTURA", lblX, ty - 16, 12, bold, rgb(1, 1, 1));
  R(eur(totalCents), valX, ty - 16, 13, bold, GOLD);

  // ---- Pie: nota + menciones legales + datos ----
  let ny = 132;
  hr(ny + 16);
  for (const l of wrap(nota, font, 9.5, W - 2 * M)) { T(l, M, ny, 9.5, font, GRAY); ny -= 13; }
  ny -= 6;
  T("Factura expedida conforme al Real Decreto 1619/2012, de 30 de noviembre. Operación sujeta y no exenta de IVA",
    M, ny, 8, font, LGRAY); ny -= 11;
  T("(régimen general). Conserve esta factura. Documento válido como justificante de pago.", M, ny, 8, font, LGRAY);

  T(`${EMISOR.nombre} · ${EMISOR.titular} · NIF ${EMISOR.nif} · ${EMISOR.cp} ${EMISOR.ciudad}`, M, 52, 8, font, LGRAY);
  R("Página 1 de 1", W - M, 52, 8, font, LGRAY);

  const bytes = await doc.save();
  return { bytes, fuente };
}
