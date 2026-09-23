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
    TrendingUp,
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
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Laporan</span>
                            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                                <Layers className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.total || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Laporan yang Anda ajukan</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Review</span>
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{stats.submitted || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Belum ditugaskan teknisi</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sedang Diproses</span>
                            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
                                <Wrench className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">{stats.in_progress || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Dalam penanganan teknisi</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selesai</span>
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{stats.resolved || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Telah selesai diperbaiki</p>
                    </div>
                </div>
            );
        }

        if (user.role === "technician") {
            return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tugas Aktif</span>
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                                <Wrench className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.total_assigned || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Tiket ditugaskan ke Anda</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sedang Dikerjakan</span>
                            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">{stats.in_progress || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Status In-Progress</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Aksi</span>
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{stats.waiting_action || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Belum mulai atau on hold</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioritas Urgent</span>
                            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{stats.urgent || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Butuh penanganan cepat</p>
                    </div>
                </div>
            );
        }


        // Admin
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pengguna</span>
                        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.total_users || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">Pegawai, teknisi & staf</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Fasilitas</span>
                        <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                            <Boxes className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.total_facilities || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">Aset fasilitas terdaftar</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Laporan</span>
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.total_reports || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">Laporan masuk sistem</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit Kerja</span>
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                            <Shield className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.total_departments || 0}</p>
                    <p className="text-xs text-slate-400 mt-1">Divisi & seksi terdaftar</p>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard — AFRS AirNav Medan" />

            <div className="space-y-6">
                {/* Hero Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/20">
                                <span>AirNav Indonesia Cabang Medan</span>
                                <span>•</span>
                                <span className="text-sky-200">Sistem Pelaporan Fasilitas (AFRS)</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Selamat Datang, {user.name} 👋
                            </h1>
                            <p className="text-sky-100 text-sm leading-relaxed">
                                {user.department?.name ? `Bertugas di: ${user.department.name}. ` : ""}
                                Pantau dan kelola seluruh pelaporan kerusakan fasilitas kerja perkantoran secara cepat, transparan, dan terintegrasi.
                            </p>
                        </div>

                        {user.role === "employee" && (
                            <Link
                                href={route("reports.create")}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-800 hover:bg-sky-50 font-semibold text-sm shadow-lg shadow-black/10 transition-all shrink-0 hover:scale-[1.02]"
                            >
                                <FilePlus className="w-4 h-4 text-sky-700" />
                                <span>Laporkan Kerusakan</span>
                            </Link>
                        )}
                    </div>

                    {/* Background Graphic Accents */}
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl" />
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
                </div>

                {/* KPI Stat Cards */}
                {renderRoleCards()}

                {/* Main Content Grid: Chart + Recent Reports */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Reports List (2 Cols) */}
                    <div className={`${chartData.length > 0 ? "lg:col-span-2" : "lg:col-span-3"} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6`}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    {user.role === "employee" ? "Laporan Terbaru Saya" : "Laporan Fasilitas Terbaru"}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Daftar perkembangan tiket laporan terakhir</p>
                            </div>
                            <Link
                                href={route("reports.index")}
                                className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1"
                            >
                                <span>Lihat Semua</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentReports.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-sm">
                                <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
                                <p>Belum ada laporan yang tercatat.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentReports.map((report) => {
                                    const statusBadge = getStatusBadge(report.status);
                                    const priorityBadge = getPriorityBadge(report.priority);

                                    return (
                                        <Link
                                            key={report.id}
                                            href={route("reports.show", report.id)}
                                            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 -mx-3 px-3 rounded-xl transition"
                                        >
                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
                                                        {report.ticket_number}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${priorityBadge.color}`}>
                                                        {priorityBadge.label}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusBadge.color}`}>
                                                        {statusBadge.label}
                                                    </span>
                                                </div>
                                                <h4 className="font-medium text-sm text-slate-900 dark:text-white truncate">
                                                    {report.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {report.category?.name} • {report.location?.room_name || report.location?.building}
                                                </p>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className="text-[11px] text-slate-400 block">
                                                    {formatDate(report.created_at)}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Category Chart Breakdown (1 Col) if admin/support */}
                    {chartData.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Statistik Kategori
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Sebaran kerusakan fasilitas per kategori</p>
                            </div>

                            <div className="h-64 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 10 }}
                                            interval={0}
                                            angle={-25}
                                            textAnchor="end"
                                        />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="reports_count" fill="#0284c7" radius={[6, 6, 0, 0]} name="Laporan" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                                <p>Data diperbarui secara otomatis sesuai laporan masuk.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}