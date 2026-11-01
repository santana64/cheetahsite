import type { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import { MODULE_PAR_SLUG } from '@/content/cheetah';

export const metadata: Metadata = {
  title: 'Cheetah Doc — livrables, versions et traçabilité',
  description:
    'Centralisation des livrables de projet, versioning, droits par rôle et traçabilité des accès. La couche qui rattache une décision à la pièce qui la justifie.',
};

export default function Page() {
  return <ProductPage module={MODULE_PAR_SLUG.doc} />;
}
