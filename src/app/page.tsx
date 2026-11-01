'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ── Animation variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } };

/* ── TiltCard — 3D perspective hover effect ─────────────────────────── */
function TiltCard({ children, className = '', intensity = 10, style }: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 400, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 400, damping: 25 });
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
        className={className}
      >
        <motion.div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
            background: useTransform([glowX, glowY], ([gx, gy]: number[]) =>
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(86,164,91,0.12) 0%, transparent 60%)`
            ),
            zIndex: 1,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}

/* ── AnimatedCounter ────────────────────────────────────────────────── */
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 1.8 }: {
  end: number; suffix?: string; prefix?: string; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); } else { setCount(Math.floor(start)); }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ── Data ────────────────────────────────────────────────────────────── */
const modules = [
  {
    id: 'cost',
    name: 'Cheetah Cost',
    tagline: 'Contrôle total des coûts en temps réel',
    icon: '📊',
    color: '#56a45b',
    coming: false,
    description:
      "Suivez chaque euro grâce à la méthode FGF. Anticipez les dépassements avant qu'ils surviennent — comparez budget de référence et réalisé, et produisez vos rapports de synthèse en un clic.",
    features: [
      'Dashboard budget en temps réel',
      'Méthode FGF — Forecasting at Completion',
      'Alertes prédictives sur dépassements',
      'Analyse écarts BR / Réalisé / FAC',
      'Exports PDF, Word, CSV, Excel',
      'Audit trail complet et immuable',
    ],
    stat: { value: 'FGF', label: 'Forecasting at Completion — détection précoce des dérives' },
  },
  {
    id: 'time',
    name: 'Cheetah Time',
    tagline: 'Jalons tenus. Délais maîtrisés.',
    icon: '⏱',
    color: '#f4a321',
    coming: false,
    description:
      "Planifiez, suivez et ajustez vos calendriers projet avec précision. Visualisez le chemin critique, anticipez les retards et maintenez l'alignement de toutes vos équipes.",
    features: [
      'Planning interactif multi-niveaux',
      'Suivi des jalons et livrables',
      'Analyse des écarts calendaires',
      'Chemin critique et dépendances',
      'Alertes retard automatiques',
      "Rapports d'avancement en 1 clic",
    ],
    stat: { value: '↑', label: 'Jalons suivis en temps réel — alertes retard automatiques' },
  },
  {
    id: 'doc',
    name: 'Cheetah Doc',
    tagline: 'Toute la documentation, un seul endroit.',
    icon: '📁',
    color: '#3f8f48',
    coming: false,
    description:
      "Centralisez, versionnez et partagez tous vos documents en toute sécurité. Fini les classeurs perdus — chaque fichier est traçable, archivé, accessible selon les droits de chaque collaborateur.",
    features: [
      'Gestion documentaire centralisée',
      'Versioning automatique',
      'Partage sécurisé par rôle (RBAC)',
      'Archivage structuré par projet',
      'Recherche full-text',
      'Traçabilité complète des accès',
    ],
    stat: { value: '100%', label: 'de traçabilité documentaire garantie' },
  },
  {
    id: 'report',
    name: 'Cheetah Report',
    tagline: 'Reporting & Business Intelligence',
    icon: '📈',
    color: '#7c3aed',
    coming: true,
    description:
      "Tableaux de bord décisionnels, rapports automatisés et analyses croisées multi-projets. Donnez à votre direction une vue consolidée et actionnable en temps réel.",
    features: [
      'Dashboards décisionnels multi-projets',
      'Rapports automatisés sur mesure',
      'Analyse KPI croisés',
      'Export PowerPoint en 1 clic',
      'Alertes managériales configurables',
      'Visualisations interactives',
    ],
    stat: { value: 'BI', label: 'Business Intelligence intégrée' },
  },
  {
    id: 'risk',
    name: 'Cheetah Risk',
    tagline: 'Gestion des risques & aléas',
    icon: '🛡️',
    color: '#dc2626',
    coming: true,
    description:
      "Identifiez, qualifiez et suivez les risques de vos projets. Anticipez les aléas avec une matrice dynamique, assignez des plans d'action et pilotez la résilience de votre portefeuille.",
    features: [
      'Matrice risques dynamique',
      "Plans d'action et responsables",
      'Scoring probabilité / impact',
      'Alertes risques critiques',
      'Historique et audit des risques',
      'Intégration Cost & Time',
    ],
    stat: { value: 'Risk', label: 'Pilotage proactif des risques projets' },
  },
  {
    id: 'connect',
    name: 'Cheetah Connect',
    tagline: 'Connecteurs & API ouverte',
    icon: '🔗',
    color: '#0891b2',
    coming: true,
    description:
      "Connectez Cheetah à votre écosystème existant — ERP, CRM, outils métier. Une API REST documentée et des connecteurs natifs pour éliminer toute double saisie.",
    features: [
      'API REST documentée (OpenAPI)',
      'Connecteurs ERP (SAP, Sage…)',
      'Webhooks & événements temps réel',
      'Authentification OAuth 2.0',
      'SDK JavaScript & Python',
      'Marketplace connecteurs partenaires',
    ],
    stat: { value: 'API', label: 'Intégration ouverte sans vendor lock-in' },
  },
];

const fgfSteps = [
  { n: '01', icon: '🎯', title: 'Initialisation', desc: "Définition du budget de référence (BR), du périmètre contractuel et des jalons clés." },
  { n: '02', icon: '📋', title: 'Engagements', desc: "Saisie des commandes et contrats. Suivi de l'avancement réel versus planifié." },
  { n: '03', icon: '📈', title: 'Forecast', desc: "Calcul automatique du FAC (Forecast at Completion) et détection précoce des dérives." },
  { n: '04', icon: '🚦', title: 'Pilotage', desc: "Dashboards décisionnels, alertes seuil et rapports de synthèse pour le maître d'ouvrage." },
];

const platformFeats = [
  { icon: '🔐', title: 'Sécurité enterprise', desc: 'MFA, SSO Okta/Auth0, TLS 1.3, AES-256 au repos, Row-Level Security PostgreSQL.' },
  { icon: '🇫🇷', title: 'Hébergement France', desc: 'Serveurs certifiés HDS exclusivement en France. Données jamais hors UE. RGPD natif.' },
  { icon: '📤', title: 'Zéro vendor lock-in', desc: 'Export complet CSV / Excel / JSON de toutes vos données, à tout moment, sans restriction.' },
  { icon: '⚡', title: 'Performance garantie', desc: 'P95 < 200 ms. Architecture multi-tenant isolée. RTO < 4h, RPO < 1h selon SLA.' },
  { icon: '🔄', title: 'Continuité de service', desc: 'Sauvegardes chiffrées toutes les 24h, réplication géographique, PCA documenté.' },
  { icon: '👥', title: 'Contrôle des accès', desc: "RBAC granulaire par projet, journal d'audit immuable, horodaté et exportable." },
];

const pricing = [
  {
    name: 'Essentiel',
    price: '199 €',
    period: '/mois',
    setup: '+ 1 500 € de setup',
    uptime: '99,0%',
    response: '2 j. ouvrés',
    highlight: false,
    desc: '1 module / projets limités. Pour les équipes qui démarrent.',
    features: [
      'Cheetah Cost inclus',
      'Imports Excel / CSV simples',
      'Export CSV / Excel',
      'Backup journalier chiffré',
      'Support email standard',
      'RGPD conforme',
    ],
    cta: 'Nous contacter',
  },
  {
    name: 'Professionnel',
    price: '599 €',
    period: '/mois',
    setup: '+ 4 500 € de setup',
    uptime: '99,5%',
    response: '1 j. ouvré',
    highlight: true,
    desc: 'La suite complète pour les exigeants.',
    features: [
      'Cheetah Cost inclus',
      'Time ou Doc en option',
      'Multi-projets, multi-utilisateurs',
      'Exports multi-formats',
      'MFA obligatoire',
      'Support prioritaire',
      'Audit trail 90 j.',
      'SLA documenté',
    ],
    cta: 'Demander une démo',
  },
  {
    name: 'Entreprise',
    price: 'Sur mesure',
    period: '',
    setup: 'À partir de 10 000 € de setup',
    uptime: '99,9%',
    response: '4 heures',
    highlight: false,
    desc: "Grandes maîtrises d'ouvrage & ETI.",
    features: [
      'Suite complète Cost + Time + Doc',
      'SSO enterprise (Okta / Auth0)',
      'Isolation physique disponible',
      'SLA 99,9% contractuel',
      'Onboarding & formation dédiés',
      'RGPD + DPA inclus',
      'API documentée + connecteurs',
      'Hébergement dédié possible',
    ],
    cta: 'Contacter les ventes',
  },
];

const targets = [
  { icon: '🏢', role: 'Cabinets de pilotage projet', why: 'Besoin immédiat, décision rapide, valeur perçue forte.', priority: 1 },
  { icon: '📐', role: 'Bureaux d\'études / Ingénierie', why: 'Projets complexes où coûts, délais et documents sont critiques.', priority: 1 },
  { icon: '🏗️', role: 'AMO / MOE', why: 'Reporting client récurrent, suivi d\'avancement, bilans réguliers.', priority: 1 },
  { icon: '🏭', role: 'PME industrielles', why: 'Besoin de structuration sans les coûts et rigidités d\'un ERP.', priority: 2 },
  { icon: '🔨', role: 'Construction & Travaux', why: 'Coûts, planning et documents au cœur du métier — terrain peu adressé.', priority: 2 },
  { icon: '🏛️', role: 'Collectivités / Structures publiques', why: 'Traçabilité, reporting, conformité réglementaire — tickets élevés en contrat cadre.', priority: 2 },
];

const competitors = [
  { name: 'Excel / Fichiers maison', strength: 'Flexible, connu, déjà en place', weakness: 'Fragile, non traçable, impossible à consolider à échelle', verdict: 'bad' },
  { name: 'ERP (SAP, Oracle…)', strength: 'Robuste et structurant', weakness: 'Cher, rigide, déploiement 12 à 24 mois', verdict: 'bad' },
  { name: 'Asana / Monday / Notion', strength: 'Simples et collaboratifs', weakness: 'Trop superficiels pour le pilotage coût/document métier', verdict: 'bad' },
  { name: 'MS Project', strength: 'Planning robuste', weakness: 'Déconnecté des coûts et des documents', verdict: 'bad' },
  { name: 'Planisware / Sciforma', strength: 'Puissants, complets', weakness: 'Surdimensionnés PME, cycle de vente très long', verdict: 'bad' },
  { name: 'Cheetah', strength: 'Spécialisé, léger, opérationnel', weakness: 'Compromis intelligent entre souplesse et maîtrise du risque', verdict: 'good' },
];

const processSteps = [
  {
    n: '01', icon: '🔍', title: 'Diagnostic', sub: 'Gratuit · 30 min', color: '#56a45b',
    desc: 'On analyse comment vous pilotez aujourd\'hui — fichiers, processus, risques. On chiffre le temps perdu et les zones de dérive.',
  },
  {
    n: '02', icon: '🎯', title: 'Démo personnalisée', sub: 'Sur vos données réelles', color: '#f4a321',
    desc: 'La démo utilise un cas concret issu de votre activité. Vous voyez Cheetah résoudre un problème réel — pas une présentation générique.',
  },
  {
    n: '03', icon: '🚀', title: 'Setup & Déploiement', sub: 'Accompagnement inclus', color: '#3f8f48',
    desc: 'Configuration, reprise des données, formation, validation des premiers cas d\'usage. Vous êtes opérationnel, pas juste abonné.',
  },
];

const additionalServices = [
  { label: 'Formation utilisateurs', price: '800 – 1 500 €/session' },
  { label: 'Migration fichiers Excel', price: '1 000 – 5 000 €' },
  { label: "Modèle d'import spécifique", price: '800 – 3 000 €' },
  { label: 'Export personnalisé', price: '800 – 2 500 €' },
  { label: 'Modèle documentaire métier', price: '1 000 – 5 000 €' },
  { label: 'Connecteur externe / API', price: '3 000 – 15 000 €' },
];

/* ── Component ───────────────────────────────────────────────────────── */
export default function Home() {
  const [activeModule, setActiveModule] = useState(0);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);
  const gridY = useTransform(scrollY, [0, 700], [0, 60]);

  return (
    <main className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          1. HERO — dark forest green, perspective grid, parallax
         ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center speed-bg overflow-hidden">

        {/* Perspective grid floor */}
        <motion.div
          style={{ y: gridY }}
          className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
        >
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(86,164,91,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(86,164,91,0.10) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            transform: 'perspective(600px) rotateX(38deg) scale(1.8)',
            transformOrigin: '50% 0%',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 40%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 40%, black 100%)',
          }} />
        </motion.div>

        {/* Aurora blobs */}
        <div className="absolute top-0 left-0 w-[700px] h-[500px] pointer-events-none animate-aurora-1"
          style={{ background: 'radial-gradient(ellipse at 40% 40%, rgba(86,164,91,0.22) 0%, rgba(86,164,91,0.06) 50%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[450px] pointer-events-none animate-aurora-2"
          style={{ background: 'radial-gradient(ellipse at 60% 60%, rgba(244,163,33,0.16) 0%, rgba(244,163,33,0.04) 50%, transparent 70%)' }} />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 4 + i * 2,
              height: 4 + i * 2,
              left: `${10 + i * 16}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: i % 2 === 0 ? 'rgba(86,164,91,0.5)' : 'rgba(244,163,33,0.4)',
              filter: 'blur(1px)',
            }}
            animate={{ y: [0, -24, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
          />
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">

            <motion.div variants={fadeUp} custom={0} className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-7">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-cheetah-green/40 shadow-xl shadow-cheetah-green/20 bg-white">
                <Image src="/logo-cheetahsoft.jpg" alt="CheetahSoft" width={64} height={64} className="w-full h-full object-cover" priority />
              </div>
              <span className="inline-flex items-center gap-2 bg-cheetah-green/15 border border-cheetah-green/30 text-cheetah-green text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest self-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cheetah-green animate-glow-pulse" />
                SaaS B2B · Pilotage de Projets · 🇫🇷
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-white leading-[1.04] mb-6 tracking-tight">
              Pilotez vos projets.<br />
              <span className="gradient-text-bright">Sans jamais dériver.</span>
            </motion.h1>

            <motion.div variants={fadeUp} custom={2}>
              <div className="brand-sep w-16 mb-6 mx-auto lg:mx-0" />
            </motion.div>

            <motion.div variants={fadeUp} custom={2.5}
              className="mb-6 inline-flex flex-col sm:flex-row gap-3 text-sm font-semibold mx-auto lg:mx-0 justify-center lg:justify-start">
              {[
                { label: 'Plus structuré qu\'Excel', icon: '📊' },
                { label: 'Plus léger qu\'un ERP', icon: '⚡' },
                { label: 'Plus métier qu\'un outil généraliste', icon: '🎯' },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-white/55">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              ))}
            </motion.div>

            <motion.p variants={fadeUp} custom={3}
              className="text-white/65 text-lg md:text-xl leading-relaxed max-w-xl mb-10 mx-auto lg:mx-0">
              Cheetah transforme les fichiers, plannings et rapports dispersés en un système de pilotage projet fiable, clair et traçable — pour toutes les équipes qui gèrent des projets complexes.
            </motion.p>

            <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#contact"
                className="relative bg-cheetah-green hover:bg-cheetah-green-mid text-white font-black px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-105 glow-green-strong overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  Demander une démo gratuite
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
              <a href="#modules"
                className="border border-white/20 hover:border-cheetah-green/60 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:bg-cheetah-green/8">
                Voir les 6 modules →
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={5} className="mt-10 flex flex-wrap items-center gap-5 justify-center lg:justify-start text-white/40 text-xs font-medium">
              {['FGF natif', '100% hébergé France', 'Export libre', 'RGPD/CNIL'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-cheetah-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -left-8 z-20 glass-dark rounded-2xl px-4 py-3 shadow-2xl border border-cheetah-green/20">
                <div className="text-white/50 text-xs mb-0.5 font-mono">FAC Total</div>
                <div className="text-white font-black text-xl tracking-tight">12,4 M€</div>
                <div className="text-cheetah-green text-xs font-bold mt-0.5 flex items-center gap-1">
                  <span>▼</span> −2,3% vs BR
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 11, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="absolute -bottom-4 -right-6 z-20 glass-dark rounded-2xl px-4 py-3 shadow-2xl border border-cheetah-orange/20">
                <div className="text-white/50 text-xs mb-0.5 font-mono">Jalons</div>
                <div className="text-white font-black text-xl tracking-tight">18 / 21</div>
                <div className="text-cheetah-orange text-xs font-bold mt-0.5">● 3 en cours</div>
              </motion.div>

              <div className="glass-dark rounded-3xl p-6 shadow-2xl border border-cheetah-green/15">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-cheetah-green/70" />
                  <div className="ml-3 flex-1 bg-white/8 rounded px-3 py-1 text-white/30 text-xs font-mono">
                    app.cheetah.fr / dashboard
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-white font-bold text-sm">Projet INFRA-2026 — Phase 3</div>
                    <div className="text-white/35 text-xs font-mono mt-0.5">Cheetah Cost · Vue budget</div>
                  </div>
                  <span className="status-ok text-xs font-bold px-2.5 py-1 rounded-full">En cours</span>
                </div>

                <div className="space-y-3.5 mb-5">
                  {[
                    { label: 'Lot 1 — Études & Conception', pct: 87, color: '#56a45b' },
                    { label: 'Lot 2 — Réalisation', pct: 63, color: '#f4a321' },
                    { label: 'Lot 3 — Équipements', pct: 91, color: '#56a45b' },
                    { label: 'Lot 4 — Coordination', pct: 44, color: '#3f8f48' },
                  ].map((b, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/55">{b.label}</span>
                        <span className="text-white/75 font-mono font-semibold">{b.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${b.pct}%` }}
                          transition={{ duration: 1.1, delay: 0.7 + i * 0.12, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: b.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'BR Initial', val: '12,7 M€', color: 'text-white/60' },
                    { label: 'Engagé', val: '9,8 M€', color: 'text-cheetah-orange' },
                    { label: 'FAC', val: '12,4 M€', color: 'text-cheetah-green' },
                  ].map((k) => (
                    <div key={k.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-white/35 text-[10px] font-mono uppercase tracking-wider mb-1">{k.label}</div>
                      <div className={`font-black text-base ${k.color}`}>{k.val}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/8 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cheetah-green animate-glow-pulse" />
                    <span className="text-white/40 text-xs font-mono">Écart BR/FAC</span>
                  </div>
                  <span className="text-cheetah-green text-xs font-bold font-mono">−2,3% · Dans la norme FGF</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 90L1440 90L1440 35C1200 80 960 12 720 45C480 78 240 10 0 55L0 90Z" fill="#F5F1E8" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. STATS — warm cream with aurora + animated counters
         ══════════════════════════════════════════════════════════ */}
      <section className="aurora-bg py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: 6, suffix: '', label: 'modules pour un pilotage complet', color: 'text-cheetah-green-deep', isNum: true },
              { val: 3, suffix: '', label: 'modules disponibles aujourd\'hui', color: 'text-cheetah-green', isNum: true },
              { val: 100, suffix: '%', label: 'hébergement & RGPD France', color: 'text-cheetah-orange', isNum: true },
              { val: 0, suffix: '', label: 'FGF — méthode de forecasting native', color: 'text-cheetah-green-deep', isNum: false, raw: 'FGF' },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="aurora-card rounded-2xl p-6 text-center"
              >
                <div className={`text-4xl font-black mb-1.5 ${s.color}`}>
                  {s.isNum ? <AnimatedCounter end={s.val} suffix={s.suffix} /> : s.raw}
                </div>
                <div className="text-gray-500 text-sm font-medium">{s.label}</div>
                <div className="brand-sep w-8 mx-auto mt-3" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. PROBLEM — cream, 3 pain point cards
         ══════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 aurora-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-3">Le constat terrain</motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl font-black text-cheetah-green-dark leading-tight mb-5">
              Les projets complexes dérapent.<br />
              <span className="gradient-text">Cheetah stoppe la dérive.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg max-w-2xl mx-auto">
              La majorité des équipes pilotent encore avec des classeurs dispersés, des données obsolètes et des alertes qui arrivent trop tard.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                icon: '📉', stat: '60%',
                label: 'des projets dépassent leur budget initial',
                detail: "Sans forecasting structuré, les dépassements ne sont détectés qu'une fois consommés.",
                color: '#56a45b',
              },
              {
                icon: '📮', stat: '1/5',
                label: 'classeurs Excel contiennent des erreurs critiques',
                detail: 'La gestion manuelle multiplie les risques de données incohérentes entre équipes.',
                color: '#f4a321',
              },
              {
                icon: '🗂️', stat: '4h/sem',
                label: "perdues à consolider des rapports d'avancement",
                detail: "Les chefs de projet agrègent des données plutôt que de piloter.",
                color: '#3f8f48',
              },
            ].map((item, i) => (
              <TiltCard key={i} className="aurora-card rounded-2xl p-8">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <div style={{ width: 3, height: 48, background: item.color, borderRadius: 3 }} className="mb-5" />
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-4xl font-black mb-2" style={{ color: item.color }}>{item.stat}</div>
                  <div className="text-cheetah-green-dark font-bold text-base mb-3 leading-snug">{item.label}</div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. POSITIONING — dark forest, vs competitors table
         ══════════════════════════════════════════════════════════ */}
      <section className="speed-bg py-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(86,164,91,0.14) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(244,163,33,0.10) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-3">Positionnement</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white mb-5">
              L&apos;espace que personne<br />
              <span className="gradient-text-bright">n&apos;occupait encore.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg max-w-2xl mx-auto">
              Aucun concurrent ne couvre simultanément coûts + planning + documents avec la légèreté et l&apos;accessibilité d&apos;un SaaS vertical abordable.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="glass-dark rounded-3xl overflow-hidden border border-white/8"
          >
            <div className="grid grid-cols-3 gap-0 border-b border-white/8 bg-white/4">
              <div className="px-6 py-4 text-white/40 text-xs font-bold uppercase tracking-widest">Solution</div>
              <div className="px-6 py-4 text-white/40 text-xs font-bold uppercase tracking-widest border-l border-white/6">Point fort</div>
              <div className="px-6 py-4 text-white/40 text-xs font-bold uppercase tracking-widest border-l border-white/6">Limite / différence</div>
            </div>

            {competitors.map((comp, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`grid grid-cols-3 gap-0 border-b border-white/5 last:border-0 transition-colors duration-200 ${
                  comp.verdict === 'good' ? 'bg-cheetah-green/10 border-cheetah-green/20' : 'hover:bg-white/2'
                }`}
              >
                <div className="px-6 py-4 flex items-center gap-3">
                  {comp.verdict === 'good' ? (
                    <div className="w-6 h-6 rounded-full bg-cheetah-green flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-0.5 bg-white/30 rounded-full" />
                    </div>
                  )}
                  <span className={`text-sm font-bold ${comp.verdict === 'good' ? 'text-cheetah-green' : 'text-white/70'}`}>
                    {comp.name}
                  </span>
                </div>
                <div className="px-6 py-4 border-l border-white/6">
                  <span className="text-white/50 text-sm">{comp.strength}</span>
                </div>
                <div className="px-6 py-4 border-l border-white/6">
                  <span className={`text-sm ${comp.verdict === 'good' ? 'text-cheetah-green/80 font-medium' : 'text-white/35'}`}>
                    {comp.weakness}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.55 }}
            className="mt-8 glass-dark rounded-2xl p-6 border border-cheetah-orange/20 flex flex-col md:flex-row items-start md:items-center gap-4"
          >
            <span className="text-3xl">💡</span>
            <p className="text-white/60 text-sm leading-relaxed">
              <span className="text-white font-bold">La valeur Cheetah ne tient pas à une fonctionnalité isolée.</span>{' '}
              C&apos;est l&apos;assemblage indissociable — logique métier éprouvée, données structurées, planning synchronisé aux coûts, traçabilité des décisions et UX terrain — qui constitue l&apos;avantage compétitif réel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. TARGETS — who is Cheetah for?
         ══════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 aurora-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-3">Pour qui ?</motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl font-black text-cheetah-green-dark mb-5">
              Cheetah est fait pour vous<br />
              <span className="gradient-text">si vous pilotez des projets complexes.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg max-w-2xl mx-auto">
              Le meilleur client Cheetah réunit quatre caractéristiques : plusieurs projets à suivre, des budgets à maîtriser, des documents à produire, et une dépendance forte à Excel.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {targets.map((target, i) => (
              <TiltCard key={i} className="aurora-card rounded-2xl p-7 group">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.55 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl shrink-0 group-hover:scale-110 transition-transform duration-200">{target.icon}</div>
                    <div>
                      {target.priority === 1 && (
                        <span className="inline-block text-[10px] font-black bg-cheetah-green/15 text-cheetah-green px-2.5 py-1 rounded-full uppercase tracking-widest mb-2">
                          Cible prioritaire
                        </span>
                      )}
                      <h3 className="text-cheetah-green-dark font-black text-base mb-2 leading-snug">{target.role}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{target.why}</p>
                    </div>
                  </div>
                  <div className="brand-sep w-8 mt-5" />
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. MODULES — 6-card grid: 3 actifs + 3 à venir
         ══════════════════════════════════════════════════════════ */}
      <section id="modules" className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-3">6 modules intégrés</motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl font-black text-cheetah-green-dark">
              Une suite complète,<br />pensée pour le terrain.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-base mt-4 max-w-2xl mx-auto">
              3 modules disponibles aujourd&apos;hui, 3 en cours de développement. Une architecture commercialement forte et immédiatement mémorable.
            </motion.p>
          </motion.div>

          {/* 6-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {modules.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                {m.coming ? (
                  /* Coming-soon card */
                  <div className="relative rounded-2xl p-7 h-full border border-dashed border-gray-200 bg-gray-50/60 overflow-hidden group">
                    {/* Frosted overlay */}
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 z-10 group-hover:bg-white/20 transition-all duration-500" />
                    <div className="relative z-20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                            style={{ background: `${m.color}15` }}>
                            {m.icon}
                          </div>
                          <div>
                            <div className="font-black text-gray-400 text-base">{m.name}</div>
                            <div className="text-xs text-gray-400 font-medium">{m.tagline}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{ background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}30` }}>
                          À venir
                        </span>
                      </div>
                      <div className="space-y-1.5 filter blur-[2px] select-none">
                        {m.features.slice(0, 4).map((f, j) => (
                          <div key={j} className="flex items-center gap-2 text-gray-400 text-xs">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `${m.color}30` }} />
                            {f}
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-gray-400 text-xs font-semibold">En développement — bientôt disponible</span>
                      </div>
                    </div>
                    {/* Color accent line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${m.color}60, transparent)` }} />
                  </div>
                ) : (
                  /* Active module card */
                  <TiltCard
                    className={`relative rounded-2xl p-7 h-full cursor-pointer transition-all duration-300 overflow-hidden ${
                      activeModule === i
                        ? 'border-2 shadow-xl'
                        : 'border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg'
                    }`}
                    style={activeModule === i ? {
                      borderColor: m.color,
                      boxShadow: `0 8px 40px ${m.color}25, 0 0 0 1px ${m.color}20`,
                    } as React.CSSProperties : {}}
                    intensity={6}
                  >
                    <div
                      onClick={() => setActiveModule(i)}
                      className="h-full"
                      style={activeModule === i ? {} : { background: 'white' }}
                    >
                      {/* Active indicator */}
                      {activeModule === i && (
                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                          style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}80)` }} />
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300"
                            style={{ background: `${m.color}15` }}>
                            {m.icon}
                          </div>
                          <div>
                            <div className="font-black text-cheetah-green-dark text-base">{m.name}</div>
                            <div className="text-xs font-medium" style={{ color: m.color }}>{m.tagline}</div>
                          </div>
                        </div>
                        {activeModule === i && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: m.color }}
                          >
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {m.features.slice(0, 3).map((f, j) => (
                          <div key={j} className="flex items-center gap-2 text-gray-600 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                )}
              </motion.div>
            ))}
          </div>

          {/* Module detail panel — active module expanded */}
          <AnimatePresence mode="wait">
            <motion.div key={activeModule}
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center rounded-3xl p-8 md:p-12 border"
              style={{
                background: `linear-gradient(135deg, ${modules[activeModule].color}06 0%, white 60%)`,
                borderColor: `${modules[activeModule].color}20`,
              }}
            >
              {/* Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{modules[activeModule].icon}</span>
                  <div>
                    <h3 className="text-3xl font-black text-cheetah-green-dark">{modules[activeModule].name}</h3>
                    <p className="font-semibold" style={{ color: modules[activeModule].color }}>{modules[activeModule].tagline}</p>
                  </div>
                </div>
                <div className="brand-sep w-12 mb-5" />
                <p className="text-gray-600 leading-relaxed mb-7">{modules[activeModule].description}</p>

                <ul className="space-y-2.5 mb-8">
                  {modules[activeModule].features.map((feat, j) => (
                    <motion.li key={j}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.06 }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"
                        style={{ color: modules[activeModule].color }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-sm">{feat}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="inline-flex items-center gap-4 rounded-2xl px-6 py-4 text-white"
                  style={{ background: modules[activeModule].color }}>
                  <div className="text-3xl font-black animate-count-pop">{modules[activeModule].stat.value}</div>
                  <div className="text-sm text-white/75 leading-snug max-w-[200px]">{modules[activeModule].stat.label}</div>
                </div>
              </div>

              {/* App screenshot mockup */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border"
                  style={{ background: '#1a1a1a', borderColor: `${modules[activeModule].color}30` }}>
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8" style={{ background: '#242424' }}>
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full" style={{ background: `${modules[activeModule].color}cc` }} />
                    <div className="flex-1 mx-3 bg-white/8 rounded-md px-3 py-1 text-white/35 text-xs font-mono flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: `${modules[activeModule].color}80` }} />
                      {activeModule === 0 && 'app.cheetah.fr — Cheetah Cost'}
                      {activeModule === 1 && 'app.cheetah.fr — Cheetah Time'}
                      {activeModule === 2 && 'app.cheetah.fr — Cheetah Doc'}
                    </div>
                  </div>

                  {activeModule === 0 && (
                    <motion.div key="cost-shot"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45 }}
                    >
                      <Image
                        src="/screenshot-cost.png"
                        alt="Interface Cheetah Cost"
                        width={1920} height={330}
                        className="w-full object-cover object-top"
                        style={{ maxHeight: 380 }}
                      />
                      <div className="absolute bottom-4 right-4 glass-dark rounded-xl px-4 py-3 border border-cheetah-green/25 shadow-xl pointer-events-none">
                        <div className="text-white/50 text-[10px] font-mono uppercase tracking-wider mb-0.5">Écart BR / FAC</div>
                        <div className="text-cheetah-green font-black text-lg">−3 kEUR</div>
                        <div className="text-cheetah-green/70 text-xs">Dans la norme FGF</div>
                      </div>
                    </motion.div>
                  )}

                  {activeModule === 1 && (
                    <motion.div key="time-shot"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45 }}
                    >
                      <Image
                        src="/screenshot-time.png"
                        alt="Interface Cheetah Time"
                        width={1920} height={860}
                        className="w-full object-cover object-top"
                        style={{ maxHeight: 420 }}
                      />
                      <div className="absolute bottom-4 right-4 glass-dark rounded-xl px-4 py-3 border border-cheetah-orange/25 shadow-xl pointer-events-none">
                        <div className="text-white/50 text-[10px] font-mono uppercase tracking-wider mb-0.5">Jalons tenus</div>
                        <div className="text-cheetah-orange font-black text-lg">18 / 21</div>
                        <div className="text-cheetah-orange/70 text-xs">Suivi temps réel</div>
                      </div>
                    </motion.div>
                  )}

                  {activeModule === 2 && (
                    <motion.div key="doc-mock"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45 }}
                      className="p-6 min-h-[360px] flex flex-col gap-3"
                      style={{ background: '#F5F1E8' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cheetah-green-dark font-black text-sm">Documents — Projet A47</span>
                        <span className="status-ok text-xs px-2 py-1 rounded-full font-bold">247 fichiers</span>
                      </div>
                      {[
                        { n: 'DCE_Lot1_v3.2.pdf', t: 'PDF', d: '14/05/2026', sz: '2,4 Mo', status: 'ok' },
                        { n: 'Plans_Coffrage_R2.dwg', t: 'DWG', d: '10/05/2026', sz: '8,1 Mo', status: 'ok' },
                        { n: 'Rapport_avancement_S19.docx', t: 'DOC', d: '08/05/2026', sz: '1,2 Mo', status: 'ok' },
                        { n: 'Budget_BR_initial.xlsx', t: 'XLS', d: '01/04/2026', sz: '0,6 Mo', status: 'ok' },
                        { n: 'CR_reunion_MOE_S20.pdf', t: 'PDF', d: '15/05/2026', sz: '0,3 Mo', status: 'watch' },
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black ${doc.t === 'PDF' ? 'bg-red-100 text-red-600' : doc.t === 'XLS' ? 'bg-green-100 text-green-700' : doc.t === 'DWG' ? 'bg-blue-100 text-blue-700' : 'bg-blue-100 text-blue-600'}`}>
                            {doc.t}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-800 text-xs font-semibold truncate">{doc.n}</div>
                            <div className="text-gray-400 text-[10px] font-mono">{doc.d} · {doc.sz}</div>
                          </div>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${doc.status === 'ok' ? 'bg-cheetah-green' : 'bg-cheetah-orange'}`} />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. FGF METHODOLOGY — dark forest green + speed lines
         ══════════════════════════════════════════════════════════ */}
      <section id="methode" className="speed-bg py-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(86,164,91,0.15) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-3">Méthodologie</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white mb-5">
              La méthode FGF au cœur<br />
              <span className="gradient-text-bright">de Cheetah Cost</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg max-w-2xl mx-auto">
              Le Forecasting at Completion est la norme française de référence pour le contrôle de coûts des grands projets. Cheetah l&apos;implémente nativement.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {fgfSteps.map((step, i) => (
              <TiltCard key={i} intensity={8}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.55 }}
                  className="relative glass-dark rounded-2xl p-6"
                >
                  {i < fgfSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 text-cheetah-green/40 text-2xl z-10 -translate-y-1/2">›</div>
                  )}
                  <div className="text-cheetah-green/25 font-black text-5xl mb-4 font-mono">{step.n}</div>
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <div className="brand-sep w-8 mb-3" />
                  <h3 className="text-white font-black text-xl mb-2">{step.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.55 }}
            className="mt-10 glass-dark rounded-2xl p-6 md:p-8 border border-cheetah-orange/20"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="text-4xl shrink-0">💡</div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">Pourquoi le FGF plutôt qu&apos;un simple suivi budgétaire ?</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Le FGF projette le coût final probable dès les premières phases, en intégrant les tendances d&apos;engagements, les aléas résiduels et les économies potentielles.
                  C&apos;est la seule méthode qui permet de prendre des décisions correctrices <em className="text-cheetah-orange not-italic font-semibold">avant</em> que le dépassement soit consommé.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. PLATFORM FEATURES — warm cream, tilt cards
         ══════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 aurora-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-3">Plateforme</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-cheetah-green-dark">
              Conçu pour les exigences<br />des projets complexes.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeats.map((feat, i) => (
              <TiltCard key={i} className="aurora-card rounded-2xl p-7">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.55 }}
                >
                  <div className="text-4xl mb-4">{feat.icon}</div>
                  <div className="brand-sep w-8 mb-4" />
                  <h3 className="text-cheetah-green-dark font-black text-lg mb-2">{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9. SECURITY — deep dark green
         ══════════════════════════════════════════════════════════ */}
      <section id="securite" className="speed-bg py-28 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 70%, rgba(244,163,33,0.10) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="label-tag mb-4">Sécurité & Conformité</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Vos données de projets<br />
              <span className="gradient-text-bright">méritent une protection maximale.</span>
            </h2>
            <p className="text-white/55 leading-relaxed mb-8">
              Cheetah est conçu avec la sécurité by design. Chaque couche implémente les standards enterprise : chiffrement, isolation, traçabilité, conformité réglementaire.
            </p>

            <div className="space-y-3.5">
              {[
                { label: 'Authentification', val: 'MFA obligatoire + SSO Okta/Auth0' },
                { label: 'Chiffrement transit', val: 'TLS 1.3 exclusivement' },
                { label: 'Chiffrement repos', val: 'AES-256 au niveau base de données' },
                { label: 'Isolation données', val: 'Row-Level Security PostgreSQL' },
                { label: 'Notification CNIL', val: 'Incident notifié en < 72h' },
                { label: "Journal d'audit", val: 'Immuable, horodaté, exportable' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 border-b border-white/6 pb-3.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cheetah-green flex-shrink-0" />
                  <div className="flex justify-between w-full">
                    <span className="text-white/40 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-semibold">{item.val}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { tier: 'T1', title: 'Données publiques', border: 'border-cheetah-green/30 bg-cheetah-green/8', badge: 'text-cheetah-green', desc: 'Documentation non sensible, accessible sans restriction.' },
              { tier: 'T2', title: 'Données internes', border: 'border-blue-400/25 bg-blue-500/8', badge: 'text-blue-300', desc: 'Rapports, plannings. Accès équipe projet authentifiée.' },
              { tier: 'T3', title: 'Données confidentielles', border: 'border-cheetah-orange/30 bg-cheetah-orange/8', badge: 'text-cheetah-orange', desc: 'Données financières, budgets. Accès RBAC strict.' },
              { tier: 'T4', title: 'Données critiques', border: 'border-red-500/30 bg-red-500/8', badge: 'text-red-400', desc: "Clés de chiffrement, credentials. Isolation physique dispo." },
            ].map((t, i) => (
              <TiltCard key={i} intensity={7}>
                <div className={`rounded-2xl border p-5 ${t.border}`}>
                  <div className={`text-3xl font-black mb-2 font-mono ${t.badge}`}>{t.tier}</div>
                  <div className="text-white font-bold text-sm mb-2">{t.title}</div>
                  <p className="text-white/35 text-xs leading-relaxed">{t.desc}</p>
                </div>
              </TiltCard>
            ))}

            <div className="col-span-2 glass-dark rounded-2xl p-5 border border-cheetah-green/15">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🛡️</span>
                <span className="text-white font-bold">Conformité réglementaire</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['RGPD/CNIL', 'HDS France', 'TLS 1.3', 'AES-256', 'Données 🇫🇷'].map((tag) => (
                  <span key={tag} className="bg-cheetah-green/12 text-cheetah-green text-xs px-3 py-1.5 rounded-full font-semibold border border-cheetah-green/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          10. PROCESS — how it works in 3 steps
         ══════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 aurora-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-3">Comment ça marche</motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl font-black text-cheetah-green-dark mb-5">
              Opérationnel en 3 étapes.<br />
              <span className="gradient-text">Pas juste abonné.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg max-w-2xl mx-auto">
              Le setup est une condition de succès, pas une option. Il couvre le paramétrage, la reprise des données, la formation et la validation des premiers cas d&apos;usage opérationnel.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative"
              >
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%_-_16px)] w-8 h-px z-10"
                    style={{ background: `linear-gradient(to right, ${step.color}60, ${processSteps[i+1].color}60)` }} />
                )}
                <TiltCard className="aurora-card rounded-2xl p-8 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm font-mono"
                      style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}>
                      {step.n}
                    </div>
                    <div>
                      <div className="text-cheetah-green-dark font-black text-lg leading-none">{step.title}</div>
                      <div className="text-xs font-semibold mt-0.5" style={{ color: step.color }}>{step.sub}</div>
                    </div>
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="brand-sep w-8 mb-4" />
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.55 }}
            className="mt-10 aurora-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="flex-1">
              <h3 className="text-cheetah-green-dark font-black text-xl mb-2">Commencez par un diagnostic gratuit</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Montrez-nous comment vous pilotez aujourd&apos;hui — on vous montre où vous perdez du temps et où vous prenez du risque. 30 minutes, sans engagement.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="#contact"
                className="bg-cheetah-green-dark hover:bg-cheetah-green-deep text-white font-black px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:scale-105 text-center whitespace-nowrap">
                Lancer le diagnostic →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          11. PRICING — dark, 3 tiers with tilt cards
         ══════════════════════════════════════════════════════════ */}
      <section id="tarifs" className="speed-bg py-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(86,164,91,0.14) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 70%, rgba(244,163,33,0.10) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-3">Tarifs & SLA</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white mb-4">
              Des engagements contractuels clairs.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg max-w-xl mx-auto">
              Chaque offre inclut un SLA documenté, des niveaux de support définis et des engagements de disponibilité garantis.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-14">
            {pricing.map((tier, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13, duration: 0.6 }}
              >
                <TiltCard
                  intensity={tier.highlight ? 5 : 8}
                  className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 h-full ${
                    tier.highlight
                      ? 'bg-cheetah-green-darkest border-2 border-cheetah-green/40 text-white shadow-2xl scale-105 glow-green-strong'
                      : 'glass-dark border border-white/10'
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cheetah-green text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg tracking-wide">
                      LE PLUS POPULAIRE
                    </div>
                  )}

                  <div className={`text-xs font-black uppercase tracking-widest mb-3 ${tier.highlight ? 'text-cheetah-green' : 'text-cheetah-green/60'}`}>
                    {tier.name}
                  </div>

                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black leading-none text-white">{tier.price}</span>
                    {tier.period && (
                      <span className="text-white/40 text-sm mb-1">{tier.period}</span>
                    )}
                  </div>
                  <div className={`text-xs font-semibold mb-2 ${tier.highlight ? 'text-cheetah-orange/80' : 'text-white/35'}`}>
                    {tier.setup}
                  </div>

                  <p className={`text-sm mb-5 ${tier.highlight ? 'text-white/55' : 'text-white/40'}`}>{tier.desc}</p>
                  <div className="brand-sep w-full mb-5" />

                  <div className="flex gap-2 flex-wrap mb-5">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${tier.highlight ? 'bg-cheetah-green/20 text-cheetah-green' : 'bg-white/8 text-white/50'}`}>
                      ✓ {tier.uptime} uptime
                    </span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${tier.highlight ? 'bg-white/10 text-white/70' : 'bg-white/8 text-white/40'}`}>
                      ⚡ {tier.response}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.features.map((feat, j) => (
                      <li key={j} className={`flex items-start gap-2.5 text-sm ${tier.highlight ? 'text-white/75' : 'text-white/45'}`}>
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-cheetah-green" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <a href="#contact"
                    className={`block text-center font-black py-3.5 rounded-xl transition-all duration-200 hover:scale-105 text-sm ${
                      tier.highlight
                        ? 'bg-cheetah-green hover:bg-cheetah-green-mid text-white glow-green'
                        : 'border border-cheetah-green/30 text-cheetah-green hover:bg-cheetah-green hover:text-white'
                    }`}
                  >
                    {tier.cta}
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-dark rounded-3xl p-8 border border-white/8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🔧</span>
              <div>
                <h3 className="text-white font-black text-lg">Prestations additionnelles</h3>
                <p className="text-white/40 text-sm">Facturées séparément selon votre contexte</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {additionalServices.map((svc, i) => (
                <div key={i} className="flex items-center justify-between bg-white/4 rounded-xl px-4 py-3 border border-white/6">
                  <span className="text-white/60 text-sm">{svc.label}</span>
                  <span className="text-cheetah-green text-xs font-bold font-mono whitespace-nowrap ml-3">{svc.price}</span>
                </div>
              ))}
            </div>
            <p className="text-white/25 text-xs mt-4">
              * Journée consultant / développeur : 700 – 1 000 € /jour. Tout sur-mesure est pricé — aucun développement gratuit inclus dans l&apos;abonnement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          12. CTA — bold green gradient
         ══════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative overflow-hidden py-28 px-6"
        style={{ background: 'linear-gradient(135deg, #1a4a20 0%, #0e2714 50%, #0d1f10 100%)' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'repeating-linear-gradient(-62deg, transparent, transparent 18px, rgba(86,164,91,0.035) 18px, rgba(86,164,91,0.035) 20px)' }} />

        <div className="absolute top-1/4 -left-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(86,164,91,0.20) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 -right-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(244,163,33,0.16) 0%, transparent 70%)' }} />

        {/* Floating orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 80 + i * 40,
              height: 80 + i * 40,
              left: `${15 + i * 22}%`,
              top: `${20 + (i % 2) * 40}%`,
              background: i % 2 === 0 ? 'rgba(86,164,91,0.06)' : 'rgba(244,163,33,0.05)',
              border: '1px solid rgba(86,164,91,0.12)',
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 1.2 }}
          />
        ))}

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} custom={0} className="label-tag mb-5">Passez à l&apos;action</motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              Prêts à maîtriser<br />
              <span className="shimmer-text">vos projets ?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/60 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les équipes projet qui pilotent avec Cheetah. Diagnostic gratuit, démo personnalisée, sans engagement, en 30 minutes.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@cheetah.fr"
                className="bg-cheetah-green hover:bg-cheetah-green-mid text-white font-black px-10 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-105 glow-green-strong">
                Demander une démo gratuite
              </a>
              <a href="mailto:contact@cheetah.fr"
                className="border-2 border-white/25 hover:border-cheetah-green text-white font-bold px-10 py-4 rounded-xl text-lg transition-all duration-200 hover:bg-cheetah-green/10">
                Nous contacter
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={4}
              className="mt-12 flex flex-wrap justify-center gap-8 text-white/40 text-sm font-medium">
              {['Diagnostic en 30 min', 'Sans engagement', 'Données hébergées en France', 'Support francophone'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-cheetah-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
