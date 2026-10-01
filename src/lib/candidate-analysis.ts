export type MatchBand = "strong" | "promising" | "review";

export function matchBand(score: number): MatchBand {
  if (score >= 85) return "strong";
  if (score >= 70) return "promising";
  return "review";
}

export function recruiterDisclaimer() {
  return "AI-generated guidance, not a hiring decision. Review the original application and interview evidence.";
}

export type CandidateAnalysisInput = {
  name: string;
  role: string;
  experience: string;
  skills: string[];
  score: number;
};

export function analyzeCandidate(input: CandidateAnalysisInput) {
  const band = matchBand(input.score);
  const summary = band === "strong"
    ? `${input.name} shows strong alignment with the core requirements for ${input.role}.`
    : band === "promising"
      ? `${input.name} shows promising alignment with the core requirements for ${input.role}.`
      : `${input.name} has relevant signals for ${input.role} that need a closer recruiter review.`;

  return {
    band,
    summary,
    strengths: input.skills.slice(0, 3),
    gaps: ["Confirm depth of experience operating at your team’s scale during the interview."],
    evidence: `${input.experience} of experience and ${input.skills.length} role-relevant skills were included in the application profile.`,
    disclaimer: recruiterDisclaimer(),
  };
}
