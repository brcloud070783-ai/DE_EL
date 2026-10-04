import React from 'react';
import { KesimpulanTelaah } from '../types';

interface KesimpulanSectionProps {
  kesimpulan: KesimpulanTelaah;
  headerHal: string;
  bodyFontSize: string;
  lineSpacing: number;
  showRingkasan?: boolean;
  showPersonil?: boolean;
  showRincian?: boolean;
}

export const KesimpulanSection: React.FC<KesimpulanSectionProps> = ({
  kesimpulan,
  headerHal,
  bodyFontSize,
  lineSpacing,
  showRingkasan = true,
  showPersonil = true,
  showRincian = true,
}) => {
  const personilList = kesimpulan.personil || [];
  const isMultiple = personilList.length > 1;
  const rawSelama = kesimpulan.lamanyaPerjalanan || kesimpulan.selama || '';
  const cleanSelama = rawSelama ? rawSelama.replace(/\bhari\s+hari\b/gi, 'hari').trim() : '';

  return (
    <div key="sec-kesimpulan" className="natural-flow avoid-break">
      <div className="ml-8 space-y-1">
        {/* Ringkasan / Poin Kesimpulan */}
        {showRingkasan && Array.isArray(kesimpulan.poin) && kesimpulan.poin.length > 0 ? (
          <div className="space-y-1 mb-1.5">
            {kesimpulan.poin.map((item, idx) => {
              const cleanItem = item
                .replace(/^(\(?[a-zA-Z0-9]+\)?[\.\)]|[\-•]|\d+[\.\)])\s*/gi, '')
                .replace(/^(\(?[a-zA-Z0-9]+\)?[\.\)]|[\-•]|\d+[\.\)])\s*/gi, '')
                .trim();

              return (
                <div key={idx} className="flex items-start gap-1 text-justify" style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}>
                  <span style={{ fontSize: bodyFontSize }} className="w-5 shrink-0 font-medium text-left select-none">
                    {String.fromCharCode(97 + idx)}.
                  </span>
                  <div style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }} className="flex-1 min-w-0 text-justify [text-align-last:left] break-words">
                    {cleanItem}
                  </div>
                </div>
              );
            })}
          </div>
        ) : showRingkasan && kesimpulan.ringkasan ? (
          <p
            style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
            className="text-justify break-words mb-1"
          >
            {kesimpulan.ringkasan}
          </p>
        ) : null}



        {/* KOTAK KONTEN TUNGGAL UNTUK PERSONIL + MAKSUD + RINCIAN PERJALANAN DINAS */}
        {(showPersonil || showRincian) && (
          <div className="my-1 avoid-break">
            <table
              style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
              className="w-full border-collapse tight-table-row"
            >
              <tbody>
                {/* PERSONIL SECTION LIST */}
                {showPersonil && personilList.length > 0 && personilList.map((p, idx) => (
                  <React.Fragment key={p.id || idx}>
                    <tr>
                      <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">
                        {isMultiple ? `Nama / NIP (${idx + 1})` : 'Nama / NIP'}
                      </td>
                      <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                      <td className="align-top font-bold text-slate-900 break-words pl-0.5 text-justify">
                        {p.nama}{p.nip && p.nip !== '-' ? ` / NIP. ${p.nip.replace(/\s+/g, '')}` : ''}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">
                        {isMultiple ? `Pangkat & Gol (${idx + 1})` : 'Pangkat & Golongan'}
                      </td>
                      <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                      <td className="align-top font-medium text-slate-800 break-words pl-0.5 text-justify">
                        {p.pangkatGol || '-'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">
                        {isMultiple ? `Jabatan (${idx + 1})` : 'Jabatan'}
                      </td>
                      <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                      <td className="align-top font-medium text-slate-800 break-words pl-0.5 text-justify">
                        {p.jabatan || '-'}
                      </td>
                    </tr>
                    {/* Add a thin spacer row between personnel if multiple */}
                    {isMultiple && idx < personilList.length - 1 && (
                      <tr className="h-1"><td colSpan={3}></td></tr>
                    )}
                  </React.Fragment>
                ))}

                {/* Divider space between Personnel and Travel Details */}
                {showPersonil && personilList.length > 0 && showRincian && (
                  <tr className="h-1.5"><td colSpan={3}></td></tr>
                )}

                {/* RINCIAN PERJALANAN DINAS SECTION */}
                {showRincian && (
                  <>
                    <tr>
                      <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">Maksud Perjalanan</td>
                      <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                      <td className="align-top font-semibold text-slate-900 break-words pl-0.5 text-justify">
                        {kesimpulan.maksudPerjalanan || headerHal}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">Tempat Berangkat</td>
                      <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                      <td className="align-top font-medium text-slate-800 break-words pl-0.5 text-justify">
                        {kesimpulan.tempatBerangkat || 'Tanjung Selor'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">Tempat Tujuan</td>
                      <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                      <td className="align-top font-medium text-slate-800 break-words pl-0.5 text-justify">
                        {kesimpulan.tempatTujuan || kesimpulan.tempat}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">Tanggal Berangkat</td>
                      <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                      <td className="align-top font-medium text-slate-800 pl-0.5">
                        {kesimpulan.tanggalBerangkat || kesimpulan.tanggal}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">Tanggal Kembali</td>
                      <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                      <td className="align-top font-medium text-slate-800 pl-0.5">
                        {kesimpulan.tanggalKembali || kesimpulan.tanggal}
                      </td>
                    </tr>
                    {cleanSelama && (
                      <tr>
                        <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">Lamanya Perjalanan</td>
                        <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                        <td className="align-top font-medium text-slate-800 pl-0.5">
                          {cleanSelama}
                        </td>
                      </tr>
                    )}
                    {kesimpulan.pembebananAnggaran && (
                      <tr>
                        <td className="w-36 min-w-[144px] align-top font-medium pr-1.5 text-slate-700">Pembebanan Anggaran</td>
                        <td className="w-4 text-center align-top font-medium text-slate-500">:</td>
                        <td className="align-top font-medium text-slate-800 break-words pl-0.5 text-justify">
                          {kesimpulan.pembebananAnggaran}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
