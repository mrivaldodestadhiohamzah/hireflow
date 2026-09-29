"use client";

import { useEffect, useState } from "react";
import { readDemoUser, type DemoUser } from "@/lib/demo-auth";
import HireFlowApp from "./hireflow-app";

export default function DemoAuthGate() {
  const [user, setUser] = useState<DemoUser | null | undefined>(undefined);

  useEffect(() => {
    const current = readDemoUser();
    if (!current) {
      window.location.replace("/login");
      return;
    }
    setUser(current);
  }, []);

  if (!user) return <main className="grid min-h-screen place-items-center bg-mist px-5"><div className="surface px-6 py-5 text-sm text-slate-600">Checking your demo session…</div></main>;
  return <HireFlowApp user={user} />;
}
