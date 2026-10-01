"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, ChevronRight, Clock3, FileText, Menu, MessageSquareText, Search, ShieldCheck, Workflow, X } from "lucide-react";
import { getStageLabel, type Language } from "@/lib/i18n";
import { landingCopy } from "@/lib/product-copy";
import { LanguageSwitcher, useLanguage } from "./language-switcher";
import { useReducedMotion } from "./motion";
import hireFlowLogo from "./hireflowlogo.png";

type Role = readonly [string, string, string];
type Stage = "Applied" | "Screening" | "Interview" | "Assessment" | "Offer" | "Hired";

const roles: Role[] = [
  ["Senior Frontend Engineer", "Engineering", "Remote · Europe"],
  ["Product Designer", "Product", "London · Hybrid"],
  ["Backend Engineer", "Engineering", "Remote · UK"],
  ["Customer Success Manager", "Customer", "New York · Hybrid"],
];

const stages: { id: Stage; count: string; tone: string }[] = [
  { id: "Applied", count: "1", tone: "bg-slate-300" },
  { id: "Screening", count: "2", tone: "bg-blue-400" },
  { id: "Interview", count: "2", tone: "bg-[#d9ff9d]" },
  { id: "Assessment", count: "1", tone: "bg-amber-300" },
  { id: "Offer", count: "1", tone: "bg-emerald-400" },
  { id: "Hired", count: "0", tone: "bg-[#d9ff9d]" },
];

type LocalizedText = { en: string; id: string };
type StageDetail = {
  initials: string;
  name: string;
  role: string;
  match: string;
  interview: LocalizedText;
  activity: LocalizedText;
  notes: LocalizedText;
  next: LocalizedText;
  time: string;
  tone: string;
  description: LocalizedText;
};

const stageDetails: Record<Stage, StageDetail> = {
  Applied: { initials: "FN", name: "Fajar Nugroho", role: "Frontend Engineer", match: "82%", interview: { en: "Not scheduled", id: "Belum dijadwalkan" }, activity: { en: "Application received", id: "Lamaran diterima" }, notes: { en: "Resume + source captured", id: "Resume + sumber tercatat" }, next: { en: "Review application", id: "Tinjau lamaran" }, time: "Aug 10", tone: "bg-slate-100 text-slate-700", description: { en: "The application enters the pipeline with the role and source evidence attached.", id: "Lamaran masuk ke pipeline dengan posisi dan bukti sumber yang tercatat." } },
  Screening: { initials: "BP", name: "Bagas Pranoto", role: "Product Designer", match: "88%", interview: { en: "Recruiter screen", id: "Screening perekrut" }, activity: { en: "Recruiter review in progress", id: "Tinjauan perekrut berlangsung" }, notes: { en: "Portfolio needs review", id: "Portofolio perlu ditinjau" }, next: { en: "Review profile", id: "Tinjau profil" }, time: "Yesterday", tone: "bg-sky-100 text-sky-700", description: { en: "The recruiter is checking the portfolio and role fit before the first conversation.", id: "Perekrut memeriksa portofolio dan kecocokan posisi sebelum percakapan pertama." } },
  Interview: { initials: "AL", name: "Ayu Lestari", role: "Senior Frontend Engineer", match: "91%", interview: { en: "Today · 09:30", id: "Hari ini · 09:30" }, activity: { en: "Technical interview scheduled", id: "Wawancara teknis dijadwalkan" }, notes: { en: "Technical feedback pending", id: "Umpan balik teknis tertunda" }, next: { en: "Prepare interview", id: "Siapkan wawancara" }, time: "Today · 09:30", tone: "bg-violet-100 text-violet-700", description: { en: "The technical conversation is scheduled, with the role context ready for the interviewer.", id: "Percakapan teknis sudah dijadwalkan, dengan konteks posisi siap untuk pewawancara." } },
  Assessment: { initials: "CM", name: "Citra Maharani", role: "Backend Engineer", match: "84%", interview: { en: "Technical assessment", id: "Asesmen teknis" }, activity: { en: "Assessment submitted", id: "Asesmen dikirim" }, notes: { en: "Submitted for review", id: "Dikirim untuk ditinjau" }, next: { en: "Review assessment", id: "Tinjau asesmen" }, time: "Aug 10", tone: "bg-amber-100 text-amber-700", description: { en: "The assessment is ready for review with the candidate and role context in one place.", id: "Asesmen siap ditinjau bersama konteks kandidat dan posisi di satu tempat." } },
  Offer: { initials: "GP", name: "Gita Permata", role: "Customer Success Manager", match: "90%", interview: { en: "Final conversation complete", id: "Percakapan akhir selesai" }, activity: { en: "Offer sent", id: "Penawaran dikirim" }, notes: { en: "Decision due Aug 14", id: "Keputusan paling lambat 14 Agu" }, next: { en: "Track offer", id: "Pantau penawaran" }, time: "Aug 09", tone: "bg-emerald-100 text-emerald-700", description: { en: "The offer is out and the next decision is visible without losing the conversation history.", id: "Penawaran sudah dikirim dan keputusan berikutnya terlihat tanpa kehilangan riwayat percakapan." } },
  Hired: { initials: "—", name: "No completed hire yet", role: "No decision recorded", match: "—", interview: { en: "No final round", id: "Belum ada putaran akhir" }, activity: { en: "No outcome recorded", id: "Belum ada hasil tercatat" }, notes: { en: "Awaiting a completed decision", id: "Menunggu keputusan selesai" }, next: { en: "View history", id: "Lihat riwayat" }, time: "No record", tone: "bg-slate-100 text-slate-500", description: { en: "No hire has been recorded yet; completed decisions will remain visible here as hiring history grows.", id: "Belum ada perekrutan yang tercatat; keputusan selesai akan terlihat di sini saat riwayat bertambah." } },
};

