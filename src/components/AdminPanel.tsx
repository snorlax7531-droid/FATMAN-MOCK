import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Clock, 
  BookOpen, 
  CalendarDays, 
  Eye, 
  Users, 
  BarChart3, 
  Search,
  Sparkles,
  ArrowRight,
  Layers,
  FileSpreadsheet,
  Database,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Server,
  FolderPlus
} from 'lucide-react';
import { TestModel, Question, AttemptModel, SubjectModel } from '../types';
import { parseCsvQuestions, parsePastedMcqs } from '../utils/parser';
import { SAMPLE_CSV_CONTENT, SAMPLE_PASTE_TEXT, STUDY_PLAN_60_DAYS } from '../data/initialData';
import { TestService } from '../services/testService';
import { SupabaseService, SUPABASE_PROJECT_ID, SUPABASE_URL, SUPABASE_KEY } from '../supabase/client';

export const COLOR_PALETTES = [
  { id: 'indigo', name: 'Indigo', bgColor: 'bg-indigo-50/80', borderColor: 'border-indigo-200', iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100', btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { id: 'purple', name: 'Purple', bgColor: 'bg-purple-50/80', borderColor: 'border-purple-200', iconColor: 'text-purple-600', iconBg: 'bg-purple-100', btnColor: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { id: 'emerald', name: 'Emerald Green', bgColor: 'bg-emerald-50/80', borderColor: 'border-emerald-200', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100', btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  { id: 'rose', name: 'Rose Pink', bgColor: 'bg-rose-50/80', borderColor: 'border-rose-200', iconColor: 'text-rose-600', iconBg: 'bg-rose-100', btnColor: 'bg-rose-600 hover:bg-rose-700 text-white' },
  { id: 'cyan', name: 'Cyan Teal', bgColor: 'bg-cyan-50/80', borderColor: 'border-cyan-200', iconColor: 'text-cyan-600', iconBg: 'bg-cyan-100', btnColor: 'bg-cyan-600 hover:bg-cyan-700 text-white' },
  { id: 'amber', name: 'Warm Amber', bgColor: 'bg-amber-50/80', borderColor: 'border-amber-200', iconColor: 'text-amber-600', iconBg: 'bg-amber-100', btnColor: 'bg-amber-600 hover:bg-amber-700 text-white' }
];

export const SUGGESTED_SUBJECTS = [
  'General Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Awareness',
  'Reasoning Ability',
  'Art & Culture',
  'Environment & Ecology',
  'Quantitative Aptitude'
];

export const SUPABASE_ATTEMPTS_SQL_SCHEMA = `-- FATMAN SSC GK/GS MOCK TEST SERIES - SUPABASE BACKEND SCHEMA
-- Project ID: caowbukfcjtpxulgixen

CREATE TABLE IF NOT EXISTS public.student_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_name TEXT,
    user_email TEXT,
    test_id TEXT,
    test_title TEXT,
    subject TEXT,
    score NUMERIC,
    total_marks NUMERIC,
    accuracy NUMERIC,
    time_taken_seconds INTEGER,
    correct_count INTEGER,
    incorrect_count INTEGER,
    unattempted_count INTEGER,
    answers JSONB,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.student_attempts ENABLE ROW LEVEL SECURITY;

-- Allow students to submit test attempts:
CREATE POLICY "Allow public insert to student_attempts"
ON public.student_attempts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow reading test results:
CREATE POLICY "Allow public read from student_attempts"
ON public.student_attempts
FOR SELECT
TO anon, authenticated
USING (true);`;

interface AdminPanelProps {
  tests: TestModel[];
  allAttempts: AttemptModel[];
  customSubjects?: SubjectModel[];
  onAddCustomSubject?: (subject: SubjectModel) => void;
  onDeleteCustomSubject?: (subjectName: string) => void;
  onRefreshTests: () => Promise<void>;
  preselectedDay?: number | null;
  initialSubject?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  tests,
  allAttempts,
  customSubjects = [],
  onAddCustomSubject,
  onDeleteCustomSubject,
  onRefreshTests,
  preselectedDay,
  initialSubject
}) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'create' | 'subjects' | 'results' | 'supabase'>(
    preselectedDay || initialSubject ? 'create' : 'manage'
  );

  // Supabase Backend Testing State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    loading: boolean;
  }>({
    tested: false,
    success: false,
    message: '',
    loading: false
  });
  const [sqlCopied, setSqlCopied] = useState(false);
  const [syncingAttempts, setSyncingAttempts] = useState(false);
  const [syncResultMsg, setSyncResultMsg] = useState('');
  const [supabaseUsers, setSupabaseUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);

  const handleFetchSupabaseUsers = async () => {
    setLoadingUsers(true);
    const users = await SupabaseService.getAllUsers();
    setSupabaseUsers(users);
    setLoadingUsers(false);
    setUsersLoaded(true);
  };

  useEffect(() => {
    if (activeTab === 'supabase') {
      handleFetchSupabaseUsers();
    }
  }, [activeTab]);

  const handleTestSupabaseConnection = async () => {
    setSupabaseStatus(prev => ({ ...prev, loading: true }));
    const result = await SupabaseService.checkConnection();
    setSupabaseStatus({
      tested: true,
      success: result.connected,
      message: result.message,
      loading: false
    });
  };

  const handleSyncAllAttemptsToSupabase = async () => {
    if (allAttempts.length === 0) {
      setSyncResultMsg('No local/cached attempts to sync.');
      return;
    }
    setSyncingAttempts(true);
    setSyncResultMsg('Syncing attempts to Supabase...');
    let successCount = 0;
    for (const attempt of allAttempts) {
      const res = await SupabaseService.saveStudentAttempt(attempt);
      if (res.success) successCount++;
    }
    setSyncingAttempts(false);
    setSyncResultMsg(`Successfully synced ${successCount} of ${allAttempts.length} attempts to Supabase!`);
    await onRefreshTests();
  };

  const handleSendTestMockAttempt = async () => {
    const testAttempt: AttemptModel = {
      id: `test-mock-${Date.now()}`,
      userId: 'aspirant-test',
      userEmail: 'student.demo@fatman.edu',
      userName: 'Aspirant Demo Student',
      testId: tests[0]?.id || 'test-general-01',
      testTitle: tests[0]?.title || 'General Awareness Practice Mock',
      subject: tests[0]?.subject || 'History',
      score: 42,
      totalMarks: 50,
      accuracy: 84,
      timeTakenSeconds: 780,
      correctCount: 21,
      incorrectCount: 3,
      unattemptedCount: 1,
      answers: [],
      submittedAt: new Date().toISOString(),
      status: 'completed'
    };
    setSyncResultMsg('Sending test student attempt to Supabase...');
    const res = await SupabaseService.saveStudentAttempt(testAttempt);
    if (res.success) {
      setSyncResultMsg(`✅ Test student attempt sent to Supabase table "${res.table}"! ID: ${testAttempt.id}`);
      await onRefreshTests();
    } else {
      setSyncResultMsg(`⚠️ Note: ${res.error || 'Failed to save test attempt'}`);
    }
  };

  // Search in manage tab
  const [searchManage, setSearchManage] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  // Previewing a test modal
  const [previewTest, setPreviewTest] = useState<{ test: TestModel; questions: Question[] } | null>(null);
  const [previewLang, setPreviewLang] = useState<'both' | 'en' | 'hi'>('both');
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Inspected student attempt modal
  const [inspectedAttempt, setInspectedAttempt] = useState<AttemptModel | null>(null);

  // Quick Add Subject Modal
  const [showQuickSubjectModal, setShowQuickSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  const [newSubjectPalette, setNewSubjectPalette] = useState('indigo');

  // Dedicated Tab Add Subject State
  const [tabSubjectName, setTabSubjectName] = useState('');
  const [tabSubjectDesc, setTabSubjectDesc] = useState('');
  const [tabSubjectPalette, setTabSubjectPalette] = useState('indigo');
  const [subjectSuccessMsg, setSubjectSuccessMsg] = useState('');

  // Single Bilingual Question Modal / Form State
  const [showSingleQModal, setShowSingleQModal] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [formQText, setFormQText] = useState('');
  const [formQTextHindi, setFormQTextHindi] = useState('');
  const [formOptA, setFormOptA] = useState('');
  const [formOptAHindi, setFormOptAHindi] = useState('');
  const [formOptB, setFormOptB] = useState('');
  const [formOptBHindi, setFormOptBHindi] = useState('');
  const [formOptC, setFormOptC] = useState('');
  const [formOptCHindi, setFormOptCHindi] = useState('');
  const [formOptD, setFormOptD] = useState('');
  const [formOptDHindi, setFormOptDHindi] = useState('');
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExp, setFormExp] = useState('');
  const [formExpHindi, setFormExpHindi] = useState('');
  const [formTopic, setFormTopic] = useState('General');
  const [formDifficulty, setFormDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // CREATE TEST FORM STATE
  const [creationMode, setCreationMode] = useState<'paste' | 'csv' | 'manual'>('paste');
  const [csvRawText, setCsvRawText] = useState('');
  const [pastedRawText, setPastedRawText] = useState(SAMPLE_PASTE_TEXT);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [showFormatGuide, setShowFormatGuide] = useState(false);

  // Metadata form
  const [title, setTitle] = useState(preselectedDay ? `Day ${preselectedDay} - Special Mock Test` : '');
  const [subject, setSubject] = useState(initialSubject || 'History');
  const [chapter, setChapter] = useState('Ancient India');
  const [category, setCategory] = useState<'subject_wise' | 'chapter_wise' | '60_day_plan' | 'full_syllabus'>(
    preselectedDay ? '60_day_plan' : 'subject_wise'
  );
  const [assignToPlan, setAssignToPlan] = useState(!!preselectedDay);
  const [dayNumber, setDayNumber] = useState<number>(preselectedDay || 1);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [positiveMarks, setPositiveMarks] = useState(2);
  const [negativeMarks, setNegativeMarks] = useState(0.5);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Subjects list
  const standardSubjects = ['History', 'Geography', 'Polity', 'Economy', 'Static GK', 'Current Affairs'];
  const allSubjectNames = Array.from(new Set([
    ...standardSubjects,
    ...customSubjects.map(s => s.name)
  ]));

  const handleQuickAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const subName = newSubjectName.trim();
    const pal = COLOR_PALETTES.find(p => p.id === newSubjectPalette) || COLOR_PALETTES[0];
    if (onAddCustomSubject) {
      onAddCustomSubject({
        name: subName,
        description: newSubjectDescription.trim() || `${subName} Mock Tests`,
        bgColor: pal.bgColor,
        borderColor: pal.borderColor,
        iconColor: pal.iconColor,
        iconBg: pal.iconBg,
        btnColor: pal.btnColor
      });
    }
    setSubject(subName);
    setNewSubjectName('');
    setNewSubjectDescription('');
    setShowQuickSubjectModal(false);
  };

  const handleCreateTabSubject = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tabSubjectName.trim()) return;
    const subName = tabSubjectName.trim();
    const pal = COLOR_PALETTES.find(p => p.id === tabSubjectPalette) || COLOR_PALETTES[0];
    if (onAddCustomSubject) {
      onAddCustomSubject({
        name: subName,
        description: tabSubjectDesc.trim() || `${subName} Mock Tests for SSC Exams`,
        bgColor: pal.bgColor,
        borderColor: pal.borderColor,
        iconColor: pal.iconColor,
        iconBg: pal.iconBg,
        btnColor: pal.btnColor
      });
    }
    setSubjectSuccessMsg(`Subject "${subName}" created successfully!`);
    setTabSubjectName('');
    setTabSubjectDesc('');
    setTimeout(() => setSubjectSuccessMsg(''), 3000);
  };

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      const { questions, errors } = parseCsvQuestions(text);
      setParsedQuestions(questions);
      setParseErrors(errors);
      if (questions.length > 0 && !title) {
        setTitle(`${file.name.replace(/\.[^/.]+$/, '')} Mock`);
      }
    };
    reader.readAsText(file);
  };

  // Handle parse pasted text
  const handleParsePasted = () => {
    if (!pastedRawText.trim()) return;
    const { questions, errors } = parsePastedMcqs(pastedRawText);
    setParsedQuestions(questions);
    setParseErrors(errors);
    if (questions.length > 0 && !title) {
      setTitle(`${subject} - Comprehensive Mock`);
    }
  };

  // Download Sample CSV template
  const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'fatman_mock_questions_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Test
  const handleDeleteTest = async (testId: string, testTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${testTitle}"? This cannot be undone.`)) {
      await TestService.deleteTest(testId);
      await onRefreshTests();
    }
  };

  // Open Single Question Modal for New Question
  const handleOpenNewQuestionModal = () => {
    setEditingQuestionIndex(null);
    setFormQText('');
    setFormQTextHindi('');
    setFormOptA('');
    setFormOptAHindi('');
    setFormOptB('');
    setFormOptBHindi('');
    setFormOptC('');
    setFormOptCHindi('');
    setFormOptD('');
    setFormOptDHindi('');
    setFormCorrectIndex(0);
    setFormExp('');
    setFormExpHindi('');
    setFormTopic('General');
    setFormDifficulty('Medium');
    setShowSingleQModal(true);
  };

  // Open Single Question Modal for Editing Existing Question
  const handleOpenEditQuestionModal = (index: number) => {
    const q = parsedQuestions[index];
    if (!q) return;
    setEditingQuestionIndex(index);
    setFormQText(q.questionText || '');
    setFormQTextHindi(q.questionTextHindi || '');
    setFormOptA(q.options[0] || '');
    setFormOptAHindi(q.optionsHindi?.[0] || '');
    setFormOptB(q.options[1] || '');
    setFormOptBHindi(q.optionsHindi?.[1] || '');
    setFormOptC(q.options[2] || '');
    setFormOptCHindi(q.optionsHindi?.[2] || '');
    setFormOptD(q.options[3] || '');
    setFormOptDHindi(q.optionsHindi?.[3] || '');
    setFormCorrectIndex(q.correctOptionIndex || 0);
    setFormExp(q.explanation || '');
    setFormExpHindi(q.explanationHindi || '');
    setFormTopic(q.topic || 'General');
    setFormDifficulty(q.difficulty || 'Medium');
    setShowSingleQModal(true);
  };

  // Save Single Question Form
  const handleSaveSingleQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQText.trim()) {
      alert('Please enter the English question statement.');
      return;
    }
    if (!formOptA.trim() || !formOptB.trim()) {
      alert('Please provide at least Option A and Option B.');
      return;
    }

    const options = [
      formOptA.trim(),
      formOptB.trim(),
      formOptC.trim() || 'Option C',
      formOptD.trim() || 'Option D'
    ];

    const hasAnyHindiOpt = !!(formOptAHindi.trim() || formOptBHindi.trim() || formOptCHindi.trim() || formOptDHindi.trim());
    const optionsHindi = hasAnyHindiOpt ? [
      formOptAHindi.trim() || formOptA.trim(),
      formOptBHindi.trim() || formOptB.trim(),
      formOptCHindi.trim() || formOptC.trim() || 'विकल्प ग',
      formOptDHindi.trim() || formOptD.trim() || 'विकल्प घ'
    ] : undefined;

    const questionObj: Question = {
      id: editingQuestionIndex !== null && parsedQuestions[editingQuestionIndex]
        ? parsedQuestions[editingQuestionIndex].id
        : `q-bilingual-${Date.now()}`,
      questionNumber: editingQuestionIndex !== null ? editingQuestionIndex + 1 : parsedQuestions.length + 1,
      questionText: formQText.trim(),
      questionTextHindi: formQTextHindi.trim() || undefined,
      options,
      optionsHindi,
      correctOptionIndex: formCorrectIndex,
      explanation: formExp.trim() || `Option ${String.fromCharCode(65 + formCorrectIndex)} is correct.`,
      explanationHindi: formExpHindi.trim() || undefined,
      topic: formTopic.trim() || 'General',
      difficulty: formDifficulty
    };

    if (editingQuestionIndex !== null) {
      setParsedQuestions(prev => {
        const copy = [...prev];
        copy[editingQuestionIndex] = questionObj;
        return copy;
      });
    } else {
      setParsedQuestions(prev => [...prev, questionObj]);
    }

    setShowSingleQModal(false);
  };

  const handleDeleteParsedQuestion = (index: number) => {
    setParsedQuestions(prev => prev.filter((_, idx) => idx !== index));
  };

  // Open Preview Modal
  const handleOpenPreview = async (testId: string) => {
    setLoadingPreview(true);
    const data = await TestService.getTestWithQuestions(testId);
    setLoadingPreview(false);
    if (data) setPreviewTest(data);
  };

  // Save new test
  const handleSaveMockTest = async () => {
    if (!title.trim()) {
      alert('Please provide a Test Title.');
      return;
    }
    if (parsedQuestions.length === 0) {
      alert('Please parse at least one MCQ question before publishing.');
      return;
    }

    setSaving(true);
    try {
      const newTest: TestModel = {
        id: `mock-${Date.now()}`,
        title: title.trim(),
        subject,
        chapter: chapter.trim() || undefined,
        category,
        dayNumber: assignToPlan ? Number(dayNumber) : null,
        durationMinutes: Number(durationMinutes) || 15,
        totalMarks: parsedQuestions.length * Number(positiveMarks || 2),
        positiveMarks: Number(positiveMarks) || 2,
        negativeMarks: Number(negativeMarks) || 0.5,
        questionCount: parsedQuestions.length,
        createdAt: new Date().toISOString()
      };

      await TestService.createTest(newTest, parsedQuestions);
      await onRefreshTests();

      setSuccessMessage(`Mock test "${title}" successfully published!`);
      // Reset form
      setTitle('');
      setParsedQuestions([]);
      setParseErrors([]);
      setCsvRawText('');
      setPastedRawText('');

      setTimeout(() => {
        setSuccessMessage('');
        setActiveTab('manage');
      }, 1500);
    } catch (err: any) {
      alert(`Error saving test: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Filtered tests in manage tab
  const filteredTests = tests.filter(t => {
    if (selectedSubjectFilter !== 'all' && t.subject.toLowerCase() !== selectedSubjectFilter.toLowerCase()) {
      return false;
    }
    if (searchManage.trim()) {
      const q = searchManage.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate summary metrics
  const totalQuestionsCount = tests.reduce((acc, t) => acc + (t.questionCount || 10), 0);
  const avgScore = allAttempts.length > 0 
    ? (allAttempts.reduce((acc, a) => acc + a.score, 0) / allAttempts.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 pb-16">
      
      {/* Admin Top Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#170a2c] via-[#260f42] to-[#120424] text-white p-6 md:p-8 shadow-xl border border-purple-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FATMAN ADMIN CONTROL CENTER</span>
              </div>
              <button 
                onClick={() => setActiveTab('supabase')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-colors cursor-pointer"
                title="View all registered users list"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Show All Users List</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Mock Test & Student Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Bulk upload questions via CSV, paste MCQs in large quantity with explanations, configure timers, assign tests to subjects or 60-Day Study Plan, and track live student performance.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('create');
              if (parsedQuestions.length === 0) handleParsePasted();
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Mock Test</span>
          </button>
        </div>

        {/* 4 Admin Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-800/40">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Total Mock Tests</div>
            <div className="text-2xl font-bold text-white mt-1">{tests.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Questions in Library</div>
            <div className="text-2xl font-bold text-pink-400 mt-1">{totalQuestionsCount}+</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Student Attempts</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{allAttempts.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <div className="text-xs text-slate-400 font-medium">Average Score</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{avgScore}</div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('manage')}
          className={`py-3 px-5 font-bold text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'manage'
              ? 'border-pink-600 text-pink-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>All Mock Tests ({tests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`py-3 px-5 font-bold text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'create'
              ? 'border-pink-600 text-pink-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Create / Upload Mock</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`py-3 px-5 font-bold text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'subjects'
              ? 'border-pink-600 text-pink-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Add New Subject ({allSubjectNames.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`py-3 px-5 font-bold text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'results'
              ? 'border-pink-600 text-pink-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Submissions ({allAttempts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`py-3 px-5 font-bold text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'supabase'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-500" />
          <span>Show All Users List</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      </div>

      {/* TAB 1: MANAGE MOCK TESTS */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchManage}
                onChange={(e) => setSearchManage(e.target.value)}
                placeholder="Search test name or subject..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Subject:</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-pink-500 cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {allSubjectNames.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tests Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Mock Name / Title</th>
                    <th className="py-3 px-4">Subject & Chapter</th>
                    <th className="py-3 px-4 text-center">Questions</th>
                    <th className="py-3 px-4 text-center">Timer</th>
                    <th className="py-3 px-4 text-center">60 Day Plan (Day #)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredTests.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                          <span>{t.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{t.subject}</span>
                        {t.chapter && <span className="text-slate-400 block text-[11px]">{t.chapter}</span>}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700">
                        {t.questionCount || 10} Qs
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-600">
                        {t.durationMinutes} min
                      </td>
                      <td className="py-3 px-4 text-center">
                        {t.dayNumber ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[11px] border border-purple-200">
                            Day {t.dayNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenPreview(t.id)}
                            title="Preview questions"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTest(t.id, t.title)}
                            title="Delete mock test"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No tests match your filter or search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE / BULK UPLOAD MOCK TEST */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Question Input & Bulk Parsing */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Method Switcher */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Layers className="w-4 h-4 text-pink-600" />
                      <span>Input MCQ Questions (Bilingual English + हिन्दी)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add questions in both Hindi and English simultaneously via text paste, CSV or manual form.
                    </p>
                  </div>

                  {/* Mode Pills */}
                  <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold shrink-0">
                    <button
                      onClick={() => setCreationMode('paste')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        creationMode === 'paste' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Paste Text
                    </button>
                    <button
                      onClick={() => setCreationMode('csv')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        creationMode === 'csv' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      CSV Upload
                    </button>
                    <button
                      onClick={handleOpenNewQuestionModal}
                      className="px-3 py-1.5 rounded-lg text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Add One (EN/HI)</span>
                    </button>
                  </div>
                </div>

                {/* Option A: CSV Upload */}
                {creationMode === 'csv' ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 hover:border-pink-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-pink-50/20 transition-colors">
                      <FileSpreadsheet className="w-10 h-10 text-pink-600 mx-auto mb-2" />
                      <div className="font-bold text-sm text-slate-800">
                        Upload Bilingual Questions CSV File
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                        Supports separate English and Hindi columns: <code>question, optionA, optionAHindi, optionB, optionBHindi, optionC, optionCHindi, optionD, optionDHindi, correctOption, explanation, questionHindi, explanationHindi</code>
                      </p>
                      
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <label className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors">
                          Select CSV File
                          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <button
                          onClick={downloadSampleCsv}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Bilingual Template CSV</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Option B: Large Quantity Pasted MCQs */
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <span className="text-slate-500">
                        Paste bulk bilingual MCQs. Supports <code>Q1: Hindi / English</code>, <code>A) Hindi / English</code>, <code>Correct: C</code>, <code>Sol: * bullet points</code>:
                      </span>
                      <button
                        onClick={() => setPastedRawText(SAMPLE_PASTE_TEXT)}
                        className="text-pink-600 hover:underline font-bold cursor-pointer shrink-0"
                      >
                        Load Bilingual Sample Questions
                      </button>
                    </div>

                    <textarea
                      rows={11}
                      value={pastedRawText}
                      onChange={(e) => setPastedRawText(e.target.value)}
                      placeholder={`Q1: किस ग्रह पर जल चक्र (Water Cycle) और जीवन की उपस्थिति पाई जाती है? / On which planet is the Water Cycle and life present?\nA) मंगल / Mars\nB) शुक्र / Venus\nC) पृथ्वी / Earth\nD) बृहस्पति / Jupiter\nCorrect: C\nSol: \n* पृथ्वी (Earth) सौरमंडल का एकमात्र ज्ञात ग्रह है जहाँ जीवन और जल चक्र मौजूद है। / Earth is the only known planet with life and an active water cycle.\n* इसकी सतह का लगभग 71% भाग जल से ढका हुआ है। / Approximately 71% of its surface is covered by liquid water.`}
                      className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:border-pink-500 focus:bg-white leading-relaxed"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleParsePasted}
                          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Parse & Extract Questions</span>
                        </button>

                        <button
                          onClick={handleOpenNewQuestionModal}
                          className="px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-pink-200"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Add Single Question</span>
                        </button>
                      </div>

                      {parsedQuestions.length > 0 && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{parsedQuestions.length} Questions Ready</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Parsing Errors Warning if any */}
                {parseErrors.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Parser Notices ({parseErrors.length})</span>
                    </div>
                    {parseErrors.slice(0, 3).map((err, i) => (
                      <div key={i} className="text-slate-600 pl-5">• {err}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Parsed Questions Live Preview Table */}
              {parsedQuestions.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Parsed Questions Preview ({parsedQuestions.length} Questions)
                      </h4>
                      <span className="text-xs text-slate-500">
                        Total Marks: <b className="text-slate-900">{parsedQuestions.length * positiveMarks}</b> • Full Bilingual Preview
                      </span>
                    </div>

                    <button
                      onClick={handleOpenNewQuestionModal}
                      className="px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add More</span>
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 space-y-4">
                    {parsedQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="pt-4 first:pt-0 space-y-2 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            {/* English Question */}
                            <div className="font-bold text-slate-900 leading-snug">
                              <span className="text-pink-600 mr-1.5">Q{idx + 1}.</span>
                              {q.questionText}
                            </div>
                            {/* Hindi Question */}
                            {q.questionTextHindi && (
                              <div className="font-semibold text-slate-700 leading-snug pl-4 border-l-2 border-pink-400">
                                🇮🇳 {q.questionTextHindi}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                              Ans: {String.fromCharCode(65 + q.correctOptionIndex)}
                            </span>
                            <button
                              onClick={() => handleOpenEditQuestionModal(idx)}
                              title="Edit Question in English & Hindi"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteParsedQuestion(idx)}
                              title="Delete Question"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Options in English & Hindi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pl-4">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === q.correctOptionIndex;
                            const optHindi = q.optionsHindi?.[oIdx];
                            return (
                              <div 
                                key={oIdx} 
                                className={`p-2 rounded-lg border ${isCorrect ? "border-emerald-300 bg-emerald-50/60 font-bold text-emerald-900" : "border-slate-100 bg-slate-50 text-slate-700"}`}
                              >
                                <div>{String.fromCharCode(65 + oIdx)}) {opt}</div>
                                {optHindi && <div className="text-[11px] text-slate-500 font-medium">{optHindi}</div>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanations in English & Hindi */}
                        <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-2.5 text-[11px] text-purple-950 pl-3 space-y-1">
                          <div><b>💡 Explanation (EN):</b> {q.explanation}</div>
                          {q.explanationHindi && (
                            <div className="border-t border-purple-200/50 pt-1 text-purple-900">
                              <b>🇮🇳 व्याख्या (HI):</b> {q.explanationHindi}
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Col: Target Destination & Test Settings */}
            <div className="space-y-5">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-600" />
                    <span>Test Configuration</span>
                  </h3>
                  <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                    Step 2 of 2
                  </span>
                </div>

                {/* 1. MOCK NAME */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-pink-600" />
                      <span>Mock Name / Test Title (मॉक का नाम) *</span>
                    </label>
                    <span className="text-[10px] text-pink-600 font-bold bg-pink-50 px-1.5 py-0.5 rounded">Required</span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ancient India 25 MCQs Mock Test"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white shadow-2xs"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Name displayed to students when browsing and starting this mock.
                  </span>
                </div>

                {/* 2. TARGET SUBJECT & ADD NEW SUBJECT */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Target Subject (विषय चुनें) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowQuickSubjectModal(true)}
                      className="text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-pink-200"
                      title="Add a new custom subject"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>+ Add New Subject</span>
                    </button>
                  </div>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-pink-500 cursor-pointer shadow-2xs"
                  >
                    {allSubjectNames.map((subName) => (
                      <option key={subName} value={subName}>
                        {subName} {customSubjects.some(cs => cs.name.toLowerCase() === subName.toLowerCase()) ? '(Custom)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chapter Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Ancient India, Rivers of India..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
                  />
                </div>

                {/* 3. ADD TO 60 DAY PLAN (DAY NUMBER) */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignToPlan}
                        onChange={(e) => setAssignToPlan(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-purple-700" />
                          <span>Add to 60 Day Plan (60-दिन का स्टडी प्लान)</span>
                        </div>
                        <div className="text-[11px] text-purple-700 mt-0.5">
                          Assign this mock test to a specific roadmap day number (Day 1 to 60)
                        </div>
                      </div>
                    </label>

                    {assignToPlan && (
                      <div className="mt-3 pt-3 border-t border-purple-200/80 space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-purple-900">
                            Select Roadmap Day Number (दिन 1 से 60) *
                          </label>
                          <span className="text-xs font-black text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-300">
                            Day {dayNumber}
                          </span>
                        </div>
                        
                        <select
                          value={dayNumber}
                          onChange={(e) => setDayNumber(Number(e.target.value))}
                          className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-bold text-purple-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                          {Array.from({ length: 60 }, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>
                              Day {d}: {STUDY_PLAN_60_DAYS[d - 1]?.topicTitle || `Day ${d} Practice Mock`}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center justify-between text-[11px] text-purple-800 bg-white/70 p-2 rounded-lg border border-purple-200">
                          <span>🎯 Subject: <b>{STUDY_PLAN_60_DAYS[dayNumber - 1]?.subject || subject}</b></span>
                          <span>Topic: <b>{STUDY_PLAN_60_DAYS[dayNumber - 1]?.topicTitle || `Day ${dayNumber}`}</b></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. TIMER */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Timer / Test Duration (टेस्ट टाइमर - मिनट में) *</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                      {durationMinutes} Minutes
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 15, 20, 30].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDurationMinutes(m)}
                        className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          durationMinutes === m 
                            ? 'bg-pink-600 text-white shadow-xs ring-2 ring-pink-300' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {m} min
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[45, 60, 90].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDurationMinutes(m)}
                        className={`py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                          durationMinutes === m 
                            ? 'bg-pink-600 text-white shadow-xs ring-2 ring-pink-300' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {m} min
                      </button>
                    ))}
                  </div>

                  {/* Custom minutes input */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">Custom Timer:</span>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-pink-500"
                      placeholder="e.g. 25"
                    />
                    <span className="text-xs font-bold text-slate-500">min</span>
                  </div>
                </div>

                {/* Marking Scheme */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Correct (+Marks)
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      value={positiveMarks}
                      onChange={(e) => setPositiveMarks(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Negative (-Marks)
                    </label>
                    <input
                      type="number"
                      step={0.25}
                      value={negativeMarks}
                      onChange={(e) => setNegativeMarks(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Publish Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    disabled={saving || parsedQuestions.length === 0}
                    onClick={handleSaveMockTest}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-pink-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saving ? 'Publishing...' : `Publish Mock Test (${parsedQuestions.length} Questions)`}</span>
                  </button>
                  {parsedQuestions.length === 0 && (
                    <span className="text-[11px] text-amber-600 mt-1 block text-center font-medium">
                      ⚠️ Paste & parse questions on the left first
                    </span>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB: SUBJECTS MANAGEMENT & ADD NEW SUBJECT */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          {subjectSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{subjectSuccessMsg}</span>
            </div>
          )}

          {/* Top Form: Add New Subject */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-pink-600" />
                  <span>Add New Subject (नया विषय जोड़ें)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create custom subjects for mock tests. Once created, you can immediately publish tests under it.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {allSubjectNames.length} Active Subjects
              </span>
            </div>

            <form onSubmit={handleCreateTabSubject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Name (विषय का नाम) *
                  </label>
                  <input
                    type="text"
                    value={tabSubjectName}
                    onChange={(e) => setTabSubjectName(e.target.value)}
                    placeholder="e.g. General Science, Art & Culture, Reasoning"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white shadow-2xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description (वर्णन - Optional)
                  </label>
                  <input
                    type="text"
                    value={tabSubjectDesc}
                    onChange={(e) => setTabSubjectDesc(e.target.value)}
                    placeholder="e.g. Physics, Chemistry and Biology for SSC exams"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white shadow-2xs"
                  />
                </div>
              </div>

              {/* Quick Suggestions Chips */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  Suggested Subjects (Click to auto-fill):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SUBJECTS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setTabSubjectName(sug)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 text-xs font-medium transition-colors cursor-pointer border border-slate-200"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  Color Theme (रंग थीम):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {COLOR_PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setTabSubjectPalette(pal.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        tabSubjectPalette === pal.id 
                          ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-400 font-bold' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${pal.iconBg}`} />
                      <span className="text-xs">{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={!tabSubjectName.trim()}
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Subject</span>
                </button>
              </div>
            </form>
          </div>

          {/* All Subjects Directory Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Active Subjects Directory</h3>
                <p className="text-xs text-slate-500">All default and custom added subjects with test counts</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {allSubjectNames.length} Total Subjects
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {allSubjectNames.map((subName) => {
                const isCustom = customSubjects.some(cs => cs.name.toLowerCase() === subName.toLowerCase());
                const matchingTests = tests.filter(t => t.subject.toLowerCase() === subName.toLowerCase());
                const customObj = customSubjects.find(cs => cs.name.toLowerCase() === subName.toLowerCase());

                return (
                  <div 
                    key={subName}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-slate-900">{subName}</span>
                        {isCustom ? (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            Custom
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            Standard
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {customObj?.description || `${subName} Mock Tests & Chapters for SSC`}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-600">
                        <b>{matchingTests.length}</b> Mock Tests
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSubject(subName);
                            setActiveTab('create');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs transition-colors cursor-pointer"
                        >
                          + Create Mock
                        </button>
                        {isCustom && onDeleteCustomSubject && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete subject "${subName}"? Existing tests will remain.`)) {
                                onDeleteCustomSubject(subName);
                              }
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete custom subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT SUBMISSIONS & RESULTS TRACKING */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Student Test Submissions Live Stream</h3>
                <p className="text-xs text-slate-500">Track student scores, accuracy, and detailed response sheets</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                {allAttempts.length} Total Submissions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student Name & Email</th>
                    <th className="py-3 px-4">Test Title</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Accuracy</th>
                    <th className="py-3 px-4 text-center">Time Taken</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Answer Sheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {allAttempts.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{a.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{a.userEmail}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {a.testTitle}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-black text-slate-900 text-sm">{a.score}</span>
                        <span className="text-slate-400 text-[11px]"> / {a.totalMarks}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded-full ${
                          a.accuracy >= 70 ? 'bg-emerald-50 text-emerald-700' :
                          a.accuracy >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {a.accuracy}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {Math.floor(a.timeTakenSeconds / 60)}m {a.timeTakenSeconds % 60}s
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(a.submittedAt).toLocaleDateString()} {new Date(a.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setInspectedAttempt(a)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors cursor-pointer"
                        >
                          View Answers
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allAttempts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No student test submissions recorded yet. Take a mock test to view real submissions!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SHOW ALL REGISTERED USER LIST */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          {/* SHOW ALL USERS LIST FROM SUPABASE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Supabase Registered Users & Student Accounts</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View all new student accounts, emails/gmail IDs, full names, and registration details stored in Supabase.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Connected: caowbukfcjtpxulgixen</span>
                </span>

                <button
                  onClick={handleFetchSupabaseUsers}
                  disabled={loadingUsers}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                  <span>{loadingUsers ? 'Loading Users...' : 'Refresh Users List'}</span>
                </button>
              </div>
            </div>

            {loadingUsers && !usersLoaded && (
              <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                <span className="font-bold">Fetching registered users from Supabase...</span>
              </div>
            )}

            {usersLoaded && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Total Users Found in Supabase: <strong className="text-emerald-600">{supabaseUsers.length}</strong></span>
                </div>
                {supabaseUsers.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                    No users registered in Supabase profiles table yet. Sign up a new user via the Login/Sign Up modal to see them appear here instantly!
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                        <tr>
                          <th className="py-3 px-4">User ID</th>
                          <th className="py-3 px-4">Full Name / Username</th>
                          <th className="py-3 px-4">Gmail / Email ID</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Created Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {supabaseUsers.map((u, idx) => (
                          <tr key={u.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{u.id}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">{u.full_name || u.displayName || 'Officer Aspirant'}</td>
                            <td className="py-3 px-4 font-medium text-emerald-700">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 uppercase">
                                {u.role || 'student'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {u.created_at ? new Date(u.created_at).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PREVIEW TEST MODAL */}
      {previewTest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{previewTest.test.title}</h3>
                <span className="text-xs text-slate-500 font-medium">
                  {previewTest.test.subject} • {previewTest.questions.length} Questions • {previewTest.test.durationMinutes} Minutes
                </span>
              </div>

              {/* Language Switcher in Preview */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-slate-200 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setPreviewLang('both')}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      previewLang === 'both' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Both (द्विभाषी)
                  </button>
                  <button
                    onClick={() => setPreviewLang('en')}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      previewLang === 'en' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setPreviewLang('hi')}
                    className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      previewLang === 'hi' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>

                <button onClick={() => setPreviewTest(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 divide-y divide-slate-100 text-xs">
              {previewTest.questions.map((q, idx) => (
                <div key={q.id || idx} className="pt-4 first:pt-0 space-y-2">
                  <div className="space-y-1">
                    {(previewLang === 'both' || previewLang === 'en') && (
                      <div className="font-bold text-slate-900 text-sm">
                        {idx + 1}. {q.questionText}
                      </div>
                    )}
                    {(previewLang === 'both' || previewLang === 'hi') && q.questionTextHindi && (
                      <div className="font-semibold text-slate-700 text-sm leading-relaxed">
                        {previewLang === 'both' ? '🇮🇳 ' : `${idx + 1}. `}{q.questionTextHindi}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pl-3">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctOptionIndex;
                      const optHindi = q.optionsHindi?.[oIdx];

                      return (
                        <div key={oIdx} className={`p-2 rounded-lg border ${isCorrect ? "font-bold text-emerald-800 bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-200"}`}>
                          <div>{String.fromCharCode(65 + oIdx)}) {opt}</div>
                          {(previewLang === 'both' || previewLang === 'hi') && optHindi && (
                            <div className="text-[11px] text-slate-500 font-medium">{optHindi}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-purple-950 pl-3 space-y-1">
                    {(previewLang === 'both' || previewLang === 'en') && (
                      <div><b>💡 Explanation (EN):</b> {q.explanation}</div>
                    )}
                    {(previewLang === 'both' || previewLang === 'hi') && q.explanationHindi && (
                      <div className="border-t border-purple-200/50 pt-1 text-purple-900 font-medium">
                        <b>🇮🇳 व्याख्या (HI):</b> {q.explanationHindi}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SINGLE BILINGUAL QUESTION FORM MODAL */}
      {showSingleQModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                  MCQ
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingQuestionIndex !== null ? `Edit Question #${editingQuestionIndex + 1}` : 'Add Bilingual MCQ Question'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Input Question, Options & Explanation in English & हिन्दी
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSingleQModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSingleQuestion} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              
              {/* Question Text (English) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Question Text (English) *</span>
                  <span className="text-[10px] text-pink-600 font-semibold">Required</span>
                </label>
                <textarea
                  rows={2}
                  value={formQText}
                  onChange={(e) => setFormQText(e.target.value)}
                  placeholder="e.g. Which Constitutional Amendment added the Preamble words Socialist and Secular?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
                  required
                />
              </div>

              {/* Question Text (Hindi) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>प्रश्न विवरण (हिन्दी)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">🇮🇳 Hindi Translation</span>
                </label>
                <textarea
                  rows={2}
                  value={formQTextHindi}
                  onChange={(e) => setFormQTextHindi(e.target.value)}
                  placeholder="उदा. किस संविधान संशोधन द्वारा प्रस्तावना में समाजवादी और पंथनिरपेक्ष शब्द जोड़े गए?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
                />
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-3 pt-1">
                <div className="font-bold text-slate-800">Options (Bilingual English & हिन्दी):</div>

                {/* Option A */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Option A (English) *</label>
                    <input
                      type="text"
                      value={formOptA}
                      onChange={(e) => setFormOptA(e.target.value)}
                      placeholder="Option A (EN)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">विकल्प A (हिन्दी)</label>
                    <input
                      type="text"
                      value={formOptAHindi}
                      onChange={(e) => setFormOptAHindi(e.target.value)}
                      placeholder="विकल्प A (HI)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Option B */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Option B (English) *</label>
                    <input
                      type="text"
                      value={formOptB}
                      onChange={(e) => setFormOptB(e.target.value)}
                      placeholder="Option B (EN)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">विकल्प B (हिन्दी)</label>
                    <input
                      type="text"
                      value={formOptBHindi}
                      onChange={(e) => setFormOptBHindi(e.target.value)}
                      placeholder="विकल्प B (HI)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Option C */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Option C (English)</label>
                    <input
                      type="text"
                      value={formOptC}
                      onChange={(e) => setFormOptC(e.target.value)}
                      placeholder="Option C (EN)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">विकल्प C (हिन्दी)</label>
                    <input
                      type="text"
                      value={formOptCHindi}
                      onChange={(e) => setFormOptCHindi(e.target.value)}
                      placeholder="विकल्प C (HI)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Option D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Option D (English)</label>
                    <input
                      type="text"
                      value={formOptD}
                      onChange={(e) => setFormOptD(e.target.value)}
                      placeholder="Option D (EN)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">विकल्प D (हिन्दी)</label>
                    <input
                      type="text"
                      value={formOptDHindi}
                      onChange={(e) => setFormOptDHindi(e.target.value)}
                      placeholder="विकल्प D (HI)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Correct Answer Selection */}
              <div className="space-y-1 pt-1">
                <label className="font-bold text-slate-800">Correct Answer Option *</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isSelected = formCorrectIndex === optIdx;
                    return (
                      <button
                        type="button"
                        key={optIdx}
                        onClick={() => setFormCorrectIndex(optIdx)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Option {letter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanations in English & Hindi */}
              <div className="space-y-2 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Detailed Explanation (English)</label>
                  <textarea
                    rows={2}
                    value={formExp}
                    onChange={(e) => setFormExp(e.target.value)}
                    placeholder="Explanation in English..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">विस्तृत व्याख्या (हिन्दी)</label>
                  <textarea
                    rows={2}
                    value={formExpHindi}
                    onChange={(e) => setFormExpHindi(e.target.value)}
                    placeholder="हिन्दी व्याख्या..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Topic & Difficulty */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold text-slate-600">Topic</label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="e.g. Fundamental Rights"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSingleQModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingQuestionIndex !== null ? 'Update Question' : 'Add to Mock Test'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* INSPECT STUDENT ATTEMPT MODAL */}
      {inspectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Answer Sheet: {inspectedAttempt.userName}
                </h3>
                <span className="text-xs text-slate-500">
                  {inspectedAttempt.testTitle} • Score: {inspectedAttempt.score}/{inspectedAttempt.totalMarks} ({inspectedAttempt.accuracy}% Accuracy)
                </span>
              </div>
              <button onClick={() => setInspectedAttempt(null)} className="p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
              {inspectedAttempt.answers.map((a, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">Question {a.questionNumber || idx + 1}</span>
                    <span className="text-slate-500 ml-2 font-mono">({a.timeSpentSeconds || 0}s spent)</span>
                  </div>
                  <div>
                    {a.selectedOptionIndex === null || a.selectedOptionIndex === undefined ? (
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-bold text-[11px]">Unattempted</span>
                    ) : a.isCorrect ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">Correct Option {String.fromCharCode(65 + a.selectedOptionIndex)}</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[11px]">Chose Option {String.fromCharCode(65 + a.selectedOptionIndex)} (Incorrect)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD SUBJECT MODAL */}
      {showQuickSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Add New Subject</h3>
                  <p className="text-[11px] text-slate-500">Create a new subject for this mock test</p>
                </div>
              </div>
              <button 
                onClick={() => setShowQuickSubjectModal(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Subject Name (विषय का नाम) *
                </label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g. General Science, Art & Culture, Reasoning"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
                  autoFocus
                />
              </div>

              {/* Quick Suggestions Chips */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Suggested Subjects (Click to select):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SUBJECTS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNewSubjectName(sug)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newSubjectDescription}
                  onChange={(e) => setNewSubjectDescription(e.target.value)}
                  placeholder="e.g. Complete General Science mock tests for SSC CGL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Color Theme */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Color Theme:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setNewSubjectPalette(pal.id)}
                      className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all ${
                        newSubjectPalette === pal.id 
                          ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-400 font-bold' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${pal.iconBg}`} />
                      <span className="text-[11px]">{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickSubjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!newSubjectName.trim()}
                  onClick={handleQuickAddSubject}
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Subject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
