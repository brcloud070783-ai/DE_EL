import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  ExternalLink,
  Printer,
  Download,
  Loader2,
  UserCheck,
  Sparkles,
  Cloud,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { TelaahanStafData } from '../types';
import { googleSignIn, initAuth } from '../utils/googleAuth';
import { User } from 'firebase/auth';
import { createGoogleDocFromHtml } from '../utils/googleServices';
import { generateTelaahHtmlForGoogleDocs } from '../utils/googleDocHtmlGenerator';

interface GoogleDocsEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
}

export const GoogleDocsEmbedModal: React.FC<GoogleDocsEmbedModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [docId, setDocId] = useState<string | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync auth state
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        // Automatically create Google Doc after sign in
        await handleGenerateGoogleDoc(res.accessToken);
      }
    } catch (error: any) {
      setErrorMsg('Gagal terhubung dengan Google: ' + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Generate Google Doc from current Telaahan Staf data
  const handleGenerateGoogleDoc = async (tokenOverride?: string) => {
    const token = tokenOverride || accessToken;
    if (!token) return;

    setIsCreatingDoc(true);
    setErrorMsg(null);

    try {
      const title = `[TELAAH STAF] ${data.header.nomorSurat || 'Draf'} - ${data.header.hal || 'Kedinasan'}`;
      const htmlContent = generateTelaahHtmlForGoogleDocs(data);

      const createdFile = await createGoogleDocFromHtml(token, title, htmlContent);
      setDocId(createdFile.id);
      setDocUrl(createdFile.webViewLink || `https://docs.google.com/document/d/${createdFile.id}/edit`);
    } catch (err: any) {
      console.error('Error generating Google Doc:', err);
      setErrorMsg(err.message || 'Gagal membuat berkas Google Docs.');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  const embedUrl = docId ? `https://docs.google.com/document/d/${docId}/preview` : null;
  const editUrl = docId ? `https://docs.google.com/document/d/${docId}/edit` : null;
  const printUrl = docId ? `https://docs.google.com/document/d/${docId}/print` : null;
  const downloadPdfUrl = docId ? `https://docs.google.com/document/d/${docId}/export?format=pdf` : null;
  const downloadDocxUrl = docId ? `https://docs.google.com/document/d/${docId}/export?format=docx` : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[94vh] sm:h-[88vh] sm:my-auto">
        {/* Drag Indicator on Mobile */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Canva Gradient Header */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] text-white flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Google Docs Cetak &amp; Live Embed</h3>
                <span className="bg-blue-400/30 text-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-300/30">
                  Ekosistem Google
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                Tampilan cetak presisi dan pengeditan langsung di Google Docs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar Header */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            {currentUser ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{currentUser.displayName || currentUser.email}</span>
              </span>
            ) : (
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-blue-600" />
                <span>Belum terhubung ke Google</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {docId && (
              <>
                <button
                  type="button"
                  onClick={() => handleGenerateGoogleDoc()}
                  disabled={isCreatingDoc}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-3xs"
                  title="Perbarui isi Google Docs dengan draf terbaru"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCreatingDoc ? 'animate-spin text-blue-600' : ''}`} />
                  <span>Sinkron Ulang</span>
                </button>

                {printUrl && (
                  <a
                    href={printUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Google Docs</span>
                  </a>
                )}

                {editUrl && (
                  <a
                    href={editUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Tab Baru</span>
                  </a>
                )}

                {downloadPdfUrl && (
                  <a
                    href={downloadPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-red-600" />
                    <span>PDF</span>
                  </a>
                )}

                {downloadDocxUrl && (
                  <a
                    href={downloadDocxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>DOCX</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden flex flex-col relative">
          {!currentUser ? (
            <div className="m-auto max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Cloud className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">Hubungkan Akun Google Anda</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Aplikasi akan langsung membuat berkas Google Docs resmi di Google Drive Anda untuk tampilan cetak dan pengeditan langsung.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium text-left">
                  {errorMsg}
                </div>
              )}

              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleLogin}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-full text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghubungkan ke Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.82 0-8.73-3.793-8.73-8.514s3.91-8.514 8.73-8.514c2.25 0 4.195.8 5.7 2.228l3.19-3.19C18.665 1.157 15.684 0 12.24 0 5.48 0 0 5.37 0 12s5.48 12 12.24 12c6.31 0 12.24-4.5 12.24-12 0-.814-.072-1.63-.213-2.428H12.24z" />
                    </svg>
                    <span>Masuk dengan Google</span>
                  </>
                )}
              </button>
            </div>
          ) : !docId ? (
            <div className="m-auto max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">Buat Google Docs Siap Cetak</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Klik tombol di bawah untuk mengonversi draf Telaahan Staf ini menjadi berkas Google Docs resmi di Google Drive Anda.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium text-left">
                  {errorMsg}
                </div>
              )}

              <button
                type="button"
                disabled={isCreatingDoc}
                onClick={() => handleGenerateGoogleDoc()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-full text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isCreatingDoc ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Membuat Google Docs...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Generate &amp; Embed Google Docs Sekarang</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner flex flex-col relative">
              {/* Embed Iframe */}
              {embedUrl && (
                <iframe
                  src={embedUrl}
                  title="Google Docs Live Embed Preview"
                  className="w-full h-full border-0"
                  allow="autoplay"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium text-[11.5px] text-slate-600">
              Dokumen tersimpan otomatis di Google Drive Anda
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-full transition cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
