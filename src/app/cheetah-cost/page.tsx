import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import ForecastSimulator from '@/components/ForecastSimulator';
import ProductPage from '@/components/ProductPage';
import { MODULE_PAR_SLUG } from '@/content/cheetah';

export const metadata: Metadata = {
  ...pageMetadata('/cheetah-cost/', 'Cheetah Cost — contrôle de coûts de projet', 'Budget initial, budget à date, avancement physique, valeur acquise, reste à faire, coût prévisionnel et écart. Le contrôle de coûts tenu ligne budgétaire par ligne budgétaire.'),
};

export default function Page() {
  return <ProductPage module={MODULE_PAR_SLUG.cost} demonstration={<ForecastSimulator />} />;
}
