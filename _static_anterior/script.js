/* Rivero Abogados — interacciones básicas de la web */

// Año dinámico en el pie
document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
if (navToggle && nav) {
  navToggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// Formulario de contacto (demo: validación + mensaje de confirmación)
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const tel = form.telefono.value.trim();
    const rgpd = form.rgpd.checked;

    if (!nombre || !email || !tel) {
      msg.textContent = "Por favor, completa tu nombre, teléfono y email.";
      msg.className = "form__msg err";
      return;
    }
    if (!rgpd) {
      msg.textContent = "Necesitamos tu consentimiento para tratar tus datos.";
      msg.className = "form__msg err";
      return;
    }

    // En producción aquí se enviaría a un servidor / email seguro.
    msg.textContent =
      "¡Gracias, " + nombre + "! Hemos recibido tu consulta. Te responderemos en 24-48 horas laborables.";
    msg.className = "form__msg ok";
    form.reset();
  });
}

// Sombra de cabecera al hacer scroll
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) header.style.boxShadow = "0 6px 20px rgba(15,44,77,.10)";
  else header.style.boxShadow = "none";
});
