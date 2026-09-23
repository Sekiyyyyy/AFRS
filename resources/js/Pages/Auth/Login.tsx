import { FormEventHandler, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Shield,
    Wrench,
    UserCheck,
    CheckCircle2,
} from "lucide-react";

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: "",
        password: "",
        remember: true,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

     const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const demoRoles = [
        {
            id: "employee",
            label: "Pegawai / User",
            user: "employee",
            desc: "Staff Pelapor Fasilitas",
            icon: UserCheck,
        },
        {
            id: "technician",
            label: "Support / Teknik",
            user: "technician",
            desc: "Teknisi IT & Fasilitas",
            icon: Wrench,
        },
        {
            id: "admin",
            label: "Admin",
            user: "admin",
            desc: "Administrator Sistem AFRS",
            icon: Shield,
        },
    ];

    const applyDemoRole = (roleUser: string, roleId: string) => {
        setData({
            login: roleUser,
            password: "password",
            remember: true,
        });
        setSelectedRole(roleId);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 font-sans selection:bg-sky-500 selection:text-white relative overflow-hidden">
            <Head title="Masuk — AFRS AirNav Indonesia" />


            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w[-650px] h[-380px] bg-gradient-to-b from-sky-400/15 via-blue-600/10 to-transparent blur-3xl rounded-full" />
            <div className="pointer-events-none absolute -under-32 ri-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />


            <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 p-6 sm:p-8 relative z-10">

                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 mb-4 shadow-sm">
                        <img
                            src="/assets/images/LOGOAIRNAVINDONESIALandscape-9-1.png"
                            alt="AirNav Indonesia"
                            className="h-10 sm:h-11 w-auto object-contain dark:hidden"
                        />
                        <img
                            src="/assets/images/LOGOAIRNAVINDONESIALandscapePutih-1.png"
                            alt="AirNav Indonesia"
                            className="h-10 sm:h-11 w-auto object-contain hidden dark:block"
                        />
                    </div>


                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/70 dark:border-sky-800 text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
                            AFRS
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            AirNav Facility Reporting System
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Sistem Pelaporan Kerusakan Fasilitas • Cabang Medan
                        </p>
                    </div>
                </div>


                {status && (
                    <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{status}</span>
                    </div>
                )}


                <form onSubmit={submit} className="space-y-4">

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Username atau Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                id="login"
                                type="text"
                                name="login"
                                value={data.login}
                                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-800/60 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all ${
                                     errors.login
                                         ? "border-rose-400 dark:border-rose-500 bg-rose-50/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                }`}
                                placeholder="Masukkan username atau email"
                                onChange={(e) => setData("login", e.target.value)}
                                autoComplete="username"
                                autoFocus
                                required
                            />
                        </div>
                        {errors.login && (
                            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                                {errors.login}
                            </p>
                        )}
                    </div>


                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Kata Sandi
                            </label>
                            <span className="text-[11px] text-slate-400">Default: password</span>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className={`w-full pl-10 pr-11 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-800/60 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all ${
                                     errors.password
                                         ? "border-rose-400 dark:border-rose-500 bg-rose-50/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                }`}
                                placeholder="Masukkan kata sandi"
                                onChange={(e) => setData("password", e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {!showPassword ? (
                                    <Eye className="w-4 h-4" />
                                ) : (
                                    <EyeOff className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                                {errors.password}
                            </p>
                        )}
                    </div>


                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData("remember", e.target.checked)}
                                className="rounded border-slate-300 text-sky-600 shadow-sm focus:ring-sky-500/30"
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                                Ingat sesi login
                            </span>
                        </label>
                    </div>


                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 via-sky-700 to-blue-700 hover:from-sky-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-lg shadow-sky-600/25 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                    >
                        {processing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Masuk ke Sistem</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>


                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                            Pilih Akun Demo (3 Role)
                        </span>
                    </div>
                </div>


                <div className="grid grid-cols-3 gap-2">
                    {demoRoles.map((role) => {
                        const isSelected = selectedRole === role.id;
                        const Icon = role.icon;
                        return (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => applyDemoRole(role.user, role.id)}
                                className={`flex flex-col items-center text-center p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                                     isSelected
                                         ? "border-sky-500 bg-sky-50 dark:bg-sky-950/50 shadow-sm ring-2 ring-sky-500/30"
                                        : "border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                                }`}
                            >
                                <div
                                    className={`p-1.5 rounded-lg mb-1.5 ${
                                        isSelected
                                            ? "bg-sky-600 text-white"
                                            : "bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-tight text-[11px]">
                                    {role.label}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                                    {role.user}
                                </span>
                            </button>
                        );
                    })}
                </div>


                <div className="mt-6 pt-4 border-t border-slate-100 dark:bg-slate-800/80 text-center">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        © 2026 AirNav Indonesia • Kantor Cabang Medan
                    </p>
                    <p className="text-[10px] text-slate-400/80 mt-0.5">
                        AirNav Facility Reporting System (AFRS)
                    </p>
                </div>
            </div>
        </div>
    );
}