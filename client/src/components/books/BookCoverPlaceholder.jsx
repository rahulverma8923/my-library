import React from 'react';
import { BookOpen } from 'lucide-react';
import { getCoverGradient, getInitials } from '../../utils/coverUtils';

export const BookCoverPlaceholder = ({ title = '', author = '', className = '' }) => {
  const gradient = getCoverGradient(title, author);
  const initials = getInitials(title);

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${gradient} p-4 sm:p-5 flex flex-col justify-between text-white select-none overflow-hidden rounded-xl shadow-book border border-white/10 ${className}`}
    >
      {/* Subtle spine crease shadow on left */}
      <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-2 w-[1px] bg-white/15 pointer-events-none" />

      {/* Decorative top pattern */}
      <div className="flex justify-between items-start z-10 opacity-80">
        <span className="text-[10px] tracking-widest uppercase font-semibold text-parchment-200">
          My Library
        </span>
        <BookOpen className="w-4 h-4 text-parchment-300" />
      </div>

      {/* Center Initials Badge */}
      <div className="my-auto text-center z-10 px-1 py-2">
        <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-parchment-300/40 flex items-center justify-center text-xs font-serif font-bold text-parchment-100 bg-white/5 backdrop-blur-sm">
          {initials}
        </div>
        <h4 className="font-serif font-bold text-sm sm:text-base leading-tight text-parchment-50 line-clamp-3 drop-shadow-sm">
          {title || 'Untitled Book'}
        </h4>
      </div>

      {/* Bottom Author */}
      <div className="z-10 text-center border-t border-white/10 pt-2">
        <p className="text-[11px] font-medium tracking-wide text-parchment-300 truncate">
          {author || 'Unknown Author'}
        </p>
      </div>

      {/* Corner subtle glow */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
    </div>
  );
};
