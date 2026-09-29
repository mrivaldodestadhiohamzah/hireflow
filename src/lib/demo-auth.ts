export type DemoUser = {
  name: string;
  email: string;
  role: string;
};

export const demoSessionKey = "hireflow-demo-session";

function parseUser(value: string | null): DemoUser | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<DemoUser>;
    if (typeof parsed.name !== "string" || typeof parsed.email !== "string" || typeof parsed.role !== "string") return null;
    return { name: parsed.name, email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}

export function readDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  return parseUser(window.localStorage.getItem(demoSessionKey)) ?? parseUser(window.sessionStorage.getItem(demoSessionKey));
}

export function saveDemoUser(user: DemoUser, remember = true) {
  if (typeof window === "undefined") return;
  const target = remember ? window.localStorage : window.sessionStorage;
  const other = remember ? window.sessionStorage : window.localStorage;
  target.setItem(demoSessionKey, JSON.stringify(user));
  other.removeItem(demoSessionKey);
}

export function clearDemoUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(demoSessionKey);
  window.sessionStorage.removeItem(demoSessionKey);
}
