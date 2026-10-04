import React, { useState, useEffect } from 'react';
import { TelaahanStafData, ActiveTab, PaperSizeType } from './types';
import { SAMPLE_TELAAHAN_KALTARA, BLANK_TELAAHAN, createEmptyManualTelaahan } from './data/defaultTelaah';
import { BentoLauncher } from './components/BentoLauncher';
import { FormEditor } from './components/FormEditor';
import { DocumentSheet } from './components/DocumentSheet';
import { SignaturePadModal } from './components/SignaturePadModal';
import { ExportModal } from './components/ExportModal';
import { GasIntegrationModal } from './components/GasIntegrationModal';
import { GoogleDocsEmbedModal } from './components/GoogleDocsEmbedModal';
import { SptSppdPreviewModal } from './components/SptSppdPreviewModal';
import { PejabatModal } from './components/PejabatModal';
import { TemplateSelectorModal } from './components/TemplateSelectorModal';
import { KuitansiRincianModal } from './components/KuitansiRincianModal';
import { FotoDokumentasiModal } from './components/FotoDokumentasiModal';
import { LaporanDinasModal } from './components/LaporanDinasModal';
import { MenuDrawerModal } from './components/MenuDrawerModal';
import { BottomMobileBar } from './components/BottomMobileBar';
import { TelaahBottomBar } from './components/TelaahBottomBar';
import { TelaahCreationModal } from './components/TelaahCreationModal';
import { InformasiUmumView } from './components/InformasiUmumView';
import { MobileDocumentReader } from './components/MobileDocumentReader';
import { A4FitWidthViewer } from './components/A4FitWidthViewer';
import { openPagedJsPdfWindow } from './utils/pagedjsPdf';
import {
  Square,
  Columns,
  Printer,
  Info,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Check,
  X,
  BookOpen,
  FileSpreadsheet,
  ArrowLeft,
  Crown,
  Home,
  Eye,
} from 'lucide-react';

const STORAGE_KEY = 'e_telaah_perjadin_data_v1';

