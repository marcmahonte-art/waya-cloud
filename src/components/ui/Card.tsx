import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = ({ className, hoverable = true, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-surface rounded-card p-5 shadow-sm border border-gray-100',
        hoverable && 'transition-all duration-200 hover:scale-[1.02] hover:shadow-md',
        className
      )}
      {...props}
    />
  );
};
