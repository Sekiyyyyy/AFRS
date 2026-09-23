import { FormEventHandler, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FacilityCategory, FacilityLocation, Facility } from "@/types";
import {
    ArrowLeft,
    UploadCloud,
    X,
    AlertCircle,
    CheckCircle2,
    FileText,
    ShieldAlert,
} from "lucide-react";

interface CreateReportProps {
    categories: FacilityCategory[];
    locations: FacilityLocation[];
    facilities: Facility[];
}

export default function CreateReport({
    categories,
    locations,
    facilities,
}: CreateReportProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        category_id: "",
        location_id: "",
        facility_id: "",
        priority: "medium",
        attachments: [] as File[],
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setData("attachments", [...data.attachments, ...filesArray]);

            const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = data.attachments.filter((_, i) => i !== index);
        const updatedPreviews = previewUrls.filter((_, i) => i !== index);
        setData("attachments", updatedFiles);
        setPreviewUrls(updatedPreviews);
    };

    // Filter facilities based on selected category & location
    const filteredFacilities = facilities.filter((f) => {
        if (data.category_id && f.category_id.toString() !== data.category_id) return false;
        if (data.location_id && f.location_id.toString() !== data.location_id) return false;
        return true;
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("reports.store"));
    };

    const priorities = [
        { value: "low", label: "Rendah", desc: "Tidak mengganggu pekerjaan utama", color: "border-slate-300 peer-checked:border-slate-600 peer-checked:bg-slate-50" },
        { value: "medium", label: "Sedang", desc: "Mempengaruhi aktivitas normal", color: "border-sky-300 peer-checked:border-sky-600 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-950/40" },
        { value: "high", label: "Tinggi", desc: "Mendesak / fasilitas ruang rapat pimpinan", color: "border-amber-300 peer-checked:border-amber-600 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-950/40" },
        { value: "urgent", label: "Darurat", desc: "Lumpuh total / potensi bahaya", color: "border-rose-300 peer-checked:border-rose-600 peer-checked:bg-rose-50 dark:peer-checked:bg-rose-950/40" },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Buat Laporan Kerusakan â€” AFRS" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back button and page title */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route("reports.index")}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Formulir Pelaporan Kerusakan
                        </h1>
                        <p className="text-xs text-slate-500">
                            Isi detail kendala fasilitas kantor agar unit teknisi dapat segera melakukan penanganan
                        </p>
                    </div>
                </div>

                {/* Important Disclaimer Notice */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-semibold">Catatan Lingkup Layanan Fasilitas:</p>
                        <p className="leading-relaxed">
                            Sistem ini khusus menangani fasilitas pendukung operasional dan administrasi kantor (Komputer PC, Printer, AC, Lampu, WiFi, Perabot). Laporan gangguan fasilitas navigasi penerbangan kritis (ATC/CNS) tetap melalui prosedur resmi perusahaan.
                        </p>
                    </div>
                </div>

                {/* Main Form Card */}
                <form onSubmit={submit} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                    {/* Judul Laporan */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Judul Kerusakan / Masalah <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Contoh: AC Ruang Rapat Lantai 2 Mengalami Kebocoran Air"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                            required
                        />
                        {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                    </div>

                    {/* Kategori & Lokasi Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Kategori Fasilitas <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData("category_id", e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                                required
                            >
                                <option value="">Pilih Kategori...</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-xs text-rose-500 mt-1">{errors.category_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Lokasi Ruangan / Lantai <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.location_id}
                                onChange={(e) => setData("location_id", e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                                required
                            >
                                <option value="">Pilih Lokasi...</option>
                                {locations.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.building} - {l.floor} ({l.room_name})
                                    </option>
                                ))}
                            </select>
                            {errors.location_id && <p className="text-xs text-rose-500 mt-1">{errors.location_id}</p>}
                        </div>
                    </div>

                    {/* Spesifik Fasilitas Aset (Opsional) */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Aset Fasilitas Terkait (Opsional)
                            </label>
                            <span className="text-[11px] text-slate-400">Kosongkan jika tidak ada label aset</span>
                        </div>
                        <select
                            value={data.facility_id}
                            onChange={(e) => setData("facility_id", e.target.value)}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="">-- Pilih Aset Terdaftar (Jika Mengetahui) --</option>
                            {filteredFacilities.map((f) => (
                                <option key={f.id} value={f.id}>
                                    [{f.facility_code}] {f.name}
                                </option>
                            ))}
                        </select>
                        {errors.facility_id && <p className="text-xs text-rose-500 mt-1">{errors.facility_id}</p>}
                    </div>

                    {/* Prioritas Kerusakan */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                            Tingkat Prioritas Penanganan <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {priorities.map((p) => (
                                <label
                                    key={p.value}
                                    className="relative flex flex-col p-3 rounded-xl border cursor-pointer hover:border-sky-400 transition"
                                >
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={p.value}
                                        checked={data.priority === p.value}
                                        onChange={(e) => setData("priority", e.target.value)}
                                        className="sr-only peer"
                                    />
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                            {p.label}
                                        </span>
                                        {data.priority === p.value && (
                                            <CheckCircle2 className="w-4 h-4 text-sky-600" />
                                        )}
                                    </div>
                                    <span className="text-[11px] text-slate-400 leading-tight">
                                        {p.desc}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Deskripsi Masalah */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Deskripsi Rinci Kerusakan <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            rows={4}
                            placeholder="Jelaskan secara spesifik gejala kerusakan, waktu awal kejadian, suara mencurigakan, atau indikator error yang muncul..."
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                            required
                        />
                        {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                    </div>

                    {/* Upload Foto Bukti Kerusakan */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Unggah Foto Bukti Kerusakan (Maks 5MB per file)
                        </label>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-sky-500 transition cursor-pointer relative bg-slate-50/50 dark:bg-slate-800/30">
                            <input
                                type="file"
                                multiple
                                accept="image/png,image/jpeg,image/jpg,application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <UploadCloud className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                Klik atau seret file foto kerusakan ke area ini
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Mendukung JPG, PNG, atau PDF (dapat memilih lebih dari 1 file)
                            </p>
                        </div>

                        {/* File Previews */}
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                                {previewUrls.map((url, i) => (
                                    <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href={route("reports.index")}
                            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 disabled:opacity-50 transition"
                        >
                            {processing ? "Mengirim Laporan..." : "Kirim Laporan"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}