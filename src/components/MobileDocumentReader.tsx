import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import {
  FileText,
  Building2,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Printer,
  Edit3,
  ShieldCheck,
  Tag,
  CheckSquare,
  ArrowRight,
  BookOpen,
  Share2,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
  FileDown,
  X,
  Maximize2,
  MessageCircle,
} from 'lucide-react';

interface MobileDocumentReaderProps {
  data: TelaahanStafData;
  onEdit: () => void;
  onPrint: () => void;
  onOpenInformasiUmum?: () => void;
  paperSize?: 'a4' | 'f4';
  onPaperSizeChange?: (size: 'a4' | 'f4') => void;
}

export const MobileDocumentReader: React.FC<MobileDocumentReaderProps> = ({
  data,
  onEdit,
  onPrint,
  onOpenInformasiUmum,
  paperSize,
  onPaperSizeChange,
}) => {
  const {
    kop,
    header,
    disposisi,
    persoalan,
    praanggapan,
    fakta,
    analisisIntro,
    analisis,
    kesimpulan,
    saran,
    kaki,
  } = data;

  const persoalanList = (Array.isArray(persoalan) ? persoalan : [persoalan || ''])
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  const praanggapanList = praanggapan.filter((i) => i && i.trim() !== '');
  const faktaList = fakta.filter((i) => i && i.trim() !== '');
  const analisisList = analisis.filter((i) => i && i.trim() !== '');
  const saranList = saran.filter((i) => i && i.trim() !== '');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  
  const [localPaperFormat, setLocalPaperFormat] = useState<'A4' | 'F4'>('A4');
  const paperFormat = (paperSize ? paperSize.toUpperCase() : localPaperFormat) as 'A4' | 'F4';
  const setPaperFormat = (format: 'A4' | 'F4') => {
    const val = format.toLowerCase() as 'a4' | 'f4';
    if (onPaperSizeChange) {
      onPaperSizeChange(val);
    } else {
      setLocalPaperFormat(format);
    }
  };

  // Pinch-to-zoom Touch Handlers
  const touchStartDistRef = React.useRef<number | null>(null);

  const handleTouchStartGlobal = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchMoveGlobal = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const factor = dist / touchStartDistRef.current;
      const delta = (factor - 1) * 35; // sensitivity
      setZoomPercent((prev) => Math.min(150, Math.max(50, Math.round(prev + delta))));
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchEndGlobal = () => {
    touchStartDistRef.current = null;
  };

  const handleShareWhatsApp = () => {
    const formatList = (list: string[], symbol = '-') => {
      if (!list || list.length === 0) return symbol;
      return list.map((item, i) => `${i + 1}. ${item}`).join('\n');
    };

    const text = `*DRAFT TELAAHAN STAF (Disdikbud Kaltara)*\n\n` +
      `*Yth:* ${header.yth || '-'}\n` +
      `*Dari:* ${header.dari || '-'}\n` +
      `*Perihal:* ${header.hal || '-'}\n\n` +
      `*I. Pokok Persoalan:*\n${formatList(persoalanList)}\n\n` +
      `*II. Praanggapan:*\n${formatList(praanggapanList)}\n\n` +
      `*III. Fakta-fakta yang Mempengaruhi:*\n${formatList(faktaList)}\n\n` +
      `*IV. Analisis:*\n${formatList(analisisList)}\n\n` +
      `*V. Kesimpulan (Personil & Jadwal):*\n` +
      `• Ringkasan: ${kesimpulan.ringkasan || '-'}\n` +
      `• Tempat: ${kesimpulan.tempat || '-'}\n` +
      `• Durasi: ${kesimpulan.selama || '-'}\n` +
      `• Tanggal: ${kesimpulan.tanggal || '-'}\n` +
      `• Personil: ${kesimpulan.personil.length > 0 ? kesimpulan.personil.map((p, i) => `${i+1}) ${p.nama} (${p.jabatan})`).join(', ') : '-'}\n\n` +
      `*VI. Saran:*\n${formatList(saranList)}\n\n` +
      `_Mohon petunjuk dan arahan dari pimpinan. Terima kasih._`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div 
      className="space-y-4 max-w-3xl mx-auto pb-20 select-none"
      onTouchStart={handleTouchStartGlobal}
      onTouchMove={handleTouchMoveGlobal}
      onTouchEnd={handleTouchEndGlobal}
    >
      {/* 📱 TOP STICKY PREVIEW TOOLBAR WITH COLLAPSIBLE MENU */}
      <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-md flex items-center justify-between gap-2">
        {/* Left Action: Sunting Formulir */}
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition cursor-pointer shrink-0 active:scale-95"
          title="Kembali ke Sunting Formulir"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#7F56D9]" />
          <span>Sunting</span>
        </button>

        {/* Paper Format Indicator Badge */}
        <span className="hidden sm:inline-flex items-center gap-1 bg-purple-50 text-[#7F56D9] text-[11px] font-extrabold px-3 py-1 rounded-full border border-purple-200/60">
          📄 {paperFormat}
        </span>

        {/* Right Actions Group */}
        <div className="flex items-center gap-1.5">
          {/* Primary Action: Cetak (Always Visible) */}
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] hover:opacity-95 text-white rounded-full text-xs font-extrabold shadow-sm shadow-purple-500/20 transition cursor-pointer active:scale-95"
            title="Cetak Dokumen Resmi"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>

          {/* Collapsible '...' Menu Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-8 h-8 rounded-full border transition flex items-center justify-center cursor-pointer active:scale-95 ${
              isMenuOpen
                ? 'bg-[#7F56D9] text-white border-[#7F56D9]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Pengaturan Pratinjau (...)"
            aria-label="Pengaturan Pratinjau"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 📱 SLIDE-UP DROPDOWN MENU FOR ZOOM, FORMAT, AND PDF SETTINGS */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs p-0 animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setIsMenuOpen(false)} />

          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl border border-slate-200 p-4 sm:p-5 z-10 animate-in slide-in-from-bottom duration-200 text-slate-800 font-sans space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-1" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7F56D9] flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Pengaturan Pratinjau
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Zoom, Ukuran Kertas, dan Ekspor PDF
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 🔍 SECTION 1: ZOOM SETTINGS */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Skala Zoom ({zoomPercent}%)
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomPercent((prev) => Math.max(50, prev - 10))}
                  disabled={zoomPercent <= 50}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>-</span>
                </button>

                <button
                  type="button"
                  onClick={() => setZoomPercent(100)}
                  className="py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-extrabold text-[#7F56D9] text-center cursor-pointer"
                >
                  100%
                </button>

                <button
                  type="button"
                  onClick={() => setZoomPercent((prev) => Math.min(150, prev + 10))}
                  disabled={zoomPercent >= 150}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>+</span>
                </button>

                <button
                  type="button"
                  onClick={() => setZoomPercent(100)}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fit</span>
                </button>
              </div>
            </div>

            {/* ⚙️ SECTION 2: FORMAT SETTINGS */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Format Ukuran Kertas
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaperFormat('A4')}
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                    paperFormat === 'A4'
                      ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                  }`}
                >
                  <span>A4 Standar (210 x 297 mm)</span>
                  {paperFormat === 'A4' && <span className="text-xs">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setPaperFormat('F4')}
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                    paperFormat === 'F4'
                      ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                  }`}
                >
                  <span>F4 / Folio (215 x 330 mm)</span>
                  {paperFormat === 'F4' && <span className="text-xs">✓</span>}
                </button>
              </div>
            </div>

            {/* 📄 SECTION 3: PDF & CETAK ACTIONS */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Opsi Ekspor PDF &amp; Cetak
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onPrint();
                  }}
                  className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Unduh PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onPrint();
                  }}
                  className="p-3 bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>Cetak Langsung</span>
                </button>
              </div>
            </div>

            {onOpenInformasiUmum && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenInformasiUmum();
                  }}
                  className="w-full p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Pengaturan Kop &amp; Identitas Instansi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DOCUMENT CARDS CONTAINER WITH REALTIME ZOOM SCALING */}
      <div style={{ transform: `scale(${zoomPercent / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
      {/* 1. TOP HERO CARD: IDENTITY & QUICK ACTIONS (CANVA AESTHETIC) */}
      <div className="bg-gradient-to-br from-[#7F56D9] via-[#6366F1] to-[#4338CA] text-white p-5 sm:p-7 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-bold text-purple-100">
              <Building2 className="w-3.5 h-3.5 text-purple-200" />
              <span>{kop.namaInstansiAtas || 'PEMERINTAH PROVINSI KALIMANTAN UTARA'}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white pt-1">
              {kop.namaDinas || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
            </h1>
            <p className="text-xs text-purple-200 font-medium">
              Naskah Dinas: <span className="font-extrabold text-white">{data.judul || 'TELAAHAN STAF'}</span>
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-2xl shadow-inner">
            {kop.logoType === 'garuda' ? '🦅' : kop.logoType === 'custom' ? '🏢' : '🛡️'}
          </div>
        </div>

        {/* Perihal Highlight Box */}
        <div className="bg-black/20 backdrop-blur-xs p-4 rounded-2xl border border-white/15 space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-extrabold text-purple-200 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>Perihal Telaahan:</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed">
            {header.hal || '(Perihal telaahan belum diisi)'}
          </p>
        </div>

        {/* Quick Action Button Group - Canva Rounded Pills */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onPrint}
            className="w-full py-3 px-5 bg-white hover:bg-slate-50 active:scale-95 text-[#7F56D9] font-extrabold text-xs rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Unduh</span>
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="w-full py-3 px-5 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-xs rounded-full border border-white/30 backdrop-blur-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-purple-200" />
            <span>Sunting Naskah</span>
          </button>
        </div>
      </div>

      {/* 2. ATRIBUT NASKAH DINAS (SURAT META) */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#7F56D9]" />
            Atribut Naskah &amp; Tujuan
          </h2>
          <span className="text-[11px] font-bold text-[#7F56D9] bg-purple-50 px-3 py-1 rounded-full">
            {header.tanggalSurat || 'Tanggal Hari Ini'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-0.5">
            <span className="text-[10.5px] font-extrabold uppercase text-slate-400">Kepada (Yth.)</span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">{header.yth || '-'}</p>
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-0.5">
            <span className="text-[10.5px] font-extrabold uppercase text-slate-400">Dari</span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">{header.dari || '-'}</p>
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-0.5">
            <span className="text-[10.5px] font-extrabold uppercase text-slate-400">Nomor Surat</span>
            <p className="font-mono font-bold text-slate-800 text-xs">{header.nomorSurat || '-'}</p>
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-0.5">
            <span className="text-[10.5px] font-extrabold uppercase text-slate-400">Lampiran</span>
            <p className="font-semibold text-slate-800 text-xs">{header.lampiran || '1 (satu) Berkas'}</p>
          </div>
        </div>
      </div>

      {/* 3. STATUS DISPOSISI PIMPINAN */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7F56D9] flex items-center justify-center font-bold text-sm shadow-2xs">
              ⚖️
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Disposisi Pimpinan
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {disposisi.jabatanPimpinan || 'Plh. KEPALA DINAS PENDIDIKAN DAN KEBUDAYAAN'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-purple-50 text-[#7F56D9] flex items-center gap-1">
            <CheckSquare className="w-3 h-3 text-[#7F56D9]" />
            Kolom Resmi Fisik
          </span>
        </div>

        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-slate-400 rounded-sm inline-block bg-white" />
              Setuju
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-slate-400 rounded-sm inline-block bg-white" />
              Tidak Setuju
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500 pt-1 leading-relaxed">
            Catatan arahan / instruksi pimpinan akan dibubuhkan secara basah atau digital pada kolom sebelah kiri dokumen fisik A4.
          </p>
        </div>
      </div>

      {/* 4. BAB I: PERSOALAN & DASAR HUKUM */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <span className="w-7 h-7 rounded-xl bg-[#7F56D9] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
            I
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Persoalan &amp; Dasar Landasan Hukum</h2>
            <p className="text-[11px] text-slate-500 font-medium">Regulasi dan surat masuk yang mendasari pelaksanaan</p>
          </div>
        </div>

        {persoalanList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">(Belum ada data persoalan)</p>
        ) : (
          <div className="space-y-2.5">
            {persoalanList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-lg bg-purple-50 text-[#7F56D9] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {String.fromCharCode(97 + idx)}
                </span>
                <span className="text-justify font-normal">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. BAB II: PRAANGGAPAN */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <span className="w-7 h-7 rounded-xl bg-[#6366F1] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
            II
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Praanggapan (Asumsi Rasional)</h2>
            <p className="text-[11px] text-slate-500 font-medium">Pijakan berpikir objektif dan keyakinan keberhasilan tugas</p>
          </div>
        </div>

        {praanggapanList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">(Belum ada praanggapan)</p>
        ) : (
          <div className="space-y-2.5">
            {praanggapanList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-lg bg-indigo-50 text-[#6366F1] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {String.fromCharCode(97 + idx)}
                </span>
                <span className="text-justify font-normal">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. BAB III: FAKTA-FAKTA YANG MEMPENGARUHI */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <span className="w-7 h-7 rounded-xl bg-[#06B6D4] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
            III
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Fakta-Fakta yang Mempengaruhi</h2>
            <p className="text-[11px] text-slate-500 font-medium">Kondisi lapangan, jadwal, kesiapan personil, dan ketersediaan dana</p>
          </div>
        </div>

        {faktaList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">(Belum ada fakta)</p>
        ) : (
          <div className="space-y-2.5">
            {faktaList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-lg bg-cyan-50 text-cyan-700 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {String.fromCharCode(97 + idx)}
                </span>
                <span className="text-justify font-normal">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. BAB IV: ANALISIS */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <span className="w-7 h-7 rounded-xl bg-[#3B82F6] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
            IV
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Analisis Komprehensif</h2>
            <p className="text-[11px] text-slate-500 font-medium">Telaahan manfaat, mitigasi kendala, dan urgensi kebijakan</p>
          </div>
        </div>

        {analisisIntro && (
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-950 font-medium leading-relaxed">
            {analisisIntro}
          </div>
        )}

        {analisisList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">(Belum ada analisis)</p>
        ) : (
          <div className="space-y-2.5">
            {analisisList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {String.fromCharCode(97 + idx)}
                </span>
                <span className="text-justify font-normal">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. BAB V: KESIMPULAN & PENUGASAN PERSONIL */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <span className="w-7 h-7 rounded-xl bg-[#8B5CF6] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
            V
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Kesimpulan &amp; Usulan Personil</h2>
            <p className="text-[11px] text-slate-500 font-medium">Daftar personil dan rincian waktu/tempat pelaksanaan tugas</p>
          </div>
        </div>

        {kesimpulan.ringkasan && (
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal text-justify">
            {kesimpulan.ringkasan}
          </p>
        )}

        <div className="text-xs font-bold text-slate-700">
          {kesimpulan.intro || 'Mohon perkenan Bapak Plh. Kepala Dinas kiranya menyetujui penugasan personil sebagai berikut:'}
        </div>

        {/* Personil Cards */}
        <div className="space-y-3">
          {kesimpulan.personil.map((p, idx) => (
            <div
              key={p.id || idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-purple-50 text-[#7F56D9] text-[10.5px] font-extrabold rounded-full">
                  Personil {idx + 1}
                </span>
                <span className="text-[11px] font-bold text-slate-500">{p.pangkatGol}</span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{p.nama || '(Nama belum diisi)'}</h3>
                <p className="text-xs font-mono font-medium text-slate-600">NIP. {p.nip || '-'}</p>
                <p className="text-xs text-slate-700 font-medium mt-1">{p.jabatan || '-'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Waktu & Lokasi Pelaksanaan Info Box */}
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2.5 text-xs text-purple-950">
          <div className="font-extrabold uppercase tracking-wider text-[10.5px] text-[#7F56D9]">
            Jadwal &amp; Lokasi Kegiatan
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#7F56D9] shrink-0" />
              <span><strong>Tempat:</strong> {kesimpulan.tempat || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7F56D9] shrink-0" />
              <span><strong>Durasi:</strong> {kesimpulan.selama || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#7F56D9] shrink-0" />
              <span><strong>Tanggal:</strong> {kesimpulan.tanggal || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9. BAB VI: SARAN & REKOMENDASI TINDAK LANJUT */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <span className="w-7 h-7 rounded-xl bg-[#10B981] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
            VI
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Saran &amp; Rekomendasi Tindak Lanjut</h2>
            <p className="text-[11px] text-slate-500 font-medium">Penerbitan SPT/SPPD, pembebanan anggaran DPA, dan penutup</p>
          </div>
        </div>

        {saranList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">(Belum ada saran)</p>
        ) : (
          <div className="space-y-2.5">
            {saranList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 text-xs sm:text-sm text-slate-800 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {String.fromCharCode(97 + idx)}
                </span>
                <span className="text-justify font-normal">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 10. KAKI NASKAH & TANDA TANGAN PEMBUAT TELAAHAN */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Pejabat Pembuat Telaahan (Kaki Naskah)
          </h2>
          <span className="text-[11px] font-extrabold text-[#7F56D9] bg-purple-50 px-3 py-1 rounded-full">
            Terverifikasi
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500">{kaki.yangMembuatLabel || 'Yang membuat'},</p>
          <p className="text-xs font-bold text-slate-800">{kaki.jabatanPembuat || 'PPTK,'}</p>

          <div className="h-20 flex items-center justify-center my-1">
            {kaki.ttdDigital ? (
              <img
                src={kaki.ttdDigital}
                alt="Tanda Tangan Pembuat"
                className="max-h-16 object-contain"
              />
            ) : (
              <div className="px-4 py-2 rounded-full bg-white text-slate-400 text-xs italic border border-dashed border-slate-200 shadow-2xs">
                (Tanda Tangan Basah / Stempel Elektronik)
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900 underline">{kaki.namaPembuat}</h3>
            <p className="text-xs text-slate-600 font-medium">{kaki.pangkatPembuat}</p>
            <p className="text-xs font-mono text-slate-500">NIP. {kaki.nipPembuat}</p>
          </div>
        </div>
      </div>
      </div>

      {/* ZOOM SPEED CONTROLLER SLIDER (CANVA-LIKE INTEGRATION) */}
      <div className="bg-white/95 backdrop-blur-md p-2.5 px-4 rounded-full border border-slate-100 shadow-md flex items-center justify-between gap-3 text-xs font-semibold text-slate-700 max-w-xs mx-auto print:hidden">
        <span className="shrink-0 text-[10px] font-extrabold text-slate-400">ZOOM: {zoomPercent}%</span>
        <input
          type="range"
          min="50"
          max="150"
          value={zoomPercent}
          onChange={(e) => setZoomPercent(Number(e.target.value))}
          className="w-full accent-[#7F56D9] h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
        />
        <button 
          type="button" 
          onClick={() => setZoomPercent(100)} 
          className="text-[#7F56D9] text-[10px] font-extrabold px-2.5 py-1 bg-purple-50 hover:bg-purple-100 rounded-lg shrink-0 transition"
        >
          RESET
        </button>
      </div>

      {/* BOTTOM ACTION FLOATING BAR - CANVA PILL BAR */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-full border border-slate-100 shadow-xl flex items-center justify-between gap-2 print:hidden">
        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#7F56D9]" />
          <span className="hidden xs:inline">Sunting Formulir</span>
          <span className="xs:hidden">Sunting</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-full shadow-md shadow-emerald-600/10 transition cursor-pointer flex items-center gap-1.5"
            title="Kirim Ringkasan via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Kirim WA</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="px-5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] hover:opacity-95 active:scale-95 rounded-full shadow-md shadow-purple-500/25 transition cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
