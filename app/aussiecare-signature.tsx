/* eslint-disable @next/next/no-img-element -- The signature banner renders the official brand artwork. */
import { withBasePath } from './base-path';

type AussieCareSignatureProps = {
  compact?: boolean;
};

export default function AussieCareSignature({ compact = false }: AussieCareSignatureProps) {
  return (
    <figure
      className="aussiecare-signature"
      data-compact={compact ? 'true' : 'false'}
      role="group"
      aria-label="Firma oficial de Luics415 para AussieCare"
    >
      <img
        className="aussiecare-signature-banner-img"
        src={withBasePath('/brand/aussiecare-share-v1.png')}
        alt="Firma oficial de Luics415 para AussieCare junto a los dos periquitos australianos"
        width={1200}
        height={630}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
