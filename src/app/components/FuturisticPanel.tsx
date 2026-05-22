import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';

interface FuturisticPanelProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
  glowEffect?: boolean;
}

const variantStyles = {
  default: 'bg-gray-900/60 border-blue-500/30',
  primary: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-cyan-400/50',
  secondary: 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/50',
  accent: 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-emerald-400/50'
};

export function FuturisticPanel({ 
  children, 
  title, 
  subtitle, 
  icon, 
  variant = 'default',
  className = '',
  glowEffect = false
}: FuturisticPanelProps) {
  return (
    <div className="relative group">
      {/* Glow Effect */}
      {glowEffect && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
      )}
      
      <Card className={`relative backdrop-blur-md ${variantStyles[variant]} ${className}`}
        style={{
          borderRadius: 'var(--theme-radius-lg, 16px)',
          boxShadow: 'var(--theme-shadow-md)',
          fontFamily: 'var(--theme-font-sans)',
        }}
      >
        {/* Header Section */}
        {(title || subtitle || icon) && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                    {icon}
                  </div>
                )}
                <div>
                  {title && (
                    <h3 className="text-white font-medium">{title}</h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-gray-400">{subtitle}</p>
                  )}
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
        
        {/* Corner Decorations — theme aware */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2" style={{ borderColor: 'color-mix(in srgb, var(--theme-sidebar-primary, #22d3ee) 50%, transparent)' }} />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2" style={{ borderColor: 'color-mix(in srgb, var(--theme-sidebar-primary, #22d3ee) 50%, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2" style={{ borderColor: 'color-mix(in srgb, var(--theme-sidebar-primary, #22d3ee) 50%, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2" style={{ borderColor: 'color-mix(in srgb, var(--theme-sidebar-primary, #22d3ee) 50%, transparent)' }} />
      </Card>
    </div>
  );
}