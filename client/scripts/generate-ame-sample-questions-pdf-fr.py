"""Generate a PDF of 10 AME sample practice questions in French with answers and explanations."""

from fpdf import FPDF
import os

FONT_DIR = '/usr/share/fonts/truetype/dejavu/'

# Layout constants — A4 (210mm wide), consistent content column
CX = 14        # content left edge
CW = 182       # content width (14..196, symmetric margins)


class AMEPracticePDF(FPDF):
    def _setup_fonts(self):
        self.add_font('DejaVu', '', os.path.join(FONT_DIR, 'DejaVuSans.ttf'))
        self.add_font('DejaVu', 'B', os.path.join(FONT_DIR, 'DejaVuSans-Bold.ttf'))
        # Use Serif as a distinct italic-style font for explanations
        self.add_font('Serif', '', os.path.join(FONT_DIR, 'DejaVuSerif.ttf'))
        self.add_font('Serif', 'B', os.path.join(FONT_DIR, 'DejaVuSerif-Bold.ttf'))

    def header(self):
        # Blue header bar
        self.set_fill_color(59, 130, 246)
        self.rect(CX, self.get_y(), CW, 10, 'F')
        self.set_font('DejaVu', 'B', 14)
        self.set_text_color(255, 255, 255)
        self.set_y(self.get_y() + 1.5)
        self.set_x(CX)
        self.cell(CW, 7, 'Questions pratiques TEA gratuites \u2014 Inspect Practice', align='C')
        self.ln(12)

    def footer(self):
        self.set_y(-15)
        self.set_font('DejaVu', '', 8)
        self.set_text_color(100, 116, 139)
        self.set_x(CX)
        self.cell(CW, 10, f'Page {self.page_no()}/{{nb}}', align='C')

    def question_block(self, q_num, topic, stem, options, correct, explanation, ref):
        """Render a single question with options, answer, explanation, and reference."""

        # Check if we need a new page (need roughly 40mm minimum for a question)
        if self.get_y() > 245:
            self.add_page()

        # Question number — bold
        self.set_x(CX)
        self.set_font('DejaVu', 'B', 11)
        self.set_text_color(30, 64, 175)
        self.cell(CW, 6, f'Question {q_num}')
        self.ln(6)

        # Topic — blue, small
        self.set_x(CX)
        self.set_font('DejaVu', '', 9)
        self.set_text_color(59, 130, 246)
        self.cell(CW, 5, topic)
        self.ln(7)

        # Stem text — 10pt
        self.set_x(CX)
        self.set_font('DejaVu', '', 10)
        self.set_text_color(30, 41, 59)
        self.multi_cell(CW, 5.5, stem)
        self.ln(4)

        # Options A-D
        self.set_font('DejaVu', '', 9)
        self.set_text_color(55, 65, 81)
        for letter, text in options:
            self.set_x(CX + 4)
            marker = '\u2713' if letter == correct else ' '
            self.cell(6, 5, f'{letter}.')
            self.set_x(CX + 10)
            self.multi_cell(CW - 14, 5, text)
            self.ln(1)

        self.ln(2)

        # Separator line
        self.set_draw_color(59, 130, 246)
        self.set_line_width(0.3)
        self.line(CX, self.get_y(), CX + CW, self.get_y())
        self.ln(3)

        # Correct answer indicator
        self.set_x(CX)
        self.set_font('DejaVu', 'B', 9)
        self.set_text_color(22, 163, 74)
        self.cell(CW, 5, f'Correct : {correct}')
        self.ln(6)

        # Explanation — serif 9pt (distinct from question stem)
        self.set_x(CX)
        self.set_font('Serif', '', 9)
        self.set_text_color(71, 85, 105)
        self.multi_cell(CW, 5, explanation)
        self.ln(3)

        # Reference
        self.set_x(CX)
        self.set_font('Serif', '', 9)
        self.set_text_color(55, 65, 81)
        self.cell(CW, 5, f'R\u00e9f : {ref}')
        self.ln(6)

        # End-of-question separator
        self.set_draw_color(203, 213, 225)
        self.set_line_width(0.5)
        self.line(CX, self.get_y(), CX + CW, self.get_y())
        self.ln(5)


