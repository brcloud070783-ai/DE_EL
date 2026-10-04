import React from 'react';
import {
  FileText,
  Scale,
  Lightbulb,
  CheckCircle2,
  ArrowLeft,
  Eye,
} from 'lucide-react';

interface TelaahBottomBarProps {
  currentStep: 1 | 2 | 3 | 4;
  onSelectStep: (step: 1 | 2 | 3 | 4) => void;
  onBackToHome: () => void;
  onOpenPreview?: () => void;
}

interface StepItem {
  id: 1 | 2 | 3 | 4;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
  activeText: string;
  ringColor: string;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    label: 'Atribut',
    sublabel: 'Dasar & Kepala',
    icon: FileText,
    color: 'text-blue-600',
    activeBg: 'bg-blue-600',
    activeText: 'text-blue-700',
    ringColor: 'ring-blue-400',
  },
  {
    id: 2,
    label: 'Fakta',
    sublabel: 'Fakta & Analisis',
    icon: Scale,
    color: 'text-amber-600',
    activeBg: 'bg-amber-600',
    activeText: 'text-amber-700',
    ringColor: 'ring-amber-400',
  },
  {
    id: 3,
    label: 'Saran',
    sublabel: 'Tim & Anggaran',
    icon: Lightbulb,
    color: 'text-emerald-600',
    activeBg: 'bg-emerald-600',
    activeText: 'text-emerald-700',
    ringColor: 'ring-emerald-400',
  },
  {
    id: 4,
    label: 'Sahkan',
    sublabel: 'TTE & Validasi',
    icon: CheckCircle2,
    color: 'text-[#7F56D9]',
    activeBg: 'bg-[#7F56D9]',
    activeText: 'text-[#7F56D9]',
    ringColor: 'ring-purple-400',
  },
];

export const TelaahBottomBar: React.FC<TelaahBottomBarProps> = ({
  currentStep,
  onSelectStep,
  onBackToHome,
  onOpenPreview,
}) => {
  return (
    <nav
      aria-label="Navigasi Tahapan Telaahan Staf"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 sm:px-4 sm:py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden select-none"
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
        {/* Tombol Cepat Kembali ke Beranda */}
        <button
          type="button"
          onClick={onBackToHome}
          className="flex flex-col items-center justify-center px-2 py-1 text-slate-500 hover:text-slate-900 active:scale-95 transition cursor-pointer rounded-xl shrink-0"
          title="Kembali ke Beranda"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          <span className="text-[9.5px] mt-0.5 font-bold tracking-tight text-slate-600">
            Beranda
          </span>
        </button>

        <div className="h-6 w-px bg-slate-200 shrink-0" />

        {/* 4 Tahapan Utama: Atribut | Fakta | Saran | Sahkan */}
        <div className="flex-1 grid grid-cols-4 gap-1 sm:gap-1.5">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep(step.id)}
                className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 touch-manipulation ${
                  isActive
                    ? 'bg-slate-100 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                title={`Tahap ${step.id}: ${step.label} (${step.sublabel})`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? `${step.activeBg} text-white shadow-xs scale-105`
                      : 'text-slate-500 bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[10px] sm:text-[11px] tracking-tight leading-tight ${
                      isActive
                        ? `font-extrabold ${step.activeText}`
                        : 'font-semibold text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tombol Pratinjau Lembar A4 (Opsional jika disediakan) */}
        {onOpenPreview && (
          <>
            <div className="h-6 w-px bg-slate-200 shrink-0" />
            <button
              type="button"
              onClick={onOpenPreview}
              className="flex flex-col items-center justify-center px-2 py-1 text-purple-600 hover:text-purple-800 active:scale-95 transition cursor-pointer rounded-xl shrink-0"
              title="Pratinjau Lembar Cetak A4"
            >
              <Eye className="w-4 h-4 stroke-[2.2]" />
              <span className="text-[9.5px] mt-0.5 font-bold tracking-tight">
                A4
              </span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
