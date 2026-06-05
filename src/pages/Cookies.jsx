import LegalLayout from "./LegalLayout.jsx";

export default function Cookies() {
  return (
    <LegalLayout title="Política de cookies">
      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que se descargan en tu dispositivo al visitar
        determinadas páginas web y que permiten, entre otras cosas, recordar tus preferencias
        o medir el uso del sitio.
      </p>

      <h2>2. ¿Qué cookies utiliza esta web?</h2>
      <p>
        Esta web utiliza únicamente <strong>cookies técnicas estrictamente necesarias</strong>{" "}
        para su funcionamiento, que no requieren consentimiento previo conforme a la normativa
        vigente. Actualmente no empleamos cookies de análisis, publicidad ni de seguimiento de
        terceros.
      </p>
      <ul>
        <li><strong>Cookies técnicas:</strong> permiten la navegación y el correcto funcionamiento de la página.</li>
      </ul>
      <p>
        En caso de incorporar en el futuro cookies analíticas o de terceros, se solicitará tu
        consentimiento previo mediante un banner de configuración.
      </p>

      <h2>3. ¿Cómo gestionar o desactivar las cookies?</h2>
      <p>
        Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo configurando
        las opciones de tu navegador. Los navegadores más habituales (Google Chrome, Mozilla
        Firefox, Microsoft Edge y Safari) ofrecen en su sección de ayuda instrucciones para
        gestionarlas.
      </p>

      <h2>4. Actualización</h2>
      <p>
        Esta política puede actualizarse en función de novedades legislativas o técnicas. Te
        recomendamos revisarla periódicamente.
      </p>
    </LegalLayout>
  );
}
