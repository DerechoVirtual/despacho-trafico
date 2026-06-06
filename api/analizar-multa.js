// Endpoint serverless de Vercel: "Anti Multaitor".
// Recibe el cuestionario (transcript) y una foto opcional del boletín, y pide a
// Gemini 3.5 Flash EN MODO RAZONADOR un veredicto jurídico estructurado sobre si
// la sanción de tráfico tiene posibilidades de prosperar (nulidad / anulabilidad
// / defectos de procedimiento).
//
// Variable de entorno necesaria en Vercel: GEMINI_API_KEY
//
// IMPORTANTE: el razonamiento puede tardar 8-15 s; ampliamos el tiempo máximo.
export const config = { maxDuration: 60 };

const MODEL = "gemini-3.5-flash";

const SCHEMA = {
  type: "object",
  properties: {
    viable: { type: "boolean" },
    probabilidad: { type: "integer" }, // 0-100
    nivel: { type: "string", enum: ["alta", "media", "baja", "muy_baja"] },
    via: {
      type: "string",
      enum: ["nulidad", "anulabilidad", "defecto_procedimiento", "varias", "ninguna"],
    },
    titular: { type: "string" },
    resumen: { type: "string" },
    motivos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          explicacion: { type: "string" },
        },
        required: ["titulo", "explicacion"],
      },
    },
    puntos_a_favor: { type: "array", items: { type: "string" } },
    riesgos: { type: "array", items: { type: "string" } },
    plazo: { type: "string" },
    siguiente_paso: { type: "string" },
    descargo: { type: "string" },
  },
  required: [
    "viable",
    "probabilidad",
    "nivel",
    "via",
    "titular",
    "resumen",
    "motivos",
    "plazo",
    "siguiente_paso",
    "descargo",
  ],
};

const SISTEMA = `Eres "Anti Multaitor", un analista jurídico de inteligencia artificial especializado en DERECHO ADMINISTRATIVO SANCIONADOR DE TRÁFICO en España. Tu misión es velar por la seguridad jurídica y la justicia del ciudadano y ayudarle a recuperar el dinero que se le ha cobrado de forma injusta.

Trabajas para el despacho Rivero Abogados. Analiza el caso del ciudadano y determina, razonando como un abogado riguroso, si la sanción tiene posibilidades REALES de prosperar por alguna de estas vías:
- NULIDAD de pleno derecho (art. 47 Ley 39/2015).
- ANULABILIDAD (art. 48 Ley 39/2015).
- DEFECTOS DEL PROCEDIMIENTO que abran defensa: caducidad del expediente sancionador (art. 112.3 LSV — RDL 6/2015), prescripción de la infracción o de la sanción, notificación defectuosa (arts. 40-44 Ley 39/2015 y notificación edictal TESTRA/BOE), falta de motivación, ausencia o invalidez de la verificación/homologación del cinemómetro (radar), falta del trámite obligatorio de identificación previa del conductor, vulneración de derechos y garantías, errores materiales relevantes, indefensión, etc.

REGLAS:
1. Sé HONESTO y calibrado. La credibilidad del despacho está en juego: no inventes defectos que no se deducen de los datos ni des falsas esperanzas. Si el caso es flojo, dilo, pero ofrece siempre que un abogado lo revise gratis.
2. Razona internamente antes de responder. Pondera plazos, gravedad, vía adecuada y carga de la prueba.
3. "probabilidad" es un entero 0-100 de que merezca la pena recurrir. "nivel": alta (>=65), media (40-64), baja (20-39), muy_baja (<20).
4. Si hay foto del boletín/notificación, léela: extrae órgano sancionador, artículo infringido, importe, fechas, firma y cualquier defecto formal, y contrástalo con lo que cuenta el ciudadano.
5. Escribe en español claro y cercano (trata de "tú" al ciudadano), sin jerga innecesaria. Cita los artículos cuando aporten autoridad.
6. "motivos": de 2 a 5 argumentos, cada uno con un título corto y una explicación de 1-2 frases.
7. "siguiente_paso": si es viable, invita a agendar una llamada gratuita con el equipo de Rivero Abogados. Si no, recomienda igualmente una revisión humana gratuita.
8. "descargo": recuerda en una frase que es un análisis orientativo automatizado, no un dictamen jurídico definitivo.
9. Devuelve EXCLUSIVAMENTE el JSON del esquema, sin texto adicional.`;

function construirCaso(transcript) {
  if (!Array.isArray(transcript) || transcript.length === 0) {
    return "El ciudadano no ha aportado apenas datos. Haz un análisis prudente y orientativo.";
  }
  return transcript
    .map((t) => `• ${t.pregunta}\n  → ${t.respuesta}`)
    .join("\n");
}

function veredictoFallback() {
  return {
    viable: true,
    probabilidad: 50,
    nivel: "media",
    via: "varias",
    titular: "Tu caso merece una revisión humana",
    resumen:
      "No hemos podido completar el análisis automático en este momento, pero por lo que nos cuentas hay margen para estudiarlo. Un abogado de Rivero Abogados lo revisará gratis y sin compromiso.",
    motivos: [
      {
        titulo: "Revisión personalizada",
        explicacion:
          "Cada sanción esconde detalles de procedimiento (plazos, notificación, pruebas) que conviene mirar con la documentación delante.",
      },
    ],
    puntos_a_favor: [],
    riesgos: [],
    plazo:
      "Los plazos para recurrir corren rápido (a menudo 20 días). Cuanto antes lo veamos, mejor.",
    siguiente_paso:
      "Agenda una llamada gratuita con el equipo de Rivero Abogados para revisar tu multa.",
    descargo:
      "Este es un análisis orientativo automatizado, no un dictamen jurídico definitivo.",
    fallback: true,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("Falta GEMINI_API_KEY");
    return res.status(200).json(veredictoFallback());
  }

  let data = req.body;
  if (!data || typeof data === "string") {
    try {
      data = JSON.parse(data || "{}");
    } catch {
      data = {};
    }
  }

  const transcript = data.transcript || [];
  const foto = data.foto;

  const parts = [
    {
      text: `${SISTEMA}\n\n=== DATOS DEL CASO ===\n${construirCaso(transcript)}\n\n${
        foto ? "Se adjunta una imagen del boletín/notificación: analízala con detenimiento." : "El ciudadano no ha adjuntado imagen."
      }`,
    },
  ];

  if (foto && foto.base64 && foto.mimeType) {
    parts.push({ inline_data: { mime_type: foto.mimeType, data: foto.base64 } });
  }

  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: SCHEMA,
      thinkingConfig: { thinkingBudget: -1 }, // MODO RAZONADOR (dinámico)
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
      const t = await r.text();
      console.error("Gemini error", r.status, t.slice(0, 400));
      return res.status(200).json(veredictoFallback());
    }
    const j = await r.json();
    const text =
      j.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("") || "";
    let verdict;
    try {
      verdict = JSON.parse(text);
    } catch {
      console.error("JSON inválido de Gemini:", text.slice(0, 300));
      return res.status(200).json(veredictoFallback());
    }
    // Saneado mínimo de límites.
    verdict.probabilidad = Math.max(0, Math.min(100, Math.round(verdict.probabilidad || 0)));
    verdict.fallback = false;
    return res.status(200).json(verdict);
  } catch (err) {
    console.error("Fallo analizar-multa:", err.message);
    return res.status(200).json(veredictoFallback());
  }
}
