import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

export const metadata: Metadata = {
  title: "Learning Paths | SkillHub",
  description: "Structured learning paths to master in-demand skills.",
};

export default function LearningPathLayout({
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
      <SidebarProvider>
        <div className="h-full">{children}</div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
