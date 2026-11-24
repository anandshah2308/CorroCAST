import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity, Cpu, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/common/StatCard';
import { MachineCard } from '../components/machine/MachineCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const OverviewPage: React.FC = () => {
  const { machines } = useData();

  const total = machines.length;
  const safeCount = machines.filter(m => m.status === 'Safe').length;
  const warningCount = machines.filter(m => m.status === 'Warning').length;
  const criticalCount = machines.filter(m => m.status === 'Critical').length;

  return (
    <div className="space-y-6 pb-20">

      {/* Hero / System Status Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Real-Time Fleet Surveillance (Simulated)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            Industrial Corrosion Monitoring
          </h1>
          <p className="text-sm text-slate-400 light:text-slate-600 max-w-2xl mt-1">
            Autonomous electrochemical and ultrasonic diagnostics for carbon steel assets. CorroCAST detects anomalous degradation early and advises mitigation before wall loss breaches safe limits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono bg-industrial-900/90 light:bg-slate-100 p-2 rounded-xl border border-industrial-700/60 light:border-slate-300">
          <Activity size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-slate-300 light:text-slate-700">Telemetric Nodes: 6 Active</span>
        </div>
      </div>

      {/* Summary Cards Grid (Animated count-up) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Monitored Units"
          value={total}
          icon={Cpu}
          variant="neutral"
          subtext="Industrial Carbon Steel"
        />
        <StatCard
          label="Safe Baseline"
          value={safeCount}
          icon={ShieldCheck}
          variant="safe"
          subtext="Normal degradation rate"
        />
        <StatCard
          label="Warning State"
          value={warningCount}
          icon={AlertTriangle}
          variant="warning"
          subtext="Accelerated corrosion or drift"
        />
        <StatCard
          label="Critical Priority"
          value={criticalCount}
          icon={AlertOctagon}
          variant="critical"
          subtext="Wall thickness near limit"
          pulse={criticalCount > 0}
        />
      </div>

      {/* Machines Grid Header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-100 light:text-slate-900">
            Carbon Steel Machinery &amp; Pipelines
          </h2>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            6 Units
          </span>
        </div>
      </div>

      {/* Grid of Machine Cards (Staggered layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {machines.map((machine, index) => (
          <MachineCard key={machine.id} machine={machine} index={index} />
        ))}
      </div>
    </div>
  );
};
