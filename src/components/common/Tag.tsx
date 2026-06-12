import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'highlight' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick
}) => {
  const variantClasses = {
    default: 'bg-accent/10 text-accent',
    primary: 'bg-primary/10 text-primary',
    highlight: 'bg-highlight/10 text-highlight',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </span>
  );
};

export default Tag;
