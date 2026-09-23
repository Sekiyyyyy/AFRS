import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function getStatusBadge(status: string) {
    switch (status) {
        case "submitted":
            return { label: "Menunggu Review", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" };
        case "under_review":
            return { label: "Ditinjau", color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" };
        case "assigned":
            return { label: "Ditugaskan", color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800" };
        case "in_progress":
            return { label: "Sedang Dikerjakan", color: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800" };
        case "waiting_information":
            return { label: "Menunggu Info", color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800" };
        case "on_hold":
            return { label: "Ditunda (Hold)", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800" };
        case "resolved":
            return { label: "Selesai Dikerjakan", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" };
        case "closed":
            return { label: "Ditutup (Selesai)", color: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" };
        case "rejected":
            return { label: "Ditolak", color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" };
        default:
            return { label: status, color: "bg-gray-100 text-gray-800 border-gray-200" };
    }
}

export function getPriorityBadge(priority: string) {
    switch (priority) {
        case "urgent":
            return { label: "Darurat (Urgent)", color: "bg-red-500 text-white shadow-sm shadow-red-200" };
        case "high":
            return { label: "Tinggi (High)", color: "bg-amber-500 text-white shadow-sm shadow-amber-200" };
        case "medium":
            return { label: "Sedang", color: "bg-sky-500 text-white shadow-sm shadow-sky-200" };
        case "low":
            return { label: "Rendah", color: "bg-slate-400 text-white" };
        default:
            return { label: priority, color: "bg-gray-400 text-white" };
    }
}