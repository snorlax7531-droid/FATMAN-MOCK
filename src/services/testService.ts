import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  writeBatch 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { TestModel, Question, AttemptModel, BookmarkModel } from '../types';
import { INITIAL_TESTS } from '../data/initialData';
import { SupabaseService } from '../supabase/client';
import { SUBJECTS_CHAPTERS_DATA, getOrCreateChapterMockTest } from '../data/chaptersData';

const LOCAL_TESTS_KEY = 'fatman_custom_tests';
const LOCAL_ATTEMPTS_KEY = 'fatman_saved_attempts';
const LOCAL_BOOKMARKS_KEY = 'fatman_saved_bookmarks';

// Helper to get local stored custom tests
function getLocalCustomTests(): (TestModel & { questions: Question[] })[] {
  try {
    const raw = localStorage.getItem(LOCAL_TESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomTests(tests: (TestModel & { questions: Question[] })[]) {
  try {
    localStorage.setItem(LOCAL_TESTS_KEY, JSON.stringify(tests));
  } catch (e) {
    console.error('Local save tests error', e);
  }
}

export const TestService = {
  /**
   * Get all tests (combining Firestore tests and default initial tests)
   */
  async getAllTests(): Promise<TestModel[]> {
    try {
      const snap = await getDocs(collection(db, 'tests'));
      if (!snap.empty) {
        const firestoreTests: TestModel[] = [];
        snap.forEach(docSnap => {
          firestoreTests.push({ id: docSnap.id, ...docSnap.data() } as TestModel);
        });
        return firestoreTests;
      }
    } catch (err) {
      console.warn('Firestore tests fetch failed, using local/initial tests:', err);
    }

    // Merge INITIAL_TESTS and local tests
    const local = getLocalCustomTests();
    const map = new Map<string, TestModel>();
    INITIAL_TESTS.forEach(t => map.set(t.id, t));
    local.forEach(t => map.set(t.id, t));
    return Array.from(map.values());
  },

  /**
   * Get a specific test along with all its questions
   */
  async getTestWithQuestions(testId: string): Promise<{ test: TestModel; questions: Question[] } | null> {
    // Check initial tests first
    const initial = INITIAL_TESTS.find(t => t.id === testId);
    if (initial) {
      return { test: initial, questions: initial.questions };
    }

    // Check local custom tests
    const local = getLocalCustomTests().find(t => t.id === testId);
    if (local) {
      return { test: local, questions: local.questions };
    }

    try {
      // Check Firestore
      const testDoc = await getDoc(doc(db, 'tests', testId));
      if (testDoc.exists()) {
        const testData = { id: testDoc.id, ...testDoc.data() } as TestModel;
        const qSnap = await getDocs(collection(db, `tests/${testId}/questions`));
        const questions: Question[] = [];
        qSnap.forEach(qDoc => {
          questions.push({ id: qDoc.id, ...qDoc.data() } as Question);
        });
        // Sort questions by questionNumber
        questions.sort((a, b) => a.questionNumber - b.questionNumber);
        return { test: testData, questions };
      }
    } catch (err) {
      console.warn('Error fetching test from Firestore:', err);
    }

    // Check dynamic chapter mock test
    for (const sub of SUBJECTS_CHAPTERS_DATA) {
      const ch = sub.chapters.find(c => `test-${c.id}` === testId || testId.includes(c.id));
      if (ch) {
        return getOrCreateChapterMockTest(ch, sub);
      }
    }

    return null;
  },

  /**
   * Admin creates or imports a new mock test
   */
  async createTest(test: TestModel, questions: Question[]): Promise<string> {
    const testId = test.id || `mock-${Date.now()}`;
    const cleanTest: TestModel = {
      ...test,
      id: testId,
      questionCount: questions.length,
      createdAt: test.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore if accessible
    try {
      await setDoc(doc(db, 'tests', testId), cleanTest);
      // Batch write questions
      const batch = writeBatch(db);
      questions.forEach((q, idx) => {
        const qRef = doc(db, `tests/${testId}/questions`, q.id || `q-${idx + 1}`);
        batch.set(qRef, {
          ...q,
          id: q.id || `q-${idx + 1}`,
          questionNumber: idx + 1,
          testId
        });
      });
      await batch.commit();
    } catch (err) {
      console.warn('Firestore write test failed, saving to local custom storage:', err);
    }

    // Always mirror to local storage
    const currentLocal = getLocalCustomTests();
    const updatedLocal = [...currentLocal.filter(t => t.id !== testId), { ...cleanTest, questions }];
    saveLocalCustomTests(updatedLocal);

    // Sync test metadata to Supabase
    try {
      await SupabaseService.saveTestToSupabase(cleanTest);
    } catch (e) {
      console.warn('Supabase test sync notice:', e);
    }

    return testId;
  },

  /**
   * Admin deletes a mock test
   */
  async deleteTest(testId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tests', testId));
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }

    const currentLocal = getLocalCustomTests();
    saveLocalCustomTests(currentLocal.filter(t => t.id !== testId));
  },

  /**
   * Submit student attempt
   * Saves all details directly to Supabase backend tables ('student_attempts' / 'attempts')
   */
  async submitAttempt(attempt: AttemptModel): Promise<string> {
    const attemptId = attempt.id || `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullAttempt: AttemptModel = {
      ...attempt,
      id: attemptId,
      submittedAt: attempt.submittedAt || new Date().toISOString(),
      status: 'completed'
    };

    // 1. SAVE TO SUPABASE BACKEND (Primary request)
    try {
      const supaResult = await SupabaseService.saveStudentAttempt(fullAttempt);
      if (supaResult.success) {
        console.log(`[Supabase] Attempt ${attemptId} saved successfully to table: ${supaResult.table}`);
      } else {
        console.warn('[Supabase] Attempt save note:', supaResult.error);
      }
    } catch (supaErr) {
      console.error('[Supabase] Error saving student attempt to Supabase backend:', supaErr);
    }

    // 2. Mirror to Firestore if available
    try {
      await setDoc(doc(db, 'attempts', attemptId), fullAttempt);
    } catch (err) {
      console.warn('Firestore submit attempt notice:', err);
    }

    // 3. Mirror locally
    try {
      const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
      const existing: AttemptModel[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify([fullAttempt, ...existing]));
    } catch (e) {
      console.error('Local attempt save error', e);
    }

    return attemptId;
  },

  /**
   * Fetch attempts for a specific student
   */
  async getUserAttempts(userId: string): Promise<AttemptModel[]> {
    // 1. Try Supabase first
    try {
      const supaAttempts = await SupabaseService.getUserAttempts(userId);
      if (supaAttempts && supaAttempts.length > 0) {
        return supaAttempts;
      }
    } catch (err) {
      console.warn('Supabase getUserAttempts fallback:', err);
    }

    // 2. Try Firestore
    try {
      const q = query(collection(db, 'attempts'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const attempts: AttemptModel[] = [];
        snap.forEach(d => attempts.push({ id: d.id, ...d.data() } as AttemptModel));
        attempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        return attempts;
      }
    } catch (err) {
      console.warn('Firestore getUserAttempts query fallback to local:', err);
    }

    // 3. Local fallback
    try {
      const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
      const existing: AttemptModel[] = raw ? JSON.parse(raw) : [];
      return existing.filter(a => a.userId === userId || !a.userId);
    } catch {
      return [];
    }
  },

  /**
   * Admin: Track all student test results across the portal
   */
  async getAllAttempts(): Promise<AttemptModel[]> {
    // 1. Try Supabase first
    try {
      const supaAttempts = await SupabaseService.getAllStudentAttempts();
      if (supaAttempts && supaAttempts.length > 0) {
        return supaAttempts;
      }
    } catch (err) {
      console.warn('Supabase getAllAttempts fallback:', err);
    }

    // 2. Try Firestore
    try {
      const snap = await getDocs(collection(db, 'attempts'));
      if (!snap.empty) {
        const attempts: AttemptModel[] = [];
        snap.forEach(d => attempts.push({ id: d.id, ...d.data() } as AttemptModel));
        attempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        return attempts;
      }
    } catch (err) {
      console.warn('Firestore getAllAttempts fallback to local:', err);
    }

    // 3. Local fallback
    try {
      const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Bookmarks
   */
  async toggleBookmark(bookmark: Omit<BookmarkModel, 'id' | 'savedAt'>): Promise<boolean> {
    const raw = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
    const existing: BookmarkModel[] = raw ? JSON.parse(raw) : [];
    const index = existing.findIndex(b => 
      b.questionId === bookmark.questionId && 
      (b.userId === bookmark.userId || !b.userId || !bookmark.userId || bookmark.userId === 'guest-aspirant' || b.userId === 'guest-aspirant')
    );

    let isBookmarked = false;
    let updatedBM: BookmarkModel | null = null;

    if (index >= 0) {
      // Remove
      existing.splice(index, 1);
      localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(existing));
      isBookmarked = false;
      try {
        await deleteDoc(doc(db, 'bookmarks', `${bookmark.userId}_${bookmark.questionId}`));
      } catch {}
    } else {
      // Add
      updatedBM = {
        ...bookmark,
        id: `${bookmark.userId}_${bookmark.questionId}`,
        savedAt: new Date().toISOString()
      };
      existing.unshift(updatedBM);
      localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(existing));
      isBookmarked = true;
      try {
        await setDoc(doc(db, 'bookmarks', updatedBM.id), updatedBM);
      } catch {}
    }

    // Broadcast instant window event so all UI components update in real time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fatman_bookmark_updated', {
        detail: {
          questionId: bookmark.questionId,
          isBookmarked,
          bookmark: updatedBM
        }
      }));
    }

    return isBookmarked;
  },

  async getUserBookmarks(userId: string): Promise<BookmarkModel[]> {
    const bookmarkMap = new Map<string, BookmarkModel>();

    // 1. Local Storage is the immediate source of truth
    try {
      const raw = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
      const list: BookmarkModel[] = raw ? JSON.parse(raw) : [];
      list.forEach(b => {
        if (b.userId === userId || !b.userId || userId === 'guest-aspirant' || b.userId === 'guest-aspirant') {
          bookmarkMap.set(b.questionId, b);
        }
      });
    } catch {}

    // 2. Merge with Firestore bookmarks so nothing is missed
    try {
      const q = query(collection(db, 'bookmarks'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        snap.forEach(d => {
          const item = { id: d.id, ...d.data() } as BookmarkModel;
          if (!bookmarkMap.has(item.questionId)) {
            bookmarkMap.set(item.questionId, item);
          }
        });
      }
    } catch {}

    const results = Array.from(bookmarkMap.values());
    results.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    return results;
  },

  /**
   * Custom Subjects management
   */
  getCustomSubjects(): any[] {
    try {
      const raw = localStorage.getItem('fatman_custom_subjects');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveCustomSubject(subject: any) {
    try {
      const current = this.getCustomSubjects();
      const updated = [...current.filter(s => s.name.toLowerCase() !== subject.name.toLowerCase()), subject];
      localStorage.setItem('fatman_custom_subjects', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving subject', e);
    }
  },

  deleteCustomSubject(name: string) {
    try {
      const current = this.getCustomSubjects();
      const updated = current.filter(s => s.name.toLowerCase() !== name.toLowerCase());
      localStorage.setItem('fatman_custom_subjects', JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting subject', e);
    }
  }
};
