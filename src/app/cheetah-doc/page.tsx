import ProductPage from '@/components/ProductPage';
import DocumentVersionFlow from '@/components/product/DocumentVersionFlow';
import { MODULE_PAR_SLUG } from '@/content/cheetah';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/cheetah-doc/', 'Cheetah Doc — livrables, versions et traçabilité',
  'Livrables de projet, versions et rôles : découvrez les capacités déclarées de Cheetah Doc et un parcours documentaire pédagogique clairement identifié.');

export default function Page() {
  return <ProductPage module={MODULE_PAR_SLUG.doc} demonstration={<DocumentVersionFlow />} />;
}
