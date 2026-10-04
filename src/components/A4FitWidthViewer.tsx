import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TelaahanStafData,
  FontFamilyType,
  PaperSizeType,
  PageSplitMode,
  DocumentMargins,
  DEFAULT_DOCUMENT_MARGINS,
  MARGIN_PRESET_OPTIONS,
  MarginPresetId,
  PAPER_SIZE_OPTIONS,
  FONT_OPTIONS,
  LINE_SPACING_OPTIONS,
} from '../types';
import { DocumentSheet } from './DocumentSheet';
import { PdfPreviewModal } from './PdfPreviewModal';
import { MobileDocumentReader } from './MobileDocumentReader';
import { useDocumentPagination } from '../hooks/useDocumentPagination';
import { generatePdfFromElement, downloadPdfBlob } from '../utils/pdfGenerator';
import { openPagedJsPdfWindow, generatePagedJsPdf } from '../utils/pagedjsPdf';
import {
  Printer,
  FileDown,
  FileText,
  Loader2,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Type,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Minus,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Home,
  Hand,
  MousePointer,
  RotateCcw,
  Maximize2,
  MoreHorizontal,
  Scissors,
  BookOpen,
  Layers,
  Palette,
  MessageCircle,
} from 'lucide-react';

// Gambar 1: Paper Dimension Icon with blue measurement arrows
const PaperDimensionIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="8" width="13" height="17" rx="1" stroke="#27272a" strokeWidth="1.8" fill="white" />
    <path d="M17 8V12H22" stroke="#27272a" strokeWidth="1.8" />
    <path d="M9 4.5H22M9 4.5L11 2.5M9 4.5L11 6.5M22 4.5L20 2.5M22 4.5L20 6.5" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 8V25M5.5 8L3.5 10M5.5 8L7.5 10M5.5 25L3.5 23M5.5 25L7.5 23" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Gambar 2: Margin Icon with blue inner margin lines
const MarginLinesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="4" width="18" height="21" rx="1.5" stroke="#27272a" strokeWidth="2" fill="white" />
    <rect x="9" y="8" width="10" height="13" stroke="#0284c7" strokeWidth="1.8" fill="none" />
  </svg>
);

// Gambar 3: Line Spacing Icon with blue vertical up/down arrows next to 4 horizontal lines
const LineSpacingIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10L8.5 7M8.5 7L11 10M8.5 7V21M8.5 21L6 18M8.5 21L11 18" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="14" y1="8" x2="23" y2="8" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="12" x2="23" y2="12" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="16" x2="23" y2="16" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="20" x2="23" y2="20" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface A4FitWidthViewerProps {
  data: TelaahanStafData;
  onPrint: () => void;
  onOpenGoogleDocs?: () => void;
  onBackToEditor?: () => void;
  onGoToLauncher?: () => void;
  onMeasurementsUpdate?: (measurements: Record<string, number>) => void;
  paperSize?: 'a4' | 'f4';
  onPaperSizeChange?: (size: 'a4' | 'f4') => void;
}

