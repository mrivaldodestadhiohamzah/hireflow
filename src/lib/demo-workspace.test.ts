import { describe, expect, it } from "vitest";
import { emptyWorkspace, loadWorkspace, showcaseWorkspaceEmails, type WorkspaceSnapshot } from "./demo-workspace";

const showcase: WorkspaceSnapshot = {
  candidates: [{ id: 1, name: "Demo Candidate", initials: "DC", role: "Designer", job: "Designer", stage: "Applied", score: 80, experience: "3 years", skills: [], applied: "Today", tone: "bg-blue-100 text-blue-700", email: "candidate@hireflow.demo", notes: [] }],
  jobs: [],
  interviews: [],
  activities: ["Demo activity"],
  team: [],
  settings: emptyWorkspace.settings,
};

describe("browser-local workspace ownership", () => {
  it("only uses showcase data for the dedicated demo account", () => {
    expect(showcaseWorkspaceEmails.has("demo@hireflow.app")).toBe(true);
    expect(loadWorkspace({ name: "Nabila", email: "demo@hireflow.app", role: "Recruiting lead" }, showcase).candidates).toHaveLength(1);
    expect(loadWorkspace({ name: "Aldo", email: "aldo@example.com", role: "Recruiter" }, showcase)).toEqual(emptyWorkspace);
  });
});
