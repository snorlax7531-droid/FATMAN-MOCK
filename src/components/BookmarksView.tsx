import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { BookmarkModel } from '../types';
import { TestService } from '../services/testService';
import { useAuth } from '../context/AuthContext';

interface BookmarksViewProps {
  bookmarks: BookmarkModel[];
  onRefreshBookmarks: () => Promise<void>;
  onRemoveBookmark?: (questionId: string) => void;
  onStartTest: (testId: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onRefreshBookmarks,
  onRemoveBookmark,
  onStartTest
}) => {
  const { userProfile } = useAuth();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExp = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRemove = async (b: BookmarkModel) => {
    const effectiveUserId = userProfile?.uid || userProfile?.email || 'guest-aspirant';
    onRemoveBookmark?.(b.questionId);
    await TestService.toggleBookmark({
      userId: effectiveUserId,
      questionId: b.questionId,
      testId: b.testId,
      questionText: b.questionText,
      options: b.options,
      correctOptionIndex: b.correctOptionIndex,
      explanation: b.explanation,
      subject: b.subject
    });
    await onRefreshBookmarks();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-pink-600 fill-current" />
            <span>Saved Bookmarks & Important MCQs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly revise questions you saved for last-minute exam revision
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          {bookmarks.length} Saved Questions
        </span>
      </div>

      <div className="space-y-4">
        {bookmarks.map((b, idx) => {
          const isExp = expanded.has(b.id);

          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {b.subject || 'GK/GS'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Saved on {new Date(b.savedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {b.testId && (
                    <button
                      onClick={() => onStartTest(b.testId)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Take Full Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(b)}
                    title="Remove from bookmarks"
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <p className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                  {idx + 1}. {b.questionText}
                </p>
                {b.questionTextHindi && (
                  <p className="text-xs md:text-sm text-slate-600">
                    {b.questionTextHindi}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {b.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === b.correctOptionIndex;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        isCorrect 
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold' 
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation Dropdown */}
              <div className="rounded-xl bg-purple-50/70 border border-purple-100 overflow-hidden text-xs">
                <button
                  onClick={() => toggleExp(b.id)}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-purple-900 cursor-pointer"
                >
                  <span>💡 View Explanation</span>
                  {isExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isExp && (
                  <div className="p-3 pt-0 text-slate-700 border-t border-purple-100/60 leading-relaxed">
                    {b.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {bookmarks.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No questions bookmarked yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              During or after taking any mock test, click the bookmark icon on any question to save it here for fast revision.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
