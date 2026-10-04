import { TelaahanStafData } from '../types';

export interface GenerateTelaahParams {
  prompt?: string;
  tema?: string;
  tujuan?: string;
  tanggal?: string;
  durasi?: string;
  deskripsi?: string;
  instansi?: string;
  suratUndangan?: string;
  paguAnggaran?: string;
  targetOutput?: string;
  personilInfo?: string;
}

export interface GeneratedTelaahResult {
  hal: string;
  persoalan: string[];
  praanggapan: string[];
  fakta: string[];
  analisisIntro: string;
  analisis: string[];
  kesimpulan: {
    poin?: string[];
    ringkasan: string;
    intro: string;
    kegiatanIntro: string;
    tempat: string;
    selama: string;
    tanggal: string;
  };
  saran: string[];
}

// Helper: Clean perihal (hal) from duplicate or redundant destination strings
function cleanGenerateHal(theme: string, destination: string): string {
  const safeTheme = theme.trim();
  const safeDest = destination.trim();
  
  const isGenericDest = !safeDest || ["kota tujuan", "tujuan", "tempat tujuan"].includes(safeDest.toLowerCase());
  const hasDiInTheme = /\bdi\s+[a-zA-Z]/i.test(safeTheme);
  const cleanDestName = safeDest.toLowerCase().replace(/^(kota|kabupaten)\s+/i, "").trim();
  const themeContainsDest = cleanDestName && safeTheme.toLowerCase().includes(cleanDestName);
  
  if (themeContainsDest || (isGenericDest && hasDiInTheme) || isGenericDest) {
    return `Melaksanakan Perjalanan Dinas Dalam Rangka ${safeTheme}`;
  }
  
  return `Melaksanakan Perjalanan Dinas Dalam Rangka ${safeTheme} di ${safeDest}`;
}

/**
 * Intelligent contextual generator for Telaahan Staf naskah dinas
 * Strictly follows official Indonesian Government Bureaucracy Standard
 * Output is constrained to 2-3 points and max 6 printed lines per sub-section.
 */