export const A4FitWidthViewer: React.FC<A4FitWidthViewerProps> = React.memo(({
  data,
  onPrint,
  onOpenGoogleDocs,
  onBackToEditor,
  onGoToLauncher,
  onMeasurementsUpdate,
  paperSize: propPaperSize,
  onPaperSizeChange: propOnPaperSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const formatPanelRef = useRef<HTMLDivElement>(null);

  // Typography & Layout Customization State
  const [localPaperSize, setLocalPaperSize] = useState<PaperSizeType>('a4');
  const paperSize = propPaperSize ?? localPaperSize;
  const setPaperSize = propOnPaperSizeChange ?? setLocalPaperSize;
  const [marginPreset, setMarginPreset] = useState<MarginPresetId>('narrow');
  const [margins, setMargins] = useState<DocumentMargins>(DEFAULT_DOCUMENT_MARGINS);
  const [showMarginGuide, setShowMarginGuide] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<FontFamilyType>('arial');
  const [fontSizePt, setFontSizePt] = useState<number>(10);
  const [lineSpacing, setLineSpacing] = useState<number>(1.125);
  const [pageSplitMode, setPageSplitMode] = useState<PageSplitMode>('auto-fill-95');
  const [showFormatPanel, setShowFormatPanel] = useState<boolean>(false);
  const [isFormatMinimized, setIsFormatMinimized] = useState<boolean>(false);
  const [sheetDragOffsetY, setSheetDragOffsetY] = useState<number>(0);
  const [isSheetDragging, setIsSheetDragging] = useState<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const dragDeltaRef = useRef<number>(0);

  const handleTouchStartSheet = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartYRef.current = clientY;
    dragDeltaRef.current = 0;
    setIsSheetDragging(true);
  };

  const handleTouchMoveSheet = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartYRef.current === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const delta = clientY - touchStartYRef.current;
    dragDeltaRef.current = delta;

    if (!isFormatMinimized) {
      if (delta > 0) {
        setSheetDragOffsetY(delta);
      } else {
        setSheetDragOffsetY(0);
      }
    } else {
      if (delta < 0) {
        setSheetDragOffsetY(delta);
      } else {
        setSheetDragOffsetY(0);
      }
    }
  };

  const handleTouchEndSheet = () => {
    if (touchStartYRef.current === null) return;
    const delta = dragDeltaRef.current;
    touchStartYRef.current = null;
    setIsSheetDragging(false);
    setSheetDragOffsetY(0);

    if (!isFormatMinimized) {
      // Geser ke bawah lebih dari 50px -> minimize
      if (delta > 50) {
        setIsFormatMinimized(true);
      }
    } else {
      // Geser ke atas lebih dari 25px -> buka kembali
      if (delta < -25) {
        setIsFormatMinimized(false);
      }
    }
  };

  const [showZoomPanel, setShowZoomPanel] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeFormatTab, setActiveFormatTab] = useState<string | null>(null);
  const [quickDropdown, setQuickDropdown] = useState<'kertas' | 'font' | 'spasi' | null>(null);

  const paperConfig = PAPER_SIZE_OPTIONS[paperSize] || PAPER_SIZE_OPTIONS.a4;
  const baseWidth = paperConfig.widthPx; // 794 for A4, 813 for F4
  const basePageHeight = paperConfig.heightPx; // 1123 for A4, 1247 for F4

  // Precise Document Pagination to eliminate infinite vertical scroll dead space
  const paginationResult = useDocumentPagination({
    data,
    paperSize,
    margins,
    fontSizePt,
    lineSpacing,
    fontFamily,
    pageSplitMode,
  });
  const totalPages = Math.max(1, paginationResult.pages.length);
  const exactDocHeight = totalPages * basePageHeight + (totalPages - 1) * 24;

  const [zoom, setZoom] = useState<number>(1.0);
  const [fitScale, setFitScale] = useState<number>(1.0);
  const [docUnscaledHeight, setDocUnscaledHeight] = useState<number>(exactDocHeight);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);
  const [isPdfPreviewModalOpen, setIsPdfPreviewModalOpen] = useState(false);
  const [hasInitialCentered, setHasInitialCentered] = useState(false);
  const [viewerTheme, setViewerTheme] = useState<'slate' | 'midnight' | 'studio'>('slate');
  const [badgeStyle, setBadgeStyle] = useState<'capsule' | 'modular' | 'compact'>('capsule');

  // 100% Immersive Mobile View & Control States
  const viewMode = 'a4';
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const goToPage = (pageIdx: number) => {
    const targetPage = Math.max(1, Math.min(totalPages, pageIdx));
    if (containerRef.current) {
      const pageH = basePageHeight * zoom + 24 * zoom;
      const targetY = (targetPage - 1) * pageH;
      containerRef.current.scrollTo({ top: targetY, behavior: 'smooth' });
      setCurrentPage(targetPage);
    }
  };

  const handleShareWhatsApp = () => {
    const formatList = (list: string[], symbol = '-') => {
      if (!list || list.length === 0) return symbol;
      return list.map((item, i) => `${i + 1}. ${item}`).join('\n');
    };

    const text = `*DRAFT TELAAHAN STAF (Disdikbud Kaltara)*\n\n` +
      `*Yth:* ${data.header.yth || '-'}\n` +
      `*Dari:* ${data.header.dari || '-'}\n` +
      `*Perihal:* ${data.header.hal || '-'}\n\n` +
      `*I. Pokok Persoalan:*\n${formatList(data.persoalan || [])}\n\n` +
      `*II. Praanggapan:*\n${formatList(data.praanggapan || [])}\n\n` +
      `*III. Fakta-fakta yang Mempengaruhi:*\n${formatList(data.fakta || [])}\n\n` +
      `*IV. Analisis:*\n${formatList(data.analisis || [])}\n\n` +
      `*V. Kesimpulan (Personil & Jadwal):*\n` +
      `• Ringkasan: ${data.kesimpulan?.ringkasan || '-'}\n` +
      `• Tempat: ${data.kesimpulan?.tempat || '-'}\n` +
      `• Durasi: ${data.kesimpulan?.selama || '-'}\n` +
      `• Tanggal: ${data.kesimpulan?.tanggal || '-'}\n` +
      `• Personil: ${(data.kesimpulan?.personil || []).length > 0 ? (data.kesimpulan?.personil || []).map((p, i) => `${i+1}) ${p.nama} (${p.jabatan})`).join(', ') : '-'}\n\n` +
      `*VI. Saran:*\n${formatList(data.saran || [])}\n\n` +
      `_Mohon petunjuk dan arahan dari pimpinan. Terima kasih._`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const pageH = basePageHeight * zoom + 24 * zoom;
    const pageIndex = Math.floor((scrollTop + pageH / 2) / pageH) + 1;
    const targetPage = Math.max(1, Math.min(totalPages, pageIndex));
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
    }
  };

  // Observe unscaled document height to eliminate infinite vertical scroll dead space
  useEffect(() => {
    const updateDocHeight = () => {
      if (documentRef.current) {
        const measured = documentRef.current.scrollHeight || documentRef.current.offsetHeight;
        if (measured > 0) {
          setDocUnscaledHeight(measured);
        }
      }
    };

    updateDocHeight();
    const timer = setTimeout(updateDocHeight, 150);

    let observer: ResizeObserver | null = null;
    let rafId: number | null = null;

    if (documentRef.current) {
      observer = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          updateDocHeight();
        });
      });
      observer.observe(documentRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, [paperSize, margins, fontSizePt, lineSpacing, fontFamily, pageSplitMode, data]);

  // Measure container and compute ideal "Fit" ratio
  useEffect(() => {
    let resizeRafId: number | null = null;

    const updateDimensions = () => {
      if (containerRef.current) {
        const padding = window.innerWidth < 640 ? 16 : 32;
        const availableWidth = containerRef.current.clientWidth - padding;
        const calculatedFit = Math.max(0.3, Math.min(1.0, availableWidth / baseWidth));
        setFitScale((prev) => (Math.abs(prev - calculatedFit) > 0.01 ? calculatedFit : prev));

        if (!hasInitialCentered) {
          const actualZoom = window.innerWidth < 768 ? calculatedFit : 1.0;
          setZoom(actualZoom);
          setHasInitialCentered(true);
        }
      }
    };

    const throttledUpdate = () => {
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(updateDimensions);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(throttledUpdate);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', throttledUpdate);
    return () => {
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', throttledUpdate);
    };
  }, [fontFamily, fontSizePt, lineSpacing, paperSize, baseWidth, basePageHeight, showFormatPanel, hasInitialCentered]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(2.0, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.3, Number((prev - 0.1).toFixed(2))));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  const handleFitKardus = () => {
    setZoom(fitScale);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const handleRealSize = () => {
    setZoom(1.0);
  };

  const handleResetView = () => {
    setZoom(1.0);
  };

  const handleFitWidth = () => {
    setZoom(fitScale);
  };

  const handleFontSizeDecrease = () => {
    setFontSizePt((prev) => Math.max(9.75, Math.round((prev - 0.25) * 100) / 100));
  };

  const handleFontSizeIncrease = () => {
    setFontSizePt((prev) => Math.min(13.0, Math.round((prev + 0.25) * 100) / 100));
  };

  const handleSelectMarginPreset = (presetId: MarginPresetId) => {
    setMarginPreset(presetId);
    const found = MARGIN_PRESET_OPTIONS.find((p) => p.id === presetId);
    if (found) {
      setMargins({
        topMm: found.topMm,
        bottomMm: found.bottomMm,
        leftMm: found.leftMm,
        rightMm: found.rightMm,
      });
    }
  };

  const handleUpdateMarginMm = (side: keyof DocumentMargins, deltaMm: number) => {
    setMargins((prev) => {
      const val = Math.max(5, Math.min(50, Math.round((prev[side] + deltaMm) * 10) / 10));
      return { ...prev, [side]: val };
    });
  };

  const handleSetMarginExact = (side: keyof DocumentMargins, valueMm: number) => {
    setMargins((prev) => ({
      ...prev,
      [side]: Math.max(5, Math.min(50, Math.round(valueMm * 10) / 10)),
    }));
  };

  const handleDownloadDirectPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      setPdfStatus(`Menyiapkan lembar cetak presisi ${paperConfig.shortName}...`);

      await generatePagedJsPdf(data, {
        paperSize,
        margins,
        fontSizePt,
        lineSpacing,
        fontFamily,
        pageSplitMode,
      });

      setPdfStatus('Jendela PDF Siap');
      setTimeout(() => setPdfStatus(null), 3000);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      openPagedJsPdfWindow(data, { paperSize, margins, fontSizePt, lineSpacing, fontFamily, pageSplitMode });
      setPdfStatus(null);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const zoomPercent = Math.round(zoom * 100);
  const activeFont = FONT_OPTIONS.find((f) => f.id === fontFamily) || FONT_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#E0F2FE]/45 via-[#F3E8FF]/30 to-slate-100 flex flex-col w-full h-full overflow-hidden font-sans animate-in fade-in duration-200">
      {/* 1. AUTO-HIDE TOP CONTROL BAR */}
      <div
        className={`fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100/80 px-2 sm:px-4 py-2 flex items-center justify-between gap-1.5 transition-all duration-300 shadow-xs ${
          isControlsVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Left: Tombol Kembali ke Beranda & Editor (Compact Vertical Stack) */}
        <div className="flex items-center gap-1.5">
          {onGoToLauncher && (
            <button
              type="button"
              onClick={onGoToLauncher}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-[#7F56D9] border border-purple-200/60 active:scale-95 rounded-xl flex flex-col items-center justify-center transition cursor-pointer shrink-0"
              title="Kembali ke Beranda"
            >
              <Home className="w-4 h-4 text-[#7F56D9]" />
              <span className="text-[9.5px] font-bold leading-tight mt-0.5">Beranda</span>
            </button>
          )}

          {onBackToEditor && (
            <button
              type="button"
              onClick={onBackToEditor}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-[#7F56D9] border border-purple-200/60 active:scale-95 rounded-xl flex flex-col items-center justify-center transition cursor-pointer shrink-0"
              title="Kembali ke Editor"
            >
              <ArrowLeft className="w-4 h-4 text-[#7F56D9]" />
              <span className="text-[9.5px] font-bold leading-tight mt-0.5">Formulir</span>
            </button>
          )}
        </div>

        {/* Center: Symmetrical Title */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[11.5px] font-extrabold text-slate-900 tracking-tight leading-none">Pratinjau Lembar</span>
          <span className="text-[9.5px] font-bold text-[#7F56D9] tracking-wider uppercase mt-1 leading-none">Format Resmi ({paperConfig.shortName})</span>
        </div>

        {/* Right: Quick Tools & Cetak */}
        <div className="flex items-center gap-1.5">
          {onOpenGoogleDocs && (
            <button
              type="button"
              onClick={onOpenGoogleDocs}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full text-xs font-bold transition cursor-pointer shrink-0 shadow-md shadow-blue-500/20"
              title="Cetak & Embed via Google Docs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-100" />
              <span className="hidden sm:inline">Google Docs</span>
              <span className="sm:hidden">Docs</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-full text-xs font-bold transition cursor-pointer shrink-0 shadow-md shadow-emerald-600/15"
            title="Bagikan Ringkasan via WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white" />
            <span>WA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenGoogleDocs) {
                onOpenGoogleDocs();
              } else {
                onPrint();
              }
            }}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 shadow-md shadow-blue-500/25"
            title={`Cetak via Google Docs (${paperConfig.shortName})`}
          >
            <Printer className="w-3.5 h-3.5 text-blue-100" />
            <span>Cetak Google Docs</span>
          </button>
        </div>
      </div>

      {/* 🔍 MODAL DIALOG PENGATURAN ZOOM (COMPACT BOTTOM SHEET ON MOBILE) */}
      {showZoomPanel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setShowZoomPanel(false)} />

          <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 p-3.5 sm:p-5 z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 text-slate-800 font-sans space-y-3 max-h-[50vh] overflow-y-auto">
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ZoomIn className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Skala Layar
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Aktif: <strong className="text-emerald-700 font-mono">{zoomPercent}%</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowZoomPanel(false)}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets Grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Pas Lebar', value: fitScale },
                { label: '100% Asli', value: 1.0 },
                { label: '125% Jelas', value: 1.25 },
              ].map((item) => {
                const isSelected = Math.abs(zoom - item.value) < 0.04;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setZoom(item.value);
                      setShowZoomPanel(false);
                    }}
                    className={`p-1.5 rounded-lg border text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{item.label}</div>
                    <div className="text-[9.5px] text-slate-500 font-mono mt-0.5">{Math.round(item.value * 100)}%</div>
                  </button>
                );
              })}
            </div>

            {/* Stepper Manual */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-600">Manual:</span>
              <div className="flex items-center bg-slate-100 rounded-lg border border-slate-300 p-0.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="px-2.5 py-1 hover:bg-white rounded text-slate-800 font-bold text-xs cursor-pointer"
                >
                  -
                </button>
                <span className="px-2.5 font-mono font-bold text-slate-900 text-xs text-center min-w-[40px]">
                  {zoomPercent}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="px-2.5 py-1 hover:bg-white rounded text-slate-800 font-bold text-xs cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📱 MOBILE ADAPTIVE TOOLBAR MENU (BOTTOM SHEET FOR ALL TOOLS) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:hidden animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setIsMobileMenuOpen(false)} />

          <div className="relative w-full bg-white rounded-t-3xl shadow-2xl border border-slate-200 p-4 z-10 animate-in slide-in-from-bottom duration-200 text-slate-800 font-sans space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7F56D9] flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Alat &amp; Navigasi Dokumen
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Satu tempat untuk semua kontrol pratinjau
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 2: Kontrol Skala & Zoom */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Skala Layar ({zoomPercent}%)
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.3}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>-</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetView}
                  className="py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-extrabold text-[#7F56D9] text-center cursor-pointer"
                >
                  100%
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 2.0}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>+</span>
                </button>

                <button
                  type="button"
                  onClick={handleFitWidth}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fit</span>
                </button>
              </div>
            </div>

            {/* Section 3: Cetak & Format */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Aksi &amp; Format
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowFormatPanel(true);
                    setIsFormatMinimized(false);
                  }}
                  className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl text-xs font-bold text-[#7F56D9] flex items-center gap-2 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#7F56D9] shrink-0" />
                  <span>Format Kertas</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsPdfPreviewModalOpen(true);
                  }}
                  className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Pratinjau PDF</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openPagedJsPdfWindow(data, { paperSize, margins, fontSizePt, lineSpacing, fontFamily, pageSplitMode });
                }}
                className="w-full p-3.5 bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 cursor-pointer active:scale-98"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Resmi</span>
              </button>
            </div>

            {/* Section 4: Navigasi Beranda */}
            {onGoToLauncher && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGoToLauncher();
                  }}
                  className="w-full p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Ke Beranda Utama</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {pdfStatus && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{pdfStatus}</span>
        </div>
      )}

      {/* 2. AREA WORKSPACE UTAMA: PANEL FORMAT DI SAMPING KIRI & PRATINJAU DOKUMEN DI KANAN */}
      <div className="w-full flex-1 flex items-start gap-3.5 relative min-h-0 overflow-hidden">
        {/* 🎛️ PANEL FORMAT: BOTTOM SHEET DI MOBILE (<lg), SIDEBAR DI DESKTOP (lg+) */}
        {showFormatPanel && (
          <>
            {/* Backdrop Mobile untuk Auto-Hide / Minimize saat disentuh di luar */}
            {!isFormatMinimized && (
              <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-150"
                onClick={() => setIsFormatMinimized(true)}
              />
            )}

            {/* A. TAMPILAN MINIMIZE DI MOBILE (BOTTOM BAR RAMPING & DAPAT DIGESER KE ATAS) */}
            {isFormatMinimized && (
              <div
                className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md rounded-t-2xl shadow-2xl border-t border-slate-200/90 px-3.5 py-2 flex flex-col cursor-pointer transition-transform duration-150 lg:hidden animate-in slide-in-from-bottom duration-200"
                style={{
                  transform: sheetDragOffsetY < 0 ? `translateY(${sheetDragOffsetY}px)` : undefined,
                }}
                onTouchStart={handleTouchStartSheet}
                onTouchMove={handleTouchMoveSheet}
                onTouchEnd={handleTouchEndSheet}
                onMouseDown={handleTouchStartSheet}
                onMouseMove={handleTouchMoveSheet}
                onMouseUp={handleTouchEndSheet}
                onClick={() => setIsFormatMinimized(false)}
              >
                {/* Drag Up Handle Indicator */}
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-1.5 shrink-0" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900">Format Dokumen</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 ml-1.5">
                        {paperConfig.shortName} • {fontSizePt}pt
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setIsFormatMinimized(false)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
                      title="Buka / Maksimalkan Panel"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Buka</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormatPanel(false);
                        setIsFormatMinimized(false);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Tutup Panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* B. KONTAINER PANEL FORMAT (EXPANDED DI MOBILE / SIDEBAR DI DESKTOP) */}
            <div
              ref={formatPanelRef}
              className={`fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[50vh] sm:max-h-[52vh] flex flex-col lg:static lg:z-auto lg:w-[330px] lg:shrink-0 lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-xs lg:max-h-[84vh] overflow-hidden transition-transform duration-150 font-sans text-slate-800 ${
                isFormatMinimized ? 'hidden lg:flex' : 'flex'
              }`}
              style={{
                transform: !isFormatMinimized && sheetDragOffsetY > 0 ? `translateY(${sheetDragOffsetY}px)` : undefined,
              }}
            >
              {/* Mobile Drag Handle Area (Geser ke bawah untuk minimize) */}
              <div
                className="pt-2.5 pb-1 px-4 cursor-grab active:cursor-grabbing shrink-0 lg:hidden select-none hover:bg-slate-50 transition"
                onTouchStart={handleTouchStartSheet}
                onTouchMove={handleTouchMoveSheet}
                onTouchEnd={handleTouchEndSheet}
                onMouseDown={handleTouchStartSheet}
                onMouseMove={handleTouchMoveSheet}
                onMouseUp={handleTouchEndSheet}
              >
                <div
                  className={`w-12 h-1.5 rounded-full mx-auto transition-colors ${
                    isSheetDragging ? 'bg-emerald-600 w-16' : 'bg-slate-300'
                  }`}
                />
                <div className="text-center text-[9px] text-slate-400 font-medium mt-1">
                  {isSheetDragging ? 'Lepas untuk menyembunyikan panel' : 'Geser ke bawah untuk menutup'}
                </div>
              </div>

              {/* Header Panel (Ringkas & Informatif) */}
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      Format Dokumen
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Pratinjau Langsung • {paperConfig.shortName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Tombol Minimize khusus Mobile */}
                  <button
                    type="button"
                    onClick={() => setIsFormatMinimized(true)}
                    className="lg:hidden p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Perkecil (Minimize)"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowFormatPanel(false);
                      setIsFormatMinimized(false);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Tutup (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MS Word Icon-Only Ribbon Toolbar (No Text on Buttons, Dropdown Menus Matching Gambar 1, 2, 3, 4) */}
              <div className="flex items-center gap-1.5 p-2 bg-slate-100/90 border-b border-slate-200 shrink-0 select-none overflow-x-auto no-scrollbar">
                {/* Gambar 1: Tombol Pilihan Kertas (Icon-Only + Dropdown) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveFormatTab(activeFormatTab === 'kertas' ? null : 'kertas')}
                    className={`h-9 px-2 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                      activeFormatTab === 'kertas'
                        ? 'bg-purple-100 border-[#7F56D9] text-[#7F56D9] shadow-2xs font-extrabold'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Pilihan Ukuran Kertas (A4 / F4)"
                  >
                    <PaperDimensionIcon className="w-5 h-5 shrink-0" />
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeFormatTab === 'kertas' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Ukuran Kertas */}
                  {activeFormatTab === 'kertas' && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 min-w-[190px] animate-in fade-in zoom-in-95 duration-100">
                      {(Object.keys(PAPER_SIZE_OPTIONS) as PaperSizeType[]).map((key) => {
                        const item = PAPER_SIZE_OPTIONS[key];
                        const isSelected = paperSize === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setPaperSize(key);
                              setActiveFormatTab(null);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 transition cursor-pointer ${
                              isSelected ? 'font-bold bg-purple-50/80 text-purple-950' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-4 text-[#7F56D9] font-extrabold text-sm">{isSelected ? '✓' : ''}</span>
                              <div>
                                <div className="font-extrabold">{item.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{item.dimensionsMm}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Gambar 2: Tombol Margin Lembar Cetak */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveFormatTab(activeFormatTab === 'margin' ? null : 'margin')}
                    className={`h-9 px-2 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                      activeFormatTab === 'margin'
                        ? 'bg-purple-100 border-[#7F56D9] text-[#7F56D9] shadow-2xs font-extrabold'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Batas Margin Lembar Cetak"
                  >
                    <MarginLinesIcon className="w-5 h-5 shrink-0" />
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeFormatTab === 'margin' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Margin */}
                  {activeFormatTab === 'margin' && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 min-w-[210px] animate-in fade-in zoom-in-95 duration-100">
                      {MARGIN_PRESET_OPTIONS.map((preset) => {
                        const isSelected = marginPreset === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setMarginPreset(preset.id);
                              setMargins({
                                topMm: preset.topMm,
                                bottomMm: preset.bottomMm,
                                leftMm: preset.leftMm,
                                rightMm: preset.rightMm,
                              });
                              setActiveFormatTab(null);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 transition cursor-pointer ${
                              isSelected ? 'font-bold bg-purple-50/80 text-purple-950' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-4 text-[#7F56D9] font-extrabold text-sm">{isSelected ? '✓' : ''}</span>
                              <div>
                                <div className="font-extrabold">{preset.name}</div>
                                <div className="text-[10px] text-slate-500">{preset.badge}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="h-5 w-[1px] bg-slate-300 mx-0.5" />

                {/* Font Family Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveFormatTab(activeFormatTab === 'font' ? null : 'font')}
                    className={`h-9 px-2 rounded-lg border transition flex items-center gap-1 cursor-pointer max-w-[130px] ${
                      activeFormatTab === 'font'
                        ? 'bg-purple-100 border-[#7F56D9] text-[#7F56D9] shadow-2xs font-extrabold'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Jenis Font"
                  >
                    <span className="text-xs font-extrabold truncate">
                      {FONT_OPTIONS.find((f) => f.id === fontFamily)?.name || 'Font'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${activeFormatTab === 'font' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Font */}
                  {activeFormatTab === 'font' && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 min-w-[180px] animate-in fade-in zoom-in-95 duration-100">
                      {FONT_OPTIONS.map((f) => {
                        const isSelected = fontFamily === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setFontFamily(f.id as FontFamilyType);
                              setActiveFormatTab(null);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 transition cursor-pointer ${
                              isSelected ? 'font-bold bg-purple-50/80 text-purple-950' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-4 text-[#7F56D9] font-extrabold text-sm">{isSelected ? '✓' : ''}</span>
                              <div>
                                <div className="font-extrabold">{f.name}</div>
                                <div className="text-[10px] text-slate-500">{f.category}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Font Size Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveFormatTab(activeFormatTab === 'fontsize' ? null : 'fontsize')}
                    className={`h-9 px-2 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                      activeFormatTab === 'fontsize'
                        ? 'bg-purple-100 border-[#7F56D9] text-[#7F56D9] shadow-2xs font-extrabold'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Ukuran Font (pt)"
                  >
                    <span className="text-xs font-mono font-bold">{fontSizePt} pt</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeFormatTab === 'fontsize' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Font Size */}
                  {activeFormatTab === 'fontsize' && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 min-w-[120px] animate-in fade-in zoom-in-95 duration-100">
                      {[9.75, 10.0, 11.0, 12.0].map((sz) => {
                        const isSelected = fontSizePt === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              setFontSizePt(sz);
                              setActiveFormatTab(null);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-slate-100 transition cursor-pointer ${
                              isSelected ? 'font-bold bg-purple-50/80 text-purple-950' : 'text-slate-700'
                            }`}
                          >
                            <span className="w-4 text-[#7F56D9] font-extrabold text-sm">{isSelected ? '✓' : ''}</span>
                            <span className="font-mono">{sz} pt</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="h-5 w-[1px] bg-slate-300 mx-0.5" />

                {/* Gambar 3: Tombol Spasi (Icon-Only + Dropdown) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveFormatTab(activeFormatTab === 'spasi' ? null : 'spasi')}
                    className={`h-9 px-2 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                      activeFormatTab === 'spasi'
                        ? 'bg-purple-100 border-[#7F56D9] text-[#7F56D9] shadow-2xs font-extrabold'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Kerapatan Spasi Baris"
                  >
                    <LineSpacingIcon className="w-5 h-5 shrink-0" />
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeFormatTab === 'spasi' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Spasi (1.0, 1.125, 1.15, 1.25, 1.5) */}
                  {activeFormatTab === 'spasi' && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[130px] animate-in fade-in zoom-in-95 duration-100">
                      {[1.0, 1.125, 1.15, 1.25, 1.5].map((val) => {
                        const isSelected = lineSpacing === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setLineSpacing(val);
                              setActiveFormatTab(null);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-slate-100 transition cursor-pointer ${
                              isSelected ? 'font-extrabold bg-slate-100 text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            <span className="w-4 text-emerald-600 font-extrabold text-sm">{isSelected ? '✓' : ''}</span>
                            <span className="font-mono text-xs">{val.toString().replace('.', ',')}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="h-5 w-[1px] bg-slate-300 mx-0.5" />

                {/* Tombol Pemisah Halaman (Page Split Dropdown) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveFormatTab(activeFormatTab === 'pisah' ? null : 'pisah')}
                    className={`h-9 px-2 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                      activeFormatTab === 'pisah'
                        ? 'bg-purple-100 border-[#7F56D9] text-[#7F56D9] shadow-2xs font-extrabold'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                    title="Pemisahan Halaman (Page Split)"
                  >
                    <Scissors className="w-4 h-4 text-slate-700 shrink-0" />
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeFormatTab === 'pisah' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Page Split */}
                  {activeFormatTab === 'pisah' && (
                    <div className="absolute top-full right-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 min-w-[180px] animate-in fade-in zoom-in-95 duration-100">
                      {[
                        { id: 'auto-fill-95', title: 'Otomatis Presisi' },
                        { id: 'split-at-analisis', title: 'Potong di Bab IV' },
                        { id: 'split-at-kesimpulan', title: 'Potong di Bab V' },
                      ].map((mode) => {
                        const isSelected = pageSplitMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                              setPageSplitMode(mode.id as PageSplitMode);
                              setActiveFormatTab(null);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-slate-100 transition cursor-pointer ${
                              isSelected ? 'font-bold bg-purple-50/80 text-purple-950' : 'text-slate-700'
                            }`}
                          >
                            <span className="w-4 text-[#7F56D9] font-extrabold text-sm">{isSelected ? '✓' : ''}</span>
                            <span>{mode.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Area Konten Ribbon Format (MS Word Style Compact Layout) */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                {/* 1. KATEGORI: UKURAN KERTAS */}
                {activeFormatTab === 'kertas' && (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="text-[11px] font-extrabold text-slate-700">Pilihan Ukuran Kertas:</div>

                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(PAPER_SIZE_OPTIONS) as PaperSizeType[]).map((key) => {
                        const item = PAPER_SIZE_OPTIONS[key];
                        const isSelected = paperSize === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setPaperSize(key)}
                            className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-purple-50 border-[#7F56D9] text-purple-950 font-bold shadow-2xs ring-1 ring-purple-500/30'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-extrabold">{item.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.dimensionsMm}</div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#7F56D9] shrink-0 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. KATEGORI: FONT & UKURAN TEKS */}
                {activeFormatTab === 'font' && (
                  <div className="space-y-2.5 animate-in fade-in duration-150">
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-700 mb-1.5">Jenis Font (Tipografi):</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {FONT_OPTIONS.map((f) => {
                          const isSelected = fontFamily === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setFontFamily(f.id as FontFamilyType)}
                              className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-50 border-[#7F56D9] text-purple-950 font-extrabold shadow-2xs'
                                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <div className="text-xs font-bold leading-tight">{f.name}</div>
                              <div className="text-[9px] text-slate-500 mt-0.5">{f.category}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font Size Compact Stepper & Slider */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                        <span>Ukuran Teks Naskah:</span>
                        <span className="font-mono text-xs font-extrabold text-[#7F56D9] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {fontSizePt} pt
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="9.0"
                          max="14.0"
                          step="0.25"
                          value={fontSizePt}
                          onChange={(e) => setFontSizePt(parseFloat(e.target.value))}
                          className="flex-1 h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-[#7F56D9]"
                        />
                      </div>

                      {/* Touch-Friendly Compact Chips */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { size: 9.75, label: '9.75 pt' },
                          { size: 10, label: '10.0 pt' },
                          { size: 11, label: '11.0 pt' },
                        ].map((c) => (
                          <button
                            key={c.size}
                            type="button"
                            onClick={() => setFontSizePt(c.size)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer text-center ${
                              fontSizePt === c.size
                                ? 'bg-[#7F56D9] text-white border-[#7F56D9]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. KATEGORI: SPASI BARIS */}
                {activeFormatTab === 'spasi' && (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="text-[11px] font-extrabold text-slate-700">Kerapatan Spasi Paragraf:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {LINE_SPACING_OPTIONS.map((item) => {
                        const isSelected = lineSpacing === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setLineSpacing(item.value)}
                            className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-purple-50 border-[#7F56D9] text-purple-950 font-bold shadow-2xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-extrabold">Spasi {item.label}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#7F56D9] shrink-0 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. KATEGORI: PEMISAHAN HALAMAN */}
                {activeFormatTab === 'pisah' && (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="text-[11px] font-extrabold text-slate-700">Mode Titik Potong Halaman (Page Split):</div>
                    <div className="space-y-1.5">
                      {[
                        { id: 'auto-fill-95', title: 'Otomatis Presisi', desc: 'Isi halaman 1 secara optimal sesuai tinggi isi' },
                        { id: 'split-at-analisis', title: 'Potong di Bab IV', desc: 'Bab I-III Hal 1, Bab IV-VI Hal 2' },
                        { id: 'split-at-kesimpulan', title: 'Potong di Bab V', desc: 'Bab I-IV Hal 1, Bab V-VI Hal 2' },
                      ].map((mode) => {
                        const isSelected = pageSplitMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setPageSplitMode(mode.id as PageSplitMode)}
                            className={`w-full p-2.5 rounded-xl text-left border transition cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-purple-50 border-[#7F56D9] text-purple-950 font-bold shadow-2xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-extrabold text-slate-900">{mode.title}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{mode.desc}</div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#7F56D9] shrink-0 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 🔒 BOTTOM COMPACT ACTION FOOTER */}
              <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowFormatPanel(false);
                    setIsFormatMinimized(false);
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] hover:opacity-95 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-purple-200 stroke-[3]" />
                  <span>Simpan &amp; Terapkan Format</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* 📄 AREA KANAN: WORKSPACE PRATINJAU DOKUMEN (FLAT & MINIMALIST) */}
        {/* MODE PRESISI A4 (Kanvas Kertas Fisik Imersif) */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 w-full h-full bg-gradient-to-b from-[#E0F2FE]/45 via-[#F3E8FF]/30 to-slate-100 overflow-y-auto overflow-x-hidden pt-16 pb-24 px-2 flex flex-col items-center"
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          {/* Symmetrical Wrapper that scales perfectly with the zoom factor without getting cut off */}
          <div
            style={{
              width: `${baseWidth * zoom}px`,
              height: `${exactDocHeight * zoom}px`,
              minHeight: `${exactDocHeight * zoom}px`,
              position: 'relative',
              margin: '24px auto',
            }}
            className="shrink-0 transition-all duration-150"
          >
            <div
              ref={documentRef}
              style={{
                width: `${baseWidth}px`,
                height: `${exactDocHeight}px`,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              className="shadow-xl bg-white origin-top-left border border-purple-100/30"
            >
              <DocumentSheet
                data={data}
                paperSize={paperSize}
                margins={margins}
                showMarginGuide={showMarginGuide}
                fontFamily={fontFamily}
                fontSizePt={fontSizePt}
                lineSpacing={lineSpacing}
                pageSplitMode={pageSplitMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. FLOATING ACTION CONTROLS & PAGINASI CHIP (AUTO-HIDE ON SCROLL DOWN) */}
      {badgeStyle === 'capsule' && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-purple-100/80 text-slate-800 px-3.5 py-1.5 rounded-full shadow-lg shadow-purple-500/10 transition-all duration-300 whitespace-nowrap ${
            isControlsVisible && !showFormatPanel ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 hover:bg-purple-50 disabled:opacity-30 rounded-full transition cursor-pointer text-[#7F56D9]"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 text-[#7F56D9]" />
          </button>

          <span className="px-2 font-extrabold text-[#7F56D9] text-xs tracking-wide whitespace-nowrap">
            Hal {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 hover:bg-purple-50 disabled:opacity-30 rounded-full transition cursor-pointer text-[#7F56D9]"
            title="Halaman Berikutnya"
          >
            <ChevronRight className="w-4 h-4 text-[#7F56D9]" />
          </button>

          <div className="h-4 w-px bg-purple-100 mx-1" />

          <button
            type="button"
            onClick={handleFitKardus}
            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 active:scale-95 text-[#7F56D9] rounded-full text-[11px] font-bold transition cursor-pointer border border-purple-200/55 whitespace-nowrap"
            title="Sesuaikan dengan Lebar Layar"
          >
            Fit
          </button>

          <span className="text-[11px] font-mono font-bold text-[#7F56D9] min-w-[36px] text-center whitespace-nowrap">
            {Math.round(zoom * 100)}%
          </span>

          <div className="h-4 w-px bg-purple-100 mx-1" />

          <button
            type="button"
            onClick={() => setBadgeStyle('modular')}
            className="p-1.5 hover:bg-purple-50 text-[#7F56D9]/70 hover:text-[#7F56D9] rounded-full transition cursor-pointer"
            title="Ubah Bentuk: Modular"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {badgeStyle === 'modular' && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 bg-white/95 backdrop-blur-md border border-purple-200/60 text-slate-800 p-2.5 rounded-2xl shadow-xl shadow-purple-500/10 transition-all duration-300 min-w-[280px] max-w-[310px] ${
            isControlsVisible && !showFormatPanel ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Row: Navigation and Page */}
          <div className="flex items-center justify-between w-full gap-2 px-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 disabled:opacity-30 rounded-lg text-[10.5px] transition text-[#7F56D9] font-bold"
            >
              Sebelum
            </button>
            <span className="font-extrabold text-[#7F56D9] text-[11px] tracking-wide bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 whitespace-nowrap">
              Hal {currentPage} dari {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 disabled:opacity-30 rounded-lg text-[10.5px] transition text-[#7F56D9] font-bold"
            >
              Lanjut
            </button>
          </div>

          {/* Bottom Row: Zoom Details and Switcher */}
          <div className="flex items-center justify-between w-full border-t border-purple-100/50 pt-1.5 px-1 gap-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleFitKardus}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold border border-slate-200 whitespace-nowrap"
              >
                Fit Lebar
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                Zoom: {Math.round(zoom * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => setBadgeStyle('compact')}
              className="px-1.5 py-0.5 bg-[#7F56D9]/10 hover:bg-[#7F56D9]/20 text-[#7F56D9] rounded-md text-[9.5px] font-extrabold flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              <span>Ganti Bentuk</span>
            </button>
          </div>
        </div>
      )}

      {badgeStyle === 'compact' && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-2.5 bg-white/95 text-slate-800 pl-3.5 pr-1.5 py-1.5 rounded-xl border border-purple-200 shadow-xl shadow-purple-500/10 min-w-[270px] max-w-[295px] transition-all duration-300 ${
            isControlsVisible && !showFormatPanel ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
          }`}
        >
          {/* Left info */}
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[11px] font-extrabold text-[#7F56D9] tracking-wider whitespace-nowrap">
              Hal {currentPage} / {totalPages}
            </span>
            <span className="text-[10px] text-slate-300">|</span>
            <span className="text-[10px] font-mono text-slate-600 font-semibold whitespace-nowrap">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Right action group */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1 hover:bg-purple-50 disabled:opacity-20 rounded transition text-[#7F56D9]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1 hover:bg-purple-50 disabled:opacity-20 rounded transition text-[#7F56D9]"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFitKardus}
              className="px-1.5 py-0.5 bg-[#7F56D9] hover:bg-[#7F56D9]/90 text-white rounded text-[9.5px] font-extrabold"
            >
              Fit
            </button>
            <button
              type="button"
              onClick={() => setBadgeStyle('capsule')}
              className="p-1 text-[#7F56D9]/60 hover:text-[#7F56D9] transition"
              title="Kembali ke Kapsul"
            >
              <Layers className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 📄 JENDELA POP-UP PREVIEW PDF DENGAN HAND TOOL & ZOOM */}
      <PdfPreviewModal
        isOpen={isPdfPreviewModalOpen}
        onClose={() => setIsPdfPreviewModalOpen(false)}
        data={data}
        paperSize={paperSize}
        margins={margins}
        fontSizePt={fontSizePt}
        lineSpacing={lineSpacing}
        fontFamily={fontFamily}
        pageSplitMode={pageSplitMode}
      />
    </div>
  );
});
