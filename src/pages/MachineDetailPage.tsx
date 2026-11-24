import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  MapPin,
  Tag,
  Layers,
  Wrench,
  Radio,
  FileText
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { StatusBadge, CorrosionTypeBadge } from '../components/common/Badge';
import { SensorTile } from '../components/machine/SensorTile';
import { CorrosionRateChart } from '../components/machine/CorrosionRateChart';
import { ThicknessHistoryChart } from '../components/machine/ThicknessHistoryChart';
import { RemainingLifeGauge } from '../components/machine/RemainingLifeGauge';
import { CorrosionEvidenceCard } from '../components/machine/CorrosionEvidenceCard';
import { RecommendationPanel } from '../components/machine/RecommendationPanel';
import { VerifyLoopStepper } from '../components/machine/VerifyLoopStepper';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const MachineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMachineById } = useData();

  const machine = getMachineById(id || '');

  if (!machine) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-200">Machine Not Found</h2>
        <p className="text-slate-400">The requested equipment asset telemetry could not be retrieved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-industrial-950 font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Return to Fleet Overview</span>
        </Link>
      </div>
    );
  }

  const isCritical = machine.status === 'Critical';
  const isWarning = machine.status === 'Warning';

  return (
    <div className="space-y-6 pb-24">
      {/* Back button & Tag bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Fleet Overview</span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded bg-industrial-900 border border-industrial-700 text-cyan-400">
            {machine.tag}
          </span>
          <span>•</span>
          <span>{machine.material}</span>
        </div>
      </div>

      {/* Machine Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <MapPin size={13} className="text-cyan-400" />
            <span>{machine.location}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            {machine.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={machine.status} size="lg" showPulse={isCritical} />
          <CorrosionTypeBadge type={machine.likelyCorrosionType} />
        </div>
      </div>

      {/* Big Status Banner with Plain-Language Reason */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isCritical
            ? 'bg-red-950/30 border-red-500/50 text-red-200 critical-pulse'
            : isWarning
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              isCritical
                ? 'bg-red-500/20 text-red-400'
                : isWarning
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {isCritical ? (
              <AlertOctagon size={22} />
            ) : isWarning ? (
              <AlertTriangle size={22} />
            ) : (
              <ShieldCheck size={22} />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider">
                System Condition: {machine.status.toUpperCase()}
              </span>
              <span className="text-xs opacity-60">•</span>
              <span className="text-xs opacity-75 font-mono">Updated {machine.lastReadingTime}</span>
            </div>
            <p className="text-sm sm:text-base font-semibold leading-relaxed">
              {machine.statusReason}
            </p>
          </div>
        </div>
      </div>

      {/* Closed-Loop Verification Tracker Stepper */}
      <VerifyLoopStepper machine={machine} />

      {/* Live Sensor Tiles Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Radio size={18} className="text-cyan-400 animate-pulse" />
            <span>Live Telemetric Sensor Matrix</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {machine.sensors.length} Channels Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {machine.sensors.map((sensor) => (
            <SensorTile key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </div>

      {/* Charts & Analytics Row: Corrosion Rate + Thickness History + Remaining Life Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <RemainingLifeGauge
            currentThickness={machine.currentThickness}
            initialThickness={machine.initialThickness}
            minimumAllowedThickness={machine.minimumAllowedThickness}
            corrosionRate={machine.corrosionRate}
            remainingLifeMonths={machine.remainingLifeMonths}
          />
        </div>

        <div className="lg:col-span-2">
          <CorrosionRateChart
            data={machine.history}
            currentRate={machine.corrosionRate}
          />
        </div>
      </div>

      {/* Thickness History ER vs UT */}
      <div>
        <ThicknessHistoryChart
          data={machine.history}
          minimumAllowedThickness={machine.minimumAllowedThickness}
          initialThickness={machine.initialThickness}
        />
      </div>

      {/* Diagnosis Evidence & Prescriptive What To Do Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CorrosionEvidenceCard machine={machine} />
        <RecommendationPanel machine={machine} />
      </div>
    </div>
  );
};
