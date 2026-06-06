// Genera la factura en PDF (maquetado perfecto con pdf-lib). El texto de la
// factura (descripción del concepto y nota de cortesía) lo redacta Gemini 3.5
// Flash; si Gemini falla, se usan textos por defecto. El PDF SIEMPRE se genera.
//
// Variable de entorno: GEMINI_API_KEY

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const MODEL = "gemini-3.5-flash";

export const EMISOR = {
  nombre: "Rivero Abogados",
  letrado: "Carlos Rivero García",
  colegiacion: "Colegiado nº 12.345 · ICAM",
  nif: "B-00000000",
  domicilio: "Alicante (España)",
  email: "carlosrivero@derechovirtual.org",
};

const NAVY = rgb(0.059, 0.173, 0.302);
const GOLD = rgb(0.784, 0.643, 0.361);
const CREAM = rgb(0.965, 0.937, 0.886);
const GRAY = rgb(0.39, 0.45, 0.51);
const DARK = rgb(0.11, 0.15, 0.2);
const LINE = rgb(0.88, 0.9, 0.93);

export function calcularImportes(baseCents, ivaPct = 21) {
  const ivaCents = Math.round(baseCents * (ivaPct / 100));
  return { baseCents, ivaCents, totalCents: baseCents + ivaCents, ivaPct };
}

const eur = (c) =>
  (c / 100).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

// Deja el texto en caracteres que las fuentes estándar (WinAnsi) pueden dibujar.
function wansi(s = "") {
  return String(s)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x00-\xFF€]/g, "");
}

// --- Gemini: textos de la factura -----------------------------------------
async function textosFactura(concepto) {
  const fallback = {
    descripcion: "Honorarios profesionales por la prestación del servicio jurídico contratado.",
    nota: `Factura pagada mediante tarjeta a través de Stripe. Gracias por confiar en ${EMISOR.nombre}.`,
    fuente: "respaldo",
  };
  const key = process.env.GEMINI_API_KEY;
  if (!key) return fallback;

  const prompt = `Eres el sistema de facturación del despacho ${EMISOR.nombre} (abogacía de tráfico en España). Para una factura del servicio "${concepto}", redacta en español (tono profesional y cercano, sin tecnicismos innecesarios):
- "descripcion": UNA frase (máx 18 palabras) que describa el concepto facturado de forma elegante para la línea de la factura.
- "nota": UNA o dos frases de cortesía para el pie de la factura, agradeciendo la confianza e indicando que el pago se ha realizado con tarjeta mediante Stripe.
Devuelve solo JSON.`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 512,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: { descripcion: { type: "string" }, nota: { type: "string" } },
        required: ["descripcion", "nota"],
      },
      thinkingConfig: { thinkingBudget: 0 },
    },
  };
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    if (!r.ok) {
      console.error("Gemini factura txt", r.status, (await r.text()).slice(0, 200));
      return fallback;
    }
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("") || "";
    const o = JSON.parse(text);
    if (!o.descripcion || !o.nota) return fallback;
    return { descripcion: o.descripcion, nota: o.nota, fuente: "gemini" };
  } catch (e) {
    console.error("textosFactura:", e.message);
    return fallback;
  }
}

