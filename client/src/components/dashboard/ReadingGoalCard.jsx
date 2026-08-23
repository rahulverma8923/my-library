import React from 'react';
import { Target, Trophy, ChevronRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../common/ProgressBar';

export const ReadingGoalCard = ({ goal }) => {
  const navigate = useNavigate();

  if (!goal) return null;

  const { year, target, completed, remaining, percentage } = goal;

  return (
    <div className="relative overflow-hidden bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-warmAmber-100 dark:bg-warmAmber-950/60 text-warmAmber-700 dark:text-warmAmber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
              {year} Reading Goal
            </h3>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              {completed} of {target} books completed
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/settings')}
          className="text-xs font-semibold text-forest-700 dark:text-forest-400 hover:text-forest-800 dark:hover:text-forest-300 inline-flex items-center gap-0.5"
        >
          <span>Adjust</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex justify-between items-center text-xs font-medium text-ink-600 dark:text-ink-300">
          <span>{percentage}% completed</span>
          <span className="font-semibold text-warmAmber-700 dark:text-warmAmber-400">
            {remaining > 0 ? `${remaining} books remaining` : '🎉 Goal achieved!'}
          </span>
        </div>

        <div className="w-full bg-parchment-200 dark:bg-ink-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-warmAmber-500 to-warmAmber-600 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
