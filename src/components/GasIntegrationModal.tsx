import React, { useState, useEffect } from 'react';
import { TelaahanStafData } from '../types';
import {
  X,
  FolderPlus,
  Table,
  Terminal,
  ExternalLink,
  FolderTree,
  Send,
  Play,
  CheckCircle2,
  Sparkles,
  Cloud,
  FileImage,
  Upload,
  UserCheck,
  LogOut,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { auth, googleSignIn, logout, initAuth } from '../utils/googleAuth';
import { User } from 'firebase/auth';
import {
  createFolder,
  findFileByName,
  createSpreadsheet,
  setupTravelLogSheet,
  appendRowToSpreadsheet,
  uploadFileToDrive,
} from '../utils/googleServices';

interface GasIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TelaahanStafData;
}

interface CreatedFolderInfo {
  nama: string;
  nip: string;
  folderUrl: string;
}

export const GasIntegrationModal: React.FC<GasIntegrationModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  // Google Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form State
  const [rootFolderName, setRootFolderName] = useState('Arsip_Perjadin_Dinas_Pendidikan_Kaltara');
  const [sheetName, setSheetName] = useState('Log_Perjadin_Disdikbud_Kaltara');

  // Integration Process State
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [integrationSuccess, setIntegrationSuccess] = useState(false);

  // Result links
  const [mainTripFolderUrl, setMainTripFolderUrl] = useState<string | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
  const [createdPersonilFolders, setCreatedPersonilFolders] = useState<CreatedFolderInfo[]>([]);

  // Photo Upload State
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number>(0);
  const [uploadCategory, setUploadCategory] = useState<string>('4_Kuitansi_Riil_dan_Foto');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  // Sync auth state on mount and when modal opens
  useEffect(() => {
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
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (error: any) {
      alert('Gagal menghubungkan Akun Google: ' + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setAccessToken(null);
      setIntegrationSuccess(false);
      setProcessLogs([]);
    } catch (error: any) {
      console.error(error);
    }
  };

  // Run Real Integration Setup
  const handleRunIntegration = async () => {
    if (!accessToken) {
      alert('Silakan hubungkan akun Google Anda terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setIntegrationSuccess(false);
    setProcessLogs([]);
    setCreatedPersonilFolders([]);

    const log = (msg: string) => {
      setProcessLogs((prev) => [...prev, `[${new Date().toLocaleTimeString('id-ID')}] ${msg}`]);
    };

    try {
      log('🌐 Memulai sinkronisasi ekosistem Google Workspace...');

      // Step 1: Find or Create Root Folder
      log(`🔍 Mencari folder root "${rootFolderName}" di Google Drive...`);
      let rootFolder = await findFileByName(accessToken, rootFolderName, 'application/vnd.google-apps.folder');

      if (!rootFolder) {
        log(`📁 Folder root tidak ditemukan. Membuat folder root baru...`);
        rootFolder = await createFolder(accessToken, rootFolderName);
        log(`✅ Sukses membuat Folder Root ID: ${rootFolder.id}`);
      } else {
        log(`✅ Folder root ditemukan dengan ID: ${rootFolder.id}`);
      }

      // Step 2: Create Main Trip Folder
      const tripFolderName = `[${data.header.nomorSurat || 'Perjadin'}] - ${data.kesimpulan.tempat || 'Kegiatan'}`;
      log(`📦 Membuat folder induk kegiatan: "${tripFolderName}"...`);
      const tripFolder = await createFolder(accessToken, tripFolderName, rootFolder.id);
      setMainTripFolderUrl(tripFolder.webViewLink || `https://drive.google.com/drive/folders/${tripFolder.id}`);
      log(`✅ Sukses membuat Folder Induk Kegiatan.`);

      // Step 3: Create Personnel Folders & sub-folders
      const personilList = data.kesimpulan.personil || [];
      const personilFoldersResult: CreatedFolderInfo[] = [];

      for (let i = 0; i < personilList.length; i++) {
        const p = personilList[i];
        const folderName = `[${p.nama || 'Tanpa Nama'}] - NIP.${p.nip || '-'}`;
        log(`  └── 👤 Membuat folder pegawai: "${p.nama}"...`);
        const pFolder = await createFolder(accessToken, folderName, tripFolder.id);

        // Subfolders
        log(`      ├── Membuat sub-folder: 1_Telaah_dan_SPT`);
        await createFolder(accessToken, '1_Telaah_dan_SPT', pFolder.id);

        log(`      ├── Membuat sub-folder: 2_SPPD_Lembar_1_dan_2`);
        await createFolder(accessToken, '2_SPPD_Lembar_1_dan_2', pFolder.id);

        log(`      ├── Membuat sub-folder: 3_Tiket_BoardingPass_Hotel`);
        const ticketFolder = await createFolder(accessToken, '3_Tiket_BoardingPass_Hotel', pFolder.id);

        log(`      └── Membuat sub-folder: 4_Kuitansi_Riil_dan_Foto`);
        const receiptsFolder = await createFolder(accessToken, '4_Kuitansi_Riil_dan_Foto', pFolder.id);

        personilFoldersResult.push({
          nama: p.nama,
          nip: p.nip,
          folderUrl: pFolder.webViewLink || `https://drive.google.com/drive/folders/${pFolder.id}`,
        });

        // Store specific folders in temporary array/state if we want to upload files there
        // (we'll save the receiptsFolder ID to support file upload)
        (p as any)._receiptsFolderId = receiptsFolder.id;
        (p as any)._ticketFolderId = ticketFolder.id;
      }

      setCreatedPersonilFolders(personilFoldersResult);

      // Step 4: Find or Create Google Sheets Log
      log(`🔍 Mencari database log Google Sheets "${sheetName}"...`);
      let sheetFile = await findFileByName(accessToken, sheetName, 'application/vnd.google-apps.spreadsheet');
      let currentSpreadsheetId = '';

      if (!sheetFile) {
        log(`📊 Database Sheets tidak ditemukan. Membuat Google Sheets baru...`);
        const newSheet = await createSpreadsheet(accessToken, sheetName);
        currentSpreadsheetId = newSheet.spreadsheetId;
        setSpreadsheetUrl(newSheet.spreadsheetUrl);
        log(`✅ Sukses membuat Spreadsheet.`);
      } else {
        currentSpreadsheetId = sheetFile.id;
        setSpreadsheetUrl(sheetFile.webViewLink || `https://docs.google.com/spreadsheets/d/${sheetFile.id}`);
        log(`✅ Database Sheets ditemukan.`);
      }

      // Step 5: Setup Headers & Append Row
      log('📝 Memeriksa struktur tabel dan mencatat baris log rekonsiliasi...');
      await setupTravelLogSheet(accessToken, currentSpreadsheetId, 'Log_Perjadin');

      const names = personilList.map((p) => p.nama).join(', ');
      const newRow = [
        new Date().toLocaleString('id-ID'),
        data.id || Math.random().toString(36).substring(7),
        data.header.nomorSurat || '-',
        data.header.hal || '-',
        data.kesimpulan.tempat || '-',
        data.kesimpulan.tanggal || '-',
        personilList.length,
        names,
        tripFolder.webViewLink || `https://drive.google.com/drive/folders/${tripFolder.id}`,
      ];

      await appendRowToSpreadsheet(accessToken, currentSpreadsheetId, 'Log_Perjadin', [newRow]);
      log('📊 Sukses mencatat baris log perjalanan dinas.');

      log('🎉 INTEGRASI SUKSES! Seluruh infrastruktur Google Workspace Anda telah siap digunakan.');
      setIntegrationSuccess(true);
    } catch (error: any) {
      log(`❌ Error: ${error.message}`);
      alert('Proses integrasi terhambat: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Photo/File Upload
  const handleFileUpload = async () => {
    if (!accessToken) return;
    if (!selectedFile) {
      alert('Silakan pilih berkas foto atau bukti terlebih dahulu.');
      return;
    }

    const personilList = data.kesimpulan.personil || [];
    const activePerson = personilList[selectedPersonIndex];
    if (!activePerson) {
      alert('Pegawai pelaksana tidak valid.');
      return;
    }

    // Determine target folder ID
    const targetFolderId =
      uploadCategory === '4_Kuitansi_Riil_dan_Foto'
        ? (activePerson as any)._receiptsFolderId
        : (activePerson as any)._ticketFolderId;

    if (!targetFolderId) {
      alert('Harap jalankan "Buat Struktur Folder" di atas terlebih dahulu agar folder Drive pegawai terbentuk.');
      return;
    }

    setIsUploading(true);
    setUploadedFileUrl(null);
    setUploadLogs([]);

    const logUp = (msg: string) => {
      setUploadLogs((prev) => [...prev, msg]);
    };

    try {
      logUp(`📤 Menghubungi Google Drive Storage...`);
      logUp(`📄 Menyiapkan berkas: "${selectedFile.name}"...`);

      const uploaded = await uploadFileToDrive(
        accessToken,
        targetFolderId,
        selectedFile.name,
        selectedFile
      );

      logUp(`✅ Berkas berhasil diunggah ke Google Drive!`);
      setUploadedFileUrl(uploaded.webViewLink || `https://drive.google.com/file/d/${uploaded.id}`);
      setSelectedFile(null);
    } catch (error: any) {
      logUp(`❌ Gagal mengunggah: ${error.message}`);
      alert('Gagal mengunggah berkas: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto print:hidden">
      <div className="bg-white w-full max-w-4xl rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] sm:my-auto">
        {/* Drag Bar */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Canva Gradient Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7F56D9] text-white flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Ekosistem Google Workspace
              </h3>
              <p className="text-xs text-purple-100 font-medium">
                Penyimpanan foto otomatis di Google Drive &amp; Database di Google Sheets.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6">
          {/* STEP 1: LOGIN STATUS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google User'}
                      className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 flex items-center justify-center font-bold text-base">
                      {currentUser.displayName?.charAt(0) || 'G'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-800 text-sm">
                        {currentUser.displayName || 'Akun Terhubung'}
                      </h4>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Connected
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{currentUser.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Cloud className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Belum Terhubung dengan Google</h4>
                    <p className="text-xs text-slate-500 font-medium">Hubungkan akun untuk mengaktifkan folder Drive &amp; Sheets dinas Anda.</p>
                  </div>
                </>
              )}
            </div>

            <div>
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-red-200 transition flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Putuskan Akun</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={handleLogin}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold rounded-full transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menghubungkan...</span>
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
              )}
            </div>
          </div>

          {currentUser && (
            <>
              {/* STEP 2: CONFIGURE & INITIALIZE INFRASTRUCTURE */}
              <div className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                  <div className="p-1 bg-indigo-50 text-indigo-700 rounded-lg">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Konfigurasi &amp; Inisialisasi Google Workspace</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Folder Induk (Google Drive)
                    </label>
                    <input
                      type="text"
                      value={rootFolderName}
                      onChange={(e) => setRootFolderName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Google Sheets Database Log
                    </label>
                    <input
                      type="text"
                      value={sheetName}
                      onChange={(e) => setSheetName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold text-slate-700"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Sistem akan mendeteksi/membuat folder root, membuat folder perjalanan khusus <strong>[{data.header.nomorSurat || 'Nomor Surat'}]</strong>, membuat subfolder bagi {data.kesimpulan.personil.length} personil pelaksana, dan menulis log ke Google Sheet secara otomatis.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleRunIntegration}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-full text-xs shadow-md transition flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-4 h-4" />
                        <span>Buat Struktur Folder &amp; Log</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Integration Console Logs */}
                {processLogs.length > 0 && (
                  <div className="bg-slate-950 text-slate-200 rounded-xl p-3.5 font-mono text-xs max-h-[180px] overflow-y-auto space-y-1">
                    {processLogs.map((log, index) => (
                      <div
                        key={index}
                        className={
                          log.includes('✅')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('❌')
                            ? 'text-red-400 font-bold'
                            : log.includes('└──')
                            ? 'text-cyan-300'
                            : 'text-slate-300'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUCCESS LINKS */}
              {integrationSuccess && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-extrabold text-emerald-900 text-sm">Struktur Google Drive &amp; Sheets Berhasil Di-setup!</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {mainTripFolderUrl && (
                      <a
                        href={mainTripFolderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white hover:bg-indigo-50 border border-slate-100 rounded-xl flex items-center justify-between group transition text-xs font-semibold text-slate-700 hover:text-indigo-900 shadow-3xs"
                      >
                        <span className="flex items-center gap-2">
                          <span className="p-1 bg-indigo-50 text-indigo-700 rounded-lg">📁</span>
                          <span>Buka Folder Utama Perjalanan</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </a>
                    )}

                    {spreadsheetUrl && (
                      <a
                        href={spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white hover:bg-emerald-50 border border-slate-100 rounded-xl flex items-center justify-between group transition text-xs font-semibold text-slate-700 hover:text-emerald-900 shadow-3xs"
                      >
                        <span className="flex items-center gap-2">
                          <span className="p-1 bg-emerald-50 text-emerald-700 rounded-lg">📊</span>
                          <span>Buka Google Sheets Database</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                      </a>
                    )}
                  </div>

                  {/* List of personnel folders */}
                  <div className="text-[11px] text-slate-600 pt-2 border-t border-emerald-200/50 space-y-1.5">
                    <span className="font-bold text-slate-700 uppercase tracking-wide">Daftar Folder Pribadi Pegawai (Drive):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {createdPersonilFolders.map((pf, idx) => (
                        <a
                          key={idx}
                          href={pf.folderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 bg-white/70 hover:bg-slate-50 rounded-lg border border-slate-200/60 transition group"
                        >
                          <span className="truncate pr-2">👤 {pf.nama} (NIP. {pf.nip})</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: UPLOAD PHOTO TO GOOGLE DRIVE */}
              {integrationSuccess && (
                <div className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                    <div className="p-1 bg-emerald-50 text-emerald-700 rounded-lg">
                      <FileImage className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Unggah Foto &amp; Dokumen Bukti Perjalanan</h4>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    Staf dinas dapat memotret tiket, kwitansi rill, atau dokumentasi kegiatan secara langsung dari HP dan mengunggahnya ke folder Google Drive pribadi masing-masing yang terintegrasi.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Pegawai Pelaksana</label>
                      <select
                        value={selectedPersonIndex}
                        onChange={(e) => setSelectedPersonIndex(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-semibold text-slate-700"
                      >
                        {data.kesimpulan.personil.map((p, idx) => (
                          <option key={idx} value={idx}>
                            {p.nama || `Pegawai #${idx + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Berkas / Folder</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-semibold text-slate-700"
                      >
                        <option value="4_Kuitansi_Riil_dan_Foto">4_Kuitansi_Riil_dan_Foto</option>
                        <option value="3_Tiket_BoardingPass_Hotel">3_Tiket_BoardingPass_Hotel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pilih File Foto / Berkas</label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                        className="w-full text-xs font-semibold text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-extrabold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      {selectedFile ? (
                        <span>📂 Siap unggah: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      ) : (
                        <span>⚠️ Belum ada berkas yang dipilih</span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isUploading || !selectedFile}
                      onClick={handleFileUpload}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-full text-xs shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengunggah...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah ke Google Drive</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Upload Console Logs */}
                  {uploadLogs.length > 0 && (
                    <div className="bg-slate-950 text-slate-200 rounded-xl p-3 font-mono text-xs space-y-1">
                      {uploadLogs.map((log, index) => (
                        <div key={index} className={log.includes('✅') ? 'text-emerald-400 font-bold' : log.includes('❌') ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Uploaded File Link */}
                  {uploadedFileUrl && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 flex items-center justify-between text-xs font-semibold animate-in fade-in zoom-in-95 duration-150">
                      <span>🎉 Berkas berhasil masuk Google Drive pegawai!</span>
                      <a
                        href={uploadedFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-950 underline flex items-center gap-1"
                      >
                        <span>Buka File</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer sticky bar */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-[11px] text-slate-600">Ekosistem Resmi Google Workspace Active</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold rounded-full transition flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
