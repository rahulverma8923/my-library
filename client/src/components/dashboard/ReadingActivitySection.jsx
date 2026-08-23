import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';

export const ReadingActivitySection = ({ stats }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getReadingActivity();
        setAnalytics(res.analytics);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const monthlyData = analytics?.monthlyActivity || [];
  const maxBooks = Math.max(1, ...monthlyData.map((d) => Math.max(d.finished, d.added)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Monthly Rhythm Highlights */}
      <div className="bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2.5 rounded-xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
                This Month's Pace
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Reading momentum summary
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-4 rounded-2xl bg-forest-50/60 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-900/30">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-700 dark:text-forest-400">
                Finished
              </span>
              <p className="text-2xl font-bold font-serif text-forest-900 dark:text-forest-200 mt-1">
                {stats?.finishedThisMonth || 0}
              </p>
              <span className="text-[10px] text-forest-600 dark:text-forest-400">this month</span>
            </div>

            <div className="p-4 rounded-2xl bg-parchment-100/60 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Added
              </span>
              <p className="text-2xl font-bold font-serif text-ink-900 dark:text-ink-50 mt-1">
                {stats?.addedThisMonth || 0}
              </p>
              <span className="text-[10px] text-ink-500 dark:text-ink-400">new volumes</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-parchment-200 dark:border-ink-800 flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Keep a steady pace of 15-20 pages per day.</span>
        </div>
      </div>

      {/* 6-Month Visual Reading Activity Bar Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-ink-900 rounded-3xl border border-parchment-200 dark:border-ink-800 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-warmAmber-100 dark:bg-warmAmber-950/60 text-warmAmber-700 dark:text-warmAmber-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-50">
                Reading Activity
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Books completed vs. added over the past 6 months
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-ink-600 dark:text-ink-300">
              <span className="w-2.5 h-2.5 rounded-full bg-forest-600 dark:bg-forest-500 inline-block" />
              <span>Finished</span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-600 dark:text-ink-300">
              <span className="w-2.5 h-2.5 rounded-full bg-warmAmber-500 inline-block" />
              <span>Added</span>
            </div>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
          {monthlyData.map((item, idx) => {
            const finishedHeight = Math.max(8, (item.finished / maxBooks) * 100);
            const addedHeight = Math.max(8, (item.added / maxBooks) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-32">
                  {/* Finished Bar */}
                  <div
                    style={{ height: `${finishedHeight}%` }}
                    className="w-3.5 sm:w-5 bg-forest-600 dark:bg-forest-500 rounded-t-lg transition-all duration-500 group-hover:bg-forest-500 relative"
                    title={`${item.finished} books finished in ${item.month}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-forest-700 dark:text-forest-400">
                      {item.finished}
                    </span>
                  </div>
                  {/* Added Bar */}
                  <div
                    style={{ height: `${addedHeight}%` }}
                    className="w-3.5 sm:w-5 bg-warmAmber-400 dark:bg-warmAmber-500/80 rounded-t-lg transition-all duration-500 group-hover:bg-warmAmber-400 relative"
                    title={`${item.added} books added in ${item.month}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-warmAmber-700 dark:text-warmAmber-400">
                      {item.added}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-ink-500 dark:text-ink-400">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
