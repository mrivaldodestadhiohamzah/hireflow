"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveDemoUser } from "@/lib/demo-auth";
import { LanguageSwitcher, useLanguage } from "./language-switcher";
import hireFlowLogo from "./hireflowlogo.png";

type AuthMode = "login" | "register";

const copy = {
  en: {
    loginTitle: "Welcome back to HireFlow.", loginBody: "Open the demo recruiting workspace and keep every hiring decision in context.", registerTitle: "Create your demo workspace.", registerBody: "Set up a local recruiter session to explore the full HireFlow experience.",
    name: "Full name", email: "Work email", role: "Role", password: "Password", confirm: "Confirm password", remember: "Remember this demo session", login: "Open workspace", register: "Create workspace", loginPrompt: "Already have a workspace?", registerPrompt: "New to HireFlow?", goLogin: "Sign in", goRegister: "Register", show: "Show password", hide: "Hide password", demoNote: "Demo mode: no credentials are sent to a server.", required: "Complete all required fields.", emailError: "Enter a valid email address.", passwordError: "Use at least 6 characters.", matchError: "Passwords do not match.", rolePlaceholder: "e.g. Recruiting lead", namePlaceholder: "e.g. Nabila Putri Ramadhani",
  },
  id: {
    loginTitle: "Selamat datang kembali di HireFlow.", loginBody: "Buka ruang kerja rekrutmen demo dan simpan setiap keputusan perekrutan dalam konteks.", registerTitle: "Buat ruang kerja demo Anda.", registerBody: "Siapkan sesi perekrut lokal untuk menjelajahi pengalaman HireFlow.",
    name: "Nama lengkap", email: "Email kerja", role: "Peran", password: "Kata sandi", confirm: "Konfirmasi kata sandi", remember: "Ingat sesi demo ini", login: "Buka ruang kerja", register: "Buat ruang kerja", loginPrompt: "Sudah memiliki ruang kerja?", registerPrompt: "Baru mengenal HireFlow?", goLogin: "Masuk", goRegister: "Daftar", show: "Tampilkan kata sandi", hide: "Sembunyikan kata sandi", demoNote: "Mode demo: kredensial tidak dikirim ke server.", required: "Lengkapi semua kolom wajib.", emailError: "Masukkan alamat email yang valid.", passwordError: "Gunakan setidaknya 6 karakter.", matchError: "Kata sandi tidak cocok.", rolePlaceholder: "mis. Pemimpin rekrutmen", namePlaceholder: "mis. Nabila Putri Ramadhani",
  },
} as const;

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { language, changeLanguage } = useLanguage();
  const text = copy[language];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);
  const isRegister = mode === "register";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    const role = String(data.get("role") ?? "").trim() || (language === "en" ? "Recruiting lead" : "Pemimpin rekrutmen");
    if ((isRegister && !name) || !email || !password || (isRegister && !confirmation)) return setError(text.required);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError(text.emailError);
    if (password.length < 6) return setError(text.passwordError);
    if (isRegister && password !== confirmation) return setError(text.matchError);
    saveDemoUser({ name: isRegister ? name : name || email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()), email, role }, remember);
    router.push("/demo");
  };

  return <main className="min-h-screen bg-mist px-5 py-6 sm:px-8 sm:py-10"><div className="mx-auto max-w-5xl"><div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-2.5"><Image src={hireFlowLogo} alt="HireFlow" className="h-9 w-9 object-contain" sizes="36px" priority unoptimized /><span className="text-lg font-semibold tracking-tight">HireFlow</span></Link><LanguageSwitcher language={language} onChange={changeLanguage} compact /></div><div className="mx-auto mt-12 grid max-w-4xl overflow-hidden rounded-3xl border border-line bg-white shadow-soft lg:grid-cols-[.9fr_1.1fr]"><div className="bg-ink p-7 text-white sm:p-10"><p className="eyebrow text-blue-300">HireFlow · Demo workspace</p><h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{isRegister ? text.registerTitle : text.loginTitle}</h1><p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">{isRegister ? text.registerBody : text.loginBody}</p><div className="mt-10 rounded-2xl border border-slate-700 bg-white/5 p-4 text-sm leading-relaxed text-slate-300"><span className="font-semibold text-white">{text.demoNote}</span></div></div><div className="p-7 sm:p-10"><form onSubmit={submit} noValidate><div className="space-y-4">{isRegister && <label className="block text-sm font-semibold">{text.name}<input name="name" autoComplete="name" placeholder={text.namePlaceholder} className="mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100" /></label>}<label className="block text-sm font-semibold">{text.email}<input name="email" type="email" autoComplete="email" placeholder="nabila@hireflow.demo" className="mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100" /></label>{isRegister && <label className="block text-sm font-semibold">{text.role}<input name="role" placeholder={text.rolePlaceholder} className="mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100" /></label>}<label className="block text-sm font-semibold">{text.password}<span className="relative mt-1.5 block"><input name="password" type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} className="h-11 w-full rounded-xl border px-3 pr-11 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? text.hide : text.show} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>{isRegister && <label className="block text-sm font-semibold">{text.confirm}<span className="relative mt-1.5 block"><input name="confirmation" type={showConfirm ? "text" : "password"} autoComplete="new-password" className="h-11 w-full rounded-xl border px-3 pr-11 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100" /><button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? text.hide : text.show} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>}{error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}{!isRegister && <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-brand" />{text.remember}</label>}<button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-blue-700">{isRegister ? text.register : text.login}<ArrowRight size={16} /></button></div></form><p className="mt-6 text-center text-sm text-slate-500">{isRegister ? text.loginPrompt : text.registerPrompt} <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-brand hover:underline">{isRegister ? text.goLogin : text.goRegister}</Link></p></div></div></div></main>;
}
