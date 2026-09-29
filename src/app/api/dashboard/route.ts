import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    service: "hireflow-web",
    mode: "demo",
    dataSource: "browser-local",
    message: "Dashboard metrics are scoped to the active browser-local demo workspace.",
  });
}
