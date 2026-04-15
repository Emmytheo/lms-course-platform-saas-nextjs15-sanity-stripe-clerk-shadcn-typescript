import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

export const metadata: Metadata = {
  title: "Dashboard | SkillHub",
  description: "Your personal SkillHub dashboard.",
};

export default function DashboardLayout({
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
        <div className="h-full mt-4">{children}</div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
