import type { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import { MODULE_PAR_SLUG } from '@/content/cheetah';

export const metadata: Metadata = {
  title: 'Cheetah Time — planification et chemin critique',
  description:
    'Structure WBS, dépendances FS/SS/FF/SF, calendrier ouvré, chaîne critique, marges et écart de baseline. La planification reliée au pilotage de projet.',
};

export default function Page() {
  return <ProductPage module={MODULE_PAR_SLUG.time} />;
}
