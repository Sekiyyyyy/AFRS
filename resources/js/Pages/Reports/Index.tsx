import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Report, FacilityCategory, FacilityLocation } from "@/types";
import { getPriorityBadge, getStatusBadge, formatDate } from "@/lib/utils";
import {
    PlusCircle,
    Search,
    Filter,
    Layers,
    Clock,
    ChevronRight,
    ArrowUpDown,
} from "lucide-react";

interface ReportsIndexProps {
    reports: {
        data: Report[];
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
        priority?: string;
        category_id?: string;
        search?: string;
    };
    categories: FacilityCategory[];
    locations: FacilityLocation[];
}

export default function ReportsIndex({
    reports,
    filters,
    categories,
    locations,
}: ReportsIndexProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [priority, setPriority] = useState(filters.priority || "");
    const [categoryId, setCategoryId] = useState(filters.category_id || "");

    const handleFilter = () => {
        router.get(
            route("reports.index"),
            {
                search: search || undefined,
                status: status || undefined,
                priority: priority || undefined,
                category_id: categoryId || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch("");
        setStatus("");
        setPriority("");
        setCategoryId("");
        router.get(route("reports.index"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Laporan Fasilitas — AFRS" />

            <div className="space-y-6">
                {/* Header Title & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Daftar Laporan Kerusakan
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola dan pantau status seluruh tiket laporan fasilitas ({reports.total} total laporan)
                        </p>
                    </div>

                    <Link
                        href={route("reports.create")}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md shadow-sky-600/20 transition-all shrink-0"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Buat Laporan Baru</span>
                    </Link>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                                placeholder="Cari No. Tiket / Judul..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        {/* Status Select */}
                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full py-2 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="submitted">Menunggu Review</option>
                                <option value="under_review">Ditinjau</option>
                                <option value="assigned">Ditugaskan</option>
                                <option value="in_progress">Sedang Dikerjakan</option>
                                <option value="waiting_information">Menunggu Info</option>
                                <option value="on_hold">Ditunda (On Hold)</option>
                                <option value="resolved">Selesai</option>
                                <option value="closed">Ditutup</option>
                                <option value="rejected">Ditolak</option>
                            </select>
                        </div>

                        {/* Priority Select */}
                        <div>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full py-2 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">Semua Prioritas</option>
                                <option value="urgent">Darurat (Urgent)</option>
                                <option value="high">Tinggi (High)</option>
                                <option value="medium">Sedang (Medium)</option>
                                <option value="low">Rendah (Low)</option>
                            </select>
                        </div>

                        {/* Category Select */}
                        <div>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full py-2 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleFilter}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
                        >
                            Terapkan Filter
                        </button>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3.5 px-4">No. Tiket</th>
                                    <th className="py-3.5 px-4">Masalah Kerusakan</th>
                                    <th className="py-3.5 px-4">Lokasi & Aset</th>
                                    <th className="py-3.5 px-4">Prioritas</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Teknisi</th>
                                    <th className="py-3.5 px-4">Tanggal</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {reports.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p>Tidak ada laporan yang ditemukan dengan kriteria filter saat ini.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    reports.data.map((report) => {
                                        const statusBadge = getStatusBadge(report.status);
                                        const priorityBadge = getPriorityBadge(report.priority);

                                        return (
                                            <tr
                                                key={report.id}
                                                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                                            >
                                                <td className="py-3.5 px-4 font-mono font-bold text-sky-700 dark:text-sky-400 whitespace-nowrap">
                                                    {report.ticket_number}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                                                        {report.title}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 truncate">
                                                        {report.category?.name} • Pelapor: {report.reporter?.name}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                                                        {report.location?.room_name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {report.facility ? `${report.facility.facility_code}` : report.location?.building}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityBadge.color}`}>
                                                        {priorityBadge.label}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusBadge.color}`}>
                                                        {statusBadge.label}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    {report.active_assignment?.technician ? (
                                                        <span className="font-medium text-slate-800 dark:text-slate-200">
                                                            {report.active_assignment.technician.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 italic">Belum ditugaskan</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                                                    {formatDate(report.created_at)}
                                                </td>
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <Link
                                                        href={route("reports.show", report.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-medium hover:bg-sky-100 transition"
                                                    >
                                                        <span>Detail</span>
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {reports.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                            <span className="text-slate-500">
                                Menampilkan {reports.data.length} dari {reports.total} total data
                            </span>
                            <div className="flex items-center gap-1">
                                {reports.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || "#"}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg border transition ${
                                            link.active
                                                ? "bg-sky-600 text-white border-sky-600 font-semibold"
                                                : link.url
                                                ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                                : "text-slate-300 dark:text-slate-600 border-transparent cursor-not-allowed"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}