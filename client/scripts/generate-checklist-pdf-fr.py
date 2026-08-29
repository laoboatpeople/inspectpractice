"""Générer un PDF imprimable de la checklist de préparation aux examens TEA — 30 jours (version française)."""

from fpdf import FPDF
import os

FONT_DIR = '/usr/share/fonts/truetype/dejavu/'

# Layout constants — A4 (210mm wide), consistent content column
CX = 14        # content left edge
CW = 182       # content width (14..196, symmetric margins)
CX_CHECK = CX  # checkbox left
CW_CHK = 6     # checkbox width
CX_TEXT = CX + CW_CHK  # task text left edge


class ChecklistPDF(FPDF):
    def _setup_fonts(self):
        self.add_font('DejaVu', '', os.path.join(FONT_DIR, 'DejaVuSans.ttf'), uni=True)
        self.add_font('DejaVu', 'B', os.path.join(FONT_DIR, 'DejaVuSans-Bold.ttf'), uni=True)

    def header(self):
        self._setup_fonts()
        self.set_x(CX)
        self.set_font('DejaVu', 'B', 14)
        self.set_text_color(255, 255, 255)
        self.cell(CW, 10, 'Checklist de pr\u00e9paration aux examens TEA \u2014 30 jours', align='C')
        self.ln(10)
        self.set_x(CX)
        self.set_font('DejaVu', '', 8)
        self.set_text_color(148, 163, 184)
        self.cell(CW, 6, 'Inspect Practice \u2014 inspectpractice.com', align='C')
        self.ln(10)
        self.set_draw_color(59, 130, 246)
        self.set_line_width(0.5)
        self.line(CX, self.get_y(), CX + CW, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font('DejaVu', '', 8)
        self.set_text_color(100, 116, 139)
        self.set_x(CX)
        self.cell(CW, 10, f'Page {self.page_no()}/{{nb}}', align='C')

    def day_entry(self, day_num, day_title, tasks):
        # Day header — flush left with the content column
        self.set_x(CX)
        self.set_font('DejaVu', 'B', 10)
        self.set_text_color(30, 64, 175)  # dark blue, readable on white
        self.cell(CW, 6, f'Jour {day_num} : {day_title}')
        self.ln(8)
        # Tasks
        self.set_font('DejaVu', '', 9)
        self.set_text_color(107, 114, 128)  # gray-500, subtle but readable
        for task in tasks:
            self.set_x(CX_CHECK)
            self.cell(CW_CHK, 5, '\u25a1')  # checkbox
            self.set_x(CX_TEXT)
            self.multi_cell(CW - CW_CHK, 5, task)
            self.ln(1)
        self.set_draw_color(100, 116, 139)
        self.line(CX, self.get_y(), CX + CW, self.get_y())
        self.ln(4)


weeks = [
    {
        'week': 1,
        'title': '\u00c9valuation et fondations',
        'subtitle': 'R\u00e9visez le syllabus, faites un quiz diagnostique et identifiez vos points faibles.',
        'days': [
            {
                'day': 1,
                'title': 'T\u00e9l\u00e9charger et r\u00e9viser le syllabus TP14038E',
                'tasks': [
                    'T\u00e9l\u00e9chargez le syllabus officiel TP14038E depuis le site web de Transports Canada.',
                    'Lisez les cinq domaines du plan : RAC, Normes, Cellule, Motorisation, \u00c9lectricit\u00e9.',
                    'Surlignez les sujets m\u00e9connus pour les \u00e9tudier plus tard de mani\u00e8re cibl\u00e9e.',
                ],
            },
            {
                'day': 2,
                'title': 'Passer un quiz diagnostique complet',
                'tasks': [
                    'Connectez-vous \u00e0 Inspect Practice et passez un quiz diagnostique complet couvrant tous les domaines.',
                    'Consignez vos scores par domaine pour identifier les points faibles.',
                    'R\u00e9visez chaque r\u00e9ponse erron\u00e9e et lisez les explications fournies.',
                ],
            },
            {
                'day': 3,
                'title': 'Organiser votre mat\u00e9riel d\u2019\u00e9tude',
                'tasks': [
                    'Rassemblez vos r\u00e9f\u00e9rences : RAC (\u00e9dition en vigueur), Norme 571, AC43.13-1B, \u00e9chantillons de MME.',
                    'Ajoutez aux favoris le tuteur IA et la banque de questions Inspect Practice pour un acc\u00e8s quotidien.',
                    'Mettez en place un suivi d\u2019\u00e9tude \u2014 imprimez ou sauvegardez cette checklist pour suivre votre progression.',
                ],
            },
            {
                'day': 4,
                'title': 'Fondations des RAC \u2014 Parties I et II',
                'tasks': [
                    'Lisez la Partie I des RAC (Dispositions g\u00e9n\u00e9rales) \u2014 d\u00e9finitions, application et exemptions.',
                    'Lisez la Partie II des RAC (Identification et immatriculation des a\u00e9ronefs).',
                    'R\u00e9pondez \u00e0 10 questions d\u2019entra\u00eenement sur les RAC Parties I et II.',
                ],
            },
            {
                'day': 5,
                'title': 'RAC Partie V \u2014 Navigabilit\u00e9',
                'tasks': [
                    'Lisez la Partie V des RAC (Navigabilit\u00e9) \u2014 certificats, maintien de la navigabilit\u00e9 et modifications.',
                    'Portez une attention particuli\u00e8re \u00e0 la Section V (Maintenances \u00e9mises) et \u00e0 la Section VII (Calendrier d\u2019entretien).',
                    'R\u00e9pondez \u00e0 15 questions d\u2019entra\u00eenement sur la Partie V.',
                ],
            },
            {
                'day': 6,
                'title': 'RAC Parties VI et VII',
                'tasks': [
                    'Lisez la Partie VI des RAC (Maintenance) \u2014 exigences g\u00e9n\u00e9rales de maintenance.',
                    'Lisez la Partie VII des RAC (Organismes de maintenance approuv\u00e9s).',
                    'R\u00e9pondez \u00e0 15 questions d\u2019entra\u00eenement sur les Parties VI et VII.',
                ],
            },
            {
                'day': 7,
                'title': 'R\u00e9vision Semaine 1 \u2014 \u00c9valuation des RAC',
                'tasks': [
                    'Relisez vos notes de la Semaine 1 \u2014 concentrez-vous sur les d\u00e9finitions et les num\u00e9ros d\u2019articles cl\u00e9s.',
                    'Passez un quiz mixte de 30 questions sur les RAC portant sur toutes les parties \u00e9tudi\u00e9es.',
                    'Objectif de score : 70 %+ pour continuer. Sous 70 %, r\u00e9\u00e9tudiez et repassez le quiz.',
                ],
            },
        ],
    },
    {
        'week': 2,
        'title': 'Normes et navigabilit\u00e9',
        'subtitle': 'Plongez dans les syst\u00e8mes de cellule, de motorisation, d\u2019\u00e9lectricit\u00e9 et les facteurs humains.',
        'days': [
            {
                'day': 8,
                'title': 'Norme 571 \u2014 Aper\u00e7u de la maintenance',
                'tasks': [
                    'Lisez la Norme 571.01 \u00e0 571.03 : applicabilit\u00e9, d\u00e9finitions et calendriers d\u2019entretien.',
                    'Comprenez la diff\u00e9rence entre la maintenance programm\u00e9e et non programm\u00e9e.',
                    'R\u00e9pondez \u00e0 10 questions d\u2019entra\u00eenement sur les bases de la Norme 571.',
                ],
            },
            {
                'day': 9,
                'title': 'Norme 571 \u2014 R\u00e9parations et modifications',
                'tasks': [
                    'Lisez la Norme 571.06 (R\u00e9parations) \u2014 classification, approbation et exigences en mati\u00e8re de donn\u00e9es.',
                    'Lisez la Norme 571.07 (Modifications) \u2014 modifications majeures et mineures.',
                    'R\u00e9pondez \u00e0 15 questions d\u2019entra\u00eenement sur les r\u00e9parations et les modifications.',
                ],
            },
            {
                'day': 10,
                'title': 'Norme 571 \u2014 Inspection et certifications',
                'tasks': [
                    'Lisez la Norme 571.04 (Inspection) \u2014 inspections annuelles, 100 heures et progressives.',
                    'Lisez la Norme 571.05 (Certification) \u2014 maintenances \u00e9mises et signatures.',
                    'R\u00e9pondez \u00e0 10 questions d\u2019entra\u00eenement sur les inspections et les certifications.',
                ],
            },
            {
                'day': 11,
                'title': 'Normes 593 et 625 \u2014 Facteurs humains',
                'tasks': [
                    'Lisez la Norme 593 (Facteurs humains) \u2014 fatigue, complaisance, communication.',
                    'Lisez la Norme 625 (Erreurs de maintenance) \u2014 types d\u2019erreurs et strat\u00e9gies de pr\u00e9vention.',
                    'R\u00e9pondez \u00e0 10 questions d\u2019entra\u00eenement sur les facteurs humains.',
                ],
            },
            {
                'day': 12,
                'title': 'Fondamentaux \u00e9lectriques \u2014 ATA 24',
                'tasks': [
                    '\u00c9tudiez l\u2019ATA 24 (Alimentation \u00e9lectrique) \u2014 syst\u00e8mes CC et CA, batteries, g\u00e9n\u00e9ratrices, inverseurs.',
                    'Concentrez-vous sur la distribution de courant continu \u2014 syst\u00e8mes 14 V et 28 V, bus, protection des circuits.',
                    'R\u00e9pondez \u00e0 15 questions d\u2019entra\u00eenement sur les fondamentaux \u00e9lectriques.',
                ],
            },
            {
                'day': 13,
                'title': 'Avionique et instruments \u2014 ATA 34',
                'tasks': [
                    '\u00c9tudiez l\u2019ATA 34 (Navigation et instruments) \u2014 syst\u00e8mes pitot-statiques, instruments gyroscopiques.',
                    'R\u00e9visez l\u2019ATA 23 (Communications) et l\u2019ATA 33 (Feux).',
                    'R\u00e9pondez \u00e0 15 questions d\u2019entra\u00eenement sur l\u2019avionique et les instruments.',
                ],
            },
            {
                'day': 14,
                'title': 'R\u00e9vision Semaine 2 \u2014 Examen normes et syst\u00e8mes',
                'tasks': [
                    'Passez un examen de progression de 50 questions couvrant les normes et les syst\u00e8mes \u00e9lectriques.',
                    'Comparez votre score avec celui de votre diagnostique de la Semaine 1.',
                    'Dressez la liste de vos 5 sous-th\u00e8mes les plus faibles pour une \u00e9tude cibl\u00e9e en Semaine 3.',
                ],
            },
        ],
    },
    {
        'week': 3,
        'title': 'Approfondissement technique',
        'subtitle': 'Cellule, motorisation et d\u00e9fis de difficult\u00e9 mixte.',
        'days': [
            {
                'day': 15,
                'title': 'Syst\u00e8mes hydrauliques et pneumatiques \u2014 ATA 29',
                'tasks': [
                    '\u00c9tudiez l\u2019ATA 29 (Puissance hydraulique) \u2014 pompes, actuateurs, fluides, r\u00e9servoirs, filtres.',
                    'R\u00e9visez l\u2019ATA 30 (Protection contre la glace et la pluie) \u2014 aper\u00e7u des syst\u00e8mes pneumatiques.',
                    'R\u00e9pondez \u00e0 15 questions d\u2019entra\u00eenement sur l\u2019hydraulique et le pneumatique.',
                ],
            },
            {
                'day': 16,
                'title': 'Train d\u2019atterrissage et freins \u2014 ATA 32',
                'tasks': [
                    '\u00c9tudiez l\u2019ATA 32 (Train d\u2019atterrissage) \u2014 syst\u00e8mes de rentr\u00e9e, jambes de force, roues, pneus, freins.',
                    'R\u00e9visez les syst\u00e8mes anti-d\u00e9rapage et de freinage automatique de l\u2019ATA 32.',
                    'R\u00e9pondez \u00e0 15 questions d\u2019entra\u00eenement sur le train d\u2019atterrissage.',
                ],
            },
            {
                'day': 17,
                'title': 'Commandes de vol et carburant \u2014 ATA 27 et 28',
                'tasks': [
                    '\u00c9tudiez l\u2019ATA 27 (Commandes de vol) \u2014 commandes primaires et secondaires, syst\u00e8mes de compensation.',
                    '\u00c9tudiez l\u2019ATA 28 (Carburant) \u2014 distribution du carburant, pompes, vannes, indicateurs de quantit\u00e9.',
                    'R\u00e9pondez \u00e0 20 questions mixtes sur les commandes de vol et le carburant.',
                ],
            },
            {
                'day': 18,
                'title': 'Structures de cellule \u2014 ATA 51\u201357',
                'tasks': [
                    '\u00c9tudiez l\u2019ATA 51 (Structures) et l\u2019ATA 52 (Portes) \u2014 principes structuraux de base.',
                    'R\u00e9visez les ATA 53\u201357 (Fuselage, Nacelles, Stabilisateurs, Hublots, Ailes).',
                    'R\u00e9pondez \u00e0 25 questions d\u2019entra\u00eenement sur les structures de cellule.',
                ],
            },
            {
                'day': 19,
                'title': 'Syst\u00e8mes motorisation \u2014 ATA 71\u201380',
                'tasks': [
                    '\u00c9tudiez l\u2019ATA 71 (Motorisation) \u2014 installation du moteur, capotage, supports.',
                    'R\u00e9visez les ATA 72\u201375 (Moteur) \u2014 fondamentaux des moteurs alternatifs et \u00e0 turbine.',
                    'R\u00e9pondez \u00e0 25 questions d\u2019entra\u00eenement sur la motorisation.',
                ],
            },
            {
                'day': 20,
                'title': 'D\u00e9fi de difficult\u00e9 mixte',
                'tasks': [
                    'R\u00e9glez Inspect Practice sur la difficult\u00e9 \u00c9LEV\u00c9E. R\u00e9pondez \u00e0 20 questions.',
                    'R\u00e9visez chaque r\u00e9ponse \u00e0 l\u2019aide du tuteur IA pour une compr\u00e9hension approfondie.',
                    'Passez 30 minutes \u00e0 relire les notes des Semaines 1 et 2 sur les sujets difficiles.',
                ],
            },
            {
                'day': 21,
                'title': 'R\u00e9vision Semaine 3 \u2014 Examen de progression de 60 questions',
                'tasks': [
                    'Passez un examen de progression de 60 questions couvrant tous les domaines \u00e9tudi\u00e9s jusqu\u2019\u00e0 pr\u00e9sent.',
                    'Comparez votre score avec votre diagnostique de la Semaine 1.',
                    'Dressez la liste de 5 sujets \u00e0 renforcer lors de la derni\u00e8re semaine.',
                ],
            },
        ],
    },
    {
        'week': 4,
        'title': 'Simulation d\u2019examen',
        'subtitle': 'Examens chronom\u00e9tr\u00e9s complets, r\u00e9vision des erreurs, pr\u00e9paration finale.',
        'days': [
            {
                'day': 22,
                'title': 'Simulation 1 \u2014 Examen RAC',
                'tasks': [
                    'Passez la simulation RAC : format complet, chronom\u00e9tr\u00e9, sans interruptions.',
                    'Simulez les conditions r\u00e9elles d\u2019examen.',
                    'R\u00e9visez toutes les r\u00e9ponses erron\u00e9es en d\u00e9tail.',
                ],
            },
            {
                'day': 23,
                'title': 'Simulation 2 \u2014 Examen normes',
                'tasks': [
                    'Passez la simulation Norme 571 : format complet, chronom\u00e9tr\u00e9.',
                    'Concentrez-vous sur les questions relatives \u00e0 la Norme 571.06 (R\u00e9parations) et 571.07 (Modifications).',
                    'Consignez chaque question incorrecte et cat\u00e9gorisez-la par sous-th\u00e8me.',
                ],
            },
            {
                'day': 24,
                'title': 'Rem\u00e9diation des points faibles',
                'tasks': [
                    'R\u00e9visez votre journal d\u2019erreurs cat\u00e9goris\u00e9 des Simulations 1 et 2.',
                    'Passez 3 heures sur les 3 sous-th\u00e8mes les plus faibles \u00e0 l\u2019aide du tuteur IA.',
                    'R\u00e9pondez \u00e0 un quiz cibl\u00e9 de 20 questions sur chaque sous-th\u00e8me faible jusqu\u2019\u00e0 obtenir 80 %+.',
                ],
            },
            {
                'day': 25,
                'title': 'Simulation 3 \u2014 Examen cellule',
                'tasks': [
                    'Passez la simulation Cellule : format complet, chronom\u00e9tr\u00e9.',
                    'Couvrez les 12 chapitres de cellule.',
                    'Consignez les erreurs, en particulier sur l\u2019ATA 32 (Train d\u2019atterrissage) et l\u2019ATA 27 (Commandes de vol).',
                ],
            },
            {
                'day': 26,
                'title': 'Simulation 4 \u2014 Examen motorisation',
                'tasks': [
                    'Passez la simulation Motorisation : format complet, chronom\u00e9tr\u00e9.',
                    'Couvrez les 12 chapitres de motorisation.',
                    'Comparez le score avec celui de la Simulation 3 pour identifier les points faibles restants.',
                ],
            },
            {
                'day': 27,
                'title': 'R\u00e9vision finale \u2014 R\u00e8glements et r\u00e9f\u00e9rences',
                'tasks': [
                    'Relisez vos notes sur les RAC Parties I, II, V, VI, VII.',
                    'R\u00e9visez les classifications des Normes 571.06 \u00e0 571.08.',
                    'Passez un dernier quiz r\u00e9glementaire mixte de 30 questions. Objectif de score : 85 %+.',
                ],
            },
            {
                'day': 28,
                'title': 'R\u00e9vision finale \u2014 Domaines techniques',
                'tasks': [
                    'Parcourez rapidement tous les chapitres ATA : 20, 24, 25, 27, 28, 32, 33, 34, 51\u201357, 71\u201380.',
                    'R\u00e9visez les 10 types de questions les plus courants rencontr\u00e9s.',
                    'Dernier quiz technique mixte de 30 questions. Objectif de score : 85 %+.',
                ],
            },
            {
                'day': 29,
                'title': 'Repos et r\u00e9vision l\u00e9g\u00e8re',
                'tasks': [
                    'AUCUN nouveau contenu. R\u00e9vision l\u00e9g\u00e8re uniquement.',
                    'Pr\u00e9parez le mat\u00e9riel d\u2019examen : pi\u00e8ce d\u2019identit\u00e9, confirmation d\u2019examen, calculatrice.',
                    'Couchez-vous t\u00f4t. Visez 8 heures de sommeil.',
                ],
            },
            {
                'day': 30,
                'title': 'Jour d\u2019examen !',
                'tasks': [
                    'Prenez un bon petit-d\u00e9jeuner. Arrivez 30 minutes \u00e0 l\u2019avance.',
                    'Ayez confiance en votre pr\u00e9paration.',
                    'Lisez chaque question attentivement. G\u00e9rez votre temps.',
                ],
            },
        ],
    },
]

pdf = ChecklistPDF('P', 'mm', 'A4')
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)