export default function LandingPage() {
  const { language, changeLanguage } = useLanguage();
  const copy = landingCopy[language];
  const reduced = useReducedMotion();
  const [jobsOpen, setJobsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<Stage>("Interview");
  const closeMobile = () => setMobileOpen(false);

  return <MotionConfig reducedMotion={reduced ? "always" : "user"}>
    <main className="flow-page-enter min-h-screen overflow-hidden bg-[#f8faf7] text-ink">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white">Skip to content</a>
      <header className="relative z-40 mx-auto flex max-w-[1380px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
        <Brand />
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex"><a href="#product" className="transition hover:text-ink">{copy.product}</a><a href="#workflow" className="transition hover:text-ink">{copy.workflow}</a><a href="#security" className="transition hover:text-ink">{copy.security}</a><button type="button" onClick={() => setJobsOpen(true)} className="transition hover:text-ink">{copy.openRoles}</button></nav>
        <div className="flex items-center gap-2 sm:gap-3"><LanguageSwitcher language={language} onChange={changeLanguage} compact /><button type="button" onClick={() => setJobsOpen(true)} className="hidden text-sm font-bold text-slate-700 transition hover:text-brand sm:block">{copy.findJob}</button><Link href="/login" className="hidden h-10 items-center justify-center gap-1 rounded-xl bg-ink px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex">{copy.exploreDemo}<ArrowUpRight size={15} /></Link><button type="button" onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d8e2dc] bg-white text-ink lg:hidden" aria-label={language === "en" ? "Open menu" : "Buka menu"}><Menu size={19} /></button></div>
      </header>

      <AnimatePresence>{mobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-ink/30 p-4 lg:hidden" onClick={closeMobile}><motion.nav initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.2 }} aria-label="Mobile navigation" className="ml-auto max-w-sm rounded-2xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><Brand compact /><button type="button" onClick={closeMobile} aria-label={copy.close}><X size={19} /></button></div><div className="mt-6 grid gap-1"><a href="#product" onClick={closeMobile} className="rounded-xl px-3 py-3 text-sm font-bold hover:bg-slate-50">{copy.product}</a><a href="#workflow" onClick={closeMobile} className="rounded-xl px-3 py-3 text-sm font-bold hover:bg-slate-50">{copy.workflow}</a><a href="#security" onClick={closeMobile} className="rounded-xl px-3 py-3 text-sm font-bold hover:bg-slate-50">{copy.security}</a><button type="button" onClick={() => { closeMobile(); setJobsOpen(true); }} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-slate-50">{copy.openRoles}</button></div><Link href="/login" onClick={closeMobile} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white">{copy.exploreDemo}<ArrowRight size={15} /></Link></motion.nav></motion.div>}</AnimatePresence>

      <section id="main-content" className="border-y border-[#d8e2dc] bg-[#edf2ed]"><div className="mx-auto grid max-w-[1380px] gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:gap-16 lg:px-12 lg:py-20"><div className="max-w-2xl"><motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="max-w-2xl text-[clamp(2.8rem,6vw,5.8rem)] font-black leading-[.94] tracking-[-.065em] text-[#102636]">{copy.heroTitle}</motion.h1><motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 }} className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">{copy.heroBody}</motion.p><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }} className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/login" className="flow-primary-button justify-center !h-12 !rounded-xl !bg-[#102636] !px-5 hover:!bg-[#183c52]">{copy.exploreDemo}<ArrowRight size={17} /></Link><button type="button" onClick={() => setJobsOpen(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#cbd8cf] bg-white px-5 text-sm font-bold text-[#102636] transition hover:-translate-y-0.5 hover:border-[#102636]">{copy.viewOpenRoles}<BriefcaseBusiness size={16} /></button></motion.div><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: 0.3 }} className="mt-6 text-xs font-bold uppercase tracking-[.12em] text-slate-500">{copy.heroProof}</motion.p></div><FlowPreview language={language} activeStage={activeStage} onSelect={setActiveStage} /></div></section>

      <section id="product" className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><Reveal className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-24"><div><h2 className="max-w-md text-3xl font-black tracking-[-.04em] text-[#102636] sm:text-4xl">{copy.hiringTrailTitle}</h2><p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">{copy.hiringTrailBody}</p></div><HiringTrail language={language} /></Reveal></section>

      <section id="workflow" className="border-y border-[#d8e2dc] bg-[#102636] text-white"><div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><Reveal className="grid gap-10 lg:grid-cols-[.6fr_1.4fr] lg:items-end lg:gap-20"><div><h2 className="max-w-lg text-3xl font-black tracking-[-.04em] sm:text-4xl">{copy.workflowTitle}</h2><p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">{copy.workflowBody}</p></div><PipelineStory language={language} /></Reveal></div></section>

      <section id="context" className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><Reveal className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-20"><CandidateContext language={language} /><div><h2 className="max-w-md text-3xl font-black tracking-[-.04em] text-[#102636] sm:text-4xl">{copy.candidateContextTitle}</h2><p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">{copy.candidateContextBody}</p><div className="mt-7 flex items-start gap-3 border-l-2 border-[#d9ff9d] pl-4"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" /><p className="text-sm leading-relaxed text-slate-600">{copy.reviewableInsightBody}</p></div></div></Reveal></section>

      <section id="security" className="border-t border-[#d8e2dc] bg-[#f0f5ee]"><div className="mx-auto flex max-w-[1380px] flex-col gap-10 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-24"><Reveal><h2 className="max-w-2xl text-3xl font-black tracking-[-.04em] text-[#102636] sm:text-4xl">{copy.securityTitle}</h2><p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">{copy.securityBody}</p></Reveal><Reveal delay={90} className="max-w-sm border-l-2 border-[#102636] pl-5"><p className="text-sm font-black text-[#102636]">{copy.securityMinded}</p><p className="mt-2 text-sm leading-relaxed text-slate-600">{copy.securityMeta}</p></Reveal></div></section>

      <section className="bg-[#d9ff9d]"><div className="mx-auto flex max-w-[1380px] flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-20"><div><h2 className="max-w-2xl text-3xl font-black tracking-[-.04em] text-[#102636] sm:text-5xl">{copy.finalTitle}</h2><p className="mt-4 max-w-xl text-base leading-relaxed text-[#294452]">{copy.finalBody}</p></div><Link href="/login" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#102636] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#183c52]">{copy.openWorkspace}<ArrowRight size={17} /></Link></div></section>

      <footer className="mx-auto flex max-w-[1380px] flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><div className="flex items-center gap-3"><Brand compact /><span className="hidden text-slate-300 sm:inline">/</span><span>{copy.portfolio}</span></div><div className="flex gap-5"><Link href="/login" className="font-bold text-ink hover:text-brand">{copy.demoWorkspace}</Link><button type="button" onClick={() => setJobsOpen(true)} className="font-bold text-ink hover:text-brand">{copy.jobBoard}</button></div></footer>
      <AnimatePresence>{jobsOpen && <JobBoard close={() => setJobsOpen(false)} language={language} />}</AnimatePresence>
    </main>
  </MotionConfig>;
}

function Brand({ compact = false }: { compact?: boolean }) { return <Link href="/" className="flex items-center gap-2.5"><Image src={hireFlowLogo} alt="HireFlow" className={`${compact ? "h-7 w-7" : "h-9 w-9"} shrink-0 object-contain`} sizes={compact ? "28px" : "36px"} priority unoptimized /><span className={`${compact ? "text-base" : "text-lg"} font-black tracking-tight text-[#102636]`}>HireFlow</span></Link>; }

function FlowPreview({ language, activeStage, onSelect }: { language: Language; activeStage: Stage; onSelect: (stage: Stage) => void }) { const copy = landingCopy[language]; const snapshot = stageDetails[activeStage]; const contextItems = [{ label: copy.workflowRole, value: snapshot.role }, { label: copy.workflowCurrentStage, value: getStageLabel(language, activeStage) }, { label: copy.workflowInterview, value: snapshot.interview[language] }, { label: copy.workflowActivity, value: snapshot.activity[language] }, { label: copy.workflowNotes, value: snapshot.notes[language] }, { label: copy.workflowNext, value: snapshot.next[language] }]; return <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.18 }} className="relative overflow-hidden rounded-[1.75rem] border border-[#cbd8cf] bg-white shadow-[0_24px_70px_rgba(16,38,54,.14)]"><div className="flex items-center justify-between border-b border-[#e2e9e3] px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#102636] text-[#d9ff9d]"><Workflow size={17} /></span><div><p className="text-sm font-black text-[#102636]">{copy.sampleWorkspace}</p></div></div><span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.12em] text-emerald-700"><i className="h-2 w-2 rounded-full bg-emerald-500" />{copy.active}</span></div><div className="p-5 sm:p-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-black tracking-[-.04em] text-[#102636]">{copy.flowStatusBody}</h2></div><span className="text-xs font-bold text-slate-400">{copy.latestMovement}</span></div><div role="tablist" aria-label={copy.pipelineTitle} className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">{stages.map((stage) => <button type="button" role="tab" aria-selected={activeStage === stage.id} onClick={() => onSelect(stage.id)} key={stage.id} className={`group rounded-xl border p-2.5 text-left transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#102636] ${activeStage === stage.id ? "border-[#102636] bg-[#102636] text-white" : "border-[#e0e8e1] bg-[#f8faf7] text-[#102636]"}`}><span className={`block h-1.5 w-7 rounded-full ${activeStage === stage.id ? "bg-[#d9ff9d]" : stage.tone}`} /><span className="mt-3 block text-lg font-black">{stage.count}</span><span className={`mt-1 block truncate text-[10px] font-bold ${activeStage === stage.id ? "text-slate-300" : "text-slate-500"}`}>{getStageLabel(language, stage.id)}</span></button>)}</div><AnimatePresence mode="wait" initial={false}><motion.div key={activeStage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} aria-live="polite" className="mt-5 rounded-2xl border border-[#dbe8dd] bg-[#f4f8f3] p-4 sm:p-5"><div className="flex items-start gap-3"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-black ${snapshot.tone}`}>{snapshot.initials}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black text-[#102636]">{snapshot.name}</p><span className="text-sm font-black text-emerald-700">{snapshot.match}</span></div><p className="mt-1 truncate text-xs font-medium text-slate-500">{snapshot.role} · {getStageLabel(language, activeStage)}</p></div><ChevronRight size={17} className="mt-1 shrink-0 text-slate-400" /></div><p className="mt-4 text-xs leading-relaxed text-slate-600">{snapshot.description[language]}</p><div className="mt-4 grid gap-3 border-t border-[#dbe8dd] pt-4 sm:grid-cols-2 lg:grid-cols-3">{contextItems.map((item) => <div key={item.label}><p className="text-[10px] font-black uppercase tracking-[.12em] text-slate-400">{item.label}</p><p className="mt-1 text-sm font-black text-[#102636]">{item.value}</p></div>)}</div><p className="mt-4 text-xs font-bold text-slate-500"><Clock3 size={13} className="mr-1 inline" />{snapshot.time}</p></motion.div></AnimatePresence></div></motion.div>; }

function HiringTrail({ language }: { language: Language }) { const copy = landingCopy[language]; const items = [{ icon: <FileText size={15} />, label: copy.applicationReceived, detail: "Ayu Lestari · Senior Frontend Engineer", time: language === "en" ? "Aug 08" : "08 Agu" }, { icon: <MessageSquareText size={15} />, label: copy.interviewFeedback, detail: "Dimas Pratama · Technical interview", time: language === "en" ? "Today · 11:20" : "Hari ini · 11:20" }, { icon: <Check size={15} />, label: copy.movedToOffer, detail: "Ayu Lestari · decision recorded", time: language === "en" ? "Yesterday" : "Kemarin" }]; return <div className="border-y border-[#d8e2dc]">{items.map((item, index) => <div key={item.label} className="relative flex gap-4 border-b border-[#e8eee9] py-5 last:border-b-0 sm:items-center"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#102636] text-[#d9ff9d]">{item.icon}</span><div className="min-w-0 flex-1"><p className="text-sm font-black text-[#102636]">{item.label}</p><p className="mt-1 truncate text-xs text-slate-500">{item.detail}</p></div><span className="shrink-0 text-[10px] font-black uppercase tracking-[.1em] text-slate-400">{item.time}</span>{index < items.length - 1 && <span className="absolute -bottom-1 left-[17px] z-10 h-2 w-2 rounded-full bg-[#d9ff9d]" />}</div>)}</div>; }

type WorkflowStageProps = {
  stage: (typeof stages)[number];
  index: number;
  language: Language;
  active: boolean;
  onSelect: () => void;
};

function WorkflowStage({ stage, index, language, active, onSelect }: WorkflowStageProps) {
  return <button type="button" role="tab" aria-selected={active} onClick={onSelect} className="relative text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ff9d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#102636]"><div className="flex items-center gap-3 sm:block"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-4 border-[#102636] ${stage.tone} text-xs font-black text-[#102636] opacity-100 transition ${active ? "scale-110 shadow-[0_0_0_4px_rgba(217,255,157,.2)]" : ""}`}>{String(index + 1).padStart(2, "0")}</span><div className="sm:mt-4"><p className={`text-sm font-black ${active ? "text-[#d9ff9d]" : "text-white"}`}>{getStageLabel(language, stage.id)}</p><p className="mt-1 text-xs text-slate-400">{stage.count} {language === "en" ? "candidate" : "kandidat"}</p></div></div></button>;
}

function PipelineStory({ language }: { language: Language }) { const copy = landingCopy[language]; const [activeStage, setActiveStage] = useState<Stage>("Interview"); const detail = stageDetails[activeStage]; const contextItems = [{ label: copy.workflowCandidate, value: detail.name }, { label: copy.workflowRole, value: detail.role }, { label: copy.workflowInterview, value: detail.interview[language] }, { label: copy.workflowActivity, value: detail.activity[language] }, { label: copy.workflowNotes, value: detail.notes[language] }, { label: copy.workflowNext, value: detail.next[language] }]; return <div className="relative border-t border-slate-600 pt-8"><div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-[3.15rem] z-0 hidden h-px bg-slate-600 sm:block" /><div role="tablist" aria-label={copy.workflowTitle} className="relative z-10 grid grid-cols-2 gap-y-8 sm:grid-cols-6 sm:gap-3">{stages.map((stage, index) => <WorkflowStage key={stage.id} stage={stage} index={index} language={language} active={activeStage === stage.id} onSelect={() => setActiveStage(stage.id)} />)}</div><AnimatePresence mode="wait" initial={false}><motion.div key={activeStage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25 }} role="tabpanel" aria-live="polite" className="mt-10 grid gap-6 border-t border-slate-700 pt-6 sm:grid-cols-[.8fr_1.2fr]"><div><p className="flow-kicker !text-[#d9ff9d]">{copy.workflowCurrentStage}</p><h3 className="mt-3 text-2xl font-black tracking-[-.04em]">{getStageLabel(language, activeStage)}</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">{detail.description[language]}</p></div><div className="grid gap-3 rounded-2xl border border-slate-700 bg-white/5 p-4 sm:grid-cols-2">{contextItems.map((item) => <div key={item.label}><p className="text-[10px] font-black uppercase tracking-[.12em] text-slate-400">{item.label}</p><p className="mt-1 text-sm font-black text-white">{item.value}</p></div>)}</div></motion.div></AnimatePresence></div>; }

function CandidateContext({ language }: { language: Language }) {
  const copy = landingCopy[language];
  const en = language === "en";
  const skills = ["React", "TypeScript", "Design systems"];

  return <div className="border-y border-[#d8e2dc] py-6 sm:py-8">
    <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#e3ebe4] pb-6">
      <div>
        <p className="flow-kicker text-brand">{copy.candidateContext}</p>
        <h3 className="mt-2 text-xl font-black tracking-[-.03em] text-[#102636]">Ayu Lestari</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">Senior Frontend Engineer · Interview</p>
      </div>
      <div className="shrink-0 sm:text-right">
        <p className="flow-kicker">{en ? "Role match" : "Kecocokan peran"}</p>
        <p className="mt-1 text-3xl font-black tracking-[-.05em] text-[#102636]">91%</p>
        <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-slate-500 sm:ml-auto">{en ? "Based on skills and relevant experience found in the application." : "Berdasarkan keahlian dan pengalaman relevan dalam lamaran."}</p>
      </div>
    </div>
    <div className="grid gap-8 py-6 md:grid-cols-[.8fr_1.2fr] md:py-7">
      <div>
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-violet-100 text-sm font-black text-violet-700">AL</span>
          <div>
            <p className="font-black text-[#102636]">{en ? "6 years experience" : "Pengalaman 6 tahun"}</p>
            <p className="mt-1 text-xs text-slate-500">{en ? "Currently in interview" : "Sedang dalam tahap wawancara"}</p>
          </div>
        </div>
        <div className="mt-7">
          <p className="flow-kicker">{en ? "Skills found in the application" : "Keahlian yang ditemukan dalam lamaran"}</p>
          <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
            {skills.map((skill) => <p key={skill} className="flex items-center gap-2"><Check size={14} className="shrink-0 text-emerald-600" />{skill}</p>)}
          </div>
        </div>
      </div>
      <div className="border-[#e3ebe4] md:border-l md:pl-8">
        <p className="flow-kicker text-brand">{en ? "Recruiter review" : "Tinjauan perekrut"}</p>
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.12em] text-[#102636]">{en ? "What stands out" : "Yang menonjol"}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{en ? "React and TypeScript experience aligns with the role, with design-systems work visible in the application." : "Pengalaman React dan TypeScript selaras dengan peran, dengan pengalaman design system terlihat dalam lamaran."}</p>
          </div>
          <div className="border-l-2 border-[#d9ff9d] pl-3">
            <p className="text-xs font-black uppercase tracking-[.12em] text-[#102636]">{en ? "Follow up" : "Tindak lanjut"}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{en ? "Confirm depth of platform ownership during the next conversation." : "Konfirmasi kedalaman kepemilikan platform pada percakapan berikutnya."}</p>
          </div>
        </div>
        <p className="mt-6 border-t border-[#e3ebe4] pt-4 text-[11px] leading-relaxed text-slate-500">{en ? "AI-generated guidance. Review the original application and interview evidence before making a hiring decision." : "Panduan yang dibuat AI. Tinjau lamaran asli dan bukti wawancara sebelum mengambil keputusan perekrutan."}</p>
      </div>
    </div>
  </div>;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) { return <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.52, delay: delay / 1000, ease: [0.2, 0.75, 0.25, 1] }} className={className}>{children}</motion.div>; }

function JobBoard({ close, language }: { close: () => void; language: Language }) { const copy = landingCopy[language]; const [query, setQuery] = useState(""); const [selectedRole, setSelectedRole] = useState<Role | null>(null); const visibleRoles = useMemo(() => roles.filter(([title, department, location]) => `${title} ${department} ${location}`.toLowerCase().includes(query.toLowerCase())), [query]); return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] overflow-y-auto bg-ink/35 p-4 sm:p-8" onClick={close}><motion.section initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} transition={{ duration: .22 }} role="dialog" aria-modal="true" aria-label={copy.rolesAt} onClick={(event) => event.stopPropagation()} className="mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-[#e3ebe4] px-5 py-4 sm:px-7"><div><p className="font-black text-[#102636]">{copy.rolesAt}</p><p className="mt-1 text-xs text-slate-500">{copy.candidateFirst}</p></div><button type="button" onClick={close} aria-label={copy.close} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"><X size={19} /></button></div><div className="p-5 sm:p-7"><label className="relative block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><span className="sr-only">{copy.searchRoles}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchRoles} className="h-11 w-full rounded-xl border border-[#d8e2dc] pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100" /></label>{selectedRole ? <div className="mt-5 rounded-2xl border border-[#d8e2dc] bg-[#f5f8f4] p-5 sm:p-7"><button type="button" onClick={() => setSelectedRole(null)} className="text-sm font-bold text-brand hover:underline">← {copy.backToRoles}</button><p className="flow-kicker mt-7 text-brand">{copy.roleOverview}</p><h2 className="mt-2 text-2xl font-black tracking-tight text-[#102636]">{selectedRole[0]}</h2><p className="mt-2 text-sm font-medium text-slate-600">{selectedRole[1]} · {selectedRole[2]} · {copy.fullTime}</p><p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600">{copy.roleDetailBody}</p><Link href="/login" onClick={close} className="flow-primary-button mt-6 !h-11 !rounded-xl">{copy.exploreDemo}<ArrowRight size={15} /></Link></div> : <div className="mt-5 divide-y divide-[#e3ebe4]">{visibleRoles.map(([title, department, location]) => <article className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center" key={title}><div className="min-w-0 flex-1"><p className="font-black text-[#102636]">{title}</p><p className="mt-1 text-sm text-slate-500">{department} · {location} · {copy.fullTime}</p></div><button type="button" onClick={() => setSelectedRole([title, department, location])} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#cbd8cf] px-3 text-sm font-bold text-brand transition hover:border-brand hover:bg-blue-50">{copy.viewRole}<ArrowRight size={15} /></button></article>)}{visibleRoles.length === 0 && <p className="py-12 text-center text-sm text-slate-500">{language === "en" ? "No roles found." : "Posisi tidak ditemukan."}</p>}</div>}</div></motion.section></motion.div>; }
