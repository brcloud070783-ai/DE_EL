import React from 'react';
import { KopSurat, MarginPresetType } from '../types';

interface OfficialKopProps {
  kop: KopSurat;
  marginPreset?: MarginPresetType;
  style?: React.CSSProperties;
  className?: string;
}

export const OfficialKop: React.FC<OfficialKopProps> = ({ kop, marginPreset = 'narrow', style, className = '' }) => {
  const isCompact = marginPreset === 'normal' || marginPreset === 'moderate';
  const isWide = marginPreset === 'wide';

  const logoContainerSize = isWide ? 'w-16 h-16' : isCompact ? 'w-20 h-20' : 'w-24 h-24';
  const logoSvgSize = isWide ? 'w-14 h-14' : isCompact ? 'w-16 h-16' : 'w-20 h-20';
  const titleInstansiSize = isWide ? 'text-[10.5pt]' : isCompact ? 'text-[11.5pt]' : 'text-[13pt]';
  const titleDinasSize = isWide ? 'text-[12pt]' : isCompact ? 'text-[13.5pt]' : 'text-[15pt]';
  const addressSize = isWide ? 'text-[7.5pt]' : isCompact ? 'text-[8.2pt]' : 'text-[9pt]';
  const citySize = isWide ? 'text-[8.5pt]' : isCompact ? 'text-[9pt]' : 'text-[10pt]';

  return (
    <div className={`w-full text-black ${className}`.trim()} style={style}>
      {/* Container Kop: Logo kiri, Teks tengah */}
      <div className="flex items-center justify-between gap-3 pb-1.5">
        {/* Logo */}
        <div className={`${logoContainerSize} flex-shrink-0 flex items-center justify-center`}>
          {kop.logoType === 'kaltara' && (
            <svg
              viewBox="0 0 100 100"
              className={logoSvgSize}
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Lambang Provinsi Kalimantan Utara"
            >
              {/* Shield Outline */}
              <path
                d="M50 4 C68 4, 86 12, 86 28 C86 64, 50 94, 50 94 C50 94, 14 64, 14 28 C14 12, 32 4, 50 4 Z"
                fill="#15803d"
                stroke="#ca8a04"
                strokeWidth="3"
              />
              {/* Inner Shield */}
              <path
                d="M50 10 C64 10, 80 17, 80 30 C80 60, 50 86, 50 86 C50 86, 20 60, 20 30 C20 17, 36 10, 50 10 Z"
                fill="#0284c7"
                stroke="#facc15"
                strokeWidth="1.5"
              />
              {/* Traditional Motif / Mandau & Perisai stylization */}
              <path d="M50 16 L53 25 L62 25 L55 31 L58 40 L50 34 L42 40 L45 31 L38 25 L47 25 Z" fill="#facc15" />
              {/* Bintang Emas */}
              <polygon points="50,14 52,20 58,20 53,24 55,30 50,26 45,30 47,24 42,20 48,20" fill="#fef08a" />
              {/* Waves (Sungai Kaltara) */}
              <path
                d="M24 60 Q37 54, 50 60 T76 60 Q80 68, 50 84 Q20 68, 24 60 Z"
                fill="#0369a1"
                opacity="0.9"
              />
              <path
                d="M26 66 Q38 60, 50 66 T74 66"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Pita Semboyan */}
              <path
                d="M24 74 Q50 80, 76 74 Q74 80, 50 86 Q26 80, 24 74 Z"
                fill="#ffffff"
                stroke="#ca8a04"
                strokeWidth="1"
              />
              <text x="50" y="80" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#0f172a">
                BENUANTA
              </text>
            </svg>
          )}

          {kop.logoType === 'garuda' && (
            <svg
              viewBox="0 0 100 100"
              className={logoSvgSize}
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Lambang Garuda Pancasila"
            >
              {/* Garuda Body / Wings */}
              <path
                d="M50 16 C53 20 60 22 66 18 C72 26 88 32 94 48 C85 52 74 54 68 56 C74 64 72 74 64 82 C58 76 56 68 50 72 C44 68 42 76 36 82 C28 74 26 64 32 56 C26 54 15 52 6 48 C12 32 28 26 34 18 C40 22 47 20 50 16 Z"
                fill="#d97706"
                stroke="#b45309"
                strokeWidth="1.5"
              />
              {/* Shield */}
              <path
                d="M50 36 C60 36, 64 42, 64 54 C64 68, 50 78, 50 78 C50 78, 36 68, 36 54 C36 42, 40 36, 50 36 Z"
                fill="#dc2626"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <path
                d="M50 36 L50 78 M36 55 L64 55"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <circle cx="50" cy="55" r="4" fill="#facc15" />
              {/* Pita Bhinneka Tunggal Ika */}
              <path
                d="M26 84 Q50 90, 74 84 L72 88 Q50 94, 28 88 Z"
                fill="#f8fafc"
                stroke="#334155"
                strokeWidth="1"
              />
            </svg>
          )}

          {kop.logoType === 'kemendikbud' && (
            <svg
              viewBox="0 0 100 100"
              className={logoSvgSize}
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Lambang Tut Wuri Handayani"
            >
              <polygon
                points="50,6 94,36 78,88 22,88 6,36"
                fill="#0284c7"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <circle cx="50" cy="46" r="16" fill="#facc15" />
              <path d="M44 48 L50 34 L56 48 L42 39 L58 39 Z" fill="#b45309" />
              <path d="M34 68 Q50 60, 66 68 Q50 76, 34 68 Z" fill="#ffffff" />
            </svg>
          )}

          {kop.logoType === 'custom' && kop.customLogoUrl && (
            <img
              src={kop.customLogoUrl}
              alt="Logo Instansi"
              className={`${logoSvgSize} object-contain`}
            />
          )}
        </div>

        {/* Kop Text Info */}
        <div className="flex-1 text-center font-serif leading-tight">
          <h2 className={`${titleInstansiSize} font-semibold tracking-wider uppercase text-black`}>
            {kop.namaInstansiAtas}
          </h2>
          <h1 className={`${titleDinasSize} font-bold tracking-wide uppercase text-black my-0.5`}>
            {kop.namaDinas}
          </h1>
          <p className={`${addressSize} text-slate-800 leading-normal`}>
            Alamat: {kop.alamat}
          </p>
          <p className={`${addressSize} text-slate-800 leading-normal`}>
            {kop.teleponFaks} {kop.poselEmail ? `Posel: ${kop.poselEmail}` : ''}
          </p>
          <p className={`${citySize} font-bold tracking-widest uppercase text-black mt-0.5`}>
            {kop.ibuKota}
          </p>
        </div>

        {/* Penyeimbang simetri kanan agar teks instansi tetap presisi tepat di tengah */}
        <div className={`${logoContainerSize} flex-shrink-0 hidden sm:block`} />
      </div>

      {/* Garis Pembatas Kop Surat Resmi Standar Pemerintah: Garis Tebal (2.5px) & Garis Tipis (1px) */}
      <div className="w-full mt-0.5">
        <div className="border-b-[2px] border-black" />
        <div className="border-b-[1px] border-black mt-[1.5px]" />
      </div>
    </div>
  );
};
