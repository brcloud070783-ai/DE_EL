import { useMemo } from 'react';
import {
  TelaahanStafData,
  PaperSizeType,
  DocumentMargins,
  DEFAULT_DOCUMENT_MARGINS,
  TextDensityType,
  PageSplitMode,
  FontFamilyType,
  OFFICIAL_MARGIN,
} from '../types';

export type DocumentSectionId =
  | 'persoalan'
  | 'praanggapan'
  | 'fakta'
  | 'analisis'
  | 'kesimpulan'
  | 'kesimpulan_ringkasan'
  | 'kesimpulan_personil'
  | 'kesimpulan_rincian'
  | 'saran'
  | 'kaki';

export interface SectionMetric {
  id: DocumentSectionId;
  sectionNumber: string;
  title: string;
  heightMm: number;
}

export interface DocumentPageObject {
  pageIndex: number;
  pageNumber: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  sections: DocumentSectionId[];
  sectionMetrics: SectionMetric[];
  usedContentHeightMm: number;
  overheadHeightMm: number;
  totalPageHeightMm: number;
  availableHeightMm: number;
  remainingHeightMm: number;
  usedCapacityPercentage: number;

  // Convenience boolean flags
  hasKop: boolean;
  hasHeader: boolean;
  hasDisposisi: boolean;
  hasPersoalan: boolean;
  hasPraanggapan: boolean;
  hasFakta: boolean;
  hasAnalisis: boolean;
  hasKesimpulan: boolean;
  hasKesimpulanRingkasan: boolean;
  hasKesimpulanPersonil: boolean;
  hasKesimpulanRincian: boolean;
  hasSaran: boolean;
  hasKaki: boolean;

  // Continuous Item Slice Indices & Flags for each Page:
  persoalanItemIndices?: number[];
  showPersoalanHeader?: boolean;

  praanggapanItemIndices?: number[];
  showPraanggapanHeader?: boolean;

  faktaItemIndices?: number[];
  showFaktaHeader?: boolean;

  analisisItemIndices?: number[];
  showAnalisisHeader?: boolean;
  hasAnalisisIntro?: boolean;

  showKesimpulanHeader?: boolean;

  saranItemIndices?: number[];
  showSaranHeader?: boolean;
}

export interface DocumentPaginationOptions {
  data: TelaahanStafData;
  paperSize?: PaperSizeType;
  margins?: DocumentMargins;
  textDensity?: TextDensityType;
  pageSplitMode?: PageSplitMode;
  fontSizePt?: number;
  lineSpacing?: number; // e.g. 1.0, 1.15, 1.25, 1.5, 2.0, 2.5, 3.0
  fontFamily?: FontFamilyType;
  domMeasurements?: Record<string, number>;
}

export interface DocumentPaginationResult {
  pages: DocumentPageObject[];
  totalPages: number;
  pageHeightLimitMm: number;
  sectionHeights: Record<DocumentSectionId, number>;
  totalCumulativeHeightMm: number;
}

const A4_HEIGHT_MM = 297;

/**
 * Helper to estimate text lines based on character count and column width.
 */
function estimateLines(text: string | undefined | null, charsPerLine = 48): number {
  if (!text || text.trim() === '') return 1;
  const paragraphs = text.split('\n');
  let totalLines = 0;
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (trimmed.length === 0) {
      totalLines += 0.5;
    } else {
      totalLines += Math.max(1, Math.ceil(trimmed.length / charsPerLine));
    }
  }
  return totalLines;
}

/**
 * Calculates height of individual sections (I-VI and Kaki) in millimeters (mm).
 * Calibrated accurately against physical 297mm A4 sheet dimensions.
 */
