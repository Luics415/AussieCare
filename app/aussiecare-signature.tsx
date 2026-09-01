/* eslint-disable @next/next/no-img-element -- The signature composes transparent brand assets without an image loader. */
import { withBasePath } from './base-path';

type AussieCareSignatureProps = {
  compact?: boolean;
};

export default function AussieCareSignature({ compact = false }: AussieCareSignatureProps) {
  return (
    <div className="aussiecare-signature" data-compact={compact ? 'true' : 'false'} role="group" aria-label="Firma de Luics415 para AussieCare">
      <span className="aussiecare-signature-anchor" aria-hidden="true">⚓︎</span>
      <div className="aussiecare-signature-copy">
        <span
          className="aussiecare-signature-name"
          role="img"
          aria-label="Luics415"
          style={{
            WebkitMaskImage: `url("${withBasePath('/brand/luics415-signature.webp')}")`,
            maskImage: `url("${withBasePath('/brand/luics415-signature.webp')}")`,
          }}
        />
        <p>Software Developer <b>AussieCare</b></p>
      </div>
      <span className="aussiecare-signature-seeds" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </span>
      <img className="aussiecare-signature-budgies" src={withBasePath('/brand/signature-budgies.webp')} alt="Dos periquitos ilustrados, uno azul y uno amarillo con verde" />
    </div>
  );
}
