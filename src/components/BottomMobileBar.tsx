import React from 'react';
import { ActiveTab } from '../types';
import { Home, FileText, LayoutGrid, Sparkles, MoreHorizontal } from 'lucide-react';

interface BottomMobileBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenExport?: () => void;
  onLoadSample?: () => void;
  onOpenTemplate?: () => void;
  onOpenAi?: () => void;
  onOpenMenuDrawer?: () => void;
}

export const BottomMobileBar: React.FC<BottomMobileBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTemplate,
  onOpenAi,
  onOpenMenuDrawer,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1.5 flex md:hidden items-center justify-around shadow-lg print:hidden select-none">
      {/* 1. Beranda (Home) */}
      <button
        type="button"
        onClick={() => setActiveTab('launcher')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition cursor-pointer active:scale-95 ${
          activeTab === 'launcher'
            ? 'text-[#7F56D9] font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'launcher' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Beranda</span>
      </button>

      {/* 2. Formulir Telaahan Staf (Editor) */}
      <button
        type="button"
        onClick={() => setActiveTab('editor')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition cursor-pointer active:scale-95 ${
          activeTab === 'editor'
            ? 'text-[#7F56D9] font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <FileText className={`w-5 h-5 ${activeTab === 'editor' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Telaahan</span>
      </button>

      {/* 3. Template (Canva Style Template Tab) */}
      <button
        type="button"
        onClick={onOpenTemplate}
        className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#7F56D9] transition cursor-pointer active:scale-95"
      >
        <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[10px] mt-0.5 tracking-tight">Template</span>
      </button>

      {/* 4. AI Laporan (Sintesis Laporan Otomatis) */}
      <button
        type="button"
        onClick={onOpenAi}
        className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#7F56D9] transition cursor-pointer active:scale-95"
      >
        <Sparkles className="w-5 h-5 stroke-[1.8] text-amber-500" />
        <span className="text-[10px] mt-0.5 tracking-tight">AI Laporan</span>
      </button>

      {/* 5. Menu (Titik 3 Kanan Bawah) */}
      <button
        type="button"
        onClick={onOpenMenuDrawer}
        className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#7F56D9] active:text-[#7F56D9] transition cursor-pointer active:scale-95"
        title="Menu"
      >
        <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px] mt-0.5 tracking-tight font-semibold">Menu</span>
      </button>
    </div>
  );
};