export default function App() {
  // 1. Core Data State
  const [data, setData] = useState<TelaahanStafData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.kop && parsed.header) {
          // If the cached state was the default OSN sample, load the updated 3-item calibrated sample
          if (parsed.id === 'telaah-osn-kaltara-2026') {
            return SAMPLE_TELAAHAN_KALTARA;
          }
          // Ensure strictly 3 points per section
          return {
            ...parsed,
            persoalan: Array.isArray(parsed.persoalan) ? parsed.persoalan.slice(0, 3) : parsed.persoalan,
            praanggapan: Array.isArray(parsed.praanggapan) ? parsed.praanggapan.slice(0, 3) : parsed.praanggapan,
            fakta: Array.isArray(parsed.fakta) ? parsed.fakta.slice(0, 3) : parsed.fakta,
            analisis: Array.isArray(parsed.analisis) ? parsed.analisis.slice(0, 3) : parsed.analisis,
            saran: Array.isArray(parsed.saran) ? parsed.saran.slice(0, 2) : parsed.saran,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved state, fallback to default sample', e);
    }
    return SAMPLE_TELAAHAN_KALTARA;
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  // 2. Navigation & UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('launcher');
  const [isSplitView, setIsSplitView] = useState(false);
  const [previewMode, setPreviewMode] = useState<'reader' | 'a4'>('a4');
  const [paperSize, setPaperSize] = useState<PaperSizeType>('a4');
  const [zoomScale, setZoomScale] = useState(1);

  // 3. Modals State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isGoogleDocsModalOpen, setIsGoogleDocsModalOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isPejabatModalOpen, setIsPejabatModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isKuitansiModalOpen, setIsKuitansiModalOpen] = useState(false);
  const [isFotoModalOpen, setIsFotoModalOpen] = useState(false);
  const [isLaporanModalOpen, setIsLaporanModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isTelaahCreationModalOpen, setIsTelaahCreationModalOpen] = useState(false);
  const [telaahStep, setTelaahStep] = useState<1 | 2 | 3 | 4>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const [sptSppdModal, setSptSppdModal] = useState<{
    isOpen: boolean;
    type: 'spt' | 'sppd';
  }>({
    isOpen: false,
    type: 'spt',
  });

  const [signatureModal, setSignatureModal] = useState<{
    isOpen: boolean;
    target: 'disposisi' | 'kaki';
  }>({
    isOpen: false,
    target: 'kaki',
  });

  // Handlers
  const handleApplyAiTelaah = (generatedData: TelaahanStafData) => {
    setData(generatedData);
    setTelaahStep(1);
    setActiveTab('editor');
    showToast('Naskah telaahan staf berhasil dibuat otomatis dengan AI.');
  };

  const handleSelectManualTelaah = () => {
    setData((prev) => createEmptyManualTelaahan(prev));
    setTelaahStep(1);
    setActiveTab('editor');
    showToast('Formulir telaahan staf kosong siap diisi secara manual.');
  };

  const handleLoadSample = () => {
    setData(SAMPLE_TELAAHAN_KALTARA);
    showToast('Contoh telaahan staf OSN Kaltara berhasil dimuat.');
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    // Preserve existing Kop & Pembuat Pejabat settings so user doesn't have to retype them, or use fresh blank template
    setData((prev) => ({
      ...BLANK_TELAAHAN,
      kop: prev.kop,
      kaki: {
        ...BLANK_TELAAHAN.kaki,
        namaPembuat: prev.kaki.namaPembuat,
        nipPembuat: prev.kaki.nipPembuat,
        pangkatPembuat: prev.kaki.pangkatPembuat,
        jabatanPembuat: prev.kaki.jabatanPembuat,
      },
      disposisi: {
        ...BLANK_TELAAHAN.disposisi,
        jabatanPimpinan: prev.disposisi.jabatanPimpinan,
      },
    }));
    setIsResetModalOpen(false);
    showToast('Formulir telaahan staf berhasil dikosongkan.');
  };

  const handleSelectTemplate = (newTemplate: TelaahanStafData) => {
    setData(newTemplate);
    setIsTemplateModalOpen(false);
    setTelaahStep(1);
    setActiveTab('editor');
    showToast(`Template "${newTemplate.header.hal?.slice(0, 35) || 'Telaahan Staf'}..." berhasil diterapkan.`);
  };

  const handleUpdatePejabat = (updates: {
    jabatanPimpinan: string;
    namaPembuat: string;
    nipPembuat: string;
    pangkatPembuat: string;
    jabatanPembuat: string;
  }) => {
    setData((prev) => ({
      ...prev,
      disposisi: {
        ...prev.disposisi,
        jabatanPimpinan: updates.jabatanPimpinan,
      },
      kaki: {
        ...prev.kaki,
        namaPembuat: updates.namaPembuat,
        nipPembuat: updates.nipPembuat,
        pangkatPembuat: updates.pangkatPembuat,
        jabatanPembuat: updates.jabatanPembuat,
      },
    }));
  };

  const handleOpenSignature = (target: 'disposisi' | 'kaki') => {
    setSignatureModal({ isOpen: true, target });
  };

  const handleSaveSignature = (dataUrl: string) => {
    if (signatureModal.target === 'disposisi') {
      setData((prev) => ({
        ...prev,
        disposisi: {
          ...prev.disposisi,
          parafImage: dataUrl,
          tanggalDisposisi: new Date().toLocaleDateString('id-ID'),
        },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        kaki: {
          ...prev.kaki,
          ttdDigital: dataUrl,
        },
      }));
    }
  };

  const handleTriggerPrint = () => {
    openPagedJsPdfWindow(data, {
      paperSize: 'a4',
      fontSizePt: 10,
      lineSpacing: 1.15,
      fontFamily: 'times',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE]/45 via-[#F3E8FF]/30 to-slate-50/70 flex flex-col selection:bg-purple-200 w-full max-w-full overflow-x-hidden">
      {/* 1. Main Content Area */}
      <main className={`flex-1 w-full mx-auto overflow-x-hidden ${
        activeTab === 'launcher' ? 'p-0 max-w-full' : 'max-w-7xl p-2.5 sm:p-5 space-y-3'
      }`}>
        {/* 3. Views Container */}
        {activeTab === 'launcher' ? (
          /* HOME SERVICE LAUNCHER (MATCHES GAMBAR.PNG) */
          <BentoLauncher
            data={data}
            setActiveTab={setActiveTab}
            onOpenExport={() => setIsExportModalOpen(true)}
            onOpenGasModal={() => setIsGasModalOpen(true)}
            onOpenPejabatModal={() => setIsPejabatModalOpen(true)}
            onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
            onOpenSptModal={() => setSptSppdModal({ isOpen: true, type: 'spt' })}
            onOpenSppdModal={() => setSptSppdModal({ isOpen: true, type: 'sppd' })}
            onOpenKuitansiModal={() => setIsKuitansiModalOpen(true)}
            onOpenFotoModal={() => setIsFotoModalOpen(true)}
            onOpenLaporanModal={() => setIsLaporanModalOpen(true)}
            onOpenTelaahCreationModal={() => setIsTelaahCreationModalOpen(true)}
          />
        ) : isSplitView ? (
          /* SPLIT VIEW (DESKTOP) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-28">
            {/* Left Column: Form Editor */}
            <div className="lg:col-span-6 print:hidden">
              <FormEditor
                data={data}
                onChange={setData}
                onOpenSignature={handleOpenSignature}
                onLoadSample={handleLoadSample}
                onReset={handleReset}
                onOpenInformasiUmum={() => setActiveTab('informasi-umum')}
                onOpenPreview={() => setActiveTab('preview')}
                onOpenLauncher={() => setActiveTab('launcher')}
                currentStep={telaahStep}
                onStepChange={setTelaahStep}
                onOpenAiModal={() => setIsTelaahCreationModalOpen(true)}
              />
            </div>

            {/* Right Column: Live A4 Preview */}
            <div className="lg:col-span-6 sticky top-20 space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs print:hidden">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">
                    Pratinjau Live A4 (Format Sesuai Standar)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="px-3 py-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full font-bold text-xs transition"
                  >
                    Buka Penuh
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-4 py-1.5 bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] hover:opacity-95 text-white rounded-full font-bold text-xs shadow-sm shadow-purple-500/20 transition cursor-pointer"
                  >
                    Cetak A4
                  </button>
                </div>
              </div>

              {/* Document Sheet Display */}
              <div className="overflow-x-auto pb-24 flex justify-center bg-slate-100/70 p-4 rounded-3xl border border-slate-200/80 max-h-[85vh] overflow-y-auto">
                <div className="w-full flex justify-center transform origin-top scale-[0.85] sm:scale-[0.92]">
                  <DocumentSheet data={data} paperSize={paperSize} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SINGLE TAB VIEW */
          <div className="w-full flex-1 flex flex-col">
            {activeTab === 'editor' && (
              <div className="max-w-4xl mx-auto w-full print:hidden flex-1 flex flex-col">
                <FormEditor
                  data={data}
                  onChange={setData}
                  onOpenSignature={handleOpenSignature}
                  onLoadSample={handleLoadSample}
                  onReset={handleReset}
                  onOpenInformasiUmum={() => setActiveTab('informasi-umum')}
                  onOpenPreview={() => setActiveTab('preview')}
                  onOpenLauncher={() => setActiveTab('launcher')}
                  currentStep={telaahStep}
                  onStepChange={setTelaahStep}
                  onOpenAiModal={() => setIsTelaahCreationModalOpen(true)}
                  paperSize={paperSize}
                  onPaperSizeChange={setPaperSize}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="w-full max-w-5xl mx-auto max-w-full overflow-x-hidden">
                {previewMode === 'reader' ? (
                  <>
                    {/* 1. Responsive Card-Based Mobile Stream */}
                    <MobileDocumentReader
                      data={data}
                      onEdit={() => setActiveTab('editor')}
                      onPrint={() => setIsExportModalOpen(true)}
                      onOpenInformasiUmum={() => setActiveTab('informasi-umum')}
                      paperSize={paperSize}
                      onPaperSizeChange={setPaperSize}
                    />

                    {/* 2. Hidden Official A4 Document for Background Print / PDF Engine */}
                    <div className="hidden print:block">
                      <DocumentSheet data={data} paperSize={paperSize} />
                    </div>
                  </>
                ) : (
                  /* 2. Fit-to-Width Physical A4/F4 Viewer with direct PDF compilation & single slim toolbar */
                  <A4FitWidthViewer
                    data={data}
                    onPrint={() => setIsExportModalOpen(true)}
                    onBackToEditor={() => setActiveTab('editor')}
                    onGoToLauncher={() => setActiveTab('launcher')}
                    paperSize={paperSize}
                    onPaperSizeChange={setPaperSize}
                  />
                )}
              </div>
            )}

            {activeTab === 'informasi-umum' && (
              <InformasiUmumView
                data={data}
                onChange={setData}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        )}
      </main>

      {/* 4. Bottom Navigation Bar:
          - Hanya tampil saat pengguna berada di Beranda / Dashboard ('launcher')
          - Disembunyikan saat dalam mode Wizard Pengisian Form ('editor') atau Pratinjau A4 ('preview') agar tidak merusak mental model navigasi
      */}
      {activeTab === 'launcher' && (
        <BottomMobileBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenExport={() => setIsExportModalOpen(true)}
          onLoadSample={handleLoadSample}
          onOpenTemplate={() => setIsTemplateModalOpen(true)}
          onOpenAi={() => setIsLaporanModalOpen(true)}
          onOpenMenuDrawer={() => setIsMenuDrawerOpen(true)}
        />
      )}

      {/* 5. Modals System */}
      <TelaahCreationModal
        isOpen={isTelaahCreationModalOpen}
        onClose={() => setIsTelaahCreationModalOpen(false)}
        data={data}
        onApplyGenerated={handleApplyAiTelaah}
        onSelectManual={handleSelectManualTelaah}
        onOpenTemplateSelector={() => {
          setIsTelaahCreationModalOpen(false);
          setIsTemplateModalOpen(true);
        }}
      />

      <MenuDrawerModal
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPejabat={() => setIsPejabatModalOpen(true)}
        onOpenTemplate={() => setIsTemplateModalOpen(true)}
        onOpenGas={() => setIsGasModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenGoogleDocs={() => setIsGoogleDocsModalOpen(true)}
        onOpenSpt={() => setSptSppdModal({ isOpen: true, type: 'spt' })}
        onOpenSppd={() => setSptSppdModal({ isOpen: true, type: 'sppd' })}
        onOpenKuitansi={() => setIsKuitansiModalOpen(true)}
        onReset={handleReset}
      />

      <PejabatModal
        isOpen={isPejabatModalOpen}
        onClose={() => setIsPejabatModalOpen(false)}
        data={data}
        onUpdatePejabat={handleUpdatePejabat}
      />

      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <KuitansiRincianModal
        isOpen={isKuitansiModalOpen}
        onClose={() => setIsKuitansiModalOpen(false)}
        data={data}
      />

      <FotoDokumentasiModal
        isOpen={isFotoModalOpen}
        onClose={() => setIsFotoModalOpen(false)}
        data={data}
      />

      <LaporanDinasModal
        isOpen={isLaporanModalOpen}
        onClose={() => setIsLaporanModalOpen(false)}
        data={data}
      />

      <SignaturePadModal
        isOpen={signatureModal.isOpen}
        onClose={() => setSignatureModal((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveSignature}
        title={
          signatureModal.target === 'disposisi'
            ? 'Paraf Disposisi Pimpinan'
            : 'Tanda Tangan Pembuat Telaahan'
        }
        signeeName={
          signatureModal.target === 'disposisi'
            ? data.disposisi.jabatanPimpinan.replace(':', '')
            : data.kaki.namaPembuat
        }
        signeeRole={
          signatureModal.target === 'disposisi'
            ? 'Pimpinan Pembina'
            : data.kaki.jabatanPembuat.replace(',', '')
        }
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        onPrint={handleTriggerPrint}
        onOpenGoogleDocs={() => setIsGoogleDocsModalOpen(true)}
      />

      <GoogleDocsEmbedModal
        isOpen={isGoogleDocsModalOpen}
        onClose={() => setIsGoogleDocsModalOpen(false)}
        data={data}
      />

      <GasIntegrationModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        data={data}
      />

      <SptSppdPreviewModal
        isOpen={sptSppdModal.isOpen}
        onClose={() => setSptSppdModal((prev) => ({ ...prev, isOpen: false }))}
        data={data}
        initialType={sptSppdModal.type}
      />

      {/* =========================================================================
          IN-APP CONFIRMATION MODALS (RELIABLE & BYPASSES IFRAME POPUP RESTRICTIONS)
      ========================================================================= */}
      {/* 1. Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Kosongkan Formulir Telaahan?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Isian data telaahan staf akan dikosongkan. Profil instansi dan nama pejabat tetap disimpan.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Pastikan naskah penting sudah diekspor atau dicetak sebelumnya.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kosongkan Form</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Toast Notification Banner (Floating safely above bottom bars with 44px touch targets) */}
      {toastMessage && (
        <div className="fixed bottom-22 sm:bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 z-50 animate-in slide-in-from-bottom-3 duration-200 w-[92%] max-w-md">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4.5 h-4.5 text-purple-400 shrink-0" />
              <span className="truncate leading-tight">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer shrink-0 active:scale-95"
              title="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
