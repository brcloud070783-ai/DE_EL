import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import { X, Printer, Calculator, Banknote, CheckCircle, FileText } from 'lucide-react';

interface KuitansiRincianModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
}

// Terbilang Rupiah Helper
function angkaTerbilang(angka: number): string {
  const bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  if (angka < 12) return bilangan[angka];
  if (angka < 20) return angkaTerbilang(angka - 10) + ' Belas';
  if (angka < 100)
    return (
      angkaTerbilang(Math.floor(angka / 10)) +
      ' Puluh ' +
      angkaTerbilang(angka % 10)
    );
  if (angka < 200) return 'Seratus ' + angkaTerbilang(angka - 100);
  if (angka < 1000)
    return (
      angkaTerbilang(Math.floor(angka / 100)) +
      ' Ratus ' +
      angkaTerbilang(angka % 100)
    );
  if (angka < 2000) return 'Seribu ' + angkaTerbilang(angka - 1000);
  if (angka < 1000000)
    return (
      angkaTerbilang(Math.floor(angka / 1000)) +
      ' Ribu ' +
      angkaTerbilang(angka % 1000)
    );
  if (angka < 1000000000)
    return (
      angkaTerbilang(Math.floor(angka / 1000000)) +
      ' Juta ' +
      angkaTerbilang(angka % 1000000)
    );
  return (
    angkaTerbilang(Math.floor(angka / 1000000000)) +
    ' Miliar ' +
    angkaTerbilang(angka % 1000000000)
  );
}

