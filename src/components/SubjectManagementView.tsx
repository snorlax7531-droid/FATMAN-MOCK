import React, { useState } from 'react';
import { 
  FolderPlus, 
  BookOpen, 
  Landmark, 
  Globe2, 
  Building2, 
  TrendingUp, 
  Newspaper, 
  Atom, 
  Laptop, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  PlusCircle, 
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';
import { SubjectModel, TestModel } from '../types';
import { SUBJECT_METADATA } from './SubjectCards';

interface SubjectManagementViewProps {
  tests: TestModel[];
  customSubjects: SubjectModel[];
  onAddCustomSubject: (subject: SubjectModel) => void;
  onDeleteCustomSubject: (subjectName: string) => void;
  onNavigateToCreateMock: (subjectName: string) => void;
  onSelectSubjectFilter: (subjectName: string) => void;
}

const COLOR_PALETTES = [
  {
    id: 'indigo',
    name: 'Indigo',
    bgColor: 'bg-indigo-50/80',
    borderColor: 'border-indigo-200',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
    btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white'
  },
  {
    id: 'purple',
    name: 'Purple',
    bgColor: 'bg-purple-50/80',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    btnColor: 'bg-purple-600 hover:bg-purple-700 text-white'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white'
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    bgColor: 'bg-rose-50/80',
    borderColor: 'border-rose-200',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-100',
    btnColor: 'bg-rose-600 hover:bg-rose-700 text-white'
  },
  {
    id: 'cyan',
    name: 'Cyan Teal',
    bgColor: 'bg-cyan-50/80',
    borderColor: 'border-cyan-200',
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-100',
    btnColor: 'bg-cyan-600 hover:bg-cyan-700 text-white'
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    btnColor: 'bg-amber-600 hover:bg-amber-700 text-white'
  }
];

const SUGGESTED_SUBJECTS = [
  'General Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Awareness',
  'Reasoning Ability',
  'Ancient & Medieval History',
  'Art & Culture',
  'Environment & Ecology',
  'Quantitative Aptitude'
];

export const SubjectManagementView: React.FC<SubjectManagementViewProps> = ({
  tests,
  customSubjects,
  onAddCustomSubject,
  onDeleteCustomSubject,
  onNavigateToCreateMock,
  onSelectSubjectFilter
}) => {
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [successNotice, setSuccessNotice] = useState('');

  const handleCreateSubject = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!subjectName.trim()) {
      alert('Please enter a subject name.');
      return;
    }

    const cleanName = subjectName.trim();
    // Check duplicate
    const existsInStandard = SUBJECT_METADATA.some(s => s.name.toLowerCase() === cleanName.toLowerCase());
    const existsInCustom = customSubjects.some(s => s.name.toLowerCase() === cleanName.toLowerCase());
    if (existsInStandard || existsInCustom) {
      alert(`Subject "${cleanName}" already exists!`);
      return;
    }

    const newSub: SubjectModel = {
      name: cleanName,
      description: description.trim() || `${cleanName} Mock Tests`,
      bgColor: selectedPalette.bgColor,
      borderColor: selectedPalette.borderColor,
      iconColor: selectedPalette.iconColor,
      iconBg: selectedPalette.iconBg,
      btnColor: selectedPalette.btnColor,
      totalTestsCount: 0
    };

    onAddCustomSubject(newSub);
    setSuccessNotice(`Subject "${cleanName}" created successfully! You can now add mocks to this subject.`);
    setSubjectName('');
    setDescription('');

    setTimeout(() => {
      setSuccessNotice('');
    }, 3000);
  };

  // Combine standard + custom subjects
  const allSubjects = [
    ...SUBJECT_METADATA.map(s => ({ ...s, isStandard: true })),
    ...customSubjects.map(s => ({ ...s, isStandard: false }))
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#170a2c] via-[#2a1049] to-[#120424] text-white p-6 sm:p-8 shadow-xl border border-purple-900/40 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>SUBJECT DIRECTORY & MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Add New Subject & Subject Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Create custom subjects for your mock test portal (e.g. General Science, Computer, Physics, Art & Culture). Newly added subjects instantly appear on the Home dashboard and inside the Admin Test Creator dropdown.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-800/40">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Standard Subjects</div>
            <div className="text-2xl font-bold text-white mt-1">{SUBJECT_METADATA.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Custom Created</div>
            <div className="text-2xl font-bold text-pink-400 mt-1">{customSubjects.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Total Subjects</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{allSubjects.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Total Mock Tests</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{tests.length}</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Create Subject Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Add New Subject</h2>
              <p className="text-xs text-slate-500">Define a new category for your mock tests</p>
            </div>
          </div>

          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubject} className="space-y-4">
            
            {/* Subject Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Subject Name *
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. General Science, Computer, Physics"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
                required
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500">
                Quick Suggestions:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SUBJECTS.map((sug) => (
                  <button
                    type="button"
                    key={sug}
                    onClick={() => {
                      setSubjectName(sug);
                      if (!description) setDescription(`${sug} Chapter-wise Mock Tests`);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-600 text-[10px] font-semibold transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Description / Subtitle
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. SSC CGL/CHSL Previous Year Pattern Mocks"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PALETTES.map((pal) => {
                  const isSelected = selectedPalette.id === pal.id;
                  return (
                    <button
                      type="button"
                      key={pal.id}
                      onClick={() => setSelectedPalette(pal)}
                      className={`p-2 rounded-xl border-2 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected 
                          ? `${pal.bgColor} ${pal.borderColor} text-slate-900 shadow-2xs` 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full ${pal.iconBg}`} />
                      <span className="truncate">{pal.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-md shadow-pink-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer pt-3"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create & Register Subject</span>
            </button>

          </form>
        </div>

        {/* Right 2 Columns: All Subjects Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-600" />
              <span>All Active Subjects ({allSubjects.length})</span>
            </h2>
            <span className="text-xs text-slate-500">
              Click any subject to view its tests or create new mocks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allSubjects.map((sub) => {
              const testCount = tests.filter(t => t.subject.toLowerCase() === sub.name.toLowerCase()).length;

              return (
                <div
                  key={sub.name}
                  className={`${sub.bgColor || 'bg-slate-50'} ${sub.borderColor || 'border-slate-200'} border rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${sub.iconBg || 'bg-pink-100'} ${sub.iconColor || 'text-pink-600'} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                        <BookOpen className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-base">
                            {sub.name}
                          </h3>
                          {sub.isStandard ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200/70 text-slate-700">
                              Core
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-100 text-pink-700">
                              Custom
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {sub.description || `${sub.name} Mocks`}
                        </p>
                      </div>
                    </div>

                    {!sub.isStandard && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete subject "${sub.name}"?`)) {
                            onDeleteCustomSubject(sub.name);
                          }
                        }}
                        title="Delete custom subject"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Badges & Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <div className="text-xs font-bold text-slate-700">
                      <span>{testCount} Mock Tests Ready</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectSubjectFilter(sub.name)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        View Tests
                      </button>

                      <button
                        onClick={() => onNavigateToCreateMock(sub.name)}
                        className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Add Mock</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
