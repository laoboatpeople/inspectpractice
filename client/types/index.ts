// Inspect Practice — Shared Types

export type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
export type Plan = 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';
export type SubStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
export type QType = 'MCQ' | 'TRUEFALSE' | 'WRITTEN';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  lastActiveAt?: string;
  subscription?: Subscription;
}

export interface UserWithStats extends User {
  _count?: {
    examAttempts?: number;
  };
  avgScore?: number;
  passRate?: number;
  studyStreak?: number;
  examAttempts?: ExamAttempt[];
  recentActivity?: ActivityLog[];
  examProgress?: ExamProgress[];
  adminMetrics?: AdminMetrics;
  dashboardStats?: DashboardStats;
  chatSessions?: ChatSessionSummary[];
}

export interface ChatSessionSummary {
  id: string;
  topic: string | null;
  source: string;
  updatedAt: string;
  _count: { messages: number };
}

export interface DashboardStats {
  totalExams: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  studyStreak: number;
  byExam: {
    examId: string;
    examCode: string;
    examName: string;
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    lastScore: number;
    passedCount: number;
    passRate: number;
  }[];
  recentAttempts: {
    id: string;
    examId: string;
    examName: string;
    examCode: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
    timeSpent: number;
    passed: boolean;
    completedAt: string;
  }[];
  bestScore: number;
  examsPassedUnique: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  momentum: number;
  lastAttemptAt: string | null;
}

export interface AdminMetrics {
  logins: {
    total: number;
    lastAt: string | null;
    uniqueIps: number;
    recent: { ip: string | null; at: string; method: string | null }[];
  };
  billing: {
    checkouts: { plan: string | null; at: string }[];
    cancellations: { at: string }[];
    estimatedRevenue: number;
    subscriptionHistory: {
      id: string;
      plan: string;
      status: string;
      currentPeriodStart: string;
      currentPeriodEnd: string;
      createdAt: string;
    }[];
  };
  risk: {
    signals: { level: 'high' | 'medium' | 'low'; label: string }[];
    daysSinceLastLogin: number | null;
    daysSinceSignup: number;
  };
}

export interface ExamProgress {
  examId: string;
  examCode: string;
  examName: string;
  passingScore: number;
  totalAttempts: number;
  bestScore: number;
  avgScore: number;
  lastScore: number;
  lastPassed: boolean;
  trend: 'up' | 'down' | 'stable';
  recentScores: { score: number; passed: boolean; completedAt: string }[];
}

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  code: string;
  name: string;
  description?: string;
  country: string;
  licenseType: string;
  isActive: boolean;
  createdAt: string;
  // Exam settings (backend may not have these yet)
  timeLimit?: number;
  passingScore?: number;
  questionsPerSimulation?: number;
  randomizeOrder?: boolean;
  chapters?: Chapter[];
  _count?: { chapters: number; questions: number };
}

export interface ChapterWithStats extends Chapter {
  _count?: { questions: { approved: number; pending: number; rejected: number } | number };
  questionCounts?: { approved: number; pending: number; rejected: number };
}

export interface Chapter {
  id: string;
  examId: string;
  number: number;
  name: string;
  isActive: boolean;
  questionCount?: number;
}

export interface Question {
  id: string;
  examId: string;
  chapterId: string;
  type: QType;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  status: QStatus;
  aiSource?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  chapterName?: string;
  examName?: string;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpent: number;
  completedAt: string;
  user?: User;
  exam?: Exam;
}

export interface Content {
  id: string;
  filename: string;
  filepath: string;
  examId?: string;
  chapterId?: string;
  pages: number;
  uploadedAt: string;
  size?: number;        // bytes, returned by API
  examName?: string;    // joined from exam relation
  chapterName?: string; // joined from chapter relation
}

export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
  user?: User;
}

export interface AnalyticsOverview {
  totalUsers: number;
  userGrowth: number;
  activeSubscriptions: number;
  totalExams: number;
  passRate: number;
  recentActivity: ActivityLog[];
}

export interface UserGrowth {
  date: string;
  count: number;
}

export interface ExamStats {
  exam: string;
  rate: number;
  attempts: number;
}

export interface FailedQuestion {
  id: string;
  question: string;
  difficulty: string;
  passRate: number;
  totalAttempts: number;
  failCount: number;
  examCode: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface DifficultyDistribution {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  count: number;
}

export interface ExamPassRate {
  examCode: string;
  passRate: number;
  totalAttempts: number;
}

export interface TopPerformer {
  userId: string;
  name: string;
  email: string;
  examCount: number;
  avgScore: number;
  rank: number;
}

export interface GenerateQuestionsRequest {
  examId: string;
  chapterIds: string[];
  count: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
  type: 'MCQ' | 'TRUEFALSE' | 'WRITTEN' | 'MIXED';
}

export type TransactionStatus = 'succeeded' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency?: string;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  plan?: Plan;
}
