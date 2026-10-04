import React, { useState } from 'react';
import { X, Printer, Copy, Check, FileDown, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import {
  TelaahanStafData,
  PaperSizeType,
  MarginPresetId,
  MARGIN_PRESET_OPTIONS,
  DocumentMargins,
  DEFAULT_DOCUMENT_MARGINS,
} from '../types';
import { generatePagedJsPdf, openPagedJsPdfWindow } from '../utils/pagedjsPdf';
import { PdfPreviewModal } from './PdfPreviewModal';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
  onPrint: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [paperSize, setPaperSize] = useState<PaperSizeType>('a4');
  const [marginPreset, setMarginPreset] = useState<MarginPresetId>('narrow');
  const [fontSizePt, setFontSizePt] = useState<number>(10);

  if (!isOpen) return null;

  const getActiveMargins = (): DocumentMargins => {
    const found = MARGIN_PRESET_OPTIONS.find((p) => p.id === marginPreset);
    if (!found) return DEFAULT_DOCUMENT_MARGINS;
    return {
      topMm: found.topMm,
      bottomMm: found.bottomMm,
      leftMm: found.leftMm,
      rightMm: found.rightMm,
    };
  };

  const handleDownloadDirectPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const margins = getActiveMargins();
      await generatePagedJsPdf(data, {
        paperSize,
        margins,
        fontSizePt,
        lineSpacing: 1.15,
        fontFamily: 'times',
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (e) {
      console.error('PagedJS PDF error', e);
      const margins = getActiveMargins();
      openPagedJsPdfWindow(data, {
        paperSize,
        margins,
        fontSizePt,
        lineSpacing: 1.15,
        fontFamily: 'times',
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyText = () => {
    const textContent = `
${data.kop.namaInstansiAtas}
${data.kop.namaDinas}
${data.kop.alamat}
=====================================================
${data.judul}

Yth.      : ${data.header.yth}
Dari      : ${data.header.dari}
Tanggal   : ${data.header.tanggalSurat}
Nomor     : ${data.header.nomorSurat}
Lampiran  : ${data.header.lampiran}
Hal       : ${data.header.hal}

DISPOSISI:
${data.disposisi.jabatanPimpinan}
Status: ${data.disposisi.status.toUpperCase()}
Catatan: ${data.disposisi.catatan || '-'}

ISI TELAAHAN:
I. PERSOALAN:
${(() => {
  const pList = (Array.isArray(data.persoalan) ? data.persoalan : [data.persoalan || ''])
    .map(p => (typeof p === 'string' ? p.trim() : ''))
    .filter(Boolean);
  if (pList.length <= 1) return `  ${pList[0] || '-'}`;
  return pList.map((p, i) => `  ${String.fromCharCode(97 + i)}. ${p}`).join('\n');
})()}

II. PRAANGGAPAN:
${data.praanggapan.map((p, i) => `  ${String.fromCharCode(97 + i)}. ${p}`).join('\n')}

III. FAKTA-FAKTA YANG MEMPENGARUHI:
${data.fakta.map((p, i) => `  ${String.fromCharCode(97 + i)}. ${p}`).join('\n')}

IV. ANALISIS:
${data.analisisIntro}
${data.analisis.map((p, i) => `  ${String.fromCharCode(97 + i)}. ${p}`).join('\n')}

V. KESIMPULAN:
${data.kesimpulan.intro}
${data.kesimpulan.personil
  .map(
    (p, i) =>
      `  ${i + 1}. ${p.nama} | NIP: ${p.nip} | Pangkat/Gol: ${p.pangkatGol} | Jabatan: ${p.jabatan}`
  )
  .join('\n')}
Maksud Perjalanan Dinas : ${data.kesimpulan.maksudPerjalanan || data.header.hal}
Tempat Berangkat        : ${data.kesimpulan.tempatBerangkat || 'Tanjung Selor'}
Tempat Tujuan           : ${data.kesimpulan.tempatTujuan || data.kesimpulan.tempat}
Tanggal Berangkat       : ${data.kesimpulan.tanggalBerangkat || data.kesimpulan.tanggal}
Tanggal Kembali         : ${data.kesimpulan.tanggalKembali || data.kesimpulan.tanggal}

VI. SARAN:
${data.saran.map((p, i) => `  ${String.fromCharCode(97 + i)}. ${p}`).join('\n')}

Yang membuat,
${data.kaki.jabatanPembuat}

${data.kaki.namaPembuat}
${data.kaki.pangkatPembuat}
NIP. ${data.kaki.nipPembuat}
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Telaahan-Staf-${data.header.nomorSurat.replace(/[\/\s:]/g, '_') || 'Draft'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col border border-slate-100 overflow-hidden sm:my-auto">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Header - Canva Gradient */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-[#4F46E5] text-white shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Cetak &amp; Unduh Dokumen
              </h3>
              <p className="text-xs text-purple-100 font-medium">
                Format naskah dinas resmi siap cetak (A4 / F4).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Opsi Kertas & Margin Sebelum Cetak */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Format Kertas &amp; Margin</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                Presisi Paged.js
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 block mb-1">Ukuran Kertas</label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPaperSize('a4')}
                    className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                      paperSize === 'a4'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    A4 (210×297)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperSize('f4')}
                    className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                      paperSize === 'f4'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    F4 (215×330)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-600 block mb-1">Batas Margin</label>
                <select
                  value={marginPreset}
                  onChange={(e) => setMarginPreset(e.target.value as MarginPresetId)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  {MARGIN_PRESET_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.badge})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pilihan Ukuran Font Cetak (Min 9.75pt) */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
              <label className="text-[10.5px] font-bold text-slate-600 shrink-0">Ukuran Teks:</label>
              <div className="flex items-center gap-1.5 flex-1 justify-end">
                {[9.75, 10, 10.5, 11].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSizePt(sz)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      fontSizePt === sz
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sz} pt {sz === 9.75 ? '(Padat)' : sz === 10 ? '★' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Actions: Unduh PDF Langsung & Cetak */}
          <div className="space-y-3">
            <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-50/90 via-indigo-50/60 to-purple-50/40 rounded-2xl border border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#7F56D9] bg-purple-100/80 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-[#7F56D9]" /> Standar Paged.js • A4 Presisi
                </span>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Ekspor Dokumen PDF
                </h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Paginasi presisi tanpa jeda halaman kosong atau teks terpotong.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfPreviewOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] hover:opacity-95 active:scale-95 text-white text-xs font-extrabold rounded-full shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 shrink-0 transition cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-purple-200" />
                <span>Pratinjau &amp; Unduh</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Cetak ke Printer Fisik
                </h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Buka dialog cetak peramban ke perangkat printer fisik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => onPrint(), 200);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-xs font-bold rounded-full shadow-xs flex items-center justify-center gap-2 shrink-0 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen</span>
              </button>
            </div>
          </div>

          {/* Panduan Cetak A4 Presisi */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-slate-700 space-y-1.5">
            <div className="font-semibold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Panduan Cetak Dokumen:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
              <li>
                <strong>Tujuan / Destination:</strong> Pilih <em>"Save as PDF"</em> (Simpan sebagai PDF).
              </li>
              <li>
                <strong>Ukuran Kertas:</strong> Pilih <em>A4</em>.
              </li>
              <li>
                <strong>Tata Letak:</strong> Portrait (Tegak).
              </li>
              <li>
                <strong>Margin:</strong> Pilih <em>"None"</em> atau <em>"Default"</em>.
              </li>
              <li>
                <strong>Opsi:</strong> Centang <em>"Background graphics"</em> (Grafik latar belakang) agar garis & logo tampil sempurna.
              </li>
            </ul>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Teks Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  Salin Teks Naskah
                </>
              )}
            </button>

            <button
              onClick={handleDownloadBackup}
              className="px-3.5 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition"
            >
              <FileDown className="w-4 h-4 text-slate-500" />
              Cadangkan Data (JSON)
            </button>
          </div>
        </div>

        {/* Footer - Sticky & Shrink-0 */}
        <div className="px-6 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between shrink-0 sticky bottom-0 z-10">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Simpan atau unduh naskah dinas sebelum menutup dialog
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-xs font-bold text-slate-700 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-500" />
            <span>Tutup</span>
          </button>
        </div>
      </div>

      {/* Jendela Pop-up PDF dengan Hand Tool & Zoom */}
      <PdfPreviewModal
        isOpen={isPdfPreviewOpen}
        onClose={() => setIsPdfPreviewOpen(false)}
        data={data}
        paperSize={paperSize}
        margins={getActiveMargins()}
        fontSizePt={fontSizePt}
        lineSpacing={1.15}
        fontFamily="times"
      />
    </div>
  );
};
