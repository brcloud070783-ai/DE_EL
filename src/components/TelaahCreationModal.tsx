import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import { generateLocalTelaah } from '../utils/telaahGenerator';
import {
  X,
  Sparkles,
  PenTool,
  LayoutTemplate,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  Check,
} from 'lucide-react';

interface TelaahCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
  onApplyGenerated: (updatedData: TelaahanStafData) => void;
  onSelectManual: () => void;
  onOpenTemplateSelector: () => void;
}

const QUICK_AI_SUGGESTIONS = [
  {
    label: '🏆 Puspresnas & Talenta',
    prompt: 'Pelaksanaan Pendampingan dan Penyelenggaraan Kompetisi Minat, Bakat, dan Kreativitas Siswa SMA Tingkat Provinsi (FLS2N, O2SN, OSN, LDBI, NSDC, FIKSI, dan OPSI) Tahun 2025',
  },
  {
    label: '📊 Dapodik & Tata Kelola',
    prompt: 'Monitoring, Evaluasi, dan Sinkronisasi Data Pokok Pendidikan (Dapodik) Jenjang Sekolah Menengah Atas',
  },
  {
    label: '🛡️ Stunting & ATS',
    prompt: 'Pelaksanaan Sosialisasi dan Rapat Koordinasi Lintas Sektor terkait Pencegahan dan Penanggulangan Stunting di Lingkungan Satuan Pendidikan',
  },
  {
    label: '📦 SPM & Bantuan Siswa',
    prompt: 'Pelaksanaan Monitoring dan Penyaluran Bantuan Pengadaan Perlengkapan Peserta Didik Jenjang SMA Tahun Anggaran 2025',
  },
];

