import React from 'react';
import { BookOpen, BookCheck, Clock, Library } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const ReadingStatsGrid = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        title="Total Collection"
        value={stats.totalBooks || 0}
        subtitle="Volumes in library"
        icon={Library}
        color="forest"
      />
      <StatCard
        title="Currently Reading"
        value={stats.readingCount || 0}
        subtitle="Active reading journeys"
        icon={Clock}
        color="forest"
      />
      <StatCard
        title="Finished Books"
        value={stats.finishedCount || 0}
        subtitle="Stories completed"
        icon={BookCheck}
        color="amber"
      />
      <StatCard
        title="Not Started"
        value={stats.notStartedCount || 0}
        subtitle="Waiting on shelves"
        icon={BookOpen}
        color="ink"
      />
    </div>
  );
};
