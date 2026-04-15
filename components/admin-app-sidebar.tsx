"use client"

import * as React from "react"
import {
    BookOpen,
    LayoutDashboard,
    GraduationCap,
    FileText,
    Users,
    Settings,
    Layers,
    PlusCircleIcon,
    MailIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarGroup,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/client"
import { User } from "@supabase/supabase-js"

const navGroups = [
    {
        title: "General",
        items: [
            {
                title: "Dashboard",
                url: "/lms/admin",
                icon: LayoutDashboard,
            },
            // Analytics would go here
        ]
    },
    {
        title: "Instructor",
        items: [
            {
                title: "Courses",
                url: "/lms/admin/courses",
                icon: BookOpen,
            },
            {
                title: "Exams",
                url: "/lms/admin/exams",
                icon: FileText,
            },
            {
                title: "Learning Paths",
                url: "/lms/admin/learning-paths",
                icon: Layers,
            },
            {
                title: "Instructors",
                url: "/lms/admin/instructors",
                icon: GraduationCap,
            },
            {
                title: "Students",
                url: "/lms/admin/students",
                icon: Users,
            },
        ]
    },
    {
        title: "Misc",
        items: [
            {
                title: "Settings",
                url: "/lms/admin/settings",
                icon: Settings,
            },
        ]
    }
]

export function AdminAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = React.useState<User | null>(null);
    const [profile, setProfile] = React.useState<any>(null);
    const supabase = createClient();

    React.useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setProfile(data);
            }
        }
        getUser();
    }, [supabase]);

    const sidebarUser = {
        name: profile?.full_name || user?.user_metadata?.full_name || "Admin User",
        email: user?.email || "admin@example.com",
        avatar: profile?.avatar_url || user?.user_metadata?.avatar_url || "/avatars/admin.jpg",
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/lms/admin">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GraduationCap className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">LMS Admin</span>
                                    <span className="truncate text-xs">Management Console</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="flex items-center gap-2">
                                <SidebarMenuButton
                                    tooltip="Quick Create"
                                    className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                                >
                                    <PlusCircleIcon />
                                    <span>Quick Create</span>
                                </SidebarMenuButton>
                                <Button
                                    size="icon"
                                    className="h-9 w-9 shrink-0"
                                    variant="outline"
                                >
                                    <MailIcon />
                                    <span className="sr-only">Inbox</span>
                                </Button>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarHeader>
            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={sidebarUser} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
