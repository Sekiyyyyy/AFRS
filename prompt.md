# PROJECT SPECIFICATION

# Sistem Manajemen Pelaporan Kerusakan Fasilitas (AFRS)

**Project Type:** Web-Based Facility Damage Reporting and Management System
**Project Context:** Praktik Kerja Lapangan (PKL)
**Organization Context:** Simulasi sistem pendukung untuk lingkungan kerja AirNav Indonesia Cabang Medan
**Developer:** Single Developer / Student PKL
**Primary Goal:** Membangun sistem pelaporan, pengelolaan, monitoring, dan komunikasi penanganan kerusakan fasilitas perusahaan.

---

# 1. PROJECT OVERVIEW

Saya sedang merancang dan mengembangkan sebuah website bernama:

**AFRS — Facility Reporting System**

Sistem ini merupakan aplikasi web untuk membantu karyawan melaporkan kerusakan fasilitas di lingkungan kerja, kemudian memungkinkan unit support atau teknisi yang bertanggung jawab menerima, memproses, memperbarui status, dan mendokumentasikan penanganan laporan.

Sistem dirancang sebagai **simulasi sistem pendukung untuk keperluan tugas PKL**, bukan sebagai sistem resmi milik AirNav Indonesia. Jangan mengklaim bahwa sistem telah terintegrasi dengan sistem internal perusahaan atau telah disetujui oleh AirNav Indonesia.

## 1.1 Latar Belakang

Selama melaksanakan PKL di AirNav Indonesia Cabang Medan, saya mengamati bahwa perusahaan telah memiliki berbagai sistem informasi yang mendukung aktivitas operasional dan administrasi.

Namun, berdasarkan pengamatan selama PKL, saya belum menemukan sistem yang secara khusus saya amati digunakan untuk memudahkan karyawan melaporkan kerusakan fasilitas di lingkungan kerja.

Oleh karena itu, saya merancang AFRS sebagai simulasi sistem pendukung yang dapat membantu proses pelaporan kerusakan fasilitas kepada unit yang bertanggung jawab, memudahkan pemantauan status penanganan, dan menyediakan riwayat komunikasi antara pelapor dan teknisi support.

## 1.2 Batasan Konteks

Sistem berfokus pada fasilitas pendukung operasional dan administrasi kantor, seperti:

* Komputer dan workstation.
* Printer dan scanner.
* AC dan ventilasi.
* Lampu dan penerangan.
* CCTV.
* Jaringan internet dan perangkat jaringan.
* Telepon internal.
* Meja dan kursi.
* Proyektor.
* Fasilitas pendukung kantor lainnya.

Sistem tidak boleh mengendalikan perangkat operasional penerbangan, sistem navigasi penerbangan, peralatan keselamatan penerbangan, atau sistem kritis Air Traffic Control.

Laporan fasilitas pendukung harus dipisahkan dari pelaporan gangguan operasional penerbangan dan prosedur resmi perusahaan.

---

# 2. OBJECTIVES

## 2.1 Tujuan Utama

Membangun sistem pelaporan kerusakan fasilitas yang terstruktur, mudah digunakan, dan memiliki alur penanganan yang dapat dipantau oleh pelapor, teknisi, dan administrator.

## 2.2 Tujuan Khusus

1. Memudahkan karyawan mengirim laporan kerusakan fasilitas.
2. Mempermudah unit support menerima dan mengelola laporan.
3. Menyediakan penugasan laporan kepada teknisi yang bertanggung jawab.
4. Menyediakan status penanganan yang jelas.
5. Menyediakan riwayat aktivitas setiap laporan.
6. Memungkinkan komunikasi antara pelapor dan teknisi melalui live chat.
7. Menyediakan dashboard statistik untuk monitoring.
8. Menggunakan database relasional MySQL dengan struktur yang terorganisasi.
9. Menerapkan validasi, autentikasi, dan otorisasi berdasarkan role pengguna.
10. Menyediakan dokumentasi dan riwayat penanganan yang dapat digunakan untuk evaluasi.

---

# 3. DEVELOPMENT PRINCIPLES

Ikuti prinsip berikut selama pengembangan:

