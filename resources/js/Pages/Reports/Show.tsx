import { FormEventHandler, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Report, User, PageProps } from "@/types";
import { getPriorityBadge, getStatusBadge, formatDate } from "@/lib/utils";
import {
    ArrowLeft,
    Clock,
    UserCheck,
    Wrench,
    Send,
    Lock,
    CheckCircle2,
    XCircle,
    Building2,
    Calendar,
    Paperclip,
    AlertCircle,
    FileText,
    MessageSquare,
    Layers,
} from "lucide-react";

interface ShowReportProps {
    report: Report;
    technicians?: User[];
}

export default function ShowReport({ report, technicians = [] }: ShowReportProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const { data: chatData, setData: setChatData, post: postChat, processing: chatProcessing, reset: resetChat } = useForm({
        message: "",
    });

    const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing } = useForm({
        technician_id: "",
        notes: "",
    });

    const { data: statusData, setData: setStatusData, post: postStatus, processing: statusProcessing } = useForm({
        status: "",
        action_note: "",
        resolution_notes: "",
        rejection_reason: "",
    });

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const handleSendMessage: FormEventHandler = (e) => {
        e.preventDefault();
        if (!chatData.message.trim()) return;
        postChat(route("reports.send-message", report.id), {
            preserveScroll: true,
            onSuccess: () => resetChat(),
        });
    };

    const handleAssign: FormEventHandler = (e) => {
        e.preventDefault();
        postAssign(route("reports.assign", report.id), {
            onSuccess: () => setShowAssignModal(false),
        });
    };

    const handleUpdateStatus = (newStatus: string) => {
        statusData.status = newStatus;
        postStatus(route("reports.update-status", report.id));
    };

    const handleResolve: FormEventHandler = (e) => {
        e.preventDefault();
        statusData.status = "resolved";
        postStatus(route("reports.update-status", report.id), {
            onSuccess: () => setShowResolveModal(false),
        });
    };

    const handleReject: FormEventHandler = (e) => {
        e.preventDefault();
        statusData.status = "rejected";
        postStatus(route("reports.update-status", report.id), {
            onSuccess: () => setShowRejectModal(false),
        });
    };

    const statusBadge = getStatusBadge(report.status);
    const priorityBadge = getPriorityBadge(report.priority);

    const isAdmin = user.role === 'admin';
    const isAssignedTechnician = user.role === "technician" && report.active_assignment?.technician_id === user.id;
    const isReporter = user.id === report.reporter_id;
    return (
        <AuthenticatedLayout>
            <Head title={`Tiket ${report.ticket_number} — AFRS`} />

            <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("reports.index")}
                            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
                                    {report.ticket_number}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${priorityBadge.color}`}>
                                    {priorityBadge.label}
                                </span>
                                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${statusBadge.color}`}>
                                    {statusBadge.label}
                                </span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                                {report.title}
                            </h1>
                        </div>
                    </div>

                    {/* Quick Role Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {isAdmin && !["closed", "rejected"].includes(report.status) && (
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition"
                            >
                                <UserCheck className="w-4 h-4" />
                                <span>{report.active_assignment ? "Alihkan Penugasan" : "Tugaskan Teknisi"}</span>
                            </button>
                        )}

                        {isAdmin && ["submitted", "under_review"].includes(report.status) && (
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-medium text-xs border border-rose-200 dark:border-rose-800 transition"
                            >
                                <span>Tolak Laporan</span>
                            </button>
                        )}

                        {isAssignedTechnician && report.status === "assigned" && (
                            <button
                                onClick={() => handleUpdateStatus("in_progress")}
                                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition"
                            >
                                <Wrench className="w-4 h-4" />
                                <span>Mulai Kerjakan</span>
                            </button>
                        )}

                        {isAssignedTechnician && report.status === "in_progress" && (
                            <>
                                <button
                                    onClick={() => handleUpdateStatus("on_hold")}
                                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium text-xs transition"
                                >
                                    <span>Tunda (Hold)</span>
                                </button>
                                <button
                                    onClick={() => setShowResolveModal(true)}
                                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Tandai Selesai</span>
                                </button>
                            </>
                        )}

                        {isReporter && report.status === "resolved" && (
                            <button
                                onClick={() => handleUpdateStatus("closed")}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Konfirmasi & Tutup Tiket</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Main 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Details, Photos, Status History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                Deskripsi & Rincian Kerusakan
                            </h3>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {report.description}
                            </div>

                            {report.resolution_notes && (
                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Catatan Hasil Penanganan Teknisi:</span>
                                    </p>
                                    <p className="leading-relaxed pl-5">{report.resolution_notes}</p>
                                </div>
                            )}

                            {report.rejection_reason && (
                                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                        <span>Alasan Penolakan:</span>
                                    </p>
                                    <p className="leading-relaxed pl-5">{report.rejection_reason}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs">
                                    <span className="text-slate-400 block mb-1 font-medium">Lokasi Kejadian</span>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {report.location?.building} — {report.location?.floor}
                                    </p>
                                    <p className="text-slate-500">{report.location?.room_name}</p>
                                </div>

                                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs">
                                    <span className="text-slate-400 block mb-1 font-medium">Aset Fasilitas Terkait</span>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {report.facility ? report.facility.name : "Fasilitas Umum / Ruangan"}
                                    </p>
                                    <p className="text-slate-500">
                                        {report.facility ? `Kode: ${report.facility.facility_code}` : report.category?.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Status History */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-sky-600" />
                                <span>Riwayat Aktivitas & Perubahan Status</span>
                            </h3>

                            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                                {report.status_histories?.map((history) => {
                                    const badge = getStatusBadge(history.to_status);
                                    return (
                                        <div key={history.id} className="relative">
                                            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                                            <div className="text-xs space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2 py-0.5 rounded-full font-semibold ${badge.color}`}>
                                                        {badge.label}
                                                    </span>
                                                    <span className="text-slate-400">
                                                        {formatDate(history.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 font-medium">
                                                    Aktor: {history.user?.name || "Sistem"}
                                                </p>
                                                {history.action_note && (
                                                    <p className="text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
                                                        {history.action_note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Meta + Chat */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4 text-xs">
                            <div>
                                <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                                    Informasi Pelapor
                                </span>
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                    {report.reporter?.name}
                                </p>
                                <p className="text-slate-500">
                                    {report.department?.name} ({report.department?.code})
                                </p>
                                {report.reporter?.phone && (
                                    <p className="text-slate-400 mt-0.5">Kontak: {report.reporter.phone}</p>
                                )}
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                                    Teknisi Bertanggung Jawab
                                </span>
                                {report.active_assignment?.technician ? (
                                    <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 space-y-1">
                                        <p className="font-bold text-sky-900 dark:text-sky-300">
                                            {report.active_assignment.technician.name}
                                        </p>
                                        <p className="text-slate-500 text-[11px]">
                                            Ditugaskan oleh: {report.active_assignment.assigned_by_user?.name || "Admin"}
                                        </p>
                                        {report.active_assignment.notes && (
                                            <p className="text-slate-600 dark:text-slate-400 italic text-[11px]">
                                                "{report.active_assignment.notes}"
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 italic">Belum ada teknisi yang ditugaskan</p>
                                )}
                            </div>
                        </div>

                        {/* LIVE CHAT BOX */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-[480px]">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-sky-600" />
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                        Percakapan Tiket
                                    </h4>
                                </div>
                                {report.conversation?.is_locked && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        <span>Terkunci</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                                {(!report.conversation?.messages || report.conversation.messages.length === 0) ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                                        <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                                        <p>Belum ada percakapan pada tiket ini.</p>
                                        <p className="text-[11px]">Kirim pesan untuk berkoordinasi langsung.</p>
                                    </div>
                                ) : (
                                    report.conversation.messages.map((msg) => {
                                        const isMe = msg.sender_id === user.id;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                            >
                                                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-400">
                                                    <span>{isMe ? "Anda" : msg.sender?.name}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(msg.created_at)}</span>
                                                </div>
                                                <div
                                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                                                        isMe
                                                            ? "bg-sky-600 text-white rounded-tr-none shadow-sm"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                                                    }`}
                                                >
                                                    {msg.message}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-2xl">
                                {report.conversation?.is_locked ? (
                                    <div className="text-center py-2 text-xs text-slate-400 flex items-center justify-center gap-1.5">
                                        <Lock className="w-3.5 h-3.5" />
                                        <span>Percakapan telah dikunci karena tiket telah selesai/ditutup.</span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={chatData.message}
                                            onChange={(e) => setChatData("message", e.target.value)}
                                            placeholder="Tulis pesan ke pelapor / teknisi..."
                                            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={chatProcessing || !chatData.message.trim()}
                                            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50 transition shadow-sm"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Assign */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            Tugaskan Teknisi Penanganan
                        </h3>
                        <form onSubmit={handleAssign} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                    Pilih Teknisi
                                </label>
                                <select
                                    value={assignData.technician_id}
                                    onChange={(e) => setAssignData("technician_id", e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                                    required
                                >
                                    <option value="">-- Pilih Teknisi Tersedia --</option>
                                    {technicians.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} ({t.phone || "No telp -"})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan / Instruksi Khusus (Opsional)
                                </label>
                                <textarea
                                    value={assignData.notes}
                                    onChange={(e) => setAssignData("notes", e.target.value)}
                                    rows={3}
                                    placeholder="Contoh: Harap bawa perlengkapan tangga dan toolkit listrik..."
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={assignProcessing || !assignData.technician_id}
                                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm disabled:opacity-50"
                                >
                                    {assignProcessing ? "Menyimpan..." : "Tugaskan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Resolve */}
            {showResolveModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Tandai Penanganan Selesai</span>
                        </h3>
                        <form onSubmit={handleResolve} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan Hasil Perbaikan <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    value={statusData.resolution_notes}
                                    onChange={(e) => setStatusData("resolution_notes", e.target.value)}
                                    rows={4}
                                    placeholder="Contoh: Unit pipa indoor dibersihkan, penggantian freon R32, pengujian suhu normal..."
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowResolveModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={statusProcessing || !statusData.resolution_notes.trim()}
                                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm disabled:opacity-50"
                                >
                                    {statusProcessing ? "Menyimpan..." : "Kirim Hasil Perbaikan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Reject */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white text-rose-600 flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-rose-600" />
                            <span>Tolak Laporan Kerusakan</span>
                        </h3>
                        <form onSubmit={handleReject} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                    Alasan Penolakan <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    value={statusData.rejection_reason}
                                    onChange={(e) => setStatusData("rejection_reason", e.target.value)}
                                    rows={3}
                                    placeholder="Contoh: Bukan fasilitas kantor atau laporan duplikat..."
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={statusProcessing || !statusData.rejection_reason.trim()}
                                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-sm disabled:opacity-50"
                                >
                                    {statusProcessing ? "Menolak..." : "Tolak Laporan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}