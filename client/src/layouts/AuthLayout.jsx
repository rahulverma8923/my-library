import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookMarked, Sparkles, BookOpen, Quote } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-[#FAF7F2] dark:bg-[#090D0B] text-[#161D1A] dark:text-[#F0F3F1]">
      {/* Left Literary Showcase Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-950 via-forest-900 to-ink-950 text-parchment-50 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-warmAmber-500/10 rounded-full blur-3xl" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            <BookMarked className="w-6 h-6 text-parchment-100" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl tracking-tight text-white block">
              My Library
            </span>
            <span className="text-xs text-parchment-300 font-medium tracking-wide">
              Your books. Your progress. Your story.
            </span>
          </div>
        </div>

        {/* Center Quote Card */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
            <Quote className="w-10 h-10 text-warmAmber-400/80 mb-4" />
            <p className="font-serif italic text-xl lg:text-2xl text-parchment-100 leading-relaxed">
              “A reader lives a thousand lives before he dies. The man who never reads lives only one.”
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-parchment-300">
              — George R.R. Martin
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-serif font-bold text-xl text-parchment-50 block">Private</span>
              <span className="text-[11px] text-parchment-300">Isolated sanctuaries</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-serif font-bold text-xl text-parchment-50 block">Insights</span>
              <span className="text-[11px] text-parchment-300">Reading analytics</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-serif font-bold text-xl text-parchment-50 block">Reflect</span>
              <span className="text-[11px] text-parchment-300">Rich personal notes</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-parchment-400">
          Crafted for discerning readers & book collectors.
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto bg-[#FAF7F2] dark:bg-[#090D0B] text-[#161D1A] dark:text-[#F0F3F1]">
        <div className="flex justify-between items-center max-w-md w-full mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-forest-800 text-parchment-50 flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-base text-[#161D1A] dark:text-[#F0F3F1]">
              My Library
            </span>
          </div>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <Outlet />
        </div>

        <div className="max-w-md w-full mx-auto text-center text-xs text-[#5C7066] dark:text-[#83968C]">
          © {new Date().getFullYear()} My Library. All rights reserved.
        </div>
      </div>
    </div>
  );
};
