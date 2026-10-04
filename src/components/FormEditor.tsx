import React, { useState } from 'react';
import {
  TelaahanStafData,
  Personil,
  KopSurat,
  HeaderSurat,
  KesimpulanTelaah,
  KakiNaskah,
} from '../types';
import { AiQuestionnaireCard } from './AiQuestionnaireCard';
import { GuideBottomSheet, GuideTemplateItem } from './GuideBottomSheet';
import {
  AdvancedDatePicker,
  parseIndonesianDate,
} from './AdvancedDatePicker';
import { estimatePrintLines, condenseSectionList } from '../utils/printLineEstimator';

function numberToIndonesianWords(n: number): string {
  const words = [
    'nol',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
    'sepuluh',
    'sebelas',
  ];
  if (n < 12) return words[n];
  if (n < 20) return `${words[n - 10]} belas`;
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const rest = n % 10;
    return `${words[tens]} puluh${rest > 0 ? ' ' + words[rest] : ''}`;
  }
  return String(n);
}

function calculateDurationString(startDateStr: string, endDateStr: string): string {
  const start = parseIndonesianDate(startDateStr);
  const end = parseIndonesianDate(endDateStr);
  if (!start || !end) return '';

  const diffTime = end.getTime() - start.getTime();
  if (diffTime < 0) return '';
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  if (diffDays > 0) {
    const word = numberToIndonesianWords(diffDays);
    return `${diffDays} (${word}) hari`;
  }
  return '';
}
import {
  Home,
  FileText,
  FileEdit,
  Scale,
  Lightbulb,
  SearchCheck,
  BadgeCheck,
  ListOrdered,
  Users,
  Send,
  PenTool,
  Sparkles,
  FileCheck2,
  Building2,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  ShieldCheck,
  Eye,
  Check,
  Coins,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  LayoutGrid,
  RotateCcw,
  X,
  Mic,
} from 'lucide-react';

interface FormEditorProps {
  data: TelaahanStafData;
  onChange: (updated: TelaahanStafData) => void;
  onOpenSignature: (target: 'disposisi' | 'kaki') => void;
  onLoadSample: () => void;
  onReset: () => void;
  onOpenInformasiUmum?: () => void;
  onOpenPreview?: () => void;
  onOpenLauncher?: () => void;
  currentStep?: StepKey;
  onStepChange?: (step: StepKey) => void;
  onOpenAiModal?: () => void;
  paperSize?: 'a4' | 'f4';
  onPaperSizeChange?: (size: 'a4' | 'f4') => void;
}

type StepKey = 1 | 2 | 3 | 4;

interface StepMeta {
  id: StepKey;
  number: string;
  title: string;
  subtitle: string;
  shortTitle: string;
  desktopTitle?: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  activeBg: string;
  iconBg: string;
  ringColor: string;
}

const STEPS: StepMeta[] = [
  {
    id: 1,
    number: '01',
    title: 'Pokok Masalah & Praanggapan',
    subtitle: 'Kepala Naskah, I. Pokok Permasalahan, II. Praanggapan',
    shortTitle: 'Bab I & II',
    desktopTitle: 'I. Pokok Masalah & II. Praanggapan',
    hint: 'Bab I & II',
    icon: FileText,
    activeBg: 'bg-[#3B82F6]',
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-200/80',
    ringColor: 'ring-blue-400/40',
  },
  {
    id: 2,
    number: '02',
    title: 'Fakta & Analisis Pembahasan',
    subtitle: 'III. Fakta yang Mempengaruhi, IV. Analisis & Pembahasan',
    shortTitle: 'Bab III & IV',
    desktopTitle: 'III. Fakta & IV. Analisis',
    hint: 'Bab III & IV',
    icon: Scale,
    activeBg: 'bg-[#F59E0B]',
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/80',
    ringColor: 'ring-amber-400/40',
  },
  {
    id: 3,
    number: '03',
    title: 'Kesimpulan, Saran & Tim',
    subtitle: 'V. Kesimpulan, VI. Saran, Tim Personel & Rekening DPA',
    shortTitle: 'Bab V & VI',
    desktopTitle: 'V. Kesimpulan & VI. Saran',
    hint: 'Bab V & VI',
    icon: Lightbulb,
    activeBg: 'bg-[#10B981]',
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
    ringColor: 'ring-emerald-400/40',
  },
  {
    id: 4,
    number: '04',
    title: 'Pengesahan & TTE',
    subtitle: 'Penelaah/PPTK, Tanda Tangan Digital & Disposisi',
    shortTitle: 'Pengesahan',
    desktopTitle: 'Pengesahan & TTE',
    hint: 'TTE & Validasi',
    icon: PenTool,
    activeBg: 'bg-[#7F56D9]',
    iconBg: 'bg-purple-50 text-[#7F56D9] border border-purple-200/80',
    ringColor: 'ring-purple-400/40',
  },
];

const formatNipBkn = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 18);
  if (digits.length <= 8) return digits;
  if (digits.length <= 14) return `${digits.slice(0, 8)} ${digits.slice(8)}`;
  if (digits.length <= 15) return `${digits.slice(0, 8)} ${digits.slice(8, 14)} ${digits.slice(14)}`;
  return `${digits.slice(0, 8)} ${digits.slice(8, 14)} ${digits.slice(14, 15)} ${digits.slice(15, 18)}`;
};

const FORMALIZER_SUGGESTIONS = {
  persoalan: [
    'Bahwa sejalan dengan regulasi tugas pokok dan fungsi Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara TA 2026.',
    'Urgensi pelaksanaan penugasan dinas ke lokasi sasaran guna memastikan kelancaran koordinasi teknis dan administrasi.',
    'Landasan hukum pelaksanaan kegiatan dinas dimaksud guna menjamin keabsahan dan tertib administrasi daerah.',
    'Kebutuhan koordinasi teknis di lapangan memerlukan pemantauan secara langsung dari tim teknis dinas.',
  ],
  praanggapan: [
    'Bahwa alokasi anggaran belanja perjalanan dinas telah tersedia cukup pada DPA Disdikbud Kaltara TA 2026.',
    'Bahwa kendala teknis koordinasi lapangan dapat dimitigasi secara penuh bersama pihak terkait di lokasi.',
    'Bahwa penugasan dinas secara langsung dinilai lebih efektif guna menyelesaikan hambatan administrasi.',
    'Bahwa koordinasi tatap muka menjamin akuntabilitas serta ketepatan sasaran keluaran program kerja dinas.',
  ],
  fakta: [
    'Surat Undangan Resmi dari instansi penyelenggara perihal agenda pelaksanaan koordinasi teknis.',
    'Rangkaian kegiatan dinas dijadwalkan secara definitif bertempat di lokasi kota tujuan yang telah ditetapkan.',
    'Data rekapitulasi sasaran menunjukkan pentingnya verifikasi lapangan untuk penyelarasan dokumen fisik.',
    'Simulasi teknis dan uji coba sistem memerlukan pendampingan langsung guna memitigasi kegagalan sistem.',
  ],
  analisis: [
    'Bahwa kehadiran langsung pelaksana memiliki tingkat efektivitas tinggi dalam mengawal kelancaran teknis.',
    'Bahwa penugasan personel dinas yang diusulkan telah rasional, proporsional, dan sesuai kualifikasi.',
    'Bahwa alokasi biaya perjalanan dinas dirancang secara hemat, wajar, dan sesuai dengan standar pagu.',
    'Bahwa koordinasi langsung mempercepat proses sinkronisasi data demi menghindari keterlambatan laporan.',
  ],
  saran: [
    'Menunjuk staf atau pejabat terkait pada dinas yang berkompeten untuk melaksanakan penugasan dimaksud;',
    'Memohon kiranya Kepala Dinas berkenan menyetujui, menandatangani, serta menerbitkan SPT dan SPPD;',
    'Membebankan anggaran belanja perjalanan dinas pada DPA Dinas Pendidikan dan Kebudayaan Prov. Kaltara TA 2026.',
  ],
  kesimpulan: [
    'Pelaksanaan perjalanan dinas ke lokasi tujuan dinilai sangat layak, mendesak, dan berkontribusi langsung pada target kinerja dinas;',
    'Rencana penugasan luar daerah telah memenuhi ketentuan administrasi serta didukung ketersediaan anggaran pada DPA TA 2026;',
    'Koordinasi fisik secara tatap muka dinilai memiliki efektivitas tinggi guna menjamin akuntabilitas penyaluran dan pelaporan program;',
    'Hasil pemetaan dan pendampingan lapangan memberikan data rekomendasi faktual yang valid demi penyempurnaan program kerja.',
  ],
};

