import React, { useState } from 'react';
import { TelaahanStafData, ActiveTab } from '../types';
import {
  Search,
  MoreHorizontal,
  FileText,
  FileCheck,
  Plane,
  Banknote,
  Camera,
  Sparkles,
  Eye,
  Users,
  Layers,
  X,
  ChevronRight,
  Edit3,
  Printer,
  Trash2,
  Plus,
  RotateCcw,
  CheckCircle2,
  ImagePlus,
  ArrowRight,
  FileSpreadsheet,
  Award,
  Building2,
  BookOpen,
} from 'lucide-react';

interface BentoLauncherProps {
  data: TelaahanStafData;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenExport: () => void;
  onOpenGoogleDocsModal?: () => void;
  onOpenGasModal?: () => void;
  onOpenPejabatModal?: () => void;
  onOpenTemplateModal: () => void;
  onOpenSptModal: () => void;
  onOpenSppdModal: () => void;
  onOpenKuitansiModal: () => void;
  onOpenFotoModal: () => void;
  onOpenLaporanModal: () => void;
  onOpenTelaahCreationModal?: () => void;
}

interface DocumentProjectStage {
  id: string;
  stageNumber: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  circleColor: string;
  badgeText: string;
  isCompleted: boolean;
  statusLabel: string;
  isAi?: boolean;
  mockupType: 'telaah' | 'spt' | 'sppd' | 'kuitansi' | 'foto' | 'laporan';
  onEdit: () => void;
  onPreviewPdf: () => void;
}

