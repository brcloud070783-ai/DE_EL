import React, { useState } from 'react';
import { ActiveTab } from '../types';
import {
  X,
  LayoutGrid,
  FileText,
  Eye,
  UserCheck,
  FolderSync,
  Sparkles,
  RotateCcw,
  Printer,
  ShieldCheck,
  Building2,
  Users,
  ChevronDown,
  ChevronRight,
  PenTool,
  FileCheck,
  Plane,
  Banknote,
  LayoutTemplate,
  Globe,
} from 'lucide-react';

interface MenuDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPejabat: () => void;
  onOpenTemplate: () => void;
  onOpenGas: () => void;
  onOpenExport: () => void;
  onOpenGoogleDocs?: () => void;
  onOpenSpt?: () => void;
  onOpenSppd?: () => void;
  onOpenKuitansi?: () => void;
  onReset: () => void;
}

export const MenuDrawerModal: React.FC<MenuDrawerModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenPejabat,
  onOpenTemplate,
  onOpenGas,
  onOpenExport,
  onOpenGoogleDocs,
  onOpenSpt,
  onOpenSppd,
  onOpenKuitansi,
  onReset,
}) => {
  const [isSignersExpanded, setIsSignersExpanded] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-start animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-84 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
        {/* Top Header */}
        <div>
          <div className="p-4 bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-[#4F46E5] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">SPD Disdikbud Kaltara</h3>
                <p className="text-[11px] text-purple-100 font-medium">Standar Permendagri No. 1/2023</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1.5 text-xs">
            {/* 1. NAVIGASI UTAMA */}
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigasi Utama
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('launcher');
                onClose();
              }}
              className={`w-full p-2.5 rounded-xl flex items-center gap-2.5 font-medium transition cursor-pointer ${
                activeTab === 'launcher'
                  ? 'bg-purple-50 text-[#7F56D9] font-extrabold border border-purple-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-[#7F56D9]" />
              <span>Beranda</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('editor');
                onClose();
              }}
              className={`w-full p-2.5 rounded-xl flex items-center gap-2.5 font-medium transition cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-purple-50 text-[#7F56D9] font-extrabold border border-purple-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#7F56D9]" />
              <span>Formulir Telaahan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('preview');
                onClose();
              }}
              className={`w-full p-2.5 rounded-xl flex items-center gap-2.5 font-medium transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-purple-50 text-[#7F56D9] font-extrabold border border-purple-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-4 h-4 text-[#7F56D9]" />
              <span>Pratinjau Lembar A4</span>
            </button>

            <div className="my-2 border-t border-slate-100" />

            {/* 2. PENGATURAN KEDINASAN & MASTER DATA */}
            <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pengaturan &amp; Master Data
            </div>

            {/* Set Kop Surat */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('informasi-umum');
                onClose();
              }}
              className={`w-full p-2.5 rounded-xl flex items-center gap-2.5 font-medium transition cursor-pointer ${
                activeTab === 'informasi-umum'
                  ? 'bg-purple-50 text-[#7F56D9] font-extrabold border border-purple-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>Set Kop Surat</span>
            </button>

            {/* Input dan Update Nama Pegawai */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPejabat();
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Input &amp; Update Nama Pegawai</span>
            </button>

            {/* Nama Pejabat */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPejabat();
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>Nama Pejabat</span>
            </button>

            {/* Nama Penandatangan Dokumen (Collapsible Section with Sub-Items) */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/40 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsSignersExpanded(!isSignersExpanded)}
                className="w-full p-2.5 flex items-center justify-between text-purple-950 font-bold hover:bg-purple-100/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#7F56D9]" />
                  <span>Penandatangan Dokumen</span>
                </div>
                {isSignersExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                )}
              </button>

              {isSignersExpanded && (
                <div className="p-1.5 pt-0 space-y-0.5 border-t border-purple-100/80 bg-white/70">
                  {/* Penandatangan Telaah */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPejabat();
                    }}
                    className="w-full p-2 rounded-lg flex items-center gap-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 text-[11.5px] transition cursor-pointer text-left pl-6"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Penandatangan Telaah</span>
                  </button>

                  {/* Penandatangan SPT */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenSpt) {
                        onOpenSpt();
                      } else {
                        onOpenPejabat();
                      }
                    }}
                    className="w-full p-2 rounded-lg flex items-center gap-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 text-[11.5px] transition cursor-pointer text-left pl-6"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>Penandatangan SPT</span>
                  </button>

                  {/* Penandatangan SPD */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenSppd) {
                        onOpenSppd();
                      } else {
                        onOpenPejabat();
                      }
                    }}
                    className="w-full p-2 rounded-lg flex items-center gap-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 text-[11.5px] transition cursor-pointer text-left pl-6"
                  >
                    <Plane className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Penandatangan SPD</span>
                  </button>

                  {/* Penandatangan Kuitansi */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenKuitansi) {
                        onOpenKuitansi();
                      } else {
                        onOpenPejabat();
                      }
                    }}
                    className="w-full p-2 rounded-lg flex items-center gap-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 text-[11.5px] transition cursor-pointer text-left pl-6"
                  >
                    <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Penandatangan Kuitansi</span>
                  </button>
                </div>
              )}
            </div>

            {/* Input Template */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTemplate();
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium transition cursor-pointer"
            >
              <LayoutTemplate className="w-4 h-4 text-amber-500" />
              <span>Input Template</span>
            </button>

            {/* Konek Account Google */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGas();
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium transition cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Konek Account Google</span>
            </button>

            {/* Google Docs Cetak & Live Embed */}
            {onOpenGoogleDocs && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGoogleDocs();
                }}
                className="w-full p-2.5 rounded-xl flex items-center gap-2.5 text-slate-700 hover:bg-blue-50 font-medium transition cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-900">Google Docs Cetak &amp; Embed</span>
              </button>
            )}

            <div className="my-2 border-t border-slate-100" />

            {/* Cetak & Unduh */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenExport();
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 font-medium transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak &amp; Unduh Dokumen</span>
            </button>

            {/* Kosongkan Formulir */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onReset();
              }}
              className="w-full p-2.5 rounded-xl flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Kosongkan Formulir</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 space-y-1 shrink-0">
          <div className="font-semibold text-slate-700">SPD Disdikbud Kaltara v2.5</div>
          <div>Format Baku Permendagri No. 1/2023</div>
          <div className="text-[10px] text-slate-400">Pemerintah Provinsi Kalimantan Utara</div>
        </div>
      </div>
    </div>
  );
};
