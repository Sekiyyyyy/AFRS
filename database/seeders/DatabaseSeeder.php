<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Department;
use App\Models\Facility;
use App\Models\FacilityCategory;
use App\Models\FacilityLocation;
use App\Models\Message;
use App\Models\Report;
use App\Models\ReportAssignment;
use App\Models\ReportStatusHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Departments
        $deptIt = Department::create([
            'name' => 'Unit Pengendalian & Otomasi Pelayanan (IT)',
            'code' => 'IT',
            'description' => 'Unit yang bertanggung jawab atas infrastruktur IT, jaringan, dan perangkat komputasi kantor.',
            'is_active' => true,
        ]);

        $deptTbl = Department::create([
            'name' => 'Unit Teknik Bangunan & Landasan',
            'code' => 'TBL',
            'description' => 'Unit penunjang fasilitas mekanikal, elektrikal gedung, AC, dan perabot perkantoran.',
            'is_active' => true,
        ]);

        $deptKeu = Department::create([
            'name' => 'Unit Keuangan & Administrasi Umum',
            'code' => 'KEU',
            'description' => 'Unit administrasi, keuangan, dan tata usaha cabang.',
            'is_active' => true,
        ]);

        $deptOps = Department::create([
            'name' => 'Unit Operasi Pelayanan Lalu Lintas Penerbangan',
            'code' => 'OPS',
            'description' => 'Unit penunjang operasional pelayanan navigasi udara.',
            'is_active' => true,
        ]);

        // 2. Users (Admin, Support/Teknik, Pegawai/User)
        $password = Hash::make('password');







                $admin = User::create([
            'name' => 'Administrator Sistem AFRS',
            'username' => 'admin',
            'email' => 'admin@afrs.test',
            'password' => $password,
            'department_id' => $deptIt->id,
            'phone' => '081234567890',
            'role' => 'admin',
            'is_active' => true,
        ]);

        $tech1 = User::create([
            'name' => 'Budi Prasetyo (Teknisi IT)',
            'username' => 'technician',
            'email' => 'technician@afrs.test',
            'password' => $password,
            'department_id' => $deptIt->id,
            'phone' => '081234567892',
            'role' => 'technician',
            'is_active' => true,
        ]);

        $tech2 = User::create([
            'name' => 'Dimas Saputra (Teknisi Gedung/AC)',
            'username' => 'dimas_tech',
            'email' => 'dimas@afrs.test',
            'password' => $password,
            'department_id' => $deptTbl->id,
            'phone' => '081234567893',
            'role' => 'technician',
            'is_active' => true,
        ]);

        $employee1 = User::create([
            'name' => 'Siti Rahma (Staff Keuangan)',
            'username' => 'employee',
            'email' => 'employee@afrs.test',
            'password' => $password,
            'department_id' => $deptKeu->id,
            'phone' => '081234567894',
            'role' => 'employee',
            'is_active' => true,
        ]);

        $employee2 = User::create([
            'name' => 'Agus Setiawan (Staff Operasi)',
            'username' => 'agus_ops',
            'email' => 'agus@afrs.test',
            'password' => $password,
            'department_id' => $deptOps->id,
            'phone' => '081234567895',
            'role' => 'employee',
            'is_active' => true,
        ]);
