import {
  TelaahanStafData,
  PaperSizeType,
  FontFamilyType,
  DocumentMargins,
  DEFAULT_DOCUMENT_MARGINS,
  PageSplitMode,
} from '../types';
import { paginateDocument, DocumentPageObject } from '../hooks/useDocumentPagination';

export interface PagedJsRenderOptions {
  paperSize?: PaperSizeType;
  margins?: DocumentMargins;
  fontSizePt?: number;
  lineSpacing?: number;
  fontFamily?: FontFamilyType;
  pageSplitMode?: PageSplitMode;
  title?: string;
  domMeasurements?: Record<string, number>;
}

export function getFontCssFamily(fontFamily: FontFamilyType = 'arial'): string {
  switch (fontFamily) {
    case 'tahoma':
      return "'Tahoma', 'Verdana', 'Segoe UI', sans-serif";
    case 'times':
      return "'Times New Roman', Times, 'Liberation Serif', serif";
    case 'arial':
    default:
      return "'Arial', 'Helvetica Neue', 'Helvetica', sans-serif";
  }
}

function renderKopSvgLogo(logoType: string, customUrl?: string): string {
  if (logoType === 'custom' && customUrl) {
    return `<img src="${customUrl}" alt="Logo Instansi" style="max-height: 75px; max-width: 75px; object-fit: contain;" />`;
  }

  if (logoType === 'garuda') {
    return `
      <svg viewBox="0 0 100 100" style="width: 65px; height: 65px;" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 16 C53 20 60 22 66 18 C72 26 88 32 94 48 C85 52 74 54 68 56 C74 64 72 74 64 82 C58 76 56 68 50 72 C44 68 42 76 36 82 C28 74 26 64 32 56 C26 54 15 52 6 48 C12 32 28 26 34 18 C40 22 47 20 50 16 Z" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
        <path d="M50 36 C60 36, 64 42, 64 54 C64 68, 50 78, 50 78 C50 78, 36 68, 36 54 C36 42, 40 36, 50 36 Z" fill="#dc2626" stroke="#1e293b" stroke-width="1.5"/>
        <path d="M50 36 L50 78 M36 55 L64 55" stroke="#1e293b" stroke-width="1"/>
        <polygon points="50,42 53,51 62,51 55,56 58,65 50,59 42,65 45,56 38,51 47,51" fill="#facc15"/>
      </svg>
    `;
  }

  if (logoType === 'kemendikbud') {
    return `
      <svg viewBox="0 0 100 100" style="width: 65px; height: 65px;" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
        <circle cx="50" cy="38" r="12" fill="#facc15"/>
        <path d="M50 50 Q65 65 80 50 L80 65 Q65 80 50 65 Q35 80 20 65 L20 50 Q35 65 50 50 Z" fill="#ffffff"/>
      </svg>
    `;
  }

  // Default: Kaltara
  return `
    <svg viewBox="0 0 100 100" style="width: 65px; height: 65px;" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 4 C68 4, 86 12, 86 28 C86 64, 50 94, 50 94 C50 94, 14 64, 14 28 C14 12, 32 4, 50 4 Z" fill="#15803d" stroke="#ca8a04" stroke-width="3"/>
      <path d="M50 10 C64 10, 80 17, 80 30 C80 60, 50 86, 50 86 C50 86, 20 60, 20 30 C20 17, 36 10, 50 10 Z" fill="#0284c7" stroke="#facc15" stroke-width="1.5"/>
      <polygon points="50,14 52,20 58,20 53,24 55,30 50,26 45,30 47,24 42,20 48,20" fill="#fef08a"/>
      <path d="M24 60 Q37 54, 50 60 T76 60 Q80 68, 50 84 Q20 68, 24 60 Z" fill="#0369a1" opacity="0.9"/>
      <path d="M24 74 Q50 80, 76 74 Q74 80, 50 86 Q26 80, 24 74 Z" fill="#ffffff" stroke="#ca8a04" stroke-width="1"/>
      <text x="50" y="80" text-anchor="middle" font-size="4.5" font-weight="bold" fill="#0f172a">BENUANTA</text>
    </svg>
  `;
}

