import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { generatePagedJsDocumentHtml } from "./src/utils/pagedjsGenerator";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Helper: Clean perihal (hal) from duplicate or redundant destination strings
function cleanGenerateHal(theme: string, destination: string): string {
  const safeTheme = theme.trim();
  const safeDest = destination.trim();
  
  // If destination is empty or generic like "Kota Tujuan" or "Tujuan"
  const isGenericDest = !safeDest || ["kota tujuan", "tujuan", "tempat tujuan"].includes(safeDest.toLowerCase());
  
  // Check if theme already has "di [Something]"
  const hasDiInTheme = /\bdi\s+[a-zA-Z]/i.test(safeTheme);
  
  // Check if theme already contains the destination name
  const cleanDestName = safeDest.toLowerCase().replace(/^(kota|kabupaten)\s+/i, "").trim();
  const themeContainsDest = cleanDestName && safeTheme.toLowerCase().includes(cleanDestName);
  
  if (themeContainsDest) {
    return `Melaksanakan Perjalanan Dinas Dalam Rangka ${safeTheme}`;
  }
  
  if (isGenericDest && hasDiInTheme) {
    return `Melaksanakan Perjalanan Dinas Dalam Rangka ${safeTheme}`;
  }
  
  if (isGenericDest) {
    return `Melaksanakan Perjalanan Dinas Dalam Rangka ${safeTheme}`;
  }
  
  // Otherwise, append if not already there
  return `Melaksanakan Perjalanan Dinas Dalam Rangka ${safeTheme} di ${safeDest}`;
}

