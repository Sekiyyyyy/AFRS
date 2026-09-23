import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Sun,
    Moon,
    Monitor,
    ChevronDown,
    Check,
} from "lucide-react";

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

type ThemeMode = "light" | "dark" | "system";

export default function Login({ status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("employee");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Theme state (light, dark, system/otomatis)
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

    // Click outside listener for mobile touch responsiveness
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        login: "employee",
        password: "password",
        remember: true,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    const demoRoles = [
        { id: "employee", label: "Pegawai", user: "employee" },
        { id: "technician", label: "Teknik", user: "technician" },
        { id: "admin", label: "Admin", user: "admin" },
    ];

    const applyDemoRole = (username: string, roleId: string) => {
        setSelectedRole(roleId);
        setData((prev) => ({
            ...prev,
            login: username,
            password: "password",
        }));
    };

    const themeOptions = [
        { id: "light" as ThemeMode, label: "Terang", icon: Sun },
        { id: "dark" as ThemeMode, label: "Gelap", icon: Moon },
        { id: "system" as ThemeMode, label: "Otomatis", icon: Monitor },
    ];

    const currentThemeOption = themeOptions.find((t) => t.id === theme) || themeOptions[2];
    const ActiveThemeIcon = currentThemeOption.icon;

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden select-none">
            <Head title="Masuk ? AFRS AirNav Indonesia" />

            {/* Background Layer: Authentic AirNav Tower Kualanamu with Dynamic Vignette */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/images/TowerKualanamu.jpg"
                    alt="AirNav Kualanamu Medan"
                    className="w-full h-full object-cover opacity-15 dark:opacity-20 filter blur-[3px] scale-105 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-slate-100/90 to-slate-100/90 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950/90 transition-colors duration-300" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.12),transparent_70%)]" />
            </div>

            {/* Aviation Radar Animation Backdrop */}
            <div className="absolute z-0 pointer-events-none flex items-center justify-center opacity-25 dark:opacity-30">
                <div className="w-[500px] h-[500px] rounded-full border border-sky-500/20 flex items-center justify-center">
                    <div className="w-[360px] h-[360px] rounded-full border border-sky-500/20 flex items-center justify-center">
                        <div className="w-[220px] h-[220px] rounded-full border border-sky-500/20" />
                    </div>
                </div>
                <div className="absolute w-[500px] h-[500px] rounded-full animate-radar-spin">
                    <div className="w-1/2 h-1/2 bg-gradient-to-br from-sky-400/20 via-transparent to-transparent rounded-tl-full origin-bottom-right" />
                </div>
            </div>

            {/* Top Bar: Logo on Top-Left */}
            <div className="absolute top-4 left-4 sm:top-7 sm:left-8 z-20">
                <img
                    src={
                        isDarkActual
                            ? "/assets/images/LOGOAIRNAVINDONESIALandscapePutih-1.png"
                            : "/assets/images/LOGOAIRNAVINDONESIALandscape-9-1.png"
                    }
                    alt="AirNav Indonesia"
                    className="h-7 sm:h-8 w-auto object-contain drop-shadow-[0_2px_10px_rgba(56,189,248,0.25)] transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Top Bar: Responsive Hover / Tap Theme Toggle on Top-Right */}
            <div className="absolute top-4 right-4 sm:top-7 sm:right-8 z-30" ref={menuRef}>
                <div
                    className="relative"
                    onMouseEnter={() => setIsMenuOpen(true)}
                    onMouseLeave={() => setIsMenuOpen(false)}
                >
                    {/* Idle State: Only shows the single active mode */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-md hover:border-sky-500/50 dark:hover:border-sky-400/50 transition-all cursor-pointer group"
                        aria-label="Ganti Tema Tampilan"
                        title={`Tema aktif: ${currentThemeOption.label}. Klik atau sorot untuk mengganti.`}
                    >
                        <ActiveThemeIcon className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            {currentThemeOption.label}
                        </span>
                        <ChevronDown
                            className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                                isMenuOpen ? "rotate-180 text-sky-500" : ""
                            }`}
                        />
                    </button>

                    {/* Hover / Tap Menu: Expands smoothly showing all 3 theme options */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-36 py-1 px-1 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl animate-fade-slide-up flex flex-col gap-0.5 z-40">
                            {themeOptions.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = theme === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                            setTheme(opt.id);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                                            isSelected
                                                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 font-semibold"
                                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>{opt.label}</span>
                                        </div>
                                        {isSelected && (
                                            <Check className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Central Modern Auth Card with Smooth Entrance Animation */}
            <div className="relative z-10 w-full max-w-[380px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_0_30px_rgba(14,165,233,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(14,165,233,0.15)] animate-fade-slide-up transition-colors duration-300">
                {/* Top Glowing Ambient Border Line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

                {/* Header: Clean Direct Title */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
                        AFRS
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        AirNav Facility Reporting System
                    </p>
                </div>

                {status && (
                    <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-600 dark:text-emerald-400 text-center">
                        {status}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Username atau Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                id="login"
                                type="text"
                                name="login"
                                value={data.login}
                                className={`w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500 transition-all ${
                                    errors.login
                                        ? "border-rose-500 bg-rose-500/10"
                                        : "border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
                                }`}
                                placeholder="Masukkan username / email"
                                onChange={(e) => setData("login", e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                        {errors.login && (
                            <p className="mt-1 text-xs text-rose-500 dark:text-rose-400 font-medium">
                                {errors.login}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-950/70 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500 transition-all ${
                                    errors.password
                                        ? "border-rose-500 bg-rose-500/10"
                                        : "border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
                                }`}
                                placeholder="Masukkan kata sandi"
                                onChange={(e) => setData("password", e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-rose-500 dark:text-rose-400 font-medium">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData("remember", e.target.checked)}
                                className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sky-600 focus:ring-sky-500/30"
                            />
                            <span className="text-[11px] text-slate-600 dark:text-slate-400">
                                Ingat saya
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Masuk ke Sistem</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Sleek Segmented Role Switcher */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl transition-colors">
                        {demoRoles.map((role) => {
                            const isSelected = selectedRole === role.id;
                            return (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => applyDemoRole(role.user, role.id)}
                                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${
                                        isSelected
                                            ? "bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/30"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/50"
                                    }`}
                                >
                                    {role.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