1. Utamakan keamanan, maintainability, dan kemudahan pengembangan.
2. Jangan membuat fitur secara acak tanpa menganalisis kebutuhan.
3. Jangan langsung menulis seluruh kode sebelum rancangan sistem disetujui.
4. Gunakan database relasional dengan foreign key dan integritas data.
5. Hindari duplikasi data yang tidak diperlukan.
6. Gunakan Laravel Eloquent dan relasi model dengan benar.
7. Gunakan Form Request Laravel untuk validasi server-side.
8. Gunakan React Hook Form dan Zod untuk validasi client-side jika sesuai.
9. Validasi client-side tidak boleh menggantikan validasi server-side.
10. Gunakan Laravel Policies atau Gates untuk otorisasi.
11. Jangan mempercayai role atau ID yang dikirim dari frontend.
12. Jangan menghapus data laporan penting secara permanen tanpa pertimbangan audit.
13. Gunakan soft delete pada entitas yang memang memerlukan pemulihan.
14. Gunakan database transaction untuk operasi yang melibatkan beberapa perubahan data.
15. Hindari overengineering yang tidak diperlukan untuk proyek PKL.
16. Gunakan komponen UI reusable dan konsisten.
17. Jangan menggunakan data pribadi atau data internal perusahaan yang tidak berwenang.
18. Jangan membuat integrasi dengan sistem resmi AirNav tanpa izin dan spesifikasi yang sah.

---

# 4. TECHNOLOGY STACK

## 4.1 Backend

* Laravel 12.
* PHP 8.3+.
* Laravel Eloquent ORM.
* Laravel Form Requests.
* Laravel Policies and Gates.
* Laravel Events and Listeners.
* Laravel Notifications.
* Laravel Queues jika diperlukan.

## 4.2 Frontend

* React 19.
* Inertia.js 2.
* Vite.
* TypeScript.
* Tailwind CSS 4.
* shadcn/ui.
* Lucide React.
* Motion.
* TanStack Table.
* Recharts.
* Sonner.
* React Hook Form.
* Zod.
* React Dropzone jika dibutuhkan.

## 4.3 Realtime Communication

* Laravel Reverb.
* Laravel Echo.
* Laravel Broadcasting.
* Private channels untuk percakapan yang memiliki akses terbatas.
* Database sebagai sumber utama penyimpanan pesan.

Fitur realtime harus memiliki fallback yang wajar jika koneksi WebSocket terputus. Pesan tetap disimpan di database dan dapat dimuat kembali melalui HTTP.

## 4.4 Database and Infrastructure

* MySQL 8.0+ atau MySQL 8.4 LTS.
* Redis untuk queue, cache, dan kebutuhan realtime jika diperlukan.
* Laravel Storage untuk penyimpanan lampiran.
* Git dan GitHub.
* Laravel Pint.
* ESLint dan Prettier.

## 4.5 Export and Testing

* Laravel Excel untuk export XLSX.
* DomPDF untuk export PDF.
* Pest PHP untuk pengujian aplikasi.
* PHPUnit compatibility jika diperlukan oleh framework atau library.

Gunakan versi paket yang kompatibel dengan Laravel 12, PHP 8.3+, dan konfigurasi proyek. Jangan memaksakan versi paket yang tidak kompatibel.

---

# 5. DEVELOPMENT WORKFLOW

## PHASE 0 — PROJECT DISCOVERY
## PHASE 1 — SYSTEM ANALYSIS
## PHASE 2 — DATABASE DESIGN
## PHASE 3 — AUTHENTICATION AND AUTHORIZATION
## PHASE 4 — CORE REPORTING SYSTEM
## PHASE 5 — LIVE CHAT
## PHASE 6 — DASHBOARD AND REPORTING
## PHASE 7 — TESTING AND QUALITY ASSURANCE
## PHASE 8 — DOCUMENTATION

---

# 6. SYSTEM REQUIREMENTS

## 6.1 Functional Requirements
* Pengguna melakukan login dan logout.
* Pengguna mengakses dashboard sesuai role.
* Pelapor membuat laporan kerusakan fasilitas.
* Pelapor melihat riwayat laporan miliknya.
* Pelapor melihat status laporan.
* Pelapor berkomunikasi dengan teknisi terkait.
* Teknisi melihat laporan yang ditugaskan.
* Teknisi memperbarui proses penanganan.
* Teknisi mengirim pesan melalui live chat.
* Supervisor mengelola dan memantau laporan unit.
* Administrator mengelola data master dan pengguna sesuai kewenangan.
* Sistem mencatat riwayat aktivitas penting.
* Sistem menyediakan filter dan pencarian.
* Sistem menyediakan laporan statistik.
* Sistem menyediakan export data sesuai hak akses.

