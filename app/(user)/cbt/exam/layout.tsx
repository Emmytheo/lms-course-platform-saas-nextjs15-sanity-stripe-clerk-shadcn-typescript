import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

export const metadata: Metadata = {
  title: "CBT Practice | SkillHub",
  description: "Computer-Based Testing exam environment.",
};

export default function ExamLayout({
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
