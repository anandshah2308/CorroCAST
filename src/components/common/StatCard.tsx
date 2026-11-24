import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: 'safe' | 'warning' | 'critical' | 'neutral';
  subtext: string;
  pulse?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  variant,
  subtext,
  pulse = false,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated count-up
  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const current = Math.round(value * (progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)));
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  const variantStyles = {
    neutral: {
      border: 'border-slate-800 light:border-slate-200',
      bg: 'bg-industrial-900/90 light:bg-white',
      iconBg: 'bg-slate-800 text-slate-300 light:bg-slate-100 light:text-slate-700',
      number: 'text-slate-100 light:text-slate-900',
      badge: 'text-slate-400',
    },
    safe: {
      border: 'border-emerald-500/30',
      bg: 'bg-industrial-900/90 light:bg-white',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      number: 'text-emerald-400',
      badge: 'text-emerald-400/80',
    },
    warning: {
      border: 'border-amber-500/30',
      bg: 'bg-industrial-900/90 light:bg-white',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      number: 'text-amber-400',
      badge: 'text-amber-400/80',
    },
    critical: {
      border: 'border-red-500/40',
      bg: 'bg-industrial-900/90 light:bg-white',
      iconBg: 'bg-red-500/15 text-red-400 border border-red-500/30',
      number: 'text-red-400',
      badge: 'text-red-400/80',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`relative p-5 rounded-2xl border ${style.border} ${style.bg} shadow-lg backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
        pulse ? 'animate-soft-pulse' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-medium text-slate-400 light:text-slate-500 tracking-wide">
          {label}
        </span>
        <div className={`p-2 rounded-xl ${style.iconBg}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${style.number}`}>
          {displayValue}
        </span>
        <span className="text-xs text-slate-500 font-mono">units</span>
      </div>

      <div className="mt-2 text-xs font-medium text-slate-400 light:text-slate-600 flex items-center justify-between">
        <span>{subtext}</span>
        <span className={`font-mono ${style.badge}`}>
          {variant === 'neutral' ? '100% Monitored' : variant.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
