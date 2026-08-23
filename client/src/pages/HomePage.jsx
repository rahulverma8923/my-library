import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GreetingHero } from '../components/dashboard/GreetingHero';
import { ReadingStatsGrid } from '../components/dashboard/ReadingStatsGrid';
import { ReadingGoalCard } from '../components/dashboard/ReadingGoalCard';
import { CurrentlyReadingSection } from '../components/dashboard/CurrentlyReadingSection';
import { RecentlyAddedSection } from '../components/dashboard/RecentlyAddedSection';
import { ReadingActivitySection } from '../components/dashboard/ReadingActivitySection';
import { useBooks } from '../context/BookContext';
import { SkeletonGrid } from '../components/common/SkeletonLoader';

export const HomePage = () => {
  const { openAddBookModal } = useOutletContext();
  const { stats, currentlyReading, recentBooks, dashboardLoading, fetchDashboardData } = useBooks();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Hero Greeting Banner */}
      <GreetingHero onAddBook={openAddBookModal} />

      {/* 2. Reading Statistics Tiles */}
      <ReadingStatsGrid stats={stats} />

      {/* 3. Goal Progress & Currently Reading Grid */}
      <div className="space-y-6">
        {stats?.readingGoal && <ReadingGoalCard goal={stats.readingGoal} />}
        
        <CurrentlyReadingSection books={currentlyReading} />
      </div>

      {/* 4. Recently Added Collection */}
      <RecentlyAddedSection books={recentBooks} />

      {/* 5. Reading Rhythm & Analytics Section */}
      <ReadingActivitySection stats={stats} />
    </div>
  );
};
