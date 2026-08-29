import type {
  StudentExamCategory,
  StudentChapter,
  QuizResponse,
  ExamAttemptResult,
  UserExamAttempt,
  UserProfile,
  ChatSession,
  ChatMessage,
  StudentStats,
} from '@/types/student';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem('token');
  return null;
}

function getLocale(): string {
  if (typeof window !== 'undefined') return localStorage.getItem('inspectpractice:locale') || 'en';
  return 'en';
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    const e = new Error(err.message || `HTTP ${res.status}`) as Error & { code?: string; status?: number };
    e.code = err.code;
    e.status = res.status;
    throw e;
  }
  return res.json();
}

// ─── Public endpoints ─────────────────────────────────────

export async function getStudentExamCategories(): Promise<StudentExamCategory[]> {
  const locale = getLocale();
  const res = await request<{ data: StudentExamCategory[] }>(`/api/student/exam-categories?locale=${locale}`);
  return res.data;
}

export async function getStudentExamChapters(examId: string): Promise<StudentChapter[]> {
  const locale = getLocale();
  const res = await request<{ data: StudentChapter[] }>(`/api/student/exam-categories/${examId}/chapters?locale=${locale}`);
  return res.data;
}

export async function getStudentQuiz(
  examId: string,
  count = 10,
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD',
  chapterId?: string,
  mode?: 'practice' | 'exam'
): Promise<QuizResponse> {
  const locale = getLocale();
  const params = new URLSearchParams({ count: String(count), locale });
  if (difficulty) params.set('difficulty', difficulty);
  if (chapterId) params.set('chapterId', chapterId);
  if (mode) params.set('mode', mode);
  return request<QuizResponse>(`/api/student/exams/${examId}/quiz?${params}`);
}

// ─── Protected endpoints ──────────────────────────────────

export async function getMe(): Promise<UserProfile> {
  return request<UserProfile>('/api/auth/me');
}

export async function submitExamAttempt(
  examId: string,
  answers: { questionId: string; userAnswer: string }[],
  timeSpent?: number,
  totalQuestions?: number,
  mode?: 'practice' | 'exam'
): Promise<ExamAttemptResult> {
  return request<ExamAttemptResult>('/api/student/exam-attempts', {
    method: 'POST',
    body: JSON.stringify({
      examId,
      answers,
      ...(timeSpent != null ? { timeSpent } : {}),
      ...(totalQuestions != null ? { totalQuestions } : {}),
      ...(mode != null ? { mode } : {}),
    }),
  });
}

export async function getStudentAttempts(): Promise<UserExamAttempt[]> {
  // We need a student-specific attempts endpoint
  const res = await request<{ data: UserExamAttempt[] }>('/api/student/attempts');
  return res.data;
}

export async function getStudentStats(): Promise<StudentStats> {
  return request<StudentStats>('/api/student/stats');
}

export async function resetStudentStats(): Promise<{ success: boolean; deletedAttempts: number; deletedAnswers: number }> {
  return request('/api/student/attempts', { method: 'DELETE' });
}

// ─── AI Tutor / Chat ──────────────────────────────────────

export async function sendChatMessage(
  message: string,
  options?: { examId?: string; chapterId?: string; sessionId?: string }
): Promise<{
  reply: string;
  sessionId: string;
  userMessageId?: string;
  assistantMessageId?: string;
}> {
  const locale = getLocale();
  return request<{
    reply: string;
    sessionId: string;
    userMessageId?: string;
    assistantMessageId?: string;
  }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, locale, ...options }),
  });
}

export async function submitTutorFeedback(
  chatMessageId: string,
  rating: 'up' | 'down',
  comment?: string
): Promise<{ data: { id: string; rating: string; comment: string | null } }> {
  return request('/api/chat/feedback', {
    method: 'POST',
    body: JSON.stringify({ chatMessageId, rating, comment: comment || undefined }),
  });
}

export async function getTutorFeedback(
  sessionId: string
): Promise<{ data: { chatMessageId: string; rating: string; comment: string | null }[] }> {
  return request(`/api/chat/feedback?sessionId=${encodeURIComponent(sessionId)}`);
}

export async function submitTheoryFeedback(
  chapterId: string,
  rating: 'up' | 'down',
  comment?: string
): Promise<{ data: { id: string; rating: string; comment: string | null } }> {
  return request('/api/student/theory-feedback', {
    method: 'POST',
    body: JSON.stringify({ chapterId, rating, comment: comment || undefined }),
  });
}

export async function getTheoryFeedback(
  chapterId: string
): Promise<{ data: { chapterId: string; rating: string; comment: string | null } | null }> {
  return request(`/api/student/theory-feedback/mine?chapterId=${encodeURIComponent(chapterId)}`);
}

export async function getChatSessions(): Promise<ChatSession[]> {
  const res = await request<{ data: ChatSession[] }>('/api/chat');
  return res.data;
}

export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const res = await request<{ data: ChatMessage[] }>(`/api/chat/${sessionId}`);
  return res.data;
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  await request(`/api/chat/${sessionId}`, { method: 'DELETE' });
}

// ─── Subscription / Stripe ────────────────────────────────

export async function createCheckoutSession(plan: 'MONTHLY' | 'YEARLY' | 'LIFETIME'): Promise<{ url: string }> {
  return request<{ url: string }>('/api/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
}

export async function getStripePortal(): Promise<{ url: string | null; message?: string }> {
  return request<{ url: string | null; message?: string }>('/api/stripe/portal');
}

export async function cancelSubscription(): Promise<{ message: string }> {
  return request<{ message: string }>('/api/subscriptions/me/cancel', { method: 'POST' });
}
