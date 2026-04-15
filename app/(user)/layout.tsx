import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/components/Header";
import DashboardHeader from "@/components/DashboardHeader";

export const metadata: Metadata = {
  title: "SkillHub - Multi-Service Platform",
  description: "Unified hub for LMS, Training, CBT, and Publications.",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen flex flex-col">
        {/* We will enable a unified header here later */}
        <main className="flex-1">{children}</main>
      </div>
      <SanityLive />
    </ThemeProvider>
  );
}
