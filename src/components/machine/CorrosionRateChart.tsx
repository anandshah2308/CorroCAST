import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { ThicknessDataPoint } from '../../types';

interface CorrosionRateChartProps {
  data: ThicknessDataPoint[];
  currentRate: number;
}

export const CorrosionRateChart: React.FC<CorrosionRateChartProps> = ({
  data,
  currentRate
}) => {
  return (
    <div className="p-5 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <span>Corrosion Rate Over Time</span>
            <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              mm/year
            </span>
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-500">
            Calculated rate with ±2σ statistical uncertainty band
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400"></span>
            <span className="text-slate-300 light:text-slate-700">Estimated Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-cyan-500/20 rounded-sm"></span>
            <span className="text-slate-400">Uncertainty Band</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rateBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              domain={[0, 'dataMax + 0.1']}
              tickFormatter={(v) => `${v.toFixed(2)}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ThicknessDataPoint;
                  return (
                    <div className="p-3 bg-industrial-950/95 border border-cyan-500/40 rounded-xl shadow-xl text-xs font-mono text-slate-200">
                      <p className="font-bold text-cyan-400 mb-1">{label}</p>
                      <p>Rate: <strong className="text-white">{pt.corrosionRate} mm/yr</strong></p>
                      <p className="text-slate-400 text-[11px]">
                        Uncertainty: [{pt.rateMinUncertainty} — {pt.rateMaxUncertainty}]
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0.15} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Warn: 0.15', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={0.25} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Crit: 0.25', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            
            {/* Uncertainty band */}
            <Area
              type="monotone"
              dataKey="rateMaxUncertainty"
              stroke="transparent"
              fill="url(#rateBand)"
            />
            <Area
              type="monotone"
              dataKey="rateMinUncertainty"
              stroke="transparent"
              fill="#0b1320"
            />
            {/* Real line */}
            <Area
              type="monotone"
              dataKey="corrosionRate"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="none"
              dot={{ r: 3, fill: '#06b6d4', stroke: '#070b12', strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
