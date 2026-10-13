import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  BarChart2, 
  Landmark, 
  Globe2, 
  Castle, 
  Scroll, 
  Building2, 
  TrendingUp, 
  Atom, 
  FlaskConical, 
  Leaf, 
  TreePine, 
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { SUBJECTS_CHAPTERS_DATA, SubjectData, ChapterItem } from '../data/chaptersData';
import { AttemptModel, TestModel } from '../types';

interface SubjectChapterViewProps {
  initialSubjectId?: string;
  userAttempts: AttemptModel[];
  onStartChapter: (chapter: ChapterItem, subject: SubjectData) => void;
  onViewAnalysis: (attempt: AttemptModel) => void;
  onBack?: () => void;
}

const NUMBER_BG_COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-emerald-100 text-emerald-700',
  'bg-cyan-100 text-cyan-700',
  'bg-amber-100 text-amber-700',
  'bg-indigo-100 text-indigo-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
];

export const SubjectChapterView: React.FC<SubjectChapterViewProps> = ({
  initialSubjectId = 'ancient_history',
  userAttempts,
  onStartChapter,
  onViewAnalysis,
  onBack
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [chapterFilter, setChapterFilter] = useState<'all' | 'attempted' | 'unattempted'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    if (initialSubjectId) {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);

  // Find currently selected subject
  const currentSubject = SUBJECTS_CHAPTERS_DATA.find(s => s.id === selectedSubjectId) || SUBJECTS_CHAPTERS_DATA[0];

  // Helper to check if a chapter is attempted
  const getChapterAttempt = (chapter: ChapterItem): AttemptModel | undefined => {
    return userAttempts.find(att => 
      att.testTitle?.toLowerCase().includes(chapter.englishTitle.toLowerCase()) ||
      att.testTitle?.toLowerCase().includes(chapter.hindiTitle.toLowerCase()) ||
      att.testId?.includes(chapter.id)
    );
  };

  // Calculate attempted count for current subject
  const attemptedCount = currentSubject.chapters.filter(ch => !!getChapterAttempt(ch)).length;
  const totalChaptersCount = currentSubject.chapters.length;
  const progressPercent = totalChaptersCount > 0 ? Math.round((attemptedCount / totalChaptersCount) * 100) : 0;

  // Filtered chapters
  const filteredChapters = currentSubject.chapters.filter(ch => {
    const isAtt = !!getChapterAttempt(ch);
    if (chapterFilter === 'attempted') return isAtt;
    if (chapterFilter === 'unattempted') return !isAtt;
    return true;
  });

  const IconComponent = currentSubject.icon || Landmark;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Back button */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 hover:text-slate-900 font-black text-xs sm:text-sm shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-purple-600 group-hover:-translate-x-0.5 transition-all" />
            <span>← Back to All Subjects / वापस सभी विषय देखें</span>
          </button>
        </div>
      )}

      {/* TOP SUBJECT BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-[#faeef4] via-[#f7ebfc] to-[#eee8fb] border border-purple-100/90 p-4 sm:p-6 md:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle Temple/Monument Watermark silhouette in background right */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-15 pointer-events-none flex items-center justify-end pr-4 text-purple-900 select-none">
          <svg className="w-64 h-64" viewBox="0 0 200 200" fill="currentColor">
            <path d="M20 170 h160 v10 h-160 z M30 160 h140 v8 h-140 z M40 60 h120 l-60 -40 z M45 65 h10 v90 h-10 z M75 65 h10 v90 h-10 z M105 65 h10 v90 h-10 z M135 65 h10 v90 h-10 z" />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
          {/* Left info */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Round Icon */}
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-xs border border-amber-200/60">
              <IconComponent className="w-7 h-7 sm:w-10 sm:h-10 stroke-[2.2]" />
            </div>

            {/* Subject Titles */}
            <div className="space-y-1 sm:space-y-1.5 min-w-0">
              <div className="inline-block px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-pink-100 text-pink-700 font-black text-[11px] sm:text-xs tracking-wider uppercase">
                {currentSubject.categoryTag}
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-baseline gap-2 flex-wrap">
                <span>{currentSubject.name}</span>
                <span className="text-base sm:text-xl md:text-2xl font-bold text-slate-500 font-hindi">({currentSubject.hindiName})</span>
              </h1>

              <div className="text-sm sm:text-base text-slate-600 font-bold flex items-center gap-2.5">
                <span>Total Chapters : {totalChaptersCount}</span>
                <span className="text-slate-300">|</span>
                <span>Total Tests : {totalChaptersCount}</span>
              </div>
            </div>
          </div>

          {/* Right Slogan matching image */}
          <div className="text-right hidden md:block pr-6">
            <div className="text-xl sm:text-2xl font-black text-purple-900 leading-tight">
              {currentSubject.slogan}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-pink-600 italic tracking-wide mt-0.5">
              {currentSubject.sloganHighlight}
            </div>
            <div className="w-28 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent ml-auto mt-1.5 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>

      {/* 3. CHAPTERS BAR WITH PROGRESS & FILTER DROPDOWN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Left: Book Icon + Chapters Heading */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shadow-2xs shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2.4]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Chapters / अध्याय
          </h2>
        </div>

        {/* Right: Progress bar & Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
          {/* Progress */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <span className="text-xs sm:text-sm font-extrabold text-slate-700 whitespace-nowrap">
              {attemptedCount} / {totalChaptersCount} Chapters Attempted
            </span>
            <div className="flex-1 sm:w-36 md:w-48 h-2.5 bg-slate-200/90 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowFilterDropdown(prev => !prev)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-black flex items-center justify-between sm:justify-start gap-2 shadow-2xs hover:bg-slate-50 cursor-pointer"
            >
              <span>
                {chapterFilter === 'all' && 'All Chapters'}
                {chapterFilter === 'attempted' && 'Attempted Chapters'}
                {chapterFilter === 'unattempted' && 'Unattempted Chapters'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-1.5 w-full sm:w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 text-xs sm:text-sm">
                <button
                  onClick={() => { setChapterFilter('all'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 sm:py-2 font-black hover:bg-slate-50 cursor-pointer ${chapterFilter === 'all' ? 'text-purple-600 bg-purple-50/50' : 'text-slate-700'}`}
                >
                  All Chapters ({totalChaptersCount})
                </button>
                <button
                  onClick={() => { setChapterFilter('attempted'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 sm:py-2 font-black hover:bg-slate-50 cursor-pointer ${chapterFilter === 'attempted' ? 'text-purple-600 bg-purple-50/50' : 'text-slate-700'}`}
                >
                  Attempted ({attemptedCount})
                </button>
                <button
                  onClick={() => { setChapterFilter('unattempted'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 sm:py-2 font-black hover:bg-slate-50 cursor-pointer ${chapterFilter === 'unattempted' ? 'text-purple-600 bg-purple-50/50' : 'text-slate-700'}`}
                >
                  Unattempted ({totalChaptersCount - attemptedCount})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. CHAPTER CARDS GRID - Responsive for Mobile & Tablet (Portrait & Landscape) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredChapters.map((ch, idx) => {
          const attempt = getChapterAttempt(ch);
          const isAttempted = !!attempt;
          const colorClass = NUMBER_BG_COLORS[(ch.chapterNumber - 1) % NUMBER_BG_COLORS.length];

          const hindiText = ch.hindiTitle || ch.title.split('/')[0].trim();
          const englishText = ch.englishTitle || (ch.title.includes('/') ? ch.title.split('/')[1]?.trim() : '');

          return (
            <div
              key={ch.id}
              className="bg-white rounded-2xl p-4.5 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Card Top: Number badge, total tests count pill, Themed Icon */}
              <div className="flex items-center justify-between gap-3 mb-3.5">
                {/* Left: Number circle badge */}
                <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center shrink-0 font-black text-sm sm:text-base shadow-2xs`}>
                  {ch.chapterNumber}
                </div>

                {/* Right: Tests count pill & Themed icon */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-600 font-extrabold text-[11px] sm:text-xs whitespace-nowrap">
                    Total Tests : {ch.totalTests}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-colors">
                    <IconComponent className="w-4.5 h-4.5 stroke-[2.2]" />
                  </div>
                </div>
              </div>

              {/* Card Middle: Chapter Titles with full width (No squishing) */}
              <div className="flex-1 min-w-0 mb-4 space-y-1">
                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug group-hover:text-purple-700 transition-colors">
                  {hindiText}
                </h3>
                {englishText && (
                  <p className="text-xs sm:text-sm font-bold text-slate-500 leading-snug">
                    {englishText}
                  </p>
                )}
              </div>

              {/* Card Bottom: Attempt or Re-attempt + Analysis buttons */}
              <div className="pt-3.5 mt-auto border-t border-slate-100">
                {isAttempted ? (
                  <div className="space-y-2.5">
                    {/* Attempted Badge & Score */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Attempted</span>
                      </span>
                      {attempt && (
                        <span className="text-xs font-mono text-slate-500 font-bold whitespace-nowrap">
                          Score: {attempt.score}/{attempt.totalMarks}
                        </span>
                      )}
                    </div>

                    {/* Two Buttons: Re-attempt & Analysis - Exactly Equal Height, Symmetrical & Contained */}
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        onClick={() => onStartChapter(ch, currentSubject)}
                        className="h-10 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer min-w-0 overflow-hidden"
                        title="Retake this mock test"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Re-attempt</span>
                      </button>

                      <button
                        onClick={() => attempt && onViewAnalysis(attempt)}
                        className="h-10 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer min-w-0 overflow-hidden"
                        title="View detailed test analytics and answer sheet"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">Analysis</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard "▷ Attempt →" Button (Matching Height h-10) */
                  <button
                    onClick={() => onStartChapter(ch, currentSubject)}
                    className="w-full h-10 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-xs hover:shadow-purple-600/25 transition-all cursor-pointer group-hover:shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Attempt</span>
                    </span>
                    <span className="font-black text-base leading-none transition-transform group-hover:translate-x-1.5">→</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">No chapters match your filter</h4>
          <button
            onClick={() => setChapterFilter('all')}
            className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
          >
            Show All Chapters
          </button>
        </div>
      )}
    </div>
  );
};
