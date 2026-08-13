export type MatchBand = "strong" | "promising" | "review";

export function matchBand(score: number): MatchBand {
  if (score >= 85) return "strong";
  if (score >= 70) return "promising";
  return "review";
}

export function recruiterDisclaimer() {
  return "AI-assisted analysis is guidance, not a hiring decision. Review original materials and interview evidence.";
}
