/**
 * Utility to calculate and estimate printed lines (baris cetak) on standard A4/F4 official naskah dinas.
 * Standard A4 printable area with 10pt-11pt font and official margins (Left 2.5cm, Right 2cm)
 * fits approximately 75-80 characters per printed line for hanging indent bullet items.
 */

export interface PrintLineEstimation {
  bulletCount: number;
  estimatedPrintLines: number;
  maxAllowedLines: number;
  isOverLimit: boolean;
  isOptimal: boolean;
  warningMessage?: string;
}

export function estimatePrintLines(
  content: string[] | string | undefined | null,
  maxAllowedLines: number = 9
): PrintLineEstimation {
  if (!content) {
    return {
      bulletCount: 0,
      estimatedPrintLines: 0,
      maxAllowedLines,
      isOverLimit: false,
      isOptimal: false,
    };
  }

  const items = Array.isArray(content)
    ? content.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
    : [typeof content === 'string' ? content.trim() : ''].filter(Boolean);

  const bulletCount = items.length;
  if (bulletCount === 0) {
    return {
      bulletCount: 0,
      estimatedPrintLines: 0,
      maxAllowedLines,
      isOverLimit: false,
      isOptimal: false,
    };
  }

  let totalLines = 0;
  for (const item of items) {
    // Strip manual bullet or numbering prefix
    const clean = item.replace(/^([a-z0-9][\.\)]|[\-•])\s+/i, '').trim();
    if (!clean) continue;
    // Each bullet has a hanging indent (~5 chars), each printed line holds ~75 characters
    const lines = Math.max(1, Math.ceil(clean.length / 75));
    totalLines += lines;
  }

  const isOverLimit = totalLines > maxAllowedLines || bulletCount > 3;
  const isOptimal = bulletCount >= 1 && bulletCount <= 3 && totalLines <= maxAllowedLines;

  let warningMessage: string | undefined;
  if (bulletCount > 3) {
    warningMessage = `${bulletCount} butir (rekomendasi standar 3 poin)`;
  } else if (totalLines > maxAllowedLines) {
    warningMessage = `Estimasi ~${totalLines} baris cetak (melebihi batas ${maxAllowedLines} baris cetak)`;
  }

  return {
    bulletCount,
    estimatedPrintLines: totalLines,
    maxAllowedLines,
    isOverLimit,
    isOptimal,
    warningMessage,
  };
}

/**
 * Intelligent helper to auto-condense verbose items to strictly fit within maxAllowedLines.
 * Reduces wordiness while preserving official bureaucratic tone and essential facts.
 */
export function condenseSectionList(
  items: string[],
  sectionType: string = 'umum',
  maxAllowedLines?: number
): string[] {
  if (!items || items.length === 0) return items;

  const isKesimpulan = sectionType.toLowerCase() === 'kesimpulan';
  const effectiveMaxLines = maxAllowedLines ?? (isKesimpulan ? 4 : 9);
  const maxBullets = isKesimpulan ? 2 : 3;

  // Filter out empty lines
  const cleanList = items
    .map((s) => s.replace(/^([a-z0-9][\.\)]|[\-•])\s+/i, '').trim())
    .filter(Boolean);

  if (cleanList.length === 0) return [];

  // Take at most maxBullets points (2 for kesimpulan, 3 for others)
  const topItems = cleanList.slice(0, maxBullets);

  // Common replacements to tighten bureaucratic phrasing
  const replacements: [RegExp, string][] = [
    [/melaksanakan perjalanan dinas ini dalam rangka/gi, 'pelaksanaan'],
    [/melaksanakan kegiatan perjalanan dinas/gi, 'pelaksanaan'],
    [/dalam rangka untuk/gi, 'untuk'],
    [/guna untuk/gi, 'untuk'],
    [/agar supaya/gi, 'agar'],
    [/sangat penting dan mendesak sekali/gi, 'mendesak'],
    [/sangat penting sekali/gi, 'sangat penting'],
    [/dikhawatirkan akan terjadi/gi, 'berisiko'],
    [/dikhawatirkan timbul/gi, 'berpotensi'],
    [/berpotensi menimbulkan kendala/gi, 'berisiko kendala'],
    [/tidak dapat digantikan dengan kegiatan secara daring atau online/gi, 'tidak dapat digantikan secara daring'],
    [/dibebankan kepada dokumen pelaksanaan anggaran/gi, 'dibebankan pada DPA'],
    [/pada dokumen pelaksanaan anggaran/gi, 'pada DPA'],
    [/tahun anggaran 2026/gi, 'TA 2026'],
    [/tahun anggaran berjalan/gi, 'TA berjalan'],
    [/telah terverifikasi tersedia dan mencukupi/gi, 'tersedia dan mencukupi'],
  ];

  const tightened = topItems.map((item) => {
    let t = item;
    for (const [pattern, rep] of replacements) {
      t = t.replace(pattern, rep);
    }
    t = t.trim();

    // Ensure section convention
    if (['praanggapan', 'analisis'].includes(sectionType.toLowerCase())) {
      if (!t.toLowerCase().startsWith('bahwa')) {
        t = `Bahwa ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
      }
    }

    if (t && !t.endsWith(';') && !t.endsWith('.')) {
      t += ';';
    }
    return t;
  });

  // Calculate total lines
  let est = estimatePrintLines(tightened, effectiveMaxLines);
  if (!est.isOverLimit) {
    return tightened;
  }

  // If still over limit, truncate or compress each sentence to max ~110 chars
  const compressed = tightened.map((item, idx) => {
    const endChar = idx === tightened.length - 1 ? '.' : ';';
    const cleanItem = item.replace(/[.;]+$/, '').trim();
    if (cleanItem.length > 120) {
      // Find suitable sentence break or truncate
      const cutoff = cleanItem.substring(0, 115);
      const lastSpace = cutoff.lastIndexOf(' ');
      const shortened = (lastSpace > 60 ? cutoff.substring(0, lastSpace) : cutoff).trim();
      return `${shortened}${endChar}`;
    }
    return `${cleanItem}${endChar}`;
  });

  return compressed;
}