export const TelaahCreationModal: React.FC<TelaahCreationModalProps> = ({
  isOpen,
  onClose,
  data,
  onApplyGenerated,
  onSelectManual,
  onOpenTemplateSelector,
}) => {
  // Modal Style: 'compact_list' (Style A) | 'segmented_tabs' (Style B) | 'optimized_cards' (Style C)
  const [modalStyle, setModalStyle] = useState<'compact_list' | 'segmented_tabs' | 'optimized_cards'>('segmented_tabs');
  
  // Modal View: 'choose' | 'ai_box'
  const [currentView, setCurrentView] = useState<'choose' | 'ai_box'>('choose');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentView('choose');
    setAiPrompt('');
    setErrorMessage(null);
    onClose();
  };

  const handleRunAi = async (customPrompt?: string) => {
    const textToSubmit = (customPrompt ?? aiPrompt).trim();
    if (!textToSubmit) {
      setErrorMessage('Silakan ketik atau pilih perihal agenda kegiatan dinas.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    let generatedData: any = null;

    try {
      const response = await fetch('/api/generate-telaah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          prompt: textToSubmit,
          instansi:
            data.kop?.namaDinas ||
            'Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara',
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const responseText = await response.text();

      if (response.ok && contentType.includes('application/json')) {
        try {
          const resJson = JSON.parse(responseText);
          if (resJson?.success && resJson.data) {
            generatedData = resJson.data;
          }
        } catch {
          // fallback to local generator
        }
      }
    } catch (networkErr) {
      console.warn('[AiGenerator] Server fallback to smart local formulation:', networkErr);
    }

    // Local smart fallback if server fails
    if (!generatedData) {
      generatedData = generateLocalTelaah({
        prompt: textToSubmit,
        instansi:
          data.kop?.namaDinas ||
          'Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara',
      });
    }

    // Map generated structure to TelaahanStafData
    const updated: TelaahanStafData = {
      ...data,
      id: `telaah-ai-${Date.now()}`,
      header: {
        ...data.header,
        hal: generatedData.hal || `Melaksanakan Perjalanan Dinas Dalam Rangka ${textToSubmit}`,
      },
      persoalan: Array.isArray(generatedData.persoalan)
        ? generatedData.persoalan
        : [generatedData.persoalan || ''],
      praanggapan: Array.isArray(generatedData.praanggapan)
        ? generatedData.praanggapan
        : [generatedData.praanggapan || ''],
      fakta: Array.isArray(generatedData.fakta)
        ? generatedData.fakta
        : [generatedData.fakta || ''],
      analisisIntro:
        generatedData.analisisIntro ||
        'Berdasarkan persoalan, praanggapan, dan fakta-fakta tersebut di atas, disampaikan telaahan staf sebagai berikut:',
      analisis: Array.isArray(generatedData.analisis)
        ? generatedData.analisis
        : [generatedData.analisis || ''],
      kesimpulan: {
        ...data.kesimpulan,
        ringkasan:
          generatedData.kesimpulan?.ringkasan ||
          `Berdasarkan fakta dan analisis di atas, perjalanan dinas ini sangat penting untuk memastikan target sasaran terlaksana tepat waktu.`,
        intro:
          generatedData.kesimpulan?.intro ||
          data.kesimpulan?.intro ||
          'Sehubungan dengan hal tersebut di atas, mohon persetujuan menugaskan:',
        kegiatanIntro: '',
        maksudPerjalanan:
          generatedData.kesimpulan?.maksudPerjalanan ||
          generatedData.hal ||
          `Melaksanakan Perjalanan Dinas Dalam Rangka ${textToSubmit}`,
        tempatBerangkat:
          generatedData.kesimpulan?.tempatBerangkat ||
          data.kop?.ibuKota ||
          'Tanjung Selor',
        tempatTujuan:
          generatedData.kesimpulan?.tempatTujuan ||
          generatedData.kesimpulan?.tempat ||
          'Kota Tarakan',
        tempat:
          generatedData.kesimpulan?.tempat ||
          generatedData.kesimpulan?.tempatTujuan ||
          'Kota Tarakan',
        selama:
          generatedData.kesimpulan?.selama ||
          data.kesimpulan?.selama ||
          '3 (tiga) hari kerja',
        lamanyaPerjalanan:
          generatedData.kesimpulan?.lamanyaPerjalanan ||
          generatedData.kesimpulan?.selama ||
          '3 (tiga) hari kerja',
        tanggal:
          generatedData.kesimpulan?.tanggal ||
          data.kesimpulan?.tanggal ||
          'Sesuai Jadwal TA 2026',
        tanggalBerangkat:
          generatedData.kesimpulan?.tanggalBerangkat ||
          data.kesimpulan?.tanggalBerangkat ||
          '11 Agustus 2026',
        tanggalKembali:
          generatedData.kesimpulan?.tanggalKembali ||
          data.kesimpulan?.tanggalKembali ||
          '13 Agustus 2026',
        pembebananAnggaran:
          generatedData.kesimpulan?.pembebananAnggaran ||
          data.kesimpulan?.pembebananAnggaran ||
          'DPA Dinas Pendidikan dan Kebudayaan TA 2026',
        personil:
          Array.isArray(generatedData.kesimpulan?.personil) &&
          generatedData.kesimpulan.personil.length > 0
            ? generatedData.kesimpulan.personil
            : data.kesimpulan?.personil || [
                {
                  id: 'p-1',
                  nama: 'Weni Noviana',
                  nip: '199311022018022001',
                  pangkatGol: 'Penata/ IIIc',
                  jabatan: 'Penelaah Teknis Kebijakan',
                },
              ],
      },
      saran: Array.isArray(generatedData.saran)
        ? generatedData.saran
        : [
            'Disarankan kepada pimpinan kiranya berkenan menyetujui serta menandatangani SPT dan SPPD terlampir.',
            'Biaya perjalanan dinas dibebankan pada DPA Tahun Anggaran 2026.',
            'Demikian disampaikan, mohon petunjuk dan arahan lebih lanjut.',
          ],
      updatedAt: new Date().toISOString(),
    };

    setIsGenerating(false);
    onApplyGenerated(updated);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-[#7F56D9] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {currentView === 'ai_box' ? (
              <button
                type="button"
                onClick={() => setCurrentView('choose')}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition active:scale-90 cursor-pointer"
                title="Kembali ke pilihan"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                {currentView === 'ai_box'
                  ? 'Susun Telaahan Otomatis'
                  : 'Mulai Susun Telaahan Staf'}
              </h3>
              <p className="text-xs text-purple-100">
                {currentView === 'ai_box'
                  ? 'Tuliskan topik atau agenda kegiatan dinas'
                  : 'Pilih asisten AI, template resmi, atau lembar kosong'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* VIEW 1: CANVA SMART HERO (FORMULASI AI & QUICK OPTIONS) */}
          {currentView === 'choose' && (
            <div className="space-y-3.5">
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Hero Card with Glowing AI Formulator built-in */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-indigo-50/50 border-2 border-purple-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#7F56D9] animate-pulse" />
                      <span className="text-xs font-extrabold text-[#7F56D9] tracking-tight">
                        ✨ Formulasi Otomatis AI (Instan)
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 bg-purple-100 text-[#7F56D9] rounded-full">
                      Asisten Aktif
                    </span>
                  </div>

                  {/* Integrated mini text area */}
                  <div className="space-y-1.5">
                    <textarea
                      rows={2}
                      value={aiPrompt}
                      onChange={(e) => {
                        setAiPrompt(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Tulis topik perjalanan dinas Anda di sini (Misal: Rapat Koordinasi BOS atau Verifikasi Data)..."
                      className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F56D9]/20 focus:border-[#7F56D9] bg-white/90 placeholder-slate-400 font-medium transition resize-none"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Compact suggestions directly clickable */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {QUICK_AI_SUGGESTIONS.slice(0, 3).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiPrompt(item.prompt);
                          setErrorMessage(null);
                        }}
                        className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition cursor-pointer active:scale-95 ${
                          aiPrompt === item.prompt
                            ? 'bg-purple-100 text-[#7F56D9] border-purple-300'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50 hover:text-[#7F56D9]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Run Button directly here */}
                  <button
                    type="button"
                    onClick={() => handleRunAi()}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-[#7F56D9] to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyusun Naskah Telaahan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Formulasi Naskah Otomatis</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 2 Grid cards below for fallback */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onOpenTemplateSelector();
                    }}
                    className="p-3 rounded-2xl border border-amber-200 bg-amber-50/20 hover:bg-amber-50/50 text-left transition active:scale-95 cursor-pointer group"
                  >
                    <LayoutTemplate className="w-5 h-5 text-amber-500 mb-1" />
                    <span className="text-[11px] font-extrabold text-slate-800 block group-hover:text-amber-700 leading-tight">
                      Template Resmi
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">
                      BOS, Bimtek, dll.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectManual();
                      handleClose();
                    }}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-100 text-left transition active:scale-95 cursor-pointer group"
                  >
                    <PenTool className="w-5 h-5 text-emerald-500 mb-1" />
                    <span className="text-[11px] font-extrabold text-slate-800 block group-hover:text-emerald-700 leading-tight">
                      Tulis Manual
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">
                      Lembar kosong bersih.
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: BOX AI GENERATOR TELAAHAN */}
          {currentView === 'ai_box' && (
            <div className="space-y-4">
              {showInfoBanner && (
                <div className="p-2.5 sm:p-3 bg-purple-50/80 border border-purple-200/80 rounded-xl flex items-start justify-between gap-2.5 transition-all">
                  <div className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-700 leading-snug">
                    <Sparkles className="w-4 h-4 text-[#7F56D9] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-purple-950 mr-1">
                        Format Baku Permendagri No. 1/2023:
                      </span>
                      AI menyusun otomatis naskah telaahan lengkap (Kepala, Persoalan, Praanggapan, Fakta, Analisis, Kesimpulan, & Saran).
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInfoBanner(false)}
                    className="p-1 rounded-md text-purple-400 hover:text-purple-700 hover:bg-purple-100/70 transition shrink-0 cursor-pointer"
                    title="Tutup informasi"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Form Input Prompt */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Agenda / Topik Perjalanan Dinas:
                </label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Contoh: Rapat Koordinasi Pengelolaan BOS dan verifikasi data fisik ke Balikpapan tanggal 12–14 Oktober 2026..."
                  className="w-full p-3 text-xs sm:text-sm border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7F56D9]/30 focus:border-[#7F56D9] bg-white transition"
                  disabled={isGenerating}
                />
              </div>

              {/* Quick Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Rekomendasi Topik Cepat:
                </span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_AI_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAiPrompt(item.prompt);
                        setErrorMessage(null);
                      }}
                      className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#7F56D9] border border-slate-200 transition cursor-pointer active:scale-95"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentView('choose')}
                  disabled={isGenerating}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => handleRunAi()}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#7F56D9] to-indigo-600 hover:opacity-95 active:scale-95 rounded-xl shadow-md shadow-purple-500/25 transition cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyusun Naskah Telaahan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Susun Naskah Telaahan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