export const BentoLauncher: React.FC<BentoLauncherProps> = React.memo(({
  data,
  setActiveTab,
  onOpenExport,
  onOpenGoogleDocsModal,
  onOpenGasModal,
  onOpenPejabatModal,
  onOpenTemplateModal,
  onOpenSptModal,
  onOpenSppdModal,
  onOpenKuitansiModal,
  onOpenFotoModal,
  onOpenLaporanModal,
  onOpenTelaahCreationModal,
}) => {
  // Search query filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Stage for Canva Bottom Sheet Action Drawer
  const [selectedStage, setSelectedStage] = useState<DocumentProjectStage | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Quick Action Sheet trigger (from FAB)
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  // Modal Panduan Tata Naskah Dinas (Permendagri 1/2023)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Basic document info
  const hasTelaah = Boolean(
    data.header?.nomorSurat ||
    data.persoalan?.length ||
    data.kop?.namaDinas
  );
  const perihal = data.header?.hal || 'Konsultasi Koordinasi Bantuan Operasional Sekolah (BOS) ke Jakarta';
  const instansiNama = data.kop?.namaDinas || 'Dinas Pendidikan dan Kebudayaan';

  // 6 Projects mapped to Canva Mobile UI
  const projectStages: DocumentProjectStage[] = [
    {
      id: 'telaah',
      stageNumber: '01',
      title: 'Telaahan Staf',
      subtitle: 'Format naskah telaahan staf 2-kolom Permendagri No. 1/2023',
      category: 'Dokumen Utama',
      icon: FileText,
      iconBg: 'bg-rose-50',
      iconColor: 'text-[#FF3B5C]',
      circleColor: 'bg-[#FF3B5C]', // Red/Coral Canva style
      badgeText: 'Format Baku',
      isCompleted: hasTelaah,
      statusLabel: hasTelaah ? 'Siap Cetak' : 'Draft',
      mockupType: 'telaah',
      onEdit: () => {
        setSelectedStage(null);
        if (onOpenTelaahCreationModal) {
          onOpenTelaahCreationModal();
        } else {
          setActiveTab('editor');
        }
      },
      onPreviewPdf: () => {
        setSelectedStage(null);
        onOpenExport();
      },
    },
    {
      id: 'spt',
      stageNumber: '02',
      title: 'Surat Tugas (SPT)',
      subtitle: 'Dasar penugasan dinas dan daftar personil pelaksana',
      category: 'Surat Tugas',
      icon: FileCheck,
      iconBg: 'bg-orange-50',
      iconColor: 'text-[#FF6422]',
      circleColor: 'bg-[#FF6422]', // Orange Canva style
      badgeText: 'Surat Tugas',
      isCompleted: true,
      statusLabel: 'Siap Cetak',
      mockupType: 'spt',
      onEdit: () => {
        setSelectedStage(null);
        onOpenSptModal();
      },
      onPreviewPdf: () => {
        setSelectedStage(null);
        onOpenSptModal();
      },
    },
    {
      id: 'sppd',
      stageNumber: '03',
      title: 'Surat Perjalanan Dinas (SPPD)',
      subtitle: 'Rincian perjalanan dinas dan lembar visum resmi',
      category: 'Lembar Visum',
      icon: Plane,
      iconBg: 'bg-purple-50',
      iconColor: 'text-[#7F56D9]',
      circleColor: 'bg-[#7F56D9]', // Violet/Purple Canva style
      badgeText: 'Lembar 1 & 2',
      isCompleted: true,
      statusLabel: 'Siap Cetak',
      mockupType: 'sppd',
      onEdit: () => {
        setSelectedStage(null);
        onOpenSppdModal();
      },
      onPreviewPdf: () => {
        setSelectedStage(null);
        onOpenSppdModal();
      },
    },
    {
      id: 'kuitansi',
      stageNumber: '04',
      title: 'Kuitansi & Rincian Biaya',
      subtitle: 'Kuitansi rampung dan rincian biaya riil standar SBM',
      category: 'Keuangan SPJ',
      icon: Banknote,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-[#818CF8]',
      circleColor: 'bg-[#818CF8]', // Lavender/Indigo Canva style
      badgeText: 'Biaya Riil',
      isCompleted: true,
      statusLabel: 'Siap Cetak',
      mockupType: 'kuitansi',
      onEdit: () => {
        setSelectedStage(null);
        onOpenKuitansiModal();
      },
      onPreviewPdf: () => {
        setSelectedStage(null);
        onOpenKuitansiModal();
      },
    },
    {
      id: 'foto',
      stageNumber: '05',
      title: 'Foto Dokumentasi Kegiatan',
      subtitle: 'Dokumentasi visual pertanggungjawaban perjalanan dinas',
      category: 'Bukti Fisik',
      icon: Camera,
      iconBg: 'bg-pink-50',
      iconColor: 'text-[#E11D48]',
      circleColor: 'bg-[#E11D48]', // Magenta/Pink Canva style
      badgeText: 'Matriks Foto',
      isCompleted: true,
      statusLabel: 'Siap Cetak',
      mockupType: 'foto',
      onEdit: () => {
        setSelectedStage(null);
        onOpenFotoModal();
      },
      onPreviewPdf: () => {
        setSelectedStage(null);
        onOpenFotoModal();
      },
    },
    {
      id: 'laporan',
      stageNumber: '06',
      title: 'Laporan Perjalanan Dinas',
      subtitle: 'Laporan hasil pelaksanaan kegiatan resmi dinas',
      category: 'Laporan Hasil',
      icon: Sparkles,
      iconBg: 'bg-teal-50',
      iconColor: 'text-[#0D9488]',
      circleColor: 'bg-[#0D9488]', // Deep Teal Canva style
      badgeText: 'Otomatis',
      isCompleted: true,
      isAi: true,
      statusLabel: 'Otomatis',
      mockupType: 'laporan',
      onEdit: () => {
        setSelectedStage(null);
        onOpenLaporanModal();
      },
      onPreviewPdf: () => {
        setSelectedStage(null);
        onOpenLaporanModal();
      },
    },
  ];

  // Filtered stages based on user search query
  const filteredStages = projectStages.filter(
    (stage) =>
      stage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stage.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stage.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perihal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExecuteReset = () => {
    setIsConfirmingReset(false);
    setSelectedStage(null);
    setFeedbackMessage('Data naskah tahap ini telah direset ke format standar.');
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3000);
  };

  // Render miniature document preview card mockup (Exact Canva gallery style)
  const renderCardMockup = (mockupType: string, isCompleted: boolean) => {
    switch (mockupType) {
      case 'telaah':
        return (
          <div className="w-full h-full bg-slate-100/90 rounded-xl p-2.5 flex flex-col justify-between border border-slate-200/80 shadow-2xs overflow-hidden relative">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-300/70">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-700/80 shrink-0" />
              <div className="space-y-0.5 flex-1">
                <div className="h-1 bg-slate-400/80 rounded w-4/5" />
                <div className="h-0.5 bg-slate-300 rounded w-3/5" />
              </div>
            </div>
            <div className="space-y-1 my-auto">
              <div className="h-1 bg-slate-300 rounded w-full" />
              <div className="h-1 bg-slate-300 rounded w-5/6" />
              <div className="h-1 bg-slate-300 rounded w-4/6" />
            </div>
            <div className="flex justify-between items-end pt-1 border-t border-slate-200">
              <div className="h-1 bg-slate-400 rounded w-1/3" />
              <div className="w-4 h-3 bg-emerald-100 rounded border border-emerald-300" />
            </div>
          </div>
        );

      case 'spt':
        return (
          <div className="w-full h-full bg-blue-50/70 rounded-xl p-2.5 flex flex-col justify-between border border-blue-200/70 shadow-2xs overflow-hidden relative">
            <div className="text-center pb-1 border-b border-blue-200">
              <div className="h-1.5 bg-blue-600 rounded w-2/3 mx-auto" />
              <div className="h-0.5 bg-blue-300 rounded w-1/2 mx-auto mt-0.5" />
            </div>
            <div className="flex items-center justify-center my-auto">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[8px] text-blue-700 font-bold px-1">
              <span>SPT DISDIKBUD</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </div>
        );

      case 'sppd':
        return (
          <div className="w-full h-full bg-purple-50/70 rounded-xl p-2.5 flex flex-col justify-between border border-purple-200/70 shadow-2xs overflow-hidden relative">
            <div className="flex items-center justify-between pb-1 border-b border-purple-200">
              <div className="h-1 bg-purple-700 rounded w-1/2" />
              <Plane className="w-3 h-3 text-purple-600" />
            </div>
            <div className="grid grid-cols-2 gap-1 my-auto">
              <div className="h-4 bg-purple-100/90 rounded border border-purple-200" />
              <div className="h-4 bg-purple-100/90 rounded border border-purple-200" />
            </div>
            <div className="h-1 bg-purple-300 rounded w-3/4" />
          </div>
        );

      case 'kuitansi':
        return (
          <div className="w-full h-full bg-teal-50/70 rounded-xl p-2.5 flex flex-col justify-between border border-teal-200/70 shadow-2xs overflow-hidden relative">
            <div className="flex items-center justify-between">
              <div className="h-1.5 bg-teal-700 rounded w-1/3" />
              <span className="text-[7.5px] font-black text-teal-800">RP</span>
            </div>
            <div className="space-y-1 my-auto bg-white/70 p-1 rounded border border-teal-100">
              <div className="h-1 bg-teal-400 rounded w-4/5" />
              <div className="h-1 bg-teal-300 rounded w-3/5" />
            </div>
            <div className="h-1.5 bg-teal-600 rounded w-1/2 ml-auto" />
          </div>
        );

      case 'foto':
        return (
          <div className="w-full h-full bg-slate-100 rounded-xl p-1.5 grid grid-cols-2 gap-1 border border-slate-200 shadow-2xs overflow-hidden relative">
            <div className="bg-sky-200/60 rounded flex items-center justify-center">
              <Camera className="w-3 h-3 text-sky-600" />
            </div>
            <div className="bg-emerald-200/60 rounded" />
            <div className="bg-amber-200/60 rounded" />
            <div className="bg-purple-200/60 rounded" />
          </div>
        );

      case 'laporan':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-amber-50 to-orange-100/80 rounded-xl p-2.5 flex flex-col justify-between border border-amber-200 shadow-2xs overflow-hidden relative">
            <div className="flex items-center justify-between">
              <div className="h-1.5 bg-amber-700 rounded w-1/2" />
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            </div>
            <div className="space-y-1 my-auto">
              <div className="h-1 bg-amber-300 rounded w-full" />
              <div className="h-1 bg-amber-300 rounded w-4/5" />
              <div className="h-1 bg-amber-300 rounded w-3/5" />
            </div>
            <div className="h-1 bg-orange-400 rounded w-2/3" />
          </div>
        );

      default:
        return <div className="w-full h-full bg-slate-100 rounded-xl" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE]/50 via-[#F3E8FF]/35 to-slate-50/50 pb-28 select-none">
      {/* FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* TOP PASTEL CANVA HEADER CONTAINER */}
      <div className="w-full max-w-2xl mx-auto px-4 pt-3 space-y-4">
        {/* 3. CANVA FLOATING SEARCH BAR: "Apa yang ingin Anda buat?" */}
        <div className="w-full relative">
          <div className="bg-white rounded-2xl sm:rounded-full px-4 py-3 sm:py-3.5 shadow-md shadow-indigo-500/5 flex items-center gap-3 border border-slate-100">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari naskah atau tahapan dinas..."
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-hidden bg-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4. SECTION: "Dokumen Terakhir" (Recent Documents - Dummy Display) */}
        <div className="pt-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Dokumen Terakhir
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                Dummy Preview
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400 cursor-not-allowed">
              Lihat semua
            </span>
          </div>

          {/* Dummy Recent Documents Carousel Track */}
          <div className="flex overflow-x-auto no-scrollbar gap-3.5 pb-2 pt-1 -mx-2 px-2 opacity-85">
            {/* Dummy Card 1 */}
            <div className="w-36 sm:w-44 shrink-0 rounded-2xl bg-white shadow-xs p-2 relative flex flex-col justify-between border border-slate-200/70 hover:border-slate-300 transition-all cursor-default">
              <div className="w-full aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 p-2.5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div className="h-2 w-16 bg-slate-200 rounded-sm" />
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 rounded-sm" />
                  <div className="h-1.5 w-4/5 bg-slate-200 rounded-sm" />
                  <div className="h-1.5 w-2/3 bg-slate-200 rounded-sm" />
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <div className="h-1.5 w-10 bg-blue-100 rounded-sm" />
                  <div className="h-2.5 w-5 bg-emerald-100 rounded-full" />
                </div>
              </div>
              <div className="pt-2 px-1">
                <h3 className="text-xs font-bold text-slate-800 truncate">
                  Telaahan Staf Disdikbud
                </h3>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Format Baku &bull; Baru saja
                </p>
              </div>
            </div>

            {/* Dummy Card 2 */}
            <div className="w-36 sm:w-44 shrink-0 rounded-2xl bg-white shadow-xs p-2 relative flex flex-col justify-between border border-slate-200/70 hover:border-slate-300 transition-all cursor-default">
              <div className="w-full aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 p-2.5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <div className="h-2 w-14 bg-slate-200 rounded-sm" />
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 rounded-sm" />
                  <div className="h-1.5 w-3/4 bg-slate-200 rounded-sm" />
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <div className="h-1.5 w-8 bg-orange-100 rounded-sm" />
                  <div className="h-2.5 w-5 bg-blue-100 rounded-full" />
                </div>
              </div>
              <div className="pt-2 px-1">
                <h3 className="text-xs font-bold text-slate-800 truncate">
                  Surat Tugas (SPT) Perjadin
                </h3>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Nomor: 090/SPT/2026
                </p>
              </div>
            </div>

            {/* Dummy Card 3 */}
            <div className="w-36 sm:w-44 shrink-0 rounded-2xl bg-white shadow-xs p-2 relative flex flex-col justify-between border border-slate-200/70 hover:border-slate-300 transition-all cursor-default">
              <div className="w-full aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 p-2.5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <div className="h-2 w-12 bg-slate-200 rounded-sm" />
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 rounded-sm" />
                  <div className="h-1.5 w-1/2 bg-slate-200 rounded-sm" />
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <div className="h-1.5 w-10 bg-purple-100 rounded-sm" />
                  <div className="h-2.5 w-5 bg-amber-100 rounded-full" />
                </div>
              </div>
              <div className="pt-2 px-1">
                <h3 className="text-xs font-bold text-slate-800 truncate">
                  SPD Lembar I &amp; II
                </h3>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Lampiran Perjadin Resmi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Docs Integration Banner */}
        {onOpenGoogleDocsModal && (
          <div className="pt-4">
            <div
              onClick={onOpenGoogleDocsModal}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-blue-500/20 hover:shadow-xl transition cursor-pointer flex items-center justify-between gap-4 group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 bg-white/20 text-blue-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1 border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Ekosistem Google Docs Live
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                    Cetak &amp; Live Embed di Google Docs
                  </h3>
                  <p className="text-xs text-blue-100/90 font-medium hidden sm:block mt-0.5">
                    Generate dokumen resmi ke Google Drive Anda, edit langsung, dan cetak via Google Docs.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs rounded-full shadow-md shrink-0 transition flex items-center gap-1 group-hover:translate-x-0.5"
              >
                <span>Buka Docs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 5. SECTION: "Aksi Cepat & Layanan" (2 Baris x 3 Item dengan Lingkaran Lebih Besar) */}
        <div className="pt-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-4 px-1">
            Aksi Cepat &amp; Layanan
          </h2>

          <div className="grid grid-cols-3 gap-y-6 sm:gap-y-8 gap-x-3 sm:gap-x-6 max-w-xl mx-auto py-1">
            {/* 1. Telaah */}
            <button
              type="button"
              onClick={() => {
                if (onOpenTelaahCreationModal) {
                  onOpenTelaahCreationModal();
                } else {
                  setActiveTab('editor');
                }
              }}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              title="Telaahan Staf"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF3B5C] flex items-center justify-center text-white shadow-md shadow-[#FF3B5C]/25 group-hover:scale-105 transition-transform">
                <FileText className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5 sm:mt-3 text-center truncate w-full">
                Telaah
              </span>
            </button>

            {/* 2. Surat Tugas (SPT) */}
            <button
              type="button"
              onClick={onOpenSptModal}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              title="Surat Perintah Tugas (SPT)"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF6422] flex items-center justify-center text-white shadow-md shadow-[#FF6422]/25 group-hover:scale-105 transition-transform">
                <FileCheck className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5 sm:mt-3 text-center truncate w-full">
                Surat Tugas
              </span>
            </button>

            {/* 3. SPD (SPPD) */}
            <button
              type="button"
              onClick={onOpenSppdModal}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              title="Surat Perjalanan Dinas (SPD)"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7F56D9] flex items-center justify-center text-white shadow-md shadow-[#7F56D9]/25 group-hover:scale-105 transition-transform">
                <Plane className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5 sm:mt-3 text-center truncate w-full">
                SPD
              </span>
            </button>

            {/* 4. Kuitansi */}
            <button
              type="button"
              onClick={onOpenKuitansiModal}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              title="Kuitansi & Rincian Biaya Riil"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-md shadow-[#10B981]/25 group-hover:scale-105 transition-transform">
                <Banknote className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5 sm:mt-3 text-center truncate w-full">
                Kuitansi
              </span>
            </button>

            {/* 5. Laporan */}
            <button
              type="button"
              onClick={onOpenLaporanModal}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              title="Laporan Perjalanan Dinas"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-[#F59E0B]/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5 sm:mt-3 text-center truncate w-full">
                Laporan
              </span>
            </button>

            {/* 6. Dokumentasi */}
            <button
              type="button"
              onClick={onOpenFotoModal}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              title="Foto Dokumentasi Kegiatan"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EC4899] flex items-center justify-center text-white shadow-md shadow-[#EC4899]/25 group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5 sm:mt-3 text-center truncate w-full">
                Dokumentasi
              </span>
            </button>
          </div>
        </div>

        {/* 6. SECTION: "Populer di Canva" (Template Rekomendasi Resmi) */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Template Rekomendasi
            </h2>
            <button
              type="button"
              onClick={onOpenTemplateModal}
              className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#4F46E5] transition cursor-pointer"
            >
              Lihat semua
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Template Card 1 */}
            <div
              onClick={onOpenTemplateModal}
              className="bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition cursor-pointer border border-slate-100 flex items-center gap-3.5 group active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Rekomendasi Utama
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate mt-1">
                  Konsultasi BOS Jakarta
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  Kelengkapan naskah dinas siap pakai
                </p>
              </div>
            </div>

            {/* Template Card 2 */}
            <div
              onClick={onOpenTemplateModal}
              className="bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition cursor-pointer border border-slate-100 flex items-center gap-3.5 group active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Plane className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Wilayah 3T Kaltara
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition truncate mt-1">
                  Monev Sekolah Terpencil
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  Naskah penugasan wilayah perbatasan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. FLOATING PURPLE ACTION BUTTON (FAB - Canva Mobile Signature) */}
      <button
        type="button"
        onClick={() => setIsFabMenuOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 rounded-full bg-[#7F56D9] hover:bg-[#6D42D0] active:scale-90 text-white shadow-xl shadow-[#7F56D9]/30 flex items-center justify-center cursor-pointer transition-all duration-150"
        title="Buat Naskah Baru"
      >
        <ImagePlus className="w-6 h-6" />
      </button>

      {/* 8. CANVA-STYLE BOTTOM SHEET (ACTION DRAWER) */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Backdrop Tap To Close */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setSelectedStage(null);
              setIsConfirmingReset(false);
            }}
          />

          {/* Bottom Drawer Container */}
          <div className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            {/* Drawer Header (Stage Info) */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedStage.circleColor} text-white shadow-xs`}
                >
                  <selectedStage.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Tahap {selectedStage.stageNumber} • {selectedStage.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                    {selectedStage.title}
                  </h3>
                  <span className="text-xs text-slate-500 block truncate mt-0.5">
                    {selectedStage.subtitle}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedStage(null);
                  setIsConfirmingReset(false);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ACTION OPTIONS LIST (Canva Mobile Clean Menu - No Redundancies) */}
            {!isConfirmingReset ? (
              <div className="space-y-2.5">
                {/* 1. PRIMARY ACTION */}
                <button
                  type="button"
                  onClick={selectedStage.onEdit}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 transition flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                        {selectedStage.id === 'telaah' ? 'Sunting Formulir' : `Buka ${selectedStage.title}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {selectedStage.id === 'telaah' ? 'Lengkapi formulir telaahan staf' : 'Kelola data dan pratinjau naskah ini'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 transition" />
                </button>

                {/* 2. PRINT ACTION (Special for Telaahan Staf) */}
                {selectedStage.id === 'telaah' && (
                  <button
                    type="button"
                    onClick={selectedStage.onPreviewPdf}
                    className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 active:bg-blue-100 transition flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                        <Printer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-900">
                          Cetak Dokumen &amp; Unduh PDF
                        </div>
                        <div className="text-xs text-slate-500">
                          Pratinjau cetak dan unduh dokumen resmi
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-700 transition" />
                  </button>
                )}

                {/* 3. VIEW IN FULL A4 VIEWER */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStage(null);
                    setActiveTab('preview');
                  }}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-purple-50 active:bg-purple-100 transition flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-purple-900">
                        Pratinjau Lembar A4
                      </div>
                      <div className="text-xs text-slate-500">
                        Tata letak lembar cetak standar Permendagri No. 1/2023
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-700 transition" />
                </button>

                {/* 4. RESET / HAPUS ACTION */}
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(true)}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 active:bg-rose-100 transition flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-rose-700">
                        Kosongkan Isian Naskah
                      </div>
                      <div className="text-xs text-slate-500">
                        Kembalikan isian naskah ini ke format awal
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-700 transition" />
                </button>
              </div>
            ) : (
              /* CONFIRMATION STATE FOR RESET */
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5 text-rose-800">
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-sm font-extrabold">Kosongkan Isian Naskah?</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed">
                  Seluruh isian data pada <strong>{selectedStage.title}</strong> akan dikembalikan ke format awal.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingReset(false)}
                    className="flex-1 py-2.5 bg-white text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteReset}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
                  >
                    Ya, Kosongkan
                  </button>
                </div>
              </div>
            )}

            {/* Close Button at Bottom */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedStage(null);
                  setIsConfirmingReset(false);
                }}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. FAB QUICK CREATE BOTTOM DRAWER */}
      {isFabMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsFabMenuOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                Buat Naskah Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsFabMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsFabMenuOpen(false);
                  if (onOpenTelaahCreationModal) {
                    onOpenTelaahCreationModal();
                  } else {
                    setActiveTab('editor');
                  }
                }}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 flex flex-col items-center text-center gap-2 cursor-pointer transition active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-[#FF3B5C] text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Mulai Telaahan</div>
                  <div className="text-[10px] text-slate-400">AI, Manual, atau Template</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsFabMenuOpen(false);
                  onOpenTemplateModal();
                }}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 flex flex-col items-center text-center gap-2 cursor-pointer transition active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-[#7F56D9] text-white flex items-center justify-center shadow-xs">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Pilih Template</div>
                  <div className="text-[10px] text-slate-400">Contoh format siap pakai</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL PANDUAN FORMAT TATA NASKAH DINAS (Permendagri No. 1/2023) */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsGuideModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Grab handle for mobile */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Panduan Tata Naskah Dinas
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Standar Baku Permendagri No. 1 Tahun 2023
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guide Content Cards */}
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <h4 className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  1. Sistematika Telaahan Staf
                </h4>
                <p className="leading-relaxed text-slate-600">
                  Telaahan staf disusun dalam bentuk 2 kolom sejajar: <em>Persoalan, Praanggapan, Fakta yang Mempengaruhi, Analisis, Kesimpulan,</em> dan <em>Saran Tindakan</em> yang ditandatangani oleh pejabat fungsional atau pelaksana.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  2. Surat Perintah Tugas (SPT)
                </h4>
                <p className="leading-relaxed text-slate-600">
                  SPT diterbitkan berdasarkan telaahan staf yang disetujui, mencantumkan dasar penugasan, daftar pelaksana yang diperintahkan, maksud tugas, serta jangka waktu pelaksanaan dinas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  3. Surat Perjalanan Dinas (SPPD) &amp; Kuitansi
                </h4>
                <p className="leading-relaxed text-slate-600">
                  Memuat rincian tanggal berangkat/tiba, alat angkut, beban anggaran, rincian biaya riil tiket/penginapan, dan lembar konfirmasi stempel instansi tujuan.
                </p>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsGuideModalOpen(false);
                  setActiveTab('editor');
                }}
                className="w-full py-3 bg-[#7F56D9] hover:bg-[#6941C6] active:bg-[#53389E] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka Formulir Telaahan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
