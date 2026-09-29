import { describe, expect, it } from "vitest";
import { getGreeting } from "./i18n";

describe("getGreeting", () => {
  it("uses the current English time period and profile name", () => {
    expect(getGreeting("en", "Aldo", new Date(2026, 8, 30, 2, 33))).toBe(
      "Good night, Aldo",
    );
    expect(getGreeting("en", "Aldo", new Date(2026, 8, 30, 12, 0))).toBe(
      "Good afternoon, Aldo",
    );
    expect(getGreeting("en", "Aldo", new Date(2026, 8, 30, 18, 0))).toBe(
      "Good evening, Aldo",
    );
  });

  it("uses Indonesian greeting conventions", () => {
    expect(getGreeting("id", "Aldo", new Date(2026, 8, 30, 10, 0))).toBe(
      "Selamat pagi, Aldo",
    );
    expect(getGreeting("id", "Aldo", new Date(2026, 8, 30, 11, 0))).toBe(
      "Selamat siang, Aldo",
    );
    expect(getGreeting("id", "Aldo", new Date(2026, 8, 30, 15, 0))).toBe(
      "Selamat sore, Aldo",
    );
    expect(getGreeting("id", "Aldo", new Date(2026, 8, 30, 18, 0))).toBe(
      "Selamat malam, Aldo",
    );
  });

  it("uses a safe fallback when the profile name is blank", () => {
    expect(getGreeting("en", "   ", new Date(2026, 8, 30, 9, 0))).toBe(
      "Good morning, there",
    );
    expect(getGreeting("id", "   ", new Date(2026, 8, 30, 9, 0))).toBe(
      "Selamat pagi, di sana",
    );
  });
});
