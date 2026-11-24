import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity, HelpCircle, CheckCircle, Wrench, XCircle } from 'lucide-react';
import { MachineStatus, CorrosionType, SensorHealth } from '../../types';

interface StatusBadgeProps {
  status: MachineStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showPulse = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 15,
    lg: 18,
  };

  if (status === 'Safe') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}
      >
        <ShieldCheck size={iconSizes[size]} className="text-emerald-400 shrink-0" />
        <span>Safe</span>
      </span>
    );
  }

  if (status === 'Warning') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses[size]}`}
      >
        <AlertTriangle size={iconSizes[size]} className="text-amber-400 shrink-0" />
        <span>Warning</span>
      </span>
    );
  }

  // Critical
  return (
    <span
      className={`inline-flex items-center rounded-full bg-red-500/15 text-red-400 border border-red-500/40 ${sizeClasses[size]} ${
        showPulse ? 'animate-soft-pulse' : ''
      }`}
    >
      <AlertOctagon size={iconSizes[size]} className="text-red-400 shrink-0" />
      <span>Critical</span>
    </span>
  );
};

interface CorrosionTypeBadgeProps {
  type: CorrosionType;
}

export const CorrosionTypeBadge: React.FC<CorrosionTypeBadgeProps> = ({ type }) => {
  const styles: Record<CorrosionType, { bg: string; text: string; border: string; label: string }> = {
    None: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/20',
      label: 'None / Nominal',
    },
    Uniform: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'Uniform Corrosion',
    },
    Pitting: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      label: 'Pitting Corrosion',
    },
    Galvanic: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      label: 'Galvanic Attack',
    },
    Crevice: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      label: 'Crevice Corrosion',
    },
  };

  const current = styles[type] || styles.None;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${current.bg} ${current.text} ${current.border}`}
    >
      {current.label}
    </span>
  );
};

interface SensorHealthBadgeProps {
  health: SensorHealth;
  isFaulty?: boolean;
}

export const SensorHealthBadge: React.FC<SensorHealthBadgeProps> = ({ health, isFaulty }) => {
  if (health === 'Failed' || isFaulty) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded">
        <XCircle size={11} />
        <span>Failed</span>
      </span>
    );
  }

  if (health === 'Drifting') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
        <Activity size={11} />
        <span>Drifting</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
      <CheckCircle size={11} />
      <span>OK</span>
    </span>
  );
};