## 6.2 Non-Functional Requirements
* Responsif pada desktop, tablet, dan perangkat mobile.
* UI konsisten dan mudah digunakan.
* Validasi server-side dan client-side.
* Otorisasi pada setiap endpoint yang relevan.
* Password disimpan menggunakan mekanisme hashing Laravel.
* Upload file menggunakan validasi MIME, ukuran, dan ekstensi yang sesuai.
* Database menggunakan foreign key dan index yang relevan.
* Realtime chat memperhatikan keamanan private channel.
* Kode mudah dipelihara dan dikembangkan.
* Sistem memiliki penanganan error yang informatif tanpa membocorkan data sensitif.
* Sistem tidak bergantung pada koneksi realtime untuk mempertahankan data pesan.

---

# 7. ACTORS AND ROLES

## 7.1 Employee / Pelapor
## 7.2 Support Technician / Teknisi
## 7.3 Support Supervisor / Unit Support
## 7.4 Administrator

---

# 8. PERMISSIONS AND AUTHORIZATION
Gunakan Laravel Policies, Gates, atau mekanisme authorization yang sesuai.

---

# 9. BUSINESS WORKFLOW

## 9.1 Alur Laporan
1. Pelapor login.
2. Pelapor membuka halaman buat laporan.
3. Pelapor memilih kategori fasilitas.
4. Pelapor memilih lokasi fasilitas.
5. Pelapor memasukkan judul dan deskripsi kerusakan.
6. Pelapor menentukan informasi yang diperlukan sesuai kebijakan sistem.
7. Pelapor mengunggah foto jika tersedia.
8. Sistem melakukan validasi.
9. Sistem menyimpan laporan dengan status `SUBMITTED`.
10. Sistem membuat nomor laporan unik.
11. Sistem mencatat aktivitas pembuatan laporan.
12. Unit support menerima atau melihat laporan.
13. Supervisor melakukan triase jika diperlukan.
14. Laporan ditugaskan kepada teknisi.
15. Teknisi memproses laporan.
16. Teknisi memperbarui status.
17. Pelapor dapat berkomunikasi melalui chat.
18. Teknisi mengunggah hasil penanganan jika diperlukan.
19. Laporan masuk ke status penyelesaian atau menunggu konfirmasi.
20. Pelapor memberikan konfirmasi jika fitur tersebut diaktifkan.
21. Sistem mencatat riwayat penanganan.
22. Laporan ditutup sesuai aturan yang ditentukan.

## 9.2 Alur Live Chat
1. Laporan telah dibuat dan memiliki akses pengguna yang sesuai.
2. Chat tersedia berdasarkan status dan aturan akses.
3. Pelapor mengirim pesan.
4. Server memvalidasi akses dan isi pesan.
5. Pesan disimpan ke database.
6. Sistem mengirim event broadcast melalui private channel.
7. Teknisi menerima pembaruan realtime.
8. Teknisi membalas pesan.
9. Pesan disimpan dan dikirim kepada pihak yang berhak.
10. Riwayat chat dapat dimuat ulang saat halaman dibuka.
11. Jika realtime tidak tersedia, pengguna tetap dapat melihat pesan melalui request HTTP atau mekanisme fallback yang sesuai.

---

# 10. DATABASE DESIGN
...
# 11. REPORT STATUS
* `SUBMITTED` — Laporan baru dikirim.
* `UNDER_REVIEW` — Laporan sedang ditinjau.
* `ASSIGNED` — Laporan telah ditugaskan.
* `IN_PROGRESS` — Penanganan sedang berlangsung.
* `WAITING_INFORMATION` — Menunggu informasi tambahan.
* `ON_HOLD` — Penanganan ditunda dengan alasan yang tercatat.
* `RESOLVED` — Teknisi menyatakan penanganan selesai.
* `VERIFICATION` — Menunggu verifikasi jika diperlukan.
* `CLOSED` — Laporan ditutup.
* `REJECTED` — Laporan ditolak dengan alasan yang jelas.

---

# 22. FIRST TASK — START WITH DATABASE DESIGN
Mulai sekarang dari PHASE 2: DATABASE DESIGN.
