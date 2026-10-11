import React from 'react';
import { 
  X, 
  Clock, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  CalendarDays,
  Award
} from 'lucide-react';
import { TestModel, AttemptModel } from '../types';

interface TestSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tests: TestModel[];
  userAttempts: AttemptModel[];
  onStartTest: (testId: string) => void;
}

export const TestSelectorModal: React.FC<TestSelectorModalProps> = ({
  isOpen,
  onClose,
  title,
  tests,
  userAttempts,
  onStartTest
}) => {
  if (!isOpen) return null;

  const completedMap = new Map<string, AttemptModel>();
  userAttempts.forEach(a => completedMap.set(a.testId, a));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
            <p className="text-xs text-slate-500">
              {tests.length} Practice Mock Tests available in this section
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tests List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {tests.map((t) => {
            const attempt = completedMap.get(t.id);
            const isCompleted = !!attempt;

            return (
              <div
                key={t.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-pink-300 bg-white hover:bg-pink-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {t.subject}
                    </span>
                    {t.dayNumber && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        Day {t.dayNumber}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed ({attempt.score}/{attempt.totalMarks})</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-pink-600 transition-colors">
                    {t.title}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {t.durationMinutes} Minutes
                    </span>
                    <span>•</span>
                    <span>{t.questionCount || 10} MCQs</span>
                    <span>•</span>
                    <span>+{t.positiveMarks || 2} / -{t.negativeMarks || 0.5}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onStartTest(t.id);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-pink-600/20 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'Retake Test' : 'Start Test'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {tests.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No mock tests currently in this section. Upload via Administrator Panel!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
