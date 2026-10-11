import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Bookmark, 
  RotateCcw, 
  Home, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  CalendarDays 
} from 'lucide-react';
import { AttemptModel, Question, BookmarkModel } from '../types';
import { TestService } from '../services/testService';
import { useAuth } from '../context/AuthContext';

interface PerformanceAnalyticsProps {
  attempt: AttemptModel;
  questions: Question[];
  existingBookmarks?: BookmarkModel[];
  onToggleBookmark?: (q: Question, testId: string, subject: string) => Promise<boolean>;
  onRetake: () => void;
  onGoHome: () => void;
  onGoStudyPlan: () => void;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  attempt,
  questions,
  existingBookmarks,
  onToggleBookmark,
  onRetake,
  onGoHome,
  onGoStudyPlan
}) => {
  const { userProfile } = useAuth();
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    existingBookmarks?.forEach(b => ids.add(b.questionId));
    return ids;
  });
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set(questions.map(q => q.id)));

  useEffect(() => {
    if (existingBookmarks) {
      setBookmarkedIds(new Set(existingBookmarks.map(b => b.questionId)));
    }
  }, [existingBookmarks]);

  // Toggle bookmark
  const handleToggleBookmark = async (q: Question) => {
    let isNowBookmarked: boolean;
    if (onToggleBookmark) {
      isNowBookmarked = await onToggleBookmark(q, attempt.testId, attempt.subject);
    } else {
      const effectiveUserId = userProfile?.uid || userProfile?.email || 'guest-aspirant';
      isNowBookmarked = await TestService.toggleBookmark({
        userId: effectiveUserId,
        questionId: q.id,
        testId: attempt.testId,
        questionText: q.questionText,
        questionTextHindi: q.questionTextHindi,
        options: q.options,
        optionsHindi: q.optionsHindi,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
        explanationHindi: q.explanationHindi,
        subject: attempt.subject
      });
    }

    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (isNowBookmarked) next.add(q.id);
      else next.delete(q.id);
      return next;
    });
  };

  const toggleExplanation = (qId: string) => {
    setExpandedExplanations(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Compute topic-wise breakdown
  const topicMap: Record<string, { total: number; correct: number; incorrect: number }> = {};
  questions.forEach(q => {
    const topic = q.topic || 'General Knowledge';
    if (!topicMap[topic]) {
      topicMap[topic] = { total: 0, correct: 0, incorrect: 0 };
    }
    topicMap[topic].total++;

    const studentAns = attempt.answers.find(a => a.questionId === q.id);
    if (studentAns?.isCorrect) {
      topicMap[topic].correct++;
    } else if (studentAns?.selectedOptionIndex !== null && studentAns?.selectedOptionIndex !== undefined) {
      topicMap[topic].incorrect++;
    }
  });

  const topicsList = Object.entries(topicMap).map(([topic, data]) => {
    const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    return { topic, ...data, accuracy };
  });

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    const studentAns = attempt.answers.find(a => a.questionId === q.id);
    const isAttempted = studentAns?.selectedOptionIndex !== null && studentAns?.selectedOptionIndex !== undefined;
    const isCorrect = studentAns?.isCorrect;

    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return isAttempted && !isCorrect;
    if (filter === 'unattempted') return !isAttempted;
    return true;
  });

  // Format time
  const formatSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  const percentile = Math.min(99.4, Math.max(45, Math.round(55 + (attempt.score / (attempt.totalMarks || 1)) * 42)));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Top Banner & Score Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#170a2c] via-[#281144] to-[#120524] text-white p-6 md:p-8 shadow-xl border border-purple-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Test Result & Scorecard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {attempt.testTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Subject: <b>{attempt.subject}</b> • Candidate: <b>{attempt.userName}</b> • Completed on {new Date(attempt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Big Score Circular Card */}
          <div className="flex items-center gap-6">
            <div className="text-center p-4 rounded-2xl bg-black/40 backdrop-blur-sm border border-pink-500/30 shadow-lg min-w-[140px]">
              <div className="text-xs text-pink-400 font-bold uppercase tracking-wider">
                Total Score
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                {attempt.score} <span className="text-base text-slate-400 font-medium">/ {attempt.totalMarks}</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
                {percentile}th Percentile
              </div>
            </div>
          </div>

        </div>

        {/* 4 Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-800/40">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-pink-400" />
              <span>Accuracy</span>
            </div>
            <div className="text-xl font-bold text-white mt-1">{attempt.accuracy}%</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Time Spent</span>
            </div>
            <div className="text-xl font-bold text-white mt-1">{formatSec(attempt.timeTakenSeconds)}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Correct</span>
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{attempt.correctCount}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Incorrect</span>
            </div>
            <div className="text-xl font-bold text-rose-400 mt-1">{attempt.incorrectCount}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={onGoStudyPlan}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-purple-600" />
            <span>60 Day Plan</span>
          </button>
        </div>

        <button
          onClick={onRetake}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-600/30 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Mock Test</span>
        </button>
      </div>

      {/* Topic-Wise Breakdown Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Topic-Wise Performance Breakdown
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Topic Name</th>
                <th className="py-3 px-4 text-center">Questions</th>
                <th className="py-3 px-4 text-center text-emerald-600">Correct</th>
                <th className="py-3 px-4 text-center text-rose-600">Incorrect</th>
                <th className="py-3 px-4 text-center">Accuracy</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {topicsList.map((t) => (
                <tr key={t.topic} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">{t.topic}</td>
                  <td className="py-3 px-4 text-center font-bold">{t.total}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">{t.correct}</td>
                  <td className="py-3 px-4 text-center font-bold text-rose-600">{t.incorrect}</td>
                  <td className="py-3 px-4 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded-full ${
                      t.accuracy >= 70 ? 'bg-emerald-50 text-emerald-700' :
                      t.accuracy >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {t.accuracy}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {t.accuracy >= 75 ? (
                      <span className="text-[11px] font-bold text-emerald-600">Strong Mastery</span>
                    ) : t.accuracy >= 50 ? (
                      <span className="text-[11px] font-bold text-amber-600">Moderate - Needs Practice</span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-600">Focus Needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question-By-Question Detailed Solutions Review */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            Detailed Solutions & Explanations ({filteredQuestions.length})
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === 'correct' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-emerald-700'}`}
            >
              Correct ({attempt.correctCount})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === 'incorrect' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-rose-700'}`}
            >
              Incorrect ({attempt.incorrectCount})
            </button>
            <button
              onClick={() => setFilter('unattempted')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === 'unattempted' ? 'bg-white text-slate-700 shadow-2xs' : 'text-slate-600 hover:text-slate-700'}`}
            >
              Unattempted ({attempt.unattemptedCount})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const studentAns = attempt.answers.find(a => a.questionId === q.id);
            const selectedOpt = studentAns?.selectedOptionIndex;
            const isAttempted = selectedOpt !== null && selectedOpt !== undefined;
            const isCorrect = studentAns?.isCorrect;
            const isExpanded = expandedExplanations.has(q.id);
            const isBookmarked = bookmarkedIds.has(q.id);

            return (
              <div 
                key={q.id}
                className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-xs space-y-4 transition-all"
              >
                {/* Header: Q Number, Topic, Status Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                      Q{q.questionNumber || idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">
                      {q.topic || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Pill */}
                    {isCorrect ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct (+2)</span>
                      </span>
                    ) : isAttempted ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect (-0.5)</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Skipped (0)</span>
                      </span>
                    )}

                    {/* Bookmark Question */}
                    <button
                      onClick={() => handleToggleBookmark(q)}
                      title={isBookmarked ? "Bookmarked" : "Bookmark question for revision"}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked 
                          ? 'bg-pink-50 text-pink-600 border-pink-200' 
                          : 'bg-white text-slate-400 hover:text-pink-600 border-slate-200'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-1">
                  <p className="text-base font-semibold text-slate-900 leading-snug">
                    {q.questionText}
                  </p>
                  {q.questionTextHindi && (
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {q.questionTextHindi}
                    </p>
                  )}
                </div>

                {/* Options List with Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isRightOption = optIdx === q.correctOptionIndex;
                    const isStudentChosen = selectedOpt === optIdx;

                    let cardClass = 'border-slate-200 bg-white text-slate-700';
                    let letterClass = 'bg-slate-100 text-slate-600';

                    if (isRightOption) {
                      cardClass = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
                      letterClass = 'bg-emerald-600 text-white';
                    } else if (isStudentChosen && !isRightOption) {
                      cardClass = 'border-rose-500 bg-rose-50/80 text-rose-950 font-bold';
                      letterClass = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${cardClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${letterClass}`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isRightOption && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Correct
                          </span>
                        )}
                        {isStudentChosen && !isRightOption && (
                          <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="rounded-xl bg-purple-50/60 border border-purple-100 overflow-hidden">
                  <button
                    onClick={() => toggleExplanation(q.id)}
                    className="w-full p-3 flex items-center justify-between font-bold text-xs text-purple-900 hover:bg-purple-100/50 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>💡 Parmar Sir's Detailed Explanation</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 pt-1 text-xs text-slate-700 space-y-2 border-t border-purple-100/60 leading-relaxed">
                      <p>{q.explanation}</p>
                      {q.explanationHindi && (
                        <p className="text-slate-600 pt-1 border-t border-purple-100/40">
                          {q.explanationHindi}
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
