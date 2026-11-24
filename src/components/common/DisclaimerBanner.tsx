import React from 'react';
import { Info, UserCheck, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-950/40 via-industrial-850 to-industrial-900 border-y sm:border border-cyan-500/20 sm:rounded-xl px-4 py-3 shadow-md my-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-cyan-300 font-medium">
          <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <ShieldAlert size={16} />
          </div>
          <span className="tracking-wide">
            <strong>IMPORTANT:</strong> CorroCAST only alerts and recommends. It never repairs or stops machines. All actions are performed by the human team.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs shrink-0 bg-slate-900/50 px-2.5 py-1 rounded-full border border-slate-700/50">
          <UserCheck size={13} className="text-emerald-400" />
          <span>Decision Support System (DSS)</span>
        </div>
      </div>
    </div>
  );
};
