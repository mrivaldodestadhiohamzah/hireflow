import type { Metadata } from "next";
import hireFlowLogo from "@/components/hireflowlogo.png";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireFlow — Recruitment workspace",
  description: "A recruiting workspace for reviewing applications, interviews, feedback, and hiring decisions.",
  icons: {
    icon: [{ url: hireFlowLogo.src, type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
