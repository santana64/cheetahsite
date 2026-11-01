import { ReactNode } from 'react';
import { Breadcrumb } from '@/components/ui';

export function LegalLayout({
  titre,
  fil,
  intro,
  children,
}: {
  titre: string;
  fil: { label: string; href?: string }[];
  intro: string;
  children: ReactNode;
}) {
  return (
    <article className="bg-ink-900 pb-24 pt-32 md:pt-40">
      <div className="shell max-w-3xl">
        <Breadcrumb items={fil} />
        <h1 className="display-lg mt-8 text-paper">{titre}</h1>
        <p className="lede mt-6">{intro}</p>
        <div className="mt-14 space-y-12 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-paper [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-steel-300 [&_p]:mt-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-steel-300 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </article>
  );
}

export function ANotifier({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-2 border-amber bg-amber/[0.06] p-5">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-amber">
        Information à fournir par l’éditeur avant mise en ligne
      </p>
      <p className="!mt-2 !text-sm !leading-relaxed !text-steel-200">{children}</p>
    </div>
  );
}

export default LegalLayout;