export const FormEditor: React.FC<FormEditorProps> = React.memo(({
  data,
  onChange,
  onOpenSignature,
  onLoadSample,
  onReset,
  onOpenInformasiUmum,
  onOpenPreview,
  onOpenLauncher,
  currentStep: currentStepProp,
  onStepChange,
  onOpenAiModal,
  paperSize,
  onPaperSizeChange,
}) => {
  const [localPaperSize, setLocalPaperSize] = useState<'a4' | 'f4'>('a4');
  const currentPaperSize = paperSize ?? localPaperSize;
  const setPaperSize = onPaperSizeChange ?? setLocalPaperSize;

  // 1. Current Step in the Wizard (1 to 4) - Controlled via props or local fallback
  const [localStep, setLocalStep] = useState<StepKey>(1);
  const currentStep = currentStepProp ?? localStep;
  const setCurrentStep = (step: StepKey) => {
    if (onStepChange) onStepChange(step);
    setLocalStep(step);
  };

  // 2. Guide Bottom Sheet State
  const [activeGuide, setActiveGuide] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    description?: string;
    badgeLabel?: string;
    colorTheme?: 'purple' | 'cyan' | 'rose' | 'amber' | 'emerald' | 'teal' | 'blue';
    templates?: GuideTemplateItem[];
    targetField?: 'persoalan' | 'praanggapan' | 'fakta' | 'analisis' | 'kesimpulan' | 'saran';
  }>({
    isOpen: false,
    title: '',
  });

  // AI Revision states for individual chapters
  const [revisingSection, setRevisingSection] = useState<string | null>(null);
  const [revisionInstructions, setRevisionInstructions] = useState<string>('');
  const [activeInstructionSection, setActiveInstructionSection] = useState<string | null>(null);
  const [activeFormalizer, setActiveFormalizer] = useState<{
    section: 'persoalan' | 'praanggapan' | 'fakta' | 'analisis' | 'saran' | 'kesimpulan';
  } | null>(null);
  const [showCompletenessDetails, setShowCompletenessDetails] = useState<boolean>(false);

  // 🎙️ Voice Typing (Web Speech API) States & Handlers
  const [dictatingField, setDictatingField] = useState<{
    section: 'persoalan' | 'praanggapan' | 'fakta' | 'analisis' | 'saran' | 'hal';
  } | null>(null);
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const recognitionRef = React.useRef<any>(null);

  const startVoiceDictation = (section: 'persoalan' | 'praanggapan' | 'fakta' | 'analisis' | 'saran' | 'hal') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Pencarian Suara (Dikte) tidak didukung pada browser Anda. Silakan gunakan Google Chrome atau Safari.');
      return;
    }

    if (isDictating) {
      stopVoiceDictation();
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'id-ID';
    rec.continuous = true;
    rec.interimResults = false;

    rec.onstart = () => {
      setIsDictating(true);
      setDictatingField({ section });
    };

    rec.onresult = (event: any) => {
      const text = event.results[event.results.length - 1][0].transcript;
      if (text && text.trim()) {
        const formattedText = text.charAt(0).toUpperCase() + text.slice(1);

        if (section === 'hal') {
          onChange({
            ...data,
            header: { ...data.header, hal: ((data.header.hal || '') + ' ' + formattedText).trim() }
          });
        } else {
          const currentList = Array.isArray(data[section]) ? [...(data[section] as string[])] : [];
          if (currentList.length === 0 || currentList[currentList.length - 1].trim() === '') {
            if (currentList.length > 0) {
              currentList[currentList.length - 1] = formattedText;
            } else {
              currentList.push(formattedText);
            }
          } else {
            currentList.push(formattedText);
          }
          onChange({ ...data, [section]: currentList });
        }
      }
    };

    rec.onerror = (e: any) => {
      console.warn('Speech Recognition error:', e);
      stopVoiceDictation();
    };

    rec.onend = () => {
      setIsDictating(false);
      setDictatingField(null);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      console.warn('Gagal memulai perekaman suara:', err);
      stopVoiceDictation();
    }
  };

  const stopVoiceDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsDictating(false);
    setDictatingField(null);
  };

  const handleReviseAi = async (sectionKey: 'persoalan' | 'praanggapan' | 'fakta' | 'analisis' | 'saran' | 'kesimpulan') => {
    try {
      setRevisingSection(sectionKey);
      
      let currentText: string | string[] = '';
      if (sectionKey === 'kesimpulan') {
        currentText = data.kesimpulan.ringkasan || '';
      } else {
        currentText = data[sectionKey] || '';
      }

      const response = await fetch('/api/revise-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionName: sectionKey,
          currentText,
          instructions: revisionInstructions || 'Sederhanakan dan buat menjadi sangat singkat, padat, lugas, serta formal tanpa mengurangi makna naskah dinas.',
          contextTitle: data.header.hal || 'Telaahan Staf Perjalanan Dinas',
        }),
      });

      const result = await response.json();
      if (result.success && result.revisedText) {
        if (sectionKey === 'kesimpulan') {
          onChange({
            ...data,
            kesimpulan: {
              ...data.kesimpulan,
              ringkasan: typeof result.revisedText === 'string' ? result.revisedText : (Array.isArray(result.revisedText) ? result.revisedText.join(' ') : String(result.revisedText))
            }
          });
        } else {
          const rawItems = Array.isArray(result.revisedText)
            ? result.revisedText
            : typeof result.revisedText === 'string'
            ? result.revisedText.split('\n')
            : [];
          const cleanItems = condenseSectionList(rawItems, sectionKey, 6);
          onChange({
            ...data,
            [sectionKey]: cleanItems
          });
        }
        setRevisionInstructions('');
        setActiveInstructionSection(null);
      } else {
        alert(result.error || 'Gagal merivisi teks dengan AI.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Terjadi kesalahan koneksi saat memproses revisi AI.');
    } finally {
      setRevisingSection(null);
    }
  };

  // Updaters
  const updateHeader = (field: keyof HeaderSurat, val: string) => {
    onChange({ ...data, header: { ...data.header, [field]: val } });
  };

  const updateKesimpulan = (field: keyof KesimpulanTelaah, val: any) => {
    onChange({ ...data, kesimpulan: { ...data.kesimpulan, [field]: val } });
  };

  const updateKaki = (field: keyof KakiNaskah, val: any) => {
    onChange({ ...data, kaki: { ...data.kaki, [field]: val } });
  };

  // List append helper
  const handleAppendListItem = (
    key: 'persoalan' | 'praanggapan' | 'fakta' | 'analisis' | 'kesimpulan' | 'saran',
    textToAppend: string
  ) => {
    if (key === 'kesimpulan') {
      const currentPoints = Array.isArray(data.kesimpulan.poin)
        ? data.kesimpulan.poin.filter((s) => s.trim() !== '')
        : (data.kesimpulan.ringkasan ? [data.kesimpulan.ringkasan] : []);
      const updated = [...currentPoints, textToAppend];
      onChange({
        ...data,
        kesimpulan: {
          ...data.kesimpulan,
          poin: updated,
          ringkasan: updated.join(' '),
        },
      });
      return;
    }

    const currentList = Array.isArray(data[key])
      ? data[key].filter((s) => s.trim() !== '')
      : [];
    onChange({ ...data, [key]: [...currentList, textToAppend] });
  };

  const handleSelectSuggestion = (text: string) => {
    if (!activeFormalizer) return;
    const { section } = activeFormalizer;
    
    if (section === 'kesimpulan') {
      const currentList = Array.isArray(data.kesimpulan?.poin)
        ? [...data.kesimpulan.poin]
        : [];
        
      if (currentList.length === 0 || currentList[currentList.length - 1].trim() === '') {
        if (currentList.length > 0) {
          currentList[currentList.length - 1] = text;
        } else {
          currentList.push(text);
        }
      } else {
        currentList.push(text);
      }
      
      onChange({
        ...data,
        kesimpulan: {
          ...data.kesimpulan,
          poin: currentList,
          ringkasan: currentList.filter(s => s.trim()).join(' '),
        }
      });
    } else {
      const currentList = Array.isArray(data[section]) 
        ? [...(data[section] as string[])]
        : [];

      if (currentList.length === 0 || currentList[currentList.length - 1].trim() === '') {
        if (currentList.length > 0) {
          currentList[currentList.length - 1] = text;
        } else {
          currentList.push(text);
        }
      } else {
        currentList.push(text);
      }

      onChange({
        ...data,
        [section]: currentList
      });
    }
    
    setActiveFormalizer(null);
  };

  // Personil helpers
  const handleAddPersonil = () => {
    const newPerson: Personil = {
      id: `p-${Date.now()}`,
      nama: '',
      nip: '',
      pangkatGol: '',
      jabatan: '',
    };
    updateKesimpulan('personil', [...data.kesimpulan.personil, newPerson]);
  };

  const handleUpdatePersonil = (index: number, field: keyof Personil, value: string) => {
    const updatedList = [...data.kesimpulan.personil];
    const finalValue = field === 'nip' ? formatNipBkn(value) : value;
    updatedList[index] = { ...updatedList[index], [field]: finalValue };
    updateKesimpulan('personil', updatedList);
  };

  const handleRemovePersonil = (index: number) => {
    if (data.kesimpulan.personil.length <= 1) {
      alert('Minimal harus ada 1 personil yang ditugaskan.');
      return;
    }
    const updatedList = data.kesimpulan.personil.filter((_, i) => i !== index);
    updateKesimpulan('personil', updatedList);
  };

  // Section completion checks
  const isHeaderDone = Boolean(data.header.yth?.trim() && data.header.dari?.trim() && data.header.hal?.trim());
  const isPersoalanDone = Boolean(Array.isArray(data.persoalan) ? data.persoalan.some((s) => s.trim()) : data.persoalan);
  const isPraanggapanDone = Boolean(Array.isArray(data.praanggapan) && data.praanggapan.some((s) => s.trim()));
  const isFaktaDone = Boolean(Array.isArray(data.fakta) && data.fakta.some((s) => s.trim()));
  const isAnalisisDone = Boolean(Array.isArray(data.analisis) && data.analisis.some((s) => s.trim()));
  const isKesimpulanDone = Boolean(data.kesimpulan.personil.some((p) => p.nama?.trim()) && data.kesimpulan.tempat?.trim());
  const isSaranDone = Boolean(Array.isArray(data.saran) && data.saran.some((s) => s.trim()));
  const isKakiDone = Boolean(data.kaki.namaPembuat?.trim() && data.kaki.jabatanPembuat?.trim());

  // Step completion status
  const step1Complete = isHeaderDone && isPersoalanDone && isPraanggapanDone;
  const step2Complete = isFaktaDone && isAnalisisDone;
  const step3Complete = isKesimpulanDone && isSaranDone;
  const step4Complete = isKakiDone;

  const checkList = [
    { label: 'Yth Pimpinan', done: Boolean(data.header.yth?.trim()), step: 1 },
    { label: 'Pejabat Pembuat (Dari)', done: Boolean(data.header.dari?.trim()), step: 1 },
    { label: 'Nomor Surat', done: Boolean(data.header.nomorSurat?.trim() && !data.header.nomorSurat.includes('   ')), step: 1 },
    { label: 'Perihal Surat', done: Boolean(data.header.hal?.trim()), step: 1 },
    { label: 'Bab I (Persoalan)', done: Boolean(Array.isArray(data.persoalan) ? data.persoalan.some((s) => s.trim()) : data.persoalan), step: 1 },
    { label: 'Bab II (Praanggapan)', done: Boolean(Array.isArray(data.praanggapan) && data.praanggapan.some((s) => s.trim())), step: 1 },
    { label: 'Bab III (Fakta)', done: Boolean(Array.isArray(data.fakta) && data.fakta.some((s) => s.trim())), step: 2 },
    { label: 'Bab IV (Analisis)', done: Boolean(Array.isArray(data.analisis) && data.analisis.some((s) => s.trim())), step: 2 },
    { label: 'Maksud Perjalanan', done: Boolean(data.kesimpulan.maksudPerjalanan?.trim() || data.kesimpulan.ringkasan?.trim()), step: 3 },
    { label: 'Personil Ditugaskan', done: Boolean(data.kesimpulan.personil.length > 0 && data.kesimpulan.personil[0]?.nama?.trim()), step: 3 },
    { label: 'Tujuan Perjalanan', done: Boolean(data.kesimpulan.tempatTujuan?.trim() || data.kesimpulan.tempat?.trim()), step: 3 },
    { label: 'Tanggal Perjalanan', done: Boolean(data.kesimpulan.tanggal?.trim()), step: 3 },
    { label: 'Bab VI (Saran)', done: Boolean(Array.isArray(data.saran) && data.saran.some((s) => s.trim())), step: 3 },
    { label: 'Nama Pembuat', done: Boolean(data.kaki.namaPembuat?.trim()), step: 4 },
  ];

  const doneCount = checkList.filter((item) => item.done).length;
  const completionPercentage = Math.round((doneCount / checkList.length) * 100);

  const getStepCompletion = (step: StepKey) => {
    switch (step) {
      case 1:
        return step1Complete;
      case 2:
        return step2Complete;
      case 3:
        return step3Complete;
      case 4:
        return step4Complete;
    }
  };

  // Progress percentage calculation
  const totalSections = 8;
  const completedSectionsCount = [
    isHeaderDone,
    isPersoalanDone,
    isPraanggapanDone,
    isFaktaDone,
    isAnalisisDone,
    isKesimpulanDone,
    isSaranDone,
    isKakiDone,
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedSectionsCount / totalSections) * 100);

  const limit6Text = currentPaperSize === 'f4' ? 'Maks 7 baris cetak' : 'Maks 6 baris cetak';
  const limit3Text = currentPaperSize === 'f4' ? 'Maks 4 baris cetak' : 'Maks 3 baris cetak';
  const paperLabel = currentPaperSize === 'f4' ? 'kertas dokumen F4' : 'kertas dokumen A4';

  // Handlers to open guide bottom sheets
  const openPersoalanGuide = () => {
    setActiveGuide({
      isOpen: true,
      title: 'I. Pokok Permasalahan',
      subtitle: `2–3 poin: Dasar kegiatan, urgensi kehadiran langsung & dampak penundaan (${limit6Text})`,
      badgeLabel: '💡 Panduan Pokok Permasalahan',
      colorTheme: 'blue',
      description:
        `Susun 2–3 poin ringkas (maksimal ${currentPaperSize === 'f4' ? '7' : '6'} baris cetak pada ${paperLabel}) yang menjelaskan permasalahan/kegiatan dasar perjalanan dinas, urgensi kehadiran secara langsung, serta dampak apabila kegiatan tidak dilaksanakan.`,
      targetField: 'persoalan',
      templates: [
        {
          title: 'Kegiatan Dasar Penugasan',
          subtitle: 'Dasar kegiatan kedinasan',
          text: 'Pelaksanaan kegiatan resmi di kota tujuan sebagai dasar penugasan kedinasan dalam rangka pemenuhan target program kerja dinas;',
        },
        {
          title: 'Urgensi Kehadiran Langsung',
          subtitle: 'Alasan wajib hadir fisik',
          text: 'Urgensi kehadiran langsung tim dinas di lokasi guna mengawal koordinasi teknis, verifikasi fisik, dan pendampingan terpadu yang tidak dapat digantikan secara daring;',
        },
        {
          title: 'Dampak Jika Tidak Dilaksanakan',
          subtitle: 'Risiko kegagalan capaian',
          text: 'Dampak apabila kegiatan tidak dilaksanakan berpotensi menghambat ketercapaian target kinerja dan menunda pelaporan kedinasan.',
        },
      ],
    });
  };

  const openPraanggapanGuide = () => {
    setActiveGuide({
      isOpen: true,
      title: 'II. Praanggapan',
      subtitle: `2–3 poin: Kondisi jika dilaksanakan/tidak dilaksanakan & dampak penundaan (${limit6Text})`,
      badgeLabel: '💡 Panduan Praanggapan',
      colorTheme: 'purple',
      description:
        `Susun 2–3 poin ringkas (maksimal ${currentPaperSize === 'f4' ? '7' : '6'} baris cetak pada ${paperLabel}) yang menjelaskan kondisi yang diperkirakan bila dilaksanakan, kondisi bila tidak dilaksanakan, serta dampak terhadap pekerjaan/program bila terjadi penundaan.`,
      targetField: 'praanggapan',
      templates: [
        {
          title: 'Kondisi Jika Dilaksanakan',
          subtitle: 'Kinerja optimal tepat waktu',
          text: 'Bahwa apabila perjalanan dinas ini dilaksanakan, koordinasi teknis dan target kinerja program kerja terselesaikan secara optimal dan tepat waktu;',
        },
        {
          title: 'Kondisi Jika Tidak Dilaksanakan',
          subtitle: 'Risiko kendala administrasi',
          text: 'Bahwa apabila perjalanan tidak dilaksanakan, dikhawatirkan timbul kendala sinkronisasi data lapangan dan risiko ketidaksesuaian administrasi;',
        },
        {
          title: 'Dampak Penundaan Program',
          subtitle: 'Terganggunya jadwal kegiatan',
          text: 'Bahwa penundaan perjalanan akan berdampak langsung pada terganggunya jadwal pelaksanaan program kerja dinas Tahun Anggaran berjalan.',
        },
      ],
    });
  };

  const openFaktaGuide = () => {
    setActiveGuide({
      isOpen: true,
      title: 'III. Fakta yang Mempengaruhi',
      subtitle: `2–3 poin: Dasar hukum, fakta waktu/lokasi/personel & anggaran DPA (${limit6Text})`,
      badgeLabel: '💡 Panduan Fakta',
      colorTheme: 'cyan',
      description:
        `Susun 2–3 poin ringkas (maksimal ${currentPaperSize === 'f4' ? '7' : '6'} baris cetak pada ${paperLabel}) yang memuat dasar hukum landasan, fakta kegiatan/lokasi/waktu/personel, serta ketersediaan anggaran belanja pada DPA.`,
      targetField: 'fakta',
      templates: [
        {
          title: 'Dasar Hukum & Landasan',
          subtitle: 'Regulasi & DPA TA 2026',
          text: 'Ketentuan pelaksanaan berlandaskan pada program kerja dan alokasi Dokumen Pelaksanaan Anggaran (DPA) Tahun Anggaran 2026;',
        },
        {
          title: 'Fakta Jadwal & Lokasi Kegiatan',
          subtitle: 'Waktu definitif & tempat',
          text: 'Rangkaian kegiatan dijadwalkan secara definitif pada tanggal pelaksanaan bertempat di lokasi tujuan;',
        },
        {
          title: 'Ketersediaan Anggaran DPA',
          subtitle: 'Pagu belanja mencukupi',
          text: 'Ketersediaan anggaran belanja perjalanan dinas pada DPA TA 2026 pada sub-kegiatan terkait terverifikasi tersedia dan mencukupi.',
        },
      ],
    });
  };

  const openAnalisisGuide = () => {
    setActiveGuide({
      isOpen: true,
      title: 'IV. Analisis dan Pembahasan',
      subtitle: `2–3 poin: Urgensi/efektivitas, kesesuaian personel & efisiensi anggaran (${limit6Text})`,
      badgeLabel: '💡 Panduan Analisis',
      colorTheme: 'rose',
      description:
        `Susun 2–3 poin ringkas (maksimal ${currentPaperSize === 'f4' ? '7' : '6'} baris cetak pada ${paperLabel}) yang mencakup urgensi/efektivitas terhadap target, kesesuaian jumlah/personel & kompetensi, serta efisiensi anggaran dan risiko.`,
      targetField: 'analisis',
      templates: [
        {
          title: 'Urgensi & Efektivitas Target',
          subtitle: 'Manfaat langsung ke sasaran',
          text: 'Bahwa kehadiran langsung memiliki urgensi and efektivitas tinggi dalam memastikan kelancaran agenda serta pencapaian target kegiatan secara akuntabel;',
        },
        {
          title: 'Kesesuaian Personel & Kompetensi',
          subtitle: 'Linearitas beban tugas',
          text: 'Bahwa jumlah dan kompetensi personel yang ditugaskan telah disesuaikan secara proporsional dengan beban tugas dan kebutuhan di lapangan;',
        },
        {
          title: 'Efisiensi Anggaran & Mitigasi Risiko',
          subtitle: 'Rasionalitas biaya',
          text: 'Bahwa alokasi anggaran penugasan telah dirancang efisien dan rasional guna memitigasi risiko hambatan pelaksanaan.',
        },
      ],
    });
  };

  const openKesimpulanGuide = () => {
    setActiveGuide({
      isOpen: true,
      title: 'V. Kesimpulan',
      subtitle: `Maks. 2 poin & ${limit3Text}: Intisari kelayakan & pemenuhan anggaran DPA`,
      badgeLabel: '💡 Panduan Kesimpulan',
      colorTheme: 'emerald',
      description:
        `Susun maksimal 2 poin ringkas dan tegas (maksimal ${currentPaperSize === 'f4' ? '4' : '3'} baris cetak pada ${paperLabel}) yang merangkum bahwa perjalanan dinas dinyatakan layak, mendesak, serta memenuhi seluruh syarat administratif dan alokasi anggaran DPA TA 2026.`,
      targetField: 'kesimpulan',
      templates: [
        {
          title: 'Kelayakan & Urgensi Mendesak',
          subtitle: 'Penegasan kelayakan kegiatan',
          text: 'Pelaksanaan perjalanan dinas ke lokasi tujuan dinilai sangat layak dan mendesak demi kelancaran kegiatan;',
        },
        {
          title: 'Pemenuhan Syarat & Anggaran DPA',
          subtitle: 'Ketersediaan pagu anggaran',
          text: 'Rencana penugasan telah memenuhi syarat administratif kedinasan dan didukung ketersediaan anggaran DPA TA 2026.',
        },
      ],
    });
  };

  const openSaranGuide = () => {
    setActiveGuide({
      isOpen: true,
      title: 'VI. Saran',
      subtitle: 'Tepat 2 poin formal (a & b)',
      badgeLabel: '💡 Panduan Saran',
      colorTheme: 'teal',
      description:
        'Susun tepat 2 butir saran resmi: (1) Penunjukan staf terkait yang berkompeten, serta (2) Permohonan persetujuan & penerbitan SPT dan SPPD bagi personil pelaksana beserta pembebanan anggaran DPA TA 2026.',
      targetField: 'saran',
      templates: [
        {
          title: 'Penunjukan Staf Terkait',
          subtitle: 'Menunjuk personil pelaksana',
          text: 'Menunjuk staf terkait yang berkompeten untuk melaksanakan kegiatan penugasan tersebut;',
        },
        {
          title: 'Penerbitan SPT/SPPD & Beban DPA',
          subtitle: 'Permohonan persetujuan atasan & DPA',
          text: 'Memohon kepada Atasan kiranya berkenan menyetujui serta menerbitkan SPT dan SPPD bagi personil pelaksana kegiatan serta pembebanan anggaran pada DPA TA 2026.',
        },
      ],
    });
  };

  return (
    <div className="space-y-2.5 pb-20 min-h-[calc(100vh-68px)] flex flex-col justify-between">
      {/* UNIFIED TOP CANVA HEADER BAR - SOFT PASTEL THEME MATCHING BERANDA */}
      <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-purple-100/80 shadow-xs flex items-center justify-between gap-1.5 print:hidden">
        {/* Left: Beranda & Section Badge */}
        <div className="flex items-center gap-2">
          {onOpenLauncher && (
            <button
              type="button"
              onClick={onOpenLauncher}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7F56D9] border border-purple-200/60 flex items-center justify-center transition active:scale-95 cursor-pointer touch-manipulation group shrink-0"
              title="Kembali ke Beranda"
            >
              <Home className="w-4.5 h-4.5 text-[#7F56D9] transition" />
            </button>
          )}

          <div className="h-6 w-px bg-purple-100 shrink-0" />

          <div className="flex flex-col items-start px-2 py-0.5 rounded-xl bg-purple-50/50 border border-purple-100/80">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7F56D9] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#7F56D9] leading-tight">Telaah Staf</span>
            </div>
            <span className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">Editor Naskah</span>
          </div>

          <div className="hidden xs:flex flex-col items-start px-2 py-0.5 rounded-xl bg-emerald-50/70 border border-emerald-100/80 animate-pulse">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-[10px] font-extrabold text-emerald-800 leading-tight">Draf Tersimpan</span>
            </div>
            <span className="text-[9px] text-emerald-600/80 font-medium leading-none mt-0.5">Autosave Aktif</span>
          </div>

          <div className="flex items-center bg-purple-50 p-0.5 rounded-xl border border-purple-100 shrink-0 select-none">
            <button
              type="button"
              onClick={() => setPaperSize('a4')}
              className={`px-2 py-1 text-[9.5px] font-extrabold rounded-lg transition-all cursor-pointer ${
                currentPaperSize === 'a4'
                  ? 'bg-[#7F56D9] text-white shadow-2xs'
                  : 'text-purple-700 hover:text-[#7F56D9]'
              }`}
            >
              A4
            </button>
            <button
              type="button"
              onClick={() => setPaperSize('f4')}
              className={`px-2 py-1 text-[9.5px] font-extrabold rounded-lg transition-all cursor-pointer ${
                currentPaperSize === 'f4'
                  ? 'bg-[#7F56D9] text-white shadow-2xs'
                  : 'text-purple-700 hover:text-[#7F56D9]'
              }`}
            >
              F4
            </button>
          </div>
        </div>

        {/* Right: Soft Pastel Tools */}
        <div className="flex items-center gap-1.5">
          {onOpenPreview && (
            <button
              type="button"
              onClick={onOpenPreview}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white flex items-center gap-1.5 justify-center transition active:scale-95 cursor-pointer touch-manipulation shrink-0 shadow-xs shadow-purple-500/20"
              title="Pratinjau Lembar A4"
            >
              <Eye className="w-4 h-4 text-white" />
              <span className="text-[10.5px] font-extrabold leading-none">Pratinjau A4</span>
            </button>
          )}
        </div>
      </div>

      {/* REAL-TIME NASKAH COMPLETENESS INDICATOR CARD */}
      <div className="bg-white rounded-2xl border border-purple-100/90 p-3 sm:p-4 shadow-2xs space-y-2.5 print:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
              <BadgeCheck className="w-4.5 h-4.5 text-[#7F56D9]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Kelengkapan Naskah Dinas</h4>
              <p className="text-[9.5px] text-slate-400 font-medium">Kalibrasi presisi sesuai standar naskah dinas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCompletenessDetails(!showCompletenessDetails)}
            className="px-2.5 py-1 bg-purple-50/50 hover:bg-[#7F56D9]/10 text-[#7F56D9] rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1 border border-purple-100"
          >
            <span>{showCompletenessDetails ? 'Sembunyikan' : 'Lihat Detail'}</span>
            {showCompletenessDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Progress Bar Row */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-600">Tingkat Penyusunan Dokumen</span>
            <span className={`font-mono font-black ${completionPercentage === 100 ? 'text-emerald-600' : 'text-[#7F56D9]'}`}>
              {completionPercentage}% {completionPercentage === 100 ? '✓ Lengkap' : ''}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-100/50">
            <div
              className="h-full bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-emerald-500 rounded-full transition-all duration-500 animate-pulse"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Expandable Checklist Details */}
        {showCompletenessDetails && (
          <div className="pt-2.5 border-t border-purple-50 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 animate-in slide-in-from-top-1 duration-150">
            {checkList.map((item, idx) => (
              <div
                key={idx}
                className={`p-1.5 rounded-xl border text-[9.5px] font-bold flex items-center gap-1.5 transition ${
                  item.done
                    ? 'bg-emerald-50/60 text-emerald-800 border-emerald-100/80 shadow-3xs'
                    : 'bg-slate-50 text-slate-400 border-slate-200/60'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${item.done ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* =========================================================================
          STEP 1: ATRIBUT & DASAR HUKUM
          - Seksi 1: Kepala Surat / Atribut Naskah
          - Seksi 2: I. Persoalan (Dasar Regulasi & Landasan Hukum)
          - Seksi 3: II. Praanggapan (Pijakan Berpikir Objektif)
         ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-2.5 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
          {/* KEPALA NASKAH SURAT */}
          <div
            className={`bg-white rounded-2xl border p-3.5 sm:p-4 shadow-2xs transition ${
              isHeaderDone
                ? 'border-l-4 border-l-[#7F56D9] border-slate-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-indigo-100/80 text-indigo-700 rounded-lg">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  Kepala Naskah
                  {isHeaderDone && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </h3>
              </div>
              <span className="text-[10.5px] text-slate-400 font-medium">Step 1 dari 4</span>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Yth.
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateHeader('yth', 'Plt. Kepala Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara;')}
                        className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-md text-[9px] text-[#7F56D9] font-bold transition cursor-pointer"
                      >
                        + Kadis
                      </button>
                      <button
                        type="button"
                        onClick={() => updateHeader('yth', 'Sekretaris Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara;')}
                        className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-md text-[9px] text-[#7F56D9] font-bold transition cursor-pointer"
                      >
                        + Sekdis
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={data.header.yth}
                    onChange={(e) => updateHeader('yth', e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                    placeholder="Plt. Kepala Dinas Pendidikan dan Kebudayaan;"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Dari
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateHeader('dari', 'Pejabat Pelaksana Teknis Kegiatan (PPTK) Bidang Pembinaan SMA;')}
                        className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-md text-[9px] text-[#7F56D9] font-bold transition cursor-pointer"
                      >
                        + PPTK SMA
                      </button>
                      <button
                        type="button"
                        onClick={() => updateHeader('dari', 'Kepala Seksi Kurikulum Bidang Pembinaan SMA;')}
                        className="px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-md text-[9px] text-[#7F56D9] font-bold transition cursor-pointer"
                      >
                        + Kasi SMA
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={data.header.dari}
                    onChange={(e) => updateHeader('dari', e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                    placeholder="Pejabat Pelaksana Teknis Kegiatan (PPTK);"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <AdvancedDatePicker
                    label="Tanggal"
                    value={data.header.tanggalSurat}
                    onChange={(formatted) => updateHeader('tanggalSurat', formatted)}
                    placeholder="10 Agustus 2026"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Nomor Surat
                  </label>
                  <input
                    type="text"
                    value={data.header.nomorSurat}
                    onChange={(e) => updateHeader('nomorSurat', e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                    placeholder="400.3.8/ 9548 /Disdikbud/KU/VIII/2026"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Lampiran
                  </label>
                  <input
                    type="text"
                    value={data.header.lampiran}
                    onChange={(e) => updateHeader('lampiran', e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    placeholder="-"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Hal / Perihal Perjalanan Dinas
                  </label>
                  <button
                    type="button"
                    onClick={() => startVoiceDictation('hal')}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      isDictating && dictatingField?.section === 'hal'
                        ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                        : 'text-[#7F56D9] bg-purple-50 border-purple-100 hover:bg-purple-100/50'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>Dikte Suara</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={data.header.hal}
                  onChange={(e) => updateHeader('hal', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed font-medium"
                  placeholder="Melaksanakan Kegiatan Semifinal Olimpiade Sains Nasional (OSN)..."
                />
              </div>
            </div>
          </div>

          {/* I. POKOK PERMASALAHAN */}
          <div
            className={`bg-white rounded-2xl border p-3.5 sm:p-4 shadow-2xs transition ${
              isPersoalanDone
                ? 'border-l-4 border-l-[#7F56D9] border-slate-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5 gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 bg-blue-100/80 text-blue-800 rounded-lg shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    I. Pokok Permasalahan
                    {isPersoalanDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {revisingSection === 'persoalan' ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg animate-pulse border border-emerald-100">
                    <Sparkles className="w-3 h-3 animate-spin text-emerald-600" />
                    Revisi...
                  </span>
                ) : activeInstructionSection === 'persoalan' ? (
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={revisionInstructions}
                      onChange={(e) => setRevisionInstructions(e.target.value)}
                      placeholder="Instruksi AI..."
                      className="px-2 py-0.5 text-xs border-0 bg-transparent focus:outline-none w-32 sm:w-40 font-medium text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleReviseAi('persoalan')}
                      className="px-2 py-0.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                    >
                      Mulai
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInstructionSection(null)}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInstructionSection('persoalan');
                      setRevisionInstructions('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-1 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Revisi AI</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => startVoiceDictation('persoalan')}
                  className={`p-1.5 rounded-xl border transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer ${
                    isDictating && dictatingField?.section === 'persoalan'
                      ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse font-bold'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200/70'
                  }`}
                  title="Dikte Suara (Voice-to-Text)"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dikte</span>
                </button>

                <button
                  type="button"
                  onClick={openPersoalanGuide}
                  className="p-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200/70 transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer px-2"
                  title="Buka panduan & template"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Panduan</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <textarea
                rows={3}
                value={
                  Array.isArray(data.persoalan)
                    ? data.persoalan.join('\n')
                    : data.persoalan || ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const lines = val.split('\n');
                  onChange({ ...data, persoalan: lines });
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-sans leading-relaxed transition"
                placeholder="Ketik butir permasalahan (Enter untuk poin baru)..."
              />
              <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-0.5 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                  <span>{(Array.isArray(data.persoalan) ? data.persoalan.filter((s) => s.trim()).length : 0)} poin terisi</span>
                  <span>•</span>
                  <span>Standar: 3 Poin Bernas</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFormalizer({ section: 'persoalan' })}
                  className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-[#7F56D9] text-[10px] font-bold rounded-lg flex items-center gap-1 transition cursor-pointer border border-purple-100 active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-[#7F56D9]" />
                  <span>🪄 Penyelaras Birokrasi</span>
                </button>
              </div>
            </div>
          </div>

          {/* II. PRAANGGAPAN */}
          <div
            className={`bg-white rounded-2xl border p-3.5 sm:p-4 shadow-2xs transition ${
              isPraanggapanDone
                ? 'border-l-4 border-l-[#7F56D9] border-slate-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5 gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 bg-purple-100/80 text-purple-800 rounded-lg shrink-0">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    II. Praanggapan
                    {isPraanggapanDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {revisingSection === 'praanggapan' ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg animate-pulse border border-emerald-100">
                    <Sparkles className="w-3 h-3 animate-spin text-emerald-600" />
                    Revisi...
                  </span>
                ) : activeInstructionSection === 'praanggapan' ? (
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={revisionInstructions}
                      onChange={(e) => setRevisionInstructions(e.target.value)}
                      placeholder="Instruksi AI..."
                      className="px-2 py-0.5 text-xs border-0 bg-transparent focus:outline-none w-32 sm:w-40 font-medium text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleReviseAi('praanggapan')}
                      className="px-2 py-0.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                    >
                      Mulai
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInstructionSection(null)}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInstructionSection('praanggapan');
                      setRevisionInstructions('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-1 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Revisi AI</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => startVoiceDictation('praanggapan')}
                  className={`p-1.5 rounded-xl border transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer ${
                    isDictating && dictatingField?.section === 'praanggapan'
                      ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse font-bold'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200/70'
                  }`}
                  title="Dikte Suara (Voice-to-Text)"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dikte</span>
                </button>

                <button
                  type="button"
                  onClick={openPraanggapanGuide}
                  className="p-1 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200/70 transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer px-2"
                  title="Buka panduan & template"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                  <span className="hidden sm:inline">Panduan</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <textarea
                rows={3}
                value={
                  Array.isArray(data.praanggapan)
                    ? data.praanggapan.join('\n')
                    : data.praanggapan || ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const lines = val.split('\n');
                  onChange({ ...data, praanggapan: lines });
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-sans leading-relaxed transition"
                placeholder="Ketik uraian butir praanggapan (Enter untuk poin baru)..."
              />
              <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-0.5 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                  <span>{(Array.isArray(data.praanggapan) ? data.praanggapan.filter((s) => s.trim()).length : 0)} poin terisi</span>
                  <span>•</span>
                  <span>Standar: 3 Poin Bernas</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFormalizer({ section: 'praanggapan' })}
                  className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-[#7F56D9] text-[10px] font-bold rounded-lg flex items-center gap-1 transition cursor-pointer border border-purple-100 active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-[#7F56D9]" />
                  <span>🪄 Penyelaras Birokrasi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Button: Proceed to Step 2 */}
          <div className="mt-auto pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-purple-50/40 border border-purple-200/95 hover:bg-purple-100/60 text-[#7F56D9] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer touch-manipulation"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: FAKTA & ANALISIS
          - Seksi 4: III. Fakta-Fakta yang Mempengaruhi
          - Seksi 5: IV. Analisis (Rasionalisasi Teknis & Efisiensi)
         ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-2.5 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
          {/* III. FAKTA YANG MEMPENGARUHI */}
          <div
            className={`bg-white rounded-2xl border p-3.5 sm:p-4 shadow-2xs transition ${
              isFaktaDone
                ? 'border-l-4 border-l-[#7F56D9] border-slate-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5 gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 bg-cyan-100/80 text-cyan-800 rounded-lg shrink-0">
                  <ListOrdered className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    III. Fakta yang Mempengaruhi
                    {isFaktaDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {revisingSection === 'fakta' ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg animate-pulse border border-emerald-100">
                    <Sparkles className="w-3 h-3 animate-spin text-emerald-600" />
                    Revisi...
                  </span>
                ) : activeInstructionSection === 'fakta' ? (
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={revisionInstructions}
                      onChange={(e) => setRevisionInstructions(e.target.value)}
                      placeholder="Instruksi AI..."
                      className="px-2 py-0.5 text-xs border-0 bg-transparent focus:outline-none w-32 sm:w-40 font-medium text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleReviseAi('fakta')}
                      className="px-2 py-0.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                    >
                      Mulai
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInstructionSection(null)}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInstructionSection('fakta');
                      setRevisionInstructions('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-1 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Revisi AI</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => startVoiceDictation('fakta')}
                  className={`p-1.5 rounded-xl border transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer ${
                    isDictating && dictatingField?.section === 'fakta'
                      ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse font-bold'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200/70'
                  }`}
                  title="Dikte Suara (Voice-to-Text)"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dikte</span>
                </button>

                <button
                  type="button"
                  onClick={openFaktaGuide}
                  className="p-1 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-xl border border-cyan-200/70 transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer px-2"
                  title="Buka panduan & template"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="hidden sm:inline">Panduan</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <textarea
                rows={3}
                value={
                  Array.isArray(data.fakta)
                    ? data.fakta.join('\n')
                    : data.fakta || ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const lines = val.split('\n');
                  onChange({ ...data, fakta: lines });
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-sans leading-relaxed transition"
                placeholder="Ketik butir fakta riil (Enter untuk poin baru)..."
              />
              <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-0.5 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                  <span>{(Array.isArray(data.fakta) ? data.fakta.filter((s) => s.trim()).length : 0)} poin terisi</span>
                  <span>•</span>
                  <span>Standar: 3 Poin Bernas</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFormalizer({ section: 'fakta' })}
                  className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-[#7F56D9] text-[10px] font-bold rounded-lg flex items-center gap-1 transition cursor-pointer border border-purple-100 active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-[#7F56D9]" />
                  <span>🪄 Penyelaras Birokrasi</span>
                </button>
              </div>
            </div>
          </div>

          {/* IV. ANALISIS DAN PEMBAHASAN */}
          <div
            className={`bg-white rounded-2xl border p-3.5 sm:p-4 shadow-2xs transition ${
              isAnalisisDone
                ? 'border-l-4 border-l-[#7F56D9] border-slate-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5 gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 bg-rose-100/80 text-rose-800 rounded-lg shrink-0">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    IV. Analisis dan Pembahasan
                    {isAnalisisDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {revisingSection === 'analisis' ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg animate-pulse border border-emerald-100">
                    <Sparkles className="w-3 h-3 animate-spin text-emerald-600" />
                    Revisi...
                  </span>
                ) : activeInstructionSection === 'analisis' ? (
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={revisionInstructions}
                      onChange={(e) => setRevisionInstructions(e.target.value)}
                      placeholder="Instruksi AI..."
                      className="px-2 py-0.5 text-xs border-0 bg-transparent focus:outline-none w-32 sm:w-40 font-medium text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleReviseAi('analisis')}
                      className="px-2 py-0.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                    >
                      Mulai
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInstructionSection(null)}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInstructionSection('analisis');
                      setRevisionInstructions('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-1 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Revisi AI</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => startVoiceDictation('analisis')}
                  className={`p-1.5 rounded-xl border transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer ${
                    isDictating && dictatingField?.section === 'analisis'
                      ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse font-bold'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200/70'
                  }`}
                  title="Dikte Suara (Voice-to-Text)"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dikte</span>
                </button>

                <button
                  type="button"
                  onClick={openAnalisisGuide}
                  className="p-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200/70 transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer px-2"
                  title="Buka panduan & template"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Panduan</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <textarea
                rows={3}
                value={
                  Array.isArray(data.analisis)
                    ? data.analisis.join('\n')
                    : data.analisis || ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const lines = val.split('\n');
                  onChange({ ...data, analisis: lines });
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-sans leading-relaxed transition"
                placeholder="Ketik butir analisis rasionalisasi (Enter untuk poin baru)..."
              />
              <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-0.5 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                  <span>{(Array.isArray(data.analisis) ? data.analisis.filter((s) => s.trim()).length : 0)} poin terisi</span>
                  <span>•</span>
                  <span>Standar: 3 Poin Bernas</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFormalizer({ section: 'analisis' })}
                  className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-[#7F56D9] text-[10px] font-bold rounded-lg flex items-center gap-1 transition cursor-pointer border border-purple-100 active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-[#7F56D9]" />
                  <span>🪄 Penyelaras Birokrasi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: Back & Proceed to Step 3 */}
          <div className="mt-auto pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-slate-50 border border-slate-200/90 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-purple-50/40 border border-purple-200/95 hover:bg-purple-100/60 text-[#7F56D9] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer touch-manipulation"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: TIM & ANGGARAN
          - Seksi 6: V. Kesimpulan (Daftar Personil & Jadwal Penugasan)
          - Seksi 7: VI. Saran & Pembebanan Anggaran (DPA)
         ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-2.5 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
          {/* V. KESIMPULAN */}
          <div
            className={`bg-white rounded-2xl border p-3.5 sm:p-4 shadow-2xs transition ${
              isKesimpulanDone
                ? 'border-l-4 border-l-[#7F56D9] border-slate-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5 gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 bg-emerald-100/80 text-emerald-800 rounded-lg shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    V. Kesimpulan
                    {isKesimpulanDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {revisingSection === 'kesimpulan' ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg animate-pulse border border-emerald-100">
                    <Sparkles className="w-3 h-3 animate-spin text-emerald-600" />
                    Revisi...
                  </span>
                ) : activeInstructionSection === 'kesimpulan' ? (
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={revisionInstructions}
                      onChange={(e) => setRevisionInstructions(e.target.value)}
                      placeholder="Instruksi AI..."
                      className="px-2 py-0.5 text-xs border-0 bg-transparent focus:outline-none w-32 sm:w-40 font-medium text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleReviseAi('kesimpulan')}
                      className="px-2 py-0.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                    >
                      Mulai
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInstructionSection(null)}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInstructionSection('kesimpulan');
                      setRevisionInstructions('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-1 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Revisi AI</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openKesimpulanGuide}
                  className="p-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200/70 transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer px-2"
                  title="Buka panduan & template"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Panduan</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <textarea
                rows={2}
                value={
                  data.kesimpulan.poin && data.kesimpulan.poin.length > 0
                    ? data.kesimpulan.poin.join('\n')
                    : data.kesimpulan.ringkasan || ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const lines = val.split('\n');
                  onChange({
                    ...data,
                    kesimpulan: {
                      ...data.kesimpulan,
                      poin: lines,
                      ringkasan: lines.filter(s => s.trim()).join(' '),
                    },
                  });
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed font-sans transition"
                placeholder="Ketik butir kesimpulan (Maksimal 2 poin)..."
              />
              <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-0.5 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                  <span>{(data.kesimpulan.poin && data.kesimpulan.poin.length > 0 ? data.kesimpulan.poin.filter(s => s.trim()).length : (data.kesimpulan.ringkasan ? 1 : 0))} poin terisi</span>
                  <span>•</span>
                  <span>Standar: Maks. 2 Poin</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFormalizer({ section: 'kesimpulan' })}
                  className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-[#7F56D9] text-[10px] font-bold rounded-lg flex items-center gap-1 transition cursor-pointer border border-purple-100 active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-[#7F56D9]" />
                  <span>🪄 Penyelaras Birokrasi</span>
                </button>
              </div>
            </div>
          </div>

          {/* VI. SARAN & RINCIAN PENUGASAN */}
          <div
            className={`bg-white rounded-2xl border p-3.5 sm:p-4 shadow-2xs transition ${
              isSaranDone
                ? 'border-l-4 border-l-[#7F56D9] border-slate-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5 gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    VI. Saran
                    {isSaranDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {revisingSection === 'saran' ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg animate-pulse border border-emerald-100">
                    <Sparkles className="w-3 h-3 animate-spin text-emerald-600" />
                    Revisi...
                  </span>
                ) : activeInstructionSection === 'saran' ? (
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={revisionInstructions}
                      onChange={(e) => setRevisionInstructions(e.target.value)}
                      placeholder="Instruksi AI..."
                      className="px-2 py-0.5 text-xs border-0 bg-transparent focus:outline-none w-32 sm:w-40 font-medium text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleReviseAi('saran')}
                      className="px-2 py-0.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                    >
                      Mulai
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInstructionSection(null)}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInstructionSection('saran');
                      setRevisionInstructions('');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-1 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Revisi AI</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => startVoiceDictation('saran')}
                  className={`p-1.5 rounded-xl border transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer ${
                    isDictating && dictatingField?.section === 'saran'
                      ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse font-bold'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200/70'
                  }`}
                  title="Dikte Suara (Voice-to-Text)"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dikte</span>
                </button>

                <button
                  type="button"
                  onClick={openSaranGuide}
                  className="p-1 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200/70 transition flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer px-2"
                  title="Buka panduan & template"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden sm:inline">Panduan</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddPersonil}
                  className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300/80 flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Pegawai</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <textarea
                  rows={2}
                  value={
                    Array.isArray(data.saran)
                      ? data.saran.join('\n')
                      : data.saran || ''
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const lines = val.split('\n');
                    onChange({ ...data, saran: lines });
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-sans leading-relaxed transition"
                  placeholder="Ketik butir saran (Tepat 2 poin)..."
                />
                <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-0.5 mt-1 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                    <span>{(Array.isArray(data.saran) ? data.saran.filter((s) => s.trim()).length : 0)} poin terisi</span>
                    <span>•</span>
                    <span>Standar: Tepat 2 Poin</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveFormalizer({ section: 'saran' })}
                    className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-[#7F56D9] text-[10px] font-bold rounded-lg flex items-center gap-1 transition cursor-pointer border border-purple-100 active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-[#7F56D9]" />
                    <span>🪄 Penyelaras Birokrasi</span>
                  </button>
                </div>
              </div>

              {/* Personil Cards */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Daftar Pegawai yang Ditugaskan
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPersonil}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Pegawai
                  </button>
                </div>

                {data.kesimpulan.personil.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-2.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10.5px]">
                          {idx + 1}
                        </span>
                        Pegawai #{idx + 1}
                      </span>
                      {data.kesimpulan.personil.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePersonil(idx)}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Nama Lengkap &amp; Gelar
                        </label>
                        <input
                          type="text"
                          value={p.nama}
                          onChange={(e) =>
                            handleUpdatePersonil(idx, 'nama', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-semibold"
                          placeholder="Weni Noviana"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          NIP
                        </label>
                        <input
                          type="text"
                          value={p.nip}
                          onChange={(e) =>
                            handleUpdatePersonil(idx, 'nip', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                          placeholder="199311022018022001"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Pangkat / Golongan
                        </label>
                        <input
                          type="text"
                          value={p.pangkatGol}
                          onChange={(e) =>
                            handleUpdatePersonil(idx, 'pangkatGol', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          placeholder="Penata / IIIc"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Jabatan
                        </label>
                        <input
                          type="text"
                          value={p.jabatan}
                          onChange={(e) =>
                            handleUpdatePersonil(idx, 'jabatan', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          placeholder="Penelaah Teknis Kebijakan"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Jadwal & Lokasi / Perjalanan Dinas */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Rincian Perjalanan Dinas
                </label>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Maksud Perjalanan Dinas
                  </label>
                  <textarea
                    rows={2}
                    value={data.kesimpulan.maksudPerjalanan ?? data.header.hal}
                    onChange={(e) => updateKesimpulan('maksudPerjalanan', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed font-medium"
                    placeholder="Maksud kegiatan perjalanan dinas..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Tempat Berangkat
                    </label>
                    <input
                      type="text"
                      value={data.kesimpulan.tempatBerangkat ?? 'Tanjung Selor'}
                      onChange={(e) => updateKesimpulan('tempatBerangkat', e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      placeholder="Tanjung Selor"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Tempat Tujuan
                    </label>
                    <input
                      type="text"
                      value={data.kesimpulan.tempatTujuan ?? data.kesimpulan.tempat ?? ''}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          kesimpulan: {
                            ...data.kesimpulan,
                            tempatTujuan: e.target.value,
                            tempat: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      placeholder="Hotel Diamond Tarakan"
                    />
                  </div>

                  <div>
                    <AdvancedDatePicker
                      label="Tanggal Berangkat"
                      value={data.kesimpulan.tanggalBerangkat ?? ''}
                      onChange={(formatted) => {
                        const tglKembali = data.kesimpulan.tanggalKembali || '';
                        const dur = calculateDurationString(formatted, tglKembali);
                        onChange({
                          ...data,
                          kesimpulan: {
                            ...data.kesimpulan,
                            tanggalBerangkat: formatted,
                            tanggal: formatted,
                            ...(dur ? { lamanyaPerjalanan: dur, selama: dur } : {}),
                          },
                        });
                      }}
                      placeholder="11 Agustus 2026"
                    />
                  </div>

                  <div>
                    <AdvancedDatePicker
                      label="Tanggal Kembali"
                      value={data.kesimpulan.tanggalKembali ?? ''}
                      onChange={(formatted) => {
                        const tglBerangkat = data.kesimpulan.tanggalBerangkat || '';
                        const dur = calculateDurationString(tglBerangkat, formatted);
                        onChange({
                          ...data,
                          kesimpulan: {
                            ...data.kesimpulan,
                            tanggalKembali: formatted,
                            ...(dur ? { lamanyaPerjalanan: dur, selama: dur } : {}),
                          },
                        });
                      }}
                      placeholder="13 Agustus 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      Lamanya Perjalanan
                    </label>
                    <input
                      type="text"
                      value={data.kesimpulan.lamanyaPerjalanan ?? data.kesimpulan.selama ?? ''}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          kesimpulan: {
                            ...data.kesimpulan,
                            lamanyaPerjalanan: e.target.value,
                            selama: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      placeholder="5 (lima) hari"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      Pembebanan Anggaran
                    </label>
                    <input
                      type="text"
                      value={data.kesimpulan.pembebananAnggaran ?? ''}
                      onChange={(e) => updateKesimpulan('pembebananAnggaran', e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      placeholder="DPA Satuan Kerja Tahun Anggaran Berjalan"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Back & Proceed to Step 4 */}
          <div className="mt-auto pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-slate-50 border border-slate-200/90 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentStep(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-purple-50/40 border border-purple-200/95 hover:bg-purple-100/60 text-[#7F56D9] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer touch-manipulation"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 4: PENGESAHAN & TTE
          - Seksi 8: Kaki Naskah & Tanda Tangan Pembuat (PPTK)
          - Info Disposisi Fisik Pimpinan
          - Review Status Kelayakan & Shortcut ke Pratinjau A4
         ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-2.5 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
          {/* KAKI NASKAH & TANDA TANGAN PEMBUAT */}
          <div
            className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition ${
              isKakiDone
                ? 'border-l-4 border-l-[#7F56D9] border-slate-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-100/80 text-emerald-800 rounded-lg">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Kaki Naskah (Penandatangan)
                    {isKakiDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {data.kaki.namaPembuat} ({data.kaki.jabatanPembuat})
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat &amp; Tanggal
                  </label>
                  <input
                    type="text"
                    value={data.kaki.tempatTanggal}
                    onChange={(e) => updateKaki('tempatTanggal', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    placeholder="Tanjung Selor, 10 Agustus 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan Penandatangan
                  </label>
                  <input
                    type="text"
                    value={data.kaki.jabatanPembuat}
                    onChange={(e) => updateKaki('jabatanPembuat', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-semibold"
                    placeholder="PPTK,"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap &amp; Gelar
                  </label>
                  <input
                    type="text"
                    value={data.kaki.namaPembuat}
                    onChange={(e) => updateKaki('namaPembuat', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-bold"
                    placeholder="Bayu Ramadhan, S.Kom."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pangkat / Golongan
                  </label>
                  <input
                    type="text"
                    value={data.kaki.pangkatPembuat}
                    onChange={(e) => updateKaki('pangkatPembuat', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    placeholder="Penata / III-c"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP
                  </label>
                  <input
                    type="text"
                    value={data.kaki.nipPembuat}
                    onChange={(e) => updateKaki('nipPembuat', formatNipBkn(e.target.value))}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                    placeholder="19830707 201503 1 002"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Back & Finish */}
          {onOpenPreview && (
            <div className="mt-auto pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-slate-50 border border-slate-200/90 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer touch-manipulation"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={onOpenPreview}
                className="px-6 py-2.5 bg-emerald-50/40 border border-emerald-200 hover:bg-emerald-100/60 text-emerald-800 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer touch-manipulation"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Selesai &amp; Buka Pratinjau A4</span>
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          6. SOFT CANVA PASTELS TAB BAR (PERMANENT OPTION C)
         ========================================================================= */}
      <nav
        aria-label="Navigasi Tahapan Utama Editor"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-purple-100 px-3 py-2.5 flex items-center justify-around shadow-lg print:hidden select-none max-w-xl mx-auto rounded-t-2xl"
      >
        {/* 1. Naskah (Step 1) */}
        <button
          type="button"
          onClick={() => {
            setCurrentStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition cursor-pointer active:scale-95 touch-manipulation mx-1 rounded-xl ${
            currentStep === 1
              ? 'text-[#7F56D9] font-bold bg-purple-50/80 border border-purple-100/50'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Bab I & II: Atribut & Pokok Permasalahan"
        >
          <FileText className={`w-5 h-5 ${currentStep === 1 ? 'stroke-[2.5] text-[#7F56D9]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-extrabold">Naskah</span>
        </button>

        {/* 2. Kajian (Step 2) */}
        <button
          type="button"
          onClick={() => {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition cursor-pointer active:scale-95 touch-manipulation mx-1 rounded-xl ${
            currentStep === 2
              ? 'text-[#7F56D9] font-bold bg-purple-50/80 border border-purple-100/50'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Bab III & IV: Fakta Lapangan & Kajian Kebijakan"
        >
          <SearchCheck className={`w-5 h-5 ${currentStep === 2 ? 'stroke-[2.5] text-[#7F56D9]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-extrabold">Kajian</span>
        </button>

        {/* 3. Pelaksana (Step 3) */}
        <button
          type="button"
          onClick={() => {
            setCurrentStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition cursor-pointer active:scale-95 touch-manipulation mx-1 rounded-xl ${
            currentStep === 3
              ? 'text-[#7F56D9] font-bold bg-purple-50/80 border border-purple-100/50'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Bab V & VI: Tim Pelaksana, SPPD & DPA"
        >
          <Users className={`w-5 h-5 ${currentStep === 3 ? 'stroke-[2.5] text-[#7F56D9]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-extrabold">Pelaksana</span>
        </button>

        {/* 4. Pengesahan (Step 4) */}
        <button
          type="button"
          onClick={() => {
            setCurrentStep(4);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition cursor-pointer active:scale-95 touch-manipulation mx-1 rounded-xl ${
            currentStep === 4
              ? 'text-[#7F56D9] font-bold bg-purple-50/80 border border-purple-100/50'
              : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Tahap 4: Pengesahan & TTE Digital"
        >
          <CheckCircle2 className={`w-5 h-5 ${currentStep === 4 ? 'stroke-[2.5] text-[#7F56D9]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-extrabold">Pengesahan</span>
        </button>
      </nav>

      {/* 6. CONTEXTUAL GUIDE BOTTOM SHEET (PANEL MELAYANG) */}
      <GuideBottomSheet
        isOpen={activeGuide.isOpen}
        onClose={() => setActiveGuide((prev) => ({ ...prev, isOpen: false }))}
        title={activeGuide.title}
        subtitle={activeGuide.subtitle}
        description={activeGuide.description}
        badgeLabel={activeGuide.badgeLabel}
        colorTheme={activeGuide.colorTheme}
        templates={activeGuide.templates}
        onSelectTemplate={(text) => {
          if (activeGuide.targetField) {
            handleAppendListItem(activeGuide.targetField, text);
          }
        }}
      />

      {activeFormalizer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] max-w-md w-full p-5 border border-purple-100 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
                  <Sparkles className="w-4 h-4 text-[#7F56D9]" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  Penyelaras Kalimat Birokrasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveFormalizer(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-normal bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/50">
              Pilih kalimat baku formal dengan struktur naskah dinas resmi di bawah ini untuk diselaraskan ke dalam rancangan Anda secara instan:
            </p>

            {/* Suggestion list */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {FORMALIZER_SUGGESTIONS[activeFormalizer.section].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-[#7F56D9] text-xs font-semibold text-slate-700 border border-slate-100 hover:border-purple-200 transition cursor-pointer leading-normal active:scale-[0.99] flex items-start gap-2"
                >
                  <span className="text-[#7F56D9] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveFormalizer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold rounded-full transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
