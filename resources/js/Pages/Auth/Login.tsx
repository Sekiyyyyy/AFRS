import { FormEventHandler, useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { User, Lock, Eye, EyeOff, Radio, ArrowRight } from "lucide-react";

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("employee");

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

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden select-none">
            <Head title="Masuk ? AFRS AirNav Indonesia" />

            {/* Background Layer: Authentic AirNav Tower Kualanamu with Deep Dark Vignette */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/images/TowerKualanamu.jpg"
                    alt="AirNav Kualanamu Medan"
                    className="w-full h-full object-cover opacity-20 filter blur-[3px] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/90" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.12),transparent_70%)]" />
            </div>

            {/* Aviation Radar Animation Backdrop */}
            <div className="absolute z-0 pointer-events-none flex items-center justify-center opacity-30">
                <div className="w-[500px] h-[500px] rounded-full border border-sky-500/20 flex items-center justify-center">
                    <div className="w-[360px] h-[360px] rounded-full border border-sky-500/20 flex items-center justify-center">
                        <div className="w-[220px] h-[220px] rounded-full border border-sky-500/20" />
                    </div>
                </div>
                <div className="absolute w-[500px] h-[500px] rounded-full animate-radar-spin">
                    <div className="w-1/2 h-1/2 bg-gradient-to-br from-sky-400/20 via-transparent to-transparent rounded-tl-full origin-bottom-right" />
                </div>
            </div>

            {/* Top Bar Status Badge */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-xs z-10 text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
                    <span className="font-mono text-[11px] tracking-wider text-slate-300">AIRNAV CABANG MEDAN</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                    <Radio className="w-3.5 h-3.5 text-sky-400" />
                    <span>WIMM / KNO ? ONLINE</span>
                </div>
            </div>

            {/* Central Modern Auth Card */}
            <div className="relative z-10 w-full max-w-[380px] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(14,165,233,0.15)]">
                {/* Top Glowing Ambient Border Line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

                {/* Header: Proportionate Clean Logo & Title */}
                <div className="text-center mb-5">
                    <img
                        src="/assets/images/LOGOAIRNAVINDONESIALandscapePutih-1.png"
                        alt="AirNav Indonesia"
                        className="h-7 w-auto max-w-[155px] mx-auto mb-3 object-contain drop-shadow-[0_2px_10px_rgba(56,189,248,0.3)] transition-transform duration-300 hover:scale-105"
                    />
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-1.5">
                        <span className="w-1 h-1 rounded-full bg-sky-400 animate-pulse" />
                        FACILITY REPORTING SYSTEM
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-white">
                        AFRS
                    </h1>
                    <p className="text-[11px] text-slate-400">
                        AirNav Facility Reporting System
                    </p>
                </div>

                {status && (
                    <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400 text-center">
                        {status}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
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
                                className={`w-full pl-9 pr-3.5 py-2 text-xs bg-slate-950/70 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 transition-all ${
                                    errors.login
                                        ? "border-rose-500 bg-rose-500/10"
                                        : "border-slate-800 hover:border-slate-700"
                                }`}
                                placeholder="Masukkan username / email"
                                onChange={(e) => setData("login", e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                        {errors.login && (
                            <p className="mt-1 text-xs text-rose-400 font-medium">
                                {errors.login}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
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
                                className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-950/70 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400/50 focus:border-sky-400 transition-all ${
                                    errors.password
                                        ? "border-rose-500 bg-rose-500/10"
                                        : "border-slate-800 hover:border-slate-700"
                                }`}
                                placeholder="Masukkan kata sandi"
                                onChange={(e) => setData("password", e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
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
                            <p className="mt-1 text-xs text-rose-400 font-medium">
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
                                className="rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-sky-500/30"
                            />
                            <span className="text-[11px] text-slate-400">
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
                <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl">
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
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
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
