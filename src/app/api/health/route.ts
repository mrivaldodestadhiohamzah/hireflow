import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ service: "hireflow-web", status: "healthy", mode: "demo" });
}
