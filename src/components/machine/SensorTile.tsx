import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Zap,
  Layers,
  Activity,
  AlertTriangle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { SensorReading } from '../../types';
import { SensorHealthBadge } from '../common/Badge';

interface SensorTileProps {
  sensor: SensorReading;
}

export const SensorTile: React.FC<SensorTileProps> = ({ sensor }) => {
  const getIcon = () => {
    switch (sensor.type) {
      case 'temperature':
        return Thermometer;
      case 'humidity':
        return Droplets;
      case 'wetness':
        return Activity;
      case 'flow':
        return Wind;
      case 'galvanic':
        return Zap;
      case 'er_loss':
        return Layers;
      case 'ut_thickness':
        return Gauge;
      default:
        return Activity;
    }
  };

  const Icon = getIcon();
  const isFailed = sensor.health === 'Failed' || sensor.isFaulty;
  const isDrifting = sensor.health === 'Drifting';

  // Sparkline calculation
  const spark = sensor.sparkline || [0, 0, 0];
  const min = Math.min(...spark);
  const max = Math.max(...spark);
  const range = max - min || 1;
  const width = 90;
  const height = 24;
  const points = spark.map((val, idx) => {
    const x = (idx / (spark.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all ${
        isFailed
          ? 'bg-red-950/20 border-red-500/50 shadow-sm shadow-red-500/10'
          : isDrifting
          ? 'bg-amber-950/20 border-amber-500/40'
          : 'bg-industrial-900/80 border-industrial-700/60 light:bg-white light:border-slate-200 hover:border-cyan-500/40'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isFailed
                ? 'bg-red-500/20 text-red-400'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}
          >
            <Icon size={16} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200 light:text-slate-800 leading-tight">
              {sensor.name}
            </h4>
            <span className="font-mono text-[10px] text-cyan-400 light:text-cyan-600">
              {sensor.code}
            </span>
          </div>
        </div>

        <SensorHealthBadge health={sensor.health} isFaulty={sensor.isFaulty} />
      </div>

      {/* Main Value Display */}
      <div className="my-2 flex items-baseline justify-between">
        {isFailed ? (
          <div className="flex flex-col">
            <span className="text-xl font-bold font-mono text-red-400">FAULT / ERR</span>
            <span className="text-[11px] font-medium text-red-300 font-sans mt-0.5">
              sensor fault, not real corrosion
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
              {sensor.value}
            </span>
            <span className="text-xs text-slate-400 font-sans">{sensor.unit}</span>
          </div>
        )}

        {/* Sparkline mini */}
        {!isFailed && (
          <svg width={width} height={height} className="overflow-visible opacity-80">
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        )}
      </div>

      {/* Bottom Range / Spec info */}
      <div className="pt-2 border-t border-industrial-800/80 light:border-slate-100 text-[10px] text-slate-400 light:text-slate-500 flex items-center justify-between">
        <span className="truncate max-w-[180px]">{sensor.description}</span>
        <span className="font-mono shrink-0">
          Norm: {sensor.minNormal}-{sensor.maxNormal}
        </span>
      </div>
    </div>
  );
};
