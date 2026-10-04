import React, { useEffect } from 'react';
import { X, Lightbulb, Sparkles, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface GuideTemplateItem {
  title: string;
  subtitle?: string;
  text: string;
  icon?: React.ReactNode;
}

interface GuideBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  badgeLabel?: string;
  colorTheme?: 'purple' | 'cyan' | 'rose' | 'amber' | 'emerald' | 'teal' | 'blue';
  templates?: GuideTemplateItem[];
  onSelectTemplate?: (text: string) => void;
  children?: React.ReactNode;
}

const themeStyles = {
  purple: {
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    headerBg: 'from-purple-50 via-purple-50/40 to-white',
    accent: 'text-purple-700 bg-purple-100',
    itemBtn: 'hover:bg-purple-50/80 border-purple-200 hover:border-purple-300',
    insertBtn: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  cyan: {
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    headerBg: 'from-cyan-50 via-cyan-50/40 to-white',
    accent: 'text-cyan-700 bg-cyan-100',
    itemBtn: 'hover:bg-cyan-50/80 border-cyan-200 hover:border-cyan-300',
    insertBtn: 'bg-cyan-600 hover:bg-cyan-700 text-white',
  },
  rose: {
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    headerBg: 'from-rose-50 via-rose-50/40 to-white',
    accent: 'text-rose-700 bg-rose-100',
    itemBtn: 'hover:bg-rose-50/80 border-rose-200 hover:border-rose-300',
    insertBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    headerBg: 'from-amber-50 via-amber-50/40 to-white',
    accent: 'text-amber-700 bg-amber-100',
    itemBtn: 'hover:bg-amber-50/80 border-amber-200 hover:border-amber-300',
    insertBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    headerBg: 'from-emerald-50 via-emerald-50/40 to-white',
    accent: 'text-emerald-700 bg-emerald-100',
    itemBtn: 'hover:bg-emerald-50/80 border-emerald-200 hover:border-emerald-300',
    insertBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  teal: {
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    headerBg: 'from-teal-50 via-teal-50/40 to-white',
    accent: 'text-teal-700 bg-teal-100',
    itemBtn: 'hover:bg-teal-50/80 border-teal-200 hover:border-teal-300',
    insertBtn: 'bg-teal-600 hover:bg-teal-700 text-white',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    headerBg: 'from-blue-50 via-blue-50/40 to-white',
    accent: 'text-blue-700 bg-blue-100',
    itemBtn: 'hover:bg-blue-50/80 border-blue-200 hover:border-blue-300',
    insertBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
};

export const GuideBottomSheet: React.FC<GuideBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  badgeLabel = '💡 Panduan & Template',
  colorTheme = 'blue',
  templates = [],
  onSelectTemplate,
  children,
}) => {
  const theme = themeStyles[colorTheme] || themeStyles.blue;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Bottom Sheet Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col z-10"
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Sheet Header */}
            <div className={`p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b ${theme.headerBg} flex items-start justify-between gap-3`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10.5px] font-bold rounded-full border ${theme.badge}`}>
                    {badgeLabel}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-slate-500 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              {description && (
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600 leading-relaxed">
                  {description}
                </div>
              )}

              {children}

              {/* Template Items if provided */}
              {templates.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Pilihan Kalimat / Butir Standar
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Ketuk untuk memasukkan ke formulir
                    </span>
                  </div>

                  <div className="space-y-2">
                    {templates.map((tpl, i) => (
                      <div
                        key={i}
                        className={`p-3 bg-white border rounded-2xl transition space-y-1.5 ${theme.itemBtn}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {tpl.icon || <Lightbulb className="w-3.5 h-3.5 text-blue-600" />}
                            {tpl.title}
                          </span>
                          {onSelectTemplate && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectTemplate(tpl.text);
                                onClose();
                              }}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition shadow-2xs ${theme.insertBtn}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>Sisipkan</span>
                            </button>
                          )}
                        </div>
                        {tpl.subtitle && (
                          <p className="text-[11px] text-slate-500">
                            {tpl.subtitle}
                          </p>
                        )}
                        <p className="text-[11.5px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                          &ldquo;{tpl.text}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              >
                Tutup Panduan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