for week_data in weeks:
    pdf.add_page()
    # Week title bar — blue banner, full content width
    pdf.set_fill_color(59, 130, 246)
    pdf.rect(CX, pdf.get_y(), CW, 12, 'F')
    pdf.set_font('DejaVu', 'B', 14)
    pdf.set_text_color(255, 255, 255)
    pdf.set_y(pdf.get_y() + 2)
    pdf.set_x(CX)
    pdf.cell(CW, 8, f'Semaine {week_data["week"]}: {week_data["title"]}', align='C')
    pdf.ln(12)
    # Subtitle — dark gray, centered
    pdf.set_x(CX)
    pdf.set_text_color(75, 85, 99)
    pdf.set_font('DejaVu', '', 9)
    pdf.cell(CW, 5, week_data['subtitle'], align='C')
    pdf.ln(8)

    for day_data in week_data['days']:
        # Check if we need a new page
        if pdf.get_y() > 250:
            pdf.add_page()
        pdf.day_entry(day_data['day'], day_data['title'], day_data['tasks'])

output_dir = os.path.join(os.path.dirname(__file__), '..', 'public')
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'study-checklist-30-day-fr.pdf')
pdf.output(output_path)
print(f'PDF g\u00e9n\u00e9r\u00e9 : {output_path}')
print(f'Taille : {os.path.getsize(output_path)} octets')
