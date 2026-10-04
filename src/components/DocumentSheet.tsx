import React from 'react';
import {
  TelaahanStafData,
  TextDensityType,
  PageSplitMode,
  FontFamilyType,
  PaperSizeType,
  DocumentMargins,
  DEFAULT_DOCUMENT_MARGINS,
  PAPER_SIZE_OPTIONS,
  FONT_OPTIONS,
  OFFICIAL_MARGIN,
} from '../types';
import { OfficialKop } from './OfficialKop';
import { KesimpulanSection } from './KesimpulanSection';
import { useDocumentPagination } from '../hooks/useDocumentPagination';

interface DocumentSheetProps {
  data: TelaahanStafData;
  paperSize?: PaperSizeType;
  margins?: DocumentMargins;
  textDensity?: TextDensityType;
  showMarginGuide?: boolean;
  pageSplitMode?: PageSplitMode;
  fontFamily?: FontFamilyType;
  fontSizePt?: number;
  lineSpacing?: number;
  onMeasurementsUpdate?: (measurements: Record<string, number>) => void;
}

export const DocumentSheet: React.FC<DocumentSheetProps> = React.memo(({
  data,
  paperSize = 'a4',
  margins = DEFAULT_DOCUMENT_MARGINS,
  textDensity = 'auto',
  showMarginGuide = false,
  pageSplitMode = 'auto-fill-95',
  fontFamily = 'times',
  fontSizePt = 10,
  lineSpacing = 1.15,
  onMeasurementsUpdate,
}) => {
  const {
    kop,
    header,
    disposisi,
    persoalan,
    praanggapan,
    fakta,
    analisisIntro,
    analisis,
    kesimpulan,
    saran,
    kaki,
  } = data;

  const fontConfig = FONT_OPTIONS.find((f) => f.id === fontFamily) || FONT_OPTIONS[0];
  const paperConfig = PAPER_SIZE_OPTIONS[paperSize] || PAPER_SIZE_OPTIONS.a4;

  // Compute pagination based on calibrated physical metrics (100% zoom-independent)
  const paginationResult = useDocumentPagination({
    data,
    paperSize,
    margins,
    textDensity,
    pageSplitMode,
    fontSizePt,
    lineSpacing,
    fontFamily,
  });

  const { pages } = paginationResult;

  const persoalanItems = (Array.isArray(persoalan) ? persoalan : [persoalan || ''])
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  const praanggapanItems = (praanggapan || []).filter((item) => item && item.trim() !== '');
  const faktaItems = (fakta || []).filter((item) => item && item.trim() !== '');
  const analisisItems = (analisis || []).filter((item) => item && item.trim() !== '');
  const saranItems = (saran || []).filter((item) => item && item.trim() !== '');

  // Dynamic font scaling factors (clamped to minimum 9.75pt)
  const safeFontSizePt = Math.max(9.75, fontSizePt);
  const bodyFontSize = `${safeFontSizePt}pt`;
  const tableFontSize = `${Math.max(7.5, safeFontSizePt - 0.5)}pt`;
  const headerFontSize = `${safeFontSizePt}pt`;
  const titleFontSize = `${safeFontSizePt + 2}pt`;
  const subHeaderFontSize = `${Math.max(7, safeFontSizePt - 1.5)}pt`;

  // Dynamic item gap depending on line spacing
  const itemGapStyle = {
    marginBottom: `${Math.max(2, lineSpacing * 3.5)}px`,
    lineHeight: lineSpacing,
  };

  // Render Sub-Components
  const renderKop = () => <OfficialKop kop={kop} marginPreset="normal" />;

  const renderJudul = () => (
    <div className="text-center my-1.5">
      <h1
        style={{ fontSize: titleFontSize, fontFamily: fontConfig.cssFont }}
        className="font-bold tracking-wider uppercase inline-block"
      >
        {data.judul || 'TELAAHAN STAF'}
      </h1>
    </div>
  );

  const renderAtribut = () => (
    <div
      style={{ fontSize: headerFontSize, fontFamily: fontConfig.cssFont }}
      className="mb-1.5"
    >
      <table className="w-full border-collapse tight-table-row">
        <tbody>
          <tr>
            <td className="w-1 whitespace-nowrap align-top font-medium pr-1.5">Kepada</td>
            <td className="w-1 whitespace-nowrap align-top px-1 text-center">:</td>
            <td className="w-full align-top font-normal break-words pl-0.5">{header.yth}</td>
          </tr>
          <tr>
            <td className="whitespace-nowrap align-top font-medium pr-1.5">Dari</td>
            <td className="whitespace-nowrap align-top px-1 text-center">:</td>
            <td className="align-top break-words text-justify pl-0.5">{header.dari}</td>
          </tr>
          <tr>
            <td className="whitespace-nowrap align-top font-medium pr-1.5">Tanggal</td>
            <td className="whitespace-nowrap align-top px-1 text-center">:</td>
            <td className="align-top pl-0.5">{header.tanggalSurat}</td>
          </tr>
          <tr>
            <td className="whitespace-nowrap align-top font-medium pr-1.5">Nomor</td>
            <td className="whitespace-nowrap align-top px-1 text-center">:</td>
            <td className="align-top break-words pl-0.5">{header.nomorSurat}</td>
          </tr>
          <tr>
            <td className="whitespace-nowrap align-top font-medium pr-1.5">Lampiran</td>
            <td className="whitespace-nowrap align-top px-1 text-center">:</td>
            <td className="align-top pl-0.5">{header.lampiran || '-'}</td>
          </tr>
          <tr>
            <td className="whitespace-nowrap align-top font-medium pr-1.5">Perihal</td>
            <td className="whitespace-nowrap align-top px-1 text-center">:</td>
            <td className="align-top text-justify font-normal break-words pl-0.5">
              {header.hal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderDisposisiContent = () => (
    <div className="h-full flex flex-col justify-between" style={{ lineHeight: lineSpacing }}>
      <div>
        <div
          style={{ fontSize: headerFontSize, lineHeight: Math.max(1.2, lineSpacing * 0.95) }}
          className="font-semibold mb-1 break-words"
        >
          {disposisi.jabatanPimpinan || 'Plh. KEPALA DINAS PENDIDIKAN DAN KEBUDAYAAN:'}
        </div>

        {/* Checkbox Pilihan */}
        <div className="space-y-1.5 my-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border border-black flex items-center justify-center shrink-0 bg-white">
              {disposisi.status === 'setuju' && (
                <span className="text-[10px] font-bold leading-none">✓</span>
              )}
            </div>
            <span style={{ fontSize: bodyFontSize }}>Setuju</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border border-black flex items-center justify-center shrink-0 bg-white">
              {disposisi.status === 'tidak_setuju' && (
                <span className="text-[10px] font-bold leading-none">✓</span>
              )}
            </div>
            <span style={{ fontSize: bodyFontSize }}>Tidak Setuju</span>
          </div>
        </div>

        {/* Area Catatan Pimpinan */}
        <div className="mt-1.5 pt-1 border-t border-slate-200">
          <div style={{ fontSize: bodyFontSize }} className="font-medium text-slate-900 mb-1">
            Catatan Pimpinan:
          </div>
          {disposisi.catatan ? (
            <p
              style={{ fontSize: tableFontSize, lineHeight: lineSpacing }}
              className="text-slate-800 italic break-words"
            >
              "{disposisi.catatan}"
            </p>
          ) : (
            <div className="space-y-2.5 py-1 opacity-40">
              <div className="border-b border-dotted border-slate-400 w-full" />
              <div className="border-b border-dotted border-slate-400 w-full" />
              <div className="border-b border-dotted border-slate-400 w-full" />
              <div className="border-b border-dotted border-slate-400 w-full" />
            </div>
          )}
        </div>
      </div>

      {/* Area Paraf Pimpinan (Bottom Anchored) */}
      <div className="text-center pt-2 pb-1 text-slate-700 mt-auto">
        <div className="h-7 flex items-center justify-center" />
        <div className="border-b border-dotted border-slate-600 w-24 mx-auto" />
        <div style={{ fontSize: subHeaderFontSize }} className="text-slate-500 mt-0.5">
          (Paraf Pimpinan)
        </div>
      </div>
    </div>
  );

  // Helper to render bullet/lettered list items with guaranteed hanging indent and no duplicate prefixes
  const renderListItems = (items: string[], startIndex = 0) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="ml-8 space-y-1">
        {items.map((rawItem, idx) => {
          const actualIndex = startIndex + idx;
          const cleanText = rawItem
            .replace(/^(\(?[a-zA-Z0-9]+\)?[\.\)]|[\-•]|\d+[\.\)])\s*/gi, '')
            .replace(/^(\(?[a-zA-Z0-9]+\)?[\.\)]|[\-•]|\d+[\.\)])\s*/gi, '')
            .trim();
          const letterPrefix = `${String.fromCharCode(97 + actualIndex)}.`;

          return (
            <div
              key={actualIndex}
              style={itemGapStyle}
              className="flex items-start gap-1 text-justify break-words telaah-item-row avoid-break"
            >
              <span
                style={{ fontSize: bodyFontSize }}
                className="w-5 shrink-0 font-medium text-left select-none"
              >
                {letterPrefix}
              </span>
              <div
                style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
                className="flex-1 min-w-0 text-justify [text-align-last:left] break-words"
              >
                {cleanText}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPersoalan = (itemIndices?: number[], showHeader = true) => {
    const itemsToRender = itemIndices
      ? itemIndices.map((idx) => persoalanItems[idx]).filter((item) => item !== undefined)
      : persoalanItems;

    return (
      <div key="sec-persoalan" className="natural-flow">
        {showHeader && (
          <div
            style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
            className="font-bold flex items-start gap-1 mb-0.5 bab-header"
          >
            <span className="w-8 shrink-0">I.</span>
            <span>Pokok Permasalahan</span>
          </div>
        )}
        {itemsToRender.length === 0 && showHeader ? (
          <p
            style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
            className="ml-8 text-justify break-words italic text-slate-400"
          >
            (Uraian pokok permasalahan belum diisi)
          </p>
        ) : (
          renderListItems(itemsToRender, itemIndices?.[0] ?? 0)
        )}
      </div>
    );
  };

  const renderPraanggapan = (itemIndices?: number[], showHeader = true) => {
    const itemsToRender = itemIndices
      ? itemIndices.map((idx) => praanggapanItems[idx]).filter((item) => item !== undefined)
      : praanggapanItems;

    return (
      <div key="sec-praanggapan" className="natural-flow">
        {showHeader && (
          <div
            style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
            className="font-bold flex items-start gap-1 mb-0.5 bab-header"
          >
            <span className="w-8 shrink-0">II.</span>
            <span>Praanggapan</span>
          </div>
        )}
        {renderListItems(itemsToRender, itemIndices?.[0] ?? 0)}
      </div>
    );
  };

  const renderFakta = (itemIndices?: number[], showHeader = true) => {
    const itemsToRender = itemIndices
      ? itemIndices.map((idx) => faktaItems[idx]).filter((item) => item !== undefined)
      : faktaItems;

    return (
      <div key="sec-fakta" className="natural-flow">
        {showHeader && (
          <div
            style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
            className="font-bold flex items-start gap-1 mb-0.5 bab-header"
          >
            <span className="w-8 shrink-0">III.</span>
            <span>Fakta yang Mempengaruhi</span>
          </div>
        )}
        {renderListItems(itemsToRender, itemIndices?.[0] ?? 0)}
      </div>
    );
  };

  const renderAnalisis = (
    itemIndices?: number[],
    showHeader = true,
    showIntro = true
  ) => {
    const itemsToRender = itemIndices
      ? itemIndices.map((idx) => analisisItems[idx]).filter((item) => item !== undefined)
      : analisisItems;

    return (
      <div key="sec-analisis" className="natural-flow">
        {showHeader && (
          <div
            style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
            className="font-bold flex items-start gap-1 mb-0.5 bab-header"
          >
            <span className="w-8 shrink-0">IV.</span>
            <span>Analisis dan Pembahasan</span>
          </div>
        )}
        {showIntro && analisisIntro && (
          <p
            style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
            className="ml-8 text-justify mb-1 break-words"
          >
            {analisisIntro}
          </p>
        )}
        {renderListItems(itemsToRender, itemIndices?.[0] ?? 0)}
      </div>
    );
  };

  const renderKesimpulan = (
    showHeader = true,
    showRingkasan = true
  ) => (
    <div key="sec-kesimpulan" className="natural-flow">
      {showHeader && (
        <div
          style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
          className="font-bold flex items-start gap-1 mb-0.5 bab-header"
        >
          <span className="w-8 shrink-0">V.</span>
          <span>Kesimpulan</span>
        </div>
      )}
      <KesimpulanSection
        kesimpulan={kesimpulan}
        headerHal={header.hal}
        bodyFontSize={bodyFontSize}
        lineSpacing={lineSpacing}
        showRingkasan={showRingkasan}
        showPersonil={false}
        showRincian={false}
      />
    </div>
  );

  const renderSaran = (
    itemIndices?: number[],
    showHeader = true,
    showPersonil = true,
    showRincian = true
  ) => {
    const itemsToRender = itemIndices
      ? itemIndices.map((idx) => saranItems[idx]).filter((item) => item !== undefined)
      : saranItems;

    return (
      <div key="sec-saran" className="natural-flow">
        {showHeader && (
          <div
            style={{ fontSize: bodyFontSize, lineHeight: lineSpacing }}
            className="font-bold flex items-start gap-1 mb-0.5 bab-header"
          >
            <span className="w-8 shrink-0">VI.</span>
            <span>Saran</span>
          </div>
        )}
        {renderListItems(itemsToRender, itemIndices?.[0] ?? 0)}
        {(showPersonil || showRincian) && (
          <KesimpulanSection
            kesimpulan={kesimpulan}
            headerHal={header.hal}
            bodyFontSize={bodyFontSize}
            lineSpacing={lineSpacing}
            showRingkasan={false}
            showPersonil={showPersonil}
            showRincian={showRincian}
          />
        )}
      </div>
    );
  };

  const renderKaki = () => (
    <div
      key="sec-kaki"
      style={{ fontSize: bodyFontSize }}
      className="signature-block avoid-break pt-2 mt-2"
    >
      <div className="flex justify-end">
        <div className="w-56 text-center leading-[1.3]">
          <div className="font-semibold text-[8.5pt] uppercase mt-0.5">
            {kaki.yangMembuatLabel || 'Yang Membuat,'}
          </div>
          <div className="font-bold text-[8.5pt] uppercase">
            {kaki.jabatanPembuat || 'PPTK'}
          </div>

          {/* Area Tanda Tangan Basah */}
          <div className="h-14 my-0.5" />

          <div className="font-bold underline text-[9pt] uppercase tracking-wide">
            {kaki.namaPembuat || 'NAMA LENGKAP PPTK, S.Pd.'}
          </div>
          <div className="text-[8pt] text-slate-800">{kaki.pangkatPembuat || 'Penata (III/c)'}</div>
          <div className="text-[8pt] text-slate-800">
            NIP. {kaki.nipPembuat || '19850101 201001 1 001'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      id="printable-telaah-document"
      className="flex flex-col items-center gap-6 print:gap-0 font-serif text-black"
      style={{
        fontFamily: fontConfig.cssFont,
      }}
    >
        {pages.map((page) => {
          const isFirstPage = page.isFirstPage;

          return (
            <div
              key={`page-${page.pageNumber}`}
              className="a4-sheet-page shadow-xl print:shadow-none transition-all relative mx-auto"
              style={
                {
                  '--sheet-padding': `${margins.topMm}mm ${margins.rightMm}mm ${margins.bottomMm}mm ${margins.leftMm}mm`,
                  padding: `${margins.topMm}mm ${margins.rightMm}mm ${margins.bottomMm}mm ${margins.leftMm}mm`,
                  fontFamily: fontConfig.cssFont,
                  width: `${paperConfig.mmWidth}mm`,
                  maxWidth: `${paperConfig.mmWidth}mm`,
                  height: `${paperConfig.mmHeight}mm`,
                  maxHeight: `${paperConfig.mmHeight}mm`,
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                } as React.CSSProperties
              }
            >
              {/* Visual Guide Border (Screen Only) */}
              {showMarginGuide && (
                <div
                  className="absolute border border-sky-400 border-dashed pointer-events-none print:hidden z-10"
                  style={{
                    top: `${margins.topMm}mm`,
                    bottom: `${margins.bottomMm}mm`,
                    left: `${margins.leftMm}mm`,
                    right: `${margins.rightMm}mm`,
                  }}
                  title={`Batas Margin Aktif (Atas: ${margins.topMm}mm, Bawah: ${margins.bottomMm}mm, Kiri: ${margins.leftMm}mm, Kanan: ${margins.rightMm}mm)`}
                />
              )}

              {/* Inner Content Area */}
              <div className="w-full flex-1 flex flex-col justify-between overflow-visible relative h-full">
                {/* PAGE 1: KOP SURAT + JUDUL + ATRIBUT */}
                {isFirstPage ? (
                  <div className="shrink-0 avoid-break kop-block w-full">
                    {renderKop()}
                    {renderJudul()}
                    {renderAtribut()}
                  </div>
                ) : null}

                {/* 2-COLUMN OFFICIAL DISPOSISI & CONTENT TABLE */}
                <div className="flex-1 flex flex-col min-h-0 overflow-visible mt-1">
                  <table
                    style={{ fontSize: tableFontSize }}
                    className="w-full border-collapse border border-black table-fixed"
                  >
                    {isFirstPage && (
                      <thead>
                        <tr className="border-b border-black avoid-break">
                          <th
                            style={{ fontSize: subHeaderFontSize }}
                            className="w-[32%] border-r border-black p-1 text-center font-bold tracking-wider uppercase bg-slate-50/50"
                          >
                            KOLOM DISPOSISI
                          </th>
                          <th
                            style={{ fontSize: subHeaderFontSize }}
                            className="w-[68%] p-1 text-center font-bold tracking-wider uppercase bg-slate-50/50"
                          >
                            ISI TELAAHAN
                          </th>
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      <tr>
                        {/* KOLOM KIRI: DISPOSISI PIMPINAN */}
                        <td
                          style={{ fontSize: tableFontSize }}
                          className="border-r border-black align-top p-1.5 bg-white w-[32%]"
                        >
                          {isFirstPage ? (
                            renderDisposisiContent()
                          ) : null}
                        </td>

                        {/* KOLOM KANAN: ISI TELAAHAN SESUAI PEMBAGIAN HALAMAN (I-VI) */}
                        <td
                          className="align-top p-1.5 text-justify w-[68%]"
                          style={{ lineHeight: lineSpacing }}
                        >
                          <div className="space-y-2 telaah-content-container">
                            {page.hasPersoalan && renderPersoalan(page.persoalanItemIndices, page.showPersoalanHeader)}
                            {page.hasPraanggapan && renderPraanggapan(page.praanggapanItemIndices, page.showPraanggapanHeader)}
                            {page.hasFakta && renderFakta(page.faktaItemIndices, page.showFaktaHeader)}
                            {page.hasAnalisis && renderAnalisis(page.analisisItemIndices, page.showAnalisisHeader, page.hasAnalisisIntro)}
                            {page.hasKesimpulan && renderKesimpulan(page.showKesimpulanHeader, page.hasKesimpulanRingkasan)}
                            {page.hasSaran && renderSaran(page.saranItemIndices, page.showSaranHeader, page.hasKesimpulanPersonil, page.hasKesimpulanRincian)}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* KOLOM TTD DILUAR TABEL */}
                  {page.hasKaki && renderKaki()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
  );
});
