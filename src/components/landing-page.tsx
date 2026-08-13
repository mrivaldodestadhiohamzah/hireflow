"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, FileText, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import hireFlowLogo from "./hireflowlogo.png";

const roles = [
  ["Senior Frontend Engineer", "Engineering", "Remote · Europe", "Full-time"],
  ["Product Designer", "Product", "London · Hybrid", "Full-time"],
  ["Backend Engineer", "Engineering", "Remote · UK", "Full-time"],
  ["Customer Success Manager", "Customer", "New York · Hybrid", "Full-time"],
];

type Preview = "pipeline" | "analysis" | "interview" | "application" | "decision";

const workflow = [
  ["01", "Application arrives", "Resume, profile, and job context are captured.", "application"],
  ["02", "Review with guidance", "Relevant skills and experience are compared against the role, with AI-assisted analysis.", "analysis"],
  ["03", "Interview with context", "Interviewers receive the relevant candidate context and record structured feedback.", "interview"],
  ["04", "Document the decision", "Recruiters track notes, activity, status changes, and the final hiring decision.", "decision"],
] as const;

export default function LandingPage() {
  const [jobsOpen, setJobsOpen] = useState(false);

  return <main className="min-h-screen bg-[#fbfcfe] text-ink">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src={hireFlowLogo} alt="" className="h-9 w-9 shrink-0 object-contain" sizes="36px" priority unoptimized />
        <span className="text-lg font-semibold tracking-tight">HireFlow</span>
      </Link>
      <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
        <a href="#product" className="hover:text-ink">Product</a>
        <a href="#workflow" className="hover:text-ink">Workflow</a>
        <a href="#security" className="hover:text-ink">Security</a>
        <button onClick={() => setJobsOpen(true)} className="hover:text-ink">Open roles</button>
      </nav>
      <div className="flex items-center gap-3">
        <button onClick={() => setJobsOpen(true)} className="hidden text-sm font-semibold text-slate-700 sm:block">Find a job</button>
        <Link href="/demo" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Explore demo</Link>
      </div>
    </header>

    <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1fr_.95fr] lg:items-center lg:pt-24">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand"><Sparkles size={14} />Recruiting, with better context</p>
        <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-.045em] sm:text-6xl">Recruit smarter.<br />Hire with confidence.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">HireFlow gives growing teams a clear path from application to offer—with reviewable, AI-assisted resume analysis where it matters.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/demo" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-blue-700">Explore the live demo <ArrowRight size={17} /></Link>
          <button onClick={() => setJobsOpen(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-sm font-semibold hover:bg-slate-50">Browse open roles</button>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600" />Designed for focused teams</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600" />Human decisions stay human</span>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-blue-50" />
        <div className="overflow-hidden rounded-2xl border bg-white shadow-[0_28px_70px_rgba(24,39,75,.13)]">
          <div className="flex h-12 items-center gap-2 border-b px-4"><span className="h-2.5 w-2.5 rounded-full bg-slate-200" /><span className="h-2.5 w-2.5 rounded-full bg-slate-200" /><span className="h-2.5 w-2.5 rounded-full bg-slate-200" /><span className="ml-3 text-xs font-semibold text-slate-400">HireFlow · Recruiting workspace</span></div>
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Hiring overview</p><p className="mt-1 text-2xl font-semibold">A calmer candidate flow</p></div><span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700">14 active roles</span></div>
            <div className="mt-6 grid grid-cols-3 gap-3"><MiniMetric value="128" label="Candidates" /><MiniMetric value="82%" label="Avg. match" /><MiniMetric value="18" label="Interviews" /></div>
            <div className="mt-5 rounded-xl border bg-slate-50 p-4"><div className="flex items-center gap-3"><Avatar initials="MC" tone="bg-violet-100 text-violet-700" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-sm font-semibold">Maya Chen</p><p className="text-sm font-bold text-emerald-600">91%</p></div><p className="mt-0.5 text-xs text-slate-500">Senior Frontend Engineer</p></div></div><div className="mt-3 flex gap-1.5"><Tag>React</Tag><Tag>TypeScript</Tag><Tag>Design systems</Tag></div></div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500"><Sparkles className="mr-1 inline text-brand" size={13} />AI-assisted analysis is evidence to review—not an automated decision.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="product" className="border-y bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="max-w-xl"><p className="eyebrow">One considered workspace</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Everything needed to move a good candidate forward.</h2></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Feature preview="pipeline" title="A pipeline with context" body="See where every applicant is, why they are there, and what needs to happen next." />
          <Feature preview="analysis" title="Reviewable AI screening" body="Match skills and experience against a job description, with clear gaps and no black-box decision-making." />
          <Feature preview="interview" title="Interviews that stay aligned" body="Give interviewers a concise brief and capture structured feedback in the same workflow." />
        </div>
      </div>
    </section>

    <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
        <div><p className="eyebrow">Designed around the work</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">From application to a clear, documented decision.</h2><p className="mt-4 leading-relaxed text-slate-600">HireFlow keeps the process legible for recruiters, interviewers, and candidates. Stage changes, feedback, and analysis become part of one useful history.</p></div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {workflow.map(([number, title, body, preview]) => <WorkflowStep key={number} number={number} title={title} body={body} preview={preview} />)}
        </ol>
      </div>
    </section>

    <section id="security" className="bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-blue-300">Built responsibly</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">AI helps recruiters review. It never makes the call.</h2><p className="mt-3 max-w-2xl leading-relaxed text-slate-300">Structured analysis avoids protected characteristics and carries a clear reminder to review original materials. Access is role-based, activity is traceable, and sensitive credentials stay out of client code.</p></div><div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-700 bg-white/5 p-4"><ShieldCheck className="text-blue-300" size={26} /><div><p className="text-sm font-semibold">Security-minded by design</p><p className="text-xs text-slate-300">Role authorization · token lifecycle · audit trail</p></div></div></div>
    </section>
    <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8"><p>HireFlow is an independent portfolio project.</p><div className="flex gap-5"><Link href="/demo" className="font-semibold text-ink">Demo workspace</Link><button onClick={() => setJobsOpen(true)} className="font-semibold text-ink">Job board</button></div></footer>
    {jobsOpen && <JobBoard close={() => setJobsOpen(false)} />}
  </main>;
}

function MiniMetric({ value, label }: { value: string; label: string }) { return <div className="rounded-lg border p-3"><p className="text-lg font-semibold">{value}</p><p className="mt-1 text-[11px] text-slate-500">{label}</p></div>; }
function Avatar({ initials, tone = "bg-slate-100 text-slate-700" }: { initials: string; tone?: string }) { return <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold ${tone}`}>{initials}</span>; }
function Tag({ children }: { children: React.ReactNode }) { return <span className="rounded bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">{children}</span>; }

function Feature({ preview, title, body }: { preview: Preview; title: string; body: string }) {
  return <article className="rounded-xl border p-5 sm:p-6"><ProductPreview variant={preview} compact /><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p></article>;
}

function WorkflowStep({ number, title, body, preview }: { number: string; title: string; body: string; preview: Preview }) {
  return <li className="rounded-xl border bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-brand">{number}</span><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">{number === "01" ? "Application" : number === "02" ? "Review" : number === "03" ? "Interview" : "Decision"}</span></div><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p><div className="mt-4"><ProductPreview variant={preview} /></div></li>;
}

function ProductPreview({ variant, compact = false }: { variant: Preview; compact?: boolean }) {
  const padding = compact ? "p-3" : "p-2.5";
  if (variant === "pipeline") return <div aria-label="Pipeline preview" className={`rounded-lg border bg-slate-50 ${padding}`}><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[.1em] text-slate-500">Candidate pipeline</p><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /></div><div className="mt-3 grid grid-cols-4 gap-1.5">{[["Applied", "24", "bg-slate-400"], ["Screening", "8", "bg-blue-500"], ["Interview", "4", "bg-violet-500"], ["Offer", "2", "bg-emerald-500"]].map(([stage, count, color]) => <div key={stage} className="min-w-0 rounded-md border bg-white p-1.5"><span className={`block h-1 w-5 rounded-full ${color}`} /><p className="mt-2 text-sm font-semibold">{count}</p><p className="truncate text-[9px] font-medium text-slate-500">{stage}</p></div>)}</div><div className="mt-3 flex items-center gap-2 border-t pt-2"><div className="flex -space-x-1.5"><Avatar initials="MC" tone="bg-violet-100 text-violet-700" /><Avatar initials="JL" tone="bg-sky-100 text-sky-700" /><Avatar initials="AM" tone="bg-amber-100 text-amber-700" /></div><p className="text-[10px] text-slate-500">36 active candidates</p></div></div>;
  if (variant === "analysis") return <div aria-label="AI-assisted analysis preview" className={`rounded-lg border border-blue-100 bg-blue-50/60 ${padding}`}><div className="flex items-center justify-between"><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand"><Sparkles size={12} />AI-assisted analysis</span><span className="rounded bg-white px-1.5 py-0.5 text-xs font-bold text-emerald-700">87%</span></div><div className="mt-3 grid grid-cols-[1fr_auto] gap-3"><div className="space-y-1.5">{["React", "TypeScript", "REST API", "Git"].map((skill) => <p className="flex items-center gap-1.5 text-[10px] font-medium text-slate-700" key={skill}><Check size={12} className="text-emerald-600" />{skill}</p>)}</div><div className="border-l border-blue-100 pl-3"><p className="text-[9px] font-semibold uppercase tracking-[.1em] text-slate-500">Potential gap</p><p className="mt-1 text-[10px] font-semibold text-slate-700">Next.js</p></div></div><p className="mt-3 border-t border-blue-100 pt-2 text-[9px] leading-relaxed text-slate-500">A review starting point, not an automated decision.</p></div>;
  if (variant === "interview") return <div aria-label="Interview preview" className={`rounded-lg border bg-slate-50 ${padding}`}><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.1em] text-slate-500">Technical interview</p><p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-600"><Clock3 size={11} />Tomorrow · 10:00</p></div><span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">Feedback pending</span></div><div className="mt-3 grid grid-cols-2 gap-2 border-t pt-2"><div className="flex items-center gap-1.5"><Avatar initials="AM" tone="bg-slate-200 text-slate-700" /><div><p className="text-[9px] text-slate-500">Interviewer</p><p className="text-[10px] font-semibold">Alex Morgan</p></div></div><div className="flex items-center gap-1.5"><Avatar initials="MC" tone="bg-violet-100 text-violet-700" /><div><p className="text-[9px] text-slate-500">Candidate</p><p className="text-[10px] font-semibold">Maya Chen</p></div></div></div></div>;
  if (variant === "application") return <div aria-label="Application preview" className={`rounded-lg border bg-slate-50 ${padding}`}><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-md bg-white text-brand"><FileText size={14} /></span><div><p className="text-[10px] font-semibold">Application received</p><p className="text-[9px] text-slate-500">Maya Chen · Senior Frontend Engineer</p></div><span className="ml-auto rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold text-blue-700">Applied</span></div><div className="mt-2.5 flex gap-1.5"><Tag>Resume</Tag><Tag>Profile</Tag><Tag>Job context</Tag></div></div>;
  return <div aria-label="Decision history preview" className={`rounded-lg border bg-slate-50 ${padding}`}><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[.1em] text-slate-500">Candidate history</p><span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">Offer</span></div><div className="mt-3 space-y-2 border-l border-slate-200 pl-3"><TimelineItem title="Interview feedback added" time="Today · 11:20" /><TimelineItem title="Moved to Offer" time="Yesterday · 16:05" /><TimelineItem title="Recruiter note added" time="Aug 12 · 09:40" /></div></div>;
}

function TimelineItem({ title, time }: { title: string; time: string }) { return <div className="relative"><span className="absolute -left-[15px] top-1 h-1.5 w-1.5 rounded-full bg-brand" /><p className="text-[10px] font-medium text-slate-700">{title}</p><p className="mt-0.5 text-[9px] text-slate-500">{time}</p></div>; }

function JobBoard({ close }: { close: () => void }) { return <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/30 p-4 sm:p-8" onClick={close}><section onClick={(event) => event.stopPropagation()} className="mx-auto max-w-3xl rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4"><div><p className="font-semibold">Open roles at Acme Studio</p><p className="mt-0.5 text-xs text-slate-500">A simple, candidate-first application experience.</p></div><button onClick={close} aria-label="Close job board"><X size={20} /></button></div><div className="p-5 sm:p-7"><label className="relative block"><Menu className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input placeholder="Search roles" className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none focus:border-brand" /></label><div className="mt-5 divide-y">{roles.map(([title, department, location, type]) => <article className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center" key={title}><div className="min-w-0 flex-1"><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-slate-500">{department} · {location} · {type}</p></div><button onClick={close} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border px-3 text-sm font-semibold text-brand hover:bg-blue-50">View role <ArrowRight size={15} /></button></article>)}</div></div></section></div>; }
