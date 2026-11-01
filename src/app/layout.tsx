import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, Inter_Tight } from 'next/font/google';
import { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollReveal from '@/components/ScrollReveal';

const display = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});

const ui = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CheetahSoft — Piloter les coûts, les délais et les preuves d’un projet',
    template: '%s · CheetahSoft',
  },
  description:
    'Cheetah tient la chaîne complète du contrôle de projet : budget à date, avancement physique, valeur acquise, coût prévisionnel et écart. Cost, Time et Doc dans un seul système.',
  applicationName: 'CheetahSoft',
  authors: [{ name: 'CheetahSoft' }],
  keywords: [
    'contrôle de coûts',
    'pilotage de projet',
    'valeur acquise',
    'coût prévisionnel',
    'budget à date',
    'planification',
    'gestion documentaire',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'CheetahSoft',
    title: 'CheetahSoft — Precision in motion',
    description:
      'Budget à date, avancement physique, valeur acquise, coût prévisionnel, écart. Le contrôle de projet tenu ligne par ligne.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#06080a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
