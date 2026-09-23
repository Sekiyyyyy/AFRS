import { FormEventHandler, useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { User, Lock, Eye, EyeOff } from "lucide-react";

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("employee");

    const { data, setData, post, processing, errors, reset } = useForm({
        login: "epmloyee",
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
        { id: "technician", label: "Teknisi", user: "technician" },
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
            <Head title="Masuk — AFRS" />

            <div className="w-full max-w-[400px] bg-slate-900/95 border border-slate-800/95 rounded-2xl p-7 sm:p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <img
                        src="/assets/images/LOGOAIRNAVINDONESIALandscapePutih-1.png"
                        alt="AirNav Indonesia"
                        className="h-x mx-auto mb-4 object-contain"
                    />
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        AFRS
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        AirNav Facility Reporting System
                    </p>
                </div>

                {status && (
                    <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
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
                                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800/70 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all ${errors.login ? "border-rose-500 bg-rose-500/10" : "border-slate-700/80 hover:border-slate-600"}`}
                                placeholder="Masukkan username atau email"
                                onChange={(e) => setData("login", e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                        {(errors.login) && (
                            <p className="mt-1.5 text-xs text-rose-400 font-medium">
                                {errors.login}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className={`w-full pl-10 pr-11 py-2.5 text-sm bg-slate-800/70 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all ${errors.password ? "border-rose-500 bg-rose-500/10" : "border-slate-700/80 hover:border-slate-600"}`}
                                placeholder="Masukkan kata sandi"
                                onChange={(e) => setData("password", e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
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
                            <p className="mt-1.5 text-xs text-rose-400 font-medium">
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
                                className="rounded border-slate-700 bg-slate-800 text-sky-600 shadow-sm focus:ring-sky-500/30"
                            />
                            <span className="text-xs text-slate-400">
                                Ingat saya
                            </span>
                        </label>
                    </div>


                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-lg shadow-sky-600/20 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Masuk"
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-800/80">
                    <div className="flex items-center justify-center gap-2">
                        {demoRoles.map((role) => {
                            const isSelected = selectedRole === role.id;
                            return (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => applyDemoRole(role.user, role.id)}
                                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${isSelected ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/50"}`}
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