function renderListItemsHtml(items: string[], indices?: number[]): string {
  const activeItems = indices ? indices.map((idx) => items[idx]).filter(Boolean) : items;
  if (!activeItems || activeItems.length === 0) return '';

  const startIdx = indices && indices.length > 0 ? indices[0] : 0;

  return activeItems
    .map((rawText, idx) => {
      const actualIndex = startIdx + idx;
      const cleanText = rawText.replace(/^([a-z0-9][\.\)]|[\-•])\s+/i, '').trim();
      const letter = `${String.fromCharCode(97 + actualIndex)}.`;
      return `
        <div class="item-row">
          <span class="item-letter">${letter}</span>
          <span class="item-text">${cleanText}</span>
        </div>
      `;
    })
    .join('');
}

function renderKesimpulanHtml(page: DocumentPageObject, data: TelaahanStafData): string {
  if (!page.hasKesimpulan) return '';

  const kesimpulan = data.kesimpulan;
  const personilList = kesimpulan.personil || [];
  const isMultiple = personilList.length > 1;
  const rawSelama = kesimpulan.lamanyaPerjalanan || kesimpulan.selama || '';
  const cleanSelama = rawSelama ? rawSelama.replace(/\bhari\s+hari\b/gi, 'hari').trim() : '';

  const showHeader = page.showKesimpulanHeader !== false;
  const showRingkasan = page.hasKesimpulanRingkasan;
  const showPersonil = page.hasKesimpulanPersonil;
  const showRincian = page.hasKesimpulanRincian;

  let html = '<div class="section-block kesimpulan-block">';
  if (showHeader) {
    html += `
      <div class="section-header">
        <span class="section-num">V.</span>
        <span>Kesimpulan</span>
      </div>
    `;
  }

  html += '<div class="kesimpulan-inner" style="margin-left: 26px;">';

  // Ringkasan / Poin Kesimpulan
  if (showRingkasan && Array.isArray(kesimpulan.poin) && kesimpulan.poin.length > 0) {
    html += '<div style="margin-bottom: 6px;">';
    kesimpulan.poin.forEach((item, idx) => {
      html += `<div style="display: flex; align-items: flex-start; gap: 4px; margin-bottom: 3px; text-align: justify;"><span style="font-weight: 500; min-width: 18px;">${String.fromCharCode(97 + idx)}.</span><span>${item}</span></div>`;
    });
    html += '</div>';
  } else if (showRingkasan && kesimpulan.ringkasan) {
    html += `<p class="intro-text" style="margin-left: 0; margin-bottom: 4px; text-align: justify;">${kesimpulan.ringkasan}</p>`;
  }

  // Intro
  if (showRingkasan && kesimpulan.intro) {
    html += `<p class="intro-text" style="margin-left: 0; margin-bottom: 4px; font-weight: 500; text-align: justify;">${kesimpulan.intro}</p>`;
  }

  // Unified Table for Personil & Rincian (Matches app's KesimpulanSection.tsx exactly)
  if (showPersonil || showRincian) {
    html += `
      <div style="margin: 2px 0;">
        <table class="kesimpulan-unified-table">
          <tbody>
    `;

    // Personil Rows
    if (showPersonil) {
      personilList.forEach((p, idx) => {
        if (isMultiple) {
          html += `
            <tr>
              <td class="td-num">${idx + 1}.</td>
              <td class="td-label">Nama</td>
              <td class="td-colon">:</td>
              <td class="td-val font-bold">${p.nama}</td>
            </tr>
            <tr>
              <td></td>
              <td class="td-label">NIP</td>
              <td class="td-colon">:</td>
              <td class="td-val">${p.nip || '-'}</td>
            </tr>
            <tr>
              <td></td>
              <td class="td-label">Pangkat / Gol.</td>
              <td class="td-colon">:</td>
              <td class="td-val">${p.pangkatGol || '-'}</td>
            </tr>
            <tr>
              <td></td>
              <td class="td-label">Jabatan</td>
              <td class="td-colon">:</td>
              <td class="td-val">${p.jabatan || '-'}</td>
            </tr>
          `;
        } else {
          html += `
            <tr>
              <td class="td-label">Nama</td>
              <td class="td-colon">:</td>
              <td class="td-val font-bold">${p.nama}</td>
            </tr>
            <tr>
              <td class="td-label">NIP</td>
              <td class="td-colon">:</td>
              <td class="td-val">${p.nip || '-'}</td>
            </tr>
            <tr>
              <td class="td-label">Pangkat / Gol.</td>
              <td class="td-colon">:</td>
              <td class="td-val">${p.pangkatGol || '-'}</td>
            </tr>
            <tr>
              <td class="td-label">Jabatan</td>
              <td class="td-colon">:</td>
              <td class="td-val">${p.jabatan || '-'}</td>
            </tr>
          `;
        }
      });
    }

    // Rincian / Maksud Rows
    if (showRincian) {
      const colSpan = isMultiple ? 4 : 3;
      html += `
        <tr>
          <td colspan="${colSpan}" class="td-maksud">
            <div class="maksud-title">Maksud Perjalanan Dinas:</div>
            <div class="maksud-content">
              ${kesimpulan.maksudPerjalanan || data.header.hal}
            </div>
          </td>
        </tr>
        <tr>
          ${isMultiple ? '<td></td>' : ''}
          <td class="td-label">Tempat berangkat</td>
          <td class="td-colon">:</td>
          <td class="td-val">${kesimpulan.tempatBerangkat || 'Tanjung Selor'}</td>
        </tr>
        <tr>
          ${isMultiple ? '<td></td>' : ''}
          <td class="td-label">Tempat tujuan</td>
          <td class="td-colon">:</td>
          <td class="td-val">${kesimpulan.tempatTujuan || kesimpulan.tempat}</td>
        </tr>
        <tr>
          ${isMultiple ? '<td></td>' : ''}
          <td class="td-label">Tanggal berangkat</td>
          <td class="td-colon">:</td>
          <td class="td-val">${kesimpulan.tanggalBerangkat || kesimpulan.tanggal}</td>
        </tr>
        <tr>
          ${isMultiple ? '<td></td>' : ''}
          <td class="td-label">Tanggal kembali</td>
          <td class="td-colon">:</td>
          <td class="td-val">${kesimpulan.tanggalKembali || kesimpulan.tanggal}</td>
        </tr>
      `;

      if (cleanSelama) {
        html += `
          <tr>
            ${isMultiple ? '<td></td>' : ''}
            <td class="td-label">Lamanya perjalanan</td>
            <td class="td-colon">:</td>
            <td class="td-val">${cleanSelama}</td>
          </tr>
        `;
      }

      if (kesimpulan.pembebananAnggaran) {
        html += `
          <tr>
            ${isMultiple ? '<td></td>' : ''}
            <td class="td-label">Pembebanan Anggaran</td>
            <td class="td-colon">:</td>
            <td class="td-val">${kesimpulan.pembebananAnggaran}</td>
          </tr>
        `;
      }
    }

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  html += '</div></div>';
  return html;
}

function renderSectionsForPage(page: DocumentPageObject, data: TelaahanStafData): string {
  let html = '';

  const persoalanItems = (Array.isArray(data.persoalan) ? data.persoalan : [data.persoalan || ''])
    .map((p) => (typeof p === 'string' ? p.trim() : ''))
    .filter(Boolean);
  const praanggapanItems = (data.praanggapan || []).map((p) => p.trim()).filter(Boolean);
  const faktaItems = (data.fakta || []).map((p) => p.trim()).filter(Boolean);
  const analisisItems = (data.analisis || []).map((p) => p.trim()).filter(Boolean);
  const saranItems = (data.saran || []).map((p) => p.trim()).filter(Boolean);

  // I. Pokok Permasalahan
  if (page.hasPersoalan) {
    html += `
      <div class="section-block">
        ${
          page.showPersoalanHeader !== false
            ? `
          <div class="section-header">
            <span class="section-num">I.</span>
            <span>Pokok Permasalahan</span>
          </div>
        `
            : ''
        }
        ${renderListItemsHtml(persoalanItems, page.persoalanItemIndices)}
      </div>
    `;
  }

  // II. Praanggapan
  if (page.hasPraanggapan) {
    html += `
      <div class="section-block">
        ${
          page.showPraanggapanHeader !== false
            ? `
          <div class="section-header">
            <span class="section-num">II.</span>
            <span>Praanggapan</span>
          </div>
        `
            : ''
        }
        ${renderListItemsHtml(praanggapanItems, page.praanggapanItemIndices)}
      </div>
    `;
  }

  // III. Fakta yang Mempengaruhi
  if (page.hasFakta) {
    html += `
      <div class="section-block">
        ${
          page.showFaktaHeader !== false
            ? `
          <div class="section-header">
            <span class="section-num">III.</span>
            <span>Fakta yang Mempengaruhi</span>
          </div>
        `
            : ''
        }
        ${renderListItemsHtml(faktaItems, page.faktaItemIndices)}
      </div>
    `;
  }

  // IV. Analisis dan Pembahasan
  if (page.hasAnalisis) {
    html += `
      <div class="section-block">
        ${
          page.showAnalisisHeader !== false
            ? `
          <div class="section-header">
            <span class="section-num">IV.</span>
            <span>Analisis dan Pembahasan</span>
          </div>
        `
            : ''
        }
        ${page.hasAnalisisIntro && data.analisisIntro ? `<div class="intro-text">${data.analisisIntro}</div>` : ''}
        ${renderListItemsHtml(analisisItems, page.analisisItemIndices)}
      </div>
    `;
  }

  // V. Kesimpulan (Fully unified to match KesimpulanSection.tsx)
  if (page.hasKesimpulan) {
    html += renderKesimpulanHtml(page, data);
  }

  // VI. Saran
  if (page.hasSaran) {
    html += `
      <div class="section-block">
        ${
          page.showSaranHeader !== false
            ? `
          <div class="section-header">
            <span class="section-num">VI.</span>
            <span>Saran</span>
          </div>
        `
            : ''
        }
        ${renderListItemsHtml(saranItems, page.saranItemIndices)}
      </div>
    `;
  }

  return html;
}

export function generatePagedJsDocumentHtml(
  data: TelaahanStafData,
  options: PagedJsRenderOptions = {}
): string {
  const {
    paperSize = 'a4',
    margins = DEFAULT_DOCUMENT_MARGINS,
    fontSizePt = 10,
    lineSpacing = 1.15,
    fontFamily = 'times',
    pageSplitMode = 'auto-fill-95',
    title = 'Telaahan Staf Disdikbud Kaltara',
    domMeasurements,
  } = options;

  const fontCss = getFontCssFamily(fontFamily);
  const isF4 = paperSize === 'f4';
  const paperWidthMm = isF4 ? 215 : 210;
  const paperHeightMm = isF4 ? 330 : 297;

  const safeFontSizePt = Math.max(9.75, fontSizePt);
  const baseFontSize = `${safeFontSizePt}pt`;
  const subHeaderFontSize = `${safeFontSizePt + 0.5}pt`;
  const titleFontSize = `${safeFontSizePt + 3}pt`;

  const paginationResult = paginateDocument({
    data,
    paperSize,
    margins,
    fontSizePt: safeFontSizePt,
    lineSpacing,
    fontFamily,
    pageSplitMode,
    domMeasurements,
  });

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    @page {
      size: ${paperWidthMm}mm ${paperHeightMm}mm;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      font-family: ${fontCss};
      font-size: ${baseFontSize};
      line-height: ${lineSpacing};
      color: #000000;
      margin: 0;
      padding: 0;
      background: #f1f5f9;
    }

    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 999;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);
      font-family: system-ui, -apple-system, sans-serif;
    }

    .print-toolbar button {
      cursor: pointer;
      font-weight: 600;
      border-radius: 8px;
      padding: 8px 18px;
      border: none;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .btn-print {
      background: #059669;
      color: #ffffff;
    }

    .btn-print:hover {
      background: #047857;
    }

    .btn-close {
      background: #334155;
      color: #ffffff;
    }

    .btn-close:hover {
      background: #1e293b;
    }

    .preview-canvas {
      padding: 32px 0 60px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .a4-sheet-page {
      box-sizing: border-box;
      width: ${paperWidthMm}mm;
      max-width: ${paperWidthMm}mm;
      height: ${paperHeightMm}mm;
      max-height: ${paperHeightMm}mm;
      padding: ${margins.topMm}mm ${margins.rightMm}mm ${margins.bottomMm}mm ${margins.leftMm}mm;
      overflow: hidden;
      position: relative;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      page-break-after: always;
      break-after: page;
    }

    .a4-sheet-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    @media print {
      .print-toolbar {
        display: none !important;
      }
      body {
        background: #ffffff !important;
      }
      .preview-canvas {
        padding: 0 !important;
        margin: 0 !important;
        gap: 0 !important;
        display: block !important;
      }
      .a4-sheet-page {
        box-shadow: none !important;
        border: none !important;
        margin: 0 auto !important;
        page-break-after: always !important;
        break-after: page !important;
      }
      .a4-sheet-page:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
    }

    /* Kop Surat */
    .kop-container {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2px;
    }

    .kop-logo-td {
      width: 75px;
      vertical-align: middle;
      text-align: center;
      padding-right: 12px;
    }

    .kop-text-td {
      text-align: center;
      vertical-align: middle;
    }

    .kop-instansi-atas {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .kop-dinas {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 1px 0 0 0;
    }

    .kop-alamat {
      font-size: 8pt;
      margin: 2px 0 0 0;
      line-height: 1.25;
    }

    .kop-garis-ganda {
      border-top: 2.5px solid #000000;
      border-bottom: 1px solid #000000;
      height: 2px;
      margin: 3px 0 6px 0;
    }

    /* Judul Dokumen */
    .document-title {
      text-align: center;
      font-size: ${titleFontSize};
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 4px 0 6px 0;
    }

    /* Atribut Naskah Dinas */
    .atribut-table {
      width: 100%;
      border-collapse: collapse;
      font-size: ${baseFontSize};
      margin-bottom: 6px;
    }

    .atribut-table td {
      padding: 1.5px 0;
      vertical-align: top;
    }

    .atribut-label {
      width: 85px;
      font-weight: normal;
    }

    .atribut-titikdua {
      width: 14px;
      text-align: center;
    }

    /* Tabel Utama 2-Kolom (Disposisi & Isi Telaahan) */
    .main-telaah-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      table-layout: fixed;
      font-size: ${baseFontSize};
      margin-bottom: 4px;
      page-break-inside: auto;
      break-inside: auto;
    }

    .main-telaah-table th {
      border: 1px solid #000000;
      background-color: #f8fafc;
      padding: 4px 6px;
      text-align: center;
      font-weight: bold;
      font-size: ${subHeaderFontSize};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .main-telaah-table td {
      border-right: 1px solid #000000;
      padding: 5px 7px;
      vertical-align: top;
    }

    .col-disposisi {
      width: 32%;
    }

    .col-isi {
      width: 68%;
      text-align: justify;
    }

    .empty-disposisi-col {
      background: #ffffff;
    }

    /* Kotak Disposisi Pimpinan */
    .disposisi-box {
      font-size: 8.5pt;
      line-height: 1.3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 180px;
    }

    .disposisi-header {
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
      margin-bottom: 5px;
    }

    .disposisi-options {
      margin: 4px 0 6px 0;
    }

    .disposisi-check-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 3px;
    }

    .check-box {
      width: 13px;
      height: 13px;
      border: 1px solid #000;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 9pt;
      font-weight: bold;
      line-height: 1;
    }

    .disposisi-catatan {
      border-top: 1px solid #cbd5e1;
      padding-top: 4px;
      margin-top: 4px;
    }

    .disposisi-catatan-text {
      font-style: italic;
      color: #1e293b;
      margin-top: 2px;
      word-break: break-word;
    }

    .disposisi-catatan-placeholder {
      padding: 4px 0;
    }

    .dotted-line {
      border-bottom: 1px dotted #94a3b8;
      width: 100%;
      margin: 6px 0;
    }

    .disposisi-paraf {
      text-align: center;
      padding-top: 8px;
      margin-top: auto;
    }

    .paraf-space {
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .paraf-line {
      border-bottom: 1px dotted #475569;
      width: 80px;
      margin: 0 auto;
    }

    .paraf-label {
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 2px;
    }

    /* Content Wrapper: allows natural pagination flow without premature eviction */
    .telaah-content-wrapper,
    .telaah-content-container {
      width: 100%;
      display: block;
      box-sizing: border-box;
    }

    /* Section & Content Blocks */
    .section-block,
    .kesimpulan-block {
      margin-bottom: 6px;
    }

    /* Rule: Headings must avoid breaking after, keeping with their next element */
    .section-header {
      font-weight: bold;
      margin-top: 4px;
      margin-bottom: 2px;
      display: flex;
      align-items: flex-start;
      break-after: avoid !important;
      page-break-after: avoid !important;
      -webkit-column-break-after: avoid !important;
    }

    .section-num {
      width: 26px;
      flex-shrink: 0;
    }

    .intro-text {
      margin-left: 26px;
      margin-bottom: 3px;
      text-align: justify;
      orphans: 3 !important;
      widows: 3 !important;
    }

    .item-single {
      margin-left: 26px;
      text-align: justify;
      orphans: 3 !important;
      widows: 3 !important;
    }

    /* Rule: Atomic leaf items must avoid breaking inside (Dev.to standard) */
    .item-row {
      display: flex;
      align-items: flex-start;
      margin-left: 26px;
      margin-bottom: 2.5px;
      text-align: justify;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      -webkit-column-break-inside: avoid !important;
    }

    .item-letter {
      width: 20px;
      flex-shrink: 0;
    }

    .item-text {
      flex: 1;
      text-align: justify;
      orphans: 3 !important;
      widows: 3 !important;
    }

    /* Kesimpulan Section Unified Table */
    .kesimpulan-unified-table {
      width: 100%;
      border-collapse: collapse;
      font-size: inherit;
      line-height: inherit;
    }

    /* Rule: Table rows must avoid breaking inside */
    .kesimpulan-unified-table tr {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      -webkit-column-break-inside: avoid !important;
    }

    .kesimpulan-unified-table td {
      border: none !important;
      padding: 1px 0 !important;
      vertical-align: top;
      background: transparent !important;
    }

    .kesimpulan-unified-table .td-num {
      width: 18px;
      font-weight: 500;
      padding-right: 4px !important;
      vertical-align: top;
    }

    .kesimpulan-unified-table .td-label {
      width: 1%;
      white-space: nowrap;
      font-weight: 500;
      padding-right: 12px !important;
      vertical-align: top;
    }

    .kesimpulan-unified-table .td-colon {
      width: 1%;
      white-space: nowrap;
      padding-right: 12px !important;
      text-align: center;
      vertical-align: top;
    }

    .kesimpulan-unified-table .td-val {
      width: 100%;
      vertical-align: top;
      text-align: justify;
      word-break: break-word;
    }

    .kesimpulan-unified-table .td-maksud {
      padding-top: 6px !important;
      padding-bottom: 4px !important;
    }

    .kesimpulan-unified-table .maksud-title {
      font-weight: bold;
      line-height: 1.15;
    }

    .kesimpulan-unified-table .maksud-content {
      font-weight: 500;
      text-align: justify;
      padding-top: 2px;
      line-height: inherit;
      word-break: break-word;
    }

    /* Kaki Naskah / Tanda Tangan */
    .kaki-block {
      width: 100%;
      margin-top: 10px;
    }

    .kaki-table {
      width: 100%;
      border-collapse: collapse;
    }

    .kaki-left {
      width: 45%;
    }

    .kaki-right {
      width: 55%;
      text-align: center;
      vertical-align: top;
    }

    .kaki-ttd-space {
      height: 55px;
    }

    .kaki-nama {
      font-weight: bold;
      text-decoration: underline;
    }

  </style>
</head>
<body>

  <!-- Top Print Toolbar -->
  <div class="print-toolbar">
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">TELAAHAN STAF &mdash; SIAP CETAK (${paperSize.toUpperCase()})</span>
      <span style="font-size: 12px; color: #94a3b8; background: #1e293b; border: 1px solid #334155; padding: 2px 10px; border-radius: 6px;">
        ${paginationResult.totalPages} Halaman
      </span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 11px; color: #cbd5e1; margin-right: 6px;">
        💡 <b>Tips Cetak:</b> Pilih <b>Destination: Save as PDF</b> dan <b>Margins: None</b>
      </span>
      <button class="btn-print" onclick="window.print()">
        🖨️ Cetak / Simpan PDF
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ Tutup
      </button>
    </div>
  </div>

  <!-- Document Flow Container -->
  <div class="preview-canvas">

    ${paginationResult.pages
      .map((page, pageIndex) => {
        return `
        <div class="a4-sheet-page">

          ${
            page.isFirstPage
              ? `
            <!-- KOP SURAT RESMI -->
            <table class="kop-container">
              <tr>
                <td class="kop-logo-td">
                  ${renderKopSvgLogo(data.kop.logoType, data.kop.customLogoUrl)}
                </td>
                <td class="kop-text-td">
                  <div class="kop-instansi-atas">${data.kop.namaInstansiAtas}</div>
                  <div class="kop-dinas">${data.kop.namaDinas}</div>
                  <div class="kop-alamat">
                    ${data.kop.alamat}<br/>
                    Telepon/Faks: ${data.kop.teleponFaks} | Posel: ${data.kop.poselEmail}<br/>
                    <strong>${data.kop.ibuKota.toUpperCase()}</strong>
                  </div>
                </td>
              </tr>
            </table>
            <div class="kop-garis-ganda"></div>

            <!-- JUDUL DOKUMEN -->
            <div class="document-title">${data.judul || 'TELAAHAN STAF'}</div>

            <!-- ATRIBUT NASKAH DINAS -->
            <table class="atribut-table">
              <tr>
                <td class="atribut-label">Yth.</td>
                <td class="atribut-titikdua">:</td>
                <td>${data.header.yth}</td>
              </tr>
              <tr>
                <td class="atribut-label">Dari</td>
                <td class="atribut-titikdua">:</td>
                <td>${data.header.dari}</td>
              </tr>
              <tr>
                <td class="atribut-label">Tanggal</td>
                <td class="atribut-titikdua">:</td>
                <td>${data.header.tanggalSurat}</td>
              </tr>
              <tr>
                <td class="atribut-label">Nomor</td>
                <td class="atribut-titikdua">:</td>
                <td>${data.header.nomorSurat}</td>
              </tr>
              <tr>
                <td class="atribut-label">Lampiran</td>
                <td class="atribut-titikdua">:</td>
                <td>${data.header.lampiran || '-'}</td>
              </tr>
              <tr>
                <td class="atribut-label">Hal</td>
                <td class="atribut-titikdua">:</td>
                <td><strong>${data.header.hal}</strong></td>
              </tr>
            </table>
          `
              : ''
          }

          <!-- TABEL UTAMA 2-KOLOM (DISPOSISI & ISI TELAAHAN) -->
          <table class="main-telaah-table">
            ${
              page.isFirstPage
                ? `
              <thead>
                <tr>
                  <th class="col-disposisi">KOLOM DISPOSISI</th>
                  <th class="col-isi">ISI TELAAHAN</th>
                </tr>
              </thead>
            `
                : ''
            }
            <tbody>
              <tr>
                <!-- KOLOM KIRI: DISPOSISI PIMPINAN -->
                <td class="col-disposisi ${!page.isFirstPage ? 'empty-disposisi-col' : ''}">
                  ${
                    page.isFirstPage
                      ? `
                    <div class="disposisi-box">
                      <div>
                        <div class="disposisi-header">
                          ${data.disposisi.jabatanPimpinan || 'Plh. KEPALA DINAS PENDIDIKAN DAN KEBUDAYAAN:'}
                        </div>

                        <div class="disposisi-options">
                          <div class="disposisi-check-row">
                            <span class="check-box">${data.disposisi.status === 'setuju' ? '✓' : '&nbsp;'}</span>
                            <span>Setuju</span>
                          </div>
                          <div class="disposisi-check-row">
                            <span class="check-box">${data.disposisi.status === 'tidak_setuju' ? '✓' : '&nbsp;'}</span>
                            <span>Tidak Setuju</span>
                          </div>
                        </div>

                        <div class="disposisi-catatan">
                          <strong style="font-size: 8pt;">Catatan Pimpinan:</strong>
                          ${
                            data.disposisi.catatan
                              ? `<div class="disposisi-catatan-text">"${data.disposisi.catatan}"</div>`
                              : `
                            <div class="disposisi-catatan-placeholder">
                              <div class="dotted-line"></div>
                              <div class="dotted-line"></div>
                              <div class="dotted-line"></div>
                            </div>
                          `
                          }
                        </div>
                      </div>

                      <div class="disposisi-paraf">
                        <div class="paraf-space">
                          ${data.disposisi.parafImage ? `<img src="${data.disposisi.parafImage}" style="max-height: 24px;" alt="Paraf"/>` : ''}
                        </div>
                        <div class="paraf-line"></div>
                        <div class="paraf-label">(Paraf Pimpinan)</div>
                      </div>
                    </div>
                  `
                      : '&nbsp;'
                  }
                </td>

                <!-- KOLOM KANAN: ISI TELAAHAN SESUAI PEMBAGIAN HALAMAN (MONOLITHIC WRAPPER) -->
                <td class="col-isi">
                  <div class="telaah-content-wrapper telaah-content-container">
                    ${renderSectionsForPage(page, data)}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- KAKI NASKAH / TTD (JIKA DI ALOKASIKAN PADA HALAMAN INI) -->
          ${
            page.hasKaki
              ? `
            <div class="kaki-block">
              <table class="kaki-table">
                <tr>
                  <td class="kaki-left"></td>
                  <td class="kaki-right">
                    <div>${data.kaki.tempatTanggal}</div>
                    <div>${data.kaki.yangMembuatLabel || 'Yang membuat,'} ${data.kaki.jabatanPembuat || 'PPTK,'}</div>
                    <div class="kaki-ttd-space"></div>
                    <div class="kaki-nama">${data.kaki.namaPembuat}</div>
                    <div>${data.kaki.pangkatPembuat}</div>
                    <div>NIP. ${data.kaki.nipPembuat}</div>
                  </td>
                </tr>
              </table>
            </div>
          `
              : ''
          }

          ${
            page.pageNumber > 1
              ? `
            <div style="position: absolute; bottom: 8mm; right: ${margins.rightMm}mm; font-size: 8.5pt; color: #475569;">
              - ${page.pageNumber} -
            </div>
          `
              : ''
          }

        </div>
      `;
      })
      .join('')}

  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
}