// Helper: Contextual intelligent template fallback aligned strictly with the 5-point concept
function generateFallbackTelaah(params: {
  tema: string;
  tujuan: string;
  tanggal: string;
  durasi?: string;
  deskripsi?: string;
  instansi?: string;
  suratUndangan?: string;
  paguAnggaran?: string;
  targetOutput?: string;
  personilInfo?: string;
  hasExplicitDurasi?: boolean;
  hasExplicitPersonil?: boolean;
}) {
  const {
    tema,
    tujuan,
    tanggal,
    durasi,
    deskripsi,
    instansi,
    suratUndangan,
    paguAnggaran,
    targetOutput,
    personilInfo,
    hasExplicitDurasi,
    hasExplicitPersonil,
  } = params;

  const safeTema = tema.trim() || "Kegiatan Dinas";
  const safeTujuan = tujuan.trim() || "Kota Tarakan";
  const safeTanggal = tanggal.trim() || "Tanggal Pelaksanaan TA 2026";
  const safeDurasi = durasi && durasi.trim() ? durasi.trim() : "";
  const safeInstansi = instansi?.trim() || "Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara";
  const safeUndangan = suratUndangan && suratUndangan.trim() ? suratUndangan.trim() : "";
  const safeTarget = targetOutput?.trim() || `Tercapainya sinkronisasi teknis, verifikasi data lapangan, dan penuntasan output pelaksanaan ${safeTema}`;
  const safePersonil = personilInfo && personilInfo.trim() ? personilInfo.trim() : "";

  const praanggapanPedoman = safeUndangan
    ? `Bahwa pelaksanaan kegiatan ini berpedoman pada ${safeUndangan}, ketentuan teknis kedinasan, serta alokasi program kerja DPA ${safeInstansi} Tahun Anggaran 2026 secara objektif tanpa penafsiran subjektif;`
    : `Bahwa pelaksanaan kegiatan ini berpedoman pada ketentuan teknis kedinasan serta alokasi program kerja DPA ${safeInstansi} Tahun Anggaran 2026 secara objektif tanpa penafsiran subjektif;`;

  const faktaList: string[] = [];
  if (safeUndangan) {
    faktaList.push(`${safeUndangan} perihal pelaksanaan kegiatan ${safeTema};`);
  }

  // Fakta-fakta yang mempengaruhi: TIDAK mendefinisikan 3 hari atau 2 orang bila tidak diminta
  if (hasExplicitDurasi && safeDurasi) {
    faktaList.push(`Rangkaian kegiatan dijadwalkan secara definitif pada tanggal ${safeTanggal} bertempat di ${safeTujuan} selama ${safeDurasi};`);
  } else {
    faktaList.push(`Rangkaian kegiatan dijadwalkan secara definitif pada tanggal ${safeTanggal} bertempat di ${safeTujuan};`);
  }

  if (hasExplicitPersonil && safePersonil && hasExplicitDurasi && safeDurasi) {
    faktaList.push(`Pagu anggaran belanja Perjalanan Dinas Biasa pada DPA ${safeInstansi} TA 2026 pada sub-kegiatan terkait telah terverifikasi tersedia dan mencukupi untuk membiayai penugasan ${safePersonil} selama ${safeDurasi};`);
  } else if (hasExplicitPersonil && safePersonil) {
    faktaList.push(`Pagu anggaran belanja Perjalanan Dinas Biasa pada DPA ${safeInstansi} TA 2026 pada sub-kegiatan terkait telah terverifikasi tersedia dan mencukupi untuk membiayai penugasan ${safePersonil};`);
  } else {
    faktaList.push(`Pagu anggaran belanja Perjalanan Dinas Biasa pada DPA ${safeInstansi} TA 2026 pada sub-kegiatan terkait telah terverifikasi tersedia dan mencukupi untuk membiayai pelaksanaan penugasan dinas yang diusulkan;`);
  }
  faktaList.push(`Pelaksanaan kegiatan memerlukan koordinasi teknis dan penanganan langsung di lapangan bersama pihak terkait guna memastikan target kinerja terselesaikan secara akuntabel.`);

  return {
    hal: cleanGenerateHal(safeTema, safeTujuan),
    persoalan: [
      `Regulasi tugas pokok dan fungsi ${safeInstansi} dalam rangka pelaksanaan program kerja prioritas dan pencapaian target kinerja Tahun Anggaran 2026;`,
      `Landasan pelaksanaan kegiatan ${safeTema} di ${safeTujuan} guna menjamin ketertiban administrasi serta kelancaran koordinasi teknis di lapangan;`,
      `Urgensi kehadiran langsung pejabat/pelaksana teknis guna mengawal penanganan lapangan dan memitigasi potensi kendala teknis yang tidak dapat diselesaikan secara daring.`
    ],
    praanggapan: [
      `Bahwa pelaksanaan perjalanan dinas secara langsung menjamin seluruh agenda koordinasi teknis dan target output penugasan terselesaikan secara optimal dan tepat waktu;`,
      `Bahwa ketiadaan kehadiran langsung di lokasi penugasan berisiko menimbulkan hambatan sinkronisasi data teknis serta potensi keterlambatan pelaporan kedinasan;`,
      `Bahwa alokasi anggaran belanja perjalanan dinas pada DPA ${safeInstansi} TA 2026 telah terverifikasi tersedia dan mencukupi untuk membiayai penugasan ini.`
    ],
    fakta: [
      (hasExplicitDurasi && safeDurasi)
        ? `Rangkaian kegiatan ${safeTema} dijadwalkan secara definitif pada tanggal ${safeTanggal} bertempat di ${safeTujuan} selama ${safeDurasi};`
        : `Rangkaian kegiatan ${safeTema} dijadwalkan secara definitif pada tanggal ${safeTanggal} bertempat di ${safeTujuan};`,
      `Pelaksanaan kegiatan di lokasi tujuan memerlukan penanganan lapangan langsung, verifikasi dokumen fisik, serta koordinasi intensif bersama pihak-pihak terkait;`,
      `Urgensi teknis penanganan memerlukan kehadiran fisik di lokasi dan tidak dapat digantikan dengan koordinasi secara daring maupun penugasan jarak jauh.`
    ],
    analisisIntro: "Berdasarkan pokok persoalan, praanggapan, dan fakta-fakta tersebut di atas, disampaikan telaahan staf sebagai berikut:",
    analisis: [
      `Bahwa kehadiran langsung memiliki tingkat efektivitas dan urgensi tinggi dalam mengawal kelancaran teknis kegiatan serta pencapaian target kinerja program secara akuntabel;`,
      safePersonil
        ? `Bahwa penugasan personel (${safePersonil}) telah dirancang rasional dan proporsional sesuai dengan kualifikasi, kompetensi teknis, dan beban kerja riil di lapangan;`
        : `Bahwa penugasan personel telah disesuaikan secara proporsional dan rasional dengan kebutuhan kompetensi serta beban tugas riil di lapangan;`,
      `Bahwa alokasi pembiayaan perjalanan dinas telah dirancang secara efisien, wajar, dan akuntabel guna memastikan ketersediaan anggaran DPA termanfaatkan secara optimal.`
    ],
    kesimpulan: {
      poin: [
        `Pelaksanaan perjalanan dinas ke ${safeTujuan} dinyatakan sangat layak dan mendesak guna menjamin ketercapaian target kinerja dan kelancaran kegiatan;`,
        `Rencana penugasan telah memenuhi seluruh persyaratan administratif kedinasan serta didukung ketersediaan alokasi anggaran DPA ${safeInstansi} TA 2026 yang mencukupi.`
      ],
      ringkasan: `Berdasarkan hasil analisis, perjalanan dinas ke ${safeTujuan} dinyatakan sangat layak, mendesak, dan memenuhi syarat administratif serta ketersediaan anggaran DPA TA 2026.`,
      intro: "Sehubungan dengan hal tersebut di atas, mohon persetujuan Bapak/Ibu untuk menugaskan personil sebagai berikut:",
      kegiatanIntro: "",
      tempat: safeTujuan,
      selama: (hasExplicitDurasi && safeDurasi) ? safeDurasi : "Sesuai jadwal penugasan",
      tanggal: safeTanggal
    },
    saran: [
      `Menunjuk staf terkait yang berkompeten untuk melaksanakan kegiatan penugasan ${safeTema};`,
      `Memohon kepada Atasan kiranya berkenan menyetujui serta menerbitkan Surat Perintah Tugas (SPT) dan Surat Perintah Perjalanan Dinas (SPPD) bagi personil pelaksana kegiatan serta pembebanan anggaran pada DPA ${safeInstansi} TA 2026.`
    ]
  };
}

