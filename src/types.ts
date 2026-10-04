export interface Personil {
  id: string;
  nama: string;
  nip: string;
  pangkatGol: string;
  jabatan: string;
}

export interface KopSurat {
  namaInstansiAtas: string;
  namaDinas: string;
  alamat: string;
  teleponFaks: string;
  poselEmail: string;
  ibuKota: string;
  logoType: 'kaltara' | 'garuda' | 'kemendikbud' | 'custom';
  customLogoUrl?: string;
}

export interface HeaderSurat {
  yth: string;
  dari: string;
  tanggalSurat: string;
  nomorSurat: string;
  lampiran: string;
  hal: string;
}

export interface DisposisiPimpinan {
  jabatanPimpinan: string;
  status: 'setuju' | 'tidak_setuju' | 'kosong';
  catatan: string;
  parafImage?: string | null;
  tanggalDisposisi?: string;
}

export interface KesimpulanTelaah {
  poin?: string[];
  ringkasan?: string;
  intro: string;
  personil: Personil[];
  kegiatanIntro: string;
  tempat: string;
  selama: string;
  tanggal: string;
  maksudPerjalanan?: string;
  tempatBerangkat?: string;
  tempatTujuan?: string;
  tanggalBerangkat?: string;
  tanggalKembali?: string;
  lamanyaPerjalanan?: string;
  pembebananAnggaran?: string;
}

export interface KakiNaskah {
  tempatTanggal: string;
  yangMembuatLabel: string;
  jabatanPembuat: string;
  namaPembuat: string;
  pangkatPembuat: string;
  nipPembuat: string;
  ttdDigital?: string | null;
}

