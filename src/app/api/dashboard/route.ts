import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    candidates: 128,
    activeJobs: 14,
    interviewsThisWeek: 18,
    averageMatchScore: 82,
    generatedAt: new Date().toISOString(),
  });
}
