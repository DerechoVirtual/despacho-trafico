// Datos centrales de los servicios del despacho.
// Se usan en: home (Services), índice /servicios y cada página /servicios/:slug.

export const servicios = [
  {
    slug: "alegaciones",
    titulo: "Alegaciones a la denuncia",
    cardTitulo: "Alegaciones a la denuncia",
    precio: "150 €",
    imagen: "/imagenes/alegaciones.jpg",
    eyebrow: "Primera línea de defensa",
    resumen:
      "Acabas de recibir la multa y aún estás a tiempo. Redactamos y presentamos un escrito defendiendo tu caso para que la Administración la archive antes de que vaya a más.",
    hero:
      "Si acabas de recibir la denuncia, las alegaciones son tu primera —y muchas veces mejor— oportunidad de tumbar la multa antes de que se convierta en sanción firme.",
    cuando: [
      "Te ha llegado el boletín de denuncia o la notificación de inicio del expediente.",
      "Todavía estás dentro del plazo de 20 días naturales para presentar escrito.",
      "Crees que la multa tiene algún error o que no se ajusta a lo que realmente pasó.",
    ],
    incluye: [
      "Estudio gratuito de viabilidad de tu denuncia.",
      "Análisis del boletín, la notificación y los plazos del procedimiento.",
      "Redacción del escrito de alegaciones con fundamentos jurídicos y prueba.",
      "Presentación ante la Administración sancionadora en tu nombre.",
      "Seguimiento hasta la resolución del expediente.",
    ],
    detalle:
      "En la fase de alegaciones revisamos a fondo el procedimiento: cómo se practicó la notificación, si el agente describió correctamente los hechos, si el aparato de medición estaba homologado y verificado, y si la Administración ha respetado todos los plazos. Cualquier defecto de forma puede provocar el archivo del expediente. Presentamos un escrito sólido, con jurisprudencia y, cuando procede, proposición de prueba.",
    icon: "documento",
  },
  {
    slug: "identificacion-conductor",
    titulo: "Identificación del conductor",
    cardTitulo: "Identificación del conductor",
    precio: "200 €",
    imagen: "/imagenes/identificacion.jpg",
    eyebrow: "Un error aquí se paga caro",
    resumen:
      "Te exigen decir quién conducía y un error aquí se paga caro. Te asesoramos y respondemos correctamente para evitar una sanción aún mayor.",
    hero:
      "Cuando la DGT o el Ayuntamiento te requieren para identificar al conductor, una respuesta mal planteada puede multiplicar tu multa. Te decimos exactamente qué hacer.",
    cuando: [
      "Eres el titular del vehículo y te piden identificar a quién conducía.",
      "No sabes con certeza quién iba al volante ese día.",
      "Temes que no identificar te suponga una sanción mucho mayor.",
    ],
    incluye: [
      "Análisis del requerimiento de identificación y sus plazos.",
      "Asesoramiento sobre las consecuencias de cada opción.",
      "Redacción y presentación de la respuesta correcta.",
      "Defensa frente a la sanción por no identificación (LSV art. 11), que puede llegar a 600 €.",
    ],
    detalle:
      "No identificar al conductor cuando la Administración lo exige es una infracción grave que puede triplicar el importe de la multa original. Pero la obligación tiene límites y requisitos formales. Estudiamos si el requerimiento se ha hecho correctamente, si la notificación fue válida y cuál es la respuesta que mejor protege tus intereses, evitando que un trámite aparentemente menor se convierta en una sanción de cientos de euros.",
    icon: "identidad",
  },
  {
    slug: "recurso-reposicion",
    titulo: "Recurso de reposición",
    cardTitulo: "Recurso de reposición",
    precio: "250 €",
    imagen: "/imagenes/recurso.jpg",
    eyebrow: "La pelea no ha terminado",
    resumen:
      "Ya te han sancionado, pero la pelea no ha terminado. Recurrimos la resolución ante el propio organismo que te multó buscando su anulación.",
    hero:
      "Que te hayan sancionado no significa que tengas que pagar. El recurso de reposición es la vía para que el organismo revise y anule su propia resolución.",
    cuando: [
      "Ya hay una resolución que confirma la sanción.",
      "Estás dentro del plazo de un mes para recurrir en reposición.",
      "Quieres agotar la vía administrativa antes de ir, si hace falta, al contencioso.",
    ],
    incluye: [
      "Revisión completa del expediente sancionador.",
      "Identificación de defectos de fondo y de forma.",
      "Redacción del recurso de reposición con base jurídica.",
      "Presentación ante el organismo y seguimiento de la resolución.",
      "Orientación sobre los siguientes pasos (contencioso-administrativo) si procede.",
    ],
    detalle:
      "El recurso de reposición se interpone ante la misma Administración que dictó la sanción. Es un paso clave: nos permite dejar constancia de todos los argumentos de defensa y, si se desestima, abre la puerta a la vía judicial contencioso-administrativa. Analizamos prescripción, caducidad del procedimiento, defectos de notificación y errores en la valoración de la prueba para construir el recurso más fuerte posible.",
    icon: "balanza",
  },
  {
    slug: "oposicion-apremio",
    titulo: "Oposición a la providencia de apremio",
    cardTitulo: "Oposición al apremio",
    precio: "300 €",
    imagen: "/imagenes/apremio.jpg",
    eyebrow: "Frena el embargo",
    resumen:
      "Te reclaman el pago con recargo o te amenazan con un embargo. Frenamos el procedimiento de cobro cuando tiene defectos que lo invalidan.",
    hero:
      "Cuando llega la providencia de apremio con recargos y la amenaza de embargo, todavía hay defensa. La vía de apremio tiene motivos tasados de oposición que conocemos al detalle.",
    cuando: [
      "Has recibido una providencia de apremio con recargo del 5%, 10% o 20%.",
      "Te amenazan con embargo de cuenta, nómina o bienes.",
      "Nunca te notificaron correctamente la sanción original.",
    ],
    incluye: [
      "Estudio de la providencia y del expediente de recaudación.",
      "Comprobación de la notificación de la sanción y de la prescripción de la deuda.",
      "Redacción de la oposición a la providencia de apremio.",
      "Solicitud de suspensión del procedimiento cuando proceda.",
      "Defensa para frenar o anular el embargo.",
    ],
    detalle:
      "La oposición a la providencia de apremio se basa en motivos concretos previstos en la ley: falta de notificación de la liquidación, prescripción, pago o anulación de la deuda, o defectos en la propia providencia. Uno de los más frecuentes —y eficaces— es la ausencia de notificación válida de la multa original. Si la Administración no puede acreditar que te notificó correctamente, el apremio se cae. Actuamos con rapidez para frenar el cobro y proteger tu patrimonio.",
    icon: "escudo",
  },
  {
    slug: "defensa-penal",
    titulo: "Defensa penal de tráfico",
    cardTitulo: "Defensa penal de tráfico",
    precio: "1.200 €",
    imagen: "/imagenes/alcoholemia.jpg",
    eyebrow: "Aquí te juegas mucho",
    destacado: true,
    resumen:
      "Alcoholemia, drogas, conducir sin carnet o a velocidad temeraria son delitos (arts. 379 a 385 del Código Penal). Aquí te juegas mucho: te defendemos en el juzgado con todas las garantías.",
    hero:
      "Alcoholemia, drogas, exceso temerario de velocidad o conducir sin permiso son delitos contra la seguridad vial. Te enfrentas a multa, retirada del carnet e incluso prisión. Necesitas defensa especializada desde el primer minuto.",
    cuando: [
      "Te han detenido o citado por un delito contra la seguridad vial (arts. 379-385 CP).",
      "Has dado positivo en alcoholemia o drogas, o te has negado a la prueba.",
      "Conducías sin permiso, sin puntos o a velocidad considerada delito.",
    ],
    incluye: [
      "Asistencia letrada desde la detención o la citación judicial.",
      "Estudio del atestado, la cadena de custodia y el aparato de medición.",
      "Negociación de conformidad cuando favorece al cliente.",
      "Defensa en juicio rápido o procedimiento abreviado.",
      "Estrategia para minimizar pena, multa y tiempo de retirada del permiso.",
    ],
    detalle:
      "Los delitos de tráfico se resuelven, muchas veces, en juicios rápidos donde no hay margen para improvisar. Revisamos la legalidad de la detención, cómo se practicó la prueba de alcoholemia o drogas, si el etilómetro estaba verificado, y si se respetaron tus derechos. A partir de ahí decidimos contigo la mejor estrategia: defensa en juicio o conformidad ventajosa. El objetivo siempre es el mismo: la mejor solución posible para ti y proteger tu permiso de conducir.",
    icon: "penal",
  },
  {
    slug: "carnet-licencias",
    titulo: "Carnet, puntos y licencias",
    cardTitulo: "Carnet y licencias",
    precio: "Consúltanos",
    imagen: "/imagenes/licencias.jpg",
    eyebrow: "Vuelve a conducir",
    resumen:
      "¿Te quedas sin puntos o pierdes la vigencia del permiso? Te ayudamos con la recuperación del carnet y los trámites de licencias para que vuelvas a conducir cuanto antes.",
    hero:
      "Perder los puntos o la vigencia del permiso no es el final del camino. Te acompañamos en todos los trámites para que recuperes tu carnet con seguridad jurídica.",
    cuando: [
      "Has perdido todos los puntos del carnet.",
      "Te han declarado la pérdida de vigencia del permiso.",
      "Necesitas recurrir la pérdida de puntos asociada a una sanción.",
    ],
    incluye: [
      "Análisis de tu saldo de puntos y del historial de sanciones.",
      "Recurso de las sanciones que te están restando puntos indebidamente.",
      "Asesoramiento sobre cursos de recuperación y plazos.",
      "Tramitación para recuperar la vigencia del permiso.",
    ],
    detalle:
      "Muchas pérdidas de puntos se apoyan en sanciones que nunca fueron correctamente notificadas o que eran recurribles. Si conseguimos anular esas multas, los puntos no se descuentan. Revisamos todo tu historial, recurrimos lo que sea defendible y te guiamos en el proceso de recuperación del permiso para que vuelvas a conducir cuanto antes y sin sustos.",
    icon: "carnet",
  },
];

export const getServicio = (slug) => servicios.find((s) => s.slug === slug);
