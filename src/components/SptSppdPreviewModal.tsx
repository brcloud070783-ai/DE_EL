import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import {
  X,
  FileCheck,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar,
  Users,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';

interface SptSppdPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
  initialType?: 'spt' | 'sppd';
}

export const SptSppdPreviewModal: React.FC<SptSppdPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  initialType = 'spt',
}) => {
  const [docType, setDocType] = useState<'spt' | 'sppd'>(initialType);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Derive SPT & SPPD numbers & dates
  const sptNomor = data.header.nomorSurat
    ? `090 / ${data.header.nomorSurat.split('/')[1] || '0283'} / DISDIKBUD / 2026`
    : '090 / 0283 / DISDIKBUD / 2026';

  const sppdNomor = data.header.nomorSurat
    ? `094 / ${data.header.nomorSurat.split('/')[1] || '0283'} / DISDIKBUD / 2026`
    : '094 / 0283 / DISDIKBUD / 2026';

  const handleCopyText = () => {
    const text = docType === 'spt' ? generateSptText() : generateSppdText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateSptText = () => {
    return `SURAT PERINTAH TUGAS
Nomor: ${sptNomor}

Dasar:
1. ${data.persoalan[0] || 'DPA SKPD Dinas Pendidikan dan Kebudayaan Prov. Kaltara'}
2. Telaahan Staf Tanggal ${data.header.tanggalSurat} Nomor ${data.header.nomorSurat}

MEMERINTAHKAN:
Kepada:
${data.kesimpulan.personil
  .map(
    (p, i) =>
      `${i + 1}. Nama: ${p.nama}\n   NIP: ${p.nip}\n   Pangkat/Gol: ${p.pangkatGol}\n   Jabatan: ${p.jabatan}`
  )
  .join('\n\n')}

Untuk:
1. Melaksanakan perjalanan dinas dalam rangka ${data.header.hal}
2. Tempat: ${data.kesimpulan.tempat}
3. Waktu: ${data.kesimpulan.selama} (${data.kesimpulan.tanggal})
4. Melaporkan hasil pelaksanaan tugas kepada Kepala Dinas.

Ditetapkan di: ${data.kaki.tempatTanggal.split(',')[0] || 'Tanjung Selor'}
Pada tanggal: ${data.header.tanggalSurat}

${data.disposisi.jabatanPimpinan}

(.......................................)`;
  };

  const generateSppdText = () => {
    return `SURAT PERINTAH PERJALANAN DINAS (SPPD)
Nomor: ${sppdNomor}

1. Pejabat Berwenang yang memberi perintah: ${data.disposisi.jabatanPimpinan}
2. Nama Pegawai yang diperintah: ${data.kesimpulan.personil[0]?.nama || '-'}
3. a. Pangkat dan Golongan: ${data.kesimpulan.personil[0]?.pangkatGol || '-'}
   b. Jabatan / Instansi: ${data.kesimpulan.personil[0]?.jabatan || '-'}
4. Maksud Perjalanan Dinas: ${data.header.hal}
5. Alat angkutan yang dipergunakan: Angkutan Darat / Speedboat
6. a. Tempat Berangkat: Tanjung Selor
   b. Tempat Tujuan: ${data.kesimpulan.tempat}
7. a. Lamanya Perjalanan Dinas: ${data.kesimpulan.selama}
   b. Tanggal Berangkat: ${data.kesimpulan.tanggal}
8. Pengikut: ${
      data.kesimpulan.personil.length > 1
        ? data.kesimpulan.personil.slice(1).map((p) => p.nama).join(', ')
        : '-'
    }
9. Pembebanan Anggaran:
   a. Instansi: Dinas Pendidikan dan Kebudayaan Prov. Kalimantan Utara
   b. Mata Anggaran: DPA SKPD 2026`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto print:hidden">
      <div className="bg-white w-full max-w-4xl rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] sm:my-auto">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Modal Top Bar - Sticky Canva Gradient */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-[#4F46E5] text-white flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Naskah Penugasan (SPT &amp; SPPD)
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  Tahap 2 &amp; 3
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium">
                Tersinkronisasi otomatis dari telaahan staf yang disetujui.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher - Sticky below top bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50/80 shrink-0 sticky top-[68px] z-10 gap-2">
          <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-full">
            <button
              type="button"
              onClick={() => setDocType('spt')}
              className={`px-4 py-1.5 text-xs rounded-full font-bold flex items-center gap-1.5 transition cursor-pointer ${
                docType === 'spt'
                  ? 'bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Surat Tugas (SPT)</span>
            </button>

            <button
              type="button"
              onClick={() => setDocType('sppd')}
              className={`px-4 py-1.5 text-xs rounded-full font-bold flex items-center gap-1.5 transition cursor-pointer ${
                docType === 'sppd'
                  ? 'bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>SPPD Lembar I &amp; II</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Document Sheet Preview Box */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100/70">
          {docType === 'spt' ? (
            <div className="bg-white max-w-2xl mx-auto p-8 rounded-xl shadow-sm border border-slate-300 font-serif text-[11pt] text-slate-900 leading-relaxed space-y-5">
              {/* Kop SPT */}
              <div className="text-center border-b-2 border-black pb-3">
                <h4 className="font-bold text-sm tracking-wide uppercase">
                  {data.kop.namaInstansiAtas}
                </h4>
                <h3 className="font-extrabold text-base tracking-wider uppercase">
                  {data.kop.namaDinas}
                </h3>
                <p className="text-[9pt] font-sans text-slate-600">
                  {data.kop.alamat} • Telp/Fax: {data.kop.teleponFaks} • Posel: {data.kop.poselEmail}
                </p>
              </div>

              {/* Judul SPT */}
              <div className="text-center space-y-1">
                <h2 className="font-bold text-base underline uppercase tracking-wider">
                  SURAT PERINTAH TUGAS
                </h2>
                <p className="text-xs font-mono">Nomor: {sptNomor}</p>
              </div>

              {/* Dasar */}
              <div className="space-y-1 text-xs">
                <div className="font-bold">Dasar:</div>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>{data.persoalan[0] || 'DPA SKPD Dinas Pendidikan dan Kebudayaan TA 2026'}</li>
                  <li>
                    Telaahan Staf tanggal {data.header.tanggalSurat} perihal &quot;{data.header.hal}&quot;
                  </li>
                </ol>
              </div>

              {/* Memerintahkan */}
              <div className="text-center font-bold text-xs uppercase tracking-wider py-1 border-y border-dashed border-slate-300">
                MEMERINTAHKAN:
              </div>

              {/* Personil Table */}
              <div className="space-y-2 text-xs">
                <span className="font-bold">Kepada:</span>
                <table className="w-full border border-collapse border-slate-400 text-[10pt]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-400 px-2 py-1 text-center w-8">No</th>
                      <th className="border border-slate-400 px-2 py-1 text-left">Nama / NIP</th>
                      <th className="border border-slate-400 px-2 py-1 text-left">Pangkat / Gol</th>
                      <th className="border border-slate-400 px-2 py-1 text-left">Jabatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.kesimpulan.personil.map((p, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-400 px-2 py-1.5 text-center">{idx + 1}</td>
                        <td className="border border-slate-400 px-2 py-1.5">
                          <div className="font-bold">{p.nama}</div>
                          <div className="text-[8.5pt] font-mono text-slate-600">NIP. {p.nip}</div>
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5">{p.pangkatGol}</td>
                        <td className="border border-slate-400 px-2 py-1.5">{p.jabatan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Untuk */}
              <div className="space-y-1.5 text-xs text-justify">
                <span className="font-bold">Untuk:</span>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>
                    Melaksanakan perjalanan dinas dalam rangka: <strong>{data.kesimpulan.maksudPerjalanan || data.header.hal}</strong>.
                  </li>
                  <li>
                    Tempat Berangkat: <strong>{data.kesimpulan.tempatBerangkat || 'Tanjung Selor'}</strong>.
                  </li>
                  <li>
                    Tempat Tujuan: <strong>{data.kesimpulan.tempatTujuan || data.kesimpulan.tempat}</strong>.
                  </li>
                  <li>
                    Tanggal Berangkat: <strong>{data.kesimpulan.tanggalBerangkat || data.kesimpulan.tanggal}</strong>.
                  </li>
                  <li>
                    Tanggal Kembali: <strong>{data.kesimpulan.tanggalKembali || data.kesimpulan.tanggal}</strong>.
                  </li>
                  <li>
                    Melaporkan hasil pelaksanaan tugas dan menyerahkan kelengkapan SPPD kepada pimpinan setelah selesai kegiatan.
                  </li>
                </ol>
              </div>

              {/* TTD Pimpinan */}
              <div className="pt-6 flex justify-end">
                <div className="text-center w-64 space-y-1 text-xs">
                  <div>Ditetapkan di Tanjung Selor</div>
                  <div>Pada tanggal {data.header.tanggalSurat}</div>
                  <div className="font-bold pt-2">{data.disposisi.jabatanPimpinan}</div>
                  <div className="h-16 flex items-center justify-center italic text-slate-400">
                    [Tanda Tangan &amp; Cap Dinas]
                  </div>
                  <div className="font-bold underline uppercase">H. TEGUH HENDRIONO, S.Hut., M.P.</div>
                  <div className="font-mono text-[9pt]">NIP. 19741215 199903 1 004</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white max-w-2xl mx-auto p-8 rounded-xl shadow-sm border border-slate-300 font-serif text-[10pt] text-slate-900 leading-relaxed space-y-5">
              {/* Kop SPPD */}
              <div className="text-center border-b-2 border-black pb-2">
                <h4 className="font-bold text-xs uppercase">{data.kop.namaInstansiAtas}</h4>
                <h3 className="font-bold text-sm uppercase">{data.kop.namaDinas}</h3>
              </div>

              <div className="text-center space-y-0.5">
                <h2 className="font-bold text-sm underline uppercase">
                  SURAT PERINTAH PERJALANAN DINAS (SPPD)
                </h2>
                <p className="text-xs font-mono">Nomor: {sppdNomor} / Lembar I</p>
              </div>

              {/* Table SPPD Items */}
              <table className="w-full border border-collapse border-slate-400 text-xs">
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 w-8 text-center font-bold">1.</td>
                    <td className="border border-slate-400 px-2 py-1.5 w-1/3">Pejabat Berwenang Memberi Perintah</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold">{data.disposisi.jabatanPimpinan}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">2.</td>
                    <td className="border border-slate-400 px-2 py-1.5">Nama Pegawai yang diperintah</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold">
                      {data.kesimpulan.personil[0]?.nama} (NIP. {data.kesimpulan.personil[0]?.nip})
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">3.</td>
                    <td className="border border-slate-400 px-2 py-1.5">a. Pangkat / Golongan<br/>b. Jabatan / Instansi</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      a. {data.kesimpulan.personil[0]?.pangkatGol}<br/>
                      b. {data.kesimpulan.personil[0]?.jabatan}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">4.</td>
                    <td className="border border-slate-400 px-2 py-1.5">Maksud Perjalanan Dinas</td>
                    <td className="border border-slate-400 px-2 py-1.5">{data.header.hal}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">5.</td>
                    <td className="border border-slate-400 px-2 py-1.5">Alat Angkutan yang dipergunakan</td>
                    <td className="border border-slate-400 px-2 py-1.5">Angkutan Darat / Speedboat Reguler</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">6.</td>
                    <td className="border border-slate-400 px-2 py-1.5">a. Tempat Berangkat<br/>b. Tempat Tujuan</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      a. Tanjung Selor (Ibu Kota Prov. Kaltara)<br/>
                      b. <strong>{data.kesimpulan.tempat}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">7.</td>
                    <td className="border border-slate-400 px-2 py-1.5">a. Lamanya Perjalanan Dinas<br/>b. Tanggal Berangkat &amp; Kembali</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      a. {data.kesimpulan.selama}<br/>
                      b. {data.kesimpulan.tanggal}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">8.</td>
                    <td className="border border-slate-400 px-2 py-1.5">Pengikut / Rombongan</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {data.kesimpulan.personil.length > 1 ? (
                        <ol className="list-decimal list-inside">
                          {data.kesimpulan.personil.slice(1).map((p, i) => (
                            <li key={i}>{p.nama} ({p.pangkatGol})</li>
                          ))}
                        </ol>
                      ) : (
                        'Nihil (-)'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">9.</td>
                    <td className="border border-slate-400 px-2 py-1.5">Pembebanan Anggaran</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      DPA SKPD Dinas Pendidikan dan Kebudayaan Prov. Kalimantan Utara TA 2026
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4 flex justify-end text-xs">
                <div className="text-center w-64 space-y-1">
                  <div>Dikeluarkan di: Tanjung Selor</div>
                  <div>Pada tanggal: {data.header.tanggalSurat}</div>
                  <div className="font-bold pt-2">Pengguna Anggaran,</div>
                  <div className="h-16 flex items-center justify-center italic text-slate-400">
                    [Tanda Tangan &amp; Cap]
                  </div>
                  <div className="font-bold underline uppercase">H. TEGUH HENDRIONO, S.Hut., M.P.</div>
                  <div className="font-mono text-[9pt]">NIP. 19741215 199903 1 004</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Sticky Canva Pill style */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 shrink-0 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7F56D9]" />
            <span className="font-medium text-[11px]">Format baku Permendagri No. 1/2023</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-full transition flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
