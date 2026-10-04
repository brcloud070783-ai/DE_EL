import React from 'react';
import { Layers, CheckCircle2, ArrowRight, Clock, FileSpreadsheet, HardDrive, Shield } from 'lucide-react';

interface RoadmapBannerProps {
  onSelectPhase?: (phase: number) => void;
}

export const RoadmapBanner: React.FC<RoadmapBannerProps> = () => {
  const steps = [
    {
      no: 1,
      title: 'Telaahan Staf',
      desc: 'Form telaah analisis kebutuhan & output cetak PDF resmi format Gambar 1 & 2',
      status: 'active', // active
      icon: CheckCircle2,
    },
    {
      no: 2,
      title: 'Surat Tugas (SPT)',
      desc: 'Penerbitan surat perintah tugas pimpinan berdasarkan telaahan yang disetujui',
      status: 'next',
      icon: Clock,
    },
    {
      no: 3,
      title: 'SPPD Lembar I & II',
      desc: 'Surat Perintah Perjalanan Dinas, rincian angkutan, & lembar cap kedatangan',
      status: 'upcoming',
      icon: Clock,
    },
    {
      no: 4,
      title: 'Kuitansi & Laporan Riil',
      desc: 'Rincian biaya riil (tiket, hotel, uang harian) & laporan pelaksanaan',
      status: 'upcoming',
      icon: Clock,
    },
    {
      no: 5,
      title: 'Google Drive & Sheets Sync',
      desc: 'Otomatisasi backend GAS, database Google Sheets & folder Drive per pegawai',
      status: 'cloud',
      icon: HardDrive,
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7F56D9] to-[#4F46E5] text-white flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7F56D9]">
              Alur Naskah Perjalanan Dinas
            </span>
            <h3 className="text-sm font-extrabold text-slate-900">
              Tahap 1: Formulir Telaahan Staf &amp; Cetak PDF Resmi
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Tahap 1 Aktif
        </span>
      </div>

      {/* Horizontal Step Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.status === 'active';
          return (
            <div
              key={step.no}
              className={`p-3.5 rounded-2xl border transition ${
                isActive
                  ? 'bg-purple-50/70 border-purple-200 ring-2 ring-[#7F56D9]/30 text-slate-900 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-100 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#7F56D9] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Tahap {step.no}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#7F56D9]' : 'text-slate-400'
                  }`}
                />
              </div>
              <div className="text-xs font-extrabold text-slate-900 truncate">{step.title}</div>
              <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-1">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
