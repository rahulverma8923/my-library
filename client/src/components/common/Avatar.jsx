import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { getInitials } from '../../utils/coverUtils';

export const Avatar = ({ name = '', avatar = '', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg font-semibold',
    xl: 'w-24 h-24 text-2xl font-bold'
  };

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || 'User Avatar'}
        className={`rounded-full object-cover border border-parchment-300 dark:border-ink-700 shadow-sm ${sizeClasses[size] || sizeClasses.md} ${className}`}
      />
    );
  }

  const initials = getInitials(name);

  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium bg-forest-800 text-parchment-50 border border-forest-600 shadow-sm select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {initials ? initials : <UserIcon className="w-1/2 h-1/2" />}
    </div>
  );
};
