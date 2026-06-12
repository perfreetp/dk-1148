import React from 'react';
import { InterestLevel } from '../../types';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  level?: InterestLevel;
  showBadge?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  level,
  showBadge = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const levelColors = {
    '新手': 'bg-success',
    '进阶': 'bg-highlight',
    '达人': 'bg-primary'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary/20 shadow-card`}
      />
      {showBadge && level && (
        <div className={`absolute -top-1 -right-1 ${levelColors[level]} text-white text-xs px-1.5 py-0.5 rounded-full font-medium`}>
          {level === '达人' ? '★' : level === '进阶' ? '◆' : '●'}
        </div>
      )}
    </div>
  );
};

export default Avatar;
