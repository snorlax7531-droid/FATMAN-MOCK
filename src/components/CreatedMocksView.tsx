import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Clock, 
  BookOpen, 
  PlusCircle, 
  Play, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  CalendarDays,
  Filter,
  Languages,
  ArrowRight,
  FolderPlus
} from 'lucide-react';
import { TestModel, Question, SubjectModel } from '../types';
import { TestService } from '../services/testService';
import { useAuth } from '../context/AuthContext';

interface CreatedMocksViewProps {
  tests: TestModel[];
  customSubjects?: SubjectModel[];
  onStartTest: (testId: string) => void;
  onNavigateToCreate: (prefillSubject?: string) => void;
  onNavigateToAddSubject: () => void;
  onRefreshTests: () => Promise<void>;
}

export const CreatedMocksView: React.FC<CreatedMocksViewProps> = ({
  tests,
  customSubjects = [],
  onStartTest,
  onNavigateToCreate,
  onNavigateToAddSubject,
  onRefreshTests,
}) => {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTest, setPreviewTest] = useState<{ test: TestModel; questions: Question[] } | null>(null);
  const [previewLanguage, setPreviewLanguage] = useState<'both' | 'en' | 'hi'>('both');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Subject list
  const standardSubjects = ['History', 'Geography', 'Polity', 'Economy', 'Static GK', 'Current Affairs'];
  const allSubjectNames = Array.from(new Set([
    ...standardSubjects,
    ...customSubjects.map(s => s.name)
  ]));

  // Open Question Preview
  const handleOpenPreview = async (testId: string) => {
    setLoadingPreview(true);
    const data = await TestService.getTestWithQuestions(testId);
    setLoadingPreview(false);
    if (data) setPreviewTest(data);
  };

  // Delete test
  const handleDeleteTest = async (testId: string, testTitle: string) => {
    if (window.confirm(`Are you sure you want to delete mock test "${testTitle}"?`)) {
      setDeletingId(testId);
      try {
        await TestService.deleteTest(testId);
        await onRefreshTests();
      } catch (err: any) {
        alert(`Failed to delete: ${err.message}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Filter tests
  const filteredTests = tests.filter(test => {
    if (selectedSubject !== 'all' && test.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== 'all' && test.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = test.title.toLowerCase().includes(q);
      const matchSubject = test.subject.toLowerCase().includes(q);
      const matchChapter = test.chapter?.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchChapter) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#111827] via-[#1f293d] to-[#0f172a] text-white p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>CREATED MOCKS REPOSITORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              All Created Mocks & Test Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Browse, practice, and manage all mock tests created in the system. Full support for bilingual (Hindi & English) questions, custom timers, TCS interface, and 60-day study plan scheduling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToCreate()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create New Mock</span>
            </button>

            <button
              onClick={onNavigateToAddSubject}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-pink-300" />
              <span>+ Add Subject</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Available Mocks</div>
            <div className="text-2xl font-bold text-white mt-1">{tests.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Active Subjects</div>
            <div className="text-2xl font-bold text-pink-400 mt-1">{allSubjectNames.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Bilingual Support</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">100% Hindi/EN</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">TCS Pattern Ready</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">SSC CGL/CHSL</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by mock title, subject or chapter..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">Type:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-pink-500"
              >
                <option value="all">All Types</option>
                <option value="subject_wise">Subject-Wise</option>
                <option value="chapter_wise">Chapter-Wise</option>
                <option value="60_day_plan">60-Day Plan</option>
                <option value="full_syllabus">Full Syllabus</option>
              </select>
            </div>

            <button
              onClick={() => onNavigateToCreate()}
              className="hidden sm:flex px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Mock</span>
            </button>
          </div>
        </div>

        {/* Subject Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 font-semibold px-1 shrink-0">Subject:</span>
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-pink-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Subjects ({tests.length})
          </button>

          {allSubjectNames.map(subName => {
            const count = tests.filter(t => t.subject.toLowerCase() === subName.toLowerCase()).length;
            const isSelected = selectedSubject.toLowerCase() === subName.toLowerCase();
            return (
              <button
                key={subName}
                onClick={() => setSelectedSubject(subName)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-pink-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {subName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Created Mock Tests */}
      {filteredTests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No mock tests found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery || selectedSubject !== 'all'
              ? 'Try adjusting your search query or subject filter to find created tests.'
              : 'No mock tests have been created yet. Click below to bulk upload or paste questions.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToCreate(selectedSubject !== 'all' ? selectedSubject : undefined)}
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Mock Test Now</span>
            </button>
            {selectedSubject !== 'all' && (
              <button
                onClick={() => { setSelectedSubject('all'); setSearchQuery(''); }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map((test) => {
            const isDeleting = deletingId === test.id;

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-pink-300"
              >
                <div className="space-y-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                      {test.subject}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {test.dayNumber && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          <span>Day {test.dayNumber}</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Languages className="w-3 h-3" />
                        <span>Bilingual</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Chapter */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-pink-600 transition-colors line-clamp-2">
                      {test.title}
                    </h3>
                    {test.chapter && (
                      <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                        Chapter: {test.chapter}
                      </p>
                    )}
                  </div>

                  {/* Test Parameters Pill Box */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Duration</div>
                      <div className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span>{test.durationMinutes || 15}m</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Questions</div>
                      <div className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                        <BookOpen className="w-3 h-3 text-pink-500" />
                        <span>{test.questionCount || 10}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Total Marks</div>
                      <div className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{test.totalMarks || (test.questionCount * 2) || 20}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Actions Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenPreview(test.id)}
                      title="Preview Questions in English & Hindi"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTest(test.id, test.title)}
                        disabled={isDeleting}
                        title="Delete this Mock Test"
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onStartTest(test.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Test (TCS)</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Question Preview Modal (With English & Hindi Views) */}
      {previewTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-700">
                    {previewTest.test.subject}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {previewTest.questions.length} Questions • {previewTest.test.durationMinutes} Mins
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {previewTest.test.title}
                </h3>
              </div>

              {/* Language Toggle in Preview */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-slate-200 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setPreviewLanguage('both')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      previewLanguage === 'both' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Both (द्विभाषी)
                  </button>
                  <button
                    onClick={() => setPreviewLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      previewLanguage === 'en' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setPreviewLanguage('hi')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      previewLanguage === 'hi' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>

                <button
                  onClick={() => setPreviewTest(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Questions Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-slate-100">
              {previewTest.questions.map((q, idx) => (
                <div key={q.id || idx} className="pt-4 first:pt-0 space-y-2.5 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {/* English Question */}
                      {(previewLanguage === 'both' || previewLanguage === 'en') && (
                        <p className="font-bold text-slate-900 text-sm">
                          {idx + 1}. {q.questionText}
                        </p>
                      )}
                      {/* Hindi Question */}
                      {(previewLanguage === 'both' || previewLanguage === 'hi') && q.questionTextHindi && (
                        <p className="font-semibold text-slate-700 text-sm leading-relaxed">
                          {previewLanguage === 'both' ? '🇮🇳 ' : `${idx + 1}. `}{q.questionTextHindi}
                        </p>
                      )}
                    </div>

                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                      Ans: {String.fromCharCode(65 + q.correctOptionIndex)}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctOptionIndex;
                      const optHindi = q.optionsHindi?.[oIdx];

                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-xs ${
                            isCorrect 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' 
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <div>
                              {(previewLanguage === 'both' || previewLanguage === 'en') && <div>{opt}</div>}
                              {(previewLanguage === 'both' || previewLanguage === 'hi') && optHindi && (
                                <div className="text-slate-600 font-medium">{optHindi}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-xs text-purple-950 pl-4 space-y-1">
                    <div className="font-bold text-[11px] text-purple-800 flex items-center gap-1">
                      <span>💡 Explanation:</span>
                    </div>
                    {(previewLanguage === 'both' || previewLanguage === 'en') && (
                      <p>{q.explanation}</p>
                    )}
                    {(previewLanguage === 'both' || previewLanguage === 'hi') && q.explanationHindi && (
                      <p className="text-purple-900 border-t border-purple-200/50 pt-1 mt-1 font-medium">
                        {q.explanationHindi}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setPreviewTest(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Preview
              </button>

              <button
                onClick={() => {
                  const id = previewTest.test.id;
                  setPreviewTest(null);
                  onStartTest(id);
                }}
                className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start This Test Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
