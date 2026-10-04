import React, { useState } from 'react';
import { Lightbulb, Info, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuideBalloonProps {
  title: string;
  badgeLabel?: string;
  colorTheme?: 'purple' | 'cyan' | 'rose' | 'amber' | 'emerald' | 'teal' | 'blue';
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const themeStyles = {
  purple: {
    btn: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 hover:border-purple-300',
    balloon: 'bg-purple-50/95 border-purple-200 text-purple-950 shadow-purple-500/5',
    title: 'text-purple-950',
    icon: 'text-purple-600 bg-purple-100',
    closeBtn: 'text-purple-500 hover:text-purple-900 hover:bg-purple-200/60',
  },
  cyan: {
    btn: 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300',
    balloon: 'bg-cyan-50/95 border-cyan-200 text-cyan-950 shadow-cyan-500/5',
    title: 'text-cyan-950',
    icon: 'text-cyan-600 bg-cyan-100',
    closeBtn: 'text-cyan-500 hover:text-cyan-900 hover:bg-cyan-200/60',
  },
  rose: {
    btn: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 hover:border-rose-300',
    balloon: 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-rose-500/5',
    title: 'text-rose-950',
    icon: 'text-rose-600 bg-rose-100',
    closeBtn: 'text-rose-500 hover:text-rose-900 hover:bg-rose-200/60',
  },
  amber: {
    btn: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:border-amber-300',
    balloon: 'bg-amber-50/95 border-amber-200 text-amber-950 shadow-amber-500/5',
    title: 'text-amber-950',
    icon: 'text-amber-600 bg-amber-100',
    closeBtn: 'text-amber-500 hover:text-amber-900 hover:bg-amber-200/60',
  },
  emerald: {
    btn: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300',
    balloon: 'bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-emerald-500/5',
    title: 'text-emerald-950',
    icon: 'text-emerald-600 bg-emerald-100',
    closeBtn: 'text-emerald-500 hover:text-emerald-900 hover:bg-emerald-200/60',
  },
  teal: {
    btn: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 hover:border-teal-300',
    balloon: 'bg-teal-50/95 border-teal-200 text-teal-950 shadow-teal-500/5',
    title: 'text-teal-950',
    icon: 'text-teal-600 bg-teal-100',
    closeBtn: 'text-teal-500 hover:text-teal-900 hover:bg-teal-200/60',
  },
  blue: {
    btn: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
    balloon: 'bg-blue-50/95 border-blue-200 text-blue-950 shadow-blue-500/5',
    title: 'text-blue-950',
    icon: 'text-blue-600 bg-blue-100',
    closeBtn: 'text-blue-500 hover:text-blue-900 hover:bg-blue-200/60',
  },
};

export const GuideBalloon: React.FC<GuideBalloonProps> = ({
  title,
  badgeLabel = '💡 Panduan Konsep',
  colorTheme = 'blue',
  children,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const theme = themeStyles[colorTheme] || themeStyles.blue;

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button / Trigger Chip */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition shadow-2xs ${theme.btn}`}
          title={isOpen ? 'Tutup panduan' : 'Buka panduan & konsep'}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{badgeLabel}</span>
          {isOpen ? (
            <ChevronUp className="w-3 h-3 opacity-75" />
          ) : (
            <ChevronDown className="w-3 h-3 opacity-75" />
          )}
        </button>

        {isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-[10.5px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 transition"
          >
            <X className="w-3 h-3" /> Tutup Petunjuk
          </button>
        )}
      </div>

      {/* Balloon Popup Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`mt-2 p-3.5 border rounded-xl relative shadow-md ${theme.balloon}`}
          >
            {/* Balloon Header */}
            <div className="flex items-start justify-between gap-3 pb-2 mb-2 border-b border-black/5">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-md ${theme.icon}`}>
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <h4 className={`text-xs font-bold ${theme.title}`}>{title}</h4>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-md transition ${theme.closeBtn}`}
                title="Tutup Balon Petunjuk"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Balloon Content */}
            <div className="text-[11.5px] leading-relaxed space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
