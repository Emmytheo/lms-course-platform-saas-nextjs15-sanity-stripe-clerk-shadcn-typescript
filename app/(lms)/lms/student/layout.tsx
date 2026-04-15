import { StudentAppSidebar } from "@/components/student-app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <StudentAppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4  pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
