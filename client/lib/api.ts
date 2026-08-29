import { API_BASE_URL } from './constants';
import type {
  User,
  Question,
  Exam,
  Chapter,
  Content,
  AnalyticsOverview,
  UserGrowth,
  RevenueData,
  DifficultyDistribution,
  ExamPassRate,
  FailedQuestion,
  TopPerformer,
  GenerateQuestionsRequest,
  PaginatedResponse,
} from '@/types';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; name: string; role?: string }) {
    return this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  // Users
  async getUsers(page = 1, limit = 20) {
    return this.request<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Questions
  async getQuestions(params?: { examId?: string; chapterId?: string; status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.examId) searchParams.set('examId', params.examId);
    if (params?.chapterId) searchParams.set('chapterId', params.chapterId);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Question>>(`/questions${query ? `?${query}` : ''}`);
  }

  async getPendingQuestions(page = 1, limit = 20) {
    return this.request<PaginatedResponse<Question>>(`/questions/pending?page=${page}&limit=${limit}`);
  }

  async generateQuestions(request: GenerateQuestionsRequest) {
    return this.request<{ message: string; count: number }>('/questions/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async approveQuestion(id: string) {
    return this.request<Question>(`/questions/${id}/approve`, {
      method: 'PUT',
    });
  }

  async rejectQuestion(id: string) {
    return this.request<Question>(`/questions/${id}/reject`, {
      method: 'PUT',
    });
  }

  async updateQuestion(id: string, data: Partial<Question>) {
    return this.request<Question>(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteQuestion(id: string) {
    return this.request<{ message: string }>(`/questions/${id}`, {
      method: 'DELETE',
    });
  }

  // Exams
  async getExams() {
    return this.request<Exam[]>('/exams');
  }

  async getExam(id: string) {
    return this.request<Exam>(`/exams/${id}`);
  }

  async createExam(data: Omit<Exam, 'id' | 'createdAt'>) {
    return this.request<Exam>('/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateExam(id: string, data: Partial<Exam>) {
    return this.request<Exam>(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getExamChapters(examId: string) {
    return this.request<Chapter[]>(`/exams/${examId}/chapters`);
  }

  // Chapters
  async getChapters(examId?: string) {
    const query = examId ? `?examId=${examId}` : '';
    return this.request<Chapter[]>(`/chapters${query}`);
  }

  async createChapter(data: Omit<Chapter, 'id'>) {
    return this.request<Chapter>('/chapters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChapter(id: string, data: Partial<Chapter>) {
    return this.request<Chapter>(`/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChapter(id: string) {
    return this.request<{ message: string }>(`/chapters/${id}`, {
      method: 'DELETE',
    });
  }

  // Content
  async getContent() {
    return this.request<Content[]>('/content');
  }

  async uploadContent(file: File, examId?: string, chapterId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (examId) formData.append('examId', examId);
    if (chapterId) formData.append('chapterId', chapterId);

    return this.request<Content>('/content/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async deleteContent(id: string) {
    return this.request<{ message: string }>(`/content/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalyticsOverview() {
    return this.request<AnalyticsOverview>('/analytics/overview');
  }

  async getUserGrowth() {
    return this.request<UserGrowth[]>('/analytics/users');
  }

  async getRevenue() {
    return this.request<RevenueData[]>('/analytics/revenue');
  }

  async getDifficultyDistribution() {
    return this.request<DifficultyDistribution[]>('/analytics/exams');
  }

  async getExamPassRates() {
    return this.request<ExamPassRate[]>('/analytics/exams');
  }

  async getFailedQuestions(limit = 10) {
    return this.request<FailedQuestion[]>(`/analytics/exams?type=failed&limit=${limit}`);
  }

  async getTopPerformers(limit = 10) {
    return this.request<TopPerformer[]>(`/analytics/users?type=top&limit=${limit}`);
  }

  // Subscriptions
  async getSubscriptions() {
    return this.request<PaginatedResponse<{ id: string; user: User; plan: string; status: string }>>('/subscriptions');
  }

  async updateSubscription(id: string, data: { status?: string; plan?: string }) {
    return this.request(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