export function calculateSectionHeights(
  data: TelaahanStafData,
  densityScale = 1.0,
  charsPerLine = 48,
  fontSizePt = 10,
  lineSpacing = 1.15
): Record<DocumentSectionId, number> {
  const safeFontSizePt = Math.max(9.75, fontSizePt);
  const fontRatio = safeFontSizePt / 10;
  const lineSpacingRatio = lineSpacing / 1.15;
  const lineHeightMm = 4.05 * densityScale * fontRatio * lineSpacingRatio;
  const headerHeightMm = 5.5 * densityScale * fontRatio;
  const itemGapMm = 1.2 * densityScale * lineSpacingRatio;

  // I. Persoalan
  const persoalanArr = Array.isArray(data.persoalan)
    ? data.persoalan
    : [data.persoalan || ''];
  const persoalanItems = persoalanArr.filter((i) => i && i.trim() !== '');
  let persoalanLines = 0;
  persoalanItems.forEach((item) => {
    persoalanLines += estimateLines(item, charsPerLine);
  });
  if (persoalanItems.length === 0) persoalanLines = 1;
  const persoalanHeight =
    headerHeightMm +
    persoalanLines * lineHeightMm +
    Math.max(0, persoalanItems.length - 1) * itemGapMm +
    2;

  // II. Praanggapan
  const praanggapanItems = (data.praanggapan || []).filter((i) => i && i.trim() !== '');
  let praanggapanLines = 0;
  praanggapanItems.forEach((item) => {
    praanggapanLines += estimateLines(item, charsPerLine);
  });
  if (praanggapanItems.length === 0) praanggapanLines = 1;
  const praanggapanHeight =
    headerHeightMm +
    praanggapanLines * lineHeightMm +
    Math.max(0, praanggapanItems.length - 1) * itemGapMm +
    2;

  // III. Fakta-fakta yang mempengaruhi
  const faktaItems = (data.fakta || []).filter((i) => i && i.trim() !== '');
  let faktaLines = 0;
  faktaItems.forEach((item) => {
    faktaLines += estimateLines(item, charsPerLine);
  });
  if (faktaItems.length === 0) faktaLines = 1;
  const faktaHeight =
    headerHeightMm +
    faktaLines * lineHeightMm +
    Math.max(0, faktaItems.length - 1) * itemGapMm +
    2;

  // IV. Analisis
  let analisisLines = 0;
  if (data.analisisIntro) {
    analisisLines += estimateLines(data.analisisIntro, charsPerLine);
  }
  const analisisItems = (data.analisis || []).filter((i) => i && i.trim() !== '');
  analisisItems.forEach((item) => {
    analisisLines += estimateLines(item, charsPerLine);
  });
  if (analisisItems.length === 0 && !data.analisisIntro) analisisLines = 1;
  const analisisHeight =
    headerHeightMm +
    analisisLines * lineHeightMm +
    Math.max(0, analisisItems.length - 1) * itemGapMm +
    2;

  // V. Kesimpulan (Sub-sections: Ringkasan, Personil, Rincian Perjalanan)
  let kesimpulanRingkasanHeight = headerHeightMm + 2;
  if (data.kesimpulan?.ringkasan) {
    kesimpulanRingkasanHeight += estimateLines(data.kesimpulan.ringkasan, charsPerLine) * lineHeightMm;
  }
  kesimpulanRingkasanHeight += 3.5 * densityScale * fontRatio;

  const personilCount = (data.kesimpulan?.personil || []).length;
  let kesimpulanPersonilHeight = 0;
  if (personilCount > 0) {
    // 4 lines per personnel (Nama, NIP, Pangkat/Gol, Jabatan) in stacked list format
    kesimpulanPersonilHeight = personilCount * 17.5 * densityScale * fontRatio * lineSpacingRatio + 2;
  }

  // Rincian perjalanan dinas (5 row: Maksud, Tempat Berangkat, Tempat Tujuan, Tgl Berangkat, Tgl Kembali)
  const maksudLength = data.kesimpulan?.maksudPerjalanan || data.header?.hal || '';
  const maksudLines = estimateLines(maksudLength, charsPerLine);
  const kesimpulanRincianHeight = (maksudLines + 4) * 4.5 * densityScale * fontRatio * lineSpacingRatio;

  const kesimpulanTotalHeight = kesimpulanRingkasanHeight + kesimpulanPersonilHeight + kesimpulanRincianHeight;

  // VI. Saran
  const saranItems = (data.saran || []).filter((i) => i && i.trim() !== '');
  let saranLines = 0;
  saranItems.forEach((item) => {
    saranLines += estimateLines(item, charsPerLine);
  });
  if (saranItems.length === 0) saranLines = 1;
  const saranHeight =
    headerHeightMm +
    saranLines * lineHeightMm +
    Math.max(0, saranItems.length - 1) * itemGapMm +
    2;

  // Kaki Naskah (Yang membuat, PPTK, TTD, Nama, NIP)
  const kakiHeight = 35.0 * densityScale * fontRatio;

  return {
    persoalan: Math.round(persoalanHeight * 10) / 10,
    praanggapan: Math.round(praanggapanHeight * 10) / 10,
    fakta: Math.round(faktaHeight * 10) / 10,
    analisis: Math.round(analisisHeight * 10) / 10,
    kesimpulan: Math.round(kesimpulanTotalHeight * 10) / 10,
    kesimpulan_ringkasan: Math.round(kesimpulanRingkasanHeight * 10) / 10,
    kesimpulan_personil: Math.round(kesimpulanPersonilHeight * 10) / 10,
    kesimpulan_rincian: Math.round(kesimpulanRincianHeight * 10) / 10,
    saran: Math.round(saranHeight * 10) / 10,
    kaki: Math.round(kakiHeight * 10) / 10,
  };
}

