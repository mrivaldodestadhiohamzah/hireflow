"use client";

import { FormEvent, ReactNode, useState } from "react";
import { Check, ChevronDown, HelpCircle, LogOut, Mail, Save, ShieldCheck, UserPlus, Users, X } from "lucide-react";
import type { DemoUser } from "@/lib/demo-auth";
import type { WorkspaceSettings, WorkspaceTeamMember } from "@/lib/demo-workspace";
import type { Language } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

const text = (language: Language, en: string, id: string) => language === "en" ? en : id;

export function ProfilePage({ user, language, onSave, onLogout }: { user: DemoUser; language: Language; onSave: (user: DemoUser) => void; onLogout: () => void }) {
  const [draft, setDraft] = useState(user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.role.trim()) return setError(text(language, "Name and role are required.", "Nama dan peran wajib diisi."));
    setError("");
    setSaving(true);
    window.setTimeout(() => {
      onSave({ ...draft, name: draft.name.trim(), role: draft.role.trim() });
      setSaving(false);
    }, 350);
  };

  const initials = draft.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <SectionFrame eyebrow={text(language, "Your account", "Akun Anda")} title={text(language, "Profile", "Profil")} intro={text(language, "Keep your recruiter identity and contact details current.", "Jaga identitas dan detail kontak perekrut tetap terbaru.")}>
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <section className="surface p-6">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-xl font-semibold text-white">{initials}</div>
        <h2 className="mt-5 text-lg font-semibold">{draft.name}</h2>
        <p className="mt-1 text-sm text-slate-500">{draft.role}</p>
        <p className="mt-4 text-sm text-slate-600">{draft.email}</p>
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-relaxed text-slate-600">{text(language, "Profile changes stay in this browser-local workspace.", "Perubahan profil tersimpan di ruang kerja lokal pada browser ini.")}</div>
        <button type="button" onClick={onLogout} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:underline"><LogOut size={16} />{text(language, "Log out", "Keluar")}</button>
      </section>
      <form className="surface p-6" onSubmit={submit}>
        <div className="flex items-center justify-between"><h2 className="font-semibold">{text(language, "Edit details", "Edit detail")}</h2><UserPlus className="text-brand" size={19} /></div>
        <label className="mt-6 block text-sm font-semibold">{text(language, "Full name", "Nama lengkap")}<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" /></label>
        <label className="mt-4 block text-sm font-semibold">{text(language, "Email", "Email")}<input value={draft.email} readOnly className="mt-1.5 h-11 w-full cursor-not-allowed rounded-xl border bg-slate-50 px-3 text-sm font-normal text-slate-500 outline-none" /><span className="mt-1 block text-xs font-normal text-slate-500">{text(language, "Email is fixed for this browser-local account.", "Email tetap untuk akun lokal pada browser ini.")}</span></label>
        <label className="mt-4 block text-sm font-semibold">{text(language, "Role", "Peran")}<input value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} className="mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" /></label>
        {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
        <button type="submit" disabled={saving} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"><Save size={16} />{saving ? text(language, "Saving…", "Menyimpan…") : text(language, "Save profile", "Simpan profil")}</button>
      </form>
    </div>
  </SectionFrame>;
}

