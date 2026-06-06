// Configuración data-driven del wizard de Anti Multaitor.
// Cada paso es una pregunta. El motor del wizard renderiza según `tipo`.
//
// tipos:
//   "single"   -> una sola opción (tarjetas seleccionables)
//   "multi"    -> varias opciones a la vez
//   "fechas"   -> dos fechas (infracción + notificación)
//   "foto"     -> subida de imagen del boletín/notificación
//   "textarea" -> texto libre
//
// `opcional: true`  -> se muestra el botón "Omitir esta pregunta".

export const PREGUNTAS = [
  {
    id: "tipo",
    tipo: "single",
    opcional: false,
    icono: "🚦",
    eyebrow: "EL CASO",
    pregunta: "¿Qué tipo de multa te han puesto?",
    ayuda: "Elige la que más se acerque. Con esto Anti Multaitor sabe qué normativa revisar.",
    opciones: [
      { value: "velocidad", emoji: "📸", label: "Exceso de velocidad", desc: "Radar fijo, móvil o de tramo" },
      { value: "movil", emoji: "📱", label: "Móvil o distracciones", desc: "Teléfono, manos en el volante" },
      { value: "alcoholemia", emoji: "🍺", label: "Alcoholemia o drogas", desc: "Control o negativa a la prueba" },
      { value: "aparcamiento", emoji: "🅿️", label: "Aparcamiento", desc: "Zona azul, carga y descarga, vado" },
      { value: "semaforo", emoji: "🚦", label: "Semáforo en rojo", desc: "Foto-rojo o agente" },
      { value: "carril", emoji: "🚌", label: "Carril bus / VAO / sentido", desc: "Carril reservado o prohibido" },
      { value: "itv", emoji: "🛠️", label: "Sin ITV o sin seguro", desc: "Documentación del vehículo" },
      { value: "no-identificar", emoji: "🪪", label: "No identificar al conductor", desc: "Requerimiento de identificación" },
      { value: "documentacion", emoji: "🔖", label: "Cinturón, luces, casco…", desc: "Otras infracciones de circulación" },
      { value: "otra", emoji: "❓", label: "Otra / no estoy seguro", desc: "Cuéntamelo más adelante" },
    ],
  },
  {
    id: "importe",
    tipo: "single",
    opcional: true,
    icono: "💶",
    eyebrow: "LA SANCIÓN",
    pregunta: "¿De cuánto es la sanción?",
    ayuda: "El importe ayuda a calibrar la gravedad y la estrategia.",
    opciones: [
      { value: "0-100", emoji: "🟢", label: "Menos de 100 €", desc: "Suele ser infracción leve" },
      { value: "100-300", emoji: "🟡", label: "Entre 100 € y 300 €", desc: "Habitualmente grave" },
      { value: "300-500", emoji: "🟠", label: "Entre 300 € y 500 €", desc: "Grave / muy grave" },
      { value: "500-1000", emoji: "🔴", label: "Entre 500 € y 1.000 €", desc: "Muy grave" },
      { value: "1000+", emoji: "⚫", label: "Más de 1.000 €", desc: "Puede haber vía penal" },
    ],
  },
  {
    id: "puntos",
    tipo: "single",
    opcional: true,
    icono: "🎯",
    eyebrow: "TU CARNET",
    pregunta: "¿Cuántos puntos te quitan?",
    ayuda: "Defender la multa es la vía para no perder esos puntos.",
    opciones: [
      { value: "0", emoji: "✅", label: "No me quitan puntos", desc: "" },
      { value: "2", emoji: "2️⃣", label: "2 puntos", desc: "" },
      { value: "3", emoji: "3️⃣", label: "3 puntos", desc: "" },
      { value: "4", emoji: "4️⃣", label: "4 puntos", desc: "" },
      { value: "6", emoji: "6️⃣", label: "6 puntos", desc: "El máximo por infracción" },
      { value: "ns", emoji: "🤔", label: "No lo sé", desc: "" },
    ],
  },
  {
    id: "administracion",
    tipo: "single",
    opcional: true,
    icono: "🏛️",
    eyebrow: "QUIÉN TE SANCIONA",
    pregunta: "¿Quién te ha puesto la multa?",
    ayuda: "Cada administración tiene su procedimiento y sus plazos.",
    opciones: [
      { value: "dgt", emoji: "🚓", label: "DGT / Jefatura de Tráfico", desc: "Multas de carretera estatales" },
      { value: "ayuntamiento", emoji: "🏙️", label: "Ayuntamiento", desc: "Multa municipal (ciudad)" },
      { value: "guardia-civil", emoji: "🪖", label: "Guardia Civil de Tráfico", desc: "Agentes en carretera" },
      { value: "autonomica", emoji: "🚔", label: "Policía autonómica", desc: "Mossos, Ertzaintza, Forales…" },
      { value: "ns", emoji: "🤔", label: "No lo sé", desc: "" },
    ],
  },
  {
    id: "fechas",
    tipo: "fechas",
    opcional: true,
    icono: "📅",
    eyebrow: "LOS PLAZOS",
    pregunta: "¿Cuándo ocurrió y cuándo te llegó?",
    ayuda:
      "Las fechas son CLAVE: con ellas Anti Multaitor revisa si hay caducidad o prescripción. Si no las recuerdas con exactitud, pon una aproximada u omite.",
    campos: [
      { id: "infraccion", label: "Fecha de la infracción" },
      { id: "notificacion", label: "Fecha en que te notificaron" },
    ],
  },
  {
    id: "notificacion_forma",
    tipo: "single",
    opcional: true,
    icono: "📬",
    eyebrow: "LA NOTIFICACIÓN",
    pregunta: "¿Cómo te llegó la multa?",
    ayuda: "Una notificación mal hecha es uno de los defectos que más anula sanciones.",
    opciones: [
      { value: "mano", emoji: "✍️", label: "En mano, firmé yo", desc: "Recibí y firmé el acuse" },
      { value: "familiar", emoji: "🏠", label: "La recogió otra persona", desc: "Familiar, vecino o portero" },
      { value: "buzon", emoji: "📭", label: "Apareció en el buzón", desc: "Sin firma de nadie" },
      { value: "tablon", emoji: "📢", label: "Por el Tablón Edictal", desc: "TESTRA / BOE: no me llegó a casa" },
      { value: "apremio", emoji: "⚠️", label: "Me enteré tarde", desc: "Por el apremio, el banco o un embargo" },
      { value: "ns", emoji: "🤔", label: "No lo sé", desc: "" },
    ],
  },
  {
    id: "captacion",
    tipo: "single",
    opcional: true,
    icono: "📷",
    eyebrow: "CÓMO TE PILLARON",
    pregunta: "¿Te paró un agente o fue una cámara?",
    ayuda: "Si fue un aparato (radar/cámara), entra en juego su homologación y verificación.",
    opciones: [
      { value: "radar", emoji: "📸", label: "Radar o cámara", desc: "No me pararon en el momento" },
      { value: "agente", emoji: "👮", label: "Me paró un agente", desc: "En el sitio, en el momento" },
      { value: "camara-zona", emoji: "🎥", label: "Cámara de zona o grúa", desc: "Aparcamiento, carril bus…" },
      { value: "ns", emoji: "🤔", label: "No lo sé", desc: "" },
    ],
  },
  {
    id: "identificacion",
    tipo: "single",
    opcional: true,
    icono: "🪪",
    eyebrow: "EL CONDUCTOR",
    pregunta: "¿Quién conducía y te lo preguntaron?",
    ayuda: "Si no te requirieron correctamente para identificar al conductor, hay defensa.",
    opciones: [
      { value: "conducia-yo", emoji: "🙋", label: "Conducía yo", desc: "" },
      { value: "otro-identificado", emoji: "👥", label: "Otra persona y la identifiqué", desc: "Ya di sus datos" },
      { value: "no-requerido", emoji: "🚫", label: "No me lo pidieron", desc: "Me sancionaron directamente" },
      { value: "requerido-no", emoji: "⏰", label: "Me lo pidieron y no contesté", desc: "No llegué a identificar a tiempo" },
      { value: "ns", emoji: "🤔", label: "No lo sé", desc: "" },
    ],
  },
  {
    id: "fase",
    tipo: "single",
    opcional: true,
    icono: "⏳",
    eyebrow: "POR DÓNDE VAS",
    pregunta: "¿Has hecho ya algo con la multa?",
    ayuda: "Saber en qué fase estás determina qué recurso toca y cuánto tiempo queda.",
    opciones: [
      { value: "nada", emoji: "🆕", label: "Aún no he hecho nada", desc: "Acabo de recibirla" },
      { value: "alegaciones", emoji: "📝", label: "Presenté alegaciones", desc: "Estoy esperando respuesta" },
      { value: "desestimada", emoji: "❌", label: "Recurrí y me la desestimaron", desc: "Me dijeron que no" },
      { value: "pagada", emoji: "💳", label: "Ya la pagué", desc: "Con o sin descuento" },
      { value: "apremio", emoji: "🔔", label: "Me llegó el apremio", desc: "Providencia de apremio o embargo" },
      { value: "ns", emoji: "🤔", label: "No lo sé", desc: "" },
    ],
  },
  {
    id: "detalle_favor",
    tipo: "multi",
    opcional: true,
    icono: "🛡️",
    eyebrow: "TUS BAZAS",
    pregunta: "¿Alguna de estas situaciones es la tuya?",
    ayuda: "Marca todas las que apliquen. Cada una puede abrir una vía de defensa.",
    opciones: [
      { value: "senalizacion", emoji: "🚧", label: "La señal o el límite no se veía / faltaba" },
      { value: "radar-no-senalizado", emoji: "📡", label: "El radar no estaba señalizado" },
      { value: "datos-erroneos", emoji: "🔤", label: "Hay errores en mis datos, matrícula o lugar" },
      { value: "sin-derechos", emoji: "📜", label: "No me informaron de mis derechos" },
      { value: "emergencia", emoji: "🚑", label: "Había una urgencia o emergencia real" },
      { value: "sin-pruebas", emoji: "🔍", label: "No me han dado pruebas (foto, calibración…)" },
      { value: "doble", emoji: "♻️", label: "Creo que me sancionan dos veces por lo mismo" },
      { value: "ninguno", emoji: "➖", label: "Ninguna de estas", soltero: true },
    ],
  },
  {
    id: "foto",
    tipo: "foto",
    opcional: true,
    icono: "📎",
    eyebrow: "LA PRUEBA",
    pregunta: "Sube una foto del boletín o la notificación",
    ayuda:
      "Anti Multaitor leerá el documento para detectar defectos que a simple vista se escapan (órgano, artículo, fechas, firma…). Si no la tienes a mano, puedes omitir este paso.",
  },
  {
    id: "relato",
    tipo: "textarea",
    opcional: true,
    icono: "💬",
    eyebrow: "TU VERSIÓN",
    pregunta: "Cuéntame con tus palabras qué pasó",
    ayuda: "Todo detalle suma. ¿Qué consideras injusto? ¿Hay algo raro en cómo te multaron?",
    placeholder:
      "Ej.: Iba a 95 en una vía donde creo que el límite eran 90, pero la señal estaba tapada por un árbol. La carta me llegó 3 meses después y la recogió mi vecino…",
    maxLength: 1200,
  },
];

// Etiquetas legibles por valor, para construir el transcript que se envía a Gemini.
export function etiquetaOpcion(preguntaId, valor) {
  const q = PREGUNTAS.find((p) => p.id === preguntaId);
  if (!q || !q.opciones) return valor;
  const op = q.opciones.find((o) => o.value === valor);
  return op ? op.label : valor;
}
