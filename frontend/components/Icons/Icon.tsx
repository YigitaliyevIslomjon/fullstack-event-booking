'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import * as List from './List';
export interface IconProps {
  name: string;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  name,
  className,
  onClick,
}) => {
  const Component = List[name as keyof typeof List];

  if (!Component) {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <Component />
    </div>
  );
};

export default Icon;
