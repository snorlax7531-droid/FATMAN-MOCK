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
  ArrowRight,
  X,
  PlusCircle
} from 'lucide-react';
import { STUDY_PLAN_60_DAYS, StudyDay } from '../data/initialData';
import { TestModel, AttemptModel } from '../types';
import { SUBJECT_METADATA } from './SubjectCards';
import { SUBJECTS_CHAPTERS_DATA, getOrCreateChapterMockTest } from '../data/chaptersData';

interface StudyPlan60DaysProps {
  tests: TestModel[];
  userAttempts: AttemptModel[];
  onStartTest: (testId: string) => void;
  onOpenAdminAssignModal?: (dayNumber: number) => void;
  isAdmin?: boolean;
}

// Helper to get exact homepage chapter mock tests for a study day
function getTestsForStudyDay(day: StudyDay, allTests: TestModel[]): TestModel[] {
  const resultTests: TestModel[] = [];

  // 1. Check explicit custom/admin assigned tests for this day
  const explicitTests = allTests.filter(t => t.dayNumber === day.dayNumber);
  resultTests.push(...explicitTests);

  // 2. Map day subtopics and subject to the exact chapters in SUBJECTS_CHAPTERS_DATA (Homepage Subject Cards chapters)
  for (const subStr of day.subtopics) {
    for (const subData of SUBJECTS_CHAPTERS_DATA) {
      const matchChapter = subData.chapters.find(ch => 
        subStr.toLowerCase().includes(ch.englishTitle.toLowerCase()) ||
        subStr.toLowerCase().includes(ch.hindiTitle.toLowerCase()) ||
        (subStr.includes(ch.chapterNumber.toString()) && 
         (subData.name.toLowerCase() === day.subject.toLowerCase() || 
          subStr.toLowerCase().includes(subData.name.toLowerCase())))
      );

      if (matchChapter) {
        const testId = `test-${matchChapter.id}`;
        if (!resultTests.some(t => t.id === testId)) {
          const { test } = getOrCreateChapterMockTest(matchChapter, subData);
          resultTests.push(test);
        }
      }
    }
  }

  // 3. Fallback: match by day subject chapters if subtopics didn't yield an exact match
  if (resultTests.length === 0) {
    const subData = SUBJECTS_CHAPTERS_DATA.find(s => s.name.toLowerCase() === day.subject.toLowerCase()) || SUBJECTS_CHAPTERS_DATA[0];
    const chIndex = (day.dayNumber - 1) % subData.chapters.length;
    const ch = subData.chapters[chIndex];
    if (ch) {
      const { test } = getOrCreateChapterMockTest(ch, subData);
      resultTests.push(test);
    }
  }

  return resultTests;
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
  const [activeDayModal, setActiveDayModal] = useState<StudyDay | null>(null);

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
    const assignedTests = getTestsForStudyDay(d, tests);
    if (assignedTests.length === 0) return false;
    return assignedTests.some(t => completedTestIds.has(t.id));
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
              Day-by-day precision curriculum with exact homepage chapter tests covering all high-weightage topics in History, Polity, Geography, Economy, Static GK & Science.
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
          // Get exact chapter tests for this day matching homepage subject cards
          const assignedTests = getTestsForStudyDay(day, tests);
          const completedTestsCount = assignedTests.filter(t => completedTestIds.has(t.id)).length;
          const isAllCompleted = assignedTests.length > 0 && completedTestsCount === assignedTests.length;
          const isPartiallyCompleted = completedTestsCount > 0 && completedTestsCount < assignedTests.length;

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
              onClick={() => setActiveDayModal(day)}
              className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer group ${
                isAllCompleted 
                  ? 'bg-emerald-50/40 border-emerald-200/80' 
                  : isPartiallyCompleted
                  ? 'bg-amber-50/30 border-amber-200/80'
                  : 'bg-white border-slate-200/80 hover:border-pink-300'
              }`}
            >
              {/* Top: Day # & Subject Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-black text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    D{day.dayNumber}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${subMeta.bgColor} ${subMeta.iconColor} border-current/20`}>
                      {day.subject}
                    </span>

                    {isAllCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </span>
                    ) : isPartiallyCompleted ? (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        {completedTestsCount}/{assignedTests.length} Done
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Topic Title */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-pink-600 transition-colors">
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

              {/* Bottom Test Summary & Click to View Mocks */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <BookOpen className="w-4 h-4 text-pink-600" />
                  <span>{assignedTests.length} Chapter Mock{assignedTests.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-extrabold text-pink-600 group-hover:translate-x-1 transition-transform">
                  <span>View Mocks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* DAY MODAL FOR CHAPTER MOCKS */}
      {activeDayModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-black text-xs">
                    Day {activeDayModal.dayNumber}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800">
                    {activeDayModal.subject}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 pt-1">
                  {activeDayModal.topicTitle}
                </h2>
              </div>
              <button
                onClick={() => setActiveDayModal(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subtopics Checklist */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Homepage Subject Chapters & Curriculum
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeDayModal.subtopics.map((sub, idx) => (
                  <span key={idx} className="text-xs font-semibold bg-white text-slate-700 px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Mock Tests List for this Day */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Chapter Mock Tests ({getTestsForStudyDay(activeDayModal, tests).length})
                </h3>
                {isAdmin && onOpenAdminAssignModal && (
                  <button
                    onClick={() => {
                      onOpenAdminAssignModal(activeDayModal.dayNumber);
                      setActiveDayModal(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Assign Custom Test</span>
                  </button>
                )}
              </div>

              {getTestsForStudyDay(activeDayModal, tests).length > 0 ? (
                <div className="space-y-3">
                  {getTestsForStudyDay(activeDayModal, tests).map((test) => {
                    const isDone = completedTestIds.has(test.id);
                    const attempt = isDone ? userAttempts.find(a => a.testId === test.id) : null;

                    return (
                      <div 
                        key={test.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isDone ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 hover:border-pink-300 shadow-2xs'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">
                              {test.title}
                            </h4>
                            {isDone && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Completed</span>
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-pink-600" />
                              {test.questionCount || 5} Questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {test.durationMinutes} Minutes
                            </span>
                            {isDone && attempt && (
                              <span className="font-bold text-emerald-800 font-mono">
                                Score: {attempt.score}/{attempt.totalMarks}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveDayModal(null);
                            onStartTest(test.id);
                          }}
                          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                            isDone 
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200' 
                              : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-sm shadow-pink-600/20'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isDone ? 'Retake Test' : 'Start Mock Test'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <p className="text-xs font-medium text-slate-500">
                    No mock tests available for Day {activeDayModal.dayNumber}.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDayModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
