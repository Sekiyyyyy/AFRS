# Walkthrough: Redesain Halaman Login (Modern & Clean) dan Pembersihan Label PKL

Menindaklanjuti masukan pengguna:
1. **Rute Utama Langsung ke Login (`/` $\rightarrow$ `/login`)**: Halaman landing bawaan Breeze dihilangkan. Pengguna yang mengakses domain utama langsung diarahkan ke form otentikasi login.
2. **Pembersihan Total Keterangan "Simulasi PKL"**: Semua teks "Simulasi PKL" dihapus dari backend middleware (`HandleInertiaRequests`), layout utama (`AuthenticatedLayout`), dashboard, form pelaporan, dan footer. Aplikasi kini tampil sebagai sistem enterprise resmi dan profesional **"AirNav Indonesia Cabang Medan — Facility Reporting & Management System (AFRS)"**.
3. **Redesain Total Halaman Login (`resources/js/Pages/Auth/Login.tsx`)**:
   * **Arsitektur Split-Screen Modern (Linear/Stripe Enterprise Style)**:
     * **Sisi Kiri (Hero Showcase)**: Menggunakan palet Deep Navy (`#0B1728`) elegan dengan ambient glow halus, logo resmi lanskap putih AirNav Indonesia, tipografi tegas, serta 3 kartu ringkasan keunggulan sistem (Penanganan Cepat & Terstruktur, Manajemen Penugasan Teknisi, Live Chat & Verifikasi Hasil).
     * **Sisi Kanan (Formulir Minimalis & Bersih)**: Latar belakang bersih, logo AirNav warna, field input dengan ikon (*User* & *Lock*), tombol intip password (*Eye toggle*), efek fokus halus (`focus:ring-4 focus:ring-sky-500/10`), tombol login gradasi korporat, serta pemilih akun demo yang rapi dan terorganisir.
   * **Testing & Build**:
     * 25 Test cases Pest PHP lulus 100% (Green).
     * Kompilasi bundle Vite & TypeScript sukses tanpa error.
