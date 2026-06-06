// Helpers de cliente para Anti Multaitor: compresión de imagen, construcción del
// "transcript" legible para Gemini y las dos llamadas a los endpoints serverless.

import { PREGUNTAS, etiquetaOpcion } from "../data/antimultaitorPreguntas.js";

/**
 * Comprime una imagen en el navegador a JPEG (máx. ~1600px lado mayor) y
 * devuelve { mimeType, base64, dataUrl, peso }. Mantiene el payload por debajo
 * del límite serverless de Vercel (~4.5 MB) y acelera el análisis.
 */
export function comprimirImagen(file, maxLado = 1600, calidad = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("El archivo no parece una imagen válida."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxLado || height > maxLado) {
          const ratio = Math.min(maxLado / width, maxLado / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", calidad);
        const base64 = dataUrl.split(",")[1] || "";
        resolve({
          mimeType: "image/jpeg",
          base64,
          dataUrl,
          peso: Math.round((base64.length * 3) / 4 / 1024), // KB aprox.
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/** Convierte las respuestas del wizard en pares legibles {pregunta, respuesta}. */
export function construirTranscript(answers) {
  const lineas = [];
  for (const q of PREGUNTAS) {
    const val = answers[q.id];
    if (val == null || val === "" || (Array.isArray(val) && val.length === 0)) continue;

    let respuesta;
    if (q.tipo === "single") {
      respuesta = etiquetaOpcion(q.id, val);
    } else if (q.tipo === "multi") {
      respuesta = val.map((v) => etiquetaOpcion(q.id, v)).join("; ");
    } else if (q.tipo === "fechas") {
      const partes = [];
      if (val.infraccion) partes.push(`infracción: ${val.infraccion}`);
      if (val.notificacion) partes.push(`notificación: ${val.notificacion}`);
      if (!partes.length) continue;
      respuesta = partes.join(" · ");
    } else if (q.tipo === "textarea") {
      respuesta = String(val).trim();
      if (!respuesta) continue;
    } else {
      continue; // la foto se envía aparte
    }
    lineas.push({ pregunta: q.pregunta, respuesta });
  }
  return lineas;
}

/** Mock de veredicto para desarrollo local (vite dev no ejecuta /api). */
function veredictoMock() {
  return {
    viable: true,
    probabilidad: 78,
    nivel: "alta",
    via: "defecto_procedimiento",
    titular: "Tu multa tiene defectos serios que se pueden atacar",
    resumen:
      "(MODO DEMO) Hemos detectado una notificación que podría ser defectuosa y la posible falta del trámite de identificación del conductor. Son dos vías sólidas para pelear la sanción.",
    motivos: [
      {
        titulo: "Notificación defectuosa",
        explicacion:
          "La recogió otra persona sin tu autorización expresa; los arts. 40-44 de la Ley 39/2015 exigen requisitos estrictos que aquí podrían no cumplirse.",
      },
      {
        titulo: "Falta de identificación previa del conductor",
        explicacion:
          "Al no pararte en el acto, la Administración debía requerirte antes de sancionar. Si no lo hizo, el procedimiento está viciado.",
      },
      {
        titulo: "Sin prueba de verificación del radar",
        explicacion:
          "No consta el certificado de verificación periódica del cinemómetro, exigible para que la medición tenga validez.",
      },
    ],
    puntos_a_favor: [
      "Plazos aún abiertos para recurrir",
      "Posible indefensión por la notificación",
      "Carga de la prueba del lado de la Administración",
    ],
    riesgos: [
      "Conviene confirmar las fechas exactas con la documentación original.",
    ],
    plazo:
      "Si acabas de recibirla, tienes 20 días naturales para alegar. No conviene esperar.",
    siguiente_paso:
      "Agenda una llamada gratuita con el equipo de Rivero Abogados para revisar el expediente y preparar el recurso.",
    descargo:
      "Este es un análisis orientativo automatizado, no un dictamen jurídico. La viabilidad definitiva la confirma un abogado tras revisar la documentación.",
    fallback: false,
    demo: true,
  };
}

/** Llama al endpoint de análisis (Gemini razonador). */
export async function analizarMulta({ transcript, foto }) {
  try {
    const res = await fetch("/api/analizar-multa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        foto: foto ? { mimeType: foto.mimeType, base64: foto.base64 } : null,
      }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data || typeof data.probabilidad !== "number") throw new Error("Respuesta inválida");
    return data;
  } catch (err) {
    // En desarrollo (vite dev) no existe /api: usamos el mock para poder ver la UI.
    if (import.meta.env.DEV) {
      await new Promise((r) => setTimeout(r, 4500));
      return veredictoMock();
    }
    throw err;
  }
}

/** Envía el lead (agendar llamada) por email al equipo. */
export async function agendarLlamada(payload) {
  try {
    const res = await fetch("/api/agendar-llamada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let json = {};
    try {
      json = await res.json();
    } catch {
      /* respuesta no-JSON */
    }
    if (!res.ok || !json.ok) {
      throw new Error(json.error || "No se pudo enviar tu solicitud.");
    }
    return json;
  } catch (err) {
    if (import.meta.env.DEV) {
      await new Promise((r) => setTimeout(r, 1200));
      return { ok: true, demo: true };
    }
    throw err;
  }
}
