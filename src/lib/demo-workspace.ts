import type { DemoUser } from "./demo-auth";

export type WorkspaceStage = "Applied" | "Screening" | "Interview" | "Assessment" | "Offer" | "Hired" | "Rejected";
export type WorkspaceJobStatus = "Open" | "Paused" | "Closed";
export type WorkspaceCandidate = {
  id: number; name: string; initials: string; role: string; job: string; stage: WorkspaceStage;
  score: number; experience: string; skills: string[]; applied: string; tone: string;
  email: string; notes: string[];
};
export type WorkspaceJob = { id: number; title: string; department: string; location: string; type: string; status: WorkspaceJobStatus; updated: string };
export type WorkspaceInterview = { id: number; candidateId: number; job: string; date: string; time: string; type: string; interviewer: string; status: "Scheduled" | "Completed" | "Cancelled" };
export type WorkspaceTeamMember = { id: number; name: string; role: string; email: string; initials: string; tone: string };
export type WorkspaceSettings = { reducedMotion: boolean; emailUpdates: boolean; weeklyDigest: boolean };
export type WorkspaceSnapshot = {
  candidates: WorkspaceCandidate[];
  jobs: WorkspaceJob[];
  interviews: WorkspaceInterview[];
  activities: string[];
  team: WorkspaceTeamMember[];
  settings: WorkspaceSettings;
};

const workspaceVersion = 1;

export const emptyWorkspace: WorkspaceSnapshot = {
  candidates: [], jobs: [], interviews: [], activities: [], team: [],
  settings: { reducedMotion: false, emailUpdates: true, weeklyDigest: false },
};

export const showcaseWorkspaceEmails = new Set(["nabila@hireflow.demo"]);

export const showcaseTeam: WorkspaceTeamMember[] = [
  { id: 1, name: "Nabila Putri Ramadhani", role: "Recruiting lead", email: "nabila@hireflow.demo", initials: "NP", tone: "bg-blue-100 text-blue-700" },
  { id: 2, name: "Dimas Pratama", role: "Hiring manager", email: "dimas@hireflow.demo", initials: "DP", tone: "bg-amber-100 text-amber-700" },
  { id: 3, name: "Siti Maharani", role: "People operations", email: "siti@hireflow.demo", initials: "SM", tone: "bg-emerald-100 text-emerald-700" },
  { id: 4, name: "Rizky Aditya", role: "Technical interviewer", email: "rizky@hireflow.demo", initials: "RA", tone: "bg-violet-100 text-violet-700" },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function workspaceStorageKey(email: string) {
  return `hireflow-workspace:${encodeURIComponent(email.trim().toLowerCase())}`;
}

function isSnapshot(value: unknown): value is WorkspaceSnapshot {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WorkspaceSnapshot>;
  return Array.isArray(candidate.candidates) && Array.isArray(candidate.jobs) && Array.isArray(candidate.interviews) && Array.isArray(candidate.activities) && Array.isArray(candidate.team) && Boolean(candidate.settings);
}

export function loadWorkspace(user: DemoUser, showcase: WorkspaceSnapshot): WorkspaceSnapshot {
  if (typeof window === "undefined") return clone(showcase);
  try {
    const saved = JSON.parse(window.localStorage.getItem(workspaceStorageKey(user.email)) ?? "null") as { version?: number; data?: unknown } | null;
    if (saved?.version === workspaceVersion && isSnapshot(saved.data)) return clone(saved.data);
  } catch {
    // Corrupt local demo data is treated as an empty workspace instead of crashing the app.
  }
  return clone(showcase);
}

export function saveWorkspace(email: string, data: WorkspaceSnapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(workspaceStorageKey(email), JSON.stringify({ version: workspaceVersion, data }));
}
