import { useState, PropsWithChildren, ReactNode, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Toaster, toast } from "sonner";
import {
    LayoutDashboard,
    PlusCircle,
    FileText,
    Wrench,
    CheckCircle2,
    Shield,
    Users,
    Building2,
    Boxes,
    Menu,
    X,
    LogOut,
    User as UserIcon,
    Bell,
    ChevronDown,
} from "lucide-react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const page = usePage<PageProps>();
    const user = page.props.auth.user;
    const flash = page.props.flash;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    // Role display badges
    const roleBadges: Record<string, { label: string; color: string }> = {
        admin: { label: "Administrator", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300" },
                technician: { label: "Teknisi Support", color: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300" },
        employee: { label: "Pegawai / Pelapor", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300" },
    };

    const currentBadge = roleBadges[user.role] || { label: user.role, color: "bg-slate-100 text-slate-800" };

    const navLinks = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            active: route().current("dashboard"),
            icon: LayoutDashboard,
            roles: ["admin", "", "technician", "employee"],
        },
        {
            name: "Buat Laporan",
            href: route("reports.create"),
            active: route().current("reports.create"),
            icon: PlusCircle,
            roles: ["employee", "admin", ""],
        },
        {
            name: user.role === "employee" ? "Laporan Saya" : "Daftar Laporan",
            href: route("reports.index"),
            active: route().current("reports.index") || route().current("reports.show"),
            icon: FileText,
            roles: ["admin", "", "technician", "employee"],
        },
        {
            name: "Data Fasilitas",
            href: route("facilities.index"),
            active: route().current("facilities.index"),
            icon: Boxes,
            roles: ["admin", ""],
        },
    ].filter((item) => item.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
            <Toaster position="top-right" richColors />

            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20 shrink-0">
                {/* Brand Header */}
                <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <img
                        src="/assets/images/LOGOAIRNAVINDONESIALandscape-9-1.png"
                        alt="AirNav Indonesia"
                        className="h-7 w-auto object-contain dark:hidden"
                        onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                        }}
                    />
                    <img
                        src="/assets/images/LOGOAIRNAVINDONESIALandscapePutih-1.png"
                        alt="AirNav Indonesia"
                        className="h-7 w-auto object-contain hidden dark:block"
                        onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                        }}
                    />
                    <div className="leading-tight">
                        <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight block">AFRS AirNav</span>
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold tracking-wide uppercase">Cabang Medan</span>
                    </div>
                </div>

                {/* User Role Card in Sidebar */}
                <div className="p-4 mx-3 my-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                            {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {user.department?.code ? `${user.department.code} â€¢ ` : ""}{user.username}
                            </p>
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border ${currentBadge.color}`}>
                            {currentBadge.label}
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Menu Utama
                    </p>
                    {navLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    item.active
                                        ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                <Icon className={`w-4 h-4 shrink-0 ${item.active ? "text-sky-600 dark:text-sky-400" : "opacity-70"}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar Sistem</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header Bar */}
            <div className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-30 sticky top-0">
                <div className="flex items-center gap-2">
                    <img
                        src="/assets/images/LOGOAIRNAVINDONESIALandscape-9-1.png"
                        alt="AirNav Indonesia"
                        className="h-6 w-auto object-contain dark:hidden"
                    />
                    <img
                        src="/assets/images/LOGOAIRNAVINDONESIALandscapePutih-1.png"
                        alt="AirNav Indonesia"
                        className="h-6 w-auto object-contain hidden dark:block"
                    />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">AFRS</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
                    <div className="w-64 h-full bg-white dark:bg-slate-900 p-4 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">AFRS AirNav Medan</span>
                                <button onClick={() => setSidebarOpen(false)}>
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <nav className="space-y-1">
                                {navLinks.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                                                item.active
                                                    ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold"
                                                    : "text-slate-600 dark:text-slate-400"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="flex items-center gap-2 px-3 py-2 text-rose-600 font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Keluar</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Desktop Top Navbar */}
                <header className="hidden md:flex h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-xs px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-medium border border-sky-200 dark:border-sky-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                            AirNav Indonesia Cabang Medan
                        </span>
                        {header}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${currentBadge.color}`}>
                            {currentBadge.label}
                        </span>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {profileDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs"
                                    onMouseLeave={() => setProfileDropdownOpen(false)}
                                >
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                        <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href={route("profile.edit")}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    >
                                        <UserIcon className="w-3.5 h-3.5" />
                                        <span>Profil Pengguna</span>
                                    </Link>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Keluar</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}