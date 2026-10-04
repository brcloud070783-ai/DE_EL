import { TelaahanStafData, PaperSizeType, FontFamilyType, DocumentMargins, PageSplitMode, PAPER_SIZE_OPTIONS } from '../types';
import { generatePagedJsDocumentHtml } from './pagedjsGenerator';

export interface PagedJsOptions {
  paperSize?: PaperSizeType;
  margins?: DocumentMargins;
  fontSizePt?: number;
  lineSpacing?: number;
  fontFamily?: FontFamilyType;
  pageSplitMode?: PageSplitMode;
  domMeasurements?: Record<string, number>;
}

/**
 * Opens a dedicated A4/F4 document window with exact 1:1 fidelity to the live preview.
 * Copies the live rendered DOM and styles directly, ensuring 100% identical layout,
 * zero fragmentation, and instant 1-click print / Save as PDF.
 */
export function openPagedJsPdfWindow(data: TelaahanStafData, options: PagedJsOptions = {}): Window | null {
  const paperSize = options.paperSize || 'a4';
  const paperConfig = PAPER_SIZE_OPTIONS[paperSize] || PAPER_SIZE_OPTIONS.a4;
  const existingDoc = typeof document !== 'undefined' ? document.getElementById('printable-telaah-document') : null;

  let html = '';
  if (existingDoc) {
    // Clone and get clean HTML from live preview
    const docHtml = existingDoc.outerHTML;

    // Collect all stylesheets and style tags currently loaded in the app
    const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>TELAAHAN STAF - ${data.header?.hal || 'Disdikbud Kaltara'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  ${styleTags}
  <style>
    @page {
      size: ${paperConfig.mmWidth}mm ${paperConfig.mmHeight}mm;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      color: #000000;
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
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
      background-color: #ffffff !important;
      margin: 0 auto !important;
      page-break-after: always !important;
      break-after: page !important;
    }
    .a4-sheet-page:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
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
  </style>
</head>
<body>
  <div class="print-toolbar">
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">TELAAHAN STAF &mdash; SIAP CETAK (${paperConfig.shortName})</span>
      <span style="font-size: 12px; color: #94a3b8; background: #1e293b; border: 1px solid #334155; padding: 2px 10px; border-radius: 6px;">
        Format: ${paperConfig.dimensionsMm}
      </span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 11px; color: #cbd5e1; margin-right: 6px;">
        💡 <b>Tips Cetak:</b> Pada dialog cetak, pilih <b>Destination: Save as PDF</b> dan <b>Margins: None</b>
      </span>
      <button class="btn-print" onclick="window.print()">
        🖨️ Cetak / Simpan PDF
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ Tutup
      </button>
    </div>
  </div>
  <div class="preview-canvas">
    ${docHtml}
  </div>
  <script>
    window.addEventListener('load', function() {
      // Auto prompt print dialog once document is ready
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
  } else {
    html = generatePagedJsDocumentHtml(data, options);
  }

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(html);
    newWindow.document.close();
  } else {
    // Fallback if popup blocked
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.location.href = url;
  }
  return newWindow;
}

/**
 * Calls client-side or server API endpoint to obtain printable HTML and launch rendering window.
 */
export async function generatePagedJsPdf(data: TelaahanStafData, options: PagedJsOptions = {}): Promise<void> {
  // If we have existing live preview DOM, open it directly for 100% pixel fidelity
  if (typeof document !== 'undefined' && document.getElementById('printable-telaah-document')) {
    openPagedJsPdfWindow(data, options);
    return;
  }

  try {
    const response = await fetch('/api/pdf/html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, options }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.html) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(result.html);
          printWindow.document.close();
          return;
        }
      }
    }
  } catch (err) {
    console.warn('[PDF Client Notice] Falling back to client-side renderer:', err);
  }

  // Fallback to client-side window opener
  openPagedJsPdfWindow(data, options);
}
