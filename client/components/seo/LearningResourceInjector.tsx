/**
 * Centralized LearningResource component for blog pages.
 * Import and render at the end of any page that needs it.
 */
import { LearningResourceJsonLd } from '@/components/seo/JsonLd';

interface Props {
  category?: string;
  en?: boolean;
}

export function BlogLearningResource({ category = 'ICC Building Inspector Certification', en = true }: Props) {
  const label = en ? 'Guide' : 'Guide';
  const name = en
    ? 'ICC Building Inspector Certification Guide'
    : 'Guide des certifications ICC d\'inspecteur en bâtiment';
  const desc = en
    ? `Complete guide to ICC building inspector certification covering ${category}. International Codes (IRC, IBC, NEC, IPC, IMC), open-book exam strategy, and preparation.`
    : `Guide complet des certifications ICC d'inspecteur en bâtiment couvrant ${category}. Codes internationaux (CRI, IBC, NEC, IPC, IMC), stratégie d'examen à livre ouvert et préparation.`;
  const teaches = en
    ? ['ICC B1 Certification', 'ICC B2 Certification', 'IRC/IBC Code Navigation', 'Open-Book Exam Strategy', 'Building Inspection', category]
    : ['Certification ICC B1', 'Certification ICC B2', 'Navigation dans les codes', "Stratégie d'examen à livre ouvert", "Inspection de bâtiments", category];

  return (
    <LearningResourceJsonLd
      name={name}
      description={desc}
      educationalLevel="Professional"
      teaches={teaches}
      resourceType="Guide"
    />
  );
}
