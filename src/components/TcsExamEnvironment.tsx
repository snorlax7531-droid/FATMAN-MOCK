import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Moon,
  Sun,
  Menu,
  BarChart2,
  Trash2,
  Flag,
  ArrowLeftRight,
  User,
  Pause,
  Play,
  RotateCcw,
  XCircle,
  FileText,
  LayoutGrid
} from 'lucide-react';
import { Question, TestModel, AttemptModel, BookmarkModel } from '../types';
import { useAuth } from '../context/AuthContext';

interface TcsExamEnvironmentProps {
  test: TestModel;
  questions: Question[];
  existingBookmarks?: BookmarkModel[];
  onToggleBookmark?: (q: Question, testId: string, subject: string) => Promise<boolean>;
  onComplete: (attempt: AttemptModel) => void;
  onExit: () => void;
}

type QuestionStatus = 'not_visited' | 'not_attempted' | 'attempted' | 'marked' | 'correct' | 'wrong';
type FontSizeType = 'normal' | 'large' | 'xlarge';

export const TcsExamEnvironment: React.FC<TcsExamEnvironmentProps> = ({
  test,
  questions,
  existingBookmarks,
  onToggleBookmark,
  onComplete,
  onExit
}) => {
  const { userProfile } = useAuth();

  // Current Question Index (0-based)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active Right Panel Tab: 'questions' | 'summary'
  const [rightTab, setRightTab] = useState<'questions' | 'summary'>('questions');

  // Mobile / Tablet Question Palette visibility toggle (default true on tablet & laptop >=768px, false on mobile <768px)
  const [showPalette, setShowPalette] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Dark Mode state - default false (light mode by default, exactly matching user screenshot)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Language state: 'en' | 'hi' | 'both'
  const [lang, setLang] = useState<'en' | 'hi' | 'both'>('both');

  // Font Size: 'normal' | 'large' | 'xlarge'
  const [fontSize, setFontSize] = useState<FontSizeType>('large');

  // Test Pause state
  const [isPaused, setIsPaused] = useState(false);

  // Bookmarked question IDs set
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    existingBookmarks?.forEach(b => ids.add(b.questionId));
    return ids;
  });

  useEffect(() => {
    if (existingBookmarks) {
      setBookmarkedIds(new Set(existingBookmarks.map(b => b.questionId)));
    }
  }, [existingBookmarks]);

  // User answers map: questionId -> selectedOptionIndex (0, 1, 2, 3 or null)
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  // Question statuses: questionId -> QuestionStatus
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>({});

  // Marked for review question IDs
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());

  // Time spent per question: questionId -> seconds
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});

  // Overall Timer countdown in seconds
  const totalDurationSeconds = (test.durationMinutes || 15) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalDurationSeconds);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Track active question start time
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);

  // Initialize statuses on questions load
  useEffect(() => {
    const initialStatuses: Record<string, QuestionStatus> = {};
    questions.forEach((q, idx) => {
      initialStatuses[q.id] = idx === 0 ? 'not_attempted' : 'not_visited';
    });
    setStatuses(initialStatuses);
  }, [questions]);

  // Countdown timer (pauses when isPaused is true)
  useEffect(() => {
    if (isPaused) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPaused]);

  // Update time spent on current question
  const recordQuestionTime = () => {
    if (isPaused) return;
    const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    const currentQ = questions[currentIndex];
    if (currentQ) {
      setTimeSpent((prev) => ({
        ...prev,
        [currentQ.id]: (prev[currentQ.id] || 0) + elapsed
      }));
    }
    questionStartTimeRef.current = Date.now();
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;

  // Question navigation handler
  const goToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= questions.length || targetIndex === currentIndex) return;
    recordQuestionTime();

    if (currentQ) {
      const hasAns = answers[currentQ.id] !== undefined && answers[currentQ.id] !== null;
      const isMarked = markedIds.has(currentQ.id);
      if (isMarked) {
        setStatuses(prev => ({ ...prev, [currentQ.id]: 'marked' }));
      } else if (hasAns) {
        setStatuses(prev => ({ ...prev, [currentQ.id]: 'attempted' }));
      } else {
        setStatuses(prev => ({ ...prev, [currentQ.id]: 'not_attempted' }));
      }
    }

    const targetQ = questions[targetIndex];
    if (targetQ && statuses[targetQ.id] === 'not_visited') {
      setStatuses(prev => ({ ...prev, [targetQ.id]: 'not_attempted' }));
    }

    setCurrentIndex(targetIndex);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowPalette(false);
    }
  };

  // Button Action: Save & Next
  const handleSaveAndNext = () => {
    if (!currentQ) return;
    recordQuestionTime();

    const hasSelected = currentAnswer !== undefined && currentAnswer !== null;
    const isMarked = markedIds.has(currentQ.id);
    const newStatus: QuestionStatus = isMarked ? 'marked' : hasSelected ? 'attempted' : 'not_attempted';

    setStatuses(prev => ({ ...prev, [currentQ.id]: newStatus }));

    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      if (statuses[nextQ.id] === 'not_visited') {
        setStatuses(prev => ({ ...prev, [nextQ.id]: 'not_attempted' }));
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Button Action: Clear Response
  const handleClearResponse = () => {
    if (!currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: null }));
    const isMarked = markedIds.has(currentQ.id);
    setStatuses(prev => ({ ...prev, [currentQ.id]: isMarked ? 'marked' : 'not_attempted' }));
  };

  // Button Action: Mark for Review toggle
  const handleToggleMarkForReview = () => {
    if (!currentQ) return;
    setMarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
        const hasSelected = currentAnswer !== undefined && currentAnswer !== null;
        setStatuses(s => ({ ...s, [currentQ.id]: hasSelected ? 'attempted' : 'not_attempted' }));
      } else {
        next.add(currentQ.id);
        setStatuses(s => ({ ...s, [currentQ.id]: 'marked' }));
      }
      return next;
    });
  };

  // Toggle Bookmark for current question
  const handleToggleBookmarkCurrent = async () => {
    if (!currentQ) return;
    if (onToggleBookmark) {
      const isNow = await onToggleBookmark(currentQ, test.id, test.subject);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (isNow) next.add(currentQ.id);
        else next.delete(currentQ.id);
        return next;
      });
    }
  };

  // Compute stats counters matching screenshot legend
  let attemptedCount = 0;
  let markedCount = 0;
  let correctCount = 0;
  let wrongCount = 0;

  questions.forEach(q => {
    const sel = answers[q.id];
    const isAns = sel !== undefined && sel !== null;
    const isM = markedIds.has(q.id);

    if (isAns) {
      attemptedCount++;
      if (sel === q.correctOptionIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
    if (isM) {
      markedCount++;
    }
  });

  const notAttemptedCount = questions.length - attemptedCount;

  // Finalize attempt and submit
  const finalizeAttempt = () => {
    recordQuestionTime();

    const attemptAnswers = questions.map((q, idx) => {
      const selectedOptionIndex = answers[q.id] ?? null;
      const isAttempted = selectedOptionIndex !== null;
      const isCorrect = isAttempted && selectedOptionIndex === q.correctOptionIndex;
      return {
        questionId: q.id,
        questionNumber: idx + 1,
        selectedOptionIndex,
        isCorrect,
        timeSpentSeconds: timeSpent[q.id] || 0,
        markedForReview: markedIds.has(q.id)
      };
    });

    const finalCorrectCount = attemptAnswers.filter(a => a.isCorrect).length;
    const finalIncorrectCount = attemptAnswers.filter(a => a.selectedOptionIndex !== null && !a.isCorrect).length;
    const finalUnattemptedCount = attemptAnswers.filter(a => a.selectedOptionIndex === null).length;

    const positiveMarks = test.positiveMarks || 2.0;
    const negativeMarks = test.negativeMarks || 0.5;
    const rawScore = (finalCorrectCount * positiveMarks) - (finalIncorrectCount * negativeMarks);
    const score = Math.max(0, Math.round(rawScore * 100) / 100);

    const totalMarks = test.totalMarks || (questions.length * positiveMarks);
    const attemptedQuestions = finalCorrectCount + finalIncorrectCount;
    const accuracy = attemptedQuestions > 0 ? Math.round((finalCorrectCount / attemptedQuestions) * 100) : 0;
    const timeTaken = totalDurationSeconds - secondsRemaining;

    const attempt: AttemptModel = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: userProfile?.uid || userProfile?.email || 'guest-aspirant',
      userEmail: userProfile?.email || 'student@fatman.exam',
      userName: userProfile?.displayName || 'Demo User',
      testId: test.id,
      testTitle: test.title,
      subject: test.subject,
      score,
      totalMarks,
      accuracy,
      timeTakenSeconds: timeTaken,
      correctCount: finalCorrectCount,
      incorrectCount: finalIncorrectCount,
      unattemptedCount: finalUnattemptedCount,
      answers: attemptAnswers,
      submittedAt: new Date().toISOString(),
      status: 'completed'
    };

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    onComplete(attempt);
  };

  const handleAutoSubmit = () => {
    finalizeAttempt();
  };

  // Language switch handler
  const toggleLanguage = () => {
    if (lang === 'en') setLang('hi');
    else if (lang === 'hi') setLang('both');
    else setLang('en');
  };

  // Clean Subject & Chapter Display at top
  const getCleanSubjectChapter = () => {
    const subject = test.subject || 'General Awareness';
    let chapter = test.chapter;
    if (!chapter) {
      const parts = test.title.replace(/mock\s*test/gi, '').split(/[-|•]/).map(s => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        chapter = parts[1];
      } else if (parts.length === 1 && parts[0].toLowerCase() !== subject.toLowerCase()) {
        chapter = parts[0];
      }
    }
    return chapter ? `${subject} • ${chapter}` : subject;
  };

  // Candidate name display
  const candidateName = userProfile?.displayName || 'Demo User';
  const cleanTopHeading = getCleanSubjectChapter();

  // Dynamic Font Size Classnames (Responsive: compact on mobile, refined & slightly smaller on laptop/desktop view)
  const questionFontClass = fontSize === 'xlarge'
    ? 'text-xl sm:text-2xl lg:text-2xl xl:text-[28px] font-bold leading-relaxed'
    : fontSize === 'large'
      ? 'text-lg sm:text-[20px] lg:text-xl xl:text-[24px] font-bold leading-relaxed'
      : 'text-base sm:text-lg lg:text-lg xl:text-[21px] font-bold leading-relaxed';

  const hindiQuestionFontClass = fontSize === 'xlarge'
    ? 'text-lg sm:text-xl lg:text-xl xl:text-[25px] font-medium leading-relaxed'
    : fontSize === 'large'
      ? 'text-base sm:text-[18px] lg:text-lg xl:text-[22px] font-medium leading-relaxed'
      : 'text-sm sm:text-base lg:text-base xl:text-[19px] font-medium leading-relaxed';

  const optionTextFontClass = fontSize === 'xlarge'
    ? 'text-base sm:text-lg lg:text-xl xl:text-[24px]'
    : fontSize === 'large'
      ? 'text-sm sm:text-base lg:text-lg xl:text-[22px]'
      : 'text-xs sm:text-sm lg:text-base xl:text-[19px]';

  // Responsive Palette Column calculation for larger box sizes
  const paletteColsClass = questions.length <= 10
    ? 'grid-cols-5'
    : questions.length <= 25
      ? 'grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6'
      : 'grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 xl:grid-cols-7';

  const paletteBoxSizeClass = questions.length <= 15
    ? 'w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 xl:w-14 xl:h-14 text-sm sm:text-base lg:text-lg font-black rounded-xl lg:rounded-2xl'
    : questions.length <= 30
      ? 'w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 xl:w-13 xl:h-13 text-xs sm:text-sm lg:text-base font-black rounded-xl lg:rounded-2xl'
      : 'w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 text-xs sm:text-sm lg:text-sm font-black rounded-lg lg:rounded-xl';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col select-none overflow-hidden font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-[#0a0f1d] text-slate-100' : 'bg-[#f4f6fb] text-slate-900'
    }`}>
      
      {/* 1. TOP NAVBAR HEADER (AUTO-ADAPTIVE: COMPACT ON MOBILE, GRAND & PROMINENT ON LAPTOP) */}
      <header className={`h-14 sm:h-16 md:h-18 lg:h-20 xl:h-22 border-b px-2 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-xs z-20 transition-colors gap-1 sm:gap-2 lg:gap-4 ${
        isDarkMode ? 'bg-[#131b2e] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Left Side: Menu Button & Responsive Auto-Shrinking Subject Title */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 min-w-0 max-w-[38%] xs:max-w-[45%] sm:max-w-none flex-1">
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl lg:rounded-2xl border transition-colors cursor-pointer shrink-0 flex items-center justify-center ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs'
            }`}
            title="Menu / Exit Test"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Clean Subject & Chapter Badge (Shrinks gracefully with ellipsis so right controls are 100% visible) */}
          <div className={`flex items-center gap-1 sm:gap-1.5 lg:gap-2.5 px-1.5 sm:px-2.5 lg:px-4 py-1 sm:py-1.5 lg:py-2.5 rounded-lg sm:rounded-xl lg:rounded-2xl border font-black text-xs shadow-xs transition-all min-w-0 max-w-[125px] xs:max-w-[180px] sm:max-w-xs md:max-w-md lg:max-w-none ${
            isDarkMode
              ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200 ring-1 ring-indigo-500/30'
              : 'bg-indigo-50/95 border-2 border-indigo-200 text-indigo-900 ring-1 ring-indigo-100'
          }`}>
            <BookOpen className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5 shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span className="truncate tracking-wide font-black text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base">
              {cleanTopHeading}
            </span>
          </div>
        </div>

        {/* Center: Full Language Switcher Tabs (Desktop / Laptop View Only - Grand & Prominent) */}
        <div className="hidden lg:flex items-center shrink-0">
          <div className={`p-1 lg:p-1.5 rounded-full border-2 flex items-center shadow-xs ${
            isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 lg:px-4.5 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-extrabold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Toggle Language"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-3 lg:px-4.5 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-extrabold transition-all cursor-pointer ${
                lang === 'hi'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLang('both')}
              className={`px-2.5 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-extrabold transition-all cursor-pointer ${
                lang === 'both'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Both
            </button>
          </div>
        </div>

        {/* Right Side Controls: Language, Pause, Fullscreen, Dark Mode, Timer - Balanced on all viewports */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 shrink-0 ml-auto">
          
          {/* Mobile / Tablet Quick Language Switch Pill */}
          <button
            type="button"
            onClick={toggleLanguage}
            className={`lg:hidden px-1.5 py-1 rounded-lg border font-black text-[10px] sm:text-xs flex items-center gap-0.5 shrink-0 transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-indigo-300'
                : 'bg-slate-100 border-slate-200 text-indigo-700 hover:bg-slate-200 shadow-2xs'
            }`}
            title="Switch Language (भाषा बदलें)"
          >
            <ArrowLeftRight className="w-2.5 h-2.5 text-slate-400" />
            <span>{lang === 'hi' ? 'हिंदी' : lang === 'en' ? 'EN' : 'Both'}</span>
          </button>

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 lg:px-4 lg:py-2.5 h-8 sm:h-9 lg:h-11 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 text-[11px] sm:text-xs lg:text-sm font-black transition-all cursor-pointer shrink-0 ${
              isPaused
                ? 'bg-amber-500 text-white border-amber-600 shadow-md animate-pulse'
                : isDarkMode 
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 hover:bg-amber-900/50' 
                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-2xs'
            }`}
            title={isPaused ? "Resume Test" : "Pause Test"}
          >
            {isPaused ? <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4.5 lg:h-4.5 fill-current" /> : <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4.5 lg:h-4.5" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Full Screen Toggle (Hidden on mobile phones, shown on tablet/desktop) */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`hidden md:flex items-center gap-1.5 h-8 sm:h-9 lg:h-11 px-2 lg:px-4 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 text-xs lg:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5" /> : <Maximize2 className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5" />}
            <span className="hidden 2xl:inline">{isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center justify-center ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700 text-amber-300 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-indigo-600" />}
          </button>

          {/* Palette Toggle Button (Tablet & Laptop) */}
          <button
            type="button"
            onClick={() => setShowPalette(!showPalette)}
            className={`hidden md:flex items-center gap-1.5 h-8 sm:h-9 lg:h-11 px-2.5 lg:px-4 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 text-xs lg:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              showPalette 
                ? isDarkMode ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300' : 'bg-indigo-50 border-indigo-300 text-indigo-800'
                : isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
            }`}
            title="Toggle Question Palette"
          >
            <LayoutGrid className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden 2xl:inline">Palette</span>
          </button>

          {/* Timer Card with Clock icon - 100% Protected and Always Visible */}
          <div className={`flex items-center gap-1 sm:gap-1.5 lg:gap-2.5 pl-1.5 sm:pl-2 lg:pl-3 shrink-0 border-l ${
            isDarkMode ? 'border-slate-700/80' : 'border-slate-200'
          }`}>
            <div className={`p-1 sm:p-1.5 lg:p-2 rounded-lg sm:rounded-xl lg:rounded-2xl shrink-0 ${
              isPaused 
                ? 'text-amber-500 bg-amber-500/15'
                : secondsRemaining < 180 
                  ? 'text-rose-600 bg-rose-500/15 animate-pulse' 
                  : isDarkMode ? 'text-indigo-400 bg-indigo-500/15' : 'text-indigo-600 bg-indigo-50'
            }`}>
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5.5 lg:h-5.5 stroke-[2.3]" />
            </div>
            <div className="text-left shrink-0">
              <div className={`font-mono font-black text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl leading-none tracking-tight whitespace-nowrap ${
                isPaused 
                  ? 'text-amber-500'
                  : secondsRemaining < 180 ? 'text-rose-600' : isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {formatTime(secondsRemaining)}
              </div>
              <div className="hidden xs:block text-[8px] sm:text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-0.5">
                {isPaused ? 'Paused' : 'Time Left'}
              </div>
            </div>
          </div>

          {/* User Profile Card (Hidden on mobile & small tablet, grand on laptop) */}
          <div className="hidden xl:flex items-center gap-2.5 pl-2.5 border-l border-slate-200 dark:border-slate-700 shrink-0">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs lg:text-sm shrink-0 shadow-xs">
              <User className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <div className="text-left text-xs lg:text-sm leading-tight">
              <div className={`font-black truncate max-w-[100px] lg:max-w-[130px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {candidateName}
              </div>
              <div className="text-[10px] lg:text-[11px] text-slate-400 font-bold truncate max-w-[100px] lg:max-w-[130px]">
                {test.subject}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 2. MAIN BODY (LEFT QUESTION CARD + RIGHT PALETTE) */}
      <div className="flex-1 flex overflow-hidden p-2 sm:p-4 md:p-5 gap-2.5 sm:gap-4 relative">
        
        {/* PAUSE OVERLAY (APPEARS WHEN TEST IS PAUSED) */}
        {isPaused && (
          <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border space-y-6 animate-in fade-in zoom-in-95 duration-150 ${
              isDarkMode ? 'bg-[#151f32] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              
              <div className="w-18 h-18 rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto ring-8 ring-amber-500/10">
                <Pause className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black">
                  Examination Paused
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
                  Your timer is frozen. Questions are temporarily hidden to maintain exam integrity.
                </p>
              </div>

              {/* Quick stats during pause */}
              <div className={`grid grid-cols-3 gap-3 p-4 rounded-2xl border text-xs ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="text-slate-400 font-bold">Time Left</div>
                  <div className="font-mono font-black text-sm sm:text-base mt-0.5">
                    {formatTime(secondsRemaining)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-bold">Attempted</div>
                  <div className="font-black text-sm sm:text-base text-blue-600 mt-0.5">
                    {attemptedCount} / {questions.length}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-bold">Marked</div>
                  <div className="font-black text-sm sm:text-base text-amber-600 mt-0.5">
                    {markedCount}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaused(false)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Examination</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 font-bold text-sm transition-all cursor-pointer ${
                    isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Submit Test Now
                </button>
              </div>

            </div>
          </div>
        )}

        {/* LEFT COLUMN: QUESTION CARD & ACTIONS */}
        <main className={`flex-1 rounded-2xl border-2 shadow-xs flex flex-col justify-between overflow-hidden transition-colors ${
          isDarkMode ? 'bg-[#131b2e] border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          
          {/* Question Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 lg:p-8 xl:p-10">
            
            {/* Top Question Header Bar - Auto Adaptive & Harmonious (Uniform Height, No Icon Hiding) */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 lg:gap-4 pb-3 sm:pb-4 lg:pb-5 border-b ${
              isDarkMode ? 'border-slate-700/60' : 'border-slate-200'
            }`}>
              {/* Left Group: Question Number Pill & Subject Pill - Same Height, No Text Wrapping */}
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 min-w-0">
                {/* Purple Question Pill */}
                <span className="h-8 sm:h-9 lg:h-11 px-3 lg:px-5 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs sm:text-sm lg:text-base flex items-center justify-center shadow-xs shrink-0 whitespace-nowrap">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                {/* Subject Pill */}
                <span className={`h-8 sm:h-9 lg:h-11 px-2.5 sm:px-3 lg:px-5 rounded-lg sm:rounded-xl lg:rounded-2xl border font-bold text-xs sm:text-sm lg:text-base flex items-center justify-center min-w-0 max-w-[150px] xs:max-w-[200px] sm:max-w-none truncate shrink ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}>
                  <span className="truncate">{test.subject || 'General Studies'}</span>
                </span>
              </div>

              {/* Right Group: Font Size Selector & Bookmark Button - Equal Height, Fully Visible */}
              <div className="flex items-center justify-between sm:justify-end gap-2 lg:gap-3 shrink-0">
                
                {/* Font Size Adjuster (A- / A / A+) */}
                <div className={`h-8 sm:h-9 lg:h-11 p-0.5 sm:p-1 lg:p-1.5 rounded-lg sm:rounded-xl lg:rounded-2xl border flex items-center gap-0.5 sm:gap-1 lg:gap-1.5 shrink-0 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                }`} title="Adjust Font Size">
                  <button
                    type="button"
                    onClick={() => setFontSize('normal')}
                    className={`h-full px-2 sm:px-2.5 lg:px-3.5 rounded-md sm:rounded-lg lg:rounded-xl text-[11px] sm:text-xs lg:text-sm font-black transition-all cursor-pointer flex items-center justify-center ${
                      fontSize === 'normal'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Normal Font Size"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('large')}
                    className={`h-full px-2 sm:px-2.5 lg:px-3.5 rounded-md sm:rounded-lg lg:rounded-xl text-[11px] sm:text-xs lg:text-sm font-black transition-all cursor-pointer flex items-center justify-center ${
                      fontSize === 'large'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Large Font Size"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('xlarge')}
                    className={`h-full px-2 sm:px-2.5 lg:px-3.5 rounded-md sm:rounded-lg lg:rounded-xl text-[11px] sm:text-xs lg:text-sm font-black transition-all cursor-pointer flex items-center justify-center ${
                      fontSize === 'xlarge'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Extra Large Font Size"
                  >
                    A+
                  </button>
                </div>

                {/* Bookmark Button */}
                {currentQ && (
                  <button
                    type="button"
                    onClick={handleToggleBookmarkCurrent}
                    className={`h-8 sm:h-9 lg:h-11 px-3 lg:px-5 rounded-lg sm:rounded-xl lg:rounded-2xl border font-bold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1.5 lg:gap-2 transition-all cursor-pointer shrink-0 ${
                      bookmarkedIds.has(currentQ.id)
                        ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-2xs'
                        : isDarkMode
                          ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                    }`}
                    title={bookmarkedIds.has(currentQ.id) ? "Saved in Bookmarks" : "Bookmark this Question"}
                  >
                    <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0 ${bookmarkedIds.has(currentQ.id) ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
                    <span className="whitespace-nowrap">{bookmarkedIds.has(currentQ.id) ? 'Saved' : 'Bookmark'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Text Area (Enlarged, Clear & High Contrast) */}
            {currentQ ? (
              <div className="mt-6 lg:mt-8 space-y-4 lg:space-y-6">
                
                {/* English Question Text */}
                {(lang === 'both' || lang === 'en') && (
                  <p className={`${questionFontClass} ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    {currentQ.questionText}
                  </p>
                )}

                {/* Hindi Question Text */}
                {(lang === 'both' || lang === 'hi') && currentQ.questionTextHindi && (
                  <p className={`${hindiQuestionFontClass} ${
                    lang === 'both' 
                      ? isDarkMode ? 'text-slate-300 pt-3 lg:pt-4 border-t border-slate-700' : 'text-slate-800 pt-3 lg:pt-4 border-t border-slate-200' 
                      : isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    {currentQ.questionTextHindi}
                  </p>
                )}

                {/* Options List (Generous padding, enlarged text, clear radio buttons) */}
                <div className="pt-6 lg:pt-8 space-y-3.5 lg:space-y-4.5 max-w-none">
                  {currentQ.options.map((opt, optIdx) => {
                    const optHindi = currentQ.optionsHindi?.[optIdx];
                    const isSelected = currentAnswer === optIdx;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                    return (
                      <div
                        key={optIdx}
                        onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }))}
                        className={`p-4 sm:p-5 lg:p-5.5 xl:p-6 rounded-2xl lg:rounded-3xl border-2 flex items-center justify-between transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? isDarkMode
                              ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md font-semibold ring-2 ring-indigo-500/40'
                              : 'bg-indigo-50/90 border-indigo-600 text-indigo-950 shadow-xs font-semibold ring-2 ring-indigo-200'
                            : isDarkMode
                              ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200'
                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 text-slate-800 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-4 lg:gap-5 flex-1 min-w-0 mr-3">
                          {/* Radio Button Indicator */}
                          <div className={`w-6 h-6 lg:w-7.5 lg:h-7.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected 
                              ? 'border-indigo-600 bg-white' 
                              : isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && (
                              <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-indigo-600" />
                            )}
                          </div>

                          {/* Option Letter + Text */}
                          <div className={`flex items-baseline gap-2.5 lg:gap-3.5 ${optionTextFontClass}`}>
                            <span className="font-black text-indigo-600 dark:text-indigo-400 text-base sm:text-lg lg:text-xl shrink-0">{letter}.</span>
                            <div>
                              <span className="font-semibold">{opt}</span>
                              {lang === 'both' && optHindi && (
                                <span className={`block text-xs sm:text-sm lg:text-base font-medium mt-0.5 lg:mt-1 ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  {optHindi}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* "Your Answer" Green Pill Badge */}
                        {isSelected && (
                          <span className="bg-emerald-600 text-white text-xs sm:text-sm lg:text-base font-black px-3.5 lg:px-5 py-1 lg:py-1.5 rounded-lg lg:rounded-xl shadow-xs shrink-0 tracking-wide">
                            Your Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                No question available.
              </div>
            )}

          </div>

          {/* Action Footer (Previous, Mark for Review, Clear Response, Save & Next - Perfectly Equal Height & Symmetrical) */}
          <footer className={`p-3 sm:p-4 lg:p-5 border-t shrink-0 transition-colors ${
            isDarkMode ? 'bg-[#131b2e] border-slate-700/80' : 'bg-slate-50/90 border-slate-200'
          }`}>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4 w-full">
              
              {/* 1. Previous Button */}
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
                className={`h-11 sm:h-12 lg:h-14 xl:h-15 px-2 sm:px-4 lg:px-6 rounded-xl lg:rounded-2xl border-2 font-black text-xs sm:text-sm lg:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap min-w-0 overflow-hidden ${
                  isDarkMode 
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs'
                }`}
                title="Previous Question"
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                <span className="truncate hidden sm:inline">Previous</span>
                <span className="truncate sm:hidden">Prev</span>
              </button>

              {/* 2. Mark for Review Button */}
              <button
                type="button"
                onClick={handleToggleMarkForReview}
                className={`h-11 sm:h-12 lg:h-14 xl:h-15 px-2 sm:px-4 lg:px-6 rounded-xl lg:rounded-2xl border-2 font-black text-xs sm:text-sm lg:text-base transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap min-w-0 overflow-hidden ${
                  markedIds.has(currentQ?.id || '')
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : isDarkMode
                      ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700'
                      : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 shadow-2xs'
                }`}
                title="Mark this question for review"
              >
                <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0" />
                <span className="truncate hidden md:inline">
                  {markedIds.has(currentQ?.id || '') ? 'Marked' : 'Mark for Review'}
                </span>
                <span className="truncate md:hidden">
                  {markedIds.has(currentQ?.id || '') ? 'Marked' : 'Mark'}
                </span>
              </button>

              {/* 3. Clear Response Button */}
              <button
                type="button"
                onClick={handleClearResponse}
                className={`h-11 sm:h-12 lg:h-14 xl:h-15 px-2 sm:px-4 lg:px-6 rounded-xl lg:rounded-2xl border-2 font-black text-xs sm:text-sm lg:text-base transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap min-w-0 overflow-hidden ${
                  isDarkMode 
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs'
                }`}
                title="Clear Selected Option"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0 text-slate-500" />
                <span className="truncate hidden md:inline">Clear Response</span>
                <span className="truncate md:hidden">Clear</span>
              </button>

              {/* 4. Save & Next Button */}
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="h-11 sm:h-12 lg:h-14 xl:h-15 px-2 sm:px-5 lg:px-7 rounded-xl lg:rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1 sm:gap-2 shadow-md shadow-indigo-500/25 transition-all cursor-pointer whitespace-nowrap min-w-0 overflow-hidden"
                title="Save & Next Question"
              >
                <span className="truncate hidden sm:inline">Save & Next</span>
                <span className="truncate sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
              </button>

            </div>

          </footer>

        </main>

        {/* Backdrop for Mobile only when Palette is Open */}
        {showPalette && (
          <div
            className="fixed inset-0 bg-slate-950/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
            onClick={() => setShowPalette(false)}
          />
        )}

        {/* Floating Corner Box Icon Button for Mobile & Tablet (Hidden on Laptop) */}
        {!showPalette && (
          <button
            type="button"
            onClick={() => setShowPalette(true)}
            className="lg:hidden fixed right-4 bottom-20 sm:bottom-24 z-30 w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-600/35 border-2 border-white/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Open Question Palette (प्रश्नावली खोलें)"
          >
            <LayoutGrid className="w-5 h-5 drop-shadow-sm" />
            {/* Small badge showing current question number */}
            <span className="absolute -top-1.5 -left-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-500 text-white font-mono font-black text-[10px] flex items-center justify-center shadow-xs border-2 border-white">
              {currentIndex + 1}
            </span>
          </button>
        )}

        {/* RIGHT COLUMN: QUESTION PALETTE & SUMMARY (Fixed on side for Tablet and Laptop, collapsible on Mobile) */}
        <aside className={`
          ${showPalette 
            ? 'fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[390px] flex shadow-2xl md:static md:z-auto md:shadow-xs md:w-72 lg:w-88 xl:w-[410px] 2xl:w-[440px]' 
            : 'hidden'}
          rounded-2xl lg:rounded-3xl border-2 flex-col justify-between shrink-0 overflow-hidden transition-all duration-200
          ${isDarkMode ? 'bg-[#131b2e] border-slate-700/80' : 'bg-white border-slate-200'}
        `}>
          
          <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col overflow-hidden">
            
            {/* Palette Header with small close button - Only on Mobile & Tablet (Hidden on Laptop) */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs lg:text-sm font-black uppercase tracking-wider text-slate-400">
                Question Palette
              </span>
              <button
                type="button"
                onClick={() => setShowPalette(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center"
                title="Hide Palette (पैलेट छुपाएं)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Top Tabs: [Questions] and [Summary] */}
            <div className={`p-1.5 lg:p-2 rounded-2xl flex items-center gap-1.5 lg:gap-2 mb-4 lg:mb-5 border ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setRightTab('questions')}
                className={`flex-1 py-2.5 lg:py-3.5 rounded-xl lg:rounded-2xl text-xs sm:text-sm lg:text-base font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  rightTab === 'questions'
                    ? isDarkMode 
                      ? 'bg-slate-700 text-indigo-300 shadow-sm' 
                      : 'bg-white text-indigo-700 shadow-xs border-2 border-indigo-100'
                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Questions</span>
              </button>

              <button
                type="button"
                onClick={() => setRightTab('summary')}
                className={`flex-1 py-2.5 lg:py-3.5 rounded-xl lg:rounded-2xl text-xs sm:text-sm lg:text-base font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  rightTab === 'summary'
                    ? isDarkMode 
                      ? 'bg-slate-700 text-indigo-300 shadow-sm' 
                      : 'bg-white text-indigo-700 shadow-xs border-2 border-indigo-100'
                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Summary</span>
              </button>
            </div>

            {/* TAB 1: QUESTIONS PALETTE VIEW */}
            {rightTab === 'questions' ? (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                
                {/* Status Legend & Total Questions Row */}
                <div>
                  <div className={`flex items-start justify-between gap-2 pb-3.5 border-b ${
                    isDarkMode ? 'border-slate-700/60' : 'border-slate-200'
                  }`}>
                    {/* Left: 2 Columns of Legend Items */}
                    <div className="grid grid-cols-2 gap-x-3.5 lg:gap-x-5 gap-y-2 lg:gap-y-2.5 text-xs lg:text-sm font-bold">
                      
                      {/* Not Attempted */}
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 inline-block shrink-0" />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Not Attempted</span>
                      </div>

                      {/* Attempted */}
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded bg-blue-600 inline-block shrink-0" />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Attempted</span>
                      </div>

                      {/* Marked */}
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded bg-amber-500 inline-block shrink-0" />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Marked</span>
                      </div>

                      {/* Correct */}
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded bg-emerald-600 inline-block shrink-0" />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Correct</span>
                      </div>

                      {/* Wrong */}
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded bg-rose-600 inline-block shrink-0" />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Wrong</span>
                      </div>

                    </div>

                    {/* Right: Total Questions Badge */}
                    <div className="text-right shrink-0">
                      <div className="text-xs lg:text-sm text-slate-400 font-bold uppercase tracking-wider">Total Questions</div>
                      <div className={`text-3xl lg:text-4xl font-black leading-none mt-1 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {questions.length}
                      </div>
                    </div>
                  </div>

                  {/* Question Palette Grid (LARGER BOXES WITH HIGH CONTRAST STATUSES) */}
                  <div className="my-4 lg:my-5 max-h-[300px] sm:max-h-[360px] lg:max-h-[460px] xl:max-h-[520px] overflow-y-auto pr-1">
                    <div className={`grid ${paletteColsClass} gap-2 sm:gap-2.5 lg:gap-3`}>
                      {questions.map((q, idx) => {
                        const isCurrent = idx === currentIndex;
                        const isAns = answers[q.id] !== undefined && answers[q.id] !== null;
                        const isM = markedIds.has(q.id);

                        let bgClass = isDarkMode 
                          ? 'bg-slate-800 text-slate-200 border-2 border-slate-700 hover:bg-slate-700' 
                          : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 shadow-2xs';

                        if (isCurrent) {
                          // Current Question: Deep Indigo/Violet Gradient with ring
                          bgClass = 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-black ring-4 ring-indigo-400 ring-offset-2 ring-offset-transparent shadow-md scale-105 z-10 border-2 border-indigo-700';
                        } else if (isM) {
                          // Marked: Bold Amber
                          bgClass = 'bg-amber-500 text-white font-black border-2 border-amber-600 shadow-xs';
                        } else if (isAns) {
                          // Attempted: Bold Blue
                          bgClass = 'bg-blue-600 text-white font-black border-2 border-blue-700 shadow-xs';
                        }

                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => goToQuestion(idx)}
                            className={`${paletteBoxSizeClass} flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                          >
                            <span>{idx + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Stats Summary Row (Correct, Wrong, Marked, Attempted, Not Attempted) */}
                <div className={`pt-3.5 lg:pt-4 border-t-2 grid grid-cols-5 gap-1.5 lg:gap-2 text-center ${
                  isDarkMode ? 'border-slate-700/80' : 'border-slate-200'
                }`}>
                  {/* Correct */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-[11px] lg:text-xs font-bold text-slate-500">
                      <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-emerald-600" />
                      <span>Correct</span>
                    </div>
                    <div className="font-black text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white">{correctCount}</div>
                  </div>

                  {/* Wrong */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-[11px] lg:text-xs font-bold text-slate-500">
                      <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-rose-600" />
                      <span>Wrong</span>
                    </div>
                    <div className="font-black text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white">{wrongCount}</div>
                  </div>

                  {/* Marked */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-[11px] lg:text-xs font-bold text-slate-500">
                      <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-amber-500" />
                      <span>Marked</span>
                    </div>
                    <div className="font-black text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white">{markedCount}</div>
                  </div>

                  {/* Attempted */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-[11px] lg:text-xs font-bold text-slate-500">
                      <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-blue-600" />
                      <span>Attempted</span>
                    </div>
                    <div className="font-black text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white">{attemptedCount}</div>
                  </div>

                  {/* Not Attempted */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-[11px] lg:text-xs font-bold text-slate-500">
                      <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-slate-400" />
                      <span>Not Att.</span>
                    </div>
                    <div className="font-black text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white">{notAttemptedCount}</div>
                  </div>
                </div>

              </div>
            ) : (
              /* TAB 2: SUMMARY VIEW (BEAUTIFUL, CLEAN & HIGH CONTRAST) */
              <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-4 pr-1">
                <div className="space-y-3.5">
                  
                  {/* Performance Summary Banner */}
                  <div className={`p-4 rounded-2xl border-2 space-y-1 ${
                    isDarkMode 
                      ? 'bg-indigo-950/40 border-indigo-700/60 text-indigo-200' 
                      : 'bg-gradient-to-r from-violet-50 to-indigo-50 border-indigo-200 text-indigo-950'
                  }`}>
                    <div className="font-black text-sm text-indigo-900 dark:text-indigo-200">Test Performance Summary</div>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                      Check your attempt status across all questions before final submission.
                    </p>
                  </div>

                  {/* Summary Metric Rows - Crisp, Elegant & Legible */}
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    
                    {/* Total Questions */}
                    <div className={`flex items-center justify-between p-3.5 rounded-xl border-2 shadow-2xs ${
                      isDarkMode 
                        ? 'bg-slate-800/80 border-slate-700 text-slate-200' 
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                      <span className="font-bold text-slate-600 dark:text-slate-400">Total Questions</span>
                      <span className="font-black text-base text-slate-900 dark:text-white">{questions.length}</span>
                    </div>

                    {/* Attempted */}
                    <div className={`flex items-center justify-between p-3.5 rounded-xl border-2 shadow-2xs ${
                      isDarkMode 
                        ? 'bg-blue-950/40 border-blue-800 text-blue-200' 
                        : 'bg-blue-50/90 border-blue-200 text-blue-950'
                    }`}>
                      <span className="font-bold text-blue-800 dark:text-blue-300">Attempted</span>
                      <span className="font-black text-base text-blue-700 dark:text-blue-200">{attemptedCount}</span>
                    </div>

                    {/* Marked for Review */}
                    <div className={`flex items-center justify-between p-3.5 rounded-xl border-2 shadow-2xs ${
                      isDarkMode 
                        ? 'bg-amber-950/40 border-amber-800 text-amber-200' 
                        : 'bg-amber-50/90 border-amber-200 text-amber-950'
                    }`}>
                      <span className="font-bold text-amber-800 dark:text-amber-300">Marked for Review</span>
                      <span className="font-black text-base text-amber-700 dark:text-amber-200">{markedCount}</span>
                    </div>

                    {/* Unattempted */}
                    <div className={`flex items-center justify-between p-3.5 rounded-xl border-2 shadow-2xs ${
                      isDarkMode 
                        ? 'bg-slate-800/80 border-slate-700 text-slate-200' 
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      <span className="font-bold text-slate-600 dark:text-slate-400">Unattempted</span>
                      <span className="font-black text-base text-slate-700 dark:text-white">{notAttemptedCount}</span>
                    </div>

                    {/* Time Remaining */}
                    <div className={`flex items-center justify-between p-3.5 rounded-xl border-2 shadow-2xs ${
                      isDarkMode 
                        ? 'bg-purple-950/40 border-purple-800 text-purple-200' 
                        : 'bg-purple-50/90 border-purple-200 text-purple-950'
                    }`}>
                      <span className="font-bold text-purple-800 dark:text-purple-300">Time Remaining</span>
                      <span className="font-black font-mono text-base text-purple-900 dark:text-white">{formatTime(secondsRemaining)}</span>
                    </div>

                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-4 lg:py-4.5 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base lg:text-lg shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                    <span>Submit Examination</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Submit Examination Button */}
          {rightTab === 'questions' && (
            <div className={`p-4 sm:p-5 lg:p-6 border-t-2 transition-colors ${
              isDarkMode ? 'bg-[#131b2e] border-slate-700/80' : 'bg-slate-50/60 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3.5 sm:py-4 lg:py-4.5 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base lg:text-lg shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                <span>Submit Examination</span>
              </button>
            </div>
          )}

        </aside>

      </div>

      {/* SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 space-y-5 animate-in fade-in zoom-in-95 duration-150 ${
            isDarkMode ? 'bg-[#151f32] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-3.5 ${
              isDarkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <h3 className="text-lg font-black flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Submit Examination?</span>
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick summary table */}
            <div className={`p-4 rounded-2xl border-2 space-y-2.5 text-xs sm:text-sm ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Total Questions:</span>
                <span className="font-black text-slate-900 dark:text-white">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 font-bold">Attempted:</span>
                <span className="font-black text-blue-700 dark:text-blue-300">{attemptedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-600 font-bold">Marked for Review:</span>
                <span className="font-black text-amber-700 dark:text-amber-300">{markedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Unattempted:</span>
                <span className="font-black text-slate-900 dark:text-white">{notAttemptedCount}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2.5 font-mono">
                <span className="text-slate-500 font-bold">Time Left:</span>
                <span className="font-black text-slate-900 dark:text-white">{formatTime(secondsRemaining)}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Are you sure you want to submit your examination? Once submitted, answers cannot be edited. Your complete score and analytics report will open immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className={`px-5 py-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm cursor-pointer ${
                  isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Cancel & Continue
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  finalizeAttempt();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                Yes, Submit Test
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EXIT CONFIRMATION MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
            isDarkMode ? 'bg-[#151f32] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <span>Exit Examination?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              If you leave now without submitting, your ongoing mock test session will be terminated.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className={`px-4 py-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm cursor-pointer ${
                  isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Resume Test
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                  }
                  onExit();
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
