import React from 'react';
import { 
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { TestModel } from '../types';
import { SUBJECTS_CHAPTERS_DATA } from '../data/chaptersData';

export const formatName = (item: any, lang?: string, fallback?: string): string => {
  if (typeof item === 'string') return item;
  return (lang === 'HI' ? item?.hi || item?.name : item?.name) || fallback || '';
};

// Vibrant color themes for the 11 subject cards
const SUBJECT_THEMES = [
  { bg: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10', border: 'border-indigo-200 hover:border-indigo-400', badgeBg: 'bg-indigo-100 text-indigo-700', textGradient: 'from-blue-700 to-indigo-700', btnBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' },
  { bg: 'from-purple-500/10 via-pink-500/10 to-rose-500/10', border: 'border-purple-200 hover:border-purple-400', badgeBg: 'bg-purple-100 text-purple-700', textGradient: 'from-purple-700 to-pink-700', btnBg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500' },
  { bg: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10', border: 'border-emerald-200 hover:border-emerald-400', badgeBg: 'bg-emerald-100 text-emerald-700', textGradient: 'from-emerald-700 to-teal-700', btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500' },
  { bg: 'from-amber-500/10 via-orange-500/10 to-yellow-500/10', border: 'border-amber-200 hover:border-amber-400', badgeBg: 'bg-amber-100 text-amber-700', textGradient: 'from-amber-700 to-orange-700', btnBg: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500' },
  { bg: 'from-rose-500/10 via-pink-500/10 to-purple-500/10', border: 'border-rose-200 hover:border-rose-400', badgeBg: 'bg-rose-100 text-rose-700', textGradient: 'from-rose-700 to-pink-700', btnBg: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500' },
  { bg: 'from-cyan-500/10 via-blue-500/10 to-indigo-500/10', border: 'border-cyan-200 hover:border-cyan-400', badgeBg: 'bg-cyan-100 text-cyan-700', textGradient: 'from-cyan-700 to-blue-700', btnBg: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500' },
  { bg: 'from-violet-500/10 via-purple-500/10 to-fuchsia-500/10', border: 'border-violet-200 hover:border-violet-400', badgeBg: 'bg-violet-100 text-violet-700', textGradient: 'from-violet-700 to-purple-700', btnBg: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500' },
  { bg: 'from-teal-500/10 via-emerald-500/10 to-green-500/10', border: 'border-teal-200 hover:border-teal-400', badgeBg: 'bg-teal-100 text-teal-700', textGradient: 'from-teal-700 to-emerald-700', btnBg: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500' },
  { bg: 'from-pink-500/10 via-rose-500/10 to-red-500/10', border: 'border-pink-200 hover:border-pink-400', badgeBg: 'bg-pink-100 text-pink-700', textGradient: 'from-pink-700 to-rose-700', btnBg: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500' },
  { bg: 'from-indigo-500/10 via-blue-500/10 to-sky-500/10', border: 'border-indigo-200 hover:border-indigo-400', badgeBg: 'bg-indigo-100 text-indigo-700', textGradient: 'from-indigo-700 to-blue-700', btnBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500' },
  { bg: 'from-orange-500/10 via-amber-500/10 to-yellow-500/10', border: 'border-orange-200 hover:border-orange-400', badgeBg: 'bg-orange-100 text-orange-700', textGradient: 'from-orange-700 to-amber-700', btnBg: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500' },
];

export const SUBJECT_METADATA = SUBJECTS_CHAPTERS_DATA.map((sub, i) => ({
  name: sub.name,
  hindiName: sub.hindiName,
  totalTestsCount: sub.chapters.length,
  icon: sub.icon,
  bgColor: SUBJECT_THEMES[i % SUBJECT_THEMES.length].bg,
  borderColor: SUBJECT_THEMES[i % SUBJECT_THEMES.length].border,
  iconColor: sub.iconColor,
  iconBg: sub.iconBg,
  btnColor: SUBJECT_THEMES[i % SUBJECT_THEMES.length].btnBg,
  description: `${sub.name} (${sub.hindiName}) Mock Tests`
}));

interface SubjectCardsProps {
  tests: TestModel[];
  customSubjects?: any[];
  onSelectSubject: (subjectIdOrName: string) => void;
  onStartFirstTestOfSubject: (subjectIdOrName: string) => void;
  onOpenAddSubject?: () => void;
}

export const SubjectCards: React.FC<SubjectCardsProps> = ({
  tests,
  customSubjects = [],
  onSelectSubject,
  onStartFirstTestOfSubject,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shadow-xs">
            <BookMarked className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Select Subject / विषय चुनें
          </h2>
        </div>
      </div>

      {/* Grid of 11 Colorful & Attractive Subject Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {SUBJECTS_CHAPTERS_DATA.map((sub, idx) => {
          const Icon = sub.icon;
          const chapterCount = sub.chapters.length;
          const theme = SUBJECT_THEMES[idx % SUBJECT_THEMES.length];

          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className={`bg-gradient-to-b ${theme.bg} border-2 ${theme.border} rounded-3xl p-4 flex flex-col items-center text-center justify-between shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 cursor-pointer relative overflow-hidden`}
            >
              {/* Subtle top header glow */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon with colored badge background */}
              <div className={`w-14 h-14 rounded-2xl ${sub.iconBg} ${sub.iconColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md ring-4 ring-white/80`}>
                <Icon className="w-7 h-7 stroke-[2.2]" />
              </div>

              {/* Title & Count */}
              <div className="space-y-1 mb-3.5 w-full">
                <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${theme.badgeBg} uppercase tracking-wider`}>
                  #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight group-hover:text-indigo-700 transition-colors">
                  {sub.name}
                </h3>
                <p className="text-[11px] font-bold text-slate-600">
                  {sub.hindiName}
                </p>
                <div className="text-xs font-black text-indigo-700 pt-1">
                  {chapterCount} Chapters
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubject(sub.id);
                }}
                className={`w-full py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-white ${theme.btnBg} group-hover:shadow-lg`}
              >
                <span>View Chapters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
