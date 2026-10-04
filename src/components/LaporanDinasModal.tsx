import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import {
  X,
  Printer,
  Sparkles,
  Copy,
  Check,
  FileText,
  RefreshCw,
  Award,
  Calendar,
  MapPin,
  Users,
} from 'lucide-react';

interface LaporanDinasModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
}

export const LaporanDinasModal: React.FC<LaporanDinasModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate initial narrative based on current telaahan
  const [hasilKegiatan, setHasilKegiatan] = useState<string>(
    `1. Pelaksanaan kegiatan penugasan "${data.header.hal}" di ${data.kesimpulan.tempat} telah terlaksana dengan lancar dan tertib sesuai jadwal yang ditetapkan (${data.kesimpulan.tanggal}).\n` +
    `2. Tim perwakilan Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara telah mendampingi seluruh peserta kontingen sebanyak ${data.kesimpulan.personil.length} personil, memastikan kesiapan fisik, mental, serta perlengkapan teknis lomba/agenda kerja.\n` +
    `3. Seluruh tahapan technical meeting, registrasi administrasi, serta evaluasi harian berjalan kondusif tanpa kendala berarti dengan koordinasi intensif bersama panitia pelaksana.\n` +
    `4. Kontingen Kaltara berhasil menyelesaikan seluruh rangkaian agenda dengan penuh integritas dan membawa hasil capaian yang optimal bagi kemajuan pendidikan Kalimantan Utara.`
  );

  const [kendala, setKendala] = useState<string>(
    `1. Jadwal transportasi antarpulau dan penyeberangan speedboat yang sangat bergantung pada pasang surut air muara sungai serta kondisi cuaca lokal Kalimantan Utara.\n` +
    `2. Perlunya sinkronisasi lebih awal terkait jadwal pembinaan intensif peserta sebelum diberangkatkan ke tingkat nasional.`
  );

  const [rekomendasi, setRekomendasi] = useState<string>(
    `1. Diperlukan pengalokasian anggaran pembinaan berkala serta karantina pelatihan (training center) minimal 2 pekan sebelum penugasan nasional berikutnya.\n` +
    `2. Memperkuat koordinasi lintas dinas kabupaten/kota se-Kalimantan Utara guna menjaring talenta pendidik dan peserta didik unggulan sejak dini.\n` +
    `3. Laporan ini disampaikan kepada Plh. Kepala Dinas sebagai bahan pertimbangan kebijakan pembinaan bidang pendidikan di masa mendatang.`
  );

  if (!isOpen) return null;

  const handleRegenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setHasilKegiatan(
        `1. Segenap target operasional penugasan naskah nomor ${data.header.nomorSurat} perihal "${data.header.hal}" telah tercapai 100% di lokasi ${data.kesimpulan.tempat}.\n` +
        `2. Pelaksanaan pendampingan personil (${data.kesimpulan.personil.map((p) => p.nama).join(', ')}) berlangsung optimal dengan kepatuhan administrasi penuh.\n` +
        `3. Telah dilakukan penandatanganan berita acara kehadiran, lembar visum SPPD di instansi tujuan, serta penyerahan rekomendasi teknis pembelajaran.\n` +
        `4. Dokumentasi fisik dan digital tersimpan rapi sebagai bahan pertanggungjawaban akuntabilitas kinerja instansi pemerintah (AKIP).`
      );
      setIsGenerating(false);
    }, 900);
  };

  const handleCopyText = () => {
    const fullText = `LAPORAN PELAKSANAAN TUGAS PERJALANAN DINAS
Nomor: ${data.header.nomorSurat}
Hal: ${data.header.hal}
Lokasi: ${data.kesimpulan.tempat}
Waktu: ${data.kesimpulan.selama} (${data.kesimpulan.tanggal})

I. DASAR PELAKSANAAN
Surat Perintah Tugas (SPT) Nomor: ${data.header.nomorSurat}

II. MAKSUD DAN TUJUAN
${data.header.hal}

III. HASIL PELAKSANAAN
${hasilKegiatan}

IV. KENDALA DAN HAMBATAN
${kendala}

V. KESIMPULAN DAN SARAN
${rekomendasi}

Tanjung Selor, ${data.kaki.tempatTanggal.split(',')[1] || '2026'}
Pelaksana Tugas,
${data.kesimpulan.personil[0]?.nama || data.kaki.namaPembuat}
NIP. ${data.kesimpulan.personil[0]?.nip || data.kaki.nipPembuat}`;

    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] sm:my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Header - Sticky Canva Gradient */}
        <div className="bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-[#4F46E5] px-6 py-4 text-white flex items-center justify-between print:hidden shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Laporan Hasil Perjalanan Dinas
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  Otomatis
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium">
                Sintesis laporan hasil pelaksanaan perjalanan dinas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRegenerateAI}
              disabled={isGenerating}
              className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isGenerating ? 'Menyusun...' : 'Susun Ulang'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-white text-[#7F56D9] hover:bg-purple-50 active:scale-95 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak A4</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* AI Banner Prompt Card */}
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3 text-xs text-amber-900 print:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Laporan disusun otomatis dari data telaahan staf dan penugasan dinas. Narasi dapat disunting langsung.
              </span>
            </div>
          </div>

          {/* Printable Document A4 Form */}
          <div className="border border-slate-300 p-6 rounded-xl bg-white space-y-4 font-serif text-slate-900 text-xs leading-relaxed">
            {/* Kop Surat Header */}
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <div className="font-bold tracking-wider text-xs">
                PEMERINTAH PROVINSI KALIMANTAN UTARA
              </div>
              <div className="font-bold text-sm">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </div>
              <div className="text-[11px] font-sans text-slate-600">
                Jl. Agathis No. 01, Tanjung Selor, Provinsi Kalimantan Utara
              </div>
            </div>

            <div className="text-center font-bold text-sm underline pt-2">
              LAPORAN HASIL PELAKSANAAN TUGAS PERJALANAN DINAS
            </div>

            {/* Identitas Laporan */}
            <div className="space-y-1.5 pt-1 font-sans text-xs">
              <div className="grid grid-cols-12 py-0.5">
                <div className="col-span-3 font-semibold text-slate-700">Kepada Yth.</div>
                <div className="col-span-9 font-semibold">: {data.header.yth}</div>
              </div>
              <div className="grid grid-cols-12 py-0.5">
                <div className="col-span-3 font-semibold text-slate-700">Dari</div>
                <div className="col-span-9">: {data.header.dari}</div>
              </div>
              <div className="grid grid-cols-12 py-0.5">
                <div className="col-span-3 font-semibold text-slate-700">Tanggal</div>
                <div className="col-span-9">: {data.kaki.tempatTanggal.split(',')[1]?.trim() || data.header.tanggalSurat}</div>
              </div>
              <div className="grid grid-cols-12 py-0.5">
                <div className="col-span-3 font-semibold text-slate-700">Perihal</div>
                <div className="col-span-9 font-semibold">: Laporan Pelaksanaan Perjalanan Dinas dalam rangka {data.header.hal}</div>
              </div>
            </div>

            <hr className="border-slate-300 my-2" />

            {/* Bab I: Dasar Pelaksanaan */}
            <div className="space-y-1">
              <div className="font-bold uppercase tracking-wider text-[11px] font-sans text-slate-800">
                I. DASAR PELAKSANAAN TUGAS
              </div>
              <p className="text-justify indent-6">
                Surat Perintah Tugas (SPT) Plh. Kepala Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara Nomor: <strong>{data.header.nomorSurat}</strong> tanggal {data.header.tanggalSurat}.
              </p>
            </div>

            {/* Bab II: Maksud dan Tujuan */}
            <div className="space-y-1 pt-1">
              <div className="font-bold uppercase tracking-wider text-[11px] font-sans text-slate-800">
                II. MAKSUD DAN TUJUAN
              </div>
              <p className="text-justify indent-6">
                Melaksanakan penugasan dinas resmi dalam rangka {data.header.hal} guna memastikan tercapainya indikator kinerja program pendidikan Provinsi Kalimantan Utara.
              </p>
            </div>

            {/* Bab III: Waktu, Tempat, & Personil */}
            <div className="space-y-1 pt-1 font-sans">
              <div className="font-bold uppercase tracking-wider text-[11px] text-slate-800">
                III. WAKTU, TEMPAT DAN PERSONIL
              </div>
              <div className="grid grid-cols-12 gap-1 text-[11px] pl-4">
                <div className="col-span-3 text-slate-600">Tempat Tujuan</div>
                <div className="col-span-9 font-semibold">: {data.kesimpulan.tempat}</div>
                <div className="col-span-3 text-slate-600">Lamanya Perjalanan</div>
                <div className="col-span-9">: {data.kesimpulan.selama} ({data.kesimpulan.tanggal})</div>
                <div className="col-span-3 text-slate-600">Personil Pelaksana</div>
                <div className="col-span-9 font-semibold">
                  : {data.kesimpulan.personil.map((p, i) => `${i + 1}. ${p.nama} (${p.jabatan})`).join('; ')}
                </div>
              </div>
            </div>

            {/* Bab IV: Hasil Pelaksanaan */}
            <div className="space-y-1.5 pt-1">
              <div className="font-bold uppercase tracking-wider text-[11px] font-sans text-slate-800">
                IV. HASIL YANG DICAPAI
              </div>
              <textarea
                rows={5}
                value={hasilKegiatan}
                onChange={(e) => setHasilKegiatan(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-serif text-xs leading-relaxed focus:ring-1 focus:ring-amber-500 focus:outline-hidden resize-y print:bg-transparent print:border-none print:p-0"
              />
            </div>

            {/* Bab V: Kendala */}
            <div className="space-y-1.5 pt-1">
              <div className="font-bold uppercase tracking-wider text-[11px] font-sans text-slate-800">
                V. KENDALA DAN HAMBATAN
              </div>
              <textarea
                rows={3}
                value={kendala}
                onChange={(e) => setKendala(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-serif text-xs leading-relaxed focus:ring-1 focus:ring-amber-500 focus:outline-hidden resize-y print:bg-transparent print:border-none print:p-0"
              />
            </div>

            {/* Bab VI: Saran & Kesimpulan */}
            <div className="space-y-1.5 pt-1">
              <div className="font-bold uppercase tracking-wider text-[11px] font-sans text-slate-800">
                VI. KESIMPULAN DAN SARAN TINDAK LANJUT
              </div>
              <textarea
                rows={4}
                value={rekomendasi}
                onChange={(e) => setRekomendasi(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-serif text-xs leading-relaxed focus:ring-1 focus:ring-amber-500 focus:outline-hidden resize-y print:bg-transparent print:border-none print:p-0"
              />
            </div>

            {/* Penutup & Tanda Tangan */}
            <div className="pt-4 flex justify-end text-center font-sans text-xs">
              <div className="w-64 space-y-12">
                <div>
                  Tanjung Selor, {data.kaki.tempatTanggal.split(',')[1] || '2026'}<br />
                  <strong>Pelaksana Tugas / Tim Pendamping,</strong>
                </div>
                <div>
                  <div className="font-bold underline">
                    {data.kesimpulan.personil[0]?.nama || data.kaki.namaPembuat}
                  </div>
                  <div>NIP. {data.kesimpulan.personil[0]?.nip || data.kaki.nipPembuat}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Sticky Canva Pill style */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between print:hidden shrink-0 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7F56D9]" />
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Dokumen Laporan Hasil Perjalanan Dinas Resmi
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-xs font-bold text-slate-700 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