/**
 * Pure calculation function to split sections into an array of page objects.
 * Maximizes printable page utilization down to the fixed 2.54 cm bottom margin.
 */
export function paginateDocument({
  data,
  paperSize = 'a4',
  margins = DEFAULT_DOCUMENT_MARGINS,
  textDensity = 'auto',
  pageSplitMode = 'auto-fill-95',
  fontSizePt = 10,
  lineSpacing = 1.15,
  domMeasurements,
}: DocumentPaginationOptions): DocumentPaginationResult {
  const densityScale =
    textDensity === 'ultra-compact'
      ? 0.82
      : textDensity === 'compact'
      ? 0.90
      : textDensity === 'standard'
      ? 1.0
      : 0.95;

  const topMarginMm = margins?.topMm ?? 20.0;
  const bottomMarginMm = margins?.bottomMm ?? 25.4;
  const leftMarginMm = margins?.leftMm ?? 25.4;
  const rightMarginMm = margins?.rightMm ?? 25.4;
  const totalVerticalMarginMm = topMarginMm + bottomMarginMm;
  const totalHorizontalMarginMm = leftMarginMm + rightMarginMm;

  // Total paper dimensions in mm (A4: 210x297mm, F4/Folio: 215x330mm)
  const paperWidthMm = paperSize === 'f4' ? 215 : 210;
  const paperHeightMm = paperSize === 'f4' ? 330 : A4_HEIGHT_MM;

  // Max printable width and height per page inside margins
  const maxPrintableHeightMm = Math.max(100, paperHeightMm - totalVerticalMarginMm);
  const maxPrintableWidthMm = Math.max(100, paperWidthMm - totalHorizontalMarginMm);

  // Column 2 (Isi Telaahan) takes 68% of printable width
  const column2WidthMm = maxPrintableWidthMm * 0.68;
  const safeFontSizePt = Math.max(9.75, fontSizePt);
  const fontRatio = safeFontSizePt / 10;
  // With 10pt Times New Roman, letter markers (e.g. 'a.'), borders and cell padding,
  // column 2 reliably fits ~48-50 characters per line without wrapping prematurely
  const baseCharsPerLine = Math.max(36, Math.round((column2WidthMm - 7.0) / 2.05));
  const charsPerLine = Math.max(32, Math.round(baseCharsPerLine / fontRatio));

  const sectionHeights = calculateSectionHeights(data, densityScale, charsPerLine, safeFontSizePt, lineSpacing);

  // Deterministic mathematical height calculation (100% zoom-independent)
  const getMeasured = (_key: string, fallback: number) => {
    return fallback;
  };

  const halExtraLines = Math.max(0, estimateLines(data.header?.hal, charsPerLine) - 1);
  const lineSpacingRatio = lineSpacing / 1.15;
  // Calibrated physical overhead on Page 1:
  // - Kop surat (logo + 4 lines text + double border + margin): ~26mm
  // - Judul dokumen (TELAAHAN STAF + margin): ~7.5mm
  // - Atribut naskah dinas (Yth, Dari, Tanggal, Nomor, Lampiran, Hal 1 line): ~21mm
  // - Tabel header row (KOLOM DISPOSISI | ISI TELAAHAN) + borders & cell padding: ~6.5mm
  // Base sum = 61.0mm (previously overestimated at 123.0mm, which caused 70mm empty space on Page 1)
  const basePage1Overhead = 61.0;
  const fallbackPage1Overhead = Math.round((basePage1Overhead + halExtraLines * 3.5 * lineSpacingRatio) * densityScale * fontRatio * 10) / 10;
  const page1OverheadMm = getMeasured('overhead-page1', fallbackPage1Overhead);

  // Usable content height for sections inside table on Page 1.
  // 4.0mm safety headroom prevents edge-overflow while maximizing page fullness and eliminating blank void.
  const effectivePage1Overhead = Math.max(page1OverheadMm, fallbackPage1Overhead);
  const page1UsableContentHeightMm = Math.max(50, maxPrintableHeightMm - effectivePage1Overhead - 4.0);

  // Fixed overhead on Page 2+ (table top border + cell padding)
  const page2OverheadMm = getMeasured('overhead-page2', 4.0);
  const page2UsableContentHeightMm = Math.max(80, maxPrintableHeightMm - page2OverheadMm - 4.0);

  const lineHeightMm = 4.05 * densityScale * fontRatio * lineSpacingRatio;
  const headerHeightMm = 5.5 * densityScale * fontRatio;
  const itemGapMm = 1.2 * densityScale * lineSpacingRatio;

  // Arrays of raw text items
  const persoalanItems = (Array.isArray(data.persoalan) ? data.persoalan : [data.persoalan || ''])
    .map((i) => (typeof i === 'string' ? i.trim() : ''))
    .filter(Boolean);

  const praanggapanItems = (data.praanggapan || []).map((i) => i.trim()).filter(Boolean);
  const faktaItems = (data.fakta || []).map((i) => i.trim()).filter(Boolean);
  const analisisItems = (data.analisis || []).map((i) => i.trim()).filter(Boolean);
  const saranItems = (data.saran || []).map((i) => i.trim()).filter(Boolean);

  interface FlowableUnit {
    sectionId: DocumentSectionId;
    unitType: 'header' | 'intro' | 'item' | 'kesimpulan_ringkasan' | 'kesimpulan_personil' | 'kesimpulan_rincian' | 'kaki';
    itemIndex?: number;
    heightMm: number;
  }

  const units: FlowableUnit[] = [];

  // 1. Persoalan
  units.push({
    sectionId: 'persoalan',
    unitType: 'header',
    heightMm: getMeasured('persoalan-header', headerHeightMm),
  });
  if (persoalanItems.length === 0) {
    units.push({
      sectionId: 'persoalan',
      unitType: 'item',
      itemIndex: 0,
      heightMm: getMeasured('persoalan-item-0', lineHeightMm + itemGapMm),
    });
  } else {
    persoalanItems.forEach((item, idx) => {
      const fallbackH = estimateLines(item, charsPerLine) * lineHeightMm + itemGapMm;
      units.push({
        sectionId: 'persoalan',
        unitType: 'item',
        itemIndex: idx,
        heightMm: getMeasured(`persoalan-item-${idx}`, fallbackH),
      });
    });
  }

  // 2. Praanggapan
  units.push({
    sectionId: 'praanggapan',
    unitType: 'header',
    heightMm: getMeasured('praanggapan-header', headerHeightMm),
  });
  praanggapanItems.forEach((item, idx) => {
    const fallbackH = estimateLines(item, charsPerLine) * lineHeightMm + itemGapMm;
    units.push({
      sectionId: 'praanggapan',
      unitType: 'item',
      itemIndex: idx,
      heightMm: getMeasured(`praanggapan-item-${idx}`, fallbackH),
    });
  });

  // 3. Fakta
  units.push({
    sectionId: 'fakta',
    unitType: 'header',
    heightMm: getMeasured('fakta-header', headerHeightMm),
  });
  faktaItems.forEach((item, idx) => {
    const fallbackH = estimateLines(item, charsPerLine) * lineHeightMm + itemGapMm;
    units.push({
      sectionId: 'fakta',
      unitType: 'item',
      itemIndex: idx,
      heightMm: getMeasured(`fakta-item-${idx}`, fallbackH),
    });
  });

  // 4. Analisis
  units.push({
    sectionId: 'analisis',
    unitType: 'header',
    heightMm: getMeasured('analisis-header', headerHeightMm),
  });
  if (data.analisisIntro) {
    const fallbackIntroH = estimateLines(data.analisisIntro, charsPerLine) * lineHeightMm + itemGapMm;
    units.push({
      sectionId: 'analisis',
      unitType: 'intro',
      heightMm: getMeasured('analisis-intro', fallbackIntroH),
    });
  }
  analisisItems.forEach((item, idx) => {
    const fallbackH = estimateLines(item, charsPerLine) * lineHeightMm + itemGapMm;
    units.push({
      sectionId: 'analisis',
      unitType: 'item',
      itemIndex: idx,
      heightMm: getMeasured(`analisis-item-${idx}`, fallbackH),
    });
  });

  // 5. Kesimpulan
  units.push({
    sectionId: 'kesimpulan_ringkasan',
    unitType: 'header',
    heightMm: getMeasured('kesimpulan_ringkasan-header', headerHeightMm),
  });
  if (data.kesimpulan?.ringkasan) {
    const fallbackH = estimateLines(data.kesimpulan.ringkasan, charsPerLine) * lineHeightMm + itemGapMm;
    units.push({
      sectionId: 'kesimpulan_ringkasan',
      unitType: 'kesimpulan_ringkasan',
      heightMm: getMeasured('kesimpulan_ringkasan', fallbackH),
    });
  }
  if ((data.kesimpulan?.personil || []).length > 0) {
    const count = data.kesimpulan!.personil.length;
    const fallbackH = count * 17.5 * densityScale * fontRatio * lineSpacingRatio + 2;
    units.push({
      sectionId: 'kesimpulan_personil',
      unitType: 'kesimpulan_personil',
      heightMm: getMeasured('kesimpulan_personil', fallbackH),
    });
  }
  const maksudLen = data.kesimpulan?.maksudPerjalanan || data.header?.hal || '';
  const fallbackRincianH = (estimateLines(maksudLen, charsPerLine) + 4) * 4.5 * densityScale * fontRatio * lineSpacingRatio;
  units.push({
    sectionId: 'kesimpulan_rincian',
    unitType: 'kesimpulan_rincian',
    heightMm: getMeasured('kesimpulan_rincian', fallbackRincianH),
  });

  // 6. Saran
  units.push({
    sectionId: 'saran',
    unitType: 'header',
    heightMm: getMeasured('saran-header', headerHeightMm),
  });
  saranItems.forEach((item, idx) => {
    const fallbackH = estimateLines(item, charsPerLine) * lineHeightMm + itemGapMm;
    units.push({
      sectionId: 'saran',
      unitType: 'item',
      itemIndex: idx,
      heightMm: getMeasured(`saran-item-${idx}`, fallbackH),
    });
  });

  // 7. Kaki Naskah
  const fallbackKakiH = 35.0 * densityScale * fontRatio;
  units.push({
    sectionId: 'kaki',
    unitType: 'kaki',
    heightMm: getMeasured('kaki', fallbackKakiH),
  });

  interface PageBuildingData {
    units: FlowableUnit[];
    usedHeightMm: number;
  }

  const pageUnitsList: PageBuildingData[] = [];
  let currentPageIndex = 0;
  let currentUnits: FlowableUnit[] = [];
  let currentUsedHeight = 0;

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const usableLimit = currentPageIndex === 0 ? page1UsableContentHeightMm : page2UsableContentHeightMm;

    // Check forced splits: 
    // - If paperSize is 'f4': Page 1 fits Bab I s.d Bab V, while Bab VI (Saran) and Kaki Naskah start on Page 2.
    // - If paperSize is 'a4': Page 1 fits Bab I s.d Bab IV, while Bab V (Kesimpulan) and onwards start on Page 2.
    let forceSplit = false;
    if (
      currentPageIndex === 0 &&
      currentUnits.length > 0
    ) {
      if (pageSplitMode === 'split-at-analisis' && unit.sectionId === 'analisis' && unit.unitType === 'header') {
        forceSplit = true;
      } else if (paperSize === 'f4') {
        // F4: Halaman 1 memuat Bab I s.d Bab V. Bab VI (Saran) dipaksa mulai di Halaman 2.
        if (unit.sectionId === 'saran' && unit.unitType === 'header' && pageSplitMode !== 'single-page') {
          forceSplit = true;
        }
      } else {
        // A4: Halaman 1 hanya memuat Bab I s.d Bab IV. Bab V (Kesimpulan) dipaksa mulai di Halaman 2.
        if (unit.sectionId === 'kesimpulan_ringkasan' && unit.unitType === 'header' && pageSplitMode !== 'single-page') {
          forceSplit = true;
        }
      }
    }

    // Check lookahead if header to prevent orphan header at page bottom
    let requiredSpace = unit.heightMm;
    if (unit.unitType === 'header' && i + 1 < units.length) {
      requiredSpace += units[i + 1].heightMm;
    }

    // Smart orphan absorption:
    // If this unit is the final item of a section (e.g. butir e of Praanggapan),
    // and pushing it to the next page would leave a single isolated orphan item at the top of that page,
    // and the current page still has sufficient printable headroom (within 18mm of usable limit),
    // absorb it onto the current page so the section stays unified and fills the page space cleanly without a gap.
    const isFinalItemOfSection = unit.unitType === 'item' && (i + 1 >= units.length || units[i + 1].sectionId !== unit.sectionId);
    const canAbsorbOrphan = isFinalItemOfSection && !forceSplit && (currentUsedHeight + requiredSpace <= usableLimit + 18.0);

    const shouldBreak = currentUnits.length > 0 && (forceSplit || (!canAbsorbOrphan && currentUsedHeight + requiredSpace > usableLimit));

    if (shouldBreak) {
      pageUnitsList.push({
        units: currentUnits,
        usedHeightMm: currentUsedHeight,
      });

      currentPageIndex++;
      currentUnits = [unit];
      currentUsedHeight = unit.heightMm;
    } else {
      currentUnits.push(unit);
      currentUsedHeight += unit.heightMm;
    }
  }

  if (currentUnits.length > 0) {
    pageUnitsList.push({
      units: currentUnits,
      usedHeightMm: currentUsedHeight,
    });
  }

  const sectionList: Array<{ id: DocumentSectionId; sectionNumber: string; title: string }> = [
    { id: 'persoalan', sectionNumber: 'I', title: 'Persoalan' },
    { id: 'praanggapan', sectionNumber: 'II', title: 'Praanggapan' },
    { id: 'fakta', sectionNumber: 'III', title: 'Fakta-fakta yang mempengaruhi' },
    { id: 'analisis', sectionNumber: 'IV', title: 'Analisis' },
    { id: 'kesimpulan_ringkasan', sectionNumber: 'V', title: 'Kesimpulan (Ringkasan)' },
    { id: 'kesimpulan_personil', sectionNumber: '', title: 'Kesimpulan (Personil)' },
    { id: 'kesimpulan_rincian', sectionNumber: '', title: 'Kesimpulan (Rincian)' },
    { id: 'saran', sectionNumber: 'VI', title: 'Saran' },
    { id: 'kaki', sectionNumber: '', title: 'Kaki Naskah (Tanda Tangan)' },
  ];

  const pages: DocumentPageObject[] = pageUnitsList.map((pData, pIdx) => {
    const isFirstPage = pIdx === 0;
    const isLastPage = pIdx === pageUnitsList.length - 1;
    const overhead = isFirstPage ? page1OverheadMm : 0;
    const usableLimit = isFirstPage ? page1UsableContentHeightMm : page2UsableContentHeightMm;

    const pUnits = pData.units;

    const persoalanUnits = pUnits.filter((u) => u.sectionId === 'persoalan');
    const praanggapanUnits = pUnits.filter((u) => u.sectionId === 'praanggapan');
    const faktaUnits = pUnits.filter((u) => u.sectionId === 'fakta');
    const analisisUnits = pUnits.filter((u) => u.sectionId === 'analisis');
    const kesimpulanRingkasanUnits = pUnits.filter((u) => u.sectionId === 'kesimpulan_ringkasan');
    const kesimpulanPersonilUnits = pUnits.filter((u) => u.sectionId === 'kesimpulan_personil');
    const kesimpulanRincianUnits = pUnits.filter((u) => u.sectionId === 'kesimpulan_rincian');
    const saranUnits = pUnits.filter((u) => u.sectionId === 'saran');
    const kakiUnits = pUnits.filter((u) => u.sectionId === 'kaki');

    const sectionsOnPage = Array.from(new Set(pUnits.map((u) => u.sectionId)));

    return {
      pageIndex: pIdx,
      pageNumber: pIdx + 1,
      totalPages: pageUnitsList.length,
      isFirstPage,
      isLastPage,
      sections: sectionsOnPage,
      sectionMetrics: sectionsOnPage.map((id) => ({
        id,
        sectionNumber: sectionList.find((s) => s.id === id)?.sectionNumber || '',
        title: sectionList.find((s) => s.id === id)?.title || '',
        heightMm: sectionHeights[id] || 0,
      })),
      usedContentHeightMm: Math.round(pData.usedHeightMm * 10) / 10,
      overheadHeightMm: overhead,
      totalPageHeightMm: Math.round((pData.usedHeightMm + overhead + totalVerticalMarginMm) * 10) / 10,
      availableHeightMm: Math.round(usableLimit * 10) / 10,
      remainingHeightMm: Math.max(0, Math.round((usableLimit - pData.usedHeightMm) * 10) / 10),
      usedCapacityPercentage: Math.min(100, Math.round((pData.usedHeightMm / usableLimit) * 100)),

      hasKop: isFirstPage,
      hasHeader: isFirstPage,
      hasDisposisi: isFirstPage,

      hasPersoalan: persoalanUnits.length > 0,
      persoalanItemIndices: persoalanUnits
        .filter((u) => u.unitType === 'item' && u.itemIndex !== undefined)
        .map((u) => u.itemIndex!),
      showPersoalanHeader: persoalanUnits.some((u) => u.unitType === 'header'),

      hasPraanggapan: praanggapanUnits.length > 0,
      praanggapanItemIndices: praanggapanUnits
        .filter((u) => u.unitType === 'item' && u.itemIndex !== undefined)
        .map((u) => u.itemIndex!),
      showPraanggapanHeader: praanggapanUnits.some((u) => u.unitType === 'header'),

      hasFakta: faktaUnits.length > 0,
      faktaItemIndices: faktaUnits
        .filter((u) => u.unitType === 'item' && u.itemIndex !== undefined)
        .map((u) => u.itemIndex!),
      showFaktaHeader: faktaUnits.some((u) => u.unitType === 'header'),

      hasAnalisis: analisisUnits.length > 0,
      analisisItemIndices: analisisUnits
        .filter((u) => u.unitType === 'item' && u.itemIndex !== undefined)
        .map((u) => u.itemIndex!),
      showAnalisisHeader: analisisUnits.some((u) => u.unitType === 'header'),
      hasAnalisisIntro: analisisUnits.some((u) => u.unitType === 'intro'),

      hasKesimpulan:
        kesimpulanRingkasanUnits.length > 0 ||
        kesimpulanPersonilUnits.length > 0 ||
        kesimpulanRincianUnits.length > 0,
      showKesimpulanHeader: kesimpulanRingkasanUnits.some((u) => u.unitType === 'header'),
      hasKesimpulanRingkasan: kesimpulanRingkasanUnits.some((u) => u.unitType === 'kesimpulan_ringkasan'),
      hasKesimpulanPersonil: kesimpulanPersonilUnits.length > 0,
      hasKesimpulanRincian: kesimpulanRincianUnits.length > 0,

      hasSaran: saranUnits.length > 0,
      saranItemIndices: saranUnits
        .filter((u) => u.unitType === 'item' && u.itemIndex !== undefined)
        .map((u) => u.itemIndex!),
      showSaranHeader: saranUnits.some((u) => u.unitType === 'header'),

      hasKaki: kakiUnits.length > 0,
    };
  });

  const totalCumulativeHeightMm = pages.reduce(
    (sum, p) => sum + p.usedContentHeightMm + p.overheadHeightMm,
    0
  );

  return {
    pages,
    totalPages: pages.length,
    pageHeightLimitMm: maxPrintableHeightMm,
    sectionHeights,
    totalCumulativeHeightMm: Math.round(totalCumulativeHeightMm * 10) / 10,
  };
}

/**
 * React hook to calculate document pagination reactively.
 */
export function useDocumentPagination(
  options: DocumentPaginationOptions
): DocumentPaginationResult {
  const {
    data,
    paperSize = 'a4',
    margins = DEFAULT_DOCUMENT_MARGINS,
    textDensity = 'auto',
    pageSplitMode = 'auto-fill-95',
    fontSizePt = 10,
    lineSpacing = 1.15,
    fontFamily = 'times',
    domMeasurements,
  } = options;

  return useMemo(() => {
    return paginateDocument({
      data,
      paperSize,
      margins,
      textDensity,
      pageSplitMode,
      fontSizePt,
      lineSpacing,
      fontFamily,
      domMeasurements,
    });
  }, [
    data,
    paperSize,
    margins?.topMm,
    margins?.bottomMm,
    margins?.leftMm,
    margins?.rightMm,
    textDensity,
    pageSplitMode,
    fontSizePt,
    lineSpacing,
    fontFamily,
    domMeasurements,
  ]);
}
