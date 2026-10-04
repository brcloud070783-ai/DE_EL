import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import { X, Camera, Printer, Upload, Image as ImageIcon, Trash2, CheckCircle } from 'lucide-react';

interface FotoDokumentasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
}

interface PhotoItem {
  id: string;
  title: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  url: string;
}

export const FotoDokumentasiModal: React.FC<FotoDokumentasiModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: '1',
      title: 'Foto 1: Keberangkatan Tim Perjadin',
      deskripsi: 'Keberangkatan tim pendamping Disdikbud Kaltara melalui Pelabuhan Speedboat Kayan II Tanjung Selor.',
      tanggal: data.kesimpulan.tanggal.split('s.d.')[0]?.trim() || '2026',
      lokasi: 'Pelabuhan Kayan II, Tanjung Selor',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      title: 'Foto 2: Registrasi & Kedatangan di Lokasi',
      deskripsi: `Pendaftaran dan verifikasi administrasi personil di lokasi kegiatan ${data.kesimpulan.tempat}.`,
      tanggal: data.kesimpulan.tanggal.split('s.d.')[0]?.trim() || '2026',
      lokasi: data.kesimpulan.tempat,
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '3',
      title: 'Foto 3: Pelaksanaan Pendampingan Kegiatan',
      deskripsi: `Pelaksanaan tugas pendampingan teknis dan monitoring pelaksanaan: ${data.header.hal.substring(0, 80)}...`,
      tanggal: data.kesimpulan.tanggal,
      lokasi: data.kesimpulan.tempat,
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '4',
      title: 'Foto 4: Evaluasi & Penutupan Kegiatan',
      deskripsi: 'Evaluasi akhir bersama panitia penyelenggara dan penyerahan berkas sertifikasi/kehadiran tugas.',
      tanggal: data.kesimpulan.tanggal.split('s.d.')[1]?.trim() || '2026',
      lokasi: data.kesimpulan.tempat,
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, url: uploadEvent.target!.result as string } : p
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateCaption = (id: string, field: 'deskripsi' | 'lokasi', val: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] sm:my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Header - Sticky Canva Gradient */}
        <div className="bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-[#4F46E5] px-6 py-4 text-white flex items-center justify-between print:hidden shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Dokumentasi Foto Perjalanan Dinas
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  Lampiran SPJ
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium">
                Bukti visual kegiatan kedinasan untuk pertanggungjawaban SPJ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-[#7F56D9] hover:bg-purple-50 active:scale-95 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4</span>
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
          {/* Instruction Note */}
          <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200 text-xs text-cyan-900 flex items-center justify-between print:hidden">
            <span>
              💡 <strong>Petunjuk:</strong> Unggah foto dokumentasi dan sesuaikan keterangan kegiatan pada setiap kolom.
            </span>
          </div>

          {/* Document Sheet Layout (A4 Friendly) */}
          <div className="border border-slate-300 p-6 rounded-xl bg-white space-y-4 text-slate-900 text-xs">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <div className="font-bold tracking-wider text-xs">
                PEMERINTAH PROVINSI KALIMANTAN UTARA
              </div>
              <div className="font-bold text-sm">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </div>
              <div className="text-[11px] text-slate-600">
                Jl. Agathis No. 01, Tanjung Selor, Kode Pos 77212
              </div>
            </div>

            <div className="text-center font-bold text-sm underline pt-2">
              DOKUMENTASI FOTO PELAKSANAAN PERJALANAN DINAS
            </div>
            <div className="text-center text-[11px] text-slate-600">
              Lampiran SPT No: {data.header.nomorSurat}
            </div>

            {/* 2x2 Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {photos.map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-slate-300 rounded-xl p-3 bg-slate-50 flex flex-col justify-between space-y-2"
                >
                  <div className="aspect-video w-full bg-slate-200 rounded-lg overflow-hidden relative group">
                    <img
                      src={item.url}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white text-xs font-bold gap-1.5 print:hidden">
                      <Upload className="w-4 h-4" />
                      <span>Ganti Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, item.id)}
                      />
                    </label>
                  </div>

                  <div className="space-y-1 text-slate-700">
                    <div className="font-bold text-slate-900 flex justify-between items-center text-[11px]">
                      <span>{item.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{item.tanggal}</span>
                    </div>

                    <textarea
                      rows={2}
                      value={item.deskripsi}
                      onChange={(e) => handleUpdateCaption(item.id, 'deskripsi', e.target.value)}
                      className="w-full text-[11px] p-1.5 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-teal-500 focus:outline-hidden resize-none print:border-none print:p-0 print:bg-transparent"
                    />

                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                      <span>Lokasi:</span>
                      <input
                        type="text"
                        value={item.lokasi}
                        onChange={(e) => handleUpdateCaption(item.id, 'lokasi', e.target.value)}
                        className="flex-1 text-[10px] bg-transparent border-b border-dashed border-slate-300 focus:outline-hidden print:border-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Area */}
            <div className="pt-6 flex justify-end text-center text-xs">
              <div className="w-64 space-y-12">
                <div>
                  Tanjung Selor, {data.kaki.tempatTanggal.split(',')[1] || '2026'}<br />
                  <strong>Pelaksana Tugas Perjalanan Dinas</strong>
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

        {/* Footer - Sticky Canva Pill style */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between print:hidden shrink-0 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7F56D9]" />
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Lampiran Foto Dokumentasi Perjalanan Dinas Resmi A4
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
