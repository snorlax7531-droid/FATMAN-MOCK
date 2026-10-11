import React, { useState } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  Play, 
  Clock, 
  Search, 
  Filter, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { STUDY_PLAN_60_DAYS, StudyDay } from '../data/initialData';
import { TestModel, AttemptModel } from '../types';
import { SUBJECT_METADATA } from './SubjectCards';

interface StudyPlan60DaysProps {
  tests: TestModel[];
  userAttempts: AttemptModel[];
  onStartTest: (testId: string) => void;
  onOpenAdminAssignModal?: (dayNumber: number) => void;
  isAdmin?: boolean;
}

export const StudyPlan60Days: React.FC<StudyPlan60DaysProps> = ({
  tests,
  userAttempts,
  onStartTest,
  onOpenAdminAssignModal,
  isAdmin
}) => {
  const [search, setSearch] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');

  // Set of test IDs user completed
  const completedTestIds = new Set(userAttempts.map(a => a.testId));

  // Filter days
  const filteredDays = STUDY_PLAN_60_DAYS.filter(day => {
    // Week filter (Week 1 = 1-7, Week 2 = 8-14, ...)
    if (selectedWeek !== 'all') {
      const minDay = (selectedWeek - 1) * 7 + 1;
      const maxDay = selectedWeek * 7;
      if (day.dayNumber < minDay || day.dayNumber > maxDay) return false;
    }

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchTitle = day.topicTitle.toLowerCase().includes(query);
      const matchSubject = day.subject.toLowerCase().includes(query);
      const matchSub = day.subtopics.some(s => s.toLowerCase().includes(query));
      return matchTitle || matchSubject || matchSub || day.dayNumber.toString() === query;
    }

    return true;
  });

  // Calculate completed count
  const completedCount = STUDY_PLAN_60_DAYS.filter(d => {
    // Find assigned test
    const assignedTest = tests.find(t => t.dayNumber === d.dayNumber) || 
      (d.testId ? tests.find(t => t.id === d.testId) : null);
    return assignedTest && completedTestIds.has(assignedTest.id);
  }).length;

  const progressPercent = Math.round((completedCount / 60) * 100);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 60-Day Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1b0a33] via-[#291047] to-[#120424] text-white p-6 md:p-8 shadow-xl border border-purple-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>SSC GK/GS MASTER ROADMAP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              60-Day Structured Study & Mock Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Day-by-day precision curriculum designed by Parmar Sir covering all high-weightage topics in History, Polity, Geography, Economy, Static GK & Science with daily timed mock tests.
            </p>
          </div>

          {/* Progress Pill Box */}
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-pink-500/30 text-center min-w-[170px] shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Roadmap Progress
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {completedCount} <span className="text-sm font-medium text-slate-400">/ 60 Days</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2.5">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-300" 
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
            <div className="text-[11px] text-pink-400 font-bold mt-1.5">
              {progressPercent}% Completed
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topic, day, or subject..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white"
          />
        </div>

        {/* Week Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-bold">
          <button
            onClick={() => setSelectedWeek('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedWeek === 'all' ? 'bg-pink-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 60 Days
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedWeek === w ? 'bg-pink-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Week {w}
            </button>
          ))}
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDays.map((day) => {
          // Check for linked mock test:
          // Either test has dayNumber == day.dayNumber, or initial day.testId
          const assignedTest = tests.find(t => t.dayNumber === day.dayNumber) || 
            (day.testId ? tests.find(t => t.id === day.testId) : null);

          const isCompleted = assignedTest && completedTestIds.has(assignedTest.id);
          const pastAttempt = isCompleted ? userAttempts.find(a => a.testId === assignedTest.id) : null;

          // Subject theme
          const subMeta = SUBJECT_METADATA.find(s => s.name.toLowerCase() === day.subject.toLowerCase()) || {
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            iconColor: 'text-purple-600',
            btnColor: 'bg-purple-600 hover:bg-purple-700 text-white'
          };

          return (
            <div
              key={day.dayNumber}
              className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                isCompleted 
                  ? 'bg-emerald-50/40 border-emerald-200/80' 
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Top: Day # & Subject Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    D{day.dayNumber}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${subMeta.bgColor} ${subMeta.iconColor} border-current/20`}>
                      {day.subject}
                    </span>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Topic Title */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {day.topicTitle}
                  </h3>
                </div>

                {/* Subtopics checklist */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {day.subtopics.map((sub, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Test Link or Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                {assignedTest ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium truncate max-w-[180px]">
                        <BookOpen className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                        <span className="truncate">{assignedTest.title}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {assignedTest.durationMinutes}m
                      </span>
                    </div>

                    {isCompleted && pastAttempt ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-100/70 text-emerald-900 text-xs font-bold">
                        <span>Score: {pastAttempt.score} / {pastAttempt.totalMarks}</span>
                        <button
                          onClick={() => onStartTest(assignedTest.id)}
                          className="text-[11px] text-emerald-800 underline hover:text-emerald-950 font-semibold cursor-pointer"
                        >
                          Retake
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartTest(assignedTest.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-pink-600/20 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Day {day.dayNumber} Mock</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400 italic">Self Study / Theory Day</span>
                    {isAdmin && onOpenAdminAssignModal && (
                      <button
                        onClick={() => onOpenAdminAssignModal(day.dayNumber)}
                        className="text-[11px] font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        + Assign Mock Test
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
