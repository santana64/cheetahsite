import './globals.css';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollReveal from '@/components/ScrollReveal';

// Bundled OFL fonts: reproducible builds without third-party font requests.
const display = localFont({
  src: '../../public/fonts/Archivo-Display.woff2',
  variable: '--font-display',
  weight: '600 900',
  display: 'swap',
});

const ui = localFont({
  src: '../../public/fonts/InterTight-UI.woff2',
  variable: '--font-ui',
  weight: '400 700',
  display: 'swap',
});

const mono = localFont({
  src: [
    { path: '../../public/fonts/ControlFieldMono-Regular.woff2', weight: '400' },
    { path: '../../public/fonts/ControlFieldMono-Medium.woff2', weight: '500' },
    { path: '../../public/fonts/ControlFieldMono-SemiBold.woff2', weight: '600' },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
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
      <head>
        {/*
          Les effets d'entrée ne masquent le contenu que si trois conditions
          sont réunies : le script s'exécute, l'onglet est au premier plan, et
          l'utilisateur n'a pas demandé moins de mouvement. Un onglet ouvert en
          arrière-plan ou un outil de capture ralentit la timeline d'animation :
          sans ce garde-fou, une transition bloquée laisserait le contenu
          invisible pour toujours.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(document.visibilityState==='visible'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-reveal')}}catch(e){}",
          }}
        />
      </head>
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
