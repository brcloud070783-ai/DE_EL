import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import {
  X,
  UserCheck,
  Building,
  Save,
  Check,
  Shield,
  Briefcase,
  Users,
  CreditCard,
} from 'lucide-react';

interface PejabatModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
  onUpdatePejabat: (updates: {
    jabatanPimpinan: string;
    namaPembuat: string;
    nipPembuat: string;
    pangkatPembuat: string;
    jabatanPembuat: string;
  }) => void;
}

export const PejabatModal: React.FC<PejabatModalProps> = ({
  isOpen,
  onClose,
  data,
  onUpdatePejabat,
}) => {
  const [jabatanPimpinan, setJabatanPimpinan] = useState(
    data.disposisi.jabatanPimpinan || 'Plh. KEPALA DINAS PENDIDIKAN DAN KEBUDAYAAN'
  );
  const [namaPimpinan, setNamaPimpinan] = useState('Drs. H. TEGUH HARIYANTO, M.Pd.');
  const [nipPimpinan, setNipPimpinan] = useState('19680512 199403 1 005');
  const [pangkatPimpinan, setPangkatPimpinan] = useState('Pembina Utama Muda (IV/c)');

  // Pengguna Anggaran (PA)
  const [namaPA, setNamaPA] = useState('Dr. JONSON, M.Pd.');
  const [nipPA, setNipPA] = useState('19720315 199802 1 004');
  const [pangkatPA, setPangkatPA] = useState('Pembina Tingkat I (IV/b)');

  // PPTK / Pembuat Telaahan
  const [namaPPTK, setNamaPPTK] = useState(data.kaki.namaPembuat);
  const [nipPPTK, setNipPPTK] = useState(data.kaki.nipPembuat);
  const [pangkatPPTK, setPangkatPPTK] = useState(data.kaki.pangkatPembuat);
  const [jabatanPPTK, setJabatanPPTK] = useState(data.kaki.jabatanPembuat);

  // Bendahara Pengeluaran
  const [namaBendahara, setNamaBendahara] = useState('SITI NURHALIZA, S.E.');
  const [nipBendahara, setNipBendahara] = useState('19850620 201001 2 018');

  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePejabat({
      jabatanPimpinan,
      namaPembuat: namaPPTK,
      nipPembuat: nipPPTK,
      pangkatPembuat: pangkatPPTK,
      jabatanPembuat: jabatanPPTK,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] sm:my-auto animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Header - Sticky Canva Gradient */}
        <div className="bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-[#4F46E5] px-6 py-4 text-white flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Master Pejabat &amp; Penandatangan
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  Master Data
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium">
                Data pimpinan instansi, PA/KPA, PPTK, dan bendahara pengeluaran.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* 1. Kepala Dinas / Pimpinan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>1. Pimpinan Instansi (Penandatangan SPT)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Jabatan Pimpinan
                </label>
                <input
                  type="text"
                  value={jabatanPimpinan}
                  onChange={(e) => setJabatanPimpinan(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Plh. KEPALA DINAS PENDIDIKAN DAN KEBUDAYAAN"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nama Pejabat Pimpinan
                </label>
                <input
                  type="text"
                  value={namaPimpinan}
                  onChange={(e) => setNamaPimpinan(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIP Pimpinan</label>
                <input
                  type="text"
                  value={nipPimpinan}
                  onChange={(e) => setNipPimpinan(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pangkat / Golongan</label>
                <input
                  type="text"
                  value={pangkatPimpinan}
                  onChange={(e) => setPangkatPimpinan(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 2. Pengguna Anggaran (PA) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>2. Pengguna Anggaran (PA/KPA)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama PA/KPA</label>
                <input
                  type="text"
                  value={namaPA}
                  onChange={(e) => setNamaPA(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIP PA/KPA</label>
                <input
                  type="text"
                  value={nipPA}
                  onChange={(e) => setNipPA(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pangkat / Golongan</label>
                <input
                  type="text"
                  value={pangkatPA}
                  onChange={(e) => setPangkatPA(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 3. PPTK / Pembuat Telaahan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>3. Pembuat Telaahan / PPTK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Jabatan Kedinasan
                </label>
                <input
                  type="text"
                  value={jabatanPPTK}
                  onChange={(e) => setJabatanPPTK(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={namaPPTK}
                  onChange={(e) => setNamaPPTK(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIP PPTK</label>
                <input
                  type="text"
                  value={nipPPTK}
                  onChange={(e) => setNipPPTK(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pangkat / Golongan</label>
                <input
                  type="text"
                  value={pangkatPPTK}
                  onChange={(e) => setPangkatPPTK(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 4. Bendahara Pengeluaran */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>4. Bendahara Pengeluaran</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Bendahara</label>
                <input
                  type="text"
                  value={namaBendahara}
                  onChange={(e) => setNamaBendahara(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIP Bendahara</label>
                <input
                  type="text"
                  value={nipBendahara}
                  onChange={(e) => setNipBendahara(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
          </div>

          {/* Footer Actions - Sticky */}
          <div className="px-6 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between shrink-0 sticky bottom-0 z-10">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Tersinkronisasi ke seluruh naskah dinas
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 text-xs font-bold rounded-full transition flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>Batal</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] hover:opacity-95 active:scale-95 text-white text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition cursor-pointer"
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'Tersimpan' : 'Simpan Data'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
