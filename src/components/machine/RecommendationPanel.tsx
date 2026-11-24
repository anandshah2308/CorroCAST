import React from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  ShieldCheck,
  Zap,
  Droplets,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Machine, MachineStatus, CorrosionType } from '../../types';

interface RecommendationPanelProps {
  machine: Machine;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ machine }) => {
  const { status, likelyCorrosionType } = machine;

  // Prescriptive engineering recommendations mapping
  const getActionPlan = (type: CorrosionType, level: MachineStatus) => {
    switch (type) {
      case 'Uniform':
        return {
          title: 'Uniform Thinning Mitigation Plan',
          steps: [
            'Apply or recondition protective epoxy / polyurethane barrier coating.',
            'Inject film-forming corrosion inhibitor into feedstream to retard anodic dissolution.',
            'Adjust process condensate pH back to neutral/alkaline zone (7.2 – 8.2).',
            'Schedule baseline ultrasonic calibration on quarterly maintenance cycle.',
          ],
          primaryMethod: 'Barrier Coating & pH Correction',
        };
      case 'Pitting':
        return {
          title: 'Localized Pitting Passivation & Remediation',
          steps: [
            'Reduce chloride ion concentration via fresh demineralized water flushing.',
            'Apply chemical passivation wash (nitric/citric formulation) to re-establish passive oxide layer.',
            'Perform high-density ultrasonic A/B scan grid to quantify maximum pit cavity depth.',
            'Apply local weld overlay or high-build ceramic composite primer over pit cavities.',
          ],
          primaryMethod: 'Chloride Reduction & Passivation',
        };
      case 'Galvanic':
        return {
          title: 'Galvanic Couple Isolation & Cathodic Protection',
          steps: [
            'Electrically isolate dissimilar metals by inserting dielectric flange insulation kits (sleeves and washers).',
            'Install sacrificial zinc or magnesium anode upstream to shield the carbon steel host.',
            'Eliminate electrical continuity paths through pipe hangers and support structural steel.',
            'Inspect Zero Resistance Ammetry (ZRA) telemetry to verify galvanic current drops below 3.0 µA/cm².',
          ],
          primaryMethod: 'Dielectric Isolation & Sacrificial Anode',
        };
      case 'Crevice':
        return {
          title: 'Crevice Elimination & De-Stagnation Procedure',
          steps: [
            'Remove fluid stagnation by clearing blockage or throttling purge valve for continuous flow (>3 L/min).',
            'Disassemble flange assembly; clean trapped particulate and corrosive electrolyte salts.',
            'Replace degraded gasket with non-wicking, chemically inert elastomeric or PTFE gasket.',
            'Apply hydrophobic crevice sealant around circumference to bar moisture penetration.',
          ],
          primaryMethod: 'Flush Stagnation & Seal Crevice',
        };
      default:
        return {
          title: 'Standard Preventive Inspection Schedule',
          steps: [
            'Maintain continuous telemetry monitoring via CorroCAST sensor node.',
            'Verify sensor baseline calibration every 6 months.',
            'Ensure drainage ports are unobstructed and free of debris.',
            'Keep environmental enclosure sealed against external rain/salt ingress.',
          ],
          primaryMethod: 'Routine Continuous Telemetry',
        };
    }
  };

  const plan = getActionPlan(likelyCorrosionType, status);

  const urgencyStyles = {
    Safe: {
      label: 'Keep Monitoring',
      sublabel: 'Nominal condition. No maintenance crew dispatch required.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      icon: ShieldCheck,
    },
    Warning: {
      label: 'Plan Action Soon',
      sublabel: 'Schedule inspection crew within 48 to 72 hours before degradation accelerates.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      icon: Clock,
    },
    Critical: {
      label: 'Act Immediately',
      sublabel: 'Urgent priority. Mobilize maintenance team immediately for physical verification.',
      color: 'text-red-400',
      bg: 'bg-red-500/15 border-red-500/40 animate-soft-pulse',
      icon: AlertTriangle,
    },
  };

  const urgency = urgencyStyles[status];
  const UrgencyIcon = urgency.icon;

  return (
    <div className="p-5 rounded-2xl bg-industrial-900/90 border border-industrial-700/60 light:bg-white light:border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Wrench size={17} className="text-cyan-400" />
            <span>Prescriptive Maintenance: What To Do</span>
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-500">
            Actionable steps tailored for {likelyCorrosionType === 'None' ? 'carbon steel baseline' : `${likelyCorrosionType} corrosion`}
          </p>
        </div>

        {/* Urgency Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${urgency.bg}`}>
          <UrgencyIcon size={16} className={urgency.color} />
          <div>
            <div className={`text-xs font-bold font-mono uppercase ${urgency.color}`}>
              Urgency: {urgency.label}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Header */}
      <div className="p-3 rounded-xl bg-industrial-950/70 border border-industrial-800 light:bg-slate-50 light:border-slate-200 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyan-300 light:text-cyan-800">
            {plan.title}
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-industrial-900 px-2 py-0.5 rounded border border-industrial-700">
            Method: {plan.primaryMethod}
          </span>
        </div>
        <p className="text-xs text-slate-400 light:text-slate-600 mt-1">
          {urgency.sublabel}
        </p>
      </div>

      {/* Action Steps List */}
      <div className="space-y-2.5">
        {plan.steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-2.5 rounded-lg bg-industrial-850/60 light:bg-white border border-industrial-800 light:border-slate-200 text-xs text-slate-200 light:text-slate-700"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <p className="leading-relaxed flex-1">{step}</p>
          </div>
        ))}
      </div>

      {/* Human Action reminder footnote */}
      <div className="mt-4 pt-3 border-t border-industrial-800 light:border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
        <span>Team sign-off required prior to closing ticket.</span>
        <span className="font-mono text-cyan-400">CorroCAST DSS Rule Engine</span>
      </div>
    </div>
  );
};
