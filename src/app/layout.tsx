import type { Metadata } from "next";
import hireFlowLogo from "@/components/hireflowlogo.png";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireFlow — AI-Powered Recruitment Platform",
  description: "A thoughtful recruiting workspace for small teams who want to hire with confidence.",
  icons: {
    icon: [{ url: hireFlowLogo.src, type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
