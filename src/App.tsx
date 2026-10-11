import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { SubjectCards } from './components/SubjectCards';
import { ChapterWiseTests } from './components/ChapterWiseTests';
import { TcsExamEnvironment } from './components/TcsExamEnvironment';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { StudyPlan60Days } from './components/StudyPlan60Days';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { LandingLoginScreen } from './components/LandingLoginScreen';
import { TestSelectorModal } from './components/TestSelectorModal';
import { AttemptedListView } from './components/AttemptedListView';
import { BookmarksView } from './components/BookmarksView';
import { CreatedMocksView } from './components/CreatedMocksView';
import { SubjectManagementView } from './components/SubjectManagementView';
import { ProfileModal } from './components/ProfileModal';
import { SubjectChapterView } from './components/SubjectChapterView';
import { SUBJECTS_CHAPTERS_DATA, getOrCreateChapterMockTest, ChapterItem, SubjectData } from './data/chaptersData';
import fatmanBookCover from './assets/images/fatman_book_cover_1791546423682.jpg';
import { TestService } from './services/testService';
import { TestModel, Question, AttemptModel, BookmarkModel, SubjectModel } from './types';
import { 
  ShoppingBag, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Award,
  ArrowRight
} from 'lucide-react';

function MainApp() {
  const { userProfile, isAdmin, refreshProfile, logout } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedSubjectIdForChapters, setSelectedSubjectIdForChapters] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Sidebar states
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toggle handler for the 3-line hamburger menu
  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileDrawerOpen(prev => !prev);
    } else {
      setDesktopSidebarOpen(prev => !prev);
    }
  };

  // Data states
  const [tests, setTests] = useState<TestModel[]>([]);
  const [userAttempts, setUserAttempts] = useState<AttemptModel[]>([]);
  const [allAttempts, setAllAttempts] = useState<AttemptModel[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Active TCS Exam State
  const [activeExam, setActiveExam] = useState<{ test: TestModel; questions: Question[] } | null>(null);

  // Active Performance Result State
  const [activeResult, setActiveResult] = useState<{ attempt: AttemptModel; questions: Question[] } | null>(null);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalDefaultAdmin, setLoginModalDefaultAdmin] = useState(false);

  // Test Selector Modal (when clicking subject or chapter)
  const [testSelectorModal, setTestSelectorModal] = useState<{
    isOpen: boolean;
    title: string;
    tests: TestModel[];
  }>({
    isOpen: false,
    title: '',
    tests: []
  });

  // Preselected day for 60-day plan admin assignment
  const [preselectedPlanDay, setPreselectedPlanDay] = useState<number | null>(null);
  const [adminPrefillSubject, setAdminPrefillSubject] = useState<string>('History');

  // Custom Subjects state persisted in localStorage
  const [customSubjects, setCustomSubjects] = useState<SubjectModel[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fatman_custom_subjects') || '[]');
    } catch {
      return [];
    }
  });

  const handleAddCustomSubject = (newSubject: SubjectModel) => {
    setCustomSubjects(prev => {
      const updated = [...prev.filter(s => s.name.toLowerCase() !== newSubject.name.toLowerCase()), newSubject];
      try {
        localStorage.setItem('fatman_custom_subjects', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleDeleteCustomSubject = (subjectName: string) => {
    setCustomSubjects(prev => {
      const updated = prev.filter(s => s.name.toLowerCase() !== subjectName.toLowerCase());
      try {
        localStorage.setItem('fatman_custom_subjects', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Load all tests and data
  const loadInitialData = async () => {
    try {
      const allTests = await TestService.getAllTests();
      setTests(allTests);

      const effectiveUserId = userProfile?.uid || userProfile?.email || 'guest-aspirant';
      const myAttempts = await TestService.getUserAttempts(effectiveUserId);
      setUserAttempts(myAttempts);
      const myBookmarks = await TestService.getUserBookmarks(effectiveUserId);
      setBookmarks(myBookmarks);

      const allAtts = await TestService.getAllAttempts();
      setAllAttempts(allAtts);
    } catch (e) {
      console.error('Error loading initial data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [userProfile?.uid]);

  // Re-fetch latest bookmarks whenever entering bookmarks tab or on global bookmark event
  useEffect(() => {
    const handleBookmarkEvent = (e: any) => {
      const detail = e.detail;
      if (detail?.isBookmarked && detail.bookmark) {
        setBookmarks(prev => [detail.bookmark, ...prev.filter(b => b.questionId !== detail.questionId)]);
      } else if (detail?.questionId) {
        setBookmarks(prev => prev.filter(b => b.questionId !== detail.questionId));
      }
    };

    window.addEventListener('fatman_bookmark_updated', handleBookmarkEvent);
    return () => window.removeEventListener('fatman_bookmark_updated', handleBookmarkEvent);
  }, []);

  useEffect(() => {
    if (activeTab === 'bookmarks') {
      const effectiveUserId = userProfile?.uid || userProfile?.email || 'guest-aspirant';
      TestService.getUserBookmarks(effectiveUserId).then(bms => {
        setBookmarks(prev => {
          const map = new Map<string, BookmarkModel>();
          prev.forEach(b => map.set(b.questionId, b));
          bms.forEach(b => map.set(b.questionId, b));
          const merged = Array.from(map.values());
          merged.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
          return merged;
        });
      });
    }
  }, [activeTab, userProfile?.uid]);

  // Real-time Bookmark Toggle Handler
  const handleToggleBookmark = async (
    q: Question,
    testId: string = 'general-mock',
    subject: string = 'General Awareness'
  ): Promise<boolean> => {
    const effectiveUserId = userProfile?.uid || userProfile?.email || 'guest-aspirant';
    const isNowBookmarked = await TestService.toggleBookmark({
      userId: effectiveUserId,
      questionId: q.id,
      testId: testId,
      questionText: q.questionText,
      questionTextHindi: q.questionTextHindi,
      options: q.options,
      optionsHindi: q.optionsHindi,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      explanationHindi: q.explanationHindi,
      subject: subject
    });

    if (isNowBookmarked) {
      const newBM: BookmarkModel = {
        id: `${effectiveUserId}_${q.id}`,
        userId: effectiveUserId,
        questionId: q.id,
        testId: testId,
        questionText: q.questionText,
        questionTextHindi: q.questionTextHindi,
        options: q.options,
        optionsHindi: q.optionsHindi,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
        explanationHindi: q.explanationHindi,
        subject: subject,
        savedAt: new Date().toISOString()
      };
      setBookmarks(prev => [newBM, ...prev.filter(b => b.questionId !== q.id)]);
    } else {
      setBookmarks(prev => prev.filter(b => b.questionId !== q.id));
    }

    return isNowBookmarked;
  };

  // Start a specific test by ID
  const handleStartTest = async (testId: string) => {
    setLoading(true);
    const data = await TestService.getTestWithQuestions(testId);
    setLoading(false);

    if (data && data.questions.length > 0) {
      setActiveExam(data);
      setActiveResult(null);
    } else {
      alert('This test has no questions yet. Create or upload questions via Admin Panel.');
    }
  };

  // When TCS Exam finishes
  const handleExamComplete = async (attempt: AttemptModel) => {
    const savedId = await TestService.submitAttempt(attempt);
    const submittedAttempt = { ...attempt, id: savedId };

    // Update attempts
    setUserAttempts(prev => [submittedAttempt, ...prev]);
    setAllAttempts(prev => [submittedAttempt, ...prev]);

    // Show Performance Analytics
    if (activeExam) {
      setActiveResult({
        attempt: submittedAttempt,
        questions: activeExam.questions
      });
    }
    setActiveExam(null);
  };

  // Open subject tests / chapters view directly in Home tab
  const handleSelectSubject = (subjectNameOrId: string) => {
    if (subjectNameOrId === 'all') {
      setSelectedSubjectIdForChapters('geography');
      setActiveTab('home');
      return;
    }

    const match = SUBJECTS_CHAPTERS_DATA.find(
      s => s.id.toLowerCase() === subjectNameOrId.toLowerCase() ||
           s.name.toLowerCase() === subjectNameOrId.toLowerCase() ||
           s.hindiName.includes(subjectNameOrId)
    );

    if (match) {
      setSelectedSubjectIdForChapters(match.id);
    } else {
      setSelectedSubjectIdForChapters('geography');
    }

    setActiveTab('home');
  };

  // Start chapter test (starts real TCS exam environment immediately)
  const handleStartChapterTest = async (chapter: ChapterItem, subject: SubjectData) => {
    setLoading(true);
    // 1. Check if an existing test in DB matches
    const existing = tests.find(t => 
      t.id === `test-${chapter.id}` ||
      (t.chapter && (t.chapter.toLowerCase() === chapter.englishTitle.toLowerCase() || t.chapter.toLowerCase() === chapter.hindiTitle.toLowerCase())) ||
      t.title.toLowerCase().includes(chapter.englishTitle.toLowerCase())
    );

    if (existing) {
      const data = await TestService.getTestWithQuestions(existing.id);
      if (data && data.questions.length > 0) {
        setActiveExam(data);
        setActiveResult(null);
        setLoading(false);
        return;
      }
    }

    // 2. Generate authentic bilingual chapter test
    const generated = getOrCreateChapterMockTest(chapter, subject);
    setActiveExam(generated);
    setActiveResult(null);
    setLoading(false);
  };

  // View detailed chapter analysis
  const handleViewChapterAnalysis = async (attempt: AttemptModel) => {
    setLoading(true);
    const data = await TestService.getTestWithQuestions(attempt.testId);
    let questions = data?.questions || [];
    if (questions.length === 0) {
      for (const sub of SUBJECTS_CHAPTERS_DATA) {
        const foundCh = sub.chapters.find(c => attempt.testId.includes(c.id) || attempt.testTitle.includes(c.englishTitle));
        if (foundCh) {
          questions = getOrCreateChapterMockTest(foundCh, sub).questions;
          break;
        }
      }
    }
    setActiveResult({
      attempt,
      questions
    });
    setLoading(false);
  };

  // Start first available test in subject
  const handleStartFirstTestOfSubject = (subjectName: string) => {
    const match = tests.find(t => t.subject.toLowerCase() === subjectName.toLowerCase());
    if (match) {
      handleStartTest(match.id);
    } else if (tests.length > 0) {
      handleStartTest(tests[0].id);
    }
  };

  // Open chapter tests
  const handleSelectChapter = (chapterName: string) => {
    if (chapterName === 'all') {
      setTestSelectorModal({
        isOpen: true,
        title: 'All Chapter Wise Mock Tests',
        tests
      });
      return;
    }

    const filtered = tests.filter(t => 
      t.chapter?.toLowerCase() === chapterName.toLowerCase() ||
      t.title.toLowerCase().includes(chapterName.toLowerCase())
    );

    setTestSelectorModal({
      isOpen: true,
      title: `${chapterName} Mock Tests`,
      tests: filtered.length > 0 ? filtered : tests
    });
  };

  // Open Admin Assign Modal for specific 60-day plan day
  const handleOpenAdminAssignModal = (dayNumber: number) => {
    setPreselectedPlanDay(dayNumber);
    setActiveTab('admin');
  };

  // Filter tests by search query matching only relevant uploaded subject/chapter cards
  const searchResults = searchQuery.trim()
    ? SUBJECTS_CHAPTERS_DATA.flatMap(sub => {
        const query = searchQuery.toLowerCase();
        const matchesSubject = sub.name.toLowerCase().includes(query) || sub.hindiName.includes(query);
        return sub.chapters
          .filter(ch => 
            matchesSubject || 
            ch.englishTitle.toLowerCase().includes(query) || 
            ch.hindiTitle.toLowerCase().includes(query) ||
            ch.title.toLowerCase().includes(query)
          )
          .map(ch => ({
            id: `test-${ch.id}`,
            title: `${ch.englishTitle} / ${ch.hindiTitle}`,
            subject: sub.name,
            chapter: ch.englishTitle,
            durationMinutes: 15,
            totalMarks: 30,
            positiveMarks: 2.0,
            negativeMarks: 0.5,
            questionCount: 15,
            category: 'chapter_wise' as const
          }));
      })
    : [];

  return (
    <div className="flex h-screen bg-[#f3f6fb] overflow-hidden text-slate-800 font-sans antialiased">
      
      {/* 1. Desktop Sidebar (in-flow flex column, collapsible) */}
      <div 
        className={`hidden md:flex shrink-0 transition-all duration-300 ease-in-out ${
          desktopSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setActiveResult(null);
            if (tab === 'home') {
              setSelectedSubjectIdForChapters(null);
            }
          }}
          openAdminModal={() => {
            setLoginModalDefaultAdmin(true);
            setIsLoginModalOpen(true);
          }}
          openStudentLoginModal={() => {
            setLoginModalDefaultAdmin(false);
            setIsLoginModalOpen(true);
          }}
          openProfileModal={() => setIsProfileModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer (off-canvas overlay, mobile only) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            onClick={() => setMobileDrawerOpen(false)} 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
          />
          <div className="relative z-50 w-64 h-full bg-[#0d121f] shadow-2xl flex flex-col">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setActiveResult(null);
                if (tab === 'home') {
                  setSelectedSubjectIdForChapters(null);
                }
                setMobileDrawerOpen(false);
              }}
              openAdminModal={() => {
                setLoginModalDefaultAdmin(true);
                setIsLoginModalOpen(true);
                setMobileDrawerOpen(false);
              }}
              openStudentLoginModal={() => {
                setLoginModalDefaultAdmin(false);
                setIsLoginModalOpen(true);
                setMobileDrawerOpen(false);
              }}
              openProfileModal={() => {
                setIsProfileModalOpen(true);
                setMobileDrawerOpen(false);
              }}
              onCloseMobile={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <Header
          onToggleSidebar={handleToggleSidebar}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openLoginModal={() => {
            setLoginModalDefaultAdmin(false);
            setIsLoginModalOpen(true);
          }}
          openAdminModal={() => {
            setLoginModalDefaultAdmin(true);
            setIsLoginModalOpen(true);
          }}
          openProfileModal={() => setIsProfileModalOpen(true)}
        />

        {/* Dynamic Main Body Scroll Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* SEARCH RESULTS DROPDOWN / BANNER */}
          {searchQuery.trim() && (
            <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Search results for "{searchQuery}" ({searchResults.length})</span>
                <button onClick={() => setSearchQuery('')} className="text-pink-600 hover:underline">Clear</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResults.map(t => (
                  <div key={t.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-800">{t.title}</div>
                      <div className="text-[11px] text-slate-500">{t.subject} • {t.durationMinutes} min</div>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        handleStartTest(t.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-pink-600 text-white font-bold text-xs"
                    >
                      Start Test
                    </button>
                  </div>
                ))}
                {searchResults.length === 0 && (
                  <div className="text-xs text-slate-400 py-2">No matching mock tests found.</div>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE PERFORMANCE ANALYTICS VIEW */}
          {activeResult ? (
            <PerformanceAnalytics
              attempt={activeResult.attempt}
              questions={activeResult.questions}
              existingBookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onRetake={() => handleStartTest(activeResult.attempt.testId)}
              onGoHome={() => setActiveResult(null)}
              onGoStudyPlan={() => {
                setActiveResult(null);
                setActiveTab('60_day_plan');
              }}
            />
          ) : (
            <>
              {/* TAB: HOME */}
              {activeTab === 'home' && (
                <div className="space-y-8 max-w-7xl mx-auto">
                  {selectedSubjectIdForChapters ? (
                    /* When any Subject Card is clicked, show its full chapters view */
                    <SubjectChapterView
                      initialSubjectId={selectedSubjectIdForChapters}
                      userAttempts={userAttempts}
                      onStartChapter={handleStartChapterTest}
                      onViewAnalysis={handleViewChapterAnalysis}
                      onBack={() => setSelectedSubjectIdForChapters(null)}
                    />
                  ) : (
                    /* Initial Home View: Only HeroBanner and Subject Cards */
                    <>
                      {/* Hero Banner matching the uploaded photo */}
                      <HeroBanner onStartFullMock={() => handleSelectSubject('all')} />

                      {/* Section: Select Subject Cards */}
                      <SubjectCards
                        tests={tests}
                        customSubjects={customSubjects}
                        onSelectSubject={handleSelectSubject}
                        onStartFirstTestOfSubject={handleSelectSubject}
                      />
                    </>
                  )}
                </div>
              )}

              {/* TAB: CREATED MOCKS */}
              {activeTab === 'created_mocks' && (
                <div className="max-w-6xl mx-auto">
                  <CreatedMocksView
                    tests={tests}
                    customSubjects={customSubjects}
                    onStartTest={handleStartTest}
                    onNavigateToCreate={(prefillSub) => {
                      if (prefillSub) setAdminPrefillSubject(prefillSub);
                      setActiveTab('admin');
                    }}
                    onNavigateToAddSubject={() => setActiveTab('subjects')}
                    onRefreshTests={loadInitialData}
                  />
                </div>
              )}

              {/* TAB: ADD NEW SUBJECT & SUBJECT DIRECTORY */}
              {activeTab === 'subjects' && (
                <div className="max-w-6xl mx-auto">
                  <SubjectManagementView
                    tests={tests}
                    customSubjects={customSubjects}
                    onAddCustomSubject={handleAddCustomSubject}
                    onDeleteCustomSubject={handleDeleteCustomSubject}
                    onNavigateToCreateMock={(subj) => {
                      setAdminPrefillSubject(subj);
                      setActiveTab('admin');
                    }}
                    onSelectSubjectFilter={(subj) => {
                      handleSelectSubject(subj);
                    }}
                  />
                </div>
              )}

              {/* TAB: ATTEMPTED TEST */}
              {activeTab === 'attempted' && (
                <div className="max-w-5xl mx-auto">
                  <AttemptedListView
                    attempts={userAttempts}
                    onReviewAttempt={async (att) => {
                      const data = await TestService.getTestWithQuestions(att.testId);
                      setActiveResult({
                        attempt: att,
                        questions: data?.questions || []
                      });
                    }}
                    onRetakeTest={handleStartTest}
                  />
                </div>
              )}

              {/* TAB: 60 DAY STUDY PLAN */}
              {activeTab === '60_day_plan' && (
                <div className="max-w-6xl mx-auto">
                  <StudyPlan60Days
                    tests={tests}
                    userAttempts={userAttempts}
                    onStartTest={handleStartTest}
                    onOpenAdminAssignModal={handleOpenAdminAssignModal}
                    isAdmin={isAdmin}
                  />
                </div>
              )}

              {/* TAB: PERFORMANCE */}
              {activeTab === 'performance' && (
                <div className="max-w-5xl mx-auto space-y-6">
                  {userAttempts.length > 0 ? (
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Latest Performance Report</h2>
                      <PerformanceAnalytics
                        attempt={userAttempts[0]}
                        questions={
                          (tests.find(t => t.id === userAttempts[0].testId) as any)?.questions || []
                        }
                        onRetake={() => handleStartTest(userAttempts[0].testId)}
                        onGoHome={() => setActiveTab('home')}
                        onGoStudyPlan={() => setActiveTab('60_day_plan')}
                      />
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                      <Award className="w-12 h-12 text-slate-300 mx-auto" />
                      <h3 className="font-bold text-slate-800 text-base">No performance analytics yet</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Complete any mock test to unlock your subject accuracy breakdown, percentile curve, and speed analysis.
                      </p>
                      <button
                        onClick={() => setActiveTab('home')}
                        className="px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs"
                      >
                        Explore Mock Tests
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: BOOKMARKS */}
              {activeTab === 'bookmarks' && (
                <div className="max-w-5xl mx-auto">
                  <BookmarksView
                    bookmarks={bookmarks}
                    onRefreshBookmarks={async () => {
                      const effectiveUserId = userProfile?.uid || userProfile?.email || 'guest-aspirant';
                      const bms = await TestService.getUserBookmarks(effectiveUserId);
                      setBookmarks(bms);
                    }}
                    onRemoveBookmark={(questionId) => {
                      setBookmarks(prev => prev.filter(b => b.questionId !== questionId));
                    }}
                    onStartTest={handleStartTest}
                  />
                </div>
              )}

              {/* TAB: MY PURCHASE */}
              {activeTab === 'purchase' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="rounded-3xl bg-gradient-to-r from-[#170a2c] via-[#2a1049] to-[#120424] text-white p-8 border border-purple-900/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Official Course & Book Bundle</span>
                      </div>
                      <h1 className="text-3xl font-black text-white">
                        FATMAN GK/GS Theory Book (2nd Edition) & Complete Mock Test Series
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Authored by Parmar Sir. Complete bilingual theory coverage in English & Hindi with 10,000+ TCS Pattern MCQs, previous year papers, and chapter-wise mock tests.
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-3xl font-black text-pink-400">₹499</span>
                        <span className="text-sm text-slate-400 line-through">₹1,499</span>
                        <span className="text-xs font-bold bg-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-full">
                          67% Discount Active
                        </span>
                      </div>
                      <button
                        onClick={() => alert("All 100+ Tests are fully unlocked in your current access session!")}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-pink-600/30 cursor-pointer"
                      >
                        Access Unlimited Test Series (Included)
                      </button>
                    </div>

                    <div className="shrink-0 w-48 sm:w-56">
                      <img
                        src={fatmanBookCover}
                        alt="FATMAN Book"
                        referrerPolicy="no-referrer"
                        className="w-full h-auto rounded-2xl shadow-2xl drop-shadow-[0_20px_35px_rgba(244,63,94,0.4)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200">
                      <CheckCircle2 className="w-6 h-6 text-pink-600 mb-2" />
                      <h4 className="font-bold text-sm text-slate-900">Bilingual Question Bank</h4>
                      <p className="text-xs text-slate-500 mt-1">High quality translations in English and Shuddh Hindi.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-200">
                      <CheckCircle2 className="w-6 h-6 text-pink-600 mb-2" />
                      <h4 className="font-bold text-sm text-slate-900">TCS Exact Interface</h4>
                      <p className="text-xs text-slate-500 mt-1">100% replica of the real SSC CGL/CHSL exam console.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-200">
                      <CheckCircle2 className="w-6 h-6 text-pink-600 mb-2" />
                      <h4 className="font-bold text-sm text-slate-900">60-Day Guided Roadmap</h4>
                      <p className="text-xs text-slate-500 mt-1">Systematic step-by-step topic mastery with daily tests.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ADMIN PANEL */}
              {activeTab === 'admin' && (
                <div className="max-w-6xl mx-auto">
                  <AdminPanel
                    tests={tests}
                    allAttempts={allAttempts}
                    customSubjects={customSubjects}
                    onAddCustomSubject={handleAddCustomSubject}
                    onDeleteCustomSubject={handleDeleteCustomSubject}
                    onRefreshTests={loadInitialData}
                    preselectedDay={preselectedPlanDay}
                    initialSubject={adminPrefillSubject}
                  />
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* 3. TCS EXAM FULL SCREEN OVERLAY */}
      {activeExam && (
        <TcsExamEnvironment
          test={activeExam.test}
          questions={activeExam.questions}
          existingBookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          onComplete={handleExamComplete}
          onExit={() => setActiveExam(null)}
        />
      )}

      {/* 4. MODALS */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        defaultAdminView={loginModalDefaultAdmin}
      />

      <TestSelectorModal
        isOpen={testSelectorModal.isOpen}
        title={testSelectorModal.title}
        tests={testSelectorModal.tests}
        userAttempts={userAttempts}
        onClose={() => setTestSelectorModal(prev => ({ ...prev, isOpen: false }))}
        onStartTest={handleStartTest}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={async () => {
          await refreshProfile();
        }}
        onLogout={logout}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { userProfile } = useAuth();
  if (!userProfile) {
    return <LandingLoginScreen />;
  }
  return <MainApp />;
}
