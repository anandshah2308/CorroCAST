import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Filter,
  ArrowRight,
  Send,
  MessageSquare,
  Mail,
  CheckCircle2,
  Clock,
  Layers,
  Search
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { CorrosionTypeBadge } from '../components/common/Badge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const AlertsPage: React.FC = () => {
  const { alerts, machines } = useData();
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'Warning' | 'Critical'>('ALL');
  const [machineFilter, setMachineFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Open' | 'Verifying' | 'Closed'>('ALL');

  const filteredAlerts = alerts.filter(alert => {
    if (levelFilter !== 'ALL' && alert.level !== levelFilter) return false;
    if (machineFilter !== 'ALL' && alert.machineId !== machineFilter) return false;
    if (statusFilter !== 'ALL' && alert.status !== statusFilter) return false;
    return true;
  });

  const getChannelIcon = (ch: 'Telegram' | 'SMS' | 'Email') => {
    switch (ch) {
      case 'Telegram':
        return <Send size={12} className="text-sky-400" />;
      case 'SMS':
        return <MessageSquare size={12} className="text-emerald-400" />;
      case 'Email':
        return <Mail size={12} className="text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Bell size={14} className="animate-pulse" />
            <span>Telemetry Notification Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            Incident Alerts &amp; Dispatches
          </h1>
          <p className="text-sm text-slate-400 light:text-slate-600 max-w-2xl mt-1">
            Real-time advisory feed logging automated escalations, diagnostic hypotheses, and recommended remediation protocols for plant engineers.
          </p>
        </div>

        {/* Channels indicator */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-industrial-900 border border-industrial-700/60 text-xs font-mono">
          <span className="text-slate-400">Outbound Channels:</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-500/30">
              <Send size={11} /> Telegram
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <MessageSquare size={11} /> SMS
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30">
              <Mail size={11} /> Email
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-industrial-900/80 border border-industrial-700/60 light:bg-white light:border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Filter size={14} />
            <span>Filters:</span>
          </div>

          {/* Level Filter */}
          <div className="flex items-center rounded-lg bg-industrial-950 p-1 border border-industrial-800">
            {(['ALL', 'Critical', 'Warning'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  levelFilter === lvl
                    ? 'bg-cyan-500 text-industrial-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Machine Filter */}
          <select
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
            className="bg-industrial-950 border border-industrial-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Machines</option>
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-industrial-950 border border-industrial-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Verifying">Verifying</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredAlerts.length} incidents
        </span>
      </div>

      {/* Alerts Table / Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-industrial-900/40 border border-industrial-800 text-slate-400">
            <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-60" />
            <p className="font-medium">No alerts match the chosen filter parameters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.level === 'Critical';

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCrit
                    ? 'bg-red-950/20 border-red-500/40 light:bg-red-50 light:border-red-200'
                    : 'bg-industrial-900/80 border-industrial-700/60 light:bg-white light:border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isCrit ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {isCrit ? <AlertOctagon size={18} /> : <AlertTriangle size={18} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono font-bold uppercase ${
                            isCrit ? 'text-red-400' : 'text-amber-400'
                          }`}
                        >
                          {alert.level}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <Link
                          to={`/machine/${alert.machineId}`}
                          className="text-sm font-bold text-slate-200 light:text-slate-800 hover:text-cyan-400 transition-colors"
                        >
                          {alert.machineName}
                        </Link>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        Logged {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <CorrosionTypeBadge type={alert.corrosionType} />
                    
                    {/* Status badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
                        alert.status === 'Open'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : alert.status === 'Verifying'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Reason description */}
                <div className="my-2.5 pl-2 sm:pl-9">
                  <p className="text-xs sm:text-sm text-slate-200 light:text-slate-700 font-medium leading-relaxed">
                    <strong>Telemetry Trigger:</strong> {alert.reason}
                  </p>
                  <p className="text-xs sm:text-sm text-cyan-300 light:text-cyan-800 mt-1">
                    <strong>Recommended Action:</strong> {alert.recommendedAction}
                  </p>
                </div>

                {/* Footer with Notification Channels and Link */}
                <div className="pt-3 border-t border-industrial-800 light:border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 pl-0 sm:pl-9">
                    <span>Dispatched To:</span>
                    <div className="flex items-center gap-1.5">
                      {alert.channels.map((ch) => (
                        <span
                          key={ch}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-industrial-950 text-slate-300 border border-industrial-800 text-[11px]"
                        >
                          {getChannelIcon(ch)}
                          <span>{ch}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/machine/${alert.machineId}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Inspect Diagnostics</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
