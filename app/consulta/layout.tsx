import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './consulta.css';
import './pwa-install.css';

export const metadata: Metadata = {
  title: 'AussieCare · Modo Consulta',
  description: 'Guía local y sin conexión para el cuidado cotidiano del periquito australiano.',
};

export default function ConsultaLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
