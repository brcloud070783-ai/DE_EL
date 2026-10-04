import React, { useState } from 'react';
import { TelaahanStafData, ActiveTab, KopSurat } from '../types';
import { OfficialKop } from './OfficialKop';
import {
  Building2,
  Upload,
  RotateCcw,
  CheckCircle2,
  FileText,
  Eye,
  ArrowLeft,
  Home,
  Sparkles,
  Info,
  Layers,
  MapPin,
  Phone,
  Landmark,
} from 'lucide-react';

interface InformasiUmumViewProps {
  data: TelaahanStafData;
  onChange: (updatedData: TelaahanStafData) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

const PRESET_INSTANSI: { label: string; kop: KopSurat }[] = [
  {
    label: 'Disdikbud Prov. Kaltara (Standar)',
    kop: {
      namaInstansiAtas: 'PEMERINTAH PROVINSI KALIMANTAN UTARA',
      namaDinas: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
      alamat: 'Jl. Kol. Soetadji No. 1 (Gedung Gabungan Dinas II, Lt. 1), Kode Pos 77212',
      teleponFaks: 'Telp/Faks: (0552) 2020530',
      poselEmail: 'disdikbud@kaltaraprov.go.id',
      ibuKota: 'TANJUNG SELOR',
      logoType: 'kaltara',
    },
  },
  {
    label: 'Bappeda & Litbang Prov. Kaltara',
    kop: {
      namaInstansiAtas: 'PEMERINTAH PROVINSI KALIMANTAN UTARA',
      namaDinas: 'BADAN PERENCANAAN PEMBANGUNAN DAERAH DAN PENELITIAN PENGEMBANGAN',
      alamat: 'Jl. Rambutan No. 1, Gedung Gadis Lt. 3, Tanjung Selor, Kode Pos 77212',
      teleponFaks: 'Telp/Faks: (0552) 21102',
      poselEmail: 'bappeda@kaltaraprov.go.id',
      ibuKota: 'TANJUNG SELOR',
      logoType: 'kaltara',
    },
  },
  {
    label: 'Inspektorat Daerah Prov. Kaltara',
    kop: {
      namaInstansiAtas: 'PEMERINTAH PROVINSI KALIMANTAN UTARA',
      namaDinas: 'INSPEKTORAT DAERAH',
      alamat: 'Jl. Kol. Soetadji No. 1, Gedung Gabungan Dinas I, Tanjung Selor, Kode Pos 77212',
      teleponFaks: 'Telp/Faks: (0552) 22001',
      poselEmail: 'inspektorat@kaltaraprov.go.id',
      ibuKota: 'TANJUNG SELOR',
      logoType: 'kaltara',
    },
  },
  {
    label: 'Kementerian / Badan Nasional (Garuda)',
    kop: {
      namaInstansiAtas: 'REPUBLIK INDONESIA',
      namaDinas: 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI',
      alamat: 'Jl. Jenderal Sudirman, Senayan, Jakarta Pusat, Kode Pos 10270',
      teleponFaks: 'Telp: (021) 5711144',
      poselEmail: 'pengaduan@kemdikbud.go.id',
      ibuKota: 'JAKARTA',
      logoType: 'garuda',
    },
  },
];

export const InformasiUmumView: React.FC<InformasiUmumViewProps> = ({
  data,
  onChange,
  setActiveTab,
}) => {
  const [saveToast, setSaveToast] = useState(false);

  const updateKop = (field: keyof KopSurat, value: string) => {
    onChange({
      ...data,
      kop: {
        ...data.kop,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file logo maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        onChange({
          ...data,
          kop: {
            ...data.kop,
            logoType: 'custom',
            customLogoUrl: result,
          },
          updatedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (presetKop: KopSurat) => {
    onChange({
      ...data,
      kop: {
        ...presetKop,
      },
      updatedAt: new Date().toISOString(),
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Top Header Card - Canva Aesthetic */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7F56D9] flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  Informasi Umum &amp; Kop Instansi
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-purple-50 text-[#7F56D9] rounded-full">
                  Master Data
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed font-medium">
                Pengaturan identitas instansi, lambang resmi, dan alamat kop naskah dinas.
              </p>
            </div>
          </div>

          {/* Action Switchers - Option 2 Minimalist Obsidian Stack */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('launcher')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex flex-col items-center justify-center transition active:scale-95 cursor-pointer touch-manipulation border border-slate-200/80"
              title="Kembali ke Beranda"
            >
              <Home className="w-4 h-4 text-slate-700 transition" />
              <span className="text-[9.5px] font-bold leading-tight mt-0.5">Beranda</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex flex-col items-center justify-center transition active:scale-95 cursor-pointer touch-manipulation border border-slate-200/80"
              title="Ke Editor Formulir"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span className="text-[9.5px] font-bold leading-tight mt-0.5">Formulir</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex flex-col items-center justify-center transition active:scale-95 cursor-pointer touch-manipulation shadow-xs"
              title="Pratinjau Lembar A4"
            >
              <Eye className="w-4 h-4 text-slate-100" />
              <span className="text-[9.5px] font-extrabold leading-tight mt-0.5">Pratinjau A4</span>
            </button>
          </div>
        </div>

        {/* Quick Presets - Canva Rounded Pills */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Preset Instansi:
          </span>
          {PRESET_INSTANSI.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.kop)}
              className={`px-3 py-1.5 text-xs rounded-full border transition font-bold cursor-pointer touch-manipulation shadow-2xs ${
                data.kop.namaDinas === preset.kop.namaDinas
                  ? 'bg-purple-50 border-[#7F56D9] text-[#7F56D9]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Configuration Form Card */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-6">
        {/* Section 1: Logo Kop Surat */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                1. Lambang Instansi Resmi
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pilih lambang baku atau unggah berkas logo instansi (PNG/JPG).
              </p>
            </div>
            {data.kop.logoType === 'custom' && data.kop.customLogoUrl && (
              <button
                type="button"
                onClick={() => updateKop('logoType', 'kaltara')}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Kembalikan Logo Kaltara
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => updateKop('logoType', 'kaltara')}
              className={`p-3.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-2 transition cursor-pointer touch-manipulation ${
                data.kop.logoType === 'kaltara'
                  ? 'border-[#7F56D9] bg-gradient-to-b from-purple-50 to-indigo-50/50 text-[#7F56D9] ring-2 ring-[#7F56D9]/20 shadow-xs font-extrabold'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                🛡️
              </div>
              <div className="text-center">
                <span className="font-extrabold block text-xs">Prov. Kaltara</span>
                <span className="text-[10.5px] text-slate-400">(Benuanta Kaltara)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => updateKop('logoType', 'garuda')}
              className={`p-3.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-2 transition cursor-pointer touch-manipulation ${
                data.kop.logoType === 'garuda'
                  ? 'border-[#7F56D9] bg-gradient-to-b from-purple-50 to-indigo-50/50 text-[#7F56D9] ring-2 ring-[#7F56D9]/20 shadow-xs font-extrabold'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                🦅
              </div>
              <div className="text-center">
                <span className="font-extrabold block text-xs">Garuda Pancasila</span>
                <span className="text-[10.5px] text-slate-400">(Republik Indonesia)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => updateKop('logoType', 'kemendikbud')}
              className={`p-3 rounded-2xl border text-xs font-medium flex flex-col items-center gap-2 transition cursor-pointer touch-manipulation ${
                data.kop.logoType === 'kemendikbud'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs font-bold'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                🎓
              </div>
              <div className="text-center">
                <span className="font-bold block text-xs">Kemendikbud</span>
                <span className="text-[10.5px] text-slate-500">(Tut Wuri Handayani)</span>
              </div>
            </button>

            <label
              className={`p-3 rounded-2xl border text-xs font-medium flex flex-col items-center justify-center gap-2 cursor-pointer transition touch-manipulation ${
                data.kop.logoType === 'custom'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs font-bold'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="font-bold block text-xs">Unggah Logo</span>
                <span className="text-[10.5px] text-slate-500">PNG / JPG Kustom</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomLogoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Identitas Instansi */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Nama Pemerintah &amp; Perangkat Daerah
            </h2>
            <p className="text-[11px] text-slate-500">
              Dicetak huruf kapital tebal pada baris atas kop naskah dinas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pemerintah Daerah (Provinsi / Kabupaten / Kota)
              </label>
              <input
                type="text"
                value={data.kop.namaInstansiAtas}
                onChange={(e) => updateKop('namaInstansiAtas', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 uppercase tracking-wide font-medium bg-slate-50/40 hover:bg-white focus:bg-white transition"
                placeholder="PEMERINTAH PROVINSI KALIMANTAN UTARA"
              />
              <span className="text-[10.5px] text-slate-400 mt-1 block">
                Huruf kapital tanpa singkatan.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Perangkat Daerah (Dinas / Badan)
              </label>
              <input
                type="text"
                value={data.kop.namaDinas}
                onChange={(e) => updateKop('namaDinas', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 uppercase tracking-wide font-bold bg-slate-50/40 hover:bg-white focus:bg-white transition"
                placeholder="DINAS PENDIDIKAN DAN KEBUDAYAAN"
              />
              <span className="text-[10.5px] text-slate-400 mt-1 block">
                Sesuai nomenklatur resmi perangkat daerah.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Alamat Kantor & Kontak */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Alamat, Kontak, &amp; Kota Kedudukan
            </h2>
            <p className="text-[11px] text-slate-500">
              Dicetak di atas garis batas ganda kop naskah dinas.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Alamat Kantor &amp; Kode Pos
            </label>
            <input
              type="text"
              value={data.kop.alamat}
              onChange={(e) => updateKop('alamat', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/40 hover:bg-white focus:bg-white transition"
              placeholder="Jl. Kol. Soetadji No. 1 (Gedung Gabungan Dinas II, Lt. 1), Kode Pos 77212"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Telepon / Faks &amp; Posel Resmi
              </label>
              <input
                type="text"
                value={data.kop.teleponFaks}
                onChange={(e) => updateKop('teleponFaks', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/40 hover:bg-white focus:bg-white transition"
                placeholder="Telp/Faks: (0552) 2020530 / posel: disdikbud@kaltaraprov.go.id"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                Kota Kedudukan
              </label>
              <input
                type="text"
                value={data.kop.ibuKota}
                onChange={(e) => updateKop('ibuKota', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 uppercase tracking-wider font-bold bg-slate-50/40 hover:bg-white focus:bg-white transition"
                placeholder="TANJUNG SELOR"
              />
              <span className="text-[10.5px] text-slate-400 mt-1 block">
                Dicetak tebal di baris penutup kop naskah dinas.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Pratinjau Kop Surat Resmi */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Pratinjau Kop Naskah Dinas
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Tampilan kop tercetak pada halaman pertama naskah dinas.
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-50 text-[#7F56D9] border border-purple-200/80 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7F56D9]" />
            Tinjauan Langsung
          </span>
        </div>

        {/* Rendered Kop in white paper container with shadow */}
        <div className="p-5 sm:p-8 bg-slate-50/70 rounded-2xl border border-slate-100">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl mx-auto">
            <OfficialKop kop={data.kop} />
            <div className="text-center pt-4 text-xs text-slate-400 italic">
              [Isi naskah telaahan staf, SPT, atau SPPD tercetak di bawah garis kop]
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-purple-50/60 border border-purple-200/70 rounded-2xl text-xs text-purple-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#7F56D9] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Penyimpanan Otomatis:</strong> Perubahan kop instansi langsung tersimpan dan diterapkan pada formulir serta cetakan lembar A4.
          </span>
        </div>
      </div>

      {/* Bottom Floating Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Pengaturan kop naskah berhasil diterapkan.</span>
        </div>
      )}
    </div>
  );
};
