import React from 'react';

export const BrandLogo = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl'
  };

  return (
    <img
      src="/logo.svg"
      alt="My Library Logo"
      className={`${sizeClasses[size] || sizeClasses.md} shadow-sm object-contain flex-shrink-0 ${className}`}
    />
  );
};
