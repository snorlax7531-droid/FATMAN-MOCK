import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Landmark, 
  Globe2, 
  Building2, 
  Castle, 
  TrendingUp, 
  Leaf, 
  Atom, 
  ChevronRight,
  BookMarked,
  Layers
} from 'lucide-react';
import { TestModel } from '../types';
import { SYLLABUS_DATA } from '../data/syllabusData';
import { formatName } from './SubjectCards';

interface ChapterWiseTestsProps {
  tests: TestModel[];
  appLanguage: 'EN' | 'HI' | 'DUAL';
  onSelectChapter: (chapterName: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Globe2,
  Landmark,
  Castle,
  Scroll: Building2,
  Building2,
  TrendingUp,
  Atom,
  FlaskConical: Atom,
  Leaf,
  BookOpen
};

export const ChapterWiseTests: React.FC<ChapterWiseTestsProps> = ({
  tests,
  appLanguage,
  onSelectChapter
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const filteredSubjects = selectedSubjectFilter === 'all' 
    ? SYLLABUS_DATA 
    : SYLLABUS_DATA.filter(s => s.subjectEn.toLowerCase() === selectedSubjectFilter.toLowerCase());

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Subject Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {formatName('Chapter Wise Syllabus & Mock Tests', 'अध्यायवार पाठ्यक्रम और मॉक टेस्ट', appLanguage)}
            </h2>
            <p className="text-xs text-slate-500">
              {formatName('Select any chapter to practice or test your knowledge', 'अभ्यास या ज्ञान परीक्षण के लिए कोई भी अध्याय चुनें', appLanguage)}
            </p>
          </div>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="w-full sm:w-56 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">{formatName('All Subjects (10 Categories)', 'सभी विषय (10 श्रेणियाँ)', appLanguage)}</option>
            {SYLLABUS_DATA.map(sub => (
              <option key={sub.subjectEn} value={sub.subjectEn}>
                {formatName(sub.subjectEn, sub.subjectHi, appLanguage)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Sections & Chapters */}
      <div className="space-y-6">
        {filteredSubjects.map((sub, sIdx) => {
          const Icon = ICON_MAP[sub.iconName] || BookOpen;
          return (
            <div key={sub.subjectEn} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              {/* Subject Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${sub.bgColor} ${sub.color} flex items-center justify-center shadow-2xs`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800">
                      {String(sIdx + 1).padStart(2, '0')}. {formatName(sub.subjectEn, sub.subjectHi, appLanguage)}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {sub.chapters.length} {formatName('Chapters Available', 'अध्याय उपलब्ध हैं', appLanguage)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectChapter(sub.subjectEn)}
                  className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{formatName('View All', 'सभी देखें', appLanguage)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chapters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sub.chapters.map((ch, cIdx) => {
                  const matchingTests = tests.filter(t => 
                    t.chapter?.toLowerCase() === ch.nameEn.toLowerCase() ||
                    t.subject?.toLowerCase() === sub.subjectEn.toLowerCase()
                  );
                  const count = Math.max(matchingTests.length, 2);

                  return (
                    <div
                      key={ch.nameEn}
                      onClick={() => onSelectChapter(ch.nameEn)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-pink-50/60 border border-slate-200/70 hover:border-pink-200 transition-all duration-150 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                          {cIdx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-pink-700 transition-colors">
                            {formatName(ch.nameEn, ch.nameHi, appLanguage)}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {count} {formatName('Practice Tests', 'अभ्यास टेस्ट', appLanguage)}
                          </p>
                        </div>
                      </div>

                      <div className="p-1 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