export const KuitansiRincianModal: React.FC<KuitansiRincianModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const personCount = data.kesimpulan.personil.length || 1;
  const daysMatch = data.kesimpulan.selama.match(/\d+/);
  const dayCount = daysMatch ? parseInt(daysMatch[0], 10) : 3;

  // Stateable cost items
  const [uangHarianRate, setUangHarianRate] = useState<number>(380000); // SBM Luar Kota Kaltara
  const [transportRate, setTransportRate] = useState<number>(650000); // Speedboat / Transport PP
  const [hotelRate, setHotelRate] = useState<number>(550000); // Hotel per malam
  const [hotelNights, setHotelNights] = useState<number>(Math.max(1, dayCount - 1));
  const [transportLokal, setTransportLokal] = useState<number>(150000); // Transport lokal bandara/pelabuhan

  const totalUangHarian = personCount * dayCount * uangHarianRate;
  const totalTransport = personCount * transportRate;
  const totalHotel = personCount * hotelNights * hotelRate;
  const totalLokal = personCount * transportLokal;
  const grandTotal = totalUangHarian + totalTransport + totalHotel + totalLokal;

  const terbilangStr = grandTotal > 0 ? `${angkaTerbilang(grandTotal).trim()} Rupiah` : 'Nol Rupiah';

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
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
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Kuitansi &amp; Rincian Biaya Riil
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  Standar SBM
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium">
                Perhitungan rincian biaya riil dan lampiran SPJ perjalanan dinas.
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

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Interactive Calculation Controls */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 print:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Biaya Riil ({personCount} Pegawai x {dayCount} Hari)</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Tujuan: <strong>{data.kesimpulan.tempat}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Uang Harian / Hari (Rp)
                </label>
                <input
                  type="number"
                  value={uangHarianRate}
                  onChange={(e) => setUangHarianRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Transport PP / Orang (Rp)
                </label>
                <input
                  type="number"
                  value={transportRate}
                  onChange={(e) => setTransportRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Penginapan / Malam (Rp)
                </label>
                <input
                  type="number"
                  value={hotelRate}
                  onChange={(e) => setHotelRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Transport Lokal / Org (Rp)
                </label>
                <input
                  type="number"
                  value={transportLokal}
                  onChange={(e) => setTransportLokal(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Official Document Sheet: Kuitansi Pembayaran */}
          <div className="border border-slate-300 p-6 rounded-xl bg-white space-y-4 font-serif text-slate-900 text-xs">
            {/* Header Document */}
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <div className="font-bold tracking-wider text-xs">
                PEMERINTAH PROVINSI KALIMANTAN UTARA
              </div>
              <div className="font-bold text-sm">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </div>
              <div className="text-[11px] font-sans text-slate-600">
                Jl. Agathis No. 01, Gedung Gabungan Dinas Lt. 1, Tanjung Selor
              </div>
            </div>

            <div className="text-center font-bold text-sm underline pt-2">
              KUITANSI PEMBAYARAN PERJALANAN DINAS
            </div>
            <div className="text-center text-[11px] font-sans text-slate-600">
              Nomor Bukti Kas: BKU/SPD/{data.header.nomorSurat.replace(/[/.]/g, '-')}/2026
            </div>

            {/* Table Detail */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-12 py-1 border-b border-slate-200">
                <div className="col-span-4 font-bold font-sans">Sudah terima dari</div>
                <div className="col-span-8 font-sans">: Bendahara Pengeluaran Dinas Pendidikan dan Kebudayaan Prov. Kaltara</div>
              </div>

              <div className="grid grid-cols-12 py-1 border-b border-slate-200">
                <div className="col-span-4 font-bold font-sans">Jumlah Uang</div>
                <div className="col-span-8 font-mono font-bold">: Rp {grandTotal.toLocaleString('id-ID')},-</div>
              </div>

              <div className="grid grid-cols-12 py-1 border-b border-slate-200 bg-slate-50/70 p-2 rounded">
                <div className="col-span-4 font-bold font-sans">Terbilang</div>
                <div className="col-span-8 italic font-sans">: {terbilangStr}</div>
              </div>

              <div className="grid grid-cols-12 py-1 border-b border-slate-200">
                <div className="col-span-4 font-bold font-sans">Untuk Pembayaran</div>
                <div className="col-span-8 font-sans">
                  : Biaya perjalanan dinas dalam rangka: {data.header.hal} ke {data.kesimpulan.tempat} selama {data.kesimpulan.selama} ({data.kesimpulan.tanggal}).
                </div>
              </div>
            </div>

            {/* Rincian Rill Table */}
            <div className="pt-2">
              <div className="font-bold font-sans text-[11px] uppercase tracking-wide mb-1.5 text-slate-700">
                Rincian Perhitungan Biaya Riil:
              </div>
              <table className="w-full border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-sans font-bold text-center">
                    <th className="border border-slate-400 p-1.5 w-8">No</th>
                    <th className="border border-slate-400 p-1.5 text-left">Uraian Rincian Pengeluaran</th>
                    <th className="border border-slate-400 p-1.5 w-28">Volume / Satuan</th>
                    <th className="border border-slate-400 p-1.5 w-28 text-right">Jumlah (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-1.5 text-center">1</td>
                    <td className="border border-slate-400 p-1.5">
                      Uang Harian Perjalanan Dinas ({personCount} org x {dayCount} hari)
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono">
                      {personCount * dayCount} OH @ {uangHarianRate.toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-right font-mono font-semibold">
                      {totalUangHarian.toLocaleString('id-ID')}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-400 p-1.5 text-center">2</td>
                    <td className="border border-slate-400 p-1.5">
                      Biaya Transportasi Speedboat / Darat PP ({personCount} orang)
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono">
                      {personCount} Tiket @ {transportRate.toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-right font-mono font-semibold">
                      {totalTransport.toLocaleString('id-ID')}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-400 p-1.5 text-center">3</td>
                    <td className="border border-slate-400 p-1.5">
                      Biaya Penginapan / Hotel ({personCount} org x {hotelNights} malam)
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono">
                      {personCount * hotelNights} Kamar @ {hotelRate.toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-right font-mono font-semibold">
                      {totalHotel.toLocaleString('id-ID')}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-400 p-1.5 text-center">4</td>
                    <td className="border border-slate-400 p-1.5">
                      Transportasi Lokal Bandara / Pelabuhan ke Lokasi Kegiatan
                    </td>
                    <td className="border border-slate-400 p-1.5 text-center font-mono">
                      {personCount} Orang @ {transportLokal.toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-400 p-1.5 text-right font-mono font-semibold">
                      {totalLokal.toLocaleString('id-ID')}
                    </td>
                  </tr>

                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="border border-slate-400 p-2 text-center uppercase">
                      Total Jumlah Riil
                    </td>
                    <td className="border border-slate-400 p-2 text-right font-mono text-xs">
                      Rp {grandTotal.toLocaleString('id-ID')},-
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature 3 Columns */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center font-sans text-[10px]">
              <div className="space-y-12">
                <div>
                  Mengetahui/Menyetujui,<br />
                  <strong>Pejabat Pelaksana Teknis Kegiatan (PPTK)</strong>
                </div>
                <div>
                  <div className="font-bold underline">{data.kaki.namaPembuat}</div>
                  <div>NIP. {data.kaki.nipPembuat}</div>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  Lunas Dibayar Tgl: {data.kaki.tempatTanggal.split(',')[1] || '2026'}<br />
                  <strong>Bendahara Pengeluaran</strong>
                </div>
                <div>
                  <div className="font-bold underline">SITI NURHALIZA, S.E.</div>
                  <div>NIP. 19850620 201001 2 018</div>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  Tanjung Selor, {data.kaki.tempatTanggal.split(',')[1] || '2026'}<br />
                  <strong>Yang Menerima Pembayaran</strong>
                </div>
                <div>
                  <div className="font-bold underline">
                    {data.kesimpulan.personil[0]?.nama || 'Pelaksana Tugas'}
                  </div>
                  <div>NIP. {data.kesimpulan.personil[0]?.nip || '-'}</div>
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
              Akurasi perhitungan kuitansi rincian biaya riil SBM 2026
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
