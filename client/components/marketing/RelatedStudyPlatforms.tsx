'use client';

import { usePathname } from 'next/navigation';

const EN_PLATFORMS = [
  {
    href: 'https://realtylicence.com',
    color: '#D4A843',
    name: 'RealtyLicence',
    desc: 'Pursuing a Canadian real estate licence instead? RealtyLicence prepares you for the OACIQ, RECO, BCFSA and RECA exams with AI-powered practice questions, theory and exam simulations.',
  },
  {
    href: 'https://metierium.com',
    color: '#3B82F6',
    name: 'Metierium',
    desc: 'Preparing for a Quebec construction trade exam instead? Metierium covers the CMEQ, CMMTQ, QBQ, CCQ and RBQ certification exams with theory, practice exams and an AI tutor.',
  },
  {
    href: 'https://redsealpractice.com',
    color: '#EF4444',
    name: 'Red Seal Practice',
    desc: 'Preparing for a Red Seal trade exam instead? Red Seal Practice covers the interprovincial Red Seal exams across 54 trades with theory, practice questions and exam simulations.',
  },
  {
    href: 'https://skylicense.cloud',
    color: '#4FA3E3',
    name: 'Sky License FAA',
    desc: 'Training for the FAA A&P written tests instead? Sky License covers the FAA General, Airframe and Powerplant knowledge exams with AI-powered practice questions and full exam simulations.',
  },
  {
    href: 'https://skylicence.cloud',
    color: '#06B6D4',
    name: 'Skylicence Canada',
    desc: 'Training for a Canadian AME licence instead? Skylicence Canada covers the Transport Canada Aircraft Maintenance Engineer (AME) exams — License M, E and S — with AI-powered theory, practice questions and exam simulations.',
  },
  {
    href: 'https://skylicence.com',
    color: '#22C55E',
    name: 'Skylicence Europe',
    desc: 'Pursuing an EASA Part-66 licence in Europe instead? Skylicence Europe covers the Part-66 modules for aircraft maintenance licences with AI-powered theory and practice exams.',
  },
  {
    href: 'https://sky107.com',
    color: '#F59E0B',
    name: 'Sky107',
    desc: 'Getting your FAA Part 107 drone licence instead? Sky107 prepares you for the FAA UAG written test with 60-question exam simulations and practice questions.',
  },
];

const FR_PLATFORMS = [
  {
    href: 'https://realtylicence.com',
    color: '#D4A843',
    name: 'RealtyLicence',
    desc: "Vous visez plutôt un permis de courtier immobilier canadien? RealtyLicence vous prépare aux examens OACIQ, RECO, BCFSA et RECA avec des questions pratiques propulsées par l'IA, la théorie et des simulations d'examen.",
  },
  {
    href: 'https://metierium.com',
    color: '#3B82F6',
    name: 'Metierium',
    desc: "Vous préparez plutôt un examen de métier de la construction au Québec? Metierium couvre les certifications CMEQ, CMMTQ, QBQ, CCQ et RBQ avec la théorie, des examens pratiques et un tuteur IA.",
  },
  {
    href: 'https://redsealpractice.com',
    color: '#EF4444',
    name: 'Red Seal Practice',
    desc: "Vous préparez plutôt un examen de métier Sceau rouge? Red Seal Practice couvre les examens interprovinciaux Sceau rouge de 54 métiers avec la théorie, des questions pratiques et des simulations d'examen.",
  },
  {
    href: 'https://skylicense.cloud',
    color: '#4FA3E3',
    name: 'Sky License FAA',
    desc: "Vous vous entraînez plutôt pour les examens écrits FAA A&P? Sky License couvre les examens de connaissances FAA General, Airframe et Powerplant avec des questions pratiques propulsées par l'IA et des simulations complètes.",
  },
  {
    href: 'https://skylicence.cloud',
    color: '#06B6D4',
    name: 'Skylicence Canada',
    desc: "Vous visez plutôt une licence AME canadienne? Skylicence Canada couvre les examens de technicien d'entretien d'aéronefs (AME) de Transports Canada — licences M, E et S — avec la théorie propulsée par l'IA, des questions pratiques et des simulations d'examen.",
  },
  {
    href: 'https://skylicence.com',
    color: '#22C55E',
    name: 'Skylicence Europe',
    desc: "Vous visez plutôt une licence EASA Part-66 en Europe? Skylicence Europe couvre les modules Part-66 pour les licences de maintenance d'aéronefs avec la théorie propulsée par l'IA et des examens pratiques.",
  },
  {
    href: 'https://sky107.com',
    color: '#F59E0B',
    name: 'Sky107',
    desc: "Vous obtenez plutôt votre permis de drone FAA Part 107? Sky107 vous prépare à l'examen écrit FAA UAG avec des simulations de 60 questions et des questions pratiques.",
  },
];

export default function RelatedStudyPlatforms() {
  const pathname = usePathname();
  const isFr = pathname.startsWith('/fr');
  const platforms = isFr ? FR_PLATFORMS : EN_PLATFORMS;

  return (
    <div className="mt-12 border-t border-white/10 pt-10">
      <h2 className="text-xl font-bold mb-5">
        {isFr ? 'Plateformes d\'étude connexes' : 'Related Study Platforms'}
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
            style={{ ['--hover-border' as string]: p.color }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${p.color}30`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '';
            }}
          >
            <h3 className="text-lg font-semibold mb-1 group-hover:!text-[var(--hover-border)] transition-colors" style={{ color: 'inherit' }}>
              <span style={{ color: p.color }}>{p.name}</span>
            </h3>
            <p className="text-sm text-[#94A3B8] mb-2">{p.desc}</p>
            <span className="text-sm font-medium" style={{ color: p.color }}>
              {p.href.replace('https://', '')} →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
