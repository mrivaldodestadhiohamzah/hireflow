import { describe, expect, it } from "vitest";
import { analyzeCandidate, matchBand, recruiterDisclaimer } from "./candidate-analysis";

describe("candidate analysis guidance", () => {
  it("groups match scores into reviewable bands", () => {
    expect(matchBand(91)).toBe("strong");
    expect(matchBand(76)).toBe("promising");
    expect(matchBand(69)).toBe("review");
  });

  it("does not present AI guidance as a decision", () => {
    expect(recruiterDisclaimer()).toMatch(/not a hiring decision/i);
  });

  it("returns grounded review evidence for a candidate", () => {
    const analysis = analyzeCandidate({ name: "Maya Chen", role: "Frontend Engineer", experience: "6 years", skills: ["React", "TypeScript"], score: 91 });
    expect(analysis.band).toBe("strong");
    expect(analysis.strengths).toContain("React");
    expect(analysis.disclaimer).toMatch(/not a hiring decision/i);
  });
});
