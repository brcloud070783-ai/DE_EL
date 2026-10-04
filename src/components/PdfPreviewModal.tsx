import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TelaahanStafData,
  PaperSizeType,
  FontFamilyType,
  DocumentMargins,
  PageSplitMode,
  PAPER_SIZE_OPTIONS,
  DEFAULT_DOCUMENT_MARGINS,
} from '../types';
import { DocumentSheet } from './DocumentSheet';
import { generatePdfFromElement, downloadPdfBlob } from '../utils/pdfGenerator';
import { openPagedJsPdfWindow } from '../utils/pagedjsPdf';
import {
  Hand,
  MousePointer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  Printer,
  ExternalLink,
  X,
  Loader2,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
  paperSize?: PaperSizeType;
  margins?: DocumentMargins;
  fontSizePt?: number;
  lineSpacing?: number;
  fontFamily?: FontFamilyType;
  pageSplitMode?: PageSplitMode;
}

const ZOOM_PRESETS = [0.5, 0.75, 0.9, 1.0, 1.25, 1.5, 2.0];

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  paperSize = 'a4',
  margins = DEFAULT_DOCUMENT_MARGINS,
  fontSizePt = 10,
  lineSpacing = 1.15,
  fontFamily = 'times',
  pageSplitMode = 'auto-fill-95',
}) => {
  const paperConfig = PAPER_SIZE_OPTIONS[paperSize] || PAPER_SIZE_OPTIONS.a4;

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHandTool, setIsHandTool] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Download state
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Refs
  const viewportRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const spacePressedRef = useRef<boolean>(false);

  // Reset zoom & pan when opening
  useEffect(() => {
    if (isOpen) {
      setPan({ x: 0, y: 0 });
      // Calculate responsive initial fit
      if (viewportRef.current) {
        const vpWidth = viewportRef.current.clientWidth - 80;
        const initialZoom = Math.min(1.0, Math.max(0.65, vpWidth / paperConfig.widthPx));
        setZoom(Number(initialZoom.toFixed(2)));
      } else {
        setZoom(0.9);
      }
      setIsHandTool(true);
      setDownloadSuccess(false);
    }
  }, [isOpen, paperConfig.widthPx]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom((prev) => Math.min(2.5, Number((prev + 0.15).toFixed(2))));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoom((prev) => Math.max(0.3, Number((prev - 0.15).toFixed(2))));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoom(1.0);
        setPan({ x: 0, y: 0 });
      } else if (e.key.toLowerCase() === 'h') {
        setIsHandTool(true);
      } else if (e.key.toLowerCase() === 'v') {
        setIsHandTool(false);
      } else if (e.code === 'Space') {
        if (!spacePressedRef.current) {
          spacePressedRef.current = true;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spacePressedRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, onClose]);

  // Hand tool dragging handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Left click with hand tool or middle click or spacebar
    if ((isHandTool && e.button === 0) || e.button === 1 || spacePressedRef.current) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      e.preventDefault();
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile/tablet pan
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isHandTool) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom handling & standard scrolling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((prev) => Math.min(2.5, Math.max(0.3, Number((prev + delta).toFixed(2)))));
    } else {
      // Standard scrolling on mouse wheel/trackpad (translates into panning)
      e.preventDefault();
      setPan((prev) => {
        const vpHeight = viewportRef.current?.clientHeight || 500;
        const vpWidth = viewportRef.current?.clientWidth || 800;
        const docHeight = documentContainerRef.current?.clientHeight || 2000;
        const docWidth = paperConfig.widthPx;

        // Bound vertical and horizontal panning so document stays visible and doesn't get lost
        const limitY = Math.max(-docHeight * zoom + 100, Math.min(vpHeight - 100, prev.y - e.deltaY));
        const limitX = Math.max(-docWidth * zoom + 100, Math.min(vpWidth - 100, prev.x - e.deltaX));
        return { x: limitX, y: limitY };
      });
    }
  };

  // Preset Zoom Handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(2.5, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.3, Number((prev - 0.15).toFixed(2))));
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleFitWidth = () => {
    if (viewportRef.current) {
      const vpWidth = viewportRef.current.clientWidth - 64;
      const fitZoom = Math.min(2.0, Math.max(0.4, vpWidth / paperConfig.widthPx));
      setZoom(Number(fitZoom.toFixed(2)));
      setPan({ x: 0, y: 0 });
    }
  };

  const handleFitPage = () => {
    if (viewportRef.current) {
      const vpHeight = viewportRef.current.clientHeight - 80;
      const pageHeightPx = (paperConfig.mmHeight / 25.4) * 96;
      const fitZoom = Math.min(1.5, Math.max(0.35, vpHeight / pageHeightPx));
      setZoom(Number(fitZoom.toFixed(2)));
      setPan({ x: 0, y: 0 });
    }
  };

  // Download PDF Action
  const handleDownloadPdf = async () => {
    if (!documentContainerRef.current) return;
    try {
      setIsDownloading(true);
      setDownloadProgress(10);
      setDownloadStatus('Menyiapkan halaman PDF...');

      const result = await generatePdfFromElement(documentContainerRef.current, {
        paperSize,
        onProgress: (p, msg) => {
          setDownloadProgress(p);
          setDownloadStatus(msg);
        },
      });

      const safeTitle = data.header?.hal
        ? data.header.hal.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35)
        : 'Disdikbud_Kaltara';
      const filename = `Telaahan_Staf_${safeTitle}.pdf`;

      downloadPdfBlob(result.blob, filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to export PDF file:', err);
      // Fallback: open print window directly
      openPagedJsPdfWindow(data, {
        paperSize,
        margins,
        fontSizePt,
        lineSpacing,
        fontFamily,
        pageSplitMode,
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadStatus('');
    }
  };

  // Open Direct Print Window
  const handlePrint = () => {
    openPagedJsPdfWindow(data, {
      paperSize,
      margins,
      fontSizePt,
      lineSpacing,
      fontFamily,
      pageSplitMode,
    });
  };

  if (!isOpen) return null;

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-0 sm:p-4 select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
    >
      {/* Modal Container */}
      <div className="bg-slate-900 rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-slate-700/80 flex flex-col w-full h-full sm:h-[95vh] max-w-6xl overflow-hidden relative">
        {/* ========================================================
            1. TOP PDF TOOLBAR (Hand tool, Zoom, Navigation, Actions)
           ======================================================== */}
        <header className="bg-slate-900 border-b border-slate-800 px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2 shrink-0 z-20">
          {/* Left: Document Badge & Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2
                  id="pdf-modal-title"
                  className="text-xs sm:text-sm font-bold text-white truncate max-w-[110px] sm:max-w-[280px]"
                  title={data.header?.hal || 'Telaahan Staf'}
                >
                  {data.header?.hal || 'Telaahan Staf'}
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700 shrink-0 uppercase hidden xs:inline-block">
                  PDF &bull; {paperConfig.shortName}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block truncate">
                Pratinjau format cetak PDF resmi.
              </p>
            </div>
          </div>

          {/* Center: Interactive PDF Tools (Hand Tool + Zoom Controls - Desktop Only) */}
          <div className="hidden sm:flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/70 shadow-inner gap-1">
            {/* Hand Tool Toggle Button */}
            <button
              type="button"
              onClick={() => setIsHandTool(true)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                isHandTool
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
              title="Hand Tool (H): Klik dan geser (drag) kanvas untuk memindahkan dokumen"
            >
              <Hand className="w-4 h-4" />
              <span className="text-[11px] hidden md:inline">Hand Tool</span>
            </button>

            {/* Pointer Selection Mode */}
            <button
              type="button"
              onClick={() => setIsHandTool(false)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                !isHandTool
                  ? 'bg-slate-700 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
              title="Kursor Biasa (V): Mode seleksi teks standar"
            >
              <MousePointer className="w-4 h-4" />
              <span className="text-[11px] hidden md:inline">Kursor</span>
            </button>

            <div className="h-4 w-px bg-slate-700 my-auto mx-0.5" />

            {/* Zoom Out Button */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.3}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/80 disabled:opacity-40 transition cursor-pointer"
              title="Perkecil (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Zoom Percentage Display with Click to Cycle */}
            <div className="relative group">
              <button
                type="button"
                onClick={handleResetView}
                className="px-2 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-400 hover:bg-slate-700/60 transition cursor-pointer min-w-[50px] text-center"
                title="Klik untuk reset zoom ke 100%"
              >
                {zoomPercent}%
              </button>
            </div>

            {/* Zoom In Button */}
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/80 disabled:opacity-40 transition cursor-pointer"
              title="Perbesar (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-700 my-auto mx-0.5 hidden sm:block" />

            {/* Fit Width Button */}
            <button
              type="button"
              onClick={handleFitWidth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/80 transition cursor-pointer hidden sm:flex items-center gap-1 text-[11px]"
              title="Pas Lebar Layar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Lebar</span>
            </button>

            {/* Reset Position Button */}
            <button
              type="button"
              onClick={handleResetView}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/80 transition cursor-pointer hidden sm:flex items-center gap-1 text-[11px]"
              title="Pusatkan Ulang Dokumen (0)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Download, Print, Close Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Download PDF Button (Hero Action - Canva Theme) */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3 sm:px-5 py-2 bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] hover:opacity-95 active:scale-95 disabled:opacity-50 text-white rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-purple-950/40 transition cursor-pointer shrink-0"
              title="Unduh Berkas PDF Sekarang"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-200" />
                  <span className="hidden sm:inline">{downloadStatus || 'Mengunduh...'}</span>
                  <span className="sm:hidden">{downloadProgress}%</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Tersimpan</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-purple-200" />
                  <span className="font-extrabold text-xs">Unduh</span>
                  <span className="font-extrabold text-xs hidden sm:inline">PDF</span>
                </>
              )}
            </button>

            {/* Print Button - Desktop only */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex p-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-full text-xs font-bold items-center gap-1 border border-slate-700 transition cursor-pointer shrink-0"
              title="Cetak via Dialog Print Browser (Ctrl+P)"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="text-xs hidden md:inline">Cetak</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="min-w-[36px] min-h-[36px] p-2 rounded-full text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 transition cursor-pointer flex items-center justify-center shrink-0"
              title="Tutup Jendela (Esc)"
              aria-label="Tutup jendela pop-up"
            >
              <X className="w-4 h-4 text-slate-200 hover:text-white" />
            </button>
          </div>
        </header>

        {/* ========================================================
            2. INTERACTIVE CANVAS VIEWPORT (Drag-to-pan & Zoomable)
           ======================================================== */}
        <div
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className={`relative flex-1 bg-slate-950/95 overflow-hidden flex items-start justify-center p-4 sm:p-8 ${
            isHandTool
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-default'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Subtle Canvas Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Mobile Bottom Floating Control Bar (Hand Tool + Zoom Controls) */}
          <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-1 shadow-2xl flex items-center gap-1 z-30">
            <button
              type="button"
              onClick={() => setIsHandTool(true)}
              className={`p-1.5 px-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                isHandTool
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Hand Tool"
            >
              <Hand className="w-3.5 h-3.5" />
              <span className="text-[11px]">Hand</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHandTool(false)}
              className={`p-1.5 px-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                !isHandTool
                  ? 'bg-slate-700 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Kursor"
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.3}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white disabled:opacity-40"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetView}
              className="px-1.5 py-0.5 text-xs font-mono font-bold text-emerald-400 min-w-[38px] text-center"
              title="Reset Zoom"
            >
              {zoomPercent}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white disabled:opacity-40"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={handleFitWidth}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white"
              title="Pas Lebar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Instructions Pill (Bottom-Center - Desktop only) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-full shadow-lg z-10 pointer-events-none hidden sm:flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {isHandTool ? (
                <>
                  <strong className="text-white">Hand Tool Aktif:</strong> Klik &amp; geser untuk menggerakkan lembar dokumen
                </>
              ) : (
                <>
                  <strong className="text-white">Mode Kursor:</strong> Tekan <strong>H</strong> untuk Hand Tool atau tahan <strong>Spasi</strong> untuk menggeser
                </>
              )}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Ctrl + Scroll untuk Zoom</span>
          </div>

          {/* Floating Zoom Presets Shortcut Pill (Bottom-Left) */}
          <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg z-10 hidden sm:flex items-center gap-1">
            {ZOOM_PRESETS.map((p) => {
              const pPercent = Math.round(p * 100);
              const isActive = Math.abs(zoom - p) < 0.05;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setZoom(p);
                    setPan({ x: 0, y: 0 });
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {pPercent}%
                </button>
              );
            })}
          </div>

          {/* Zoom Notification Floating Bubble (Appears briefly when zooming) */}
          <div
            ref={documentContainerRef}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top center',
              transition: isDragging ? 'none' : 'transform 0.08s ease-out',
            }}
            className="inline-block transition-transform will-change-transform"
          >
            {/* The Document Sheets rendered in full PDF high-fidelity mode */}
            <div className="shadow-2xl rounded-sm">
              <DocumentSheet
                data={data}
                paperSize={paperSize}
                margins={margins}
                fontSizePt={fontSizePt}
                lineSpacing={lineSpacing}
                fontFamily={fontFamily}
                pageSplitMode={pageSplitMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
