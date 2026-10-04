import { TelaahanStafData } from '../types';

export const generateTelaahHtmlForGoogleDocs = (data: TelaahanStafData): string => {
  const personilList = data.kesimpulan.personil || [];
  const persoalanList = (Array.isArray(data.persoalan) ? data.persoalan : [data.persoalan || ''])
    .map((p) => (typeof p === 'string' ? p.trim() : ''))
    .filter(Boolean);

  const praanggapanList = (data.praanggapan || []).map((p) => (typeof p === 'string' ? p.trim() : '')).filter(Boolean);
  const faktaList = (data.fakta || []).map((p) => (typeof p === 'string' ? p.trim() : '')).filter(Boolean);
  const analisisList = (data.analisis || []).map((p) => (typeof p === 'string' ? p.trim() : '')).filter(Boolean);
  const saranList = (data.saran || []).map((p) => (typeof p === 'string' ? p.trim() : '')).filter(Boolean);

  // Helper for lettered/numbered items
  const formatListHtml = (items: string[]) => {
    if (items.length === 0) return '<div style="margin-left: 18px;">-</div>';
    if (items.length === 1) return `<div style="margin-left: 18px; text-align: justify;">${items[0]}</div>`;
    return items
      .map(
        (item, idx) =>
          `<div style="margin-left: 18px; text-align: justify; margin-bottom: 4px;">` +
          `<strong>${String.fromCharCode(97 + idx)}.</strong> ${item}` +
          `</div>`
      )
      .join('');
  };

  const persoalanHtml = formatListHtml(persoalanList);
  const praanggapanHtml = formatListHtml(praanggapanList);
  const faktaHtml = formatListHtml(faktaList);
  const analisisHtml = formatListHtml(analisisList);
  const saranHtml = formatListHtml(saranList);

  const personilTableHtml =
    personilList.length > 0
      ? `<table border="1" style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #000;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th width="8%" style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 9.5pt;">No</th>
              <th width="35%" style="border: 1px solid #000; padding: 4px; text-align: left; font-size: 9.5pt;">Nama / NIP</th>
              <th width="25%" style="border: 1px solid #000; padding: 4px; text-align: left; font-size: 9.5pt;">Pangkat / Gol</th>
              <th width="32%" style="border: 1px solid #000; padding: 4px; text-align: left; font-size: 9.5pt;">Jabatan</th>
            </tr>
          </thead>
          <tbody>
            ${personilList
              .map(
                (p, i) => `
              <tr>
                <td style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 9.5pt;">${i + 1}</td>
                <td style="border: 1px solid #000; padding: 4px; font-size: 9.5pt;"><strong>${p.nama}</strong><br><small>NIP. ${p.nip}</small></td>
                <td style="border: 1px solid #000; padding: 4px; font-size: 9.5pt;">${p.pangkatGol}</td>
                <td style="border: 1px solid #000; padding: 4px; font-size: 9.5pt;">${p.jabatan}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>`
      : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.header.hal || 'Telaahan Staf'}</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10.5pt;
      line-height: 1.25;
      color: #000000;
      margin: 0;
      padding: 0;
    }
    .kop-header {
      text-align: center;
      margin-bottom: 2px;
    }
    .kop-instansi-atas {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
    }
    .kop-dinas {
      font-size: 12.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 2px 0;
    }
    .kop-alamat {
      font-size: 8.5pt;
      margin: 2px 0;
    }
    .kop-line {
      border-top: 3px solid #000;
      border-bottom: 1px solid #000;
      height: 2px;
      margin-top: 4px;
      margin-bottom: 12px;
    }
    .judul-doc {
      text-align: center;
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .table-header {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    .table-header td {
      vertical-align: top;
      padding: 2px 4px;
      font-size: 10.5pt;
    }
    .main-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
      margin-top: 8px;
    }
    .main-table th {
      border: 1px solid #000;
      padding: 6px;
      font-size: 10pt;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      background-color: #f8f9fa;
    }
    .main-table td {
      border: 1px solid #000;
      vertical-align: top;
      padding: 8px;
      font-size: 10pt;
    }
    .section-header {
      font-weight: bold;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    .checkbox-box {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 1px solid #000;
      text-align: center;
      line-height: 12px;
      font-size: 10px;
      font-weight: bold;
      margin-right: 6px;
    }
    .signature-table {
      width: 100%;
      margin-top: 24px;
      border-collapse: collapse;
    }
    .signature-table td {
      vertical-align: top;
      font-size: 10.5pt;
    }
  </style>
</head>
<body>
  <!-- KOP SURAT RESMI -->
  <div class="kop-header">
    <p class="kop-instansi-atas">${data.kop.namaInstansiAtas || 'PEMERINTAH PROVINSI KALIMANTAN UTARA'}</p>
    <p class="kop-dinas">${data.kop.namaDinas || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}</p>
    <p class="kop-alamat">${data.kop.alamat || 'Jalan Sengkawit Komplek Perkantoran Gedung B Lt. 1 Tanjung Selor'}</p>
  </div>
  <div class="kop-line"></div>

  <!-- JUDUL DOKUMEN -->
  <div class="judul-doc">${data.judul || 'TELAAHAN STAF'}</div>

  <!-- HEADER ATRIBUT DOKUMEN (YTH, DARI, TANGGAL, NOMOR, LAMPIRAN, HAL) -->
  <table class="table-header">
    <tr>
      <td style="width: 15%;">Kepada</td>
      <td style="width: 3%;">:</td>
      <td style="width: 82%;"><strong>${data.header.yth || 'Gubernur Kalimantan Utara'}</strong></td>
    </tr>
    <tr>
      <td>Dari</td>
      <td>:</td>
      <td>${data.header.dari || 'Kepala Dinas Pendidikan dan Kebudayaan'}</td>
    </tr>
    <tr>
      <td>Tanggal</td>
      <td>:</td>
      <td>${data.header.tanggalSurat || '-'}</td>
    </tr>
    <tr>
      <td>Nomor</td>
      <td>:</td>
      <td>${data.header.nomorSurat || '-'}</td>
    </tr>
    <tr>
      <td>Lampiran</td>
      <td>:</td>
      <td>${data.header.lampiran || '-'}</td>
    </tr>
    <tr>
      <td>Perihal</td>
      <td>:</td>
      <td><strong>${data.header.hal || '-'}</strong></td>
    </tr>
  </table>

  <!-- UTAMA: TABEL 2 KOLOM OFFICIAL TELAAHAN STAF -->
  <table class="main-table" border="1">
    <thead>
      <tr>
        <th width="32%">KOLOM DISPOSISI</th>
        <th width="68%">ISI TELAAHAN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <!-- KOLOM KIRI: DISPOSISI PIMPINAN (32%) -->
        <td width="32%" style="background-color: #ffffff;">
          <div style="font-weight: bold; margin-bottom: 8px;">
            ${data.disposisi.jabatanPimpinan || 'Plh. KEPALA DINAS PENDIDIKAN DAN KEBUDAYAAN:'}
          </div>

          <div style="margin-bottom: 6px;">
            <span class="checkbox-box">${data.disposisi.status === 'setuju' ? '✓' : ''}</span>
            <span>Setuju</span>
          </div>

          <div style="margin-bottom: 12px;">
            <span class="checkbox-box">${data.disposisi.status === 'tidak_setuju' ? '✓' : ''}</span>
            <span>Tidak Setuju</span>
          </div>

          <div style="border-top: 1px dotted #888; padding-top: 6px; margin-top: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Catatan Pimpinan:</div>
            ${
              data.disposisi.catatan
                ? `<div style="font-style: italic;">"${data.disposisi.catatan}"</div>`
                : '<div style="color: #888; font-style: italic;">............................................................<br>............................................................</div>'
            }
          </div>

          <div style="text-align: center; margin-top: 48px; color: #555;">
            <div style="border-bottom: 1px dotted #555; width: 100px; margin: 0 auto 4px auto;"></div>
            <div style="font-size: 8.5pt;">(Paraf Pimpinan)</div>
          </div>
        </td>

        <!-- KOLOM KANAN: ISI TELAAHAN (68%) -->
        <td width="68%">
          <!-- BAB I -->
          <div class="section-header">I. Pokok Permasalahan</div>
          <div>${persoalanHtml}</div>

          <!-- BAB II -->
          <div class="section-header">II. Praanggapan</div>
          <div>${praanggapanHtml}</div>

          <!-- BAB III -->
          <div class="section-header">III. Fakta yang Mempengaruhi</div>
          <div>${faktaHtml}</div>

          <!-- BAB IV -->
          <div class="section-header">IV. Analisis dan Pembahasan</div>
          ${data.analisisIntro ? `<div style="margin-left: 18px; margin-bottom: 6px; text-align: justify;">${data.analisisIntro}</div>` : ''}
          <div>${analisisHtml}</div>

          <!-- BAB V -->
          <div class="section-header">V. Kesimpulan</div>
          <div style="margin-left: 18px; margin-bottom: 6px; text-align: justify;">
            ${data.kesimpulan.intro ? `<div>${data.kesimpulan.intro}</div>` : ''}
            <div style="margin-top: 4px;"><strong>Maksud Perjalanan Dinas:</strong> ${data.kesimpulan.maksudPerjalanan || data.header.hal}</div>
            <div><strong>Lokasi Tujuan:</strong> ${data.kesimpulan.tempatTujuan || data.kesimpulan.tempat || '-'}</div>
            <div><strong>Tanggal Pelaksanaan:</strong> ${data.kesimpulan.tanggalBerangkat || data.kesimpulan.tanggal || '-'}</div>
          </div>

          <!-- BAB VI -->
          <div class="section-header">VI. Saran</div>
          <div>${saranHtml}</div>

          <!-- TABEL PELAKSANA (PERSONIL) -->
          ${personilTableHtml ? `<div style="margin-top: 8px;">${personilTableHtml}</div>` : ''}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- KAKI TANGAN / SIGNATURE BLOCK -->
  <table class="signature-table">
    <tr>
      <td width="50%"></td>
      <td width="50%" style="text-align: center;">
        <div style="text-transform: uppercase;">
          ${data.kaki.yangMembuatLabel || 'Yang Membuat,'}
        </div>
        <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 48px;">
          ${data.kaki.jabatanPembuat || 'PPTK'}
        </div>
        <div style="font-weight: bold; text-decoration: underline; text-transform: uppercase;">
          ${data.kaki.namaPembuat || 'NAMA LENGKAP PPTK'}
        </div>
        <div>${data.kaki.pangkatPembuat || ''}</div>
        <div>NIP. ${data.kaki.nipPembuat || ''}</div>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