// 3. Facility Categories
        $catIt = FacilityCategory::create([
            'name' => 'Perangkat Komputer & Periferal',
            'slug' => 'hardware-it',
            'description' => 'Komputer PC, monitor, keyboard, mouse, printer, dan scanner.',
            'icon' => 'Monitor',
            'is_active' => true,
        ]);

        $catNet = FacilityCategory::create([
            'name' => 'Jaringan & Internet Kantor',
            'slug' => 'jaringan-internet',
            'description' => 'Router, switch, access point WiFi, dan kabel LAN perkantoran.',
            'icon' => 'Wifi',
            'is_active' => true,
        ]);

        $catAc = FacilityCategory::create([
            'name' => 'Pendingin Udara (AC) & Ventilasi',
            'slug' => 'ac-ventilasi',
            'description' => 'AC Split, AC Standing, dan exhaust fan ruangan kerja.',
            'icon' => 'Wind',
            'is_active' => true,
        ]);

        $catListrik = FacilityCategory::create([
            'name' => 'Kelistrikan & Penerangan',
            'slug' => 'kelistrikan-lampu',
            'description' => 'Lampu ruangan, saklar, stop kontak, dan panel distribusi daya lokal.',
            'icon' => 'Zap',
            'is_active' => true,
        ]);

        $catPerabot = FacilityCategory::create([
            'name' => 'Perabot & Fasilitas Ruangan',
            'slug' => 'perabot-fasilitas',
            'description' => 'Meja kerja, kursi kantor, proyektor ruang rapat, dan whiteboard.',
            'icon' => 'Armchair',
            'is_active' => true,
        ]);

        // 4. Facility Locations
        $locRapat = FacilityLocation::create([
            'building' => 'Gedung Administrasi',
            'floor' => 'Lantai 2',
            'room_name' => 'Ruang Rapat Utama Kualanamu',
            'description' => 'Ruang rapat koordinasi pimpinan dan staf di lantai 2.',
        ]);

        $locIt = FacilityLocation::create([
            'building' => 'Gedung Administrasi',
            'floor' => 'Lantai 2',
            'room_name' => 'Ruang Subseksi IT & Otomasi',
            'description' => 'Ruang kerja teknisi IT dan otomasi.',
        ]);

        $locLobi = FacilityLocation::create([
            'building' => 'Gedung Administrasi',
            'floor' => 'Lantai 1',
            'room_name' => 'Lobi Utama & Pelayanan Tamu',
            'description' => 'Area pintu masuk utama dan pelayanan resepsionis.',
        ]);

        $locKeu = FacilityLocation::create([
            'building' => 'Gedung Administrasi',
            'floor' => 'Lantai 1',
            'room_name' => 'Ruang Keuangan & Umum',
            'description' => 'Ruang kerja staf keuangan dan perbendaharaan.',
        ]);

        // 5. Facilities
        $facAcRapat = Facility::create([
            'category_id' => $catAc->id,
            'location_id' => $locRapat->id,
            'facility_code' => 'AST-AC-001',
            'name' => 'AC Daikin Inverter 2PK Ruang Rapat',
            'brand_model' => 'Daikin FTKQ50SVM4',
            'serial_number' => 'DKN-2023-99812',
            'status' => 'damaged',
            'notes' => 'Terpasang di sisi timur ruang rapat.',
        ]);

        $facPrinter = Facility::create([
            'category_id' => $catIt->id,
            'location_id' => $locKeu->id,
            'facility_code' => 'AST-PRN-003',
            'name' => 'Printer HP LaserJet Pro MFP',
            'brand_model' => 'HP LaserJet Pro M428fdw',
            'serial_number' => 'VNC3K04192',
            'status' => 'operational',
            'notes' => 'Printer sentral administrasi keuangan.',
        ]);

        $facWifi = Facility::create([
            'category_id' => $catNet->id,
            'location_id' => $locLobi->id,
            'facility_code' => 'AST-AP-008',
            'name' => 'Access Point Cisco Lobi Utama',
            'brand_model' => 'Cisco Catalyst 9115AX',
            'serial_number' => 'FOC24194R2L',
            'status' => 'operational',
            'notes' => 'Menyediakan WiFi tamu dan staf lobi.',
        ]);

        // 6. Reports Simulation
        // Report 1: In Progress
        $report1 = Report::create([
            'ticket_number' => 'REP-' . date('Ymd') . '-0001',
            'reporter_id' => $employee1->id,
            'department_id' => $deptKeu->id,
            'category_id' => $catAc->id,
            'location_id' => $locRapat->id,
            'facility_id' => $facAcRapat->id,
            'title' => 'AC Ruang Rapat Utama Bocor dan Tidak Dingin',
            'description' => 'Saat digunakan rapat pagi ini, unit indoor AC mengeluarkan tetesan air cukup deras dan hembusan udara tidak terasa dingin.',
            'priority' => 'high',
            'status' => 'in_progress',
            'submitted_at' => now()->subHours(5),
        ]);

        ReportStatusHistory::create([
            'report_id' => $report1->id,
            'user_id' => $employee1->id,
            'from_status' => null,
            'to_status' => 'submitted',
            'action_note' => 'Laporan dibuat oleh pelapor.',
            'created_at' => now()->subHours(5),
        ]);

        ReportStatusHistory::create([
            'report_id' => $report1->id,
            'user_id' => $admin->id,
            'from_status' => 'submitted',
            'to_status' => 'under_review',
            'action_note' => 'Laporan diverifikasi oleh administrator.',
            'created_at' => now()->subHours(4),
        ]);

        ReportStatusHistory::create([
            'report_id' => $report1->id,
            'user_id' => $admin->id,
            'from_status' => 'under_review',
            'to_status' => 'assigned',
            'action_note' => 'Ditugaskan kepada teknisi Dimas Saputra.',
            'created_at' => now()->subHours(3),
        ]);

        ReportStatusHistory::create([
            'report_id' => $report1->id,
            'user_id' => $tech2->id,
            'from_status' => 'assigned',
            'to_status' => 'in_progress',
            'action_note' => 'Teknisi melakukan pengecekan filter dan pipa pembuangan di lokasi.',
            'created_at' => now()->subHours(2),
        ]);

        ReportAssignment::create([
            'report_id' => $report1->id,
            'technician_id' => $tech2->id,
            'assigned_by' => $admin->id,
            'status' => 'active',
            'notes' => 'Harap segera dicek sebelum jadwal rapat pimpinan pukul 14.00 WIB.',
            'assigned_at' => now()->subHours(3),
        ]);

        $conv1 = Conversation::create([
            'report_id' => $report1->id,
            'is_locked' => false,
            'last_message_at' => now()->subMinutes(30),
        ]);

        Message::create([
            'conversation_id' => $conv1->id,
            'sender_id' => $employee1->id,
            'message' => 'Selamat siang Pak Dimas, apakah sudah ada perkiraan jam berapa unit AC diperiksa?',
            'is_read' => true,
            'read_at' => now()->subMinutes(45),
            'created_at' => now()->subMinutes(50),
        ]);

        Message::create([
            'conversation_id' => $conv1->id,
            'sender_id' => $tech2->id,
            'message' => 'Siang Bu Siti, kami sedang mengambil alat servis manifold dan tangga. Sekitar 10 menit lagi kami sampai di ruang rapat.',
            'is_read' => true,
            'read_at' => now()->subMinutes(25),
            'created_at' => now()->subMinutes(30),
        ]);

        // Report 2: Resolved
        $report2 = Report::create([
            'ticket_number' => 'REP-' . date('Ymd') . '-0002',
            'reporter_id' => $employee1->id,
            'department_id' => $deptKeu->id,
            'category_id' => $catIt->id,
            'location_id' => $locKeu->id,
            'facility_id' => $facPrinter->id,
            'title' => 'Printer Keuangan Mengalami Paper Jam & Error Roller',
            'description' => 'Kertas tersangkut di bagian penarik utama dan lampu indikator printer berkedip oranye terus-menerus.',
            'priority' => 'medium',
            'status' => 'resolved',
            'resolution_notes' => 'Pembersihan pickup roller dan penggantian cartridge toner cadangan. Hasil cetak 20 lembar lancar.',
            'submitted_at' => now()->subDays(1),
            'resolved_at' => now()->subHours(6),
        ]);

        ReportStatusHistory::create([
            'report_id' => $report2->id,
            'user_id' => $employee1->id,
            'from_status' => null,
            'to_status' => 'submitted',
            'action_note' => 'Laporan dibuat oleh pelapor.',
            'created_at' => now()->subDays(1),
        ]);

        ReportStatusHistory::create([
            'report_id' => $report2->id,
            'user_id' => $tech1->id,
            'from_status' => 'in_progress',
            'to_status' => 'resolved',
            'action_note' => 'Perbaikan selesai dilaksanakan dan diuji coba.',
            'created_at' => now()->subHours(6),
        ]);

        ReportAssignment::create([
            'report_id' => $report2->id,
            'technician_id' => $tech1->id,
            'assigned_by' => $admin->id,
            'status' => 'completed',
            'notes' => 'Prioritas penanganan dokumen pencairan.',
            'assigned_at' => now()->subDays(1),
            'completed_at' => now()->subHours(6),
        ]);

        $conv2 = Conversation::create([
            'report_id' => $report2->id,
            'is_locked' => false,
            'last_message_at' => now()->subHours(6),
        ]);

        Message::create([
            'conversation_id' => $conv2->id,
            'sender_id' => $tech1->id,
            'message' => 'Printer sudah selesai diperbaiki dan siap digunakan kembali Bu.',
            'is_read' => true,
            'read_at' => now()->subHours(5),
            'created_at' => now()->subHours(6),
        ]);

        // Report 3: Submitted (New)
        $report3 = Report::create([
            'ticket_number' => 'REP-' . date('Ymd') . '-0003',
            'reporter_id' => $employee2->id,
            'department_id' => $deptOps->id,
            'category_id' => $catNet->id,
            'location_id' => $locLobi->id,
            'facility_id' => $facWifi->id,
            'title' => 'Sinyal WiFi di Area Lobi Terputus-putus',
            'description' => 'Beberapa tamu dan petugas di lobi mengeluhkan koneksi SSID internal sering mengalami request timeout.',
            'priority' => 'low',
            'status' => 'submitted',
            'submitted_at' => now()->subMinutes(15),
        ]);

        ReportStatusHistory::create([
            'report_id' => $report3->id,
            'user_id' => $employee2->id,
            'from_status' => null,
            'to_status' => 'submitted',
            'action_note' => 'Tiket laporan baru berhasil diajukan.',
            'created_at' => now()->subMinutes(15),
        ]);

        Conversation::create([
            'report_id' => $report3->id,
            'is_locked' => false,
            'last_message_at' => null,
        ]);
    }
}