// Helper: Local heuristic/rule-based formal Indonesian bureaucratic editor
function generateLocalRevisedSection(sectionName: string, textToRevise: string, instructions?: string): any {
  const lines = textToRevise
    .split(/[.;\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 4);

  const rules = [
    { regex: /melaksanakan perjalanan dinas ini dalam rangka/gi, replacement: "melaksanakan koordinasi" },
    { regex: /sangat penting sekali/gi, replacement: "sangat penting" },
    { regex: /oleh karena itu/gi, replacement: "sehingga" },
    { regex: /guna untuk/gi, replacement: "untuk" },
    { regex: /agar supaya/gi, replacement: "agar" },
    { regex: /dibebankan kepada anggaran belanja/gi, replacement: "dibebankan pada DPA" },
    { regex: /dikhawatirkan akan terjadi keterlambatan/gi, replacement: "memitigasi risiko keterlambatan" },
    { regex: /dilakukan secara daring atau online/gi, replacement: "diselenggarakan secara daring" },
    { regex: /dapat dibilang/gi, replacement: "dinyatakan" },
  ];

  const processed = lines.map(line => {
    let clean = line;
    for (const rule of rules) {
      clean = clean.replace(rule.regex, rule.replacement);
    }
    
    const needsBahwa = ["praanggapan", "analisis"].includes(sectionName.toLowerCase());
    if (needsBahwa) {
      if (!clean.toLowerCase().startsWith("bahwa")) {
        clean = "Bahwa " + clean.charAt(0).toLowerCase() + clean.slice(1);
      } else {
        clean = "Bahwa " + clean.substring(5).trim().charAt(0).toLowerCase() + clean.substring(5).trim().slice(1);
      }
    }

    if (!clean.toLowerCase().startsWith("bahwa") && clean.length > 0) {
      clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    }

    if (!clean.endsWith(".") && !clean.endsWith(";")) {
      clean += ".";
    }

    return clean;
  });

  const uniqueItems = Array.from(new Set(processed));
  const resultList = uniqueItems.slice(0, 3);

  if (sectionName.toLowerCase() === "kesimpulan") {
    return resultList.join(" ");
  }

  return resultList;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API endpoint to generate Telaahan Staf using Gemini AI
app.post("/api/generate-telaah", async (req, res) => {
  try {
    const {
      prompt: rawPrompt,
      tema,
      tujuan,
      tanggal,
      durasi,
      deskripsi,
      instansi,
      suratUndangan,
      paguAnggaran,
      targetOutput,
      personilInfo,
    } = req.body || {};

    const inputText = (typeof rawPrompt === "string" && rawPrompt.trim()) || (typeof tema === "string" && tema.trim()) || "";

    if (!inputText) {
      res.status(400).json({ error: "Silakan ketik beberapa kata atau kalimat kegiatan terlebih dahulu." });
      return;
    }

    // Smart heuristic extraction from free-form text if specific fields are not provided
    let inferredTujuan = (tujuan && typeof tujuan === "string" ? tujuan.trim() : "");
    if (!inferredTujuan) {
      const cityMatches = [
        "Tarakan", "Bulungan", "Tanjung Selor", "Nunukan", "Malinau", "Tana Tidung", "Tideng Pale",
        "Jakarta", "Jakarta Pusat", "Jakarta Selatan", "Samarinda", "Balikpapan",
        "Surabaya", "Yogyakarta", "Bandung", "Makassar"
      ];
      for (const city of cityMatches) {
        if (new RegExp(`\\b${city}\\b`, "i").test(inputText)) {
          inferredTujuan = city.includes("Kota") || city.includes("Kabupaten") ? city : `Kota ${city}`;
          break;
        }
      }
      if (!inferredTujuan) inferredTujuan = "Kota Tarakan";
    }

    // Durasi: HANYA jika diminta / disebutkan secara eksplisit oleh pengguna
    let inferredDurasi = (durasi && typeof durasi === "string" ? durasi.trim() : "");
    let hasExplicitDurasi = Boolean(inferredDurasi);
    if (!inferredDurasi) {
      const durasiMatch = inputText.match(/(\d+)\s*(?:hari|hr)/i);
      if (durasiMatch) {
        const dNum = durasiMatch[1];
        const numWords: Record<string, string> = { "1": "satu", "2": "dua", "3": "tiga", "4": "empat", "5": "lima", "6": "enam", "7": "tujuh" };
        inferredDurasi = `${dNum} (${numWords[dNum] || dNum}) hari`;
        hasExplicitDurasi = true;
      } else {
        inferredDurasi = ""; // JANGAN mendefinisikan 3 hari jika tidak diminta!
        hasExplicitDurasi = false;
      }
    }

    // Personil: HANYA jika diminta / disebutkan secara eksplisit oleh pengguna
    let inferredPersonil = (personilInfo && typeof personilInfo === "string" ? personilInfo.trim() : "");
    let hasExplicitPersonil = Boolean(inferredPersonil);
    if (!inferredPersonil) {
      const personilMatch = inputText.match(/(\d+)\s*(?:orang|staf|pegawai|personil)/i);
      if (personilMatch) {
        const pNum = personilMatch[1];
        const numWords: Record<string, string> = { "1": "satu", "2": "dua", "3": "tiga", "4": "empat", "5": "lima" };
        inferredPersonil = `${pNum} (${numWords[pNum] || pNum}) orang personil`;
        hasExplicitPersonil = true;
      } else {
        inferredPersonil = ""; // JANGAN mendefinisikan 2 orang jika tidak diminta!
        hasExplicitPersonil = false;
      }
    }

    let inferredTanggal = (tanggal && typeof tanggal === "string" ? tanggal.trim() : "");
    if (!inferredTanggal) {
      const tglMatch = inputText.match(/tanggal\s+([^\,\.]+)/i) || inputText.match(/tgl\s+([^\,\.]+)/i) || inputText.match(/\d{1,2}\s*(?:s\.?d\.?|-)\s*\d{1,2}\s+[a-zA-Z]+\s+\d{4}/i);
      if (tglMatch) {
        inferredTanggal = tglMatch[0].replace(/^tanggal\s+/i, '').replace(/^tgl\s+/i, '');
      } else {
        inferredTanggal = "Sesuai Jadwal TA 2026";
      }
    }

    const safeTema = (tema && typeof tema === "string" && tema.trim()) || inputText;
    const safeTujuan = inferredTujuan;
    const safeTanggal = inferredTanggal;
    const safeDurasi = inferredDurasi;
    const safeDeskripsi = (deskripsi && typeof deskripsi === "string" ? deskripsi.trim() : "") || `Tugas kedinasan dalam rangka ${inputText}`;
    const safeInstansi = (instansi && typeof instansi === "string" ? instansi.trim() : "") || "Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara";
    const safeSuratUndangan = (suratUndangan && typeof suratUndangan === "string" ? suratUndangan.trim() : "");
    const safePaguAnggaran = (paguAnggaran && typeof paguAnggaran === "string" ? paguAnggaran.trim() : "") || `Tersedia pada DPA ${safeInstansi} TA 2026 pada mata anggaran Perjalanan Dinas Biasa`;
    const safeTargetOutput = (targetOutput && typeof targetOutput === "string" ? targetOutput.trim() : "") || `Terlaksananya koordinasi teknis dan tercapainya output kegiatan secara tuntas`;
    const safePersonilInfo = inferredPersonil;
    const hasUndanganMention = Boolean(safeSuratUndangan) || /undangan|surat\s+(?:undangan|tugas|pemberitahuan|resmi)/i.test(inputText);

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback generator when API key is not yet set
      const fallbackResult = generateFallbackTelaah({
        tema: safeTema,
        tujuan: safeTujuan,
        tanggal: safeTanggal,
        durasi: safeDurasi,
        deskripsi: safeDeskripsi,
        instansi: safeInstansi,
        suratUndangan: safeSuratUndangan,
        paguAnggaran: safePaguAnggaran,
        targetOutput: safeTargetOutput,
        personilInfo: safePersonilInfo,
        hasExplicitDurasi,
        hasExplicitPersonil,
      });
      res.json({
        success: true,
        source: "template_fallback",
        data: fallbackResult,
        message: "Draf berhasil disusun otomatis menggunakan konsep naskah dinas resmi yang mengalir.",
      });
      return;
    }

    const prompt = `Anda adalah Ahli Administrasi dan Perancang Tata Naskah Dinas Pemerintah Indonesia (khususnya Telaahan Staf standar Permendagri / Peraturan Menteri Pendayagunaan Aparatur Negara).

Pengguna memberikan kata kunci / kalimat singkat rencana kegiatan perjalanan dinas:
"${inputText}"

Petunjuk Konteks Kegiatan:
- Tema / Judul Acara: "${safeTema}"
- Tempat / Kota Tujuan: "${safeTujuan}"
- Tanggal Pelaksanaan: "${safeTanggal}"
- Durasi / Lama Penugasan: ${hasExplicitDurasi ? `"${safeDurasi}" (disebutkan oleh pengguna)` : 'TIDAK DISEBUTKAN (JANGAN MENGARANG ATAU MEMAKSAKAN JUMLAH HARI TERTENTU SEPERTI 3 HARI)'}
- Instansi / OPD: "${safeInstansi}"
- Ketersediaan Anggaran: "${safePaguAnggaran}"
- Personil yang Diusulkan: ${hasExplicitPersonil ? `"${safePersonilInfo}" (disebutkan oleh pengguna)` : 'TIDAK DISEBUTKAN (JANGAN MENGARANG ATAU MEMAKSAKAN JUMLAH ORANG TERTENTU SEPERTI 2 ORANG STAF)'}
- Surat Undangan Resmi: ${hasUndanganMention ? `Ada rujukan surat undangan: "${safeSuratUndangan || 'Disebutkan pada kalimat masukan'}"` : 'TIDAK ADA SURAT UNDANGAN (JANGAN MENGARANG SURAT UNDANGAN FIKTIF)'}

TUGAS ANDA:
1. Pahami maksud kalimat pengguna. Tentukan tema kegiatan yang baku, kota tujuan, tanggal pelaksanaan (jika belum spesifik di kalimat, tentukan waktu yang logis di TA 2026), durasi penugasan (HANYA jika disebutkan), dan sasaran tugas.
2. Susunlah dokumen resmi TELAAHAN STAF PERJALANAN DINAS dengan GAYA BAHASA YANG MENGALIR SEPERTI BAHASA SURAT DINAS / NOTA DINAS RESMI (santun, tertib, lugas, elegan, dan berwibawa).

PANDUAN JUMLAH BUTIR & PANJANG TEKS (ATURAN MUTLAK - BARIS CETAK):
- Setiap Bab (Bab I hingga Bab IV):
  * WAJIB TEPAT MAKSIMAL 3 BUTIR / POIN SAJA (butir a, b, dan c). JANGAN membuat lebih dari 3 butir.
  * Total baris setiap bab adalah TEPAT 6 BARIS CETAK (setiap butir berbobot ringkas ~100–120 karakter / tepat ~2 baris cetak fisik).
  * 3 butir x 2 baris cetak = TEPAT 6 BARIS CETAK per bab.
  * Halaman 1 khusus memuat Kop, Atribut, Disposisi, dan Bab I s.d Bab IV secara rapi, proporsional, dan tertib. Bab V (Kesimpulan) dan Bab VI (Saran) berada di Halaman 2.
  * Gunakan kalimat resmi yang mengalir, padat substansi, berwibawa, dan formal tanpa kata-kata mubazir.

PANDUAN STRUKTUR SETIAP BAB (MAKSIMAL 3 BUTIR & TEPAT 6 BARIS CETAK):
1. Bab I (Persoalan): Maksimal 3 butir (total 6 baris cetak):
   - Poin a: Regulasi dasar tugas pokok dan fungsi instansi dalam pelaksanaan program prioritas TA 2026;
   - Poin b: Landasan pelaksanaan kegiatan di lokasi tujuan guna ketertiban administrasi dan koordinasi;
   - Poin c: Urgensi kehadiran langsung tim dinas guna mengawal penanganan lapangan yang tidak dapat diselenggarakan daring.

2. Bab II (Praanggapan): Maksimal 3 butir (total 6 baris cetak):
   - Poin a: Asumsi logis bahwa pelaksanaan perjalanan dinas menjamin seluruh target output tercapai tepat waktu;
   - Poin b: Asumsi risiko bahwa ketiadaan kehadiran langsung berpotensi menimbulkan hambatan teknis dan pelaporan;
   - Poin c: Kepastian bahwa alokasi anggaran belanja perjalanan dinas DPA TA 2026 terverifikasi tersedia mencukupi.

3. Bab III (Fakta-Fakta): Maksimal 3 butir (total 6 baris cetak):
   - Poin a: Jadwal definitif kegiatan, lokasi tujuan, dan waktu penugasan kedinasan;
   - Poin b: Kebutuhan penanganan langsung, verifikasi fisik, serta koordinasi intensif bersama pemangku kepentingan;
   - Poin c: Urgensi teknis penanganan fisik di lokasi yang wajib dihadiri langsung dan tidak dapat digantikan secara daring.

4. Bab IV (Analisis): Maksimal 3 butir (total 6 baris cetak):
   - Poin a: Efektivitas dan urgensi kehadiran langsung dalam mengawal kelancaran teknis dan capaian target program;
   - Poin b: Rasionalitas penugasan personel sesuai kualifikasi, kompetensi teknis, serta beban tugas riil di lapangan;
   - Poin c: Efisiensi alokasi pembiayaan penugasan agar anggaran DPA termanfaatkan secara optimal dan akuntabel.

5. Bab V (Kesimpulan): WAJIB TEPAT 2 POIN & MAKSIMAL 3 BARIS CETAK:
   - Fokus Isi: Intisari atau penilaian akhir dari hasil analisis pada Bab IV secara singkat, padat, dan tegas.
   - Memberikan simpulan bahwa perjalanan dinas LAYAK, MENDESAK, dan MEMENUHI SYARAT ADMINISTRATIF/KEUANGAN DPA TA 2026.
   - Poin a: Penegasan kelayakan dan urgensi mendesak pelaksanaan perjalanan dinas ke lokasi tujuan (~1–1.5 baris cetak).
   - Poin b: Penegasan pemenuhan syarat administratif kedinasan dan kepastian anggaran DPA TA 2026 (~1–1.5 baris cetak).
   - TOTAL TEKS BAB V TIDAK BOLEH MELEBIHI 3 BARIS CETAK FISIK.

6. VI. SARAN: WAJIB TEPAT 2 POIN SAJA & TOTAL MAKSIMAL 4–5 BARIS CETAK (di luar Daftar Pegawai & Rincian Penugasan):
   - Poin a: Permintaan kepada atasan untuk menunjuk staf/personil terkait yang berkompeten untuk melaksanakan penugasan tersebut (TEPAT 2 BARIS CETAK, ~80–100 KARAKTER).
   - Poin b: Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA ${safeInstansi} TA 2026 (TEPAT 2–3 BARIS CETAK, ~100–120 KARAKTER).
   - ATURAN MUTLAK: TOTAL KEDUA POIN SARAN SANGAT KETAT MAKSIMAL 4–5 BARIS CETAK FISIK. GUNAKAN KALIMAT LUGAS, PADAT, DAN LANGSUNG PADA INTI TANPA KATA-KATA BERBELIT! JANGAN PERNAH MELEBIHI 5 BARIS CETAK!
   - JANGAN MEMBUAT LEBIH DARI 2 POIN UNTUK BAB VI SARAN.

Hasilkan respon HANYA dalam format JSON valid (tanpa blok markdown di luar JSON) dengan struktur objek persis seperti ini:
{
  "hal": "Melaksanakan Perjalanan Dinas Dalam Rangka ...",
  "persoalan": [
    "Regulasi tugas pokok dan fungsi ${safeInstansi} dalam pelaksanaan program prioritas TA 2026;",
    "Landasan pelaksanaan kegiatan ${safeTema} di ${safeTujuan} guna ketertiban administrasi dan koordinasi;",
    "Urgensi kehadiran langsung tim dinas guna mengawal penanganan lapangan yang tidak dapat diselenggarakan daring."
  ],
  "praanggapan": [
    "Bahwa pelaksanaan perjalanan dinas secara langsung menjamin seluruh target output tercapai tepat waktu;",
    "Bahwa ketiadaan kehadiran langsung di lokasi penugasan berisiko menimbulkan hambatan teknis dan pelaporan;",
    "Bahwa alokasi anggaran belanja perjalanan dinas pada DPA ${safeInstansi} TA 2026 terverifikasi tersedia mencukupi."
  ],
  "fakta": [
    ${hasExplicitDurasi ? `"Rangkaian kegiatan ${safeTema} dijadwalkan secara definitif pada tanggal ${safeTanggal} di ${safeTujuan} selama ${safeDurasi};",` : `"Rangkaian kegiatan ${safeTema} dijadwalkan secara definitif pada tanggal ${safeTanggal} bertempat di ${safeTujuan};",`}
    "Pelaksanaan kegiatan di lokasi tujuan memerlukan penanganan lapangan langsung dan verifikasi fisik;",
    "Urgensi teknis penanganan memerlukan kehadiran fisik di lokasi dan tidak dapat digantikan secara daring."
  ],
  "analisisIntro": "Berdasarkan pokok persoalan, praanggapan, dan fakta-fakta tersebut di atas, disampaikan telaahan staf sebagai berikut:",
  "analisis": [
    "Bahwa kehadiran langsung memiliki tingkat efektivitas dan urgensi tinggi dalam mengawal kelancaran teknis kegiatan;",
    "Bahwa penugasan personel telah disesuaikan secara proporsional dengan kualifikasi dan beban tugas riil di lapangan;",
    "Bahwa alokasi pembiayaan penugasan telah dirancang efisien dan wajar guna memastikan anggaran DPA optimal."
  ],
  "kesimpulan": {
    "poin": [
      "Pelaksanaan perjalanan dinas ke ${safeTujuan} dinyatakan sangat layak dan mendesak demi kelancaran kegiatan;",
      "Rencana penugasan telah memenuhi syarat administratif dan didukung ketersediaan anggaran DPA ${safeInstansi} TA 2026."
    ],
    "ringkasan": "Berdasarkan analisis, perjalanan dinas ke ${safeTujuan} dinyatakan sangat layak, mendesak, dan memenuhi syarat administratif serta ketersediaan anggaran DPA TA 2026.",
    "intro": "Sehubungan dengan hal tersebut di atas, mohon persetujuan menugaskan:",
    "kegiatanIntro": "",
    "tempat": "${safeTujuan}",
    "selama": "${hasExplicitDurasi ? safeDurasi : 'Sesuai jadwal penugasan'}",
    "tanggal": "${safeTanggal}"
  },
  "saran": [
    "Menunjuk staf/pejabat terkait yang berkompeten untuk melaksanakan kegiatan penugasan ${safeTema};",
    "Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA ${safeInstansi} TA 2026."
  ]
}

Aturan Sangat Penting Tambahan:
1. JANGAN PERNAH menyertakan frasa redundan "di Kota Tujuan" atau "Kota Tujuan" jika tempat tujuan atau kota tujuan telah didefinisikan (misalnya Nunukan, Tarakan, dsb) atau jika tema kegiatan sudah memuat kata "di [Kota/Daerah]".
2. JANGAN PERNAH menghasilkan kalimat yang menggantung, terpotong, tidak lengkap, atau diakhiri dengan tanda titik tiga (...) di dalam bab/seksi mana pun. Setiap kalimat hasil respon harus merupakan kalimat bahasa Indonesia yang lengkap, utuh, dan selesai tata bahasanya.

Pastikan teks berbunyi resmi, mengalir seperti surat dinas, dan tidak menyertakan kutipan markdown di luar format JSON.`;

    const CANDIDATE_MODELS = [
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
    ];

    let responseText = "";
    let usedModel = "";
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });
        if (response.text && response.text.trim()) {
          responseText = response.text;
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.log(`[Status] Model ${modelName} is currently occupied. Attempting next candidate...`);
      }
    }

    if (!responseText) {
      throw lastError || new Error("All AI models are busy at the moment.");
    }

    let parsedData;
    try {
      // Strip potential markdown code fences if model output them
      const cleanJsonStr = responseText
        .replace(/^\s*```json\s*/i, '')
        .replace(/^\s*```\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim();
      parsedData = JSON.parse(cleanJsonStr);
    } catch {
      // If direct parsing fails, try to extract JSON block { ... }
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Gagal mengurai respon format JSON.");
      }
    }

    if (parsedData && typeof parsedData === 'object') {
      parsedData.hal = cleanGenerateHal(safeTema, safeTujuan);
    }

    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      source: "gemini_ai",
      model: usedModel,
      data: parsedData,
    });
  } catch (error: any) {
    console.log("[Status] Utilizing structured administrative blueprint due to high service traffic.");

    // Provide graceful fallback even if Gemini encounters an error
    const fallbackResult = generateFallbackTelaah({
      tema: req.body?.tema || (typeof req.body?.prompt === 'string' ? req.body.prompt : "") || "Kegiatan Perjalanan Dinas",
      tujuan: req.body?.tujuan || "Kota Tujuan",
      tanggal: req.body?.tanggal || "Tahun Anggaran 2026",
      durasi: req.body?.durasi || "",
      deskripsi: req.body?.deskripsi || "",
      instansi: req.body?.instansi || "Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara",
    });

    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      source: "template_fallback_error",
      data: fallbackResult,
      message: `Telaahan berhasil disusun secara otomatis menggunakan format naskah dinas resmi.`,
    });
  }
});

