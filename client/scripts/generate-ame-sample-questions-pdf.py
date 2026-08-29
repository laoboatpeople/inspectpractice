"""Generate a PDF of 10 AME sample practice questions with answers and explanations."""

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
        self.cell(CW, 7, 'Free AME Practice Questions \u2014 Inspect Practice', align='C')
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
        self.cell(CW, 5, f'Correct: {correct}')
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
        self.cell(CW, 5, f'Ref: {ref}')
        self.ln(6)

        # End-of-question separator
        self.set_draw_color(203, 213, 225)
        self.set_line_width(0.5)
        self.line(CX, self.get_y(), CX + CW, self.get_y())
        self.ln(5)


questions = [
    {
        "num": 1,
        "topic": "CARs \u2014 Regulations",
        "stem": (
            "According to CAR 571.02, which of the following circumstances requires "
            "a maintenance release (MR) to be completed before the aircraft is returned to service?"
        ),
        "options": [
            ("A", "Replacement of a landing gear tire with a serviceable tire of the same part number"),
            ("B", "Performance of a scheduled 50-hour inspection as specified in the approved maintenance schedule"),
            ("C", "Addition of engine oil between scheduled changes when the quantity is within limits"),
            ("D", "Installation of an Auxiliary Power Unit (APU) that has already been certified as serviceable by the manufacturer"),
        ],
        "correct": "B",
        "explanation": (
            "Under CAR 571.02, a maintenance release is required after any maintenance that is not a minor "
            "scheduled servicing task. A scheduled 50-hour inspection is a maintenance task performed in "
            "accordance with an approved maintenance schedule (CAR 571.06) and requires an MR certifying "
            "that the work was completed in accordance with the applicable standards. Options A, C, and D "
            "are considered elementary work or minor servicing that does not require an MR per CAR 571.02(2)."
        ),
        "ref": "CAR 571.02, CAR 571.06",
    },
    {
        "num": 2,
        "topic": "CARs \u2014 Regulations",
        "stem": (
            "Under CAR Part II, Subpart 2 (Aircraft Registration), an aircraft that is operated in Canada must "
            "be registered in the name of the owner. Which of the following is a condition under which a "
            "certificate of registration ceases to be valid?"
        ),
        "options": [
            ("A", "The aircraft undergoes a major repair to a primary structure"),
            ("B", "The aircraft is operated outside of Canada for more than 30 consecutive days"),
            ("C", "The registration certificate expires 12 months after the date of issue"),
            ("D", "The owner ceases to be the owner or the legal title to the aircraft is transferred"),
        ],
        "correct": "D",
        "explanation": (
            "Per CAR 202.32, a certificate of registration ceases to be valid when the owner ceases to be the "
            "owner (i.e., the aircraft is sold or legal title is transferred). A certificate of registration "
            "does not expire after 12 months \u2014 it remains valid until the owner changes, the aircraft is "
            "deregistered, or the owner requests cancellation."
        ),
        "ref": "CAR 202.32, CAR Part II Subpart 2",
    },
    {
        "num": 3,
        "topic": "Standards 571 \u2014 Maintenance Standards",
        "stem": (
            "Under Transport Canada Standard 571, which of the following is true regarding the approval of "
            "maintenance schedules for Canadian-registered aircraft?"
        ),
        "options": [
            ("A", "All maintenance schedules must be approved by the Minister before they can be used"),
            ("B", "Maintenance schedules may be developed by the AMO and do not require approval if based on manufacturer recommendations"),
            ("C", "Only maintenance schedules published by Transport Canada are acceptable for use in an approved maintenance organization"),
            ("D", "Maintenance schedules must be reviewed and re-approved every 12 months"),
        ],
        "correct": "A",
        "explanation": (
            "Standard 571.03 requires that every aircraft be maintained in accordance with a maintenance "
            "schedule that has been approved by the Minister (Transport Canada). While manufacturers provide "
            "recommendations, the formal maintenance schedule itself requires ministerial approval to be used "
            "in Canadian aircraft operations."
        ),
        "ref": "Standard 571.03",
    },
    {
        "num": 4,
        "topic": "Standards 571 \u2014 Technical Records",
        "stem": (
            "According to Standard 571.10, how long must technical records for a Canadian-registered aircraft "
            "be retained after the work is completed?"
        ),
        "options": [
            ("A", "1 year after the work is completed"),
            ("B", "Until the next scheduled maintenance inspection"),
            ("C", "2 years after the work is completed"),
            ("D", "For the life of the component or until the aircraft is permanently withdrawn from service"),
        ],
        "correct": "D",
        "explanation": (
            "Standard 571.10 requires that technical records be retained for the life of the component, or "
            "until the aircraft or component is permanently withdrawn from service. Records include maintenance "
            "releases, work orders, and modification records. This ensures full traceability of every "
            "maintenance action throughout the aircraft\u2019s operational life."
        ),
        "ref": "Standard 571.10",
    },
    {
        "num": 5,
        "topic": "Airframe \u2014 Landing Gear",
        "stem": (
            "During a retraction test of a main landing gear on a transport category aircraft, the gear fails "
            "to lock in the down position. What is the MOST likely cause if the hydraulic system pressure is "
            "within limits?"
        ),
        "options": [
            ("A", "A failed downlock microswitch"),
            ("B", "Insufficient hydraulic fluid return flow"),
            ("C", "A damaged or misadjusted downlock spring or actuator mechanism"),
            ("D", "Excessively high ambient temperature causing viscosity loss"),
        ],
        "correct": "C",
        "explanation": (
            "When hydraulic pressure is normal but the gear does not lock down, the mechanical downlock "
            "mechanism is the primary suspect. The downlock spring or mechanical actuator physically holds "
            "the gear in the extended position. A failed microswitch affects the indication (lights/warnings), "
            "not the actual locking function."
        ),
        "ref": "ATA 32 \u2014 Landing Gear, AMM Chapter 32",
    },
    {
        "num": 6,
        "topic": "Airframe \u2014 Structures",
        "stem": (
            "According to AC 43.13-1B, what is the minimum edge distance for a single row of flush rivets "
            "in an aluminium alloy sheet repair?"
        ),
        "options": [
            ("A", "2 times the rivet diameter"),
            ("B", "2.5 times the rivet diameter"),
            ("C", "3 times the rivet diameter"),
            ("D", "4 times the rivet diameter"),
        ],
        "correct": "B",
        "explanation": (
            "AC 43.13-1B Chapter 4 specifies a minimum edge distance (distance from the centre of the rivet "
            "hole to the edge of the sheet) of 2.5 times the rivet diameter for a single row of flush rivets "
            "on aluminium alloy structures. For a double row, the minimum edge distance increases to 3 times "
            "the rivet diameter."
        ),
        "ref": "AC 43.13-1B, Chapter 4, Table 4-1",
    },
    {
        "num": 7,
        "topic": "Powerplant \u2014 Turbine Engines",
        "stem": (
            "During a hot section inspection on a Pratt & Whitney PT6A turboprop engine, you find several "
            "turbine blades with heavy sulphidation corrosion. What is the MOST appropriate action?"
        ),
        "options": [
            ("A", "Blend the affected areas with a fine abrasive pad and return the blades to service"),
            ("B", "Replace only the most heavily corroded blade and rebalance the turbine assembly"),
            ("C", "Replace all affected blades in the stage as a set, or follow the engine manual instructions"),
            ("D", "Apply a protective coating to the corroded area and continue operation at reduced power"),
        ],
        "correct": "C",
        "explanation": (
            "Turbine blades with sulphidation corrosion must be handled in accordance with the engine "
            "manufacturer\u2019s manual. Depending on the extent of corrosion, the manual may require replacement "
            "of all blades in a stage as a set to maintain dynamic balance and aerodynamic consistency. "
            "Blending is generally not permitted on turbine airfoils with structural corrosion damage."
        ),
        "ref": "ATA 72 \u2014 Engine (Turbine), P&WC PT6A Maintenance Manual",
    },
    {
        "num": 8,
        "topic": "Powerplant \u2014 Propellers",
        "stem": (
            "When troubleshooting a constant-speed propeller that does not feather during a ground feathering "
            "check, which of the following is the MOST likely cause if the propeller will unfeather normally?"
        ),
        "options": [
            ("A", "Low engine oil pressure"),
            ("B", "A seized propeller governor feathering valve solenoid"),
            ("C", "A restricted propeller dome counterweight linkage"),
            ("D", "Excessive governor boost pressure preventing the propeller from moving to feather"),
        ],
        "correct": "A",
        "explanation": (
            "Constant-speed propellers use engine oil pressure to move toward fine pitch (low pitch/high RPM) "
            "and centrifugal counterweights or springs to move toward coarse pitch/feather. If the propeller "
            "will not feather but unfeathers normally, it suggests insufficient oil pressure to overcome the "
            "feathering spring force. The governor feathering valve solenoid is electrical \u2014 if seized, it "
            "would affect both feathering and unfeathering."
        ),
        "ref": "ATA 61 \u2014 Propellers, Hartzell/McCauley Maintenance Manuals",
    },
    {
        "num": 9,
        "topic": "Electronics \u2014 Electrical Power",
        "stem": (
            "A technician is troubleshooting an intermittent failure in a VHF communication transceiver. The "
            "pilot reports that the radio works intermittently and sometimes fails completely during flight. "
            "The antenna, coax cable, and connectors have all been tested and are within limits. What should "
            "the technician check NEXT?"
        ),
        "options": [
            ("A", "Replace the transceiver with a known-good unit"),
            ("B", "Check the transceiver\u2019s power supply voltage and current draw during operation"),
            ("C", "Perform a bonding and grounding check of the radio rack and airframe ground path"),
            ("D", "Inspect the aircraft\u2019s ELT for interference on the VHF band"),
        ],
        "correct": "C",
        "explanation": (
            "When the antenna system checks out but the radio is intermittent, intermittent bonding or "
            "grounding of the radio rack is a common cause. A poor ground path can cause erratic behaviour "
            "as vibration and temperature changes affect the connection. Checking the radio rack\u2019s bond to "
            "the airframe ground (typically less than 2.5 milliohms per MIL-STD-464) should be done before "
            "swapping components."
        ),
        "ref": "ATA 23 \u2014 Communications, AC 43.13-1B Chapter 11",
    },
    {
        "num": 10,
        "topic": "Mixed Scenario",
        "stem": (
            "A Cessna 172R is brought in for its annual inspection. The engine is a Lycoming IO-360. During "
            "compression check, cylinder #3 shows 30/80 psi while the rest are 72/80 or higher. The technician "
            "performs a differential compression test and confirms leakage through the exhaust valve. What is "
            "the correct course of action?"
        ),
        "options": [
            ("A", "Replace only cylinder #3 and return the aircraft to service"),
            ("B", "Remove the cylinder, inspect the valve and seat, lap or replace as necessary, and reassemble per the engine manufacturer\u2019s instructions"),
            ("C", "Rotate the crankshaft 360\u00b0 and re-test; if the reading improves, it is acceptable to return to service"),
            ("D", "Replace all four cylinders to maintain balanced compression across the engine"),
        ],
        "correct": "B",
        "explanation": (
            "When differential compression shows leakage confirmed through the exhaust valve, the correct "
            "procedure is to remove the cylinder for inspection. The valve and seat must be inspected for "
            "burns, pitting, or carbon buildup. Depending on the condition, lapping the valve or replacing "
            "the valve/seat may be required. Reassembly must follow the engine manufacturer\u2019s instructions "
            "(torque values, ring gap, etc.). Option A is incorrect because replacing only one cylinder "
            "without inspecting the root cause is incomplete maintenance."
        ),
        "ref": "Lycoming IO-360 Maintenance Manual, AC 43.13-1B Chapter 6",
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
output_path = os.path.join(output_dir, 'ame-sample-questions.pdf')
pdf.output(output_path)
print(f'PDF generated: {output_path}')
print(f'Size: {os.path.getsize(output_path)} bytes')
