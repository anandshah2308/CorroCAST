import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { ThicknessDataPoint } from '../../types';

interface ThicknessHistoryChartProps {
  data: ThicknessDataPoint[];
  minimumAllowedThickness: number;
  initialThickness: number;
}

export const ThicknessHistoryChart: React.FC<ThicknessHistoryChartProps> = ({
  data,
  minimumAllowedThickness,
  initialThickness
}) => {
  return (
    <div className="p-5 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <span>Wall Thickness Degradation History</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              ER vs UT
            </span>
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-500">
            Comparison between general Electrical Resistance (ER) loss and Ultrasonic (UT) wall thickness
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400"></span>
            <span className="text-slate-300 light:text-slate-700">UT Transducer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400"></span>
            <span className="text-slate-300 light:text-slate-700">ER Element</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-400 border-t border-dashed border-red-400"></span>
            <span className="text-red-400 font-bold">t_min Limit</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              domain={[Math.floor(minimumAllowedThickness - 1), Math.ceil(initialThickness + 0.5)]}
              tickFormatter={(v) => `${v.toFixed(1)}mm`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ThicknessDataPoint;
                  return (
                    <div className="p-3 bg-industrial-950/95 border border-cyan-500/40 rounded-xl shadow-xl text-xs font-mono text-slate-200">
                      <p className="font-bold text-cyan-400 mb-1">{label}</p>
                      <p className="flex justify-between gap-4">
                        <span className="text-cyan-300">UT Thickness:</span>
                        <strong className="text-white">{pt.utThickness.toFixed(2)} mm</strong>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span className="text-emerald-300">ER Thickness:</span>
                        <strong className="text-white">{pt.erThickness.toFixed(2)} mm</strong>
                      </p>
                      <p className="flex justify-between gap-4 text-red-400">
                        <span>Safe Limit (t_min):</span>
                        <strong>{minimumAllowedThickness.toFixed(2)} mm</strong>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={minimumAllowedThickness}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Critical Min t_min: ${minimumAllowedThickness.toFixed(2)}mm`,
                fill: '#ef4444',
                fontSize: 10,
                position: 'insideBottomRight'
              }}
            />
            <Line
              type="monotone"
              dataKey="utThickness"
              stroke="#06b6d4"
              strokeWidth={2.5}
              name="UT Thickness"
              dot={{ r: 3, fill: '#06b6d4' }}
            />
            <Line
              type="monotone"
              dataKey="erThickness"
              stroke="#10b981"
              strokeWidth={2}
              name="ER Thickness"
              dot={{ r: 2.5, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