# Map correctIndex (0-based) to letter
INDEX_TO_LETTER = ['A', 'B', 'C', 'D']

questions = [
    {
        "num": 1,
        "topic": "R\u00e8glements \u2014 RAC",
        "stem": (
            "Selon le RAC 571.02, laquelle des circonstances suivantes n\u00e9cessite qu'une "
            "main-d'\u0153uvre (MR) soit remplie avant que l'a\u00e9ronef ne soit remis en service\u00a0?"
        ),
        "options": [
            ("A", "Remplacement d'un pneu de train d'atterrissage par un pneu en \u00e9tat de service du m\u00eame num\u00e9ro de pi\u00e8ce"),
            ("B", "R\u00e9alisation d'une inspection p\u00e9riodique de 50 heures telle que sp\u00e9cifi\u00e9e dans le programme d'entretien approuv\u00e9"),
            ("C", "Ajout d'huile moteur entre les vidanges programm\u00e9es lorsque la quantit\u00e9 se situe dans les limites"),
            ("D", "Installation d'un groupe auxiliaire de puissance (APU) d\u00e9j\u00e0 certifi\u00e9 en \u00e9tat de service par le fabricant"),
        ],
        "correct": "B",
        "explanation": (
            "En vertu du RAC 571.02, une main-d'\u0153uvre est requise apr\u00e8s toute maintenance "
            "qui n'est pas une t\u00e2che de service mineure planifi\u00e9e. Une inspection p\u00e9riodique "
            "de 50 heures est une t\u00e2che de maintenance effectu\u00e9e conform\u00e9ment \u00e0 un programme "
            "d'entretien approuv\u00e9 (RAC 571.06) et n\u00e9cessite une MR certifiant que le travail "
            "a \u00e9t\u00e9 effectu\u00e9 conform\u00e9ment aux normes applicables. Les options A, C et D sont "
            "consid\u00e9r\u00e9es comme des travaux \u00e9l\u00e9mentaires ou des services mineurs ne n\u00e9cessitant "
            "pas de MR selon le RAC 571.02(2)."
        ),
        "ref": "RAC 571.02, RAC 571.06",
    },
    {
        "num": 2,
        "topic": "R\u00e8glements \u2014 RAC",
        "stem": (
            "En vertu de la Partie II, Sous-partie 2 du RAC (Immatriculation des a\u00e9ronefs), "
            "un a\u00e9ronef exploit\u00e9 au Canada doit \u00eatre immatricul\u00e9 au nom du propri\u00e9taire. "
            "Laquelle des conditions suivantes entra\u00eene la nullit\u00e9 d'un certificat "
            "d'immatriculation\u00a0?"
        ),
        "options": [
            ("A", "L'a\u00e9ronef subit une r\u00e9paration majeure d'une structure primaire"),
            ("B", "L'a\u00e9ronef est exploit\u00e9 \u00e0 l'ext\u00e9rieur du Canada pendant plus de 30 jours cons\u00e9cutifs"),
            ("C", "Le certificat d'immatriculation expire 12 mois apr\u00e8s la date de d\u00e9livrance"),
            ("D", "Le propri\u00e9taire cesse d'\u00eatre le propri\u00e9taire ou le titre l\u00e9gal de l'a\u00e9ronef est transf\u00e9r\u00e9"),
        ],
        "correct": "D",
        "explanation": (
            "Conform\u00e9ment au RAC 202.32, un certificat d'immatriculation cesse d'\u00eatre valide "
            "lorsque le propri\u00e9taire cesse d'\u00eatre propri\u00e9taire (c'est-\u00e0-dire que l'a\u00e9ronef "
            "est vendu ou que le titre l\u00e9gal est transf\u00e9r\u00e9). Un certificat d'immatriculation "
            "n'expire pas apr\u00e8s 12 mois \u2014 il reste valide jusqu'\u00e0 ce que le propri\u00e9taire "
            "change, que l'a\u00e9ronef soit radi\u00e9 ou que le propri\u00e9taire demande l'annulation."
        ),
        "ref": "RAC 202.32, RAC Partie II Sous-partie 2",
    },
    {
        "num": 3,
        "topic": "Normes 571 \u2014 Normes de maintenance",
        "stem": (
            "Selon la Norme 571 de Transports Canada, qu'est-ce qui est vrai concernant "
            "l'approbation des programmes d'entretien pour les a\u00e9ronefs immatricul\u00e9s au Canada\u00a0?"
        ),
        "options": [
            ("A", "Tous les programmes d'entretien doivent \u00eatre approuv\u00e9s par le Ministre avant de pouvoir \u00eatre utilis\u00e9s"),
            ("B", "Les programmes d'entretien peuvent \u00eatre \u00e9labor\u00e9s par l'OMA et ne n\u00e9cessitent pas d'approbation s'ils sont bas\u00e9s sur les recommandations du fabricant"),
            ("C", "Seuls les programmes d'entretien publi\u00e9s par Transports Canada sont acceptables dans un organisme de maintenance agr\u00e9\u00e9"),
            ("D", "Les programmes d'entretien doivent \u00eatre r\u00e9vis\u00e9s et r\u00e9approuv\u00e9s tous les 12 mois"),
        ],
        "correct": "A",
        "explanation": (
            "La Norme 571.03 exige que chaque a\u00e9ronef soit entretenu conform\u00e9ment \u00e0 un "
            "programme d'entretien approuv\u00e9 par le Ministre (Transports Canada). Bien que "
            "les fabricants fournissent des recommandations, le programme d'entretien formel "
            "lui-m\u00eame n\u00e9cessite l'approbation minist\u00e9rielle pour \u00eatre utilis\u00e9 dans les "
            "op\u00e9rations a\u00e9riennes canadiennes."
        ),
        "ref": "Norme 571.03",
    },
    {
        "num": 4,
        "topic": "Normes 571 \u2014 Dossiers techniques",
        "stem": (
            "Selon la Norme 571.10, pendant combien de temps les dossiers techniques "
            "d'un a\u00e9ronef immatricul\u00e9 au Canada doivent-ils \u00eatre conserv\u00e9s apr\u00e8s "
            "la fin des travaux\u00a0?"
        ),
        "options": [
            ("A", "1 an apr\u00e8s la fin des travaux"),
            ("B", "Jusqu'\u00e0 la prochaine inspection de maintenance programm\u00e9e"),
            ("C", "2 ans apr\u00e8s la fin des travaux"),
            ("D", "Pendant la dur\u00e9e de vie du composant ou jusqu'\u00e0 ce que l'a\u00e9ronef soit d\u00e9finitivement retir\u00e9 du service"),
        ],
        "correct": "D",
        "explanation": (
            "La Norme 571.10 exige que les dossiers techniques soient conserv\u00e9s pendant "
            "la dur\u00e9e de vie du composant, ou jusqu'\u00e0 ce que l'a\u00e9ronef ou le composant "
            "soit d\u00e9finitivement retir\u00e9 du service. Les dossiers comprennent les "
            "main-d'\u0153uvre, les bons de travail et les registres de modifications. Cela "
            "garantit la tra\u00e7abilit\u00e9 compl\u00e8te de chaque action de maintenance tout au long "
            "de la vie op\u00e9rationnelle de l'a\u00e9ronef."
        ),
        "ref": "Norme 571.10",
    },
    {
        "num": 5,
        "topic": "Cellule \u2014 Train d'atterrissage",
        "stem": (
            "Lors d'un essai de rentr\u00e9e du train d'atterrissage principal sur un a\u00e9ronef "
            "de cat\u00e9gorie transport, le train ne se verrouille pas en position sortie. "
            "Quelle est la cause la PLUS probable si la pression du syst\u00e8me hydraulique "
            "est dans les limites\u00a0?"
        ),
        "options": [
            ("A", "Un micro-interrupteur de verrouillage sortie d\u00e9fectueux"),
            ("B", "Un d\u00e9bit de retour de fluide hydraulique insuffisant"),
            ("C", "Un ressort de verrouillage ou un m\u00e9canisme d'actionneur de verrouillage endommag\u00e9 ou mal ajust\u00e9"),
            ("D", "Une temp\u00e9rature ambiante excessivement \u00e9lev\u00e9e entra\u00eenant une perte de viscosit\u00e9"),
        ],
        "correct": "C",
        "explanation": (
            "Lorsque la pression hydraulique est normale mais que le train ne se verrouille "
            "pas en position sortie, le m\u00e9canisme de verrouillage m\u00e9canique est le premier "
            "suspect. Le ressort de verrouillage ou l'actionneur m\u00e9canique maintient "
            "physiquement le train en position sortie. Un micro-interrupteur d\u00e9fectueux "
            "affecte l'indication (t\u00e9moins/alertes), pas la fonction de verrouillage r\u00e9elle."
        ),
        "ref": "ATA 32 \u2014 Train d'atterrissage, AMM Chapitre 32",
    },
    {
        "num": 6,
        "topic": "Cellule \u2014 Structures",
        "stem": (
            "Selon l'AC 43.13-1B, quelle est la distance minimale au bord pour une rang\u00e9e "
            "unique de rivets frais\u00e9s dans une r\u00e9paration en alliage d'aluminium\u00a0?"
        ),
        "options": [
            ("A", "2 fois le diam\u00e8tre du rivet"),
            ("B", "2,5 fois le diam\u00e8tre du rivet"),
            ("C", "3 fois le diam\u00e8tre du rivet"),
            ("D", "4 fois le diam\u00e8tre du rivet"),
        ],
        "correct": "B",
        "explanation": (
            "L'AC 43.13-1B, Chapitre 4 sp\u00e9cifie une distance minimale au bord (distance "
            "du centre du trou de rivet au bord de la t\u00f4le) de 2,5 fois le diam\u00e8tre du "
            "rivet pour une rang\u00e9e unique de rivets frais\u00e9s sur des structures en alliage "
            "d'aluminium. Pour une double rang\u00e9e, la distance minimale au bord passe \u00e0 "
            "3 fois le diam\u00e8tre du rivet."
        ),
        "ref": "AC 43.13-1B, Chapitre 4, Tableau 4-1",
    },
    {
        "num": 7,
        "topic": "Groupe motopropulseur \u2014 Turbines",
        "stem": (
            "Lors d'une inspection de la section chaude sur un turbopropulseur Pratt & "
            "Whitney PT6A, vous trouvez plusieurs aubes de turbine pr\u00e9sentant une corrosion "
            "par sulfuration importante. Quelle est l'action la PLUS appropri\u00e9e\u00a0?"
        ),
        "options": [
            ("A", "Meuler les zones affect\u00e9es avec un tampon abrasif fin et remettre les aubes en service"),
            ("B", "Remplacer uniquement l'aube la plus corrod\u00e9e et r\u00e9\u00e9quilibrer l'ensemble de la turbine"),
            ("C", "Remplacer toutes les aubes affect\u00e9es de l'\u00e9tage par un jeu, ou suivre les instructions du manuel moteur"),
            ("D", "Appliquer un rev\u00eatement protecteur sur la zone corrod\u00e9e et continuer l'exploitation \u00e0 puissance r\u00e9duite"),
        ],
        "correct": "C",
        "explanation": (
            "Les aubes de turbine pr\u00e9sentant une corrosion par sulfuration doivent \u00eatre "
            "trait\u00e9es conform\u00e9ment au manuel du fabricant du moteur. Selon l'\u00e9tendue de la "
            "corrosion, le manuel peut exiger le remplacement de toutes les aubes d'un "
            "\u00e9tage par un jeu afin de maintenir l'\u00e9quilibre dynamique et la coh\u00e9rence "
            "a\u00e9rodynamique. Le meulage n'est g\u00e9n\u00e9ralement pas permis sur les surfaces "
            "a\u00e9rodynamiques de turbine pr\u00e9sentant des dommages structurels par corrosion."
        ),
        "ref": "ATA 72 \u2014 Moteur (Turbine), Manuel de maintenance P&WC PT6A",
    },
    {
        "num": 8,
        "topic": "Groupe motopropulseur \u2014 H\u00e9lices",
        "stem": (
            "Lors du d\u00e9pannage d'une h\u00e9lice \u00e0 vitesse constante qui ne se met pas en "
            "drapeau lors d'un essai de mise en drapeau au sol, quelle est la cause la PLUS "
            "probable si l'h\u00e9lice se d\u00e9draponne normalement\u00a0?"
        ),
        "options": [
            ("A", "Basse pression d'huile moteur"),
            ("B", "Une \u00e9lectrovanne de mise en drapeau du r\u00e9gulateur d'h\u00e9lice bloqu\u00e9e"),
            ("C", "Une liaison de contrepoids du d\u00f4me d'h\u00e9lice restreinte"),
            ("D", "Une pression de survitesse du r\u00e9gulateur emp\u00eachant l'h\u00e9lice de se mettre en drapeau"),
        ],
        "correct": "A",
        "explanation": (
            "Les h\u00e9lices \u00e0 vitesse constante utilisent la pression d'huile moteur pour "
            "se d\u00e9placer vers le pas fin (pas faible/r\u00e9gime \u00e9lev\u00e9) et des contrepoids "
            "centrifuges ou des ressorts pour se d\u00e9placer vers le pas grossier/drapeau. "
            "Si l'h\u00e9lice ne se met pas en drapeau mais se d\u00e9draponne normalement, cela "
            "sugg\u00e8re une pression d'huile insuffisante pour vaincre la force du ressort "
            "de mise en drapeau. L'\u00e9lectrovanne de mise en drapeau du r\u00e9gulateur est "
            "\u00e9lectrique \u2014 si elle est bloqu\u00e9e, elle affecterait \u00e0 la fois la mise en "
            "drapeau et le d\u00e9draponnage."
        ),
        "ref": "ATA 61 \u2014 H\u00e9lices, Manuels de maintenance Hartzell/McCauley",
    },
    {
        "num": 9,
        "topic": "\u00c9lectronique \u2014 Alimentation \u00e9lectrique",
        "stem": (
            "Un technicien diagnostique une panne intermittente dans un \u00e9metteur-r\u00e9cepteur "
            "de communication VHF. Le pilote signale que la radio fonctionne par intermittence "
            "et \u00e9choue parfois compl\u00e8tement en vol. L'antenne, le c\u00e2ble coaxial et les "
            "connecteurs ont tous \u00e9t\u00e9 test\u00e9s et sont dans les limites. Que devrait "
            "v\u00e9rifier le technicien ENSUITE\u00a0?"
        ),
        "options": [
            ("A", "Remplacer l'\u00e9metteur-r\u00e9cepteur par une unit\u00e9 connue en bon \u00e9tat"),
            ("B", "V\u00e9rifier la tension d'alimentation et le courant de l'\u00e9metteur-r\u00e9cepteur pendant le fonctionnement"),
            ("C", "Effectuer un contr\u00f4le de liaison et de mise \u00e0 la masse du rack radio et du chemin de masse de la cellule"),
            ("D", "Inspecter la balise de d\u00e9tresse (ELT) de l'a\u00e9ronef pour d\u00e9tecter des interf\u00e9rences sur la bande VHF"),
        ],
        "correct": "C",
        "explanation": (
            "Lorsque le syst\u00e8me d'antenne est v\u00e9rifi\u00e9 mais que la radio est intermittente, "
            "une liaison ou une mise \u00e0 la masse intermittente du rack radio est une cause "
            "fr\u00e9quente. Un mauvais chemin de masse peut provoquer un comportement erratique "
            "lorsque les vibrations et les changements de temp\u00e9rature affectent la connexion. "
            "La v\u00e9rification de la liaison du rack radio \u00e0 la masse de la cellule "
            "(g\u00e9n\u00e9ralement moins de 2,5 milliohms selon la MIL-STD-464) devrait \u00eatre "
            "effectu\u00e9e avant de remplacer des composants."
        ),
        "ref": "ATA 23 \u2014 Communications, AC 43.13-1B Chapitre 11",
    },
    {
        "num": 10,
        "topic": "Sc\u00e9nario mixte",
        "stem": (
            "Un Cessna 172R est amen\u00e9 pour son inspection annuelle. Le moteur est un "
            "Lycoming IO-360. Lors du contr\u00f4le de compression, le cylindre n\u00b0 3 affiche "
            "30/80 psi alors que les autres sont \u00e0 72/80 ou plus. Le technicien effectue "
            "un test de compression diff\u00e9rentielle et confirme une fuite par la soupape "
            "d'\u00e9chappement. Quelle est la marche \u00e0 suivre correcte\u00a0?"
        ),
        "options": [
            ("A", "Remplacer uniquement le cylindre n\u00b0 3 et remettre l'a\u00e9ronef en service"),
            ("B", "Retirer le cylindre, inspecter la soupape et son si\u00e8ge, roder ou remplacer si n\u00e9cessaire, et r\u00e9assembler selon les instructions du fabricant du moteur"),
            ("C", "Faire tourner le vilebrequin de 360\u00b0 et retester ; si la lecture s'am\u00e9liore, il est acceptable de remettre en service"),
            ("D", "Remplacer les quatre cylindres pour maintenir une compression \u00e9quilibr\u00e9e sur tout le moteur"),
        ],
        "correct": "B",
        "explanation": (
            "Lorsque la compression diff\u00e9rentielle montre une fuite confirm\u00e9e par la "
            "soupape d'\u00e9chappement, la proc\u00e9dure correcte est de retirer le cylindre "
            "pour inspection. La soupape et son si\u00e8ge doivent \u00eatre inspect\u00e9s pour "
            "d\u00e9tecter des br\u00fblures, des piq\u00fbres ou une accumulation de carbone. Selon "
            "l'\u00e9tat, le rodage de la soupape ou le remplacement de la soupape/si\u00e8ge peut "
            "\u00eatre n\u00e9cessaire. Le r\u00e9assemblage doit suivre les instructions du fabricant "
            "du moteur (couples de serrage, jeu des segments, etc.). L'option A est "
            "incorrecte car remplacer un seul cylindre sans inspecter la cause premi\u00e8re "
            "est une maintenance incompl\u00e8te."
        ),
        "ref": "Manuel de maintenance Lycoming IO-360, AC 43.13-1B Chapitre 6",
    },
]

# Build PDF
pdf = AMEPracticePDF('P', 'mm', 'A4')
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)
pdf._setup_fonts()

pdf.add_page()

for q in questions:
    pdf.question_block(
        q_num=q["num"],
        topic=q["topic"],
        stem=q["stem"],
        options=q["options"],
        correct=q["correct"],
        explanation=q["explanation"],
        ref=q["ref"],
    )

output_dir = os.path.join(os.path.dirname(__file__), '..', 'public')
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'ame-sample-questions-fr.pdf')
pdf.output(output_path)
print(f'PDF generated: {output_path}')
print(f'Size: {os.path.getsize(output_path)} bytes')
