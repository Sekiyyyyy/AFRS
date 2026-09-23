import { useState, PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Toaster, toast } from "sonner";
import {
    LayoutDashboard,
    PlusCircle,
    FileText,
    Boxes,
    Menu,
    X,
    LogOut,
    User as UserIcon,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    Sun,
    Moon,
    Monitor,
} from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const page = usePage<PageProps>();
    const user = page.props.auth.user;
    const flash = page.props.flash;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Sidebar collapse state with localStorage persistence
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("sidebar_collapsed") === "true";
        }
        return false;
    });

    const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem("sidebar_collapsed", String(next));
            } catch (e) {}
            return next;
        });
    };

    // Theme state (light, dark, system)
    const [theme, setTheme] = useState<ThemeMode>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme");
            if (saved === "light" || saved === "dark" || saved === "system") {
                return saved;
            }
        }
        return "system";
    });

    const [isDarkActual, setIsDarkActual] = useState<boolean>(true);
    const [isThemeHovered, setIsThemeHovered] = useState(false);

    useEffect(() => {
        const applyTheme = (currentTheme: ThemeMode) => {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const isDark = currentTheme === "dark" || (currentTheme === "system" && prefersDark);

            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            setIsDarkActual(isDark);
            try {
                localStorage.setItem("theme", currentTheme);
            } catch (e) {}
        };

        applyTheme(theme);

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemChange = (e: MediaQueryListEvent) => {
            if (theme === "system") {
                if (e.matches) {
                    document.documentElement.classList.add("dark");
                    setIsDarkActual(true);
                } else {
                    document.documentElement.classList.remove("dark");
                    setIsDarkActual(false);
                }
            }
        };

        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, [theme]);

    // Click outside listener for profile menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.info) toast.info(flash.info);
    }, [flash]);

    // Role display badges
    const roleBadges: Record<string, { label: string; color: string }> = {
        admin: {
            label: "Admin",
            color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
        },
        technician: {
            label: "Teknisi",
            color: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
        },
        employee: {
            label: "Pegawai",
            color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
        },
    };

    const currentBadge = roleBadges[user.role] || {
        label: user.role,
        color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
    };

    const navLinks = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            active: route().current("dashboard"),
            icon: LayoutDashboard,
            roles: ["admin", "technician", "employee"],
        },
        {
            name: "Buat Laporan",
            href: route("reports.create"),
            active: route().current("reports.create"),
            icon: PlusCircle,
            roles: ["employee", "admin"],
        },
        {
            name: user.role === "employee" ? "Laporan Saya" : "Daftar Laporan",
            href: route("reports.index"),
            active: route().current("reports.index") || route().current("reports.show"),
            icon: FileText,
            roles: ["admin", "technician", "employee"],
        },
        {
            name: "Data Fasilitas",
            href: route("facilities.index"),
            active: route().current("facilities.index"),
            icon: Boxes,
            roles: ["admin"],
        },
    ].filter((item) => item.roles.includes(user.role));

    const themeOptions = [
        { id: "light" as ThemeMode, label: "Terang", icon: Sun },
        { id: "dark" as ThemeMode, label: "Gelap", icon: Moon },
        { id: "system" as ThemeMode, label: "Otomatis", icon: Monitor },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
            <Toaster position="top-right" richColors />

            {/* Desktop Sidebar (Collapsible) */}
            <aside
                className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20 shrink-0 transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? "w-20" : "w-64"
                }`}
            >
                {/* Brand Header & Toggle */}
                <div className="h-16 px-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    {!isSidebarCollapsed ? (
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                            <img
                                src={
                                    isDarkActual
                                        ? "/assets/images/LOGOAIRNAVINDONESIALandscapePutih-1.png"
                                        : "/assets/images/LOGOAIRNAVINDONESIALandscape-9-1.png"
                                }
                                alt="AirNav Indonesia"
                                className="h-7 w-auto max-w-[125px] object-contain shrink-0"
                            />
                            <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-sky-200 dark:border-sky-800 shrink-0">
                                AFRS
                            </span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={toggleSidebarCollapse}
                            className="w-full flex items-center justify-center p-1 rounded-xl text-sky-600 dark:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Perluas Sidebar"
                        >
                            <span className="font-extrabold text-sm tracking-tight text-sky-600 dark:text-sky-400">
                                AFRS
                            </span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={toggleSidebarCollapse}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0 ${
                            isSidebarCollapsed ? "hidden" : "block"
                        }`}
                        title="Perkecil Sidebar"
                        aria-label="Perkecil Sidebar"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* User Card in Sidebar */}
                {!isSidebarCollapsed ? (
                    <div className="p-3 mx-2.5 my-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 transition-all">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm"
                                title={user.name}
                            >
                                {user.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                    {user.name}
                                </h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    {user.department?.code ? `${user.department.code} - ` : ""}{user.username}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-semibold rounded-full border ${currentBadge.color}`}>
                                {currentBadge.label}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center my-3 px-2">
                        <div
                            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:ring-2 ring-sky-500/50 transition"
                            title={`${user.name} (${currentBadge.label})`}
                        >
                            {user.name.charAt(0)}
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 px-2.5 space-y-1 overflow-y-auto">
                    {!isSidebarCollapsed && (
                        <p className="px-2.5 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Menu Utama
                        </p>
                    )}
                    {navLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={isSidebarCollapsed ? item.name : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                                    isSidebarCollapsed ? "justify-center px-0" : ""
                                } ${
                                    item.active
                                        ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800/80 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {!isSidebarCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Sidebar Footer Toggle & Logout */}
                <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    {isSidebarCollapsed && (
                        <button
                            type="button"
                            onClick={toggleSidebarCollapse}
                            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Buka Sidebar"
                            aria-label="Buka Sidebar"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        title={isSidebarCollapsed ? "Keluar" : undefined}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition cursor-pointer ${
                            isSidebarCollapsed ? "justify-center" : "px-3"
                        }`}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!isSidebarCollapsed && <span>Keluar</span>}
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <img
                        src={
                            isDarkActual
                                ? "/assets/images/LOGOAIRNAVINDONESIALandscapePutih-1.png"
                                : "/assets/images/LOGOAIRNAVINDONESIALandscape-9-1.png"
                        }
                        alt="AirNav Indonesia"
                        className="h-6 w-auto object-contain"
                    />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">AFRS</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Mobile Theme Switcher */}
                    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {themeOptions.map((opt) => {
                            const Icon = opt.icon;
                            const isSelected = theme === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setTheme(opt.id)}
                                    className={`p-1 rounded-md transition-all ${
                                        isSelected
                                            ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs"
                                            : "text-slate-400"
                                    }`}
                                    title={opt.label}
                                >
                                    <Icon className="w-3 h-3" />
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div
                        className="w-64 h-full bg-white dark:bg-slate-900 p-4 flex flex-col justify-between"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                    AFRS AirNav Medan
                                </span>
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
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
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
                            className="flex items-center gap-2 px-3 py-2 text-rose-600 font-medium text-xs"
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
                <header className="hidden md:flex h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/90 px-6 items-center justify-between sticky top-0 z-10 transition-colors">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleSidebarCollapse}
                            className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title={isSidebarCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
                            aria-label={isSidebarCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
                        >
                            {isSidebarCollapsed ? (
                                <PanelLeftOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            ) : (
                                <PanelLeftClose className="w-4 h-4" />
                            )}
                        </button>

                        {header && (
                            <>
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {header}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Switcher Expanding Pill on Desktop Hover */}
                        <div
                            className="flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all duration-300 ease-out overflow-hidden"
                            onMouseEnter={() => setIsThemeHovered(true)}
                            onMouseLeave={() => setIsThemeHovered(false)}
                        >
                            {themeOptions.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = theme === opt.id;
                                const isVisible = isThemeHovered || isSelected;

                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setTheme(opt.id)}
                                        className={`flex items-center gap-1.5 rounded-lg text-xs font-medium transition-all duration-300 ease-out whitespace-nowrap cursor-pointer ${
                                            isVisible
                                                ? "max-w-[110px] opacity-100 px-2.5 py-1 pointer-events-auto"
                                                : "max-w-0 opacity-0 px-0 py-1 pointer-events-none overflow-hidden scale-90"
                                        } ${
                                            isSelected
                                                ? opt.id === "light"
                                                    ? "bg-amber-400/20 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                                                    : opt.id === "dark"
                                                    ? "bg-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold shadow-xs"
                                                    : "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs"
                                                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                        }`}
                                        title={opt.label}
                                        aria-label={opt.label}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="text-[11px]">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Role Badge */}
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${currentBadge.color}`}>
                            {currentBadge.label}
                        </span>

                        <div className="h-5 w-px bg-slate-200 dark:border-slate-800" />

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[130px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>

                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs animate-fade-slide-up">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href={route("profile.edit")}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                    >
                                        <UserIcon className="w-3.5 h-3.5" />
                                        <span>Profil Pengguna</span>
                                    </Link>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Keluar</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Body with Smooth Fade-in */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-slide-up">
                    {children}
                </main>
            </div>
        </div>
    );
}
