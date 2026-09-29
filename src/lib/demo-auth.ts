export type DemoUser = {
  name: string;
  email: string;
  role: string;
};

export const demoSessionKey = "hireflow-demo-session";
const demoAccountsKey = "hireflow-demo-accounts";

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
  const accounts = readAccounts();
  const accountIndex = accounts.findIndex((account) => account.user.email.toLowerCase() === user.email.toLowerCase());
  if (accountIndex >= 0) {
    accounts[accountIndex] = { ...accounts[accountIndex], user };
    window.localStorage.setItem(demoAccountsKey, JSON.stringify(accounts));
  }
}

export function clearDemoUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(demoSessionKey);
  window.sessionStorage.removeItem(demoSessionKey);
}

type DemoAccount = { user: DemoUser; passwordHash: string };

function readAccounts(): DemoAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(demoAccountsKey) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((account): account is DemoAccount => {
      if (!account || typeof account !== "object") return false;
      const candidate = account as Partial<DemoAccount>;
      return Boolean(candidate.user && typeof candidate.passwordHash === "string" && typeof candidate.user.email === "string");
    });
  } catch {
    return [];
  }
}

async function hashPassword(password: string) {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return password;
}

export async function registerDemoAccount(user: DemoUser, password: string, remember = true) {
  if (typeof window === "undefined") return { ok: false as const, reason: "unavailable" as const };
  const accounts = readAccounts();
  if (accounts.some((account) => account.user.email.toLowerCase() === user.email.toLowerCase())) return { ok: false as const, reason: "exists" as const };
  accounts.push({ user, passwordHash: await hashPassword(password) });
  window.localStorage.setItem(demoAccountsKey, JSON.stringify(accounts));
  saveDemoUser(user, remember);
  return { ok: true as const };
}

export async function authenticateDemoAccount(email: string, password: string, remember = true) {
  const account = readAccounts().find((candidate) => candidate.user.email.toLowerCase() === email.toLowerCase());
  if (!account) return { ok: false as const, reason: "missing" as const };
  if (account.passwordHash !== await hashPassword(password)) return { ok: false as const, reason: "invalid" as const };
  saveDemoUser(account.user, remember);
  return { ok: true as const, user: account.user };
}
