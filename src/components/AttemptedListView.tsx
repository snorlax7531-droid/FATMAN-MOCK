import React from 'react';
import { 
  FileCheck2, 
  Clock, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  RotateCcw
} from 'lucide-react';
import { AttemptModel } from '../types';

interface AttemptedListViewProps {
  attempts: AttemptModel[];
  onReviewAttempt: (attempt: AttemptModel) => void;
  onRetakeTest: (testId: string) => void;
}

export const AttemptedListView: React.FC<AttemptedListViewProps> = ({
  attempts,
  onReviewAttempt,
  onRetakeTest
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-pink-600" />
            <span>Attempted Mock Tests</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your past scores, solution keys, and mistake analyses
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          {attempts.length} Completed Mocks
        </span>
      </div>

      <div className="space-y-3.5">
        {attempts.map((att) => (
          <div
            key={att.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {att.subject}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(att.submittedAt).toLocaleDateString()} at {new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">
                {att.testTitle}
              </h3>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <span className="font-black text-slate-900 text-sm">
                  Score: <b className="text-pink-600">{att.score}</b> / {att.totalMarks}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {att.correctCount} Correct
                </span>
                <span className="flex items-center gap-1 font-semibold text-rose-700">
                  <XCircle className="w-3.5 h-3.5" />
                  {att.incorrectCount} Incorrect
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                  {att.accuracy}% Accuracy
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => onRetakeTest(att.testId)}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Retake</span>
              </button>
              <button
                onClick={() => onReviewAttempt(att)}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Review Solutions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {attempts.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No tests attempted yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select any subject or day from the 60-day plan to take your first TCS exam simulated test.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
