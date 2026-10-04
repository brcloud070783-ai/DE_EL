import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import { generateLocalTelaah } from '../utils/telaahGenerator';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AiQuestionnaireCardProps {
  data: TelaahanStafData;
  onApplyGenerated: (updatedData: TelaahanStafData) => void;
  defaultExpanded?: boolean;
}

const QUICK_EXAMPLES = [
  { label: '🏛️ Rakornas DAK Fisik', full: 'Rakornas DAK Fisik ke Jakarta tanggal 12 s.d. 14 Oktober 2026' },
  { label: '🏆 Semifinal OSN', full: 'Semifinal OSN SMA/SMK di Kota Tarakan tanggal 11 s.d. 13 Agustus 2026' },
  { label: '📚 Bimtek Kurikulum', full: 'Bimtek Kurikulum Merdeka di Kabupaten Nunukan tanggal 22 s.d. 25 September 2026' },
  { label: '🔍 Monev BOS', full: 'Monev BOS & Verifikasi Fisik di Kabupaten Malinau tanggal 5 s.d. 7 Oktober 2026' },
];

export const AiQuestionnaireCard: React.FC<AiQuestionnaireCardProps> = ({
  data,
  onApplyGenerated,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const handleGenerate = async (customPrompt?: string) => {
    const textToSubmit = (customPrompt ?? promptInput).trim();

    if (!textToSubmit) {
      setStatusMessage({
        type: 'error',
        text: 'Silakan ketik tema atau rencana kegiatan dinas.',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage({
      type: 'info',
      text: 'AI sedang menyusun telaahan staf dinas...',
    });

    let generatedData: any = null;
    let sourceUsed = 'ai';

    try {
      // 1. Attempt server-side generation
      const response = await fetch('/api/generate-telaah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: textToSubmit,
          instansi:
            data.kop.namaDinas ||
            'Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara',
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const responseText = await response.text();

      if (response.ok && contentType.includes('application/json')) {
        try {
          const resJson = JSON.parse(responseText);
          if (resJson && resJson.success && resJson.data) {
            generatedData = resJson.data;
            sourceUsed = resJson.source || 'ai';
          }
        } catch {
          // JSON parse failed on response text; will fallback to local generator below
        }
      }
    } catch (networkErr) {
      console.warn('[AiGenerator] Server endpoint notice, applying local smart formulation:', networkErr);
    }

    // 2. Guaranteed fallback if server was unavailable, returned HTML, or errored
    if (!generatedData) {
      sourceUsed = 'smart_engine';
      generatedData = generateLocalTelaah({
        prompt: textToSubmit,
        instansi: data.kop.namaDinas || 'Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara',
      });
    }

    try {
      // Map generated content to TelaahanStafData
      const updated: TelaahanStafData = {
        ...data,
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
        fakta: Array.isArray(generatedData.fakta) ? generatedData.fakta : [generatedData.fakta || ''],
        analisisIntro:
          generatedData.analisisIntro ||
          'Berdasarkan pokok persoalan, praanggapan, dan fakta-fakta tersebut di atas, disampaikan telaahan staf sebagai berikut:',
        analisis: Array.isArray(generatedData.analisis)
          ? generatedData.analisis
          : [generatedData.analisis || ''],
        kesimpulan: {
          ...data.kesimpulan,
          poin: Array.isArray(generatedData.kesimpulan?.poin)
            ? generatedData.kesimpulan.poin
            : (data.kesimpulan.poin && data.kesimpulan.poin.length > 0 ? data.kesimpulan.poin : [
                `Pelaksanaan perjalanan dinas ke ${generatedData.kesimpulan?.tempat || generatedData.kesimpulan?.tempatTujuan || 'lokasi tujuan'} dinyatakan sangat layak dan mendesak guna menjamin ketercapaian target kinerja dan kelancaran kegiatan;`,
                `Rencana penugasan telah memenuhi seluruh persyaratan administratif kedinasan serta didukung ketersediaan alokasi anggaran DPA TA 2026 yang mencukupi.`
              ]),
          ringkasan:
            generatedData.kesimpulan?.ringkasan ||
            `Berdasarkan hasil analisis, perjalanan dinas ini dinyatakan sangat layak, mendesak, dan memenuhi syarat administratif serta ketersediaan anggaran DPA TA 2026.`,
          intro:
            generatedData.kesimpulan?.intro ||
            data.kesimpulan.intro ||
            'Sehubungan dengan hal tersebut di atas, mohon persetujuan menugaskan:',
          kegiatanIntro: '',
          maksudPerjalanan:
            generatedData.kesimpulan?.maksudPerjalanan ||
            generatedData.hal ||
            data.kesimpulan.maksudPerjalanan ||
            data.header.hal,
          tempatBerangkat:
            generatedData.kesimpulan?.tempatBerangkat ||
            data.kesimpulan.tempatBerangkat ||
            'Tanjung Selor',
          tempatTujuan:
            generatedData.kesimpulan?.tempatTujuan ||
            generatedData.kesimpulan?.tempat ||
            data.kesimpulan.tempatTujuan ||
            'Kota Tujuan',
          tempat:
            generatedData.kesimpulan?.tempat ||
            generatedData.kesimpulan?.tempatTujuan ||
            data.kesimpulan.tempat ||
            'Kota Tujuan',
          selama:
            generatedData.kesimpulan?.selama ||
            generatedData.kesimpulan?.lamanyaPerjalanan ||
            data.kesimpulan.selama ||
            '3 (tiga) hari kerja',
          lamanyaPerjalanan:
            generatedData.kesimpulan?.lamanyaPerjalanan ||
            generatedData.kesimpulan?.selama ||
            data.kesimpulan.lamanyaPerjalanan ||
            '3 (tiga) hari kerja',
          tanggal:
            generatedData.kesimpulan?.tanggal ||
            data.kesimpulan.tanggal ||
            'Sesuai Jadwal TA 2026',
          tanggalBerangkat:
            generatedData.kesimpulan?.tanggalBerangkat ||
            data.kesimpulan.tanggalBerangkat ||
            '11 Agustus 2026',
          tanggalKembali:
            generatedData.kesimpulan?.tanggalKembali ||
            data.kesimpulan.tanggalKembali ||
            '13 Agustus 2026',
          pembebananAnggaran:
            generatedData.kesimpulan?.pembebananAnggaran ||
            data.kesimpulan.pembebananAnggaran ||
            'DPA Dinas Pendidikan dan Kebudayaan TA 2026',
          personil:
            Array.isArray(generatedData.kesimpulan?.personil) &&
            generatedData.kesimpulan.personil.length > 0
              ? generatedData.kesimpulan.personil
              : data.kesimpulan.personil,
        },
        saran: Array.isArray(generatedData.saran) ? generatedData.saran : data.saran,
        updatedAt: new Date().toISOString(),
      };

      onApplyGenerated(updated);

      setStatusMessage({
        type: 'success',
        text: sourceUsed === 'gemini_ai'
          ? 'Naskah telaahan staf berhasil disusun lengkap oleh AI.'
          : 'Naskah telaahan staf berhasil disusun lengkap dan otomatis.',
      });
    } catch (applyErr: any) {
      console.error('Error applying telaahan:', applyErr);
      setStatusMessage({
        type: 'error',
        text: `Gagal: ${applyErr.message || 'Terjadi kesalahan saat menerapkan draf'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleApplyExample = (exampleFullText: string) => {
    setPromptInput(exampleFullText);
    handleGenerate(exampleFullText);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 text-slate-800 p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              Penyusun Naskah Otomatis
            </h3>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
              Instan 1 Kalimat
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowExamples((prev) => !prev)}
          className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 transition px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
        >
          <span>💡 Contoh Tema</span>
          {showExamples ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 1-Row Input Bar with Clear Button Hierarchy */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ketik rencana kegiatan... Contoh: Monev DAK ke Nunukan 12-14 Okt"
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition disabled:opacity-50"
          />
        </div>

        {/* PRIMARY ACTION CTA: Solid Emerald */}
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={isLoading || !promptInput.trim()}
          className="min-h-[40px] px-5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 touch-manipulation"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <Send className="w-3.5 h-3.5 text-white" />
          )}
          <span className="hidden sm:inline">Susun Naskah</span>
          <span className="sm:hidden">Proses</span>
        </button>
      </div>

      {/* Horizontal Scrollable Chips */}
      {showExamples && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 pb-0.5 no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold text-[11px] whitespace-nowrap shrink-0">
            Cepat:
          </span>
          {QUICK_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleApplyExample(ex.full)}
              className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-lg transition whitespace-nowrap shrink-0 text-[11px] font-semibold cursor-pointer active:scale-95"
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-2.5 rounded-xl text-xs flex items-center gap-2 transition animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : statusMessage.type === 'error' ? (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          ) : (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700 shrink-0" />
          )}
          <span className="text-[11px] font-medium leading-tight truncate">{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
};