export interface TelaahanStafData {
  id: string;
  judul: string;
  kop: KopSurat;
  header: HeaderSurat;
  disposisi: DisposisiPimpinan;
  persoalan: string[];
  praanggapan: string[];
  fakta: string[];
  analisisIntro: string;
  analisis: string[];
  kesimpulan: KesimpulanTelaah;
  saran: string[];
  kaki: KakiNaskah;
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'launcher' | 'editor' | 'preview' | 'informasi-umum';

export type MarginPresetType = 'normal' | 'narrow' | 'moderate' | 'wide';
export type TextDensityType = 'auto' | 'standard' | 'compact' | 'ultra-compact';
export type PageSplitMode = 'unified' | 'auto-fill-95' | 'split-at-kesimpulan' | 'split-at-analisis' | 'single-page';

export type FontFamilyType = 'arial' | 'tahoma' | 'times';
export type LineSpacingValue = 1.0 | 1.125 | 1.15 | 1.25 | 1.5 | 2.0 | number;
export type PaperSizeType = 'a4' | 'f4';

export interface PaperSizeConfig {
  id: PaperSizeType;
  name: string;
  shortName: string;
  badge: string;
  dimensionsMm: string;
  widthPx: number;
  heightPx: number;
  mmWidth: number;
  mmHeight: number;
}

export const PAPER_SIZE_OPTIONS: Record<PaperSizeType, PaperSizeConfig> = {
  a4: {
    id: 'a4',
    name: 'A4 (210 × 297 mm)',
    shortName: 'A4',
    badge: '210 × 297 mm',
    dimensionsMm: '210 × 297 mm',
    widthPx: 794,
    heightPx: 1123,
    mmWidth: 210,
    mmHeight: 297,
  },
  f4: {
    id: 'f4',
    name: 'F4 / Folio (215 × 330 mm)',
    shortName: 'F4 / Folio',
    badge: '215 × 330 mm',
    dimensionsMm: '215 × 330 mm',
    widthPx: 813,
    heightPx: 1247,
    mmWidth: 215,
    mmHeight: 330,
  },
};

export interface TypographyConfig {
  fontFamily: FontFamilyType;
  fontSizePt: number;
  lineSpacing: number;
  paragraphSpacing?: 'compact' | 'normal' | 'relaxed';
}

export const FONT_OPTIONS: Array<{ id: FontFamilyType; name: string; cssFont: string; category: string }> = [
  { id: 'arial', name: 'Arial', cssFont: "Arial, Helvetica, sans-serif", category: 'Standar Modern' },
  { id: 'tahoma', name: 'Tahoma', cssFont: "Tahoma, Verdana, Segoe, sans-serif", category: 'Jelas & Ringkas' },
  { id: 'times', name: 'Times New Roman', cssFont: "'Tinos', 'Times New Roman', Times, serif", category: 'Klasik Dinas' },
];

export const LINE_SPACING_OPTIONS = [
  { value: 1.0, label: '1,0', desc: 'Single' },
  { value: 1.125, label: '1,125', desc: 'Standar Rapi (Default)' },
  { value: 1.15, label: '1,15', desc: 'MS Word' },
  { value: 1.25, label: '1,25', desc: 'Standar Dinas' },
  { value: 1.5, label: '1,5', desc: '1.5 Spasi' },
];

// Default Narrow Margin (1.27 cm / 12.7 mm pada seluruh sisi)
export const OFFICIAL_MARGIN = {
  top: '1.27cm',
  bottom: '1.27cm',
  left: '1.27cm',
  right: '1.27cm',
  topMm: 12.7,
  bottomMm: 12.7,
  leftMm: 12.7,
  rightMm: 12.7,
  paddingCss: '12.7mm 12.7mm 12.7mm 12.7mm',
};

export interface DocumentMargins {
  topMm: number;
  bottomMm: number;
  leftMm: number;
  rightMm: number;
}

export type MarginPresetId = 'narrow' | 'standard' | 'normal';

export interface MarginPresetOption {
  id: MarginPresetId;
  name: string;
  badge: string;
  desc: string;
  topMm: number;
  bottomMm: number;
  leftMm: number;
  rightMm: number;
}

export const MARGIN_PRESET_OPTIONS: MarginPresetOption[] = [
  {
    id: 'narrow',
    name: 'Narrow (1,27 cm)',
    badge: '1.27 cm Semua Sisi',
    desc: 'Batas margin rapat 1,27 cm (0,5 inci) untuk efisiensi ruang dan kerapian lembar cetak',
    topMm: 12.7,
    bottomMm: 12.7,
    leftMm: 12.7,
    rightMm: 12.7,
  },
  {
    id: 'standard',
    name: 'Standar Dinas (2,0 cm / 2,5 cm)',
    badge: 'Atas/Bwh 2cm, Kiri 2.5cm',
    desc: 'Batas margin baku tata naskah dinas pemerintah (kiri 2,5 cm untuk jilid)',
    topMm: 20,
    bottomMm: 20,
    leftMm: 25,
    rightMm: 20,
  },
  {
    id: 'normal',
    name: 'Normal Word (2,54 cm)',
    badge: '2.54 cm (1 Inci) Semua Sisi',
    desc: 'Batas margin standar MS Word 2,54 cm pada seluruh sisi',
    topMm: 25.4,
    bottomMm: 25.4,
    leftMm: 25.4,
    rightMm: 25.4,
  },
];

export const DEFAULT_DOCUMENT_MARGINS: DocumentMargins = {
  topMm: 12.7,
  bottomMm: 12.7,
  leftMm: 12.7,
  rightMm: 12.7,
};

export interface MarginConfig {
  type: MarginPresetType;
  name: string;
  badge: string;
  description: string;
  top: string;
  right: string;
  bottom: string;
  left: string;
  paddingCss: string; // e.g. "12.7mm 12.7mm 12.7mm 12.7mm"
  // Typographic and spacing calibration for zero-overflow
  bodyTextSize: string;
  tableTextSize: string;
  headerTextSize: string;
  titleTextSize: string;
  cellPadding: string;
  sectionGap: string;
  lineHeight: string;
  logoSize: string;
}

export const MARGIN_PRESETS: Record<MarginPresetType, MarginConfig> = {
  narrow: {
    type: 'narrow',
    name: 'Narrow / Sempit',
    badge: '1,27 cm (0,5 inch)',
    description: '1,27 cm di semua sisi. Ruang cetak maksimal (184,6 × 271,6 mm), sangat cocok untuk dokumen padat.',
    top: '1.27cm',
    right: '1.27cm',
    bottom: '1.27cm',
    left: '1.27cm',
    paddingCss: '12.7mm 12.7mm 12.7mm 12.7mm',
    bodyTextSize: 'text-[9.5pt]',
    tableTextSize: 'text-[9pt]',
    headerTextSize: 'text-[9.5pt]',
    titleTextSize: 'text-[12pt]',
    cellPadding: 'p-2',
    sectionGap: 'mb-2.5',
    lineHeight: 'leading-normal',
    logoSize: 'w-18 h-18',
  },
  normal: {
    type: 'normal',
    name: 'Normal (Standar Surat Bisnis)',
    badge: '2,54 cm (1 inch)',
    description: '2,54 cm (1 inch) di semua sisi (Top, Right, Bottom, Left). Standar tata naskah dinas resmi.',
    top: '2.54cm',
    right: '2.54cm',
    bottom: '2.54cm',
    left: '2.54cm',
    paddingCss: '25.4mm 25.4mm 25.4mm 25.4mm',
    bodyTextSize: 'text-[8.5pt]',
    tableTextSize: 'text-[8pt]',
    headerTextSize: 'text-[8.5pt]',
    titleTextSize: 'text-[10.5pt]',
    cellPadding: 'p-1.5',
    sectionGap: 'mb-1.5',
    lineHeight: 'leading-tight',
    logoSize: 'w-14 h-14',
  },
  moderate: {
    type: 'moderate',
    name: 'Moderate / Sedang',
    badge: 'T/B: 2,54 cm | L/R: 1,91 cm',
    description: 'Top & Bottom: 2,54 cm (1 inch) | Left & Right: 1,91 cm (0,75 inch). Keseimbangan proporsi dan kepadatan.',
    top: '2.54cm',
    right: '1.91cm',
    bottom: '2.54cm',
    left: '1.91cm',
    paddingCss: '25.4mm 19.1mm 25.4mm 19.1mm',
    bodyTextSize: 'text-[8.5pt]',
    tableTextSize: 'text-[8pt]',
    headerTextSize: 'text-[8.5pt]',
    titleTextSize: 'text-[11pt]',
    cellPadding: 'p-1.5',
    sectionGap: 'mb-1.5',
    lineHeight: 'leading-snug',
    logoSize: 'w-15 h-15',
  },
  wide: {
    type: 'wide',
    name: 'Wide / Lebar',
    badge: 'T/B: 2,54 cm | L/R: 5,08 cm',
    description: 'Top & Bottom: 2,54 cm (1 inch) | Left & Right: 5,08 cm (2 inch). Teks terpusat rapi di tengah halaman.',
    top: '2.54cm',
    right: '5.08cm',
    bottom: '2.54cm',
    left: '5.08cm',
    paddingCss: '25.4mm 50.8mm 25.4mm 50.8mm',
    bodyTextSize: 'text-[8pt]',
    tableTextSize: 'text-[7.5pt]',
    headerTextSize: 'text-[8pt]',
    titleTextSize: 'text-[10pt]',
    cellPadding: 'p-1',
    sectionGap: 'mb-1',
    lineHeight: 'leading-tight',
    logoSize: 'w-12 h-12',
  },
};