export function generateLocalTelaah(params: GenerateTelaahParams): GeneratedTelaahResult {
  const inputText = (params.prompt || params.tema || '').trim();

  // 1. Detect City / Destination
  let inferredTujuan = params.tujuan?.trim() || '';
  if (!inferredTujuan && inputText) {
    const cityMatches = [
      'Tarakan', 'Bulungan', 'Tanjung Selor', 'Nunukan', 'Malinau', 'Tana Tidung', 'Tideng Pale',
      'Jakarta', 'Jakarta Pusat', 'Jakarta Selatan', 'Samarinda', 'Balikpapan',
      'Surabaya', 'Yogyakarta', 'Bandung', 'Makassar', 'Denpasar', 'Pontianak', 'Banjarmasin'
    ];
    for (const city of cityMatches) {
      if (new RegExp(`\\b${city}\\b`, 'i').test(inputText)) {
        inferredTujuan = city.includes('Kota') || city.includes('Kabupaten') ? city : `Kota ${city}`;
        break;
      }
    }
  }
  if (!inferredTujuan) inferredTujuan = 'Kota Tarakan';

  // 2. Detect Duration (ONLY if explicitly mentioned)
  let inferredDurasi = params.durasi?.trim() || '';
  let hasExplicitDurasi = Boolean(inferredDurasi);
  if (!inferredDurasi && inputText) {
    const durasiMatch = inputText.match(/(\d+)\s*(?:hari|hr)/i);
    if (durasiMatch) {
      const dNum = durasiMatch[1];
      const numWords: Record<string, string> = {
        '1': 'satu', '2': 'dua', '3': 'tiga', '4': 'empat',
        '5': 'lima', '6': 'enam', '7': 'tujuh', '8': 'delapan'
      };
      inferredDurasi = `${dNum} (${numWords[dNum] || dNum}) hari`;
      hasExplicitDurasi = true;
    }
  }

  // 3. Detect Personnel (ONLY if explicitly mentioned)
  let inferredPersonil = params.personilInfo?.trim() || '';
  if (!inferredPersonil && inputText) {
    const personilMatch = inputText.match(/(\d+)\s*(?:orang|staf|pegawai|personil)/i);
    if (personilMatch) {
      const pNum = personilMatch[1];
      const numWords: Record<string, string> = {
        '1': 'satu', '2': 'dua', '3': 'tiga', '4': 'empat', '5': 'lima'
      };
      inferredPersonil = `${pNum} (${numWords[pNum] || pNum}) orang personil`;
    }
  }

  // 4. Detect Dates
  let inferredTanggal = params.tanggal?.trim() || '';
  if (!inferredTanggal && inputText) {
    const tglMatch =
      inputText.match(/tanggal\s+([^\,\.]+)/i) ||
      inputText.match(/tgl\s+([^\,\.]+)/i) ||
      inputText.match(/\d{1,2}\s*(?:s\.?d\.?|-)\s*\d{1,2}\s+[a-zA-Z]+\s+\d{4}/i) ||
      inputText.match(/\d{1,2}\s+[a-zA-Z]+\s+\d{4}/i);
    if (tglMatch) {
      inferredTanggal = tglMatch[0].replace(/^tanggal\s+/i, '').replace(/^tgl\s+/i, '');
    }
  }
  if (!inferredTanggal) inferredTanggal = 'Sesuai Jadwal TA 2026';

  // 5. Clean up subject and organization
  const safeTema = params.tema?.trim() || inputText || 'Kegiatan Dinas';
  const safeInstansi = params.instansi?.trim() || 'Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara';
  const safeUndangan = params.suratUndangan?.trim() || '';

  const faktaList: string[] = [];
  if (hasExplicitDurasi && inferredDurasi) {
    faktaList.push(`Jadwal definitif kegiatan pada tanggal ${inferredTanggal} di ${inferredTujuan} selama ${inferredDurasi};`);
  } else {
    faktaList.push(`Jadwal definitif kegiatan pada tanggal ${inferredTanggal} bertempat di ${inferredTujuan};`);
  }
  faktaList.push(`Lokasi kegiatan memerlukan koordinasi lapangan dan verifikasi teknis langsung;`);
  faktaList.push(`Urgensi teknis penanganan tidak dapat digantikan secara daring.`);

  return {
    hal: cleanGenerateHal(safeTema, inferredTujuan),
    persoalan: [
      `Regulasi tugas pokok dan fungsi ${safeInstansi} dalam rangka pelaksanaan program kerja prioritas dan pencapaian target kinerja Tahun Anggaran 2026;`,
      `Landasan pelaksanaan kegiatan ${safeTema} di ${inferredTujuan} guna menjamin ketertiban administrasi serta kelancaran koordinasi teknis di lapangan;`,
      `Urgensi kehadiran langsung pejabat/pelaksana teknis guna mengawal penanganan lapangan dan memitigasi potensi kendala teknis yang tidak dapat diselesaikan secara daring.`
    ],
    praanggapan: [
      `Bahwa pelaksanaan perjalanan dinas secara langsung menjamin seluruh agenda koordinasi teknis dan target output penugasan terselesaikan secara optimal dan tepat waktu;`,
      `Bahwa ketiadaan kehadiran langsung di lokasi penugasan berisiko menimbulkan hambatan sinkronisasi data teknis serta potensi keterlambatan pelaporan kedinasan;`,
      `Bahwa alokasi anggaran belanja perjalanan dinas pada DPA ${safeInstansi} TA 2026 telah terverifikasi tersedia dan mencukupi untuk membiayai penugasan ini.`
    ],
    fakta: [
      (hasExplicitDurasi && inferredDurasi)
        ? `Rangkaian kegiatan ${safeTema} dijadwalkan secara definitif pada tanggal ${inferredTanggal} bertempat di ${inferredTujuan} selama ${inferredDurasi};`
        : `Rangkaian kegiatan ${safeTema} dijadwalkan secara definitif pada tanggal ${inferredTanggal} bertempat di ${inferredTujuan};`,
      `Pelaksanaan kegiatan di lokasi tujuan memerlukan penanganan lapangan langsung, verifikasi dokumen fisik, serta koordinasi intensif bersama pihak-pihak terkait;`,
      `Urgensi teknis penanganan memerlukan kehadiran fisik di lokasi dan tidak dapat digantikan dengan koordinasi secara daring maupun penugasan jarak jauh.`
    ],
    analisisIntro: 'Berdasarkan pokok persoalan, praanggapan, dan fakta di atas, disampaikan telaahan staf sebagai berikut:',
    analisis: [
      `Bahwa kehadiran langsung memiliki tingkat efektivitas dan urgensi tinggi dalam mengawal kelancaran teknis kegiatan serta pencapaian target kinerja program secara akuntabel;`,
      inferredPersonil
        ? `Bahwa penugasan personel (${inferredPersonil}) telah dirancang rasional dan proporsional sesuai dengan kualifikasi, kompetensi teknis, dan beban kerja riil di lapangan;`
        : `Bahwa penugasan personel telah disesuaikan secara proporsional dan rasional dengan kebutuhan kompetensi serta beban tugas riil di lapangan;`,
      `Bahwa alokasi pembiayaan perjalanan dinas telah dirancang secara efisien, wajar, dan akuntabel guna memastikan ketersediaan anggaran DPA termanfaatkan secara optimal.`
    ],
    kesimpulan: {
      poin: [
        `Pelaksanaan perjalanan dinas ke ${inferredTujuan} dinyatakan sangat layak dan mendesak guna menjamin ketercapaian target kinerja dan kelancaran kegiatan;`,
        `Rencana penugasan telah memenuhi seluruh persyaratan administratif kedinasan serta didukung ketersediaan alokasi anggaran DPA ${safeInstansi} TA 2026 yang mencukupi.`
      ],
      ringkasan: `Berdasarkan hasil analisis, perjalanan dinas ke ${inferredTujuan} dinyatakan sangat layak, mendesak, dan memenuhi syarat administratif serta ketersediaan anggaran DPA TA 2026.`,
      intro: 'Sehubungan dengan hal tersebut di atas, mohon persetujuan menugaskan:',
      kegiatanIntro: '',
      tempat: inferredTujuan,
      selama: (hasExplicitDurasi && inferredDurasi) ? inferredDurasi : 'Sesuai jadwal penugasan',
      tanggal: inferredTanggal
    },
    saran: [
      `Menunjuk staf terkait yang berkompeten untuk melaksanakan kegiatan penugasan ${safeTema};`,
      `Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA ${safeInstansi} TA 2026.`
    ]
  };
}
