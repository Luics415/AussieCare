/* eslint-disable @next/next/no-img-element -- The signature composes transparent brand assets without an image loader. */
type AussieCareSignatureProps = {
  compact?: boolean;
};

export default function AussieCareSignature({ compact = false }: AussieCareSignatureProps) {
  return (
    <section className="aussiecare-signature" data-compact={compact ? 'true' : 'false'} aria-label="Firma de Luics415 para AussieCare">
      <img className="aussiecare-signature-watermark" src="/brand/aussiecare-icon.webp" alt="" aria-hidden="true" />
      <div className="aussiecare-signature-copy">
        <strong>Luics415</strong>
        <p>Software Developer <i>·</i> <b>AussieCare</b></p>
      </div>
      <img className="aussiecare-signature-budgies" src="/brand/signature-budgies.webp" alt="Dos periquitos ilustrados, uno azul y uno amarillo con verde" />
    </section>
  );
}
