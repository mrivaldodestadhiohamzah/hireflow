import { describe, expect, it } from "vitest";
import { matchBand, recruiterDisclaimer } from "./candidate-analysis";

describe("candidate analysis guidance", () => {
  it("groups match scores into reviewable bands", () => {
    expect(matchBand(91)).toBe("strong");
    expect(matchBand(76)).toBe("promising");
    expect(matchBand(69)).toBe("review");
  });

  it("does not present AI guidance as a decision", () => {
    expect(recruiterDisclaimer()).toMatch(/not a hiring decision/i);
  });
});
