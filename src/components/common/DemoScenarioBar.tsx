import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Zap,
  Droplets,
  CheckCircle,
  XCircle,
  X,
  Clock,
  Play
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DemoScenario } from '../../types';

interface DemoScenarioBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoScenarioModal: React.FC<DemoScenarioBarProps> = ({ isOpen, onClose }) => {
  const {
    demoState,
    machines,
    triggerDemoScenario,
    stopDemoScenario,
    resetMachineToHealthy
  } = useData();

  const [selectedMachineId, setSelectedMachineId] = useState<string>('m-1');

  const scenarios: {
    id: DemoScenario;
    name: string;
    icon: React.ElementType;
    badge: string;
    color: string;
    desc: string;
  }[] = [
    {
      id: 'Normal',
      name: 'Normal Baseline',
      icon: CheckCircle,
      badge: 'Safe Baseline',
      color: 'emerald',
      desc: 'Resets telemetry to nominal bounds with high remaining useful life.',
    },
    {
      id: 'Developing Pitting',
      name: 'Pitting Attack',
      icon: AlertTriangle,
      badge: 'Chloride Breach',
      color: 'rose',
      desc: 'Chloride climbs >200 ppm; localized ultrasonic thinning outpaces ER probe.',
    },
    {
      id: 'Galvanic Problem',
      name: 'Galvanic Problem',
      icon: Zap,
      badge: 'Dissimilar Metals',
      color: 'purple',
      desc: 'Galvanic current surges to 22 µA/cm² across dissimilar metal joint.',
    },
    {
      id: 'Stagnant Crevice',
      name: 'Stagnant Crevice',
      icon: Droplets,
      badge: 'Low Flow / TOW',
      color: 'amber',
      desc: 'Water flow drops near 0 L/min while wetness hits 95% in narrow gap.',
    },
    {
      id: 'Sensor Failure',
      name: 'Sensor Failure',
      icon: XCircle,
      badge: 'Telemetry Fault',
      color: 'blue',
      desc: 'UT transducer fails (-99.9); flags sensor fault, not false corrosion.',
    },
  ];

  const handleStart = (sc: DemoScenario) => {
    triggerDemoScenario(sc, selectedMachineId);
  };

  const handleResetTarget = () => {
    stopDemoScenario();
    resetMachineToHealthy(selectedMachineId);
  };

  if (!isOpen && !demoState.active) {
    return null;
  }

  // If closed but scenario is actively running, show a thin non-obstructive top progress indicator
  if (!isOpen && demoState.active) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-industrial-950/95 border-b border-cyan-500/50 py-1.5 px-4 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-cyan-300">
              Demo Running: <strong>{demoState.scenario}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className={`font-mono uppercase font-bold ${
              demoState.phase === 'Critical' ? 'text-red-400' :
              demoState.phase === 'Warning' ? 'text-amber-400' :
              demoState.phase === 'Fault' ? 'text-blue-400' : 'text-emerald-400'
            }`}>
              {demoState.phase} ({demoState.stepProgress}%)
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              ({demoState.secondsRemaining}s left)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => stopDemoScenario()}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              Stop Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-industrial-900 border border-cyan-500/50 rounded-2xl shadow-2xl max-w-2xl w-full p-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-industrial-700/60 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Presentation Demo Scenarios</span>
                {demoState.active && (
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/40">
                    {demoState.secondsRemaining}s remaining
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Simulate a chosen machine transitioning (Safe → Warning → Critical) over ~20s.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-industrial-800 hover:bg-industrial-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Target Machine Selection Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-industrial-950/70 border border-industrial-800 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Target Asset:</span>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              disabled={demoState.active}
              className="bg-industrial-800 border border-industrial-600 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-400 disabled:opacity-50"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.tag})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResetTarget}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Target Machine</span>
          </button>
        </div>

        {/* Active Progress Bar */}
        {demoState.active && (
          <div className="mb-4 p-3 rounded-xl bg-industrial-950 border border-cyan-500/30">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>
                Running: <strong className="text-cyan-400">{demoState.scenario}</strong>
              </span>
              <span className={`uppercase font-bold ${
                demoState.phase === 'Critical' ? 'text-red-400' :
                demoState.phase === 'Warning' ? 'text-amber-400' :
                demoState.phase === 'Fault' ? 'text-blue-400' : 'text-emerald-400'
              }`}>
                Phase: {demoState.phase} ({demoState.stepProgress}%)
              </span>
            </div>
            <div className="w-full h-2 bg-industrial-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  demoState.phase === 'Critical' ? 'bg-red-500' :
                  demoState.phase === 'Warning' ? 'bg-amber-400' :
                  demoState.phase === 'Fault' ? 'bg-blue-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${demoState.stepProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scenarios Grid */}
        <div className="space-y-2.5">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isCurrent = demoState.active && demoState.scenario === sc.id;

            return (
              <button
                key={sc.id}
                onClick={() => handleStart(sc.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-950/80 shadow-md shadow-cyan-500/20'
                    : 'border-industrial-700 bg-industrial-850 hover:bg-industrial-800 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-industrial-900 border border-industrial-700 mt-0.5">
                    <Icon size={16} className={`${
                      sc.id === 'Developing Pitting' ? 'text-rose-400' :
                      sc.id === 'Galvanic Problem' ? 'text-purple-400' :
                      sc.id === 'Stagnant Crevice' ? 'text-amber-400' :
                      sc.id === 'Sensor Failure' ? 'text-blue-400' : 'text-emerald-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-100">
                        {sc.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-industrial-900 text-slate-400 border border-industrial-700">
                        {sc.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {sc.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  {isCurrent ? (
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                      RUNNING
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                      <Play size={12} /> Launch
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-industrial-800 flex items-center justify-between text-xs text-slate-400">
          <span>Click any scenario to see telemetry and alerts react live.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-industrial-950 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
