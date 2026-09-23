import { FormEventHandler, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Facility, FacilityCategory, FacilityLocation, PageProps } from "@/types";
import {
    PlusCircle,
    Search,
    Boxes,
    Building2,
    Wrench,
    CheckCircle2,
    AlertTriangle,
    X,
    Trash2,
    Edit,
} from "lucide-react";

interface FacilitiesProps {
    facilities: {
        data: Facility[];
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
    };
    categories: FacilityCategory[];
    locations: FacilityLocation[];
    filters: { category_id?: string; status?: string; search?: string };
}

export default function FacilitiesIndex({
    facilities,
    categories,
    locations,
    filters,
}: FacilitiesProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || "");
    const [categoryId, setCategoryId] = useState(filters.category_id || "");
    const [status, setStatus] = useState(filters.status || "");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        category_id: "",
        location_id: "",
        facility_code: "",
        name: "",
        brand_model: "",
        serial_number: "",
        status: "operational",
        notes: "",
    });

    const handleFilter = () => {
        router.get(
            route("facilities.index"),
            {
                search: search || undefined,
                category_id: categoryId || undefined,
                status: status || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch("");
        setCategoryId("");
        setStatus("");
        router.get(route("facilities.index"));
    };

    const openCreate = () => {
        reset();
        setEditingFacility(null);
        setShowCreateModal(true);
    };

    const openEdit = (f: Facility) => {
        setEditingFacility(f);
        setData({
            category_id: f.category_id.toString(),
            location_id: f.location_id.toString(),
            facility_code: f.facility_code,
            name: f.name,
            brand_model: f.brand_model || "",
            serial_number: f.serial_number || "",
            status: f.status,
            notes: f.notes || "",
        });
        setShowCreateModal(true);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingFacility) {
            put(route("facilities.update", editingFacility.id), {
                onSuccess: () => {
                    setShowCreateModal(false);
                    reset();
                },
            });
        } else {
            post(route("facilities.store"), {
                onSuccess: () => {
                    setShowCreateModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin mengarsipkan data fasilitas ini?")) {
            router.delete(route("facilities.destroy", id));
        }
    };

    const getStatusStyle = (s: string) => {
        switch (s) {
            case "operational":
                return { label: "Beroperasi Normal", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
            case "damaged":
                return { label: "Rusak", color: "bg-rose-100 text-rose-800 border-rose-200" };
            case "maintenance":
                return { label: "Dalam Pemeliharaan", color: "bg-amber-100 text-amber-800 border-amber-200" };
            case "retired":
                return { label: "Afkir / Ditarik", color: "bg-slate-100 text-slate-700 border-slate-200" };
            default:
                return { label: s, color: "bg-slate-100 text-slate-700" };
        }
    };
    return (
        <AuthenticatedLayout>
            <Head title="Master Fasilitas Kantor — AFRS" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Master Data Fasilitas Kantor
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola inventaris fasilitas pendukung perkantoran AirNav Cabang Medan ({facilities.total} aset terdaftar)
                        </p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md shadow-sky-600/20 transition-all shrink-0"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Tambah Fasilitas</span>
                    </button>
                </div>

                {/* Filter and Search */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                                placeholder="Cari Kode Aset / Nama..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

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

                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full py-2 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">Semua Status Operasional</option>
                                <option value="operational">Beroperasi Normal</option>
                                <option value="damaged">Rusak</option>
                                <option value="maintenance">Dalam Pemeliharaan</option>
                                <option value="retired">Afkir</option>
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

                {/* Facilities Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3.5 px-4">Kode Aset</th>
                                    <th className="py-3.5 px-4">Nama Fasilitas & Brand</th>
                                    <th className="py-3.5 px-4">Kategori</th>
                                    <th className="py-3.5 px-4">Penempatan Lokasi</th>
                                    <th className="py-3.5 px-4">Kondisi Status</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {facilities.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <Boxes className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p>Tidak ada data fasilitas yang sesuai kriteria pencarian.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    facilities.data.map((f) => {
                                        const statusStyle = getStatusStyle(f.status);
                                        return (
                                            <tr key={f.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                                                <td className="py-3.5 px-4 font-mono font-bold text-sky-700 dark:text-sky-400 whitespace-nowrap">
                                                    {f.facility_code}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {f.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {f.brand_model || "Tanpa merk"} {f.serial_number ? `• SN: ${f.serial_number}` : ""}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                                    {f.category?.name}
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="font-medium text-slate-800 dark:text-slate-200">
                                                        {f.location?.room_name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {f.location?.building} — {f.location?.floor}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusStyle.color}`}>
                                                        {statusStyle.label}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                                                    <button
                                                        onClick={() => openEdit(f)}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(f.id)}
                                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                                        title="Arsipkan"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form Tambah / Edit */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                {editingFacility ? "Edit Data Fasilitas" : "Registrasi Fasilitas Baru"}
                            </h3>
                            <button onClick={() => setShowCreateModal(false)}>
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Kode Aset / Inventaris <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.facility_code}
                                        onChange={(e) => setData("facility_code", e.target.value)}
                                        placeholder="Contoh: AST-AC-005"
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                                        required
                                    />
                                    {errors.facility_code && <p className="text-rose-500 mt-0.5">{errors.facility_code}</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Status Operasional <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData("status", e.target.value as any)}
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                                    >
                                        <option value="operational">Beroperasi Normal</option>
                                        <option value="damaged">Rusak</option>
                                        <option value="maintenance">Dalam Pemeliharaan</option>
                                        <option value="retired">Afkir</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Fasilitas <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Contoh: AC Standing 3PK Ruang Rapat"
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                                {errors.name && <p className="text-rose-500 mt-0.5">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData("category_id", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                                        required
                                    >
                                        <option value="">Pilih Kategori...</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Lokasi Penempatan <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.location_id}
                                        onChange={(e) => setData("location_id", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                                        required
                                    >
                                        <option value="">Pilih Lokasi...</option>
                                        {locations.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.building} - {l.floor} ({l.room_name})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Merk / Model (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.brand_model}
                                        onChange={(e) => setData("brand_model", e.target.value)}
                                        placeholder="Contoh: Daikin FTKQ50SVM4"
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                        Serial Number (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.serial_number}
                                        onChange={(e) => setData("serial_number", e.target.value)}
                                        placeholder="Contoh: SN-88912-DKN"
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    rows={2}
                                    placeholder="Keterangan kondisi atau histori singkat penempatan aset..."
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm disabled:opacity-50"
                                >
                                    {processing ? "Menyimpan..." : "Simpan Fasilitas"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}