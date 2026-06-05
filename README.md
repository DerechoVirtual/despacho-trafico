# Rivero Abogados — Web del despacho

Sitio web del despacho **Rivero Abogados**, especialista en la defensa de **multas y sanciones de tráfico** en toda España (alegaciones, recursos, alcoholemia, puntos del carnet y defensa penal de tráfico).

El objetivo de la web es captar clientes que han recibido una multa y quieren recurrirla, convirtiéndolos en leads a través de una **consulta gratuita / estudio de viabilidad** sin compromiso.

---

## 🛠️ Stack tecnológico

- **[React 18](https://react.dev/)** — interfaz por componentes.
- **[Vite 5](https://vitejs.dev/)** — bundler y servidor de desarrollo.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — estilos utilitarios con tema de marca personalizado.
- **[React Router 6](https://reactrouter.com/)** — rutas para las páginas legales.

---

## 🚀 Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:5173)
npm run dev

# 3. Build de producción (genera la carpeta /dist)
npm run build

# 4. Previsualizar el build
npm run preview
```

---

## 📁 Estructura

```
proyecto web trafico/
├── index.html              # Entrada + SEO (metadatos, Open Graph, datos estructurados JSON-LD)
├── public/
│   ├── imagenes/           # Imágenes (generadas con IA y optimizadas a .jpg)
│   ├── og-image.jpg        # Imagen para compartir en redes (1200x630)
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx            # Bootstrap + router
    ├── App.jsx             # Ensamblado de la home
    ├── index.css           # Tailwind + tema de marca (colores y tipografías)
    ├── components/         # Secciones de la home
    │   ├── Navbar.jsx
    │   ├── Hero.jsx
    │   ├── TrustBar.jsx
    │   ├── Services.jsx
    │   ├── InfractionTypes.jsx
    │   ├── Process.jsx
    │   ├── SocialProof.jsx
    │   ├── About.jsx
    │   ├── FAQ.jsx
    │   ├── CTASection.jsx
    │   ├── Contact.jsx
    │   └── Footer.jsx
    └── pages/              # Páginas legales (rutas)
        ├── LegalLayout.jsx
        ├── AvisoLegal.jsx
        ├── Privacidad.jsx
        └── Cookies.jsx
```

---

## 🔍 SEO

- Título, meta description y keywords orientados a "abogados multas de tráfico".
- **Open Graph** y **Twitter Cards** con imagen para previsualización en WhatsApp, redes y buscadores.
- **Datos estructurados (JSON-LD)**: `LegalService` (despacho) y `FAQPage` (preguntas frecuentes, candidatas a rich results en Google).
- `robots.txt` y `sitemap.xml`.
- Títulos dinámicos por ruta en las páginas legales.

> **Mejora futura recomendada:** al ser una SPA, para un SEO óptimo conviene añadir prerenderizado/SSR (p. ej. `vite-plugin-ssr`, Astro o Next.js) para que cada ruta sirva su HTML completo a los buscadores.

---

## 🎨 Marca

- **Colores:** azul marino `#0f2c4d` + dorado `#c8a45c` sobre crema `#f7f4ee`.
- **Tipografías:** Playfair Display (titulares) + Inter (texto).

---

## 🔒 Confidencialidad y cumplimiento

- La web **no expone ningún dato personal de clientes** (DNI, teléfonos, matrículas, expedientes). Los casos mostrados están anonimizados.
- Incluye Aviso legal, Política de privacidad y Política de cookies conforme al **RGPD (UE 2016/679)** y la **LOPDGDD 3/2018**.
- El formulario de contacto recoge consentimiento expreso del usuario.

---

## 📌 Pendiente / próximos pasos

- Conectar el formulario de contacto a un backend o servicio de email.
- Sustituir teléfono, email y enlace de WhatsApp por los datos reales del despacho.
- Configurar el dominio definitivo y desplegar (Vercel, Netlify, etc.).
- Añadir analítica y, si procede, banner de cookies de consentimiento.

---

© Rivero Abogados — Carlos Rivero García, Colegiado nº 12.345 (ICAM).
