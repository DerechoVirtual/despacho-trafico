# CLAUDE.md — Proyecto Web "Rivero Abogados" (Despacho de Tráfico)

Notas básicas del proyecto. Este archivo recoge toda la información obtenida de la
carpeta **CURSO DE CLAUDE** (Módulo 5 - Conectores → "Clientes 100 (base de datos)")
sobre los clientes de tráfico del despacho, para construir la web.

---

## 🎯 Objetivo del proyecto

Crear una **página web completa y usable** del despacho de abogados, enfocada en
clientes que **reciben una multa y son sancionados** (procedimientos sancionadores
de tráfico). La web debe captar a particulares que quieren recurrir o defenderse de
una sanción y convertirlos en clientes del despacho.

---

## ⚖️ El despacho

| Dato | Valor |
|---|---|
| **Nombre comercial** | Rivero Abogados (Despacho Rivero Abogados) |
| **Letrado titular** | D. Carlos Rivero García |
| **Colegiación** | Colegiado nº 12.345 del ICAM |
| **Especialidad** | Defensa en expedientes sancionadores de tráfico |
| **Ámbito** | Nacional (clientes en toda España) |
| **Sede de referencia** | Alicante (hojas de encargo firmadas "En Alicante") |
| **Cumplimiento** | RGPD (UE 2016/679), LO 3/2018, Ley 10/2010 (blanqueo), Estatuto General de la Abogacía |

> ⚠️ Origen de los datos: caso práctico del curso (Módulo 5). Tratar como datos de
> proyecto. **Los datos personales de clientes (DNI, teléfono, email, matrícula) son
> CONFIDENCIALES y NUNCA deben publicarse ni filtrarse en la web pública.**

---

## 🛠️ Servicios y honorarios (cuotas fijas reales del despacho)

Tarifas extraídas de las hojas de encargo y la base de datos. Sirven de base para la
sección de **Servicios / Precios** de la web.

| Servicio | Honorario (cuota fija) |
|---|---|
| Alegaciones a la denuncia | **150 €** |
| Identificación del conductor | **200 €** |
| Recurso de reposición | **250 €** |
| Oposición a providencia de apremio | **300 €** |
| Defensa penal de tráfico (delitos arts. 379-385 CP) | **1.200 €** |

- Honorarios **+ IVA**, pago al firmar el encargo.
- **Honorario medio por expediente: 420,50 €.**

---

## 🚦 Tipos de infracción que gestiona el despacho

Casuística real presente en la base de datos (útil para landing pages por tipo de multa):

- Uso del teléfono móvil al conducir (LSV 76.d) — Grave, 200 €, 6 puntos
- Exceso de velocidad (LSV 142.1) — Grave
- Estacionar en zona prohibida / carga y descarga (OMTC art. 91) — Leve, 90 €
- Carril Bus indebido (RGCir art. 36) — Grave, 200 €
- Conducir sin ITV en vigor (LSV 76.j) — Grave, 200 €
- No identificación del conductor responsable (LSV 11) — Grave, 600 €
- Negativa a someterse a prueba de alcoholemia (CP art. 383) — Penal
- Conducir tras pérdida de vigencia del permiso / sin permiso (CP art. 384) — Penal

**Gravedad:** Leve · Grave · Muy Grave · Penal (delito).
**Administraciones sancionadoras:** DGT, Jefaturas Provinciales de Tráfico y
Ayuntamientos (Valencia, Alicante, Murcia, Málaga, Palma, Las Palmas, etc.).

---

## 📊 La base de datos de clientes (cifras del despacho)

| Métrica | Valor |
|---|---|
| Total clientes | **100** |
| Importe total de sanciones gestionadas | **34.700 €** |
| Total honorarios facturados | **42.050 €** |
| Honorario medio por expediente | **420,50 €** |

**Distribución por gravedad (aprox.):** 57 / 21 / 12 / 10 expedientes.

**Estados de expediente** (sirven para un futuro panel de seguimiento del cliente):
- Alegaciones presentadas
- Identificación del conductor presentada
- Recurso de reposición en trámite
- Contencioso-administrativo en trámite
- Apremio - oposición presentada
- Resuelto a favor del cliente
- Archivado - prescripción
- Resolución desestimatoria

**Ciclo de vida de un expediente** (documentos por cliente en cada carpeta):
Ficha → Boletín de denuncia → Escrito tipo / Alegaciones / Demanda → Hoja de encargo →
Poder de representación (apud acta) → Acuses → Comunicaciones al cliente → Resolución.

### Ubicación de los datos fuente
```
CURSO DE CLAUDE\Módulo 5 - Conectores\Clientes 100 (base de datos)\
├── Clientes_Contratos_100.xlsx   (hoja "Clientes y Contratos" + hoja "Resumen")
└── Expedientes (carpeta por cliente)\NNN_nombre_apellido\  (PDFs del expediente)
```
Columnas del Excel: Nº · Nº Expediente · Nº Contrato · Fecha contrato · Nombre · DNI ·
Teléfono · Email · Dirección · C.P. · Ciudad · Matrícula · Nº Boletín · Fecha infracción ·
Infracción · Artículo · Gravedad · Importe sanción · Puntos · Descuento pronto pago ·
Concepto honorarios · Honorarios · Estado expediente · Administración.

---

## 🌐 Estructura propuesta para la web (a desarrollar)

1. **Inicio** — propuesta de valor: "¿Te han multado? Recurre tu sanción de tráfico."
2. **Servicios** — alegaciones, identificación de conductor, recursos, apremio, defensa penal.
3. **Tipos de multa** — landings por infracción (móvil, velocidad, alcoholemia, ITV, aparcamiento…).
4. **Honorarios** — tarifas transparentes (cuotas fijas de la tabla anterior).
5. **Casos de éxito** — resultados anonimizados (p. ej. "Resuelto a favor del cliente", "Archivado por prescripción").
6. **Sobre el despacho** — Carlos Rivero García, ICAM 12.345.
7. **Contacto / Calculadora de multa** — formulario de captación (subida del boletín, datos de la sanción).
8. **Área de cliente** (futuro) — seguimiento del estado del expediente.

### Notas técnicas / pendientes
- Aviso legal, Política de privacidad y Política de cookies **obligatorios** (RGPD).
- El formulario de contacto recoge datos personales → consentimiento expreso + cifrado.
- Nunca exponer la base de datos real de clientes en el frontend.
- Stack web por decidir con Carlos.
