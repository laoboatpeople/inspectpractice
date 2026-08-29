import { Router, Request, Response } from 'express';
import PDFDocument from 'pdfkit';

const router = Router();

const weeks = [
  {
    week: 1,
    title: 'Assessment & Foundation',
    subtitle: 'Review the ICC B1 exam outline, take a diagnostic quiz, and identify weak areas.',
    days: [
      {
        day: 1,
        title: 'Download & Review the ICC B1 Exam Outline',
        tasks: [
          "Download the official ICC B1 Residential Building Inspector exam outline from the ICC website (iccsafe.org).",
          'Read through the exam content areas: Code Administration, Building Planning, Footings & Foundations, Floors, Walls, Roof/Ceiling, and Public Safety.',
          'Highlight unfamiliar topics for focused study later.',
        ],
      },
      {
        day: 2,
        title: 'Take a Full Diagnostic Quiz',
        tasks: [
          'Log in to Inspect Practice and take one full diagnostic quiz spanning all content areas.',
          'Record your scores per content area to identify weak areas.',
          'Review every wrong answer and read the provided explanations.',
        ],
      },
      {
        day: 3,
        title: 'Organize Your Study Materials',
        tasks: [
          'Gather your references: the current International Residential Code (IRC) and the ICC B1 exam outline.',
          'Bookmark the Inspect Practice AI Tutor and question bank for daily access.',
          'Set up a study tracker — print or save this checklist to mark progress.',
        ],
      },
      {
        day: 4,
        title: 'Code Administration — IRC Chapter 1',
        tasks: [
          'Read IRC Chapter 1 (Scope and Administration) — purpose, applicability, and definitions.',
          'Study permit requirements and the mandatory inspections an inspector must perform.',
          'Take the Code Administration mini-quiz on Inspect Practice (15 questions, timed).',
        ],
      },
      {
        day: 5,
        title: 'Building Planning — IRC Chapter 3 (Part 1)',
        tasks: [
          'Study occupancy and use, light and ventilation, and minimum room area requirements.',
          'Focus on ceiling heights, glazing, and safety glass requirements.',
          'Complete 20 Building Planning practice questions.',
        ],
      },
      {
        day: 6,
        title: 'Building Planning — IRC Chapter 3 (Part 2)',
        tasks: [
          'Study means of egress — egress doors, egress windows, and emergency escape and rescue openings.',
          'Understand stairway and ramp requirements, plus guards.',
          'Take a mixed 25-question quiz across Code Administration and Building Planning.',
        ],
      },
      {
        day: 7,
        title: 'Week 1 Review & Weak Area Deep Dive',
        tasks: [
          'Revisit your diagnostic scores from Day 2 — which content areas need the most work?',
          'Spend 2 hours on your weakest topic from this week.',
          'Take a 30-question progress quiz and aim for 70%+.',
        ],
      },
    ],
  },
  {
    week: 2,
    title: 'Deep Study',
    subtitle: 'Focus on IRC footings & foundations and floor framing.',
    days: [
      {
        day: 8,
        title: 'Footings & Foundations — IRC Chapter 4 (Part 1)',
        tasks: [
          'Study footing requirements (R403) — size, depth, and reinforcement.',
          'Understand soil bearing capacity and frost protection.',
          'Complete 20 Foundations practice questions on Inspect Practice.',
        ],
      },
      {
        day: 9,
        title: 'Footings & Foundations — IRC Chapter 4 (Part 2)',
        tasks: [
          'Study foundation walls (R404) — concrete and masonry construction.',
          'Learn dampproofing, waterproofing, and foundation drainage requirements.',
          'Take a 15-question quiz focused on foundation wall inspection.',
        ],
      },
      {
        day: 10,
        title: 'Foundations — Wood, Termite & Anchorage',
        tasks: [
          'Review wood foundations and termite protection provisions.',
          'Study foundation anchorage and hold-down requirements.',
          'Complete 20 foundation-related practice questions.',
        ],
      },
      {
        day: 11,
        title: 'Floors — IRC Chapter 5 (Part 1)',
        tasks: [
          'Study floor framing (R502) — joists, girders, and cantilevers.',
          'Review allowable joist spans, notching, and boring limitations.',
          'Complete 20 floor framing practice questions.',
        ],
      },
      {
        day: 12,
        title: 'Floors — IRC Chapter 5 (Part 2)',
        tasks: [
          'Study floor sheathing and under-floor inspection requirements.',
          'Review concrete slabs on grade and vapor barriers.',
          'Take a mixed 20-question quiz on floors and foundations.',
        ],
      },
      {
        day: 13,
        title: 'Code Administration & Inspection Records',
        tasks: [
          'Review inspection scheduling, right of entry, and notice of violation procedures.',
          'Study certificate of occupancy and records/reporting duties.',
          'Take a 25-question mixed quiz on administration and foundations.',
        ],
      },
      {
        day: 14,
        title: 'Week 2 Review — Mixed Domain Quiz',
        tasks: [
          'Take a 50-question mixed exam covering Code Administration, Building Planning, Foundations, and Floors.',
          'Review all wrong answers in detail — write notes on misunderstood concepts.',
          'Identify your three weakest subtopics and plan extra study for next week.',
        ],
      },
    ],
  },
  {
    week: 3,
    title: 'Practice Mode',
    subtitle: 'Daily quizzes, AI Tutor, and mixed difficulty practice.',
    days: [
      {
        day: 15,
        title: 'Daily Quiz Mode — 30 Questions',
        tasks: [
          'Set Inspect Practice to Quiz Mode: 30 questions, mixed difficulty, no time limit.',
          'Focus on your three weakest subtopics identified on Day 14.',
          'Use the AI Tutor to explain every question you get wrong.',
        ],
      },
      {
        day: 16,
        title: 'AI Tutor Session — Wall Framing Focus',
        tasks: [
          'Open the Inspect Practice AI Tutor and ask for explanations on wall framing topics.',
          'Cover: studs and headers, wall bracing, shear walls, and exterior wall coverings.',
          'Ask the AI Tutor to generate 10 custom practice questions on weak areas.',
        ],
      },
      {
        day: 17,
        title: 'Timed Quiz — 40 Questions in 45 Minutes',
        tasks: [
          'Set Inspect Practice to Timed Mode: 40 questions, 45-minute timer.',
          'Simulate real exam pressure — no phone, no notes, no interruptions.',
          'Review results immediately. Flag any questions you guessed on for follow-up.',
        ],
      },
      {
        day: 18,
        title: 'Walls — IRC Chapter 6 (Part 1)',
        tasks: [
          'Study wall framing (R602) — stud size and spacing, headers, and openings.',
          'Review wall bracing and shear wall requirements.',
          'Complete 25 wall framing practice questions.',
        ],
      },
      {
        day: 19,
        title: 'Walls & Roof/Ceiling — IRC Chapters 6-8',
        tasks: [
          'Study exterior and interior wall coverings, plus fire separation.',
          'Review roof and ceiling framing (R802) — rafters, ceiling joists, and collar ties.',
          'Complete 25 roof and ceiling practice questions.',
        ],
      },
      {
        day: 20,
        title: 'Mixed Difficulty Challenge',
        tasks: [
          'Set Inspect Practice to HARD difficulty. Take 20 questions.',
          'Review each answer — wrong or right — using the AI Tutor for deeper understanding.',
          'Spend 30 minutes re-reading your notes from Weeks 1–2 on topics you still find difficult.',
        ],
      },
      {
        day: 21,
        title: 'Week 3 Review — 60-Question Progress Exam',
        tasks: [
          'Take a 60-question progress exam covering all content areas studied so far.',
          'Score analysis: compare against your Week 1 diagnostic.',
          'Celebrate improvements and list 5 topics for last-week reinforcement.',
        ],
      },
    ],
  },
  {
    week: 4,
    title: 'Exam Simulation',
    subtitle: 'Full-length timed exams, review wrong answers, final preparation.',
    days: [
      {
        day: 22,
        title: 'Simulation 1 — Code Administration Exam',
        tasks: [
          'Take the Code Administration simulation: full length, timed, no interruptions.',
          'Simulate real exam conditions — open book with your IRC, like the real ICC exam.',
          'Score yourself and review all wrong answers in detail.',
        ],
      },
      {
        day: 23,
        title: 'Simulation 2 — Building Planning Exam',
        tasks: [
          'Take the Building Planning simulation: full length, timed.',
          'Focus on means of egress, glazing, and stairway questions.',
          'Log every question you answered incorrectly and categorize by subtopic.',
        ],
      },
      {
        day: 24,
        title: 'Weak Area Remediation',
        tasks: [
          'Review your categorized error log from Simulations 1 & 2.',
          'Spend 3 hours on your top 3 weakest subtopics using AI Tutor and reference materials.',
          'Take a 20-question targeted quiz on each weak subtopic until you score 80%+.',
        ],
      },
      {
        day: 25,
        title: 'Simulation 3 — Foundations & Floors Exam',
        tasks: [
          'Take the Foundations & Floors simulation: full length, timed.',
          'Cover footings, foundation walls, and floor framing content.',
          'Score and log errors, especially on IRC Chapters 4-5 topics.',
        ],
      },
      {
        day: 26,
        title: 'Simulation 4 — Walls & Roof/Ceiling Exam',
        tasks: [
          'Take the Walls & Roof/Ceiling simulation: full length, timed.',
          'Cover wall framing, bracing, and roof framing content.',
          'Compare your score against Simulation 3 — which technical domain needs more work?',
        ],
      },
      {
        day: 27,
        title: 'Final Review — Public Safety & Code Administration',
        tasks: [
          'Re-read your notes on means of egress and fire safety — focus on areas where you lost points.',
          'Review public safety topics: egress doors and windows, stair geometry, guards, smoke alarms.',
          'Take a final 30-question mixed regulatory quiz. Score target: 85%+.',
        ],
      },
      {
        day: 28,
        title: 'Final Review — Technical Domains',
        tasks: [
          'Quick-scan the IRC chapters you studied: 1, 3, 4, 5, 6, 7, 8.',
          'Review the 10 most common question types you encountered.',
          'Final 30-question mixed technical quiz. Score target: 85%+.',
        ],
      },
      {
        day: 29,
        title: 'Rest & Light Review',
        tasks: [
          'NO new content. Light review only — skim notes, revisit your strongest topics.',
          'Prepare your exam materials: ID, exam confirmation, calculator, and your tabbed IRC.',
          'Go to bed early. Aim for 8 hours of sleep.',
        ],
      },
      {
        day: 30,
        title: 'Exam Day!',
        tasks: [
          'Eat a good breakfast. Arrive 30 minutes early.',
          'Trust your preparation — you have put in the work.',
          'Read each question carefully. Manage your time. You have trained for this.',
        ],
      },
    ],
  },
];

