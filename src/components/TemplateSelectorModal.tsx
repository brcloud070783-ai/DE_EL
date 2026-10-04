import React, { useState } from 'react';
import { TelaahanStafData } from '../types';
import { SAMPLE_TELAAHAN_KALTARA, BLANK_TELAAHAN } from '../data/defaultTelaah';
import {
  X,
  Award,
  BookOpen,
  Navigation,
  Compass,
  Sparkles,
  Crown,
  Database,
  Users,
  ShieldCheck,
  PackageCheck,
  Layers,
  Search,
} from 'lucide-react';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: TelaahanStafData) => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const templates: {
    id: string;
    title: string;
    subtitle: string;
    subKegiatan: string;
    kategoriId: 'puspresnas' | 'tatakelola' | 'prioritas' | 'spm';
    kategoriLabel: string;
    tempat: string;
    durasi: string;
    personilCount: number;
    icon: React.ReactNode;
    badgeColor: string;
    getData: () => TelaahanStafData;
  }[] = [
    // =========================================================================
    // 1. AGENDA PUSPRESNAS & PENGEMBANGAN KARAKTER (Sub Kegiatan: Pembinaan Minat, Bakat dan Kreativitas Siswa)
    // =========================================================================
    {
      id: 'puspresnas-kompetisi',
      title: 'Pendampingan Ajang Talenta Siswa (FLS2N, O2SN, OSN, LDBI, NSDC, FIKSI, OPSI)',
      subtitle: 'Sub Kegiatan Pembinaan Minat, Bakat dan Kreativitas Siswa SMA',
      subKegiatan: 'Pembinaan Minat, Bakat dan Kreativitas Siswa',
      kategoriId: 'puspresnas',
      kategoriLabel: 'Puspresnas & Talenta',
      tempat: 'Hotel Diamond Tarakan (Lokasi Seleksi Provinsi)',
      durasi: '3 (tiga) hari kerja',
      personilCount: 3,
      icon: <Award className="w-5 h-5 text-amber-600" />,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-puspresnas-kompetisi-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '10 Agustus 2026',
          nomorSurat: '400.3.8/1042/DISDIKBUD/VIII/2026',
          hal: 'Pelaksanaan Pendampingan dan Penyelenggaraan Kompetisi Minat, Bakat, dan Kreativitas Siswa SMA Tingkat Provinsi (FLS2N, O2SN, OSN, LDBI, NSDC, FIKSI, dan OPSI) Tahun 2026',
        },
        persoalan: [
          'Agenda tahunan Pusat Prestasi Nasional (Puspresnas) dalam penjaringan talenta peserta didik jenjang SMA tingkat provinsi;',
          'Urgensi pendampingan langsung tim dinas guna mengawal kelancaran teknis, kejujuran penjurian, dan verifikasi dokumen berkas peserta;',
          'Dampak ketiadaan pendampingan berisiko menghambat koordinasi kontingen daerah dan keberangkatan delegasi ke tingkat nasional.'
        ],
        praanggapan: [
          'Bahwa penyelenggaraan ajang talenta tingkat provinsi secara terstruktur menjamin kontinuitas pembinaan prestasi siswa;',
          'Bahwa kendala koordinasi teknis di lapangan dapat dimitigasi melalui kehadiran langsung pendamping dari Dinas Pendidikan;',
          'Bahwa alokasi anggaran belanja perjalanan dinas terverifikasi tersedia pada DPA TA 2026 Sub Kegiatan Pembinaan Minat dan Bakat.'
        ],
        fakta: [
          'Jadwal seleksi tingkat provinsi ditetapkan secara definitif bertempat di lokasi kompetisi tingkat provinsi;',
          'Rangkaian ajang talenta meliputi 7 cabang lomba nasional: FLS2N, O2SN, OSN, LDBI, NSDC, FIKSI, dan OPSI TA 2026;',
          'Panduan Teknis Pelaksanaan Ajang Talenta Jenjang SMA dari Pusat Prestasi Nasional Kemendikdasmen TA 2026.'
        ],
        analisis: [
          'Bahwa pendampingan langsung memiliki efektivitas tinggi dalam menjaga stabilitas mental dan kesiapan administratif kontingen;',
          'Bahwa komposisi personel pendamping yang ditugaskan telah sesuai dengan kualifikasi dan beban pendampingan cabang lomba;',
          'Bahwa durasi penugasan dirancang rasional dan efisien sesuai standar pagu biaya DPA TA 2026.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan penugasan pendampingan ajang talenta provinsi dinilai sangat layak dan mendesak demi prestasi peserta didik;',
            'Seluruh syarat administratif kedinasan dan kepastian alokasi anggaran pada DPA TA 2026 telah terpenuhi.'
          ],
          ringkasan: 'Pelaksanaan penugasan pendampingan ajang talenta provinsi dinilai sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Pendampingan dan Penyelenggaraan Kompetisi Minat, Bakat, dan Kreativitas Siswa SMA Tingkat Provinsi Tahun 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Hotel Diamond Tarakan',
          tempat: 'Hotel Diamond Tarakan',
          selama: '3 (tiga) hari kerja',
          lamanyaPerjalanan: '3 (tiga) hari kerja',
          tanggal: '11 s.d. 13 Agustus 2026',
          tanggalBerangkat: '11 Agustus 2026',
          tanggalKembali: '13 Agustus 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pembinaan Minat dan Bakat Siswa',
        },
        saran: [
          'Menunjuk tim pendamping yang berkompeten untuk memfasilitasi kontingen ajang talenta provinsi;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 10 Agustus 2026',
        }
      }),
    },
    {
      id: 'puspresnas-rakor-fullboard',
      title: 'Rakor Persiapan Ajang Talenta Peserta Didik (Paket Meeting)',
      subtitle: 'Sub Kegiatan Pembinaan Minat, Bakat dan Kreativitas Siswa SMA',
      subKegiatan: 'Pembinaan Minat, Bakat dan Kreativitas Siswa',
      kategoriId: 'puspresnas',
      kategoriLabel: 'Puspresnas & Talenta',
      tempat: 'Hotel Swiss-Belhotel Tarakan',
      durasi: '3 (tiga) hari kerja',
      personilCount: 3,
      icon: <Sparkles className="w-5 h-5 text-[#7F56D9]" />,
      badgeColor: 'bg-[#7F56D9]/10 text-[#7F56D9] border-purple-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-puspresnas-rakor-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '18 Mei 2026',
          nomorSurat: '400.3.8/1120/DISDIKBUD/V/2026',
          hal: 'Pemanggilan Rapat Koordinasi (Paket Meeting/Fullboard) Persiapan Ajang Talenta Peserta Didik Tingkat Provinsi Tahun 2026',
        },
        persoalan: [
          'Penyelarasan teknis dan penyusunan jadwal seleksi ajang talenta peserta didik SMA bersama penanggung jawab kabupaten/kota;',
          'Urgensi rakor fullboard guna menyepakati petunjuk teknis, susunan juri independen, dan standar penilaian seleksi provinsi;',
          'Dampak tanpa rakor koordinasi berisiko menimbulkan perbedaan persepsi aturan lomba dan protes dari kontingen daerah.'
        ],
        praanggapan: [
          'Bahwa rakor konsolidasi tatap muka menghasilkan kesepakatan juknis dan skema seleksi provinsi yang adil dan akuntabel;',
          'Bahwa potensi kendala administrasi pendaftaran BPT (Balai Pengembangan Talenta) dapat diselesaikan secara tuntas;',
          'Bahwa ketersediaan pagu anggaran paket meeting rakor terverifikasi mencukupi pada DPA TA 2026.'
        ],
        fakta: [
          'Rakor persiapan dijadwalkan secara definitif dengan mekanisme paket meeting fullboard bertempat di hotel penyelenggara;',
          'Peserta rakor terdiri dari Kasi Peserta Didik Cabdin, koordinator MGMP, dan panitia teknis ajang talenta;',
          'Surat Edaran Puspresnas perihal Kerangka Kerja Penyelenggaraan Ajang Talenta Peserta Didik Tahun 2026.'
        ],
        analisis: [
          'Bahwa rapat koordinasi sistem fullboard sangat efektif untuk menyelesaikan draf juknis and pembagian tugas panitia secara fokus;',
          'Bahwa personel panitia yang ditugaskan memiliki linieritas tugas dengan fungsi pembinaan kesiswaan;',
          'Bahwa alokasi biaya rakor telah dihitung secara rasional dan efisien mengacu pada standar biaya masukan TA 2026.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Penyelenggaraan rakor persiapan ajang talenta dinilai sangat layak dan mendesak demi kelancaran seleksi tingkat provinsi;',
            'Rencana kegiatan telah memenuhi syarat administratif dan ketersediaan anggaran DPA TA 2026.'
          ],
          ringkasan: 'Penyelenggaraan rakor persiapan ajang talenta dinilai sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Pemanggilan Rapat Koordinasi Persiapan Ajang Talenta Peserta Didik Tingkat Provinsi Tahun 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Hotel Swiss-Belhotel Tarakan',
          tempat: 'Hotel Swiss-Belhotel Tarakan',
          selama: '3 (tiga) hari kerja',
          lamanyaPerjalanan: '3 (tiga) hari kerja',
          tanggal: '20 s.d. 22 Mei 2026',
          tanggalBerangkat: '20 Mei 2026',
          tanggalKembali: '22 Mei 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pembinaan Minat dan Bakat Siswa',
        },
        saran: [
          'Menunjuk panitia pelaksana rakor yang berkompeten untuk memfasilitasi jalannya pertemuan fullboard;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 18 Mei 2026',
        }
      }),
    },

    // =========================================================================
    // 2. AGENDA MANAJEMEN TATA KELOLA, DAPODIK & AKSES (Sub Kegiatan: Pembinaan Kelembagaan & Manajemen SMA)
    // =========================================================================
    {
      id: 'tatakelola-dapodik',
      title: 'Monev & Sinkronisasi Data Pokok Pendidikan (Dapodik) SMA',
      subtitle: 'Sub Kegiatan Pembinaan Kelembagaan dan Manajemen Sekolah Menengah Atas',
      subKegiatan: 'Pembinaan Kelembagaan dan Manajemen SMA',
      kategoriId: 'tatakelola',
      kategoriLabel: 'Tata Kelola & Dapodik',
      tempat: 'SMA Negeri Target Sasaran di Kabupaten/Kota',
      durasi: '3 (tiga) hari kerja',
      personilCount: 2,
      icon: <Database className="w-5 h-5 text-blue-600" />,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-tatakelola-dapodik-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '8 Juni 2026',
          nomorSurat: '400.3.8/1420/DISDIKBUD/VI/2026',
          hal: 'Monitoring, Evaluasi, dan Sinkronisasi Data Pokok Pendidikan (Dapodik) Jenjang Sekolah Menengah Atas',
        },
        persoalan: [
          'Akurasi dan validasi Data Pokok Pendidikan (Dapodik) sebagai basis penyaluran dana BOS, pemenuhan kuota SNBP, dan tunjangan guru;',
          'Urgensi verifikasi lapangan langsung ke satuan pendidikan yang mengalami residu data, invalid sarpras, dan data siswa ganda;',
          'Dampak keterlambatan sinkronisasi Dapodik berisiko merugikan hak dana operasional sekolah dan keikutsertaan siswa dalam kelulusan.'
        ],
        praanggapan: [
          'Bahwa pendampingan tim admin Dapodik dinas secara langsung mempercepat penyelesaian residu dan verifikasi data fisik sekolah;',
          'Bahwa kendala jaringan dan pemahaman operator sekolah terkait aplikasi Dapodik versi terbaru dapat diselesaikan secara tuntas;',
          'Bahwa alokasi anggaran perjalanan dinas pendampingan Dapodik telah teralokasi pada DPA TA 2026.'
        ],
        fakta: [
          'Jadwal monev dan sinkronisasi Dapodik dilaksanakan bertempat di satuan pendidikan jenjang SMA target sasaran;',
          'Batas waktu (cut-off) sinkronisasi Dapodik nasional ditetapkan sesuai regulasi Kementerian Pendidikan Dasar dan Menengah;',
          'Daftar rekapitulasi residu data NISN, NIK, dan kelembagaan Dapodik SMA yang memerlukan verifikasi faktual.'
        ],
        analisis: [
          'Bahwa asistensi teknis Dapodik secara langsung ke sekolah sasaran efektif meningkatkan persentase data valid hingga 100%;',
          'Bahwa personel tim admin yang ditugaskan memiliki kualifikasi teknis dan kompetensi di bidang sistem informasi kependidikan;',
          'Bahwa alokasi pembiayaan monev dirancang efisien dengan menjangkau klaster sekolah dalam satu rute perjalanan.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan monev dan sinkronisasi Dapodik SMA dinilai sangat layak dan mendesak demi kepastian penyaluran bantuan pemerintah;',
            'Seluruh syarat administratif dan ketersediaan pagu anggaran pada DPA TA 2026 telah terpenuhi.'
          ],
          ringkasan: 'Pelaksanaan monev dan sinkronisasi Dapodik SMA dinilai sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Monitoring, Evaluasi, dan Sinkronisasi Data Pokok Pendidikan (Dapodik) Jenjang SMA Tahun 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'SMA Negeri Target di Kabupaten/Kota',
          tempat: 'SMA Negeri Target di Kabupaten/Kota',
          selama: '3 (tiga) hari kerja',
          lamanyaPerjalanan: '3 (tiga) hari kerja',
          tanggal: '10 s.d. 12 Juni 2026',
          tanggalBerangkat: '10 Juni 2026',
          tanggalKembali: '12 Juni 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pembinaan Kelembagaan dan Manajemen SMA',
        },
        saran: [
          'Menunjuk tim pengelola Dapodik dinas yang berkompeten untuk melaksanakan monev dan asistensi teknis lapangan;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 8 Juni 2026',
        }
      }),
    },
    {
      id: 'tatakelola-kurikulum',
      title: 'Rakor & Bimtek Penguatan Implementasi Kurikulum SMA',
      subtitle: 'Sub Kegiatan Pembinaan Kelembagaan dan Manajemen Sekolah Menengah Atas',
      subKegiatan: 'Pembinaan Kelembagaan dan Manajemen SMA',
      kategoriId: 'tatakelola',
      kategoriLabel: 'Tata Kelola & Kurikulum',
      tempat: 'Hotel Crown Tanjung Selor / Wilayah Sasaran',
      durasi: '3 (tiga) hari kerja',
      personilCount: 3,
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-tatakelola-kurikulum-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '14 Juli 2026',
          nomorSurat: '400.3.8/1530/DISDIKBUD/VII/2026',
          hal: 'Rapat Koordinasi dan Bimbingan Teknis Penguatan Implementasi Kurikulum pada Satuan Pendidikan Jenjang SMA Tahun 2026',
        },
        persoalan: [
          'Peningkatan mutu pembelajaran dan penyelarasan dokumen kurikulum satuan pendidikan (KSP) jenjang SMA;',
          'Urgensi pembekalan teknis bagi kepala sekolah dan wakil kepala bidang kurikulum terkait struktur kurikulum dan asesmen pembelajaran;',
          'Dampak tanpa bimtek berisiko menimbulkan ketidakseragaman penerapan perangkat ajar dan instrumen penilaian hasil belajar.'
        ],
        praanggapan: [
          'Bahwa bimtek penguatan kurikulum secara tatap muka meningkatkan pemahaman pedagogis dan manajerial pengelola sekolah;',
          'Bahwa kendala pendampingan PBM dan penyusunan modul ajar mandiri dapat teratasi melalui asistensi pengawas sekolah;',
          'Bahwa ketersediaan alokasi anggaran bimtek terverifikasi mencukupi pada DPA TA 2026.'
        ],
        fakta: [
          'Rakor dan bimtek penguatan kurikulum dijadwalkan bertempat di lokasi pusat kegiatan bimtek wilayah;',
          'Sasaran peserta mencakup Kepala Sekolah, Waka Kurikulum, serta pengawas pembina SMA se-wilayah target;',
          'Panduan Pengembangan Kurikulum Satuan Pendidikan dari Badan Standar, Kurikulum, dan Asesmen Pendidikan TA 2026.'
        ],
        analisis: [
          'Bahwa pelaksanaan bimtek secara langsung memiliki efektivitas tinggi dalam menghasilkan draf KSP yang tervalidasi;',
          'Bahwa penugasan tim narasumber pengawas pembina linier dengan fungsi supervisi manajerial dan akademik;',
          'Bahwa alokasi biaya bimtek dirancang efisien dan rasional sesuai standar biaya masukan TA 2026.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan rakor dan bimtek penguatan kurikulum SMA dinyatakan sangat layak dan mendesak demi mutu pembelajaran;',
            'Rencana penugasan memenuhi syarat administratif dan ketersediaan anggaran DPA TA 2026.'
          ],
          ringkasan: 'Pelaksanaan rakor dan bimtek penguatan kurikulum SMA dinyatakan sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Rakor dan Bimtek Penguatan Implementasi Kurikulum pada Satuan Pendidikan Jenjang SMA Tahun 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Gedung / Hotel Wilayah Sasaran',
          tempat: 'Gedung / Hotel Wilayah Sasaran',
          selama: '3 (tiga) hari kerja',
          lamanyaPerjalanan: '3 (tiga) hari kerja',
          tanggal: '16 s.d. 18 Juli 2026',
          tanggalBerangkat: '16 Juli 2026',
          tanggalKembali: '18 Juli 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pembinaan Kelembagaan dan Manajemen SMA',
        },
        saran: [
          'Menunjuk pengawas sekolah dan tim teknis kurikulum yang berkompeten untuk memfasilitasi bimtek dimaksud;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 14 Juli 2026',
        }
      }),
    },
    {
      id: 'tatakelola-ppdb',
      title: 'Koordinasi & Evaluasi Persiapan PPDB Jenjang SMA 2026',
      subtitle: 'Sub Kegiatan Pembinaan Kelembagaan dan Manajemen Sekolah Menengah Atas',
      subKegiatan: 'Pembinaan Kelembagaan dan Manajemen SMA',
      kategoriId: 'tatakelola',
      kategoriLabel: 'Tata Kelola & PPDB',
      tempat: 'Cabang Dinas Pendidikan Wilayah / Kab-Kota',
      durasi: '2 (dua) hari kerja',
      personilCount: 2,
      icon: <Users className="w-5 h-5 text-teal-600" />,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-tatakelola-ppdb-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '12 Mei 2026',
          nomorSurat: '400.3.8/0812/DISDIKBUD/V/2026',
          hal: 'Koordinasi dan Evaluasi Persiapan Pelaksanaan Penerimaan Peserta Didik Baru (PPDB) Jenjang SMA Tahun 2026',
        },
        persoalan: [
          'Kesiapan teknis, pemetaan zonasi, dan transparansi sistem Penerimaan Peserta Didik Baru (PPDB) jenjang SMA TA 2026;',
          'Urgensi koordinasi bersama cabang dinas dan kepala sekolah guna menyepakati kuota daya tampung, jalur afirmasi, dan mekanisme daring;',
          'Dampak ketiadaan evaluasi persiapan berisiko memicu gejolak masyarakat, ketidaksesuaian kuota zonasi, dan aduan publik.'
        ],
        praanggapan: [
          'Bahwa rapat koordinasi teknis dan verifikasi data kuota sekolah menjamin pelaksanaan PPDB yang objektif, transparan, dan akuntabel;',
          'Bahwa kendala teknis jaringan dan validasi dokumen kependudukan calon siswa dapat disimulasikan secara tuntas;',
          'Bahwa anggaran perjalanan dinas koordinasi PPDB terverifikasi tersedia pada DPA TA 2026.'
        ],
        fakta: [
          'Rakor evaluasi persiapan PPDB dilaksanakan bertempat di lokasi rapat koordinasi wilayah;',
          'Rangkaian kegiatan mencakup uji coba sistem aplikasi PPDB online, verifikasi draf Juknis Gubernur, dan penetapan wilayah zonasi;',
          'Permendikbudristek Nomor 1 Tahun 2021 dan Petunjuk Teknis PPDB Daerah Tahun Anggaran 2026.'
        ],
        analisis: [
          'Bahwa verifikasi zonasi dan daya tampung secara langsung efektif mencegah munculnya permasalahan redistribusi siswa;',
          'Bahwa personel tim PPDB yang ditugaskan memiliki kualifikasi teknis dan pemahaman regulasi penerimaan siswa baru;',
          'Bahwa penggunaan anggaran dirancang hemat dan efisien mengacu pada standar biaya DPA TA 2026.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan koordinasi dan evaluasi persiapan PPDB SMA TA 2026 dinyatakan sangat layak dan mendesak demi kondusivitas daerah;',
            'Seluruh aspek administratif kedinasan dan kepastian alokasi anggaran DPA TA 2026 telah terpenuhi.'
          ],
          ringkasan: 'Pelaksanaan koordinasi dan evaluasi persiapan PPDB SMA TA 2026 dinyatakan sangat layak, mendesak, and memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Koordinasi dan Evaluasi Persiapan Pelaksanaan Penerimaan Peserta Didik Baru (PPDB) Jenjang SMA Tahun 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Cabang Dinas Pendidikan / Kab-Kota Target',
          tempat: 'Cabang Dinas Pendidikan / Kab-Kota Target',
          selama: '2 (dua) hari kerja',
          lamanyaPerjalanan: '2 (dua) hari kerja',
          tanggal: '14 s.d. 15 Mei 2026',
          tanggalBerangkat: '14 Mei 2026',
          tanggalKembali: '15 Mei 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pembinaan Kelembagaan dan Manajemen SMA',
        },
        saran: [
          'Menunjuk panitia teknis PPDB dinas yang berkompeten untuk memfasilitasi rapat koordinasi dan uji coba sistem;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 12 Mei 2026',
        }
      }),
    },

    // =========================================================================
    // 3. AGENDA PRIORITAS NASIONAL - LINTAS SEKTOR (Sub Kegiatan: Koordinasi, Perencanaan, Supervisi & Evaluasi)
    // =========================================================================
    {
      id: 'prioritas-stunting',
      title: 'Rakor Lintas Sektor Pencegahan Stunting di Satuan Pendidikan',
      subtitle: 'Sub Kegiatan Koordinasi, Perencanaan, Supervisi dan Evaluasi Layanan Bidang Pendidikan',
      subKegiatan: 'Koordinasi, Perencanaan, Supervisi & Evaluasi Layanan Pendidikan',
      kategoriId: 'prioritas',
      kategoriLabel: 'Prioritas / Stunting',
      tempat: 'Gedung Serbaguna Kabupaten/Kota Target',
      durasi: '2 (dua) hari kerja',
      personilCount: 2,
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-prioritas-stunting-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '22 Maret 2026',
          nomorSurat: '400.3.8/0932/DISDIKBUD/III/2026',
          hal: 'Pelaksanaan Sosialisasi dan Rapat Koordinasi Lintas Sektor terkait Pencegahan dan Penanggulangan Stunting di Lingkungan Satuan Pendidikan Tahun 2026',
        },
        persoalan: [
          'Program Prioritas Nasional dalam percepatan penurunan stunting melalui kampanye Aksi Bergizi dan Usaha Kesehatan Sekolah (UKS);',
          'Urgensi koordinasi lintas sektor bersama Dinas Kesehatan, BKKBN, dan Puskemas guna edukasi gizi remaja putri di SMA;',
          'Dampak tanpa sosialisasi terintegrasi berisiko menurunkan pemahaman pola hidup sehat dan pencegahan anemia pada remaja usia sekolah.'
        ],
        praanggapan: [
          'Bahwa sinergi sektor pendidikan dan kesehatan secara langsung meningkatkan efektivitas konsumsi tablet tambah darah (TTD) di sekolah;',
          'Bahwa pembentukan kader kesehatan remaja sekolah dapat diakselerasi melalui pendampingan bersama puskesmas setempat;',
          'Bahwa alokasi anggaran sosialisasi dan rakor lintas sektor terverifikasi tersedia pada DPA TA 2026.'
        ],
        fakta: [
          'Sosialisasi dan rakor lintas sektor pencegahan stunting dijadwalkan bertempat di lokasi pelaksanaan rapat koordinasi;',
          'Peserta melibatkan Pembina UKS Cabdin, Kepala SMA target, tim TP2S Daerah, serta narasumber Dinas Kesehatan;',
          'Peraturan Presiden Nomor 72 Tahun 2021 tentang Percepatan Penurunan Stunting dan RAN PASTI TA 2026.'
        ],
        analisis: [
          'Bahwa koordinasi lintas sektor memiliki efektivitas tinggi dalam mengintegrasikan program kesehatan remaja ke dalam kegiatan sekolah;',
          'Bahwa tim fasilitator dinas yang ditugaskan memiliki pengalaman dalam pembinaan UKS dan koordinasi lintas lembaga;',
          'Bahwa pembebanan biaya perjalanan dinas terukur efisien dan wajar sesuai ketentuan DPA TA 2026.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan rakor lintas sektor pencegahan stunting di sekolah dinyatakan sangat layak dan mendesak demi kesehatan generasi muda;',
            'Rencana kegiatan telah memenuhi syarat administratif dan ketersediaan anggaran DPA TA 2026.'
          ],
          ringkasan: 'Pelaksanaan rakor lintas sektor pencegahan stunting di sekolah dinyatakan sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Pelaksanaan Sosialisasi dan Rakor Lintas Sektor terkait Pencegahan Stunting di Lingkungan Sekolah Tahun 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Gedung Serbaguna Kabupaten/Kota Target',
          tempat: 'Gedung Serbaguna Kabupaten/Kota Target',
          selama: '2 (dua) hari kerja',
          lamanyaPerjalanan: '2 (dua) hari kerja',
          tanggal: '24 s.d. 25 Maret 2026',
          tanggalBerangkat: '24 Maret 2026',
          tanggalKembali: '25 Maret 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Koordinasi, Perencanaan, Supervisi dan Evaluasi',
        },
        saran: [
          'Menunjuk pelaksana tugas bidang perencanaan dan UKS yang berkompeten untuk memfasilitasi rakor stunting dimaksud;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 22 Maret 2026',
        }
      }),
    },
    {
      id: 'prioritas-ats',
      title: 'Monev Percepatan Penanganan Anak Tidak Sekolah (ATS) SMA',
      subtitle: 'Sub Kegiatan Koordinasi, Perencanaan, Supervisi dan Evaluasi Layanan Bidang Pendidikan',
      subKegiatan: 'Koordinasi, Perencanaan, Supervisi & Evaluasi Layanan Pendidikan',
      kategoriId: 'prioritas',
      kategoriLabel: 'Prioritas / ATS',
      tempat: 'Desa/Kecamatan Basis Data ATS Kabupaten/Kota',
      durasi: '3 (tiga) hari kerja',
      personilCount: 2,
      icon: <Navigation className="w-5 h-5 text-emerald-600" />,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-prioritas-ats-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '16 Agustus 2026',
          nomorSurat: '400.3.8/1890/DISDIKBUD/VIII/2026',
          hal: 'Monitoring dan Evaluasi Percepatan Penanganan Anak Tidak Sekolah (ATS) pada Pendidikan Menengah Atas Tahun 2026',
        },
        persoalan: [
          'Pencapaian target Rencana Pembangunan Jangka Menengah Daerah (RPJMD) dalam penuntasan Anak Tidak Sekolah (ATS) usia 16–18 tahun;',
          'Urgensi verifikasi faktual lapangan data ATS guna pengembalian ke jalur formal SMA/SMK atau jalur non-formal Kesetaraan Paket C;',
          'Dampak pembiaran kasus ATS berisiko menurunkan Angka Partisipasi Murni (APM) dan memperlebar kesenjangan akses pendidikan.'
        ],
        praanggapan: [
          'Bahwa pendataan dan intervensi langsung ke kantong-kantong desa ATS menghasilkan data pemetaan sebab putus sekolah yang akurat;',
          'Bahwa skema bantuan beasiswa dan kesiapan sekolah penampung dapat disinergikan bersama pemerintah desa;',
          'Bahwa ketersediaan pagu anggaran monev penanganan ATS terverifikasi mencukupi pada DPA TA 2026.'
        ],
        fakta: [
          'Jadwal monev penanganan ATS dilaksanakan secara definitif bertempat di desa/kecamatan lokasi basis data ATS;',
          'Kegiatan melibatkan tim pendata dinas, pengawas sekolah, perwakilan perangkat desa, dan pengelola PKBM setempat;',
          'Strategi Nasional Penanganan Anak Tidak Sekolah dan Data Terpadu Penanganan ATS Daerah TA 2026.'
        ],
        analisis: [
          'Bahwa verifikasi faktual secara langsung efektif memastikan rekomendasi jalur pendidikan yang tepat bagi anak lulus tidak melanjut;',
          'Bahwa penugasan tim monev linier dengan fungsi perencanaan dan evaluasi akses layanan pendidikan;',
          'Bahwa pembiayaan perjalanan dinas dirancang efisien dengan pola pengelompokan wilayah basis data.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan monev penanganan ATS jenjang SMA dinilai sangat layak dan mendesak demi pemenuhan hak pendidikan anak;',
            'Seluruh aspek administratif kedinasan dan alokasi anggaran DPA TA 2026 telah terverifikasi memenuhi syarat.'
          ],
          ringkasan: 'Pelaksanaan monev penanganan ATS jenjang SMA dinilai sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Monitoring dan Evaluasi Percepatan Penanganan Anak Tidak Sekolah (ATS) pada Pendidikan Menengah Atas Tahun 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Desa/Kecamatan Basis Data ATS di Kab/Kota',
          tempat: 'Desa/Kecamatan Basis Data ATS di Kab/Kota',
          selama: '3 (tiga) hari kerja',
          lamanyaPerjalanan: '3 (tiga) hari kerja',
          tanggal: '18 s.d. 20 Agustus 2026',
          tanggalBerangkat: '18 Agustus 2026',
          tanggalKembali: '20 Agustus 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Koordinasi, Perencanaan, Supervisi dan Evaluasi',
        },
        saran: [
          'Menunjuk tim pendata dan pengawas pembina yang berkompeten untuk melaksanakan monev penanganan ATS;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 16 Agustus 2026',
        }
      }),
    },

    // =========================================================================
    // 4. AGENDA SPM & BANTUAN PENDIDIKAN (Sub Kegiatan: Pengadaan Perlengkapan Peserta Didik)
    // =========================================================================
    {
      id: 'spm-perlengkapan-siswa',
      title: 'Monev & Penyaluran Bantuan Perlengkapan Peserta Didik SMA',
      subtitle: 'Sub Kegiatan Pengadaan Perlengkapan Peserta Didik SMA (Seragam/Perlengkapan)',
      subKegiatan: 'Pengadaan Perlengkapan Peserta Didik SMA',
      kategoriId: 'spm',
      kategoriLabel: 'SPM & Bantuan Siswa',
      tempat: 'SMA Negeri Penerima Alokasi Bantuan Perlengkapan',
      durasi: '3 (tiga) hari kerja',
      personilCount: 2,
      icon: <PackageCheck className="w-5 h-5 text-cyan-600" />,
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-spm-perlengkapan-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '20 September 2026',
          nomorSurat: '400.3.8/2105/DISDIKBUD/IX/2026',
          hal: 'Pelaksanaan Monitoring dan Penyaluran Bantuan Pengadaan Perlengkapan Peserta Didik Jenjang SMA Tahun Anggaran 2026',
        },
        persoalan: [
          'Pemenuhan Standar Pelayanan Minimal (SPM) pendidikan melalui pemberian bantuan perlengkapan siswa kurang mampu (seragam/alat tulis);',
          'Urgensi verifikasi kelayakan penerima dan pengawasan distribusi seragam sekolah tepat sasaran, tepat jumlah, dan tepat ukuran;',
          'Dampak ketiadaan pengawasan distribusi berisiko menimbulkan penumpukan barang di gudang sekolah serta keluhan orang tua siswa.'
        ],
        praanggapan: [
          'Bahwa monitoring langsung ke sekolah penerima menjamin ketepatan serah terima barang dan berita acara pemeriksaan barang (BAP);',
          'Bahwa keluhan ukuran seragam yang tidak sesuai dapat segera diratifikasi bersama penyedia barang;',
          'Bahwa alokasi anggaran perjalanan dinas monitoring bantuan terverifikasi tersedia pada DPA TA 2026.'
        ],
        fakta: [
          'Jadwal monitoring penyaluran bantuan perlengkapan peserta didik dilaksanakan bertempat di SMA penerima alokasi bantuan;',
          'Paket perlengkapan mencakup seragam sekolah, sepatu, tas, dan alat tulis bagi siswa dari keluarga tidak mampu;',
          'Dokumen Pelaksanaan Anggaran (DPA) TA 2026 Sub Kegiatan Pengadaan Perlengkapan Peserta Didik Jenjang SMA.'
        ],
        analisis: [
          'Bahwa pengawasan distribusi secara langsung memiliki tingkat kepastian tinggi dalam menjaga akuntabilitas serah terima bantuan;',
          'Bahwa personel tim pengawas barang yang ditugaskan memiliki kualifikasi dalam verifikasi administrasi dan fisik logistik;',
          'Bahwa alokasi pembiayaan perjalanan monev dihitung secara rasional dan hemat sesuai standar pagu DPA TA 2026.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan monev penyaluran bantuan perlengkapan siswa SMA dinyatakan sangat layak dan mendesak demi ketepatan sasaran SPM;',
            'Rencana kegiatan telah memenuhi syarat administratif kedinasan dan kepastian anggaran DPA TA 2026.'
          ],
          ringkasan: 'Pelaksanaan monev penyaluran bantuan perlengkapan siswa SMA dinyatakan sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Monitoring dan Penyaluran Bantuan Pengadaan Perlengkapan Peserta Didik Jenjang SMA TA 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'SMA Negeri Penerima Alokasi Bantuan',
          tempat: 'SMA Negeri Penerima Alokasi Bantuan',
          selama: '3 (tiga) hari kerja',
          lamanyaPerjalanan: '3 (tiga) hari kerja',
          tanggal: '22 s.d. 24 September 2026',
          tanggalBerangkat: '22 September 2026',
          tanggalKembali: '24 September 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pengadaan Perlengkapan Peserta Didik Jenjang SMA',
        },
        saran: [
          'Menunjuk tim pengelola bantuan dinas yang berkompeten untuk melaksanakan monev dan pengawasan distribusi barang;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 20 September 2026',
        }
      }),
    },
    {
      id: 'tatakelola-bos',
      title: 'Monev & Rekonsiliasi Penggunaan Dana BOSP (Bantuan Operasional) SMA/SMK',
      subtitle: 'Sub Kegiatan Pembinaan Kelembagaan dan Manajemen Sekolah Menengah Atas/Kejuruan',
      subKegiatan: 'Pembinaan Kelembagaan dan Manajemen SMA/SMK',
      kategoriId: 'tatakelola',
      kategoriLabel: 'Tata Kelola & Dapodik',
      tempat: 'Satuan Pendidikan Penerima Dana BOSP (Kab. Nunukan)',
      durasi: '4 (empat) hari kerja',
      personilCount: 2,
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-tatakelola-bos-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '05 Oktober 2026',
          nomorSurat: '400.3.8/2340/DISDIKBUD/X/2026',
          hal: 'Pelaksanaan Monitoring, Evaluasi, dan Rekonsiliasi Penggunaan Dana Bantuan Operasional Satuan Pendidikan (BOSP) Jenjang SMA/SMK Kabupaten Nunukan Triwulan III TA 2026',
        },
        persoalan: [
          'Ketentuan pelaporan pertanggungjawaban penggunaan dana BOSP yang wajib akuntabel, transparan, dan tepat waktu sesuai Permendikbudristek Nomor 63 Tahun 2023;',
          'Urgensi verifikasi fisik kesesuaian belanja modal/barang pada ARKAS (Aplikasi Rencana Kegiatan dan Anggaran Sekolah) di satuan pendidikan wilayah perbatasan;',
          'Dampak ketidaksesuaian administrasi pelaporan berisiko menghambat penyaluran dana BOSP tahap berikutnya dan menjadi temuan audit Inspektorat.'
        ],
        praanggapan: [
          'Bahwa rekonsiliasi berkas belanja modal di lokasi sekolah secara langsung mampu mengurai kendala input dan kesalahan pengisian pajak pada aplikasi ARKAS;',
          'Bahwa pendampingan teknis secara intensif melahirkan pemahaman tim BOS sekolah dalam tertib administrasi keuangan negara;',
          'Bahwa alokasi anggaran operasional pengawasan dana BOSP terverifikasi tersedia pada DPA Dinas TA 2026.'
        ],
        fakta: [
          'Jadwal monitoring dan rekonsiliasi dana BOSP dilaksanakan bertempat di SMA/SMK Negeri dan Swasta wilayah Kabupaten Nunukan;',
          'Data rekonsiliasi mencakup pembukuan kas umum, verifikasi bukti belanja fisik buku perpustakaan, sarana prasarana sekolah, dan bukti setor pajak daerah;',
          'Dokumen Pelaksanaan Anggaran (DPA) TA 2026 Sub Kegiatan Pembinaan Kelembagaan dan Manajemen SMA/SMK.'
        ],
        analisis: [
          'Bahwa monitoring langsung ke wilayah perbatasan Nunukan sangat mendesak demi menjamin kesesuaian fisik pekerjaan belanja yang dilaporkan sekolah;',
          'Bahwa tim penilai keuangan yang ditugaskan memiliki keahlian dan kualifikasi dalam verifikasi akuntansi dan audit internal;',
          'Bahwa waktu penugasan selama 4 hari kerja telah dihitung secara efisien dengan mempertimbangkan kondisi geografis wilayah sasaran.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan monev dan rekonsiliasi dana BOSP di Nunukan dinilai sangat layak dan mendesak demi menghindari penangguhan penyaluran tahap berikutnya;',
            'Rencana penugasan memenuhi syarat birokrasi dan didukung pembebanan anggaran operasional pada DPA TA 2026.'
          ],
          ringkasan: 'Pelaksanaan monev dan rekonsiliasi dana BOSP di Nunukan dinilai sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Monitoring, Evaluasi, dan Rekonsiliasi Penggunaan Dana BOSP (Bantuan Operasional Satuan Pendidikan) Jenjang SMA/SMK Kabupaten Nunukan Triwulan III TA 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Satuan Pendidikan Penerima Dana BOSP (Kab. Nunukan)',
          tempat: 'Satuan Pendidikan Penerima Dana BOSP (Kab. Nunukan)',
          selama: '4 (empat) hari kerja',
          lamanyaPerjalanan: '4 (empat) hari kerja',
          tanggal: '06 s.d. 09 Oktober 2026',
          tanggalBerangkat: '06 Oktober 2026',
          tanggalKembali: '09 Oktober 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pembinaan Kelembagaan dan Manajemen SMA/SMK',
        },
        saran: [
          'Menunjuk tim verifikator keuangan BOSP dinas yang berpengalaman untuk melaksanakan monev di Nunukan;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 05 Oktober 2026',
        }
      }),
    },
    {
      id: 'spm-akreditasi',
      title: 'Pendampingan Akreditasi & Pemenuhan Standar Mutu Pendidikan SMA/SMK',
      subtitle: 'Sub Kegiatan Pembinaan Kelembagaan dan Pemenuhan Standar Mutu Satuan Pendidikan',
      subKegiatan: 'Pembinaan Kelembagaan dan Pemenuhan Standar Mutu',
      kategoriId: 'spm',
      kategoriLabel: 'SPM & Bantuan Siswa',
      tempat: 'Satuan Pendidikan Menengah di Wilayah Kab. Malinau',
      durasi: '3 (tiga) hari kerja',
      personilCount: 2,
      icon: <Layers className="w-5 h-5 text-teal-600" />,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-spm-akreditasi-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '12 November 2026',
          nomorSurat: '400.3.8/2678/DISDIKBUD/XI/2026',
          hal: 'Pelaksanaan Pendampingan Akreditasi Sekolah dan Verifikasi Pemenuhan Standar Pelayanan Minimal (SPM) Satuan Pendidikan Menengah di Wilayah Kabupaten Malinau Tahun 2026',
        },
        persoalan: [
          'Kewajiban penjaminan mutu eksternal dan kelayakan akreditasi sekolah menengah di Kaltara sesuai standar BAN-PDM;',
          'Urgensi pendampingan langsung guna memverifikasi 4 komponen utama kinerja sekolah (mutu lulusan, proses pembelajaran, mutu guru, manajemen sekolah);',
          'Dampak penundaan pendampingan berisiko mengakibatkan penurunan status peringkat akreditasi atau kedaluwarsanya sertifikasi sekolah.'
        ],
        praanggapan: [
          'Bahwa pendampingan pengisian aplikasi SISPENA (Sistem Penilaian Akreditasi) secara langsung mampu meningkatkan persentase kesiapan dokumen unggahan;',
          'Bahwa kendala koordinasi kepala sekolah dan tim penjaminan mutu sekolah dapat diatasi secara cepat di lapangan;',
          'Bahwa anggaran kegiatan pendampingan pemenuhan standar mutu satuan pendidikan tersedia pada DPA TA 2026.'
        ],
        fakta: [
          'Jadwal pendampingan akreditasi dan pemenuhan SPM dilaksanakan bertempat di beberapa SMA/SMK Kabupaten Malinau yang memasuki masa re-akreditasi;',
          'Rangkaian aktivitas meliputi simulasi visitasi, bedah instrumen IASP, serta pemeriksaan kesesuaian sarana prasarana laboratorium sains;',
          'Data Badan Akreditasi Nasional Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah (BAN-PDM) TA 2026.'
        ],
        analisis: [
          'Bahwa pendampingan penjaminan mutu secara tatap muka sangat krusial dalam mempercepat perbaikan mutu tata kelola sekolah sasaran;',
          'Bahwa pengawas sekolah dan analis mutu yang ditugaskan memiliki kompetensi mumpuni sebagai asesor akreditasi nasional;',
          'Bahwa biaya perjalanan dirancang hemat, efisien, dan akuntabel sesuai alokasi sub-kegiatan terkait.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan verifikasi lapangan dan pendampingan akreditasi di Malinau dinyatakan layak dan mendesak demi menjaga status kelayakan institusi sekolah;',
            'Rencana penugasan memenuhi ketentuan kedinasan dan didukung pagu anggaran DPA TA 2026.'
          ],
          ringkasan: 'Pelaksanaan verifikasi lapangan dan pendampingan akreditasi di Malinau dinyatakan layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Pendampingan Akreditasi Sekolah dan Verifikasi Pemenuhan Standar Pelayanan Minimal (SPM) Satuan Pendidikan Menengah di Kabupaten Malinau TA 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Satuan Pendidikan Menengah di Wilayah Kab. Malinau',
          tempat: 'Satuan Pendidikan Menengah di Wilayah Kab. Malinau',
          selama: '3 (tiga) hari kerja',
          lamanyaPerjalanan: '3 (tiga) hari kerja',
          tanggal: '16 s.d. 18 November 2026',
          tanggalBerangkat: '16 November 2026',
          tanggalKembali: '18 November 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pemenuhan Standar Mutu Pendidikan',
        },
        saran: [
          'Menunjuk pengawas sekolah dan staf bidang pembinaan terkait untuk melaksanakan pendampingan visitasi;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 12 November 2026',
        }
      }),
    },
    {
      id: 'puspresnas-ikm',
      title: 'Bimtek Pelatihan Kurikulum Merdeka & Penyusunan Perangkat Ajar Guru SMA/SMK',
      subtitle: 'Sub Kegiatan Pembinaan Pendidik dan Tenaga Kependidikan Sekolah Menengah Atas',
      subKegiatan: 'Pembinaan Pendidik dan Tenaga Kependidikan SMA',
      kategoriId: 'puspresnas',
      kategoriLabel: 'Puspresnas & Talenta',
      tempat: 'Hotel Swiss-Belhotel Tarakan',
      durasi: '3 (tiga) hari kerja',
      personilCount: 2,
      icon: <BookOpen className="w-5 h-5 text-[#4F46E5]" />,
      badgeColor: 'bg-[#4F46E5]/10 text-[#4F46E5] border-indigo-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-puspresnas-ikm-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '14 Juli 2026',
          nomorSurat: '400.3.8/1598/DISDIKBUD/VII/2026',
          hal: 'Pelaksanaan Bimbingan Teknis Implementasi Kurikulum Merdeka (IKM) dan Penyusunan Perangkat Ajar Pembelajaran bagi Pendidik SMA/SMK Tingkat Provinsi Kalimantan Utara Tahun 2026',
        },
        persoalan: [
          'Kewajiban implementasi nasional Kurikulum Merdeka secara menyeluruh pada satuan pendidikan menengah TA 2026;',
          'Urgensi peningkatan kompetensi guru dalam menyusun Modul Ajar, Alur Tujuan Pembelajaran (ATP), dan projek profil pelajar pancasila (P5);',
          'Dampak tanpa bimtek berisiko mengakibatkan ketidakselarasan metode pembelajaran interaktif dan keterlambatan pengisian rapor Kurikulum Merdeka.'
        ],
        praanggapan: [
          'Bahwa pelatihan intensif secara langsung melahirkan agen perubahan (guru penggerak) yang mampu mendesiminasikan materi bimtek di sekolah masing-masing;',
          'Bahwa kesulitan penyusunan kriteria ketercapaian tujuan pembelajaran (KKTP) dapat diselesaikan bersama narasumber ahli;',
          'Bahwa anggaran kegiatan peningkatan kompetensi guru terverifikasi mencukupi pada DPA TA 2026.'
        ],
        fakta: [
          'Bimtek IKM dijadwalkan secara definitif diikuti oleh perwakilan guru MGMP mata pelajaran tingkat provinsi;',
          'Materi bimtek mencakup asesmen diagnostik, pembelajaran berdiferensiasi, penyusunan P5, serta pemanfaatan Platform Merdeka Mengajar (PMM);',
          'Rencana Strategis (Renstra) Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara Tahun 2026.'
        ],
        analisis: [
          'Bahwa pembekalan langsung sangat efektif untuk melatih keterampilan praktis guru dalam menyusun perangkat ajar yang kreatif;',
          'Bahwa narasumber dan fasilitator yang ditugaskan merupakan widyaprada atau instruktur nasional bersertifikat Kemendikbudristek;',
          'Bahwa pembebanan anggaran bimtek dirancang efisien dan akuntabel sesuai SBM reguler Pemerintah Provinsi.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Penyelenggaraan Bimtek IKM dinyatakan sangat layak dan mendesak demi menyukseskan adaptasi kurikulum nasional di seluruh sekolah Kaltara;',
            'Rencana kegiatan memenuhi syarat kedinasan serta didukung alokasi pagu DPA Bidang Ketenagaan Disdikbud TA 2026.'
          ],
          ringkasan: 'Penyelenggaraan Bimtek IKM dinyatakan sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Bimbingan Teknis Implementasi Kurikulum Merdeka (IKM) dan Penyusunan Perangkat Ajar Pembelajaran bagi Pendidik SMA/SMK Tingkat Provinsi Kaltara Tahun 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'Hotel Swiss-Belhotel Tarakan',
          tempat: 'Hotel Swiss-Belhotel Tarakan',
          selama: '3 (tiga) hari kerja',
          lamanyaPerjalanan: '3 (tiga) hari kerja',
          tanggal: '20 s.d. 22 Juli 2026',
          tanggalBerangkat: '20 Juli 2026',
          tanggalKembali: '22 Juli 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pembinaan Pendidik dan Tenaga Kependidikan',
        },
        saran: [
          'Menunjuk widyaprada/panitia pelaksana bidang ketenagaan yang berkompeten untuk mengawal kegiatan bimtek guru;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 14 Juli 2026',
        }
      }),
    },
    {
      id: 'prioritas-perbatasan',
      title: 'Peninjauan Khusus Pemenuhan Sarpras Layanan Pendidikan Daerah 3T Perbatasan',
      subtitle: 'Sub Kegiatan Pembinaan Kelembagaan dan Pemeliharaan Sarana Prasarana SMA di Perbatasan',
      subKegiatan: 'Pembinaan Kelembagaan dan Sarpras SMA Perbatasan',
      kategoriId: 'prioritas',
      kategoriLabel: 'Prioritas Lintas Sektor',
      tempat: 'SMA Negeri Wilayah Krayan (Perbatasan RI-Malaysia)',
      durasi: '5 (lima) hari kerja',
      personilCount: 2,
      icon: <Compass className="w-5 h-5 text-rose-600" />,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      getData: () => ({
        ...SAMPLE_TELAAHAN_KALTARA,
        id: 'tpl-prioritas-perbatasan-2026',
        header: {
          ...SAMPLE_TELAAHAN_KALTARA.header,
          tanggalSurat: '01 September 2026',
          nomorSurat: '400.3.8/1989/DISDIKBUD/IX/2026',
          hal: 'Pelaksanaan Peninjauan Khusus, Verifikasi Kelayakan, dan Pemetaan Kebutuhan Sarana Prasarana Pendidikan Daerah Terdepan, Terluar, dan Tertinggal (3T) di Wilayah Krayan Perbatasan RI-Malaysia TA 2026',
        },
        persoalan: [
          'Ketimpangan fasilitas sarana prasarana belajar mengajar pada sekolah perbatasan RI-Malaysia yang menghambat kualitas SPM pendidikan;',
          'Urgensi peninjauan fisik kelayakan bangunan kelas, asrama siswa perbatasan, dan akses internet guna persiapan ANBK (Asesmen Nasional Berbasis Komputer);',
          'Dampak penundaan pemetaan berisiko menggagalkan pelaksanaan ujian nasional berbasis komputer serta membiarkan kerusakan ruang kelas semakin parah.'
        ],
        praanggapan: [
          'Bahwa peninjauan langsung ke Krayan menghasilkan rekomendasi teknis prioritas rehabilitasi sarana kelas dan instalasi VSAT secara akurat;',
          'Bahwa kendala ketiadaan pasokan listrik PLN dapat dipecahkan melalui usulan pengadaan genset/pembangkit surya bersama dinas terkait;',
          'Bahwa alokasi anggaran perencanaan pembangunan sarpras daerah 3T tersedia pada APBD Provinsi TA 2026.'
        ],
        fakta: [
          'Peninjauan khusus dilaksanakan di beberapa SMA Negeri di wilayah Krayan yang berbatasan langsung dengan Sabah/Serawak Malaysia;',
          'Kondisi sekolah mengalami keterbatasan akses logistik darat, kerusakan ruang laboratorium komputer, serta belum tersedianya listrik 24 jam;',
          'Instruksi Presiden Republik Indonesia perihal Percepatan Pembangunan Daerah Perbatasan Negara 3T Bidang Layanan Dasar Pendidikan.'
        ],
        analisis: [
          'Bahwa verifikasi lapangan sangat krusial guna menghindari ketidaktepatan alokasi anggaran pembangunan sarpras yang diusulkan pihak sekolah;',
          'Bahwa tim penilai infrastruktur yang ditugaskan merupakan analis sarana prasarana dinas yang memiliki keahlian survei kelayakan bangunan;',
          'Bahwa alokasi durasi 5 hari kerja diperlukan mengingat penerbangan perintis (penerbangan subsidi) ke Krayan sangat tergantung pada kondisi cuaca.'
        ],
        kesimpulan: {
          ...SAMPLE_TELAAHAN_KALTARA.kesimpulan,
          poin: [
            'Pelaksanaan peninjauan dan pemetaan sarpras ke Krayan dinyatakan sangat layak dan mendesak demi menjamin hak kesetaraan belajar siswa perbatasan;',
            'Draf telaahan dinilai memenuhi syarat formal kedinasan dan didukung pembebanan anggaran yang sah pada DPA TA 2026.'
          ],
          ringkasan: 'Pelaksanaan peninjauan dan pemetaan sarpras ke Krayan dinyatakan sangat layak, mendesak, dan memenuhi seluruh syarat administratif serta alokasi anggaran DPA TA 2026.',
          maksudPerjalanan: 'Peninjauan Khusus, Verifikasi Kelayakan, dan Pemetaan Kebutuhan Sarana Prasarana Pendidikan Daerah 3T di Wilayah Krayan Perbatasan RI-Malaysia TA 2026',
          tempatBerangkat: 'Tanjung Selor',
          tempatTujuan: 'SMA Negeri Wilayah Krayan (Perbatasan RI-Malaysia)',
          tempat: 'SMA Negeri Wilayah Krayan (Perbatasan RI-Malaysia)',
          selama: '5 (lima) hari kerja',
          lamanyaPerjalanan: '5 (lima) hari kerja',
          tanggal: '07 s.d. 11 September 2026',
          tanggalBerangkat: '07 September 2026',
          tanggalKembali: '11 September 2026',
          pembebananAnggaran: 'DPA Disdikbud Prov. Kaltara TA 2026 Sub-Kegiatan Pembinaan Sarana Prasarana SMA Perbatasan',
        },
        saran: [
          'Menunjuk tim teknis sarana prasarana dinas untuk melaksanakan kunjungan lapangan khusus ke Krayan;',
          'Memohon persetujuan dan penerbitan SPT serta SPPD bagi pelaksana tugas dengan pembebanan anggaran DPA TA 2026.'
        ],
        kaki: {
          ...SAMPLE_TELAAHAN_KALTARA.kaki,
          tempatTanggal: 'Tanjung Selor, 01 September 2026',
        }
      }),
    },
  ];

  const categories = [
    { id: 'semua', label: 'Semua Agenda', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'puspresnas', label: '1. Puspresnas & Talenta', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'tatakelola', label: '2. Tata Kelola & Dapodik', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'prioritas', label: '3. Prioritas Lintas Sektor', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'spm', label: '4. SPM & Bantuan Siswa', icon: <PackageCheck className="w-3.5 h-3.5" /> },
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'semua' || tpl.kategoriId === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.subKegiatan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto print:hidden animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] sm:my-auto animate-in zoom-in-95 duration-200">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-[#4F46E5] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Crown className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Galeri Template Telaahan Staf
              </h3>
              <p className="text-xs text-purple-100 font-medium">
                Pilih skenario DPA yang sesuai. Data SPT &amp; SPPD akan tersinkronisasi otomatis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar - Sticky below header */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 shrink-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari skenario, sub kegiatan, atau lokasi dinas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7F56D9] placeholder:text-slate-400 font-medium transition shadow-3xs"
            />
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin select-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#7F56D9] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List of Templates - Scrollable */}
        <div className="p-3 sm:p-4 space-y-2 overflow-y-auto flex-1 max-h-[50vh]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              Tidak ada template yang cocok dengan kata kunci pencarian.
            </div>
          ) : (
            filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => {
                  onSelectTemplate(tpl.getData());
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-300 bg-white hover:bg-purple-50/20 cursor-pointer transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8.5 h-8.5 rounded-xl bg-purple-50 group-hover:bg-white border border-purple-100 flex items-center justify-center flex-shrink-0 transition shadow-3xs">
                    {tpl.icon}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${tpl.badgeColor}`}>
                        {tpl.kategoriLabel}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold">
                        {tpl.durasi}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-800 text-[11.5px] sm:text-xs group-hover:text-[#7F56D9] transition leading-tight truncate">
                      {tpl.title}
                    </h4>

                    <p className="text-[9.5px] text-slate-400 font-medium truncate leading-none">
                      📍 {tpl.tempat}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1 bg-purple-50 hover:bg-[#7F56D9]/10 text-[#7F56D9] border border-purple-200 rounded-full text-[10px] font-extrabold transition-shrink-0 cursor-pointer active:scale-95"
                >
                  Gunakan
                </button>
              </div>
            ))
          )}

          {/* Blank Option */}
          <div
            onClick={() => {
              onSelectTemplate(BLANK_TELAAHAN);
              onClose();
            }}
            className="p-3 rounded-xl border-2 border-dashed border-purple-200 hover:border-[#7F56D9] hover:bg-purple-50/20 text-[#7F56D9] cursor-pointer transition text-center text-[11px] font-extrabold active:scale-[0.99]"
          >
            + Formulir Kosong (Mulai dari Awal)
          </div>
        </div>

        {/* Footer Actions - Sticky */}
        <div className="px-6 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between shrink-0 sticky bottom-0 z-10">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Standar Permendagri No. 1/2023 • Kalibrasi Cetak Presisi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-xs font-bold text-slate-700 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-500" />
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