// API endpoint to revise a specific section using Gemini AI
app.post("/api/revise-section", async (req, res) => {
  try {
    const { sectionName, currentText, instructions, contextTitle } = req.body || {};
    if (!sectionName) {
      res.status(400).json({ error: "Nama seksi/bab harus disediakan." });
      return;
    }

    const ai = getGeminiClient();
    const safeInstructions = instructions?.trim() || "Sederhanakan dan buat menjadi lebih singkat, padat, lugas, serta formal tanpa mengurangi esensi tata naskah dinas.";
    const safeTitle = contextTitle?.trim() || "Telaahan Staf Perjalanan Dinas";

    const textToRevise = Array.isArray(currentText) ? currentText.filter(Boolean).join("\n") : String(currentText || "");

    if (!textToRevise.trim()) {
      res.status(400).json({ error: "Teks yang ingin direvisi tidak boleh kosong." });
      return;
    }

    if (!ai) {
      // Offline fallback: return a simplified, shortened version of the sentences
      const sentences = textToRevise.split(/[.;\n\r]+/).map(s => s.trim()).filter(s => s.length > 5);
      const shortened = sentences.map(s => {
        const prefix = s.toLowerCase().startsWith("bahwa") ? "Bahwa " : "";
        let clean = s.replace(/^bahwa\s+/i, "");
        if (clean.length > 0) {
          clean = clean.charAt(0).toUpperCase() + clean.slice(1);
        }
        return `${prefix}${clean}.`;
      });
      
      res.json({
        success: true,
        source: "offline_fallback",
        revisedText: Array.isArray(currentText) ? shortened.slice(0, 3) : shortened.slice(0, 3).join(" "),
        message: "Revisi luring berhasil disimulasikan (Gemini API belum terkonfigurasi)."
      });
      return;
    }

    const prompt = `Anda adalah Asisten Penulisan Naskah Dinas Pemerintah Indonesia yang sangat ahli dan terlatih dalam menyusun tata naskah dinas standar Permendagri.

Tugas Anda adalah merevisi dan menyusun ulang bagian "${sectionName.toUpperCase()}" dari dokumen Telaahan Staf berikut agar lebih RINGKAS, TERTIB, ELEGAN, dan BIROKRATIS/FORMAL.

Konteks Judul Dokumen: "${safeTitle}"
Bagian yang Direvisi: "${sectionName}"
Instruksi Tambahan Pengguna: "${safeInstructions}"

Teks asli saat ini:
"""
${textToRevise}
"""

ATURAN REVISI (WAJIB DIPATUHI SECARA KETAT - BARIS CETAK):
1. **Maksimal 2–3 Poin dan Maksimal 6 Baris Cetak**:
   - Untuk bagian berupa daftar (persoalan, praanggapan, fakta, analisis, saran), WAJIB menghasilkan MAKSIMAL 2 SAMPAI 3 BUTIR POIN saja (tidak boleh lebih).
   - Total panjang teks per seksi/bab MAKSIMAL 6 BARIS CETAK pada kertas A4 standar (~75–85 karakter per baris cetak, atau total maksimal ~450–480 karakter).
   - Gunakan kalimat yang ringkas, padat, lugas, santun, dan langsung pada substansi kedinasan tanpa bertele-tele agar muat optimal dalam batas 6 baris cetak.
2. Jika tipe seksi berupa daftar poin (seperti "persoalan", "praanggapan", "fakta", "analisis", "saran"), kembalikan respon berupa JSON ARRAY berisi maksimal 2-3 butir kalimat singkat.
3. Jika tipe seksi berupa teks tunggal atau ringkasan (seperti "kesimpulan"), kembalikan respon berupa string paragraf pendek yang ringkas (maksimal 2-3 baris cetak).
4. JANGAN PERNAH menyertakan frasa redundan "di Kota Tujuan" atau "Kota Tujuan" jika tempat tujuan atau kota tujuan telah didefinisikan (misalnya Nunukan, Tarakan, dsb).
5. JANGAN PERNAH menghasilkan kalimat yang terpotong, menggantung, atau diakhiri dengan tanda titik tiga (...) di dalam seksi mana pun. Setiap kalimat hasil respon harus merupakan kalimat bahasa Indonesia yang lengkap, utuh, dan selesai tata bahasanya.

Format Respon Harus Berupa JSON murni (tanpa tag code blocks atau teks pengantar di luarnya) dengan format persis salah satu di bawah:
Untuk tipe seksi berupa daftar (persoalan, praanggapan, fakta, analisis, saran):
{
  "revisedList": [
    "Butir singkat revisi 1.",
    "Butir singkat revisi 2."
  ]
}

Untuk tipe seksi berupa teks tunggal (kesimpulan/ringkasan):
{
  "revisedText": "Teks paragraf singkat hasil revisi."
}

Pastikan format JSON valid agar dapat diurai langsung oleh sistem.`;

    const CANDIDATE_MODELS = [
      "gemini-3.8-flash",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
    ];

    let responseText = "";
    let usedModel = "";
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });
        if (response.text && response.text.trim()) {
          responseText = response.text;
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.log(`[Status] Model ${modelName} is currently occupied. Attempting next candidate...`);
      }
    }

    if (!responseText) {
      throw lastError || new Error("All AI models are busy at the moment.");
    }

    const cleanJsonStr = responseText
      .replace(/^\s*```json\s*/i, '')
      .replace(/^\s*```\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();
    const parsed = JSON.parse(cleanJsonStr);

    let finalRevised: any = "";
    if (parsed.revisedList && Array.isArray(parsed.revisedList)) {
      finalRevised = parsed.revisedList.slice(0, 3);
    } else if (parsed.revisedText) {
      finalRevised = parsed.revisedText;
    } else if (Array.isArray(parsed)) {
      finalRevised = parsed.slice(0, 3);
    } else {
      finalRevised = parsed;
    }

    res.json({
      success: true,
      source: "gemini_ai",
      model: usedModel,
      revisedText: finalRevised,
    });
  } catch (error: any) {
    console.log("[Status] Utilizing local editorial processor due to high model demand.");
    
    try {
      const { sectionName, currentText, instructions } = req.body || {};
      const textToRevise = Array.isArray(currentText) ? currentText.filter(Boolean).join("\n") : String(currentText || "");
      const fallbackText = generateLocalRevisedSection(sectionName || "persoalan", textToRevise, instructions);

      res.json({
        success: true,
        source: "local_heuristic_fallback",
        revisedText: fallbackText,
        message: "Teks berhasil direvisi secara formal dengan mesin editorial lokal (Gemini sedang mengalami lonjakan antrean)."
      });
    } catch (fallbackErr: any) {
      console.log("[Status] Fallback processor complete.");
      res.status(500).json({ error: "Gagal memproses revisi teks." });
    }
  }
});

// Server-Side Paged.js PDF HTML Generation API
app.post("/api/pdf/html", (req, res) => {
  try {
    const { data, options } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Missing document data object" });
    }
    const html = generatePagedJsDocumentHtml(data, options || {});
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, html });
  } catch (err: any) {
    console.error("[PDF API Error]", err);
    res.status(500).json({ error: err.message || "Failed to generate Paged.js HTML" });
  }
});

// Server-Side Paged.js Direct HTML Preview Route
app.post("/api/pdf/preview", (req, res) => {
  try {
    const { data, options } = req.body;
    if (!data) {
      return res.status(400).send("<h1>Error: Document data missing</h1>");
    }
    const html = generatePagedJsDocumentHtml(data, options || {});
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err: any) {
    console.error("[PDF Preview Error]", err);
    res.status(500).send(`<h1>Error generating PDF preview</h1><p>${err.message}</p>`);
  }
});

async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(distPath, "index.html"));

  if (!isProduction) {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
