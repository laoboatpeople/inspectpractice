"""Generate a printable PDF of the 30-day AME exam prep checklist."""

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
        self.cell(CW, 10, '30-Day AME Exam Prep Checklist', align='C')
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
        self.cell(CW, 6, f'Day {day_num}: {day_title}')
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
        'title': 'Assessment & Foundation',
        'subtitle': 'Review the syllabus, take a diagnostic quiz, and identify weak areas.',
        'days': [
            {
                'day': 1,
                'title': 'Download & Review the TP14038E Syllabus',
                'tasks': [
                    "Download the official TP14038E syllabus from Transport Canada's website.",
                    'Read through all five domain outlines: CARs, Standards, Airframe, Powerplant, Electrical.',
                    'Highlight unfamiliar topics for focused study later.',
                ],
            },
            {
                'day': 2,
                'title': 'Take a Full Diagnostic Quiz',
                'tasks': [
                    'Log in to Inspect Practice and take one full diagnostic quiz spanning all domains.',
                    'Record your scores per domain to identify weak areas.',
                    'Review every wrong answer and read the provided explanations.',
                ],
            },
            {
                'day': 3,
                'title': 'Organize Your Study Materials',
                'tasks': [
                    'Gather your references: CARs (current edition), Standard 571, AC43.13-1B, AMM samples.',
                    'Bookmark the Inspect Practice AI Tutor and question bank for daily access.',
                    'Set up a study tracker — print or save this checklist to mark progress.',
                ],
            },
            {
                'day': 4,
                'title': 'CARs Foundations — Parts I & II',
                'tasks': [
                    'Read CAR Part I (General Provisions) — definitions, application, and exemptions.',
                    'Read CAR Part II (Aircraft Identification and Registration).',
                    'Complete 10 practice questions on CARs Parts I and II.',
                ],
            },
            {
                'day': 5,
                'title': 'CARs Part V — Airworthiness',
                'tasks': [
                    'Read CAR Part V (Airworthiness) — certificates, continuing airworthiness, and modifications.',
                    'Pay special attention to Division V (Maintenance Releases) and Division VII (Maintenance Schedule).',
                    'Complete 15 practice questions on Part V.',
                ],
            },
            {
                'day': 6,
                'title': 'CARs Parts VI & VII',
                'tasks': [
                    'Read CAR Part VI (Maintenance) — general maintenance requirements.',
                    'Read CAR Part VII (Approved Maintenance Organizations).',
                    'Complete 15 practice questions on Parts VI and VII.',
                ],
            },
            {
                'day': 7,
                'title': 'Week 1 Review — CARs Assessment',
                'tasks': [
                    'Re-read your Week 1 notes — focus on definitions and key section numbers.',
                    'Take a 30-question CARs mixed quiz on all Parts studied.',
                    'Score target: 70%+ to proceed. If below 70%, re-study and retake.',
                ],
            },
        ],
    },
    {
        'week': 2,
        'title': 'Standards & Airworthiness',
        'subtitle': 'Dive into airframe, powerplant, electrical systems, and human factors.',
        'days': [
            {
                'day': 8,
                'title': 'Standard 571 — Maintenance Overview',
                'tasks': [
                    'Read Standard 571.01–571.03: applicability, definitions, and maintenance schedules.',
                    'Understand the difference between scheduled and unscheduled maintenance.',
                    'Complete 10 practice questions on Standard 571 basics.',
                ],
            },
            {
                'day': 9,
                'title': 'Standard 571 — Repairs & Alterations',
                'tasks': [
                    'Read Standard 571.06 (Repairs) — classification, approval, and data requirements.',
                    'Read Standard 571.07 (Alterations) — major vs minor modifications.',
                    'Complete 15 practice questions on repairs and alterations.',
                ],
            },
            {
                'day': 10,
                'title': 'Standard 571 — Inspection & Certifications',
                'tasks': [
                    'Read Standard 571.04 (Inspection) — annual, 100-hour, and progressive inspections.',
                    'Read Standard 571.05 (Certification) — maintenance releases and sign-offs.',
                    'Complete 10 practice questions on inspections and certifications.',
                ],
            },
            {
                'day': 11,
                'title': 'Standard 593 & 625 — Human Factors',
                'tasks': [
                    'Read Standard 593 (Human Factors) — fatigue, complacency, communication.',
                    'Read Standard 625 (Maintenance Errors) — error types and prevention strategies.',
                    'Complete 10 human factors practice questions.',
                ],
            },
            {
                'day': 12,
                'title': 'Electrical Fundamentals — ATA 24',
                'tasks': [
                    'Study ATA 24 (Electrical Power) — DC and AC systems, batteries, generators, inverters.',
                    'Focus on DC power distribution — 14V vs 28V systems, busses, circuit protection.',
                    'Complete 15 electrical fundamentals practice questions.',
                ],
            },
            {
                'day': 13,
                'title': 'Avionics & Instruments — ATA 34',
                'tasks': [
                    'Study ATA 34 (Navigation & Instruments) — pitot-static systems, gyroscopic instruments.',
                    'Review ATA 23 (Communications) and ATA 33 (Lights).',
                    'Complete 15 avionics and instruments practice questions.',
                ],
            },
            {
                'day': 14,
                'title': 'Week 2 Review — Standards & Systems Exam',
                'tasks': [
                    'Take a 50-question progress exam covering Standards and electrical systems.',
                    'Compare your score against your Week 1 diagnostic.',
                    'List your top 5 weakest subtopics for target study in Week 3.',
                ],
            },
        ],
    },
    {
        'week': 3,
        'title': 'Technical Deep Dive',
        'subtitle': 'Airframe, powerplant, and mixed difficulty challenges.',
        'days': [
            {
                'day': 15,
                'title': 'Hydraulic & Pneumatic Systems — ATA 29',
                'tasks': [
                    'Study ATA 29 (Hydraulic Power) — pumps, actuators, fluids, reservoirs, filters.',
                    'Review ATA 30 (Ice & Rain Protection) — pneumatic systems overview.',
                    'Complete 15 hydraulics and pneumatics practice questions.',
                ],
            },
            {
                'day': 16,
                'title': 'Landing Gear & Brakes — ATA 32',
                'tasks': [
                    'Study ATA 32 (Landing Gear) — retraction systems, struts, wheels, tires, brakes.',
                    'Review ATA 32 anti-skid and auto-brake systems.',
                    'Complete 15 landing gear practice questions.',
                ],
            },
            {
                'day': 17,
                'title': 'Flight Controls & Fuel — ATA 27 & 28',
                'tasks': [
                    'Study ATA 27 (Flight Controls) — primary and secondary controls, trim systems.',
                    'Study ATA 28 (Fuel) — fuel distribution, pumps, valves, quantity indicating.',
                    'Complete 20 mixed flight controls and fuel questions.',
                ],
            },
            {
                'day': 18,
                'title': 'Airframe Structures — ATA 51–57',
                'tasks': [
                    'Study ATA 51 (Structures) and ATA 52 (Doors) — basic structural principles.',
                    'Review ATA 53–57 (Fuselage, Nacelles, Stabilizers, Windows, Wings).',
                    'Complete 25 airframe structures practice questions.',
                ],
            },
            {
                'day': 19,
                'title': 'Powerplant Systems — ATA 71–80',
                'tasks': [
                    'Study ATA 71 (Powerplant) — engine installation, cowling, mounts.',
                    'Review ATA 72–75 (Engine) — reciprocating and turbine engine fundamentals.',
                    'Complete 25 powerplant practice questions.',
                ],
            },
            {
                'day': 20,
                'title': 'Mixed Difficulty Challenge',
                'tasks': [
                    'Set Inspect Practice to HARD difficulty. Take 20 questions.',
                    'Review each answer using the AI Tutor for deeper understanding.',
                    'Spend 30 minutes re-reading Week 1–2 notes on difficult topics.',
                ],
            },
            {
                'day': 21,
                'title': 'Week 3 Review — 60-Question Progress Exam',
                'tasks': [
                    'Take a 60-question progress exam covering all domains studied so far.',
                    'Compare score against Week 1 diagnostic.',
                    'List 5 topics for last-week reinforcement.',
                ],
            },
        ],
    },
    {
        'week': 4,
        'title': 'Exam Simulation',
        'subtitle': 'Full-length timed exams, review wrong answers, final preparation.',
        'days': [
            {
                'day': 22,
                'title': 'Simulation 1 — CARs Exam',
                'tasks': [
                    'Take the CARs simulation: full length, timed, no interruptions.',
                    'Simulate real exam conditions.',
                    'Review all wrong answers in detail.',
                ],
            },
            {
                'day': 23,
                'title': 'Simulation 2 — Standards Exam',
                'tasks': [
                    'Take the Standards 571 simulation: full length, timed.',
                    'Focus on Standard 571.06 (Repairs) and 571.07 (Alterations) questions.',
                    'Log every incorrect question and categorize by subtopic.',
                ],
            },
            {
                'day': 24,
                'title': 'Weak Area Remediation',
                'tasks': [
                    'Review your categorized error log from Simulations 1 & 2.',
                    'Spend 3 hours on top 3 weakest subtopics using AI Tutor.',
                    'Take a 20-question targeted quiz on each weak subtopic until 80%+.',
                ],
            },
            {
                'day': 25,
                'title': 'Simulation 3 — Airframe Exam',
                'tasks': [
                    'Take the Airframe simulation: full length, timed.',
                    'Cover all 12 airframe chapters.',
                    'Log errors, especially on ATA 32 (Landing Gear) and ATA 27 (Flight Controls).',
                ],
            },
            {
                'day': 26,
                'title': 'Simulation 4 — Powerplant Exam',
                'tasks': [
                    'Take the Powerplant simulation: full length, timed.',
                    'Cover all 12 powerplant chapters.',
                    'Compare score vs Simulation 3 to identify remaining weak areas.',
                ],
            },
            {
                'day': 27,
                'title': 'Final Review — Regulations & References',
                'tasks': [
                    'Re-read notes on CARs Parts I, II, V, VI, VII.',
                    'Review Standard 571.06–571.08 classifications.',
                    'Take a final 30-question mixed regulatory quiz. Score target: 85%+.',
                ],
            },
            {
                'day': 28,
                'title': 'Final Review — Technical Domains',
                'tasks': [
                    'Quick-scan all ATA chapters: 20, 24, 25, 27, 28, 32, 33, 34, 51–57, 71–80.',
                    'Review the 10 most common question types encountered.',
                    'Final 30-question mixed technical quiz. Score target: 85%+.',
                ],
            },
            {
                'day': 29,
                'title': 'Rest & Light Review',
                'tasks': [
                    'NO new content. Light review only.',
                    'Prepare exam materials: ID, exam confirmation, calculator.',
                    'Go to bed early. Aim for 8 hours of sleep.',
                ],
            },
            {
                'day': 30,
                'title': 'Exam Day!',
                'tasks': [
                    'Eat a good breakfast. Arrive 30 minutes early.',
                    'Trust your preparation.',
                    'Read each question carefully. Manage your time.',
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
    pdf.cell(CW, 8, f'Week {week_data["week"]}: {week_data["title"]}', align='C')
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
output_path = os.path.join(output_dir, 'study-checklist-30-day.pdf')
pdf.output(output_path)
print(f'PDF generated: {output_path}')
print(f'Size: {os.path.getsize(output_path)} bytes')