/**
 * GET /api/checklist/pdf
 * Public endpoint — no auth required.
 * Generates and returns a downloadable PDF of the 30-Day ICC Building Inspector Study Checklist.
 */
router.get('/pdf', async (_req: Request, res: Response): Promise<void> => {
  try {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: '30-Day ICC Building Inspector Exam Prep Checklist',
        Author: 'Inspect Practice',
        Subject: 'ICC Certification Exam Preparation',
      },
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="30-day-icc-exam-prep-checklist.pdf"');

    // Pipe the PDF to the response
    doc.pipe(res);

    // ── Title Page ─────────────────────────────────────────────
    doc.font('Helvetica-Bold')
      .fontSize(26)
      .text('30-Day ICC Building Inspector Exam Prep Checklist', { align: 'center' });

    doc.moveDown(0.5);
    doc.font('Helvetica')
      .fontSize(13)
      .fillColor('#555555')
      .text('A day-by-day study plan to prepare for your International Code', { align: 'center' })
      .text('Council building inspector certification exams. Print it, check it, pass it.', { align: 'center' });

    doc.moveDown(1.5);
    doc.fontSize(14)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text('The Four-Week Structure', { align: 'center' });

    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(11).fillColor('#333333');

    const weekDescriptions = [
      'Week 1: Assessment & Foundation — Review the ICC B1 exam outline, take a diagnostic quiz, identify your weak areas, and build a solid Code Administration and Building Planning foundation.',
      'Week 2: Deep Study — Dive into IRC footings & foundations and floor framing — the technical domains at the core of the B1 exam.',
      'Week 3: Practice Mode — Shift from passive reading to active recall with daily quizzes, AI Tutor sessions, and timed practice exams on walls and roof/ceiling framing.',
      'Week 4: Exam Simulation — Take full-length, timed exam simulations, review every wrong answer, target weak areas, and arrive on exam day fully prepared.',
    ];

    for (const desc of weekDescriptions) {
      doc.text(`•  ${desc}`, { indent: 30, align: 'left' });
      doc.moveDown(0.3);
    }

    doc.moveDown(1);

    // ── Checklist Content ────────────────────────────────────────
    for (const week of weeks) {
      // Check if we need a new page before starting a week section
      if (doc.y > 550) {
        doc.addPage();
      }

      // Week header
      doc.font('Helvetica-Bold')
        .fontSize(16)
        .fillColor('#1a56db')
        .text(`Week ${week.week}: ${week.title}`);

      doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#555555')
        .text(week.subtitle);

      doc.moveDown(0.5);

      // Separator line
      doc.moveTo(50, doc.y)
        .lineTo(562, doc.y)
        .strokeColor('#cccccc')
        .stroke();

      doc.moveDown(0.5);

      // Days
      for (const day of week.days) {
        // Check page break for each day entry
        if (doc.y > 680) {
          doc.addPage();
        }

        // Day box background
        const dayStartY = doc.y;

        // Day header
        doc.font('Helvetica-Bold')
          .fontSize(11)
          .fillColor('#000000')
          .text(`Day ${day.day}: ${day.title}`);

        // Tasks
        doc.font('Helvetica')
          .fontSize(9.5)
          .fillColor('#333333');

        for (const task of day.tasks) {
          if (doc.y > 710) {
            doc.addPage();
          }
          doc.text(`☐  ${task}`, { indent: 15, align: 'left' });
          doc.moveDown(0.15);
        }

        doc.moveDown(0.4);
      }

      doc.moveDown(0.5);
    }

    // ── Tips Section ─────────────────────────────────────────────
    if (doc.y > 600) {
      doc.addPage();
    }

    doc.moveDown(1);
    doc.font('Helvetica-Bold')
      .fontSize(14)
      .fillColor('#000000')
      .text('Tips for Maximizing This Checklist', { align: 'center' });

    doc.moveDown(0.5);

    const tips = [
      '1. Consistency over intensity: Studying 2 hours every day is vastly more effective than cramming 8 hours on weekends.',
      '2. Active recall beats re-reading: Every time you read a chapter, follow it with practice questions.',
      '3. Track your weak areas: After every quiz, log the topics you got wrong. Spend the next day reviewing them.',
      '4. Simulate real exam conditions: In Week 4, take simulations in a quiet room with no phone, no notes, and a strict timer.',
      '5. Use the Inspect Practice AI Tutor: When a concept does not click, ask the AI Tutor to explain it in plain language.',
    ];

    doc.font('Helvetica').fontSize(10).fillColor('#333333');
    for (const tip of tips) {
      doc.text(tip, { indent: 15, align: 'left' });
      doc.moveDown(0.3);
    }

    // ── Footer ─────────────────────────────────────────────────
    doc.moveDown(2);
    doc.fontSize(8)
      .fillColor('#999999')
      .text('Inspect Practice — inspectpractice.com', { align: 'center' })
      .text('Not affiliated with the International Code Council. Built for building inspector candidates, by inspectors.', { align: 'center' });

    // Finalize
    doc.end();
  } catch (err) {
    console.error('[Checklist PDF] Generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF.' });
  }
});

export default router;
