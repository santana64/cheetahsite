import ProductPage from '@/components/ProductPage';
import ProjectTimeline from '@/components/product/ProjectTimeline';
import { MODULE_PAR_SLUG } from '@/content/cheetah';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/cheetah-time/', 'Cheetah Time — planification et chemin critique',
  'Structure WBS, dépendances, marges et écart de baseline. Explorez un scénario pédagogique de retard et ses conséquences sur la fin du projet.');

export default function Page() {
  return <ProductPage module={MODULE_PAR_SLUG.time} demonstration={<ProjectTimeline />} />;
}
