import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-industrial-800 bg-industrial-950 light:bg-slate-100 light:border-slate-200 py-6 px-4 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
        {/* The prominent, unobstructed IMPORTANT note stationed at the bottom */}
        <div className="w-full max-w-4xl p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-industrial-900 to-cyan-950/70 border border-cyan-500/40 text-cyan-200 light:bg-cyan-50 light:text-cyan-900 light:border-cyan-300 text-xs sm:text-sm font-medium shadow-lg flex items-center justify-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <ShieldAlert size={18} />
          </div>
          <span className="leading-relaxed">
            <strong className="text-cyan-300 font-bold uppercase tracking-wide">IMPORTANT:</strong> CorroCAST only alerts and recommends. It never repairs or stops machines. All actions are performed by the human team.
          </span>
        </div>

        {/* System & Material Specification */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 light:text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-200 light:text-slate-800">
            <ShieldCheck size={15} className="text-cyan-400" />
            <span>CorroCAST</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-cyan-400/90 light:text-cyan-700">Target Material: Carbon Steel</span>
          <span className="text-slate-600">•</span>
          <span>Industrial AI/ML Corrosion Decision Support System (DSS)</span>
        </div>
      </div>
    </footer>
  );
};
