import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-parchment-200 dark:border-ink-800 p-4 animate-pulse flex flex-col gap-3">
      <div className="w-full aspect-[2/3] bg-parchment-200 dark:bg-ink-800 rounded-xl" />
      <div className="h-5 bg-parchment-200 dark:bg-ink-800 rounded w-3/4 mt-2" />
      <div className="h-4 bg-parchment-200 dark:bg-ink-800 rounded w-1/2" />
      <div className="h-2.5 bg-parchment-200 dark:bg-ink-800 rounded-full w-full mt-2" />
    </div>
  );
};

export const SkeletonRow = () => {
  return (
    <div className="bg-white dark:bg-ink-900 rounded-xl border border-parchment-200 dark:border-ink-800 p-4 animate-pulse flex items-center gap-4">
      <div className="w-12 h-16 bg-parchment-200 dark:bg-ink-800 rounded-lg flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 bg-parchment-200 dark:bg-ink-800 rounded w-1/3" />
        <div className="h-3 bg-parchment-200 dark:bg-ink-800 rounded w-1/4" />
      </div>
      <div className="w-24 h-4 bg-parchment-200 dark:bg-ink-800 rounded hidden sm:block" />
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
