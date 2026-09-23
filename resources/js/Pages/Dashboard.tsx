import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Report } from "@/types";
import { getPriorityBadge, getStatusBadge, formatDate } from "@/lib/utils";
import {
    FilePlus,
    Clock,
    CheckCircle,
    AlertTriangle,
    Boxes,
    Layers,
    ArrowUpRight,
    Wrench,
    Shield,
    Users,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

interface DashboardProps {
    stats: Record<string, number>;
    recentReports: Report[];
    chartData?: { name: string; reports_count: number }[];
}

export default function Dashboard({ stats, recentReports, chartData = [] }: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const renderRoleCards = () => {
        if (user.role === "employee") {
            return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Total Laporan
                            </span>
                            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-200">
                                <Layers className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
                            {stats.total || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Laporan yang Anda ajukan</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Menunggu Review
                            </span>
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-200">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-3 font-mono">
                            {stats.submitted || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Belum ditugaskan teknisi</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Sedang Diproses
                            </span>
                            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-200">
                                <Wrench className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-3 font-mono">
                            {stats.in_progress || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Dalam penanganan teknisi</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Selesai
                            </span>
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3 font-mono">
                            {stats.resolved || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Telah selesai diperbaiki</p>
                    </div>
                </div>
            );
        }

        if (user.role === "technician") {
            return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Tugas Aktif
                            </span>
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200">
                                <Wrench className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
                            {stats.total_assigned || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Tiket ditugaskan ke Anda</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Sedang Dikerjakan
                            </span>
                            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-200">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-3 font-mono">
                            {stats.in_progress || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Status In-Progress</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Menunggu Aksi
                            </span>
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-200">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-3 font-mono">
                            {stats.waiting_action || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Belum mulai atau on hold</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Prioritas Urgent
                            </span>
                            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-200">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-3 font-mono">
                            {stats.urgent || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Butuh penanganan cepat</p>
                    </div>
                </div>
            );
        }

        // Admin
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Total Laporan
                            </span>
                            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-200">
                                <Layers className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
                            {stats.total_reports || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Seluruh tiket terdaftar</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Menunggu Review
                            </span>
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-200">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-3 font-mono">
                            {stats.incoming || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Perlu diverifikasi & penugasan</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Sedang Diproses
                            </span>
                            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-200">
                                <Wrench className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-3 font-mono">
                            {stats.in_progress || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Dalam pengerjaan teknisi</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Selesai
                            </span>
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3 font-mono">
                            {stats.resolved || 0}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Berhasil diperbaiki & ditutup</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="bg-white dark:bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Total Pengguna:</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{stats.total_users || 0}</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Boxes className="w-4 h-4 text-sky-500" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Aset Fasilitas:</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{stats.total_facilities || 0}</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Unit Kerja:</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{stats.total_departments || 0}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard ? AFRS AirNav Medan" />

            <div className="space-y-6">
                {/* Hero Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 dark:from-slate-900 dark:via-sky-950 dark:to-blue-950 p-6 sm:p-8 text-white border border-sky-600/30 dark:border-slate-800 shadow-xl shadow-sky-900/10">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2.5 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-sky-500/10 backdrop-blur-md text-xs font-medium border border-white/15 dark:border-sky-500/20 text-sky-100 dark:text-sky-300">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                </span>
                                <span className="font-semibold tracking-wide">AirNav Cabang Medan</span>
                                <span className="text-white/40 dark:text-sky-400/40">?</span>
                                <span>AFRS Portal Fasilitas</span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
                                Selamat Datang, {user.name} ??
                            </h1>

                            <p className="text-sky-100/90 dark:text-slate-300 text-sm leading-relaxed max-w-xl">
                                {user.department?.name ? (
                                    <span className="font-semibold text-white">
                                        Unit {user.department.name} ?{" "}
                                    </span>
                                ) : null}
                                Pantau dan kelola seluruh pelaporan kerusakan fasilitas kerja perkantoran secara cepat, transparan, dan terintegrasi.
                            </p>
                        </div>

                        {user.role === "employee" && (
                            <Link
                                href={route("reports.create")}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-900 hover:bg-sky-50 font-bold text-sm shadow-lg shadow-black/10 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <FilePlus className="w-4 h-4 text-sky-600" />
                                <span>Laporkan Kerusakan</span>
                            </Link>
                        )}

                        {user.role === "technician" && (
                            <Link
                                href={route("reports.index")}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-900 hover:bg-sky-50 font-bold text-sm shadow-lg shadow-black/10 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Wrench className="w-4 h-4 text-sky-600" />
                                <span>Tangani Tiket Laporan</span>
                            </Link>
                        )}

                        {user.role === "admin" && (
                            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                                <Link
                                    href={route("reports.index")}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-sky-900 hover:bg-sky-50 font-bold text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                                    <span>Semua Laporan</span>
                                </Link>
                                <Link
                                    href={route("facilities.index")}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Boxes className="w-3.5 h-3.5" />
                                    <span>Data Fasilitas</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Subtle Decorative Aviation & Radar Elements */}
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
                    <div className="absolute left-1/3 top-0 -translate-y-12 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 border border-white/10 rounded-full pointer-events-none" />
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 border border-white/5 rounded-full pointer-events-none" />
                </div>

                {/* KPI Stat Cards */}
                {renderRoleCards()}

                {/* Main Content Grid: Chart + Recent Reports */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Reports List */}
                    <div className={`${chartData.length > 0 ? "lg:col-span-2" : "lg:col-span-3"} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6`}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    {user.role === "employee" ? "Laporan Terbaru Saya" : "Laporan Fasilitas Terbaru"}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Daftar perkembangan tiket laporan terakhir
                                </p>
                            </div>
                            <Link
                                href={route("reports.index")}
                                className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 group"
                            >
                                <span>Lihat Semua</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>

                        {recentReports.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-sm">
                                <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
                                <p className="font-medium text-slate-600 dark:text-slate-400">Belum ada laporan yang tercatat.</p>
                                {user.role === "employee" && (
                                    <Link
                                        href={route("reports.create")}
                                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                                    >
                                        <FilePlus className="w-3.5 h-3.5" />
                                        <span>Ajukan Laporan Pertama</span>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {recentReports.map((report) => {
                                    const statusBadge = getStatusBadge(report.status);
                                    const priorityBadge = getPriorityBadge(report.priority);

                                    return (
                                        <Link
                                            key={report.id}
                                            href={route("reports.show", report.id)}
                                            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-3 px-3 rounded-xl transition group"
                                        >
                                            <div className="space-y-1.5 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:underline">
                                                        {report.ticket_number}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${priorityBadge.color}`}>
                                                        {priorityBadge.label}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusBadge.color}`}>
                                                        {statusBadge.label}
                                                    </span>
                                                </div>
                                                <h4 className="font-medium text-sm text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                                    {report.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {report.category?.name} ? {report.location?.room_name || report.location?.building}
                                                </p>
                                            </div>

                                            <div className="text-left sm:text-right shrink-0 flex items-center sm:flex-col gap-2 sm:gap-1 justify-between">
                                                <span className="text-[11px] text-slate-400 font-mono">
                                                    {formatDate(report.created_at)}
                                                </span>
                                                <span className="text-xs text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-medium">
                                                    Detail <ArrowUpRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Category Chart Breakdown if data present */}
                    {chartData.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Statistik Kategori
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Sebaran kerusakan fasilitas per kategori
                                </p>
                            </div>

                            <div className="h-64 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 10 }}
                                            interval={0}
                                            angle={-25}
                                            textAnchor="end"
                                        />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#0f172a",
                                                borderColor: "#334155",
                                                borderRadius: "0.75rem",
                                                color: "#f8fafc",
                                                fontSize: "12px",
                                            }}
                                        />
                                        <Bar dataKey="reports_count" fill="#0284c7" radius={[6, 6, 0, 0]} name="Laporan" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                                <span>Total {chartData.reduce((acc, c) => acc + c.reports_count, 0)} Laporan Tercatat</span>
                                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Terverifikasi</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
