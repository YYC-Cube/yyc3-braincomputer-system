import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface HexagonalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12 text-xs',
  md: 'w-16 h-16 text-sm',
  lg: 'w-20 h-20 text-base'
};

const variantClasses = {
  primary: 'from-blue-500/20 to-cyan-500/20 border-blue-400/50 hover:from-blue-500/30 hover:to-cyan-500/30',
  secondary: 'from-purple-500/20 to-pink-500/20 border-purple-400/50 hover:from-purple-500/30 hover:to-pink-500/30',
  accent: 'from-green-500/20 to-emerald-500/20 border-green-400/50 hover:from-green-500/30 hover:to-emerald-500/30'
};

export function HexagonalButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  active = false,
  disabled = false,
  className = ''
}: HexagonalButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative ${sizeClasses[size]} flex items-center justify-center
        bg-gradient-to-br ${variantClasses[variant]}
        border-2 rounded-lg backdrop-blur-sm
        transition-all duration-300 group
        ${active ? 'ring-2 ring-blue-400/50' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Hexagon Shape Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 text-white">
        {children}
      </div>
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-cyan-500/20 to-blue-500/0 rounded-lg blur opacity-0 group-hover:opacity-100" />
      
      {/* Corner Indicators */}
      {active && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
        </>
      )}
    </motion.button>
  );
}