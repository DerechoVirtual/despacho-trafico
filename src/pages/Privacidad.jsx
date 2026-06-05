import LegalLayout from "./LegalLayout.jsx";

export default function Privacidad() {
  return (
    <LegalLayout title="Política de privacidad">
      <p>
        En Rivero Abogados nos tomamos muy en serio la protección de tus datos personales.
        Esta política explica, de forma clara, cómo los tratamos conforme al Reglamento (UE)
        2016/679 (RGPD) y a la Ley Orgánica 3/2018, de Protección de Datos Personales y
        garantía de los derechos digitales (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Responsable:</strong> Carlos Rivero García (Rivero Abogados)</li>
        <li><strong>Colegiación:</strong> Colegiado nº 12.345 del ICAM</li>
        <li><strong>Domicilio:</strong> Alicante (España)</li>
        <li><strong>Correo de contacto:</strong> info@riveroabogados.es</li>
      </ul>

      <h2>2. ¿Qué datos tratamos y con qué finalidad?</h2>
      <p>
        A través del formulario de contacto recogemos tu nombre, teléfono, correo
        electrónico y la información sobre tu consulta. Los utilizamos únicamente para:
      </p>
      <ul>
        <li>Atender tu solicitud y estudiar tu caso.</li>
        <li>Ponernos en contacto contigo para informarte sobre nuestros servicios.</li>
        <li>Gestionar, en su caso, la relación profesional si decides contratarnos.</li>
      </ul>

      <h2>3. Base jurídica</h2>
      <p>
        La base legal es tu <strong>consentimiento expreso</strong>, que prestas al marcar la
        casilla del formulario, y, en su caso, la ejecución de la relación contractual (hoja
        de encargo) y el cumplimiento de obligaciones legales (entre ellas la Ley 10/2010 de
        prevención del blanqueo de capitales).
      </p>

      <h2>4. Conservación de los datos</h2>
      <p>
        Conservaremos tus datos mientras dure la relación profesional y, posteriormente,
        durante los plazos legalmente exigibles para atender posibles responsabilidades. Si
        tu consulta no deriva en contratación, los suprimiremos cuando dejen de ser
        necesarios.
      </p>

      <h2>5. Destinatarios</h2>
      <p>
        No cedemos tus datos a terceros, salvo obligación legal o cuando sea imprescindible
        para la prestación del servicio (por ejemplo, ante administraciones públicas o
        juzgados en el marco de tu defensa).
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión,
        oposición, limitación del tratamiento y portabilidad, escribiendo a{" "}
        <strong>info@riveroabogados.es</strong>. También puedes presentar una reclamación ante
        la Agencia Española de Protección de Datos (www.aepd.es) si consideras que tus
        derechos no han sido atendidos.
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas para proteger tus datos frente a accesos
        no autorizados, pérdida o alteración. La información que nos facilites se trata de
        forma confidencial y amparada por el secreto profesional del abogado.
      </p>
    </LegalLayout>
  );
}
