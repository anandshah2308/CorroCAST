import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Zap,
  Droplets,
  Search
} from 'lucide-react';
import { Machine, CorrosionType } from '../../types';

interface CorrosionEvidenceCardProps {
  machine: Machine;
}

export const CorrosionEvidenceCard: React.FC<CorrosionEvidenceCardProps> = ({ machine }) => {
  const galv = machine.sensors.find(s => s.type === 'galvanic')?.value ?? 0;
  const chloride = machine.sensors.find(s => s.type === 'chloride')?.value ?? 0;
  const flow = machine.sensors.find(s => s.type === 'flow')?.value ?? 10;
  const tow = machine.sensors.find(s => s.type === 'wetness')?.value ?? 0;
  const er = machine.sensors.find(s => s.type === 'er_loss')?.value ?? 0.5;
  const ut = machine.sensors.find(s => s.type === 'ut_thickness')?.value ?? machine.currentThickness;

  const utThicknessDrop = machine.initialThickness - ut;

  // Criteria evaluations
  const pittingMatched = chloride > 160 || (utThicknessDrop > er * 1.25 && chloride > 100);
  const galvanicMatched = galv > 10.0;
  const creviceMatched = flow < 1.0 && tow > 65;
  const uniformMatched = !pittingMatched && !galvanicMatched && !creviceMatched && machine.corrosionRate > 0.04;

  const typesList: {
    type: CorrosionType;
    name: string;
    description: string;
    isMatched: boolean;
    evidenceText: string;
    icon: React.ElementType;
    signals: string[];
  }[] = [
    {
      type: 'Uniform',
      name: 'Uniform Corrosion',
      description: 'Steady, even thinning across surface without localized pit holes.',
      isMatched: uniformMatched || machine.likelyCorrosionType === 'Uniform',
      evidenceText: 'Steady thickness loss with no strong chloride breach or galvanic bias.',
      icon: Layers,
      signals: [
        `General metal loss: ${er.toFixed(2)} mm`,
        `Chloride nominal: ${chloride} ppm`,
        `Galvanic bias nominal: ${galv.toFixed(1)} µA/cm²`,
      ],
    },
    {
      type: 'Pitting',
      name: 'Pitting Corrosion',
      description: 'Autocatalytic localized pinhole attack penetrating deep into wall.',
      isMatched: pittingMatched || machine.likelyCorrosionType === 'Pitting',
      evidenceText: 'High chloride and UT ultrasonic thinning faster than ER general rate.',
      icon: Search,
      signals: [
        `Chloride level: ${chloride} ppm (Threshold: >150 ppm)`,
        `UT localized thinning: ${(machine.initialThickness - ut).toFixed(2)} mm`,
        `ER vs UT differential: local depth outstripping general probe`,
      ],
    },
    {
      type: 'Galvanic',
      name: 'Galvanic Attack',
      description: 'Electrochemical potential gradient between dissimilar metal interfaces.',
      isMatched: galvanicMatched || machine.likelyCorrosionType === 'Galvanic',
      evidenceText: 'Significant galvanic current detected across junction.',
      icon: Zap,
      signals: [
        `Galvanic current: ${galv.toFixed(1)} µA/cm² (Threshold: >10.0 µA/cm²)`,
        `Coupled dissimilar metals present (e.g. Carbon Steel to Brass / Bronze)`,
        `Accelerated anode consumption at boundary`,
      ],
    },
    {
      type: 'Crevice',
      name: 'Crevice Corrosion',
      description: 'Oxygen starvation & ion trapping within micro-shielded narrow gaps.',
      isMatched: creviceMatched || machine.likelyCorrosionType === 'Crevice',
      evidenceText: 'Flow near zero and prolonged time of wetness in confined area.',
      icon: Droplets,
      signals: [
        `Local fluid velocity: ${flow.toFixed(1)} L/min (Stagnant < 1.0)`,
        `Time of wetness (TOW): ${tow.toFixed(0)}% (Elevated > 65%)`,
        `Occurs under gaskets, threaded flanges, or scale deposits`,
      ],
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Sparkles size={17} className="text-cyan-400" />
            <span>AI/ML Likely Corrosion Type & Evidence</span>
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-500">
            Multi-sensor diagnostic inference matching industrial failure modes
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          <span>Match:</span>
          <strong className="text-white">
            {machine.likelyCorrosionType === 'None' ? 'Nominal / No Attack' : machine.likelyCorrosionType}
          </strong>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {typesList.map((item) => {
          const Icon = item.icon;
          const isActive = machine.likelyCorrosionType === item.type;

          return (
            <div
              key={item.type}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-500/10'
                  : 'border-industrial-800 bg-industrial-950/50 light:bg-slate-50 light:border-slate-200 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 light:text-slate-800">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">
                      {item.description}
                    </span>
                  </div>
                </div>

                {isActive ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40 shrink-0">
                    <CheckCircle2 size={12} />
                    <span>DIAGNOSED</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    Inactive
                  </span>
                )}
              </div>

              {/* Sensor signals bullet list */}
              <div className="mt-2.5 pt-2 border-t border-industrial-800/80 light:border-slate-200 space-y-1">
                {item.signals.map((sig, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 light:text-slate-600">
                    <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-slate-500'}`} />
                    <span className="font-mono text-[10px]">{sig}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
