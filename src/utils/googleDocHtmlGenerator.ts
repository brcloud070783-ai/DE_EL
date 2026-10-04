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

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.header.hal || 'Telaahan Staf'}</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.25;
      color: #000000;
      margin: 0;
      padding: 0;
    }
    .kop-header {
      text-align: center;
      margin-bottom: 4px;
    }
    .kop-instansi-atas {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
    }
    .kop-dinas {
      font-size: 13pt;
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
      margin-bottom: 16px;
    }
    .judul-doc {
      text-align: center;
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }
    .table-header {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .table-header td {
      vertical-align: top;
      padding: 2px 4px;
      font-size: 11pt;
    }
    .section-title {
      font-weight: bold;
      font-size: 11pt;
      margin-top: 14px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .paragraph-content {
      text-align: justify;
      margin-bottom: 8px;
      text-indent: 28px;
    }
    .list-item {
      text-align: justify;
      margin-left: 28px;
      margin-bottom: 6px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #000;
      padding: 6px 8px;
      font-size: 10pt;
      vertical-align: top;
    }
    table.data-table th {
      background-color: #f2f2f2;
      text-align: center;
      font-weight: bold;
    }
    .ttd-table {
      width: 100%;
      margin-top: 28px;
      border-collapse: collapse;
    }
    .ttd-table td {
      vertical-align: top;
      font-size: 11pt;
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

  <!-- HEADER DOKUMEN (YTH, DARI, TANGGAL, NOMOR, HAL) -->
  <table class="table-header">
    <tr>
      <td style="width: 15%;">Yth.</td>
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
      <td>Hal</td>
      <td>:</td>
      <td><strong>${data.header.hal || '-'}</strong></td>
    </tr>
  </table>

  <hr style="border: none; border-top: 1px solid #000; margin-bottom: 16px;" />

  <!-- BAB I: PERSOALAN -->
  <div class="section-title">I. PERSOALAN</div>
  ${
    persoalanList.length <= 1
      ? `<p class="paragraph-content">${persoalanList[0] || '-'}</p>`
      : persoalanList
          .map((p, i) => `<p class="list-item">${String.fromCharCode(97 + i)}. ${p}</p>`)
          .join('')
  }

  <!-- BAB II: PRAANGGAPAN -->
  <div class="section-title">II. PRAANGGAPAN</div>
  ${
    praanggapanList.length === 0
      ? `<p class="paragraph-content">-</p>`
      : praanggapanList
          .map((p, i) => `<p class="list-item">${String.fromCharCode(97 + i)}. ${p}</p>`)
          .join('')
  }

  <!-- BAB III: FAKTA-FAKTA YANG MEMPENGARUHI -->
  <div class="section-title">III. FAKTA-FAKTA YANG MEMPENGARUHI</div>
  ${
    faktaList.length === 0
      ? `<p class="paragraph-content">-</p>`
      : faktaList
          .map((p, i) => `<p class="list-item">${String.fromCharCode(97 + i)}. ${p}</p>`)
          .join('')
  }

  <!-- BAB IV: ANALISIS -->
  <div class="section-title">IV. ANALISIS</div>
  ${data.analisisIntro ? `<p class="paragraph-content">${data.analisisIntro}</p>` : ''}
  ${
    analisisList.length === 0
      ? `<p class="paragraph-content">-</p>`
      : analisisList
          .map((p, i) => `<p class="list-item">${String.fromCharCode(97 + i)}. ${p}</p>`)
          .join('')
  }

  <!-- BAB V: KESIMPULAN -->
  <div class="section-title">V. KESIMPULAN</div>
  ${
    personilList.length > 0
      ? `<table class="data-table">
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 30%;">Nama / NIP</th>
              <th style="width: 25%;">Pangkat / Gol</th>
              <th style="width: 40%;">Jabatan</th>
            </tr>
          </thead>
          <tbody>
            ${personilList
              .map(
                (p, i) => `
              <tr>
                <td style="text-align: center;">${i + 1}</td>
                <td><strong>${p.nama}</strong><br><small>NIP. ${p.nip}</small></td>
                <td>${p.pangkatGol}</td>
                <td>${p.jabatan}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>`
      : ''
  }

  <p style="margin-top: 8px;"><strong>Maksud Perjalanan Dinas:</strong> ${data.kesimpulan.maksudPerjalanan || data.header.hal}</p>
  <p><strong>Lokasi Tujuan:</strong> ${data.kesimpulan.tempatTujuan || data.kesimpulan.tempat || '-'}</p>
  <p><strong>Tanggal Pelaksanaan:</strong> ${data.kesimpulan.tanggalBerangkat || data.kesimpulan.tanggal || '-'}</p>

  <!-- BAB VI: SARAN -->
  <div class="section-title">VI. SARAN</div>
  ${
    saranList.length === 0
      ? `<p class="paragraph-content">-</p>`
      : saranList
          .map((p, i) => `<p class="list-item">${String.fromCharCode(97 + i)}. ${p}</p>`)
          .join('')
  }

  <!-- KAKI SURAT / SIGNATURE -->
  <table class="ttd-table">
    <tr>
      <td style="width: 50%;"></td>
      <td style="width: 50%; text-align: center;">
        <p style="margin-bottom: 60px;">
          ${data.kaki.jabatanPembuat || 'Kepala Dinas Pendidikan dan Kebudayaan'},
        </p>
        <p style="font-weight: bold; text-decoration: underline; margin-bottom: 2px;">
          ${data.kaki.namaPembuat || 'NAMA PEMBUAT'}
        </p>
        <p style="margin: 0;">${data.kaki.pangkatPembuat || ''}</p>
        <p style="margin: 0;">NIP. ${data.kaki.nipPembuat || ''}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
