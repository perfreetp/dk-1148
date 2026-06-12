import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height
}) => {
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl'
  };

  return (
    <div
      className={`animate-pulse bg-bg-tertiary ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-card border border-primary/10 p-4">
    <div className="flex items-center gap-3 mb-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1">
        <Skeleton width="60%" height={16} className="mb-2" />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    <Skeleton height={60} className="mb-3" />
    <div className="flex gap-2">
      <Skeleton width={60} height={24} className="rounded-full" />
      <Skeleton width={80} height={24} className="rounded-full" />
    </div>
  </div>
);

export const ActivitySkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-card border border-primary/10 overflow-hidden">
    <Skeleton height={180} className="w-full" />
    <div className="p-4">
      <Skeleton width="80%" height={20} className="mb-3" />
      <Skeleton height={40} className="mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton width={100} height={32} className="rounded-full" />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  </div>
);

export default Skeleton;
