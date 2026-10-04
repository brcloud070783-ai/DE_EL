import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaperSizeType, PAPER_SIZE_OPTIONS } from '../types';

export interface GeneratePdfOptions {
  fileName?: string;
  paperSize?: PaperSizeType;
  onProgress?: (progress: number, message: string) => void;
}

/**
 * Generates a high-resolution, vector-accurate PDF (A4 or F4) from a DOM element.
 * Splits content cleanly onto multiple discrete pages with standard margins.
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<{ blob: Blob; url: string }> {
  const { fileName = 'Telaahan_Staf_Disdikbud_Kaltara.pdf', paperSize = 'a4', onProgress } = options;
  const paperConfig = PAPER_SIZE_OPTIONS[paperSize] || PAPER_SIZE_OPTIONS.a4;

  onProgress?.(10, `Menyiapkan lembar halaman naskah ${paperConfig.shortName}...`);

  const pageElements = Array.from(element.querySelectorAll<HTMLElement>('.a4-sheet-page'));
  const elementsToProcess = pageElements.length > 0 ? pageElements : [element];

  const pdfWidth = paperConfig.mmWidth;
  const pdfHeight = paperConfig.mmHeight;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: paperSize === 'f4' ? [215, 330] : 'a4',
    compress: true,
  });

  for (let i = 0; i < elementsToProcess.length; i++) {
    const pageEl = elementsToProcess[i];
    const progressVal = Math.round(20 + ((i + 1) / elementsToProcess.length) * 65);
    onProgress?.(progressVal, `Memproses Halaman ${i + 1} dari ${elementsToProcess.length}...`);

    const canvas = await html2canvas(pageEl, {
      scale: 2, // 2x resolution for ultra-sharp vector-like typography
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: paperConfig.widthPx,
    });

    const pageHeightPx = (canvas.width * pdfHeight) / pdfWidth;
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageHeightPx));

    if (totalPages <= 1) {
      if (i > 0) {
        pdf.addPage();
      }
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    } else {
      // Slicing for continuous unified sheets exceeding 1 A4 height
      for (let p = 0; p < totalPages; p++) {
        if (i > 0 || p > 0) {
          pdf.addPage();
        }

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        const currentSliceHeight = Math.min(pageHeightPx, canvas.height - p * pageHeightPx);
        pageCanvas.height = pageHeightPx; // Full A4 height canvas
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            p * pageHeightPx,
            canvas.width,
            currentSliceHeight,
            0,
            0,
            pageCanvas.width,
            currentSliceHeight
          );
        }

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }
    }
  }

  onProgress?.(95, 'Menyusun berkas PDF resmi...');

  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);

  onProgress?.(100, 'Selesai!');

  return { blob, url };
}

/**
 * Triggers direct download of a generated PDF
 */
export function downloadPdfBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
