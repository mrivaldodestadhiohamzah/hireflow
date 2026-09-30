"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticateDemoAccount, registerDemoAccount } from "@/lib/demo-auth";
import { LanguageSwitcher, useLanguage } from "./language-switcher";
import hireFlowLogo from "./hireflowlogo.png";

type AuthMode = "login" | "register";

const copy = {
  en: {
    loginTitle: "Welcome back to HireFlow.", loginBody: "Open the demo recruiting workspace and keep every hiring decision in context.", registerTitle: "Create your demo workspace.", registerBody: "Set up a local recruiter session to explore the full HireFlow experience.",
    name: "Full name", email: "Work email", role: "Role", password: "Password", confirm: "Confirm password", remember: "Remember this demo session", login: "Open workspace", register: "Create workspace", loginPrompt: "Already have a workspace?", registerPrompt: "New to HireFlow?", goLogin: "Sign in", goRegister: "Register", show: "Show password", hide: "Hide password", demoNote: "Demo mode: credentials stay in this browser and are never sent to a server.", required: "Complete all required fields.", emailError: "Enter a valid email address.", passwordError: "Use at least 6 characters.", matchError: "Passwords do not match.", accountExists: "An account with this email already exists. Sign in instead.", accountMissing: "No local demo account was found. Register first on this browser.", invalidCredentials: "The email or password does not match this browser's demo account.", rolePlaceholder: "e.g. Recruiting lead", namePlaceholder: "e.g. Nabila Putri Ramadhani",
  },
  id: {
    loginTitle: "Selamat datang kembali di HireFlow.", loginBody: "Buka ruang kerja rekrutmen demo dan simpan setiap keputusan perekrutan dalam konteks.", registerTitle: "Buat ruang kerja demo Anda.", registerBody: "Siapkan sesi perekrut lokal untuk menjelajahi pengalaman HireFlow.",
    name: "Nama lengkap", email: "Email kerja", role: "Peran", password: "Kata sandi", confirm: "Konfirmasi kata sandi", remember: "Ingat sesi demo ini", login: "Buka ruang kerja", register: "Buat ruang kerja", loginPrompt: "Sudah memiliki ruang kerja?", registerPrompt: "Baru mengenal HireFlow?", goLogin: "Masuk", goRegister: "Daftar", show: "Tampilkan kata sandi", hide: "Sembunyikan kata sandi", demoNote: "Mode demo: kredensial tersimpan di browser ini dan tidak dikirim ke server.", required: "Lengkapi semua kolom wajib.", emailError: "Masukkan alamat email yang valid.", passwordError: "Gunakan setidaknya 6 karakter.", matchError: "Kata sandi tidak cocok.", accountExists: "Akun dengan email ini sudah ada. Silakan masuk.", accountMissing: "Akun demo lokal tidak ditemukan. Daftar terlebih dahulu di browser ini.", invalidCredentials: "Email atau kata sandi tidak cocok dengan akun demo di browser ini.", rolePlaceholder: "mis. Pemimpin rekrutmen", namePlaceholder: "mis. Nabila Putri Ramadhani",
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
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === "register";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
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
    if (isRegister && (!name || !role)) return setError(text.required);
    if (isRegister && password !== confirmation) return setError(text.matchError);
    setSubmitting(true);
    if (isRegister) {
      const result = await registerDemoAccount({ name, email, role }, password, remember);
      if (!result.ok) { setSubmitting(false); return setError(result.reason === "exists" ? text.accountExists : text.required); }
    } else {
      const account = await authenticateDemoAccount(email, password, remember);
      if (!account.ok) { setSubmitting(false); return setError(account.reason === "missing" ? text.accountMissing : text.invalidCredentials); }
    }
    router.push("/demo");
  };

  return <main className="min-h-screen bg-[#edf2f0] px-4 py-5 sm:px-8 sm:py-8"><div className="mx-auto max-w-6xl"><div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-2.5"><Image src={hireFlowLogo} alt="HireFlow" className="h-9 w-9 object-contain" sizes="36px" priority unoptimized /><span className="text-lg font-semibold tracking-tight">HireFlow</span></Link><LanguageSwitcher language={language} onChange={changeLanguage} compact /></div><div className="mx-auto mt-8 grid max-w-5xl overflow-hidden rounded-[2rem] border border-[#d8e2dc] bg-white shadow-[0_24px_80px_rgba(16,38,54,.12)] lg:grid-cols-[.9fr_1.1fr]"><div className="relative overflow-hidden bg-[#102636] p-7 text-white sm:p-10"><div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-[#d9ff9d]/20" /><div className="absolute bottom-8 right-8 h-4 w-4 rounded-full bg-[#d9ff9d]" /><p className="relative eyebrow text-[#d9ff9d]">HireFlow · {isRegister ? "Create space" : "Recruiter demo"}</p><h1 className="relative mt-5 max-w-sm text-3xl font-semibold tracking-tight sm:text-4xl">{isRegister ? text.registerTitle : text.loginTitle}</h1><p className="relative mt-4 max-w-sm text-sm leading-relaxed text-slate-300">{isRegister ? text.registerBody : text.loginBody}</p><div className="relative mt-10 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-relaxed text-slate-200"><span className="font-semibold text-white">{text.demoNote}</span></div></div><div className="p-7 sm:p-10"><div className="mb-6"><p className="flow-kicker">{isRegister ? "Your starting point" : "Continue the flow"}</p><p className="mt-2 text-sm text-slate-500">{isRegister ? "Create a clean workspace for your own hiring process." : "Open a workspace that keeps people, context, and decisions together."}</p></div><form onSubmit={submit} noValidate><div className="space-y-4">{isRegister && <label className="block text-sm font-semibold">{text.name}<input name="name" autoComplete="name" placeholder={text.namePlaceholder} className="flow-input mt-1.5" /></label>}<label className="block text-sm font-semibold">{text.email}<input name="email" type="email" autoComplete="email" placeholder="demo@hireflow.app" className="flow-input mt-1.5" /></label>{isRegister && <label className="block text-sm font-semibold">{text.role}<input name="role" placeholder={text.rolePlaceholder} className="flow-input mt-1.5" /></label>}<label className="block text-sm font-semibold">{text.password}<span className="relative mt-1.5 block"><input name="password" type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} className="flow-input pr-11" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? text.hide : text.show} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>{isRegister && <label className="block text-sm font-semibold">{text.confirm}<span className="relative mt-1.5 block"><input name="confirmation" type={showConfirm ? "text" : "password"} autoComplete="new-password" className="flow-input pr-11" /><button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? text.hide : text.show} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>}{error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}{!isRegister && <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-brand" />{text.remember}</label>}<button type="submit" disabled={submitting} className="flow-primary-button inline-flex h-12 w-full items-center justify-center gap-2 disabled:opacity-60">{submitting ? (isRegister ? text.register : text.login) + "…" : isRegister ? text.register : text.login}<ArrowRight size={16} /></button></div></form><p className="mt-6 text-center text-sm text-slate-500">{isRegister ? text.loginPrompt : text.registerPrompt} <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-brand hover:underline">{isRegister ? text.goLogin : text.goRegister}</Link></p></div></div></div></main>;
}
