import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface NeonBorderProps {
  children: ReactNode;
  color?: 'blue' | 'cyan' | 'purple' | 'green' | 'red' | 'orange';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
}

const colorClasses = {
  blue: 'shadow-blue-500/50 border-blue-500',
  cyan: 'shadow-cyan-500/50 border-cyan-500',
  purple: 'shadow-purple-500/50 border-purple-500',
  green: 'shadow-green-500/50 border-green-500',
  red: 'shadow-red-500/50 border-red-500',
  orange: 'shadow-orange-500/50 border-orange-500'
};

const intensityClasses = {
  low: 'shadow-sm',
  medium: 'shadow-md',
  high: 'shadow-lg shadow-glow'
};

export function NeonBorder({
  children,
  color = 'blue',
  intensity = 'medium',
  animated = false,
  className = ''
}: NeonBorderProps) {
  return (
    <div
      className={`
        relative border-2 rounded-lg
        ${colorClasses[color]} ${intensityClasses[intensity]}
        ${className}
      `}
    >
      {children}
      
      {/* Corner Glow Effects */}
      <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-current opacity-50 blur-sm" />
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-current opacity-50 blur-sm" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-current opacity-50 blur-sm" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-current opacity-50 blur-sm" />
    </div>
  );
}
