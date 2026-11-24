import React from 'react';
import { Clock, ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, ArrowUpRight } from 'lucide-react';

interface RemainingLifeGaugeProps {
  currentThickness: number;
  initialThickness: number;
  minimumAllowedThickness: number;
  corrosionRate: number; // mm/year
  remainingLifeMonths: number;
}

export const RemainingLifeGauge: React.FC<RemainingLifeGaugeProps> = ({
  currentThickness,
  initialThickness,
  minimumAllowedThickness,
  corrosionRate,
  remainingLifeMonths,
}) => {
  // Margin available before reaching critical minimum limit
  const totalDesignCorrosionAllowance = initialThickness - minimumAllowedThickness;
  const currentMargin = Math.max(0, currentThickness - minimumAllowedThickness);
  const consumedAllowance = totalDesignCorrosionAllowance - currentMargin;
  const percentageConsumed = Math.min(100, Math.max(0, (consumedAllowance / totalDesignCorrosionAllowance) * 100));
  const percentageSafe = 100 - percentageConsumed;

  const years = (remainingLifeMonths / 12).toFixed(1);
  const isCritical = remainingLifeMonths < 6;
  const isWarning = remainingLifeMonths >= 6 && remainingLifeMonths < 24;

  // Arc calculation for SVG gauge
  const radius = 70;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (percentageSafe / 100) * circumference;

  const gaugeColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

  return (
    <div className="p-5 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <span>Remaining Useful Life (RUL)</span>
          </h3>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            ASME / API 570 Model
          </span>
        </div>
        <p className="text-xs text-slate-400 light:text-slate-500 mb-4">
          Calculated via formula: <code className="text-cyan-300 font-mono text-[11px]">(t_actual - t_min) / CR</code>
        </p>
      </div>

      {/* Semicircle Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg width="180" height="105" viewBox="0 0 180 105" className="overflow-visible">
          {/* Background arc */}
          <path
            d="M 20 95 A 70 70 0 0 1 160 95"
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d="M 20 95 A 70 70 0 0 1 160 95"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text inside Arc */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span
            className={`text-3xl font-extrabold font-mono tracking-tight ${
              isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {remainingLifeMonths}
          </span>
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Months Remaining
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            (~{years} years)
          </span>
        </div>
      </div>

      {/* Formula breakdown metrics */}
      <div className="mt-4 pt-3 border-t border-industrial-800 light:border-slate-100 grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2 rounded bg-industrial-950/60 light:bg-slate-50 border border-industrial-800 light:border-slate-200">
          <span className="text-[10px] text-slate-400 block font-sans">Current (t_actual)</span>
          <strong className="text-slate-200 light:text-slate-800 text-sm">
            {currentThickness.toFixed(2)}
          </strong>
          <span className="text-[10px] text-slate-500"> mm</span>
        </div>

        <div className="p-2 rounded bg-industrial-950/60 light:bg-slate-50 border border-industrial-800 light:border-slate-200">
          <span className="text-[10px] text-slate-400 block font-sans">Min Limit (t_min)</span>
          <strong className="text-red-400 text-sm">
            {minimumAllowedThickness.toFixed(2)}
          </strong>
          <span className="text-[10px] text-slate-500"> mm</span>
        </div>

        <div className="p-2 rounded bg-industrial-950/60 light:bg-slate-50 border border-industrial-800 light:border-slate-200">
          <span className="text-[10px] text-slate-400 block font-sans">Corrosion Rate</span>
          <strong className="text-cyan-400 text-sm">
            {corrosionRate.toFixed(3)}
          </strong>
          <span className="text-[10px] text-slate-500"> mm/yr</span>
        </div>
      </div>
    </div>
  );
};