export function TeamPage({ language, members, onInvite }: { language: Language; members: WorkspaceTeamMember[]; onInvite: (member: WorkspaceTeamMember) => void }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selected, setSelected] = useState<WorkspaceTeamMember | null>(null);
  const [error, setError] = useState("");

  const invite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const role = String(data.get("role") ?? "").trim();
    if (!name || !email || !role) return setError(text(language, "Complete the invite details.", "Lengkapi detail undangan."));
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError(text(language, "Enter a valid email address.", "Masukkan alamat email yang valid."));
    if (members.some((member) => member.email.toLowerCase() === email)) return setError(text(language, "That teammate is already listed.", "Anggota tersebut sudah tercantum."));
    const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    onInvite({ id: Date.now(), name, email, role, initials, tone: "bg-sky-100 text-sky-700" });
    setInviteOpen(false);
    setError("");
    event.currentTarget.reset();
  };

  return <SectionFrame eyebrow={text(language, "Organization", "Organisasi")} title={text(language, "Team", "Tim")} intro={text(language, "See who is involved in the hiring process and invite a teammate when the work expands.", "Lihat siapa yang terlibat dalam proses perekrutan dan undang anggota saat tim berkembang.")}>
    <section className="surface overflow-hidden">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><h2 className="font-semibold">{text(language, "Hiring team", "Tim perekrutan")}</h2><p className="mt-1 text-sm text-slate-500">{members.length} {text(language, "people in this workspace", "orang di ruang kerja ini")}</p></div>
        <button type="button" onClick={() => setInviteOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-3.5 text-sm font-semibold text-white hover:bg-blue-700"><UserPlus size={17} />{text(language, "Invite teammate", "Undang anggota")}</button>
      </div>
      {members.length > 0 ? <div className="divide-y">{members.map((member) => <div key={member.id} className="flex items-center gap-3 p-5 sm:p-6"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold ${member.tone}`}>{member.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{member.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{member.role} · {member.email}</p></div><button type="button" onClick={() => setSelected(member)} className="rounded-lg border px-3 py-2 text-xs font-semibold text-brand hover:bg-blue-50">{text(language, "Manage", "Kelola")}</button></div>)}</div> : <EmptyState icon={<Users size={22} />} title={text(language, "No teammates yet", "Belum ada anggota tim")} body={text(language, "Invite the people who help review, interview, and decide on candidates.", "Undang orang yang membantu meninjau, mewawancarai, dan memutuskan kandidat.")} action={text(language, "Invite teammate", "Undang anggota")} onAction={() => setInviteOpen(true)} />}
    </section>
    {inviteOpen && <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/30 p-4" onClick={() => setInviteOpen(false)}><form role="dialog" aria-modal="true" aria-label={text(language, "Invite teammate", "Undang anggota")} onSubmit={invite} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-semibold">{text(language, "Invite teammate", "Undang anggota")}</h2><button type="button" onClick={() => setInviteOpen(false)} aria-label={text(language, "Close", "Tutup")}><X size={18} /></button></div><label className="mt-5 block text-sm font-semibold">{text(language, "Name", "Nama")}<input name="name" className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm font-normal" /></label><label className="mt-4 block text-sm font-semibold">{text(language, "Email", "Email")}<input name="email" type="email" className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm font-normal" /></label><label className="mt-4 block text-sm font-semibold">{text(language, "Role", "Peran")}<input name="role" className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm font-normal" /></label>{error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}<button type="submit" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white"><Mail size={16} />{text(language, "Add teammate", "Tambah anggota")}</button></form></div>}
    {selected && <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/30 p-4" onClick={() => setSelected(null)}><div role="dialog" aria-modal="true" aria-label={selected.name} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-lg font-semibold">{selected.name}</p><p className="mt-1 text-sm text-slate-500">{selected.role}</p></div><button type="button" onClick={() => setSelected(null)} aria-label={text(language, "Close", "Tutup")}><X size={18} /></button></div><p className="mt-5 text-sm text-slate-600">{selected.email}</p><button type="button" onClick={() => setSelected(null)} className="mt-6 h-10 w-full rounded-xl border text-sm font-semibold hover:bg-slate-50">{text(language, "Close", "Tutup")}</button></div></div>}
  </SectionFrame>;
}

export function SettingsPage({ language, changeLanguage, settings, onChange, workspaceName }: { language: Language; changeLanguage: (language: Language) => void; settings: WorkspaceSettings; onChange: (settings: WorkspaceSettings) => void; workspaceName: string }) {
  const [saved, setSaved] = useState(false);
  const save = () => { onChange(settings); setSaved(true); window.setTimeout(() => setSaved(false), 2500); };
  return <SectionFrame eyebrow={text(language, "Workspace controls", "Kontrol ruang kerja")} title={text(language, "Settings", "Pengaturan")} intro={text(language, "Tune the workspace without changing how your team makes human decisions.", "Sesuaikan ruang kerja tanpa mengubah cara tim mengambil keputusan.")}>
    <div className="grid gap-6 lg:grid-cols-2">
      <SettingsCard title={text(language, "Account", "Akun")} icon={<Users size={18} />}><SettingRow title={text(language, "Workspace", "Ruang kerja")} detail={workspaceName} /><SettingRow title={text(language, "Access", "Akses")} detail={text(language, "Browser-local recruiter session", "Sesi perekrut lokal pada browser")} /></SettingsCard>
      <SettingsCard title={text(language, "Appearance", "Tampilan")} icon={<Check size={18} />}><ToggleRow title={text(language, "Reduced motion", "Gerakan berkurang")} detail={text(language, "Respect your system motion preference.", "Hormati preferensi gerakan sistem Anda.")} checked={settings.reducedMotion} onChange={(reducedMotion) => onChange({ ...settings, reducedMotion })} /></SettingsCard>
      <SettingsCard title={text(language, "Language", "Bahasa")} icon={<ChevronDown size={18} />}><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">{text(language, "Interface language", "Bahasa antarmuka")}</p><p className="mt-1 text-xs text-slate-500">{text(language, "Choose English or Bahasa Indonesia.", "Pilih English atau Bahasa Indonesia.")}</p></div><LanguageSwitcher language={language} onChange={changeLanguage} compact /></div></SettingsCard>
      <SettingsCard title={text(language, "Notifications", "Notifikasi")} icon={<Mail size={18} />}><ToggleRow title={text(language, "Hiring activity", "Aktivitas perekrutan")} detail={text(language, "Receive updates when records change.", "Terima pembaruan saat data berubah.")} checked={settings.emailUpdates} onChange={(emailUpdates) => onChange({ ...settings, emailUpdates })} /><ToggleRow title={text(language, "Weekly digest", "Ringkasan mingguan")} detail={text(language, "A short review of workspace activity.", "Ringkasan singkat aktivitas ruang kerja.")} checked={settings.weeklyDigest} onChange={(weeklyDigest) => onChange({ ...settings, weeklyDigest })} /></SettingsCard>
      <SettingsCard title={text(language, "Security", "Keamanan")} icon={<ShieldCheck size={18} />}><div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3"><ShieldCheck className="shrink-0 text-emerald-600" size={18} /><p className="text-sm leading-relaxed text-emerald-800">{text(language, "This workspace stores only a browser-local session and workspace. No credentials or secrets are sent anywhere.", "Ruang kerja ini hanya menyimpan sesi dan ruang kerja lokal di browser. Tidak ada kredensial atau rahasia yang dikirim ke mana pun.")}</p></div></SettingsCard>
    </div>
    <button type="button" onClick={save} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white hover:bg-slate-800"><Save size={16} />{saved ? text(language, "Settings saved", "Pengaturan tersimpan") : text(language, "Save settings", "Simpan pengaturan")}</button>
  </SectionFrame>;
}

const faqs = [
  ["How do I move a candidate through the pipeline?", "Open Candidates, review the record, then use Advance to record the next stage."],
  ["Can I create and manage a job?", "Yes. Use Jobs to create a draft, edit its details, or change its status."],
  ["What does the AI insight mean?", "It is a grounded review starting point based on the candidate record. A recruiter must review original evidence before deciding."],
  ["How do I schedule an interview?", "Open Interviews, select Schedule interview, and provide the candidate, date, time, and interviewer."],
];

export function HelpPage({ language }: { language: Language }) {
  const [open, setOpen] = useState(0);
  return <SectionFrame eyebrow={text(language, "Guidance", "Panduan")} title={text(language, "Help", "Bantuan")} intro={text(language, "Find practical guidance for candidates, jobs, the pipeline, AI insights, and interviews.", "Temukan panduan praktis tentang kandidat, posisi, pipeline, wawasan AI, dan wawancara.")}>
    <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]"><section className="surface overflow-hidden"><div className="border-b p-6"><h2 className="font-semibold">{text(language, "Frequently asked questions", "Pertanyaan umum")}</h2></div><div className="divide-y">{faqs.map(([question, answer], index) => <div key={question}><button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"><span className="text-sm font-semibold">{text(language, question, ["Bagaimana memindahkan kandidat di pipeline?", "Bisakah saya membuat dan mengelola posisi?", "Apa arti wawasan AI?", "Bagaimana menjadwalkan wawancara?"][index])}</span><ChevronDown className={`shrink-0 transition ${open === index ? "rotate-180 text-brand" : "text-slate-400"}`} size={18} /></button>{open === index && <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{text(language, answer, ["Buka Kandidat, tinjau catatan, lalu gunakan Maju untuk mencatat tahap berikutnya.", "Ya. Gunakan Posisi untuk membuat draf, mengedit detail, atau mengubah status.", "Ini adalah titik awal tinjauan berdasarkan catatan kandidat. Perekrut tetap harus meninjau bukti asli sebelum mengambil keputusan.", "Buka Wawancara, pilih Jadwalkan wawancara, lalu isi kandidat, tanggal, waktu, dan pewawancara."][index])}</p>}</div>)}</div></section><section className="surface h-fit p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand"><HelpCircle size={19} /></span><h2 className="mt-5 text-lg font-semibold">{text(language, "Need more help?", "Butuh bantuan lain?")}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">{text(language, "Send a note to the demo support address. This opens your email client; it does not simulate a live chat.", "Kirim catatan ke alamat dukungan demo. Ini membuka aplikasi email Anda; tidak mensimulasikan chat langsung.")}</p><a href="mailto:support@hireflow.demo" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold text-brand hover:bg-blue-50"><Mail size={16} />support@hireflow.demo</a></section></div>
  </SectionFrame>;
}

function SectionFrame({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) { return <><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">{eyebrow}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-1 max-w-2xl text-sm text-slate-500">{intro}</p></div></div><div className="mt-7">{children}</div></>; }
function SettingsCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) { return <section className="surface p-6"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-brand">{icon}</span><h2 className="font-semibold">{title}</h2></div><div className="mt-5 space-y-4">{children}</div></section>; }
function SettingRow({ title, detail }: { title: string; detail: string }) { return <div className="flex items-center justify-between gap-4"><p className="text-sm font-semibold">{title}</p><p className="text-right text-xs text-slate-500">{detail}</p></div>; }
function ToggleRow({ title, detail, checked, onChange }: { title: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-start justify-between gap-4"><span><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-brand" /></label>; }
function EmptyState({ icon, title, body, action, onAction }: { icon: ReactNode; title: string; body: string; action: string; onAction: () => void }) { return <div className="px-6 py-14 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-brand">{icon}</span><h3 className="mt-4 font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{body}</p><button type="button" onClick={onAction} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"><UserPlus size={16} />{action}</button></div>; }
