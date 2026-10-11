export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'student' | 'admin';
  createdAt?: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  questionTextHindi?: string;
  options: string[];
  optionsHindi?: string[];
  correctOptionIndex: number; // 0, 1, 2, 3
  explanation: string;
  explanationHindi?: string;
  topic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export type TestCategory = 'subject_wise' | 'chapter_wise' | '60_day_plan' | 'full_syllabus';

export interface TestModel {
  id: string;
  title: string;
  subject: string; // e.g. "History", "Geography", "Polity", "Economy", "Static GK", "Current Affairs"
  chapter?: string; // e.g. "Ancient India", "Indian Polity", etc.
  category: TestCategory;
  dayNumber?: number | null; // 1 - 60
  durationMinutes: number; // e.g. 15, 20, 30, 60
  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  questionCount: number;
  instructions?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttemptAnswer {
  questionId: string;
  questionNumber: number;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  markedForReview: boolean;
}

export interface AttemptModel {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  testId: string;
  testTitle: string;
  subject: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTakenSeconds: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  answers: AttemptAnswer[];
  submittedAt: string;
  status: 'completed';
}

export interface BookmarkModel {
  id: string;
  userId: string;
  questionId: string;
  testId: string;
  questionText: string;
  questionTextHindi?: string;
  options: string[];
  optionsHindi?: string[];
  correctOptionIndex: number;
  explanation: string;
  explanationHindi?: string;
  subject?: string;
  savedAt: string;
}

export interface SubjectModel {
  name: string;
  totalTestsCount?: number;
  description?: string;
  bgColor?: string;
  borderColor?: string;
  iconColor?: string;
  iconBg?: string;
  btnColor?: string;
}

export type TCSStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked';