// Parte un texto en líneas que caben en maxWidth.
function wrap(text, font, size, maxWidth) {
  const palabras = wansi(text).split(/\s+/);
  const lineas = [];
  let actual = "";
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (font.widthOfTextAtSize(prueba, size) > maxWidth && actual) {
      lineas.push(actual);
      actual = p;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

// --- PDF -------------------------------------------------------------------
// Devuelve { bytes: Uint8Array, fuente: "gemini"|"respaldo" }
export async function generarFacturaPDF(datos) {
  const { numero, fecha, concepto, cliente } = datos;
  const importes = calcularImportes(datos.baseCents, datos.ivaPct ?? 21);
  const { baseCents, ivaCents, totalCents, ivaPct } = importes;
  const { descripcion, nota, fuente } = await textosFactura(concepto);

  const doc = await PDFDocument.create();
  doc.setTitle(`Factura ${numero} - ${EMISOR.nombre}`);
  doc.setAuthor(EMISOR.nombre);
  const page = doc.addPage([595.28, 841.89]); // A4
  const W = 595.28;
  const H = 841.89;
  const M = 50;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const text = (s, x, y, size, f = font, color = DARK) =>
    page.drawText(wansi(s), { x, y, size, font: f, color });
  const right = (s, xRight, y, size, f = font, color = DARK) => {
    const t = wansi(s);
    page.drawText(t, { x: xRight - f.widthOfTextAtSize(t, size), y, size, font: f, color });
  };

  // Cabecera
  page.drawRectangle({ x: 0, y: H - 120, width: W, height: 120, color: NAVY });
  text(EMISOR.nombre.toUpperCase(), M, H - 58, 22, bold, rgb(1, 1, 1));
  text(`${EMISOR.letrado}  ·  ${EMISOR.colegiacion}`, M, H - 80, 10, font, GOLD);
  right("FACTURA", W - M, H - 50, 16, bold, rgb(1, 1, 1));
  right(`Nº ${numero}`, W - M, H - 72, 10, font, rgb(0.85, 0.89, 0.94));
  right(fecha, W - M, H - 88, 10, font, rgb(0.85, 0.89, 0.94));

  // Emisor / Cliente
  let y = H - 160;
  text("EMISOR", M, y, 9, bold, GRAY);
  text("FACTURAR A", W / 2 + 10, y, 9, bold, GRAY);
  y -= 16;
  const emisorLineas = [EMISOR.nombre, `NIF ${EMISOR.nif}`, EMISOR.domicilio, EMISOR.email];
  const clienteLineas = [
    cliente.nombre,
    cliente.dni ? `DNI/NIE ${cliente.dni}` : null,
    cliente.direccion || null,
    [cliente.cp, cliente.ciudad].filter(Boolean).join(" ") || null,
    cliente.email,
  ].filter(Boolean);
  const filas = Math.max(emisorLineas.length, clienteLineas.length);
  for (let i = 0; i < filas; i++) {
    if (emisorLineas[i]) text(emisorLineas[i], M, y - i * 14, 10, font, DARK);
    if (clienteLineas[i]) text(clienteLineas[i], W / 2 + 10, y - i * 14, 10, font, DARK);
  }
  y = y - filas * 14 - 30;

  // Tabla de conceptos
  page.drawRectangle({ x: M, y: y - 6, width: W - 2 * M, height: 26, color: CREAM });
  text("CONCEPTO", M + 12, y + 2, 10, bold, NAVY);
  right("IMPORTE", W - M - 12, y + 2, 10, bold, NAVY);
  y -= 24;

  text(concepto, M + 12, y - 6, 12, bold, DARK);
  const descLineas = wrap(descripcion, font, 9, W - 2 * M - 150);
  let yy = y - 22;
  for (const l of descLineas) {
    text(l, M + 12, yy, 9, font, GRAY);
    yy -= 12;
  }
  right(eur(baseCents), W - M - 12, y - 6, 12, font, DARK);
  const filaBottom = Math.min(yy, y - 30);
  page.drawLine({
    start: { x: M, y: filaBottom },
    end: { x: W - M, y: filaBottom },
    thickness: 1,
    color: LINE,
  });

  // Totales
  let ty = filaBottom - 26;
  const xLbl = W - M - 220;
  const xVal = W - M;
  text("Base imponible", xLbl, ty, 11, font, GRAY);
  right(eur(baseCents), xVal, ty, 11, font, DARK);
  ty -= 18;
  text(`IVA (${ivaPct}%)`, xLbl, ty, 11, font, GRAY);
  right(eur(ivaCents), xVal, ty, 11, font, DARK);
  ty -= 10;
  page.drawLine({ start: { x: xLbl, y: ty }, end: { x: xVal, y: ty }, thickness: 1.5, color: NAVY });
  ty -= 22;
  text("TOTAL", xLbl, ty, 13, bold, NAVY);
  right(eur(totalCents), xVal, ty, 13, bold, NAVY);

  // Nota de pie
  const notaLineas = wrap(nota, font, 10, W - 2 * M);
  let ny = 110;
  page.drawLine({ start: { x: M, y: ny + 18 }, end: { x: W - M, y: ny + 18 }, thickness: 1, color: LINE });
  for (const l of notaLineas) {
    text(l, M, ny, 10, font, GRAY);
    ny -= 14;
  }
  text(`${EMISOR.nombre} · ${EMISOR.letrado} · ${EMISOR.colegiacion}`, M, 50, 9, font, GRAY);

  const bytes = await doc.save();
  return { bytes, fuente };
}
