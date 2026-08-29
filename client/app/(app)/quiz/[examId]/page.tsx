'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Target,
  Trophy,
  BarChart3,
  HelpCircle,
  Timer,
  Clock,
} from 'lucide-react';
import type { QuizQuestion, QuizResponse, ExamAttemptResult } from '@/types/student';
import { getStudentQuiz, submitExamAttempt, getStudentExamCategories } from '@/lib/student-api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLocale } from '@/src/contexts/LocaleContext';

// ─── ShareScore Component ─────────────────────────────────

function ShareScore({ score, passed, examName }: { score: number; passed: boolean; examName: string }) {
  const { t, locale } = useLocale();
  const [copied, setCopied] = useState(false);

  const siteUrl = 'https://inspectpractice.com';
  const shareText = passed
    ? t('quiz_shareScorePassed', { score }).replace('{score}', String(score))
    : t('quiz_shareScore', { score }).replace('{score}', String(score));
  const fullText = `${shareText} ${t('quiz_shareDesc')} 👉 ${siteUrl}`;
  const encodedText = encodeURIComponent(fullText);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent(t('quiz_shareYourScore'))}&summary=${encodedText}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: t('quiz_shareYourScore'),
          text: fullText,
          url: siteUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="border-t border-border pt-6 mt-6">
      <p className="text-sm font-medium text-text-primary mb-3 text-center">
        {t('quiz_shareYourScore')}
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {/* Twitter/X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          {t('quiz_shareTwitter')}
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          {t('quiz_shareLinkedIn')}
        </a>

        {/* Copy */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:bg-white/10 text-sm font-medium transition-colors border border-border"
        >
          {copied ? (
            <>
              <CheckCircle2 size={16} className="text-green" />
              {t('quiz_copySuccess')}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              {t('quiz_copyLink')}
            </>
          )}
        </button>

        {/* Native share (mobile) */}
        {typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-text-secondary hover:bg-white/10 text-sm font-medium transition-colors border border-border"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {t('quiz_shareNative')}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Types ─────────────────────────────────────────────────

type QuizState = 'loading' | 'ready' | 'submitting' | 'results';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// ─── Page ───────────────────────────────────────────────────

export default function QuizPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = params.examId as string;

  // Quiz config
  const count = Number(searchParams.get('count')) || 10;
  const mode = searchParams.get('mode') === 'exam' ? 'exam' : 'practice';
  const difficultyParam = searchParams.get('difficulty')?.toUpperCase() as Difficulty | undefined;
  const chapterIdParam = searchParams.get('chapterId') || undefined;
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    ['EASY', 'MEDIUM', 'HARD'].includes(difficultyParam ?? '') ? difficultyParam : undefined
  );

  // State
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [examName, setExamName] = useState('');
  const [passingScore, setPassingScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, AnswerRecord>>(new Map());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExamAttemptResult | null>(null);
  const [highlightQuestionIdx, setHighlightQuestionIdx] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [resolvedExamId, setResolvedExamId] = useState<string | null>(null);

  // Exam mode: timer
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const autoSubmitRef = useRef(false);

  // ── bfcache guard ────────────────────────────────────────────
  // When the browser restores this page from the back-forward cache
  // (e.g. user hits Back from results, then clicks "Test Chapter"
  // again — same URL), the React state (completed result) comes back
  // with it. Force a full reload so the quiz starts fresh.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  // ── Resolve exam code to UUID + adaptive difficulty fallback ──

  useEffect(() => {
    if (isUUID(examId)) {
      setResolvedExamId(examId);
    } else {
      getStudentExamCategories()
        .then((categories) => {
          const found = categories.find((c) => c.code === examId);
          if (found) {
            setResolvedExamId(found.id);
          } else {
            setError(t('quiz_examNotFound', { examId }));
            setQuizState('ready');
          }
        })
        .catch(() => {
          setError(t('quiz_failedLoadCategories'));
          setQuizState('ready');
        });
    }
  }, [examId]);

  // ── Load quiz ──────────────────────────────────────────────

  const loadQuiz = useCallback(async () => {
    setQuizState('loading');
    setError(null);
    setAnswers(new Map());
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentIndex(0);
    setResult(null);
    autoSubmitRef.current = false;

    try {
      const data: QuizResponse = await getStudentQuiz(resolvedExamId!, count, difficulty, chapterIdParam, mode);
      if (!data.data || data.data.length === 0) {
        setError(t('quiz_noQuestions'));
        setQuizState('ready');
        return;
      }
      setQuestions(data.data);
      setExamName(data.exam?.name ?? t('quiz_score'));
      setPassingScore(data.exam?.passingScore ?? 70);

      // Exam mode: initialize timer from exam config
      if (mode === 'exam' && data.exam?.timeLimit) {
        const limitSec = data.exam.timeLimit * 60;
        setTimeLimitSec(limitSec);
        setTimeLeft(limitSec);
        setExamStartTime(Date.now());
      } else {
        setTimeLimitSec(null);
        setTimeLeft(null);
        setExamStartTime(null);
      }

      setQuizState('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('quiz_failedLoad'));
      setQuizState('ready');
    }
  }, [resolvedExamId, count, difficulty, mode, t, chapterIdParam]);

  useEffect(() => {
    if (!resolvedExamId) return;

    // Restore results from sessionStorage (returned from tutor)
    const saved = sessionStorage.getItem(`quiz_results_${examId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate we have complete data
        if (parsed.questions?.length && parsed.result) {
          setQuestions(parsed.questions);
          setAnswers(new Map(parsed.answers || []));
          setResult(parsed.result);
          setExamName(parsed.examName || '');
          setPassingScore(parsed.passingScore || 70);
          setQuizState('results');
          if (parsed.scrollToQuestionIdx != null) {
            setHighlightQuestionIdx(parsed.scrollToQuestionIdx);
          }
          sessionStorage.removeItem(`quiz_results_${examId}`);
          return;
        }
      } catch (e) {
        // Invalid data, fall through to normal load
      }
    } else {
      // Fallback: check URL param for questionIdx
      const urlQuestionIdx = searchParams.get('questionIdx');
      if (urlQuestionIdx != null) {
        setHighlightQuestionIdx(Number(urlQuestionIdx));
      }
    }
    loadQuiz();
  }, [loadQuiz, examId, searchParams, resolvedExamId]);

  useEffect(() => {
    document.title = `${t('quiz_score')} | Inspect Practice`;
  }, [t]);

  // ── Exam mode: countdown timer ─────────────────────────────

  useEffect(() => {
    if (mode !== 'exam' || timeLeft === null || quizState !== 'ready') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          if (!autoSubmitRef.current) {
            autoSubmitRef.current = true;
            handleSubmitRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, quizState, timeLeft !== null]);

  // Keep a ref to handleSubmit so the timer can call it without stale closure
  const handleSubmitRef = useRef<() => void>(() => {});

  // ── Scroll to highlighted question after results render ──

  useEffect(() => {
    if (quizState === 'results' && highlightQuestionIdx != null) {
      const el = document.getElementById(`question-review-${highlightQuestionIdx}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
      }
      setHighlightQuestionIdx(null);
    }
  }, [quizState, highlightQuestionIdx]);

  // ── Answer selection ──────────────────────────────────────

  const handleSelectAnswer = (optionIndex: number) => {
    if (showFeedback) return; // Can't change after reveal
    const question = questions[currentIndex];
    if (!question) return;

    const isCorrect = optionIndex === question.correctIndex;
    const record: AnswerRecord = {
      questionId: question.id,
      selectedIndex: optionIndex,
      isCorrect,
    };

    const newAnswers = new Map(answers);
    newAnswers.set(question.id, record);
    setAnswers(newAnswers);
    setSelectedOption(optionIndex);
    setShowFeedback(false);
    // Auto-advance to next question if not on last
    if (currentIndex < questions.length - 1) {
      setTimeout(() => goToQuestion(currentIndex + 1), 300);
    }
  };

  // ── Navigation ────────────────────────────────────────────

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentIndex(index);
    const existing = answers.get(questions[index].id);
    setSelectedOption(existing?.selectedIndex ?? null);
    setShowFeedback(false); // Jamais de feedback avant soumission
  };

  const handleNext = () => goToQuestion(currentIndex + 1);
  const handlePrev = () => goToQuestion(currentIndex - 1);

  // ── Derived stats ─────────────────────────────────────────

  const answeredCount = answers.size;
  const correctCount = Array.from(answers.values()).filter((a) => a.isCorrect).length;
  const scorePercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const allAnswered = answeredCount === questions.length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // ── Submit ────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (quizState === 'submitting') return;
    setShowSubmitModal(false);
    setQuizState('submitting');
    setError(null);

    try {
      const answerPayload = questions.map((q) => {
        const rec = answers.get(q.id);
        return {
          questionId: q.id,
          userAnswer: rec ? String(rec.selectedIndex) : '',
        };
      });
      const timeSpent = examStartTime ? Math.round((Date.now() - examStartTime) / 1000) : undefined;
      const data = await submitExamAttempt(resolvedExamId!, answerPayload, timeSpent, questions.length, mode);
      setResult(data);
      setQuizState('results');

      // Save adaptive difficulty to localStorage
      const score = data.score ?? 0;
      const currentStr = difficulty ?? searchParams.get('difficulty')?.toUpperCase();
      const current = ['EASY', 'MEDIUM', 'HARD'].includes(currentStr ?? '') ? currentStr as string : null;
      let next: string | null;
      if (score >= 80) {
        // Move up: null→EASY, EASY→MEDIUM, MEDIUM→HARD, HARD stays
        next = current === null ? 'EASY' : current === 'EASY' ? 'MEDIUM' : current === 'MEDIUM' ? 'HARD' : 'HARD';
      } else if (score < 50) {
        // Move down: HARD→MEDIUM, MEDIUM→EASY, EASY→null, null stays
        next = current === 'HARD' ? 'MEDIUM' : current === 'MEDIUM' ? 'EASY' : null;
      } else {
        next = current;
      }
      if (next) {
        localStorage.setItem(`inspectpractice_adaptive_${examId}`, next);
      } else {
        localStorage.removeItem(`inspectpractice_adaptive_${examId}`);
      }
      // Save results to sessionStorage so back from tutor preserves them
      sessionStorage.setItem(`quiz_results_${examId}`, JSON.stringify({
        questions,
        answers: Array.from(answers.entries()),
        result: data,
        examName,
        passingScore,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('quiz_failedLoad'));
      setQuizState('ready');
    }
  };

  // Keep handleSubmit ref in sync for timer auto-submit
  handleSubmitRef.current = handleSubmit;

  // ── Timer display helper ──────────────────────────────────

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timerWarning = timeLeft !== null && timeLimitSec !== null && timeLeft < timeLimitSec * 0.1;

  // ── Loading state ─────────────────────────────────────────

  if (quizState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        >
          <HelpCircle size={40} className="text-blue" />
        </motion.div>
        <p className="text-text-secondary text-sm">{t('quiz_loading')}</p>
      </div>
    );
  }

  // ── Error state (no questions) ────────────────────────────

  if (error && questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center">
          <AlertCircle size={32} className="text-red" />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-text-primary mb-2">{t('quiz_unableLoad')}</h2>
          <p className="text-text-secondary text-sm">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadQuiz} leftIcon={<RefreshCw size={16} />}>
            {t('quiz_tryAgain')}
          </Button>
          <Button variant="ghost" onClick={() => router.back()} leftIcon={<ArrowLeft size={16} />}>
            {t('quiz_backToExams')}
          </Button>
        </div>
      </motion.div>
    );
  }

  // ── Empty state ───────────────────────────────────────────

  if (questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center">
          <BookOpen size={32} className="text-amber" />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-text-primary mb-2">{t('quiz_noQuestionsTitle')}</h2>
          <p className="text-text-secondary text-sm">{t('quiz_noQuestionsDesc')}</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()} leftIcon={<ArrowLeft size={16} />}>
          {t('quiz_backToExams')}
        </Button>
      </motion.div>
    );
  }

  // ── Results view ─────────────────────────────────────────

  if (quizState === 'results' && result) {
    const passed = result.passed;
    const resultScore = result.score;
    const resultCorrect = result.correctCount;
    const resultTotal = result.totalQuestions;
    const resultPercent = resultTotal > 0 ? Math.round((resultCorrect / resultTotal) * 100) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Result header */}
        <div className="bg-card border border-border rounded-card p-8 text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-green/10' : 'bg-red/10'
            }`}
          >
            {passed ? (
              <Trophy size={40} className="text-green" />
            ) : (
              <XCircle size={40} className="text-red" />
            )}
          </motion.div>

          <h1 className={`text-2xl font-bold mb-2 ${passed ? 'text-green' : 'text-red'}`}>
            {passed ? t('quiz_resultPassed') : t('quiz_resultFailed')}
          </h1>
          {examName && (
            <p className="text-sm font-medium text-text-secondary mb-3">{examName}</p>
          )}
          <p className="text-text-secondary mb-6">
            {passed ? t('quiz_resultPassedDesc') : t('quiz_resultFailedDesc')}
          </p>

          {/* Score circle */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-secondary"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - resultPercent / 100)}`}
                    className={passed ? 'text-green' : 'text-red'}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - resultPercent / 100) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-text-primary">{resultPercent}%</span>
                </div>
              </div>
              <span className="text-sm text-text-tertiary mt-2">{t('quiz_finalScore')}</span>
            </div>

            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green" />
                <span className="text-sm text-text-secondary">
                  {t('quiz_correct')}: <strong className="text-text-primary">{resultCorrect}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-red" />
                <span className="text-sm text-text-secondary">
                  {t('quiz_incorrect')}: <strong className="text-text-primary">{resultTotal - resultCorrect}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-blue" />
                <span className="text-sm text-text-secondary">
                  {t('quiz_passing')}: <strong className="text-text-primary">{passingScore}%</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Share score */}
          <ShareScore score={resultPercent} passed={passed} examName={examName} />

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={passed ? 'default' : 'secondary'}
              onClick={loadQuiz}
              leftIcon={<RefreshCw size={16} />}
            >
              {t('quiz_tryAgain')}
            </Button>
            <Button variant="ghost" onClick={() => router.push('/exams')} leftIcon={<ArrowLeft size={16} />}>
              {t('quiz_backToExams')}
            </Button>
          </div>
        </div>

        {/* Answer review list */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue" />
            {t('quiz_answerReview')}
          </h3>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAnswer = answers.get(q.id);
              const isCorrect = userAnswer?.isCorrect ?? false;
              return (
                <motion.div
                  key={q.id}
                  id={`question-review-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-3 rounded-lg border ${
                    isCorrect
                      ? 'border-green/20 bg-green/5'
                      : 'border-red/20 bg-red/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 size={16} className="text-green mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary mb-1">
                        <span className="text-text-tertiary mr-1">{t('quiz_questionLabel', { number: i + 1 })}</span>
                        {q.question}
                      </p>
                      {q.chapter && (
                        <span className="inline-flex items-center gap-1 mb-2 text-[10px] font-medium uppercase tracking-wide text-text-tertiary bg-secondary border border-border px-1.5 py-0.5 rounded">
                          <BookOpen size={10} />
                          {q.chapter}
                        </span>
                      )}
                      <p className="text-xs text-text-tertiary">
                        {isCorrect ? (
                          <>{t('quiz_correctAnswer')}: <span className="text-green">{q.options[q.correctIndex]}</span></>
                        ) : (
                          <>
                            {t('quiz_yourAnswer')}: <span className="text-red">{q.options[userAnswer?.selectedIndex ?? -1] ?? t('quiz_na')}</span>
                            {' | '}{t('quiz_correctAnswer')}: <span className="text-green">{q.options[q.correctIndex]}</span>
                          </>
                        )}
                      </p>
                      <button
                        onClick={() => {
                          sessionStorage.setItem(`quiz_results_${examId}`, JSON.stringify({
                            questions,
                            answers: Array.from(answers.entries()),
                            result,
                            examName,
                            passingScore,
                            scrollToQuestionIdx: i,
                          }));
                          // Build a self-contained context so the tutor knows the correct answer
                          const userAnswer = answers.get(q.id);
                          const userIdx = userAnswer?.selectedIndex ?? -1;
                          const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                          const optionsList = (q.options || []).map((opt, oi) => `  ${optionLetters[oi] ?? oi + 1}) ${opt}`).join('\n');
                          const userLetter = userIdx >= 0 ? (optionLetters[userIdx] ?? String(userIdx + 1)) : '—';
                          const correctLetter = q.correctIndex >= 0 ? (optionLetters[q.correctIndex] ?? String(q.correctIndex + 1)) : '—';
                          const isFr = locale === 'fr';
                          const examLabel = isFr ? 'Examen:' : 'Exam:';
                          const chapterLabel = isFr ? 'Chapitre:' : 'Chapter:';
                          const naLabel = isFr ? 'Non spécifié' : 'Not specified';
                          const tutorQuestion = `${examLabel} ${examName || naLabel}\n${chapterLabel} ${q.chapter ?? naLabel}\n\n${isFr ? 'Question d\'examen:' : 'Exam question:'}\n${q.question}\n\nOptions:\n${optionsList}\n\n${isFr ? 'Bonne réponse' : 'Correct answer'}: ${correctLetter}) ${q.options[q.correctIndex] ?? ''}\n${isFr ? 'Ma réponse' : 'My answer'}: ${userLetter}) ${userIdx >= 0 ? (q.options[userIdx] ?? '') : (isFr ? 'aucune' : 'none')}\n${userAnswer?.isCorrect
                            ? (isFr ? 'J\'ai répondu correctement.' : 'I answered correctly.')
                            : (isFr ? 'J\'ai répondu incorrectement.' : 'I answered incorrectly.')}\n\n${isFr ? 'Explique-moi pourquoi la bonne réponse est correcte et pourquoi ma réponse est ' : 'Explain why the correct answer is right and why my answer is '}${userAnswer?.isCorrect ? (isFr ? 'aussi valide' : 'also valid') : (isFr ? 'incorrecte' : 'incorrect')}.`;
                          const tutorUrl = `/tutor?examId=${examId}&question=${encodeURIComponent(tutorQuestion)}&questionIdx=${i}${q.chapterId ? `&chapterId=${q.chapterId}` : ''}`;
                          router.push(tutorUrl);
                        }}
                        className="mt-2 text-xs text-blue hover:text-blue/80 flex items-center gap-1 transition-colors"
                      >
                        <span className="text-blue text-lg leading-none shrink-0">🤖</span>
                        {t('quiz_askAiTutor')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            variant={passed ? 'default' : 'secondary'}
            onClick={loadQuiz}
            leftIcon={<RefreshCw size={16} />}
          >
            {t('quiz_tryAgain')}
          </Button>
          <Button variant="ghost" onClick={() => router.push('/exams')} leftIcon={<ArrowLeft size={16} />}>
            {t('quiz_backToExams')}
          </Button>
        </div>
      </motion.div>
    );
  }

  // ── Error banner (non-fatal) ─────────────────────────────

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : undefined;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Always-visible top bar with Exit button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-sm font-medium text-text-tertiary truncate">
          {mode === 'exam' ? (t('quiz_examMode' as any) || 'Exam Simulation') : (t('quiz_practiceMode') || 'Practice')}
        </span>
        <button
          onClick={() => {
            if (window.confirm(t('quiz_quitConfirm'))) {
              router.push(`/exams/${resolvedExamId}`);
            }
          }}
          title={t('quiz_quitExam')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red hover:bg-red/10 border border-red/30 hover:border-red/50 transition-all shrink-0"
        >
          <XCircle size={14} />
          {t('quiz_quitExam')}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red/10 border border-red/20 text-red text-sm"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Exam mode header with timer */}
      {mode === 'exam' && (
        <div className={`flex items-center justify-between p-3 mb-4 rounded-lg border ${
          timerWarning
            ? 'bg-red/10 border-red/30 text-red'
            : 'bg-blue/5 border-blue/20 text-blue'
        }`}>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="text-sm font-semibold">
              {t('quiz_examMode' as any) || 'Exam Simulation'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {timeLeft !== null && (
              <div className={`flex items-center gap-1.5 font-mono text-lg font-bold ${
                timerWarning ? 'text-red animate-pulse' : ''
              }`}>
                <Timer size={18} />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">
            {examName}
          </span>
          <span className="text-sm text-text-tertiary">
            {t('quiz_answered', { answered: answeredCount, total: questions.length })}
          </span>
        </div>
        <ProgressBar
          value={answeredCount}
          max={questions.length}
          variant={allAnswered ? 'success' : 'default'}
          size="sm"
        />
      </div>

      {/* Quiz content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Question card */}
          <div className="bg-card border border-border rounded-card p-6 mb-4">
            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue/10 text-blue">
                {t('quiz_questionOf', { current: currentIndex + 1, total: questions.length })}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full capitalize bg-hover text-text-secondary">
                {currentQuestion?.difficulty
                  ? t(`quiz_${currentQuestion.difficulty.toLowerCase()}` as any)
                  : t('quiz_unknown')}
              </span>
            </div>

            {/* Question text */}
            <h2 className="text-lg font-medium text-text-primary mb-6 leading-relaxed">
              {currentQuestion?.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const optionStyle = isSelected
                  ? 'border-blue bg-blue/5 text-blue'
                  : 'border-border bg-card hover:bg-hover text-text-primary';

                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-150 cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 border ${
                          isSelected
                            ? 'border-blue text-blue'
                            : 'border-border text-text-secondary'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm leading-relaxed pt-0.5">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Question dots */}
      <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto py-1">
        {questions.map((_, idx) => {
          const isAnswered = answers.has(questions[idx].id);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => goToQuestion(idx)}
              className={`shrink-0 w-2.5 h-2.5 rounded-full transition-all duration-150 ${
                isCurrent
                  ? 'bg-blue ring-2 ring-blue/30 scale-125'
                  : isAnswered
                  ? 'bg-green/60 hover:bg-green'
                  : idx < currentIndex
                  ? 'bg-red/60 hover:bg-red'
                  : 'bg-border hover:bg-text-tertiary'
              }`}
              aria-label={t('quiz_goToQuestion', { number: idx + 1 })}
            />
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          leftIcon={<ChevronLeft size={16} />}
        >
          {t('quiz_previous')}
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button
            variant="secondary"
            onClick={handleNext}
            rightIcon={<ChevronRight size={16} />}
          >
            {t('quiz_next')}
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => (allAnswered ? handleSubmit() : setShowSubmitModal(true))}
            disabled={quizState === 'submitting'}
            loading={quizState === 'submitting'}
            leftIcon={allAnswered ? <Send size={16} /> : undefined}
          >
            {t('quiz_submit')}
          </Button>
        )}
      </div>

      {/* Submit prompt */}
      {allAnswered && currentIndex === questions.length - 1 && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-green mt-4"
          dangerouslySetInnerHTML={{ __html: t('quiz_allAnsweredSubmit') }}
        />
      )}
      {!allAnswered && currentIndex === questions.length - 1 && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-text-secondary mt-4"
        >
          {t('quiz_reviewBeforeSubmit')}
        </motion.p>
      )}

      {/* Submit confirmation modal — shown when unanswered questions remain */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title={t('quiz_submitConfirmTitle')}
        description={t('quiz_submitConfirmDesc', { count: questions.length - answeredCount })}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
              {t('quiz_continueAnswering')}
            </Button>
            <Button variant="default" onClick={handleSubmit} loading={quizState === 'submitting'}>
              <Send size={15} />
              {t('quiz_submitAnyway')}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Summary counts */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green/60 inline-block" />
              {answeredCount} {t('quiz_submitAnswered')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red/60 inline-block" />
              {questions.length - answeredCount} {t('quiz_submitUnanswered')}
            </span>
          </div>

          {/* Dots grid — green answered, red unanswered */}
          <div className="flex flex-wrap items-center gap-2">
            {questions.map((_, idx) => {
              const isAnswered = answers.has(questions[idx].id);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setShowSubmitModal(false);
                    goToQuestion(idx);
                  }}
                  className={`shrink-0 w-3 h-3 rounded-full transition-colors ${
                    isAnswered ? 'bg-green/60 hover:bg-green' : 'bg-red/60 hover:bg-red'
                  }`}
                  aria-label={t('quiz_goToQuestion', { number: idx + 1 })}
                />
              );
            })}
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            {t('quiz_submitConfirmHint')}
          </p>
        </div>
      </Modal>
    </div>
  );
}
