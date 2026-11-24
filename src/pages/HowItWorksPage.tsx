import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Radio,
  Database,
  BrainCircuit,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BatteryCharging,
  Layers,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const HowItWorksPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const pipelineSteps = [
    {
      id: 0,
      title: 'Sensors',
      subtitle: 'Physical Transducers',
      icon: Radio,
      desc: 'PT100 RTDs, SHT31 humidity, YF-S201 flow turbines, ZRA galvanic electrodes, ER metal loss elements, and ultrasonic UT transducers measure wall physics.',
      tag: 'Hardware Sensing',
    },
    {
      id: 1,
      title: 'ESP32 Node',
      subtitle: 'Edge Microcontroller',
      icon: Cpu,
      desc: 'Low-power ESP32 edge MCU digitizes analog sensor signals via ADC & I2C. Samples every 10–60 mins (since corrosion is slow) and enters deep sleep to preserve battery.',
      tag: 'Edge Processing',
    },
    {
      id: 2,
      title: 'Gateway',
      subtitle: 'Industrial Uplink',
      icon: Radio,
      desc: 'Transmits encrypted telemetry packets over MQTT / LoRaWAN / Cellular to the central industrial aggregation broker without local site data loss.',
      tag: 'Telemetry Transit',
    },
    {
      id: 3,
      title: 'Database',
      subtitle: 'Time-Series Store',
      icon: Database,
      desc: 'Ingests high-fidelity time-series telemetry into InfluxDB / PostgreSQL with historical rollups and uncertainty band tracking.',
      tag: 'Persistent Storage',
    },
    {
      id: 4,
      title: 'ML Model',
      subtitle: 'AI Inference Engine',
      icon: BrainCircuit,
      desc: 'Multivariate ML classification correlates electrochemical transients with ultrasonic loss gradients to detect anomaly patterns.',
      tag: 'Pattern Recognition',
    },
    {
      id: 5,
      title: 'Classification',
      subtitle: 'Safe / Warn / Critical',
      icon: AlertTriangle,
      desc: 'Evaluates thickness loss against ASME/API t_min thresholds. Dispatches immediate notifications on Warning or Critical states.',
      tag: 'Severity Scoring',
    },
    {
      id: 6,
      title: 'Corrosion Type',
      subtitle: 'Failure Mode Diagnosis',
      icon: Sparkles,
      desc: 'Isolates Uniform vs. Pitting vs. Galvanic vs. Crevice based on galvanic density, chloride concentration, and flow stagnation signatures.',
      tag: 'Root-Cause ID',
    },
    {
      id: 7,
      title: 'Treatment',
      subtitle: 'Prescriptive Steps',
      icon: Wrench,
      desc: 'Generates plain-language action protocols: dielectric isolation, chemical flushing, inhibitor dosing, or coating application.',
      tag: 'Decision Support',
    },
    {
      id: 8,
      title: 'Verify',
      subtitle: 'Sensor Validation',
      icon: RotateCcw,
      desc: 'Strict closed-loop validation: human team executes remediation; ticket remains open until sensors re-verify normal baselines.',
      tag: 'Loop Closure',
    },
    {
      id: 9,
      title: 'Prevent',
      subtitle: 'Asset Life Extension',
      icon: ShieldCheck,
      desc: 'Prevents catastrophic rupture, leaks, and unplanned emergency shutdown, extending carbon steel machinery service life by years.',
      tag: 'Asset Protection',
    },
  ];

  // Auto-progression runner
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying, pipelineSteps.length]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Cpu size={14} />
            <span>End-to-End Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            How CorroCAST Operates
          </h1>
          <p className="text-sm text-slate-400 light:text-slate-600 max-w-2xl mt-1">
            From physical transducers on carbon steel pipelines to ML inference and closed-loop maintenance validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-industrial-900 border border-industrial-700 text-xs font-mono text-cyan-300 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause Flow' : 'Auto Play Flow'}</span>
          </button>
        </div>
      </div>

      {/* Flow Diagram Stepper (Interactive 10-node pipeline) */}
      <div className="p-6 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>10-Stage Autonomous Surveillance Cycle</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Step {activeStep + 1} of {pipelineSteps.length}
          </span>
        </div>

        {/* Horizontal Node Flow Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-6">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.id;
            const isPassed = activeStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStep(step.id);
                  setIsPlaying(false);
                }}
                className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-950/80 shadow-lg shadow-cyan-500/20 scale-105 z-10'
                    : isPassed
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                    : 'border-industrial-800 bg-industrial-950/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mb-1.5 ${
                    isCurrent
                      ? 'bg-cyan-500 text-industrial-950 font-bold'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span className="text-[11px] font-bold truncate w-full">
                  {step.title}
                </span>
                <span className="text-[9px] font-mono text-slate-400 truncate w-full">
                  {step.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Panel */}
        <div className="p-5 rounded-xl bg-industrial-950 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 0{pipelineSteps[activeStep].id + 1} — {pipelineSteps[activeStep].subtitle}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {pipelineSteps[activeStep].tag}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {pipelineSteps[activeStep].title}: Detailed Function
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {pipelineSteps[activeStep].desc}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => setActiveStep((prev) => (prev - 1 + pipelineSteps.length) % pipelineSteps.length)}
              className="px-3 py-1.5 rounded-lg bg-industrial-800 hover:bg-industrial-700 text-xs text-slate-300"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev + 1) % pipelineSteps.length)}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-industrial-950"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Operational Technical Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Duty Cycle & Sleep Note */}
        <div className="p-5 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-2.5 mb-2 text-cyan-400 font-bold text-sm">
            <Clock size={18} />
            <span>Telemetry Frequency &amp; Deep-Sleep Strategy</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 light:text-slate-700 leading-relaxed">
            Industrial metal corrosion is a gradual electrochemical phenomenon measured in millimeters per year. Reading sensors continuously would drain edge node batteries within days. CorroCAST nodes wake every <strong>10 to 60 minutes</strong>, take synchronized ultrasonic and resistive readings, transmit them, and immediately enter deep sleep (&lt;15 µA). 
          </p>
          <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 font-medium">
            <strong>Instant Interrupt:</strong> If any reading crosses Warning or Critical limits, the edge node bypasses normal sleep cadence and immediately pushes high-priority alarm dispatches.
          </div>
        </div>

        {/* Metallurgy & Scope Note */}
        <div className="p-5 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-2.5 mb-2 text-emerald-400 font-bold text-sm">
            <Layers size={18} />
            <span>Metallurgical Scope: Carbon Steel Focus</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 light:text-slate-700 leading-relaxed">
            CorroCAST is calibrated for <strong>carbon steel (ASTM A106, A516-70, AISI 1018)</strong>, the predominant structural material across petrochemical transport, steam boiler pipes, and pressure containment vessels. 
          </p>
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
            <strong>Extensibility:</strong> Support for stainless steels (304/316L), duplex alloys, and copper-nickel piping can be seamlessly added by recalibrating galvanic limits and retraining the ML model weights.
          </div>
        </div>
      </div>
    </div>
  );
};
