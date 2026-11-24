import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Activity,
  AlertTriangle,
  RotateCw,
  Wrench,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { Machine, VerifyStep } from '../../types';
import { useData } from '../../context/DataContext';

interface VerifyLoopStepperProps {
  machine: Machine;
}

export const VerifyLoopStepper: React.FC<VerifyLoopStepperProps> = ({ machine }) => {
  const { markMaintenanceDone, runSensorVerification, resetMachineToHealthy } = useData();
  const [isVerifying, setIsVerifying] = useState(false);

  const tracker = machine.verifyLoop;
  const isHealthy = machine.status === 'Safe';

  const steps: {
    key: VerifyStep;
    title: string;
    description: string;
    time?: string;
  }[] = [
    {
      key: 'alert_open',
      title: 'Alert Open',
      description: 'Sensor anomaly detected; alert dispatched to team.',
      time: tracker.openedAt ? new Date(tracker.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    },
    {
      key: 'maintenance_done',
      title: 'Maintenance Done',
      description: 'Human team executed recommended chemical / physical fix.',
      time: tracker.maintenanceDoneAt ? new Date(tracker.maintenanceDoneAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    },
    {
      key: 'verifying',
      title: 'Verify With Sensors',
      description: 'System checks continuous telemetry. If values fail, alert stays open.',
      time: tracker.verifiedAt ? new Date(tracker.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    },
    {
      key: 'resolved',
      title: 'Normal (Closed)',
      description: 'Telemetry verified within safe threshold. Alert closed.',
    },
  ];

  // Helper to determine step index
  const getStepIndex = (step: VerifyStep) => {
    switch (step) {
      case 'alert_open':
        return 0;
      case 'maintenance_done':
        return 1;
      case 'verifying':
        return 2;
      case 'resolved':
        return 3;
    }
  };

  const currentIndex = getStepIndex(tracker.step);

  const handleMarkMaintenanceDone = () => {
    markMaintenanceDone(machine.id);
  };

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      runSensorVerification(machine.id);
      setIsVerifying(false);
    }, 1200);
  };

  const handleFullResolve = () => {
    resetMachineToHealthy(machine.id);
  };

  return (
    <div className="p-5 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Activity size={17} className="text-cyan-400" />
            <span>Closed-Loop Verification Tracker</span>
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-500">
            Strict human-in-the-loop workflow: alert never closes unless sensors confirm safe values
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {tracker.step === 'alert_open' && (
            <button
              onClick={handleMarkMaintenanceDone}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-industrial-950 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Wrench size={14} />
              <span>Mark Maintenance Done</span>
            </button>
          )}

          {(tracker.step === 'maintenance_done' || tracker.step === 'verifying') && (
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all disabled:opacity-50"
            >
              <RotateCw size={14} className={isVerifying ? 'animate-spin' : ''} />
              <span>{isVerifying ? 'Scanning Sensors...' : 'Verify With Sensors'}</span>
            </button>
          )}

          {!isHealthy && (
            <button
              onClick={handleFullResolve}
              title="Reset all sensors to safe baseline to close verify loop"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Apply Fix & Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Stepper Visual Horizontal */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-4">
        {steps.map((st, idx) => {
          const isDone = currentIndex > idx || (tracker.step === 'resolved');
          const isCurrent = tracker.step === st.key && tracker.step !== 'resolved';

          return (
            <div
              key={st.key}
              className={`relative p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 light:bg-emerald-50 light:border-emerald-200'
                  : isCurrent
                  ? 'bg-cyan-950/30 border-cyan-400 shadow-md shadow-cyan-500/10'
                  : 'bg-industrial-950/40 border-industrial-800 light:bg-slate-50 light:border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-slate-400">Step 0{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 size={15} className="text-emerald-400" />
                ) : isCurrent ? (
                  <Clock size={15} className="text-cyan-400 animate-pulse" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-200 light:text-slate-800">
                {st.title}
              </h4>
              <p className="text-[11px] text-slate-400 light:text-slate-600 mt-1 leading-snug">
                {st.description}
              </p>

              {st.time && (
                <div className="mt-2 text-[10px] font-mono text-cyan-400/80">
                  {st.time}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Warning Note if sensor values fail return to normal */}
      {tracker.step === 'verifying' && !isHealthy && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-300">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" />
          <div>
            <strong>Sensors Did Not Return To Normal:</strong> The maintenance action was logged, but live ultrasonic or chemical readings remain anomalous. As required, <strong>the alert stays open</strong> until physical parameters normalize. Click &quot;Apply Fix &amp; Reset&quot; or re-execute treatment.
          </div>
        </div>
      )}
    </div>
  );
};
