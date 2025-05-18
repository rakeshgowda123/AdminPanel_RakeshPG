import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50' 
    : 'flex items-center justify-center py-4';

  return (
    <div className={containerClasses}>
      <div className={`${sizeClasses[size]} rounded-full border-[hsl(var(--muted-foreground))] border-t-[hsl(var(--primary))] animate-spin`}></div>
    </div>
  );
};

export default Loader;