// Fuente de verdad (lado servidor) de los servicios contratables online.
// slug -> { nombre, price (Stripe), cents (importe REAL base sin IVA), infraccion, docs[] }
//
// ⚠️ MODO TEST (petición de Carlos): el `price` de Stripe cobra 1 € para poder
// hacer pruebas reales, pero la FACTURA se emite por el importe real (`cents`,
// p.ej. 150/200/250 € + IVA). Para volver a producción, cambiar cada `price` por
// el price real correspondiente (ver _imggen/stripe_setup.mjs / CLAUDE.md).
//   reales: alegaciones price_1TfJZCB2szZEmbl7Rv8Rh7ZE, identificacion price_1TfJZDB2szZEmbl7qPY79vtk,
//   recurso price_1TfJZFB2szZEmbl78LFnLvTi, apremio price_1TfJZGB2szZEmbl7CHSsFwnj, penal price_1TfJZHB2szZEmbl79r6cUM89

export const TAX_RATE = "txr_1TfJZBB2szZEmbl7c1uW6PM2"; // IVA 21% (España)
export const MODO_TEST = true; // cobro 1 €, factura por importe real

export const SERVICIOS = {
  alegaciones: {
    nombre: "Alegaciones a la denuncia",
    price: "price_1TfJqgB2szZEmbl73D3qKUBo", // TEST 1 €
    cents: 15000,
    infraccion: "Alegaciones a la denuncia de tráfico",
    docs: ["dni", "multa", "permiso_conducir", "hoja_encargo", "poder", "pruebas"],
  },
  "identificacion-conductor": {
    nombre: "Identificación del conductor",
    price: "price_1TfJqhB2szZEmbl7dSoYN5yO", // TEST 1 €
    cents: 20000,
    infraccion: "Identificación del conductor responsable",
    docs: ["dni", "requerimiento_identificacion", "permiso_circulacion", "hoja_encargo", "poder"],
  },
  "recurso-reposicion": {
    nombre: "Recurso de reposición",
    price: "price_1TfJqhB2szZEmbl7UyHFZcE4", // TEST 1 €
    cents: 25000,
    infraccion: "Recurso de reposición contra sanción de tráfico",
    docs: ["dni", "multa", "resolucion_sancion", "hoja_encargo", "poder", "pruebas"],
  },
  "oposicion-apremio": {
    nombre: "Oposición a la providencia de apremio",
    price: "price_1TfJqiB2szZEmbl7oAMn3HdH", // TEST 1 €
    cents: 30000,
    infraccion: "Oposición a la providencia de apremio",
    docs: ["dni", "providencia_apremio", "multa", "hoja_encargo", "poder"],
  },
  "defensa-penal": {
    nombre: "Defensa penal de tráfico",
    price: "price_1TfJqjB2szZEmbl7LWBppFqm", // TEST 1 €
    cents: 120000,
    infraccion: "Delito contra la seguridad vial (arts. 379-385 CP)",
    docs: ["dni", "atestado", "permiso_conducir", "hoja_encargo", "poder", "pruebas"],
  },
};

// Títulos legibles de cada documento requerido (para los emails).
export const DOC_TITULOS = {
  dni: "DNI o NIE por ambas caras",
  multa: "Boletín de denuncia o notificación de la multa",
  permiso_conducir: "Permiso de conducir (ambas caras)",
  permiso_circulacion: "Permiso de circulación del vehículo",
  hoja_encargo: "Hoja de encargo firmada",
  poder: "Poder de representación (apud acta) firmado",
  pruebas: "Pruebas adicionales (fotos, tickets, testigos…) — opcional",
  requerimiento_identificacion: "Requerimiento de identificación del conductor",
  resolucion_sancion: "Resolución sancionadora que vamos a recurrir",
  providencia_apremio: "Providencia de apremio con el recargo",
  atestado: "Atestado o diligencias policiales — opcional",
};

export function getServicio(slug) {
  return SERVICIOS[slug] || null;
}
