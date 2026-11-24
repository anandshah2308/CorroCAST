import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Rocket,
  ShieldCheck,
  Cpu,
  Atom,
  FlaskConical,
  Binary,
  Briefcase
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const subjects = [
    {
      title: 'Physics',
      icon: Atom,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      desc: 'Piezoelectric wave propagation in ultrasonic transducers (UT), fluid velocity Reynolds dynamics, and thermal expansion.',
    },
    {
      title: 'Chemistry',
      icon: FlaskConical,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      desc: 'Nernst equation electrochemistry, anodic iron oxidation (Fe → Fe²⁺ + 2e⁻), chloride autocatalysis, and inhibitor passivation.',
    },
    {
      title: 'Electronics',
      icon: Cpu,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      desc: 'Zero Resistance Ammetry (ZRA), Wheatstone bridge resistance measurements (ER probes), signal filtering, and ultra-low-power sleep nodes.',
    },
    {
      title: 'Digital Logic',
      icon: Binary,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      desc: 'State machines for closed-loop verification, binary comparator threshold logic, interrupt handling, and discrete anomaly gating.',
    },
    {
      title: 'Management',
      icon: Briefcase,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      desc: 'Decision Support System (DSS) workflow design, human-in-the-loop responsibility policies, and API 570 risk-based inspection.',
    },
  ];

  const futureScopeItems = [
    {
      title: 'Predictive Remaining-Life AI (LSTM / Deep Neural Nets)',
      desc: 'Continuous real-time training on multi-year industrial datasets to forecast exact degradation curves under cyclic seasonal swings.',
    },
    {
      title: 'Automated Computer Vision Flange & Surface Inspection',
      desc: 'Drones or fixed optical micro-cameras scanning external thermal insulation for rust bleeding and coating blistering.',
    },
    {
      title: 'Interactive 3D Digital Twin Integration',
      desc: 'Full 3D WebGL / CAD model of the facility highlighting heat maps of wall loss and pitting clusters in real space.',
    },
    {
      title: 'Automatic SAP / CMMS Work Order Dispatch',
      desc: 'Zero-touch generation of maintenance work orders with pre-filled parts lists (gaskets, inhibitors, dielectric sleeves).',
    },
    {
      title: 'Expanded Metallurgy: Stainless & Marine Alloys',
      desc: 'Extending models to 316L, duplex steels, titanium heat exchangers, and subsea pipelines.',
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
          <GraduationCap size={14} />
          <span>Industrial Corrosion Monitoring System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
          About CorroCAST
        </h1>
        <p className="text-sm text-slate-400 light:text-slate-600 max-w-3xl mt-1">
          An interdisciplinary AI/ML industrial monitoring system engineered to safeguard carbon steel machinery, piping, and pressure vessels from catastrophic degradation failures.
        </p>
      </div>

      {/* Executive Summary Card */}
      <div className="p-6 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
        <h2 className="text-base font-bold text-slate-100 light:text-slate-900 mb-2">
          Project Mission &amp; Purpose
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 light:text-slate-700 leading-relaxed mb-4">
          Industrial piping, boiler tubes, and storage tanks operate under severe mechanical and chemical stress. Undetected corrosion leads to environmental spills, factory shutdowns, and catastrophic explosions. CorroCAST bridges academic theory and heavy industrial practice by combining real-time multi-sensor telemetry with intelligent diagnostic inference to alert plant personnel before safety margins are breached.
        </p>

        <div className="p-3 rounded-xl bg-industrial-950/70 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-300">
          <ShieldCheck size={20} className="shrink-0 text-cyan-400" />
          <span>
            <strong>Human-in-the-Loop Core Tenet:</strong> CorroCAST acts exclusively as an advisory Decision Support System (DSS). It diagnoses and recommends; physical repair, valve adjustments, and plant interventions are executed by qualified maintenance engineers.
          </span>
        </div>
      </div>

      {/* Subjects Integrated Section */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 light:text-slate-900 mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-cyan-400" />
          <span>Interdisciplinary Curriculum Integration</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.title}
                className="p-4 rounded-xl bg-industrial-900/80 border border-industrial-700/60 light:bg-white light:border-slate-200"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg border ${sub.bg} ${sub.color}`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 light:text-slate-800">
                    {sub.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                  {sub.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Scope Roadmap Section */}
      <div className="p-6 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-100 light:text-slate-900 mb-2 flex items-center gap-2">
          <Rocket size={18} className="text-cyan-400" />
          <span>Future Scope &amp; Industrial Expansion Roadmap</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mb-4">
          Planned extensions for subsequent developmental iterations and industry pilot deployments:
        </p>

        <div className="space-y-3">
          {futureScopeItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-industrial-950/60 border border-industrial-800 light:bg-slate-50 light:border-slate-200 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-200 light:text-slate-800">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
