import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireFlow — AI-Powered Recruitment Platform",
  description: "A thoughtful recruiting workspace for small teams who want to hire with confidence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
