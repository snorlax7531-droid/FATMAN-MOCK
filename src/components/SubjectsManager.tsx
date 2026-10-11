import React, { useState } from 'react';
import { 
  FolderPlus, 
  Trash2, 
  Plus, 
  BookOpen, 
  Landmark, 
  Globe2, 
  Building2, 
  TrendingUp, 
  Newspaper, 
  Atom, 
  Calculator, 
  Brain, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SubjectModel, TestModel } from '../types';
import { SUBJECT_METADATA } from './SubjectCards';

interface SubjectsManagerProps {
  customSubjects: SubjectModel[];
  tests: TestModel[];
  onAddSubject: (newSubject: SubjectModel) => void;
  onDeleteSubject: (subjectName: string) => void;
  onSelectSubject: (subjectName: string) => void;
  onCreateMockForSubject: (subjectName: string) => void;
  isAdmin?: boolean;
}

const COLOR_THEMES = [
  { name: 'Blue', bg: 'bg-blue-50/80', border: 'border-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-100/80', btn: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { name: 'Pink', bg: 'bg-pink-50/80', border: 'border-pink-100', text: 'text-pink-600', iconBg: 'bg-pink-100/80', btn: 'bg-pink-600 hover:bg-pink-700 text-white' },
  { name: 'Emerald', bg: 'bg-emerald-50/80', border: 'border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-100/80', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  { name: 'Orange', bg: 'bg-orange-50/80', border: 'border-orange-100', text: 'text-orange-600', iconBg: 'bg-orange-100/80', btn: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { name: 'Purple', bg: 'bg-purple-50/80', border: 'border-purple-100', text: 'text-purple-600', iconBg: 'bg-purple-100/80', btn: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { name: 'Teal', bg: 'bg-teal-50/80', border: 'border-teal-100', text: 'text-teal-600', iconBg: 'bg-teal-100/80', btn: 'bg-teal-600 hover:bg-teal-700 text-white' },
  { name: 'Indigo', bg: 'bg-indigo-50/80', border: 'border-indigo-100', text: 'text-indigo-600', iconBg: 'bg-indigo-100/80', btn: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { name: 'Rose', bg: 'bg-rose-50/80', border: 'border-rose-100', text: 'text-rose-600', iconBg: 'bg-rose-100/80', btn: 'bg-rose-600 hover:bg-rose-700 text-white' },
];

export const SubjectsManager: React.FC<SubjectsManagerProps> = ({
  customSubjects,
  tests,
  onAddSubject,
  onDeleteSubject,
  onSelectSubject,
  onCreateMockForSubject,
  isAdmin
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_THEMES[0]);
  const [success, setSuccess] = useState('');

  // Default subjects
  const defaultSubjects = SUBJECT_METADATA.map(s => ({
    name: s.name,
    description: s.description,
    totalTestsCount: s.totalTestsCount,
    bgColor: s.bgColor,
    borderColor: s.borderColor,
    iconColor: s.iconColor,
    iconBg: s.iconBg,
    btnColor: s.btnColor,
    isDefault: true
  }));

  // Combine default and custom subjects
  const allSubjects = [
    ...defaultSubjects,
    ...customSubjects.map(s => ({ ...s, isDefault: false }))
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a subject name');
      return;
    }

    const newSub: SubjectModel = {
      name: name.trim(),
      description: description.trim() || `${name.trim()} Practice Questions & Mock Tests`,
      totalTestsCount: 0,
      bgColor: selectedColor.bg,
      borderColor: selectedColor.border,
      iconColor: selectedColor.text,
      iconBg: selectedColor.iconBg,
      btnColor: selectedColor.btn
    };

    onAddSubject(newSub);
    setSuccess(`Subject "${name}" added successfully!`);
    setName('');
    setDescription('');
    setShowAddForm(false);
    setTimeout(() => setSuccess(''), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <FolderPlus className="w-6 h-6 text-pink-600" />
            <span>Subjects Management & Custom Categories</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create new subjects and organize mock tests into custom academic sections
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-pink-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : '+ Add New Subject'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* ADD NEW SUBJECT FORM */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-base">Create New Subject</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. General Science, Mathematics, Reasoning..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Physics, Chemistry, Biology & Everyday Science"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Color Theme</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_THEMES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedColor.name === c.name 
                      ? 'ring-2 ring-pink-500 ring-offset-1 border-pink-400 bg-white font-black' 
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${c.btn.split(' ')[0]}`} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Save Subject
            </button>
          </div>
        </form>
      )}

      {/* ALL SUBJECTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allSubjects.map((sub) => {
          const testCount = tests.filter(t => t.subject.toLowerCase() === sub.name.toLowerCase()).length;
          const displayCount = Math.max(testCount, sub.totalTestsCount || 0);

          return (
            <div
              key={sub.name}
              className={`p-5 rounded-2xl border ${sub.borderColor || 'border-slate-200'} ${sub.bgColor || 'bg-white'} shadow-xs flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${sub.iconBg || 'bg-slate-100'} ${sub.iconColor || 'text-slate-700'} flex items-center justify-center font-bold text-base shadow-2xs`}>
                    <BookOpen className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {!sub.isDefault && (
                    <button
                      onClick={() => onDeleteSubject(sub.name)}
                      title="Delete custom subject"
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {sub.description}
                  </p>
                </div>

                <div className="text-xs font-bold text-slate-700">
                  Total Tests: <b className="text-pink-600">{displayCount}</b>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2">
                <button
                  onClick={() => onSelectSubject(sub.name)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${sub.btnColor || 'bg-pink-600 text-white'}`}
                >
                  <span>View Tests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onCreateMockForSubject(sub.name)}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs text-slate-700 cursor-pointer"
                >
                  + Add Mock
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
