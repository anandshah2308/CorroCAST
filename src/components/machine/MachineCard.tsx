import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldAlert, ArrowRight, Gauge, Wrench, Layers } from 'lucide-react';
import { Machine } from '../../types';
import { StatusBadge, CorrosionTypeBadge } from '../common/Badge';

interface MachineCardProps {
  machine: Machine;
  index: number;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine, index }) => {
  const isCritical = machine.status === 'Critical';
  const isWarning = machine.status === 'Warning';

  // Mini sparkline SVG generator
  const utSensor = machine.sensors.find(s => s.type === 'ut_thickness');
  const sparkData = utSensor?.sparkline || [9.6, 9.61, 9.6, 9.59, 9.58, 9.58];
  
  const minVal = Math.min(...sparkData);
  const maxVal = Math.max(...sparkData);
  const range = maxVal - minVal || 1;
  const width = 120;
  const height = 36;
  const points = sparkData.map((val, idx) => {
    const x = (idx / (sparkData.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

  return (
    <div
      className={`group relative rounded-2xl p-5 border transition-all duration-300 backdrop-blur-sm ${
        isCritical
          ? 'border-red-500/50 bg-industrial-900/90 shadow-lg shadow-red-500/10 critical-pulse'
          : isWarning
          ? 'border-amber-500/40 bg-industrial-900/90 hover:border-amber-400/80 shadow-md'
          : 'border-industrial-700/60 bg-industrial-900/80 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5'
      } light:bg-white light:border-slate-200 light:hover:border-cyan-400`}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Header: Machine Tag & Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-industrial-800 text-cyan-400 border border-industrial-700 light:bg-slate-100 light:text-cyan-700 light:border-slate-300">
              {machine.tag}
            </span>
            <span className="text-xs text-slate-400 light:text-slate-500 truncate max-w-[140px]">
              {machine.location.split(',')[0]}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 light:text-slate-900 mt-1.5 group-hover:text-cyan-300 transition-colors">
            {machine.name}
          </h3>
        </div>

        <StatusBadge status={machine.status} size="sm" showPulse={isCritical} />
      </div>

      {/* Corrosion & Material Info */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <CorrosionTypeBadge type={machine.likelyCorrosionType} />
        <span className="text-[11px] font-mono text-slate-400 light:text-slate-500 bg-industrial-950/50 px-2 py-0.5 rounded border border-industrial-800 light:bg-slate-50 light:border-slate-200">
          {machine.material.replace('Carbon Steel ', 'CS ')}
        </span>
      </div>

      {/* Metrics Row: Remaining Life & Corrosion Rate */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-industrial-800/80 light:border-slate-100 mb-4 font-mono">
        <div>
          <span className="text-[11px] text-slate-400 block font-sans">Remaining Life</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span
              className={`text-xl font-bold ${
                machine.remainingLifeMonths < 6
                  ? 'text-red-400'
                  : machine.remainingLifeMonths < 24
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {machine.remainingLifeMonths}
            </span>
            <span className="text-xs text-slate-400 font-sans">months</span>
          </div>
          <span className="text-[10px] text-slate-500">
            (~{(machine.remainingLifeMonths / 12).toFixed(1)} yrs)
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block font-sans">Corrosion Rate</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold text-slate-200 light:text-slate-800">
              {machine.corrosionRate.toFixed(3)}
            </span>
            <span className="text-xs text-slate-400 font-sans">mm/yr</span>
          </div>
          <span className="text-[10px] text-slate-500">
            Thk: {machine.currentThickness.toFixed(2)} mm
          </span>
        </div>
      </div>

      {/* Mini Sparkline & Footer Row */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <span className="text-[10px] text-slate-400 block mb-1">Thickness Trend (UT)</span>
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {sparkData.map((val, idx) => {
              if (idx === sparkData.length - 1) {
                const x = width;
                const y = height - ((val - minVal) / range) * (height - 8) - 4;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill={strokeColor}
                    className="animate-ping"
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock size={11} className="text-slate-500" />
            <span>{machine.lastReadingTime}</span>
          </div>

          <Link
            to={`/machine/${machine.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 group-hover:border-cyan-400 transition-all"
          >
            <span>View Diagnostics</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
