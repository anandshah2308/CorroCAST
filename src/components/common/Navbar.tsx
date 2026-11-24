import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Layers,
  HelpCircle,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Cpu,
  Radio,
  FileText,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  onOpenDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const { theme, toggleTheme } = useTheme();
  const { alerts, demoState } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  const activeAlertCount = alerts.filter(a => a.status === 'Open').length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { to: '/', label: 'Overview', icon: Layers },
    { to: '/alerts', label: 'Alerts', icon: Bell, badge: activeAlertCount },
    { to: '/guide', label: 'Corrosion Guide', icon: FileText },
    { to: '/how-it-works', label: 'How It Works', icon: Cpu },
    { to: '/about', label: 'About', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-industrial-700/60 bg-industrial-950/80 backdrop-blur-md dark:bg-industrial-950/80 light:bg-white/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <Radio className="w-5 h-5 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-industrial-950"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-slate-100 light:text-slate-900 group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Corro<span className="text-cyan-400">CAST</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 light:text-slate-500 -mt-1">
                  AI/ML Corrosion DSS
                </span>
              </div>
            </Link>

            {/* Demo data (simulated) badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm light:bg-cyan-50 light:text-cyan-700 light:border-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Demo data (simulated)</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 light:bg-cyan-50 light:text-cyan-700 light:border-cyan-200'
                      : 'text-slate-300 hover:text-white hover:bg-industrial-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold font-mono rounded-full bg-red-500 text-white animate-soft-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Demo Mode Button + Clock + Theme Toggle + Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Scenarios Trigger Button in Header (Leaves Bottom 100% Clean) */}
            {onOpenDemo && (
              <button
                onClick={onOpenDemo}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  demoState.active
                    ? 'bg-cyan-500 text-industrial-950 border-cyan-400 shadow-md shadow-cyan-500/30 animate-pulse'
                    : 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border-cyan-500/40'
                }`}
                title="Open Presentation Demo Controller"
              >
                <Sparkles size={14} className={demoState.active ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Demo Scenarios</span>
                <span className="sm:hidden">Demo</span>
                {demoState.active && (
                  <span className="px-1 py-0.2 rounded-full bg-industrial-950 text-cyan-300 font-mono text-[10px]">
                    {demoState.secondsRemaining}s
                  </span>
                )}
              </button>
            )}

            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-industrial-900 border border-industrial-700/60 font-mono text-xs text-slate-300 light:bg-slate-100 light:border-slate-300 light:text-slate-700">
              <Activity size={12} className="text-cyan-400 animate-pulse" />
              <span>{timeString} UTC</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-industrial-800 border border-industrial-700/60 transition-colors light:text-slate-600 light:hover:text-slate-900 light:bg-slate-100 light:border-slate-300"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-cyan-600" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-industrial-800 border border-industrial-700/60 light:text-slate-700 light:hover:bg-slate-100"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-industrial-800 light:border-slate-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 light:bg-cyan-50 light:text-cyan-700'
                        : 'text-slate-300 hover:text-white hover:bg-industrial-800 light:text-slate-600 light:hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={18} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
