import React, { useState } from 'react';
import {
  Layers,
  Search,
  Zap,
  Droplets,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Activity,
  Cpu,
  Info
} from 'lucide-react';
import { CorrosionType } from '../types';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const CorrosionGuidePage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('pitting');

  const guideCards = [
    {
      id: 'uniform',
      type: 'Uniform' as CorrosionType,
      name: 'Uniform Corrosion',
      subtitle: 'General Surface Loss',
      badge: 'Even Degradation',
      summary: 'Evenly distributed electrochemical metal consumption across the entire exposed carbon steel surface.',
      cause: 'Continuous exposure to atmospheric moisture, acidic condensates, or oxygen dissolved in flowing fluids without localized micro-galvanic shields.',
      sensors: [
        'Electrical Resistance (ER) probe (steady linear increase in resistance)',
        'Dual-element Ultrasonic Transducer (UT) measuring homogeneous wall thinning',
        'pH probe (identifying acidic condensation shifts below 6.8)',
      ],
      treatment: [
        'Apply high-durability epoxy mastic or polyurethane protective barrier coats.',
        'Continuous chemical dosage of film-forming corrosion inhibitors.',
        'Electrolyte neutralisation / pH correction through neutralizing amines.',
      ],
      svgDiagram: (
        <svg viewBox="0 0 200 80" className="w-full h-24 rounded-lg bg-industrial-950 p-2">
          {/* Steel Plate */}
          <rect x="10" y="35" width="180" height="35" fill="#334155" rx="3" />
          <text x="100" y="58" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Carbon Steel Substrate</text>
          {/* Uniform corroded layer */}
          <line x1="10" y1="35" x2="190" y2="35" stroke="#f59e0b" strokeWidth="4" strokeDasharray="3 2" />
          {/* Electrolyte */}
          <text x="100" y="20" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Uniform Electrolyte Exposure</text>
        </svg>
      ),
    },
    {
      id: 'pitting',
      type: 'Pitting' as CorrosionType,
      name: 'Pitting Corrosion',
      subtitle: 'Localized Deep Cavity Penetration',
      badge: 'High Hazard Severity',
      summary: 'Extremely localized autocatalytic breakdown of the passive film, resulting in deep cavity pits that outstrip general metal loss.',
      cause: 'Halogen ion ingress (specifically Chloride Cl⁻ and Bromide) in stagnant or semi-stagnant zones, breaking through passivation films.',
      sensors: [
        'Ion-Selective Electrode (ISE) Chloride Probe (elevated Cl⁻ > 150-200 ppm)',
        'Ultrasonic (UT) A-scan / B-scan showing high localized depth thinning',
        'ER Probe differential (UT depth loss sharply outstrips general ER rate)',
      ],
      treatment: [
        'Purge system with fresh demineralized water to reduce chloride below 50 ppm.',
        'Passivation treatment using sodium nitrite or organo-phosphate formulations.',
        'Local weld buttering or ceramic-filled epoxy pit repair before pinhole puncture occurs.',
      ],
      svgDiagram: (
        <svg viewBox="0 0 200 80" className="w-full h-24 rounded-lg bg-industrial-950 p-2">
          <rect x="10" y="35" width="180" height="35" fill="#334155" rx="3" />
          {/* Pit cavity */}
          <path d="M 85 35 Q 100 62 115 35" fill="#ef4444" opacity="0.8" />
          <text x="100" y="22" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Cl⁻ Local Pinhole Attack</text>
          <text x="100" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Deep Localized Cavity</text>
        </svg>
      ),
    },
    {
      id: 'galvanic',
      type: 'Galvanic' as CorrosionType,
      name: 'Galvanic Corrosion',
      subtitle: 'Bimetallic Electrochemical Couple',
      badge: 'Dissimilar Metals',
      summary: 'Accelerated corrosion occurring when carbon steel is in direct electrical contact with a more noble metal in the presence of an electrolyte.',
      cause: 'Coupling carbon steel to noble materials like brass, copper, or stainless steel without dielectric insulation; carbon steel acts as sacrificial anode.',
      sensors: [
        'Zero Resistance Ammetry (ZRA) sensor measuring galvanic galvanic current density (>10 µA/cm²)',
        'High-temperature PT100 RTD (temperature accelerates galvanic kinetics)',
        'Conductivity probe (higher electrolyte conductivity multiplies galvanic current)',
      ],
      treatment: [
        'Insert dielectric insulation flange kits (neoprene / PTFE gaskets, mylar bolt sleeves).',
        'Install sacrificial zinc or aluminum anodes to cathodically protect the carbon steel.',
        'Apply non-conductive sealant coatings across the interface boundary.',
      ],
      svgDiagram: (
        <svg viewBox="0 0 200 80" className="w-full h-24 rounded-lg bg-industrial-950 p-2">
          {/* Anode (Carbon steel) */}
          <rect x="15" y="35" width="80" height="35" fill="#334155" rx="2" />
          <text x="55" y="58" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Carbon Steel (Anode)</text>
          {/* Cathode (Brass) */}
          <rect x="105" y="35" width="80" height="35" fill="#d97706" rx="2" />
          <text x="145" y="58" fill="#fef3c7" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Brass (Cathode)</text>
          {/* Electron flow */}
          <path d="M 55 25 L 145 25" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="100" y="18" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Current Density (µA/cm²)</text>
        </svg>
      ),
    },
    {
      id: 'crevice',
      type: 'Crevice' as CorrosionType,
      name: 'Crevice Corrosion',
      subtitle: 'Oxygen-Depleted Shielded Gaps',
      badge: 'Microclimate Retention',
      summary: 'Severe localized degradation within narrow gaps, flange seats, or beneath scale where fluid circulation is impeded.',
      cause: 'Differential aeration cells: oxygen inside the narrow gap is rapidly consumed, creating an acidic, concentrated chloride microclimate.',
      sensors: [
        'Fluid flow sensor (YF-S201) detecting zero velocity / dead-leg zones (< 0.5 L/min)',
        'Time of Wetness (TOW) resistive sensor (> 70-90% continuous moisture saturation)',
        'High-resolution localized ultrasonic thickness scanning',
      ],
      treatment: [
        'Re-engineer piping geometry to eliminate dead legs and stagnant low-flow traps.',
        'Disassemble bolted flanges and reseal using flexible, non-absorbent elastomeric gaskets.',
        'Continuous fluid flushing to maintain velocity above 1.5 m/s.',
      ],
      svgDiagram: (
        <svg viewBox="0 0 200 80" className="w-full h-24 rounded-lg bg-industrial-950 p-2">
          <rect x="20" y="30" width="160" height="15" fill="#334155" />
          <rect x="20" y="55" width="160" height="15" fill="#334155" />
          {/* Micro gap */}
          <rect x="20" y="45" width="160" height="10" fill="#f59e0b" opacity="0.3" />
          <text x="100" y="52" fill="#f59e0b" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Stagnant Micro-Gap (Low O₂)</text>
          <text x="100" y="20" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Flow = 0 L/min, TOW = 95%</text>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
          <Info size={14} />
          <span>Mechanistic Knowledge Base</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
          Corrosion Engineering Guide
        </h1>
        <p className="text-sm text-slate-400 light:text-slate-600 max-w-3xl mt-1">
          Reference documentation for industrial carbon steel degradation types. CorroCAST correlates multi-sensor physics to isolate these four primary failure modes (and is architected to support additional metallurgical modes).
        </p>
      </div>

      {/* Grid of Interactive Explorable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guideCards.map((card) => {
          const isExpanded = expandedId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-2xl border transition-all duration-300 p-5 ${
                isExpanded
                  ? 'bg-industrial-900 border-cyan-500/50 shadow-xl shadow-cyan-500/5'
                  : 'bg-industrial-900/80 border-industrial-700/60 hover:border-slate-500'
              } light:bg-white light:border-slate-200`}
            >
              {/* Top Banner */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {card.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 light:text-slate-900 mt-1.5">
                    {card.name}
                  </h3>
                  <span className="text-xs text-slate-400 light:text-slate-500">
                    {card.subtitle}
                  </span>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : card.id)}
                  className="p-1.5 rounded-lg bg-industrial-800 hover:bg-industrial-700 text-slate-300 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Schematic SVG Diagram Placeholder Area */}
              <div className="my-3 border border-industrial-800 rounded-xl overflow-hidden">
                {card.svgDiagram}
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-300 light:text-slate-700 leading-relaxed mb-3">
                {card.summary}
              </p>

              {/* Expandable Deep Dive */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-industrial-800 space-y-4 text-xs">
                  {/* Root Cause */}
                  <div>
                    <h4 className="font-semibold text-cyan-300 font-mono uppercase tracking-wider mb-1">
                      Physicochemical Root Cause
                    </h4>
                    <p className="text-slate-300 light:text-slate-600 leading-relaxed">
                      {card.cause}
                    </p>
                  </div>

                  {/* Detection Sensor Suite */}
                  <div>
                    <h4 className="font-semibold text-emerald-400 font-mono uppercase tracking-wider mb-1.5">
                      CorroCAST Detection Sensors
                    </h4>
                    <ul className="space-y-1">
                      {card.sensors.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300 light:text-slate-600">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention & Treatment */}
                  <div>
                    <h4 className="font-semibold text-amber-400 font-mono uppercase tracking-wider mb-1.5">
                      Prescriptive Mitigation &amp; Treatment
                    </h4>
                    <ul className="space-y-1">
                      {card.treatment.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300 light:text-slate-600">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Toggle footer */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : card.id)}
                className="mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>{isExpanded ? 'Show Less' : 'Explore Detection & Treatment'}</span>
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Scope Footer Note */}
      <div className="p-4 rounded-xl bg-industrial-950/60 border border-industrial-800 text-xs text-slate-400 flex items-center justify-between">
        <span>Note: Above four types represent core carbon steel modes. System architecture is modular for alloy additions.</span>
        <span className="font-mono text-cyan-400">NACE / ISO 8044 Compliant</span>
      </div>
    </div>
  );
};
