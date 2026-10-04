import React from 'react';
import { ActiveTab } from '../types';
import { UserCheck, LayoutGrid, FileText, Eye, Printer, Sparkles, Building2, Home, MoreHorizontal } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMenu: () => void;
  onOpenPejabat: () => void;
  onOpenExport: () => void;
  onLoadSample: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMenu,
  onOpenPejabat,
  onOpenExport,
  onLoadSample,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs print:hidden">
      <div className="max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 h-15 flex items-center justify-between gap-2">
        {/* Left: Brand Identity (Logo + SPD Kaltara Disdikbud) - Clean Canva Aesthetic */}
        <div
          onClick={() => setActiveTab('launcher')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          {/* Seal Logo */}
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs border border-slate-700/60 shrink-0">
            <span className="text-[11px] font-black tracking-tighter text-amber-300">KU</span>
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
              SPD Kaltara
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
              Disdikbud
            </p>
          </div>
        </div>

        {/* Center Desktop Quick Navigation Pill (Optional on wide screens) */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('launcher')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition ${
              activeTab === 'launcher'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition ${
              activeTab === 'editor'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Formulir</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('informasi-umum')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition ${
              activeTab === 'informasi-umum'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Kop &amp; Info</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition ${
              activeTab === 'preview'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>A4</span>
          </button>
        </div>

        {/* Right: Daftar Pejabat Pill + Desktop Titik 3 Menu + v2.5 Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenPejabat}
            className="px-3 sm:px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/90 text-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden xs:inline">Daftar Pejabat</span>
            <span className="xs:hidden">Pejabat</span>
          </button>

          {/* Desktop 3-dots Menu Button */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="hidden md:flex p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition cursor-pointer"
            title="Menu Lainnya"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          <span className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold tracking-tight">
            v2.5
          </span>
        </div>
      </div>
    </header>
  );
};
