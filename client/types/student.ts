// Inspect Practice — Student-facing types (web app)

export interface StudentExamCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  country: string;
  licenseType: string;
  timeLimit: number | null;
  passingScore: number | null;
  questionsPerSimulation: number | null;
  randomizeOrder: boolean;
  chapterCount: number;
  questionCount: number;
  locked?: boolean;
  simulationLocked?: boolean;
}

export interface StudentChapter {
  id: string;
  number: number;
  name: string;
  questionCount: number;
  syllabusRef: string | null;
  licenseScope: string;
}

export interface QuizQuestion {
  id: string;
  type: 'MCQ' | 'TRUEFALSE' | 'WRITTEN';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  chapterId: string | null;
  chapter: string | null;
}

export interface QuizResponse {
  data: QuizQuestion[];
  exam: {
    id: string;
    name: string;
    code: string;
    passingScore: number;
    timeLimit: number | null;
    questionsPerSimulation: number | null;
  };
  totalAvailable: number;
}

export interface ExamAttemptResult {
  id: string;
  examId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpent: number;
  passed: boolean;
  completedAt: string;
}

export interface UserExamAttempt {
  id: string;
  examId: string;
  examName: string;
  examNameFr: string;
  examCode: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpent: number;
  passed: boolean;
  completedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN' | 'INSTRUCTOR';
  isActive: boolean;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  topic: string;
  messageCount: number;
  createdAt: string;
}

export interface ExamPerformance {
  examId: string;
  examCode: string;
  examName: string;
  examNameFr: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  lastScore: number;
  passedCount: number;
  passRate: number;
}

export interface ChapterStat {
  chapterId: string;
  chapterNumber: number;
  chapterName: string;
  chapterNameFr: string;
  examId: string;
  examCode: string;
  examName: string;
  examNameFr: string;
  correct: number;
  total: number;
  attempted: number;
  percentage: number;
}

export interface StudentStats {
  totalExams: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  studyStreak: number;
  byExam: ExamPerformance[];
  recentAttempts: UserExamAttempt[];
  bestScore: number;
  examsPassedUnique: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  momentum: number;
  lastAttemptAt: string | null;
  chapterPerformance: ChapterStat[];
  strengths: ChapterStat[];
  weaknesses: ChapterStat[];
  needsReview: ChapterStat[];
}
