"use client"

import * as React from "react"
import {
    BookOpen,
    LayoutDashboard,
    GraduationCap,
    Award,
    CircleUser,
    Search,
    Settings
} from "lucide-react"

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
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/client"
import { User } from "@supabase/supabase-js"

// Sample data structure for nav groups
const navGroups = [
    {
        title: "General",
        items: [
            {
                title: "My Dashboard",
                url: "/lms/student/me",
                icon: LayoutDashboard,
            },
        ]
    },
    {
        title: "Personal",
        items: [
            {
                title: "My Courses",
                url: "/lms/student/me/my-courses",
                icon: BookOpen,
            },
            {
                title: "My Learning Paths",
                url: "/lms/student/me/my-learning-paths",
                icon: GraduationCap,
            },
            {
                title: "My Exams",
                url: "/lms/student/me/my-exams",
                icon: Search,
            },
            {
                title: "Achievements",
                url: "#",
                icon: Award,
            },
            {
                title: "Profile",
                url: "/lms/student/settings",
                icon: CircleUser,
            },
        ]
    },
    {
        title: "Recommended",
        items: [
            {
                title: "Browse Courses",
                url: "/lms/student/courses",
                icon: BookOpen,
            },
            {
                title: "Browse Paths",
                url: "/lms/student/learning-paths",
                icon: GraduationCap,
            },
            {
                title: "Browse Exams",
                url: "/lms/student/exams",
                icon: Search,
            },
        ]
    }
]

export function StudentAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        name: profile?.full_name || user?.user_metadata?.full_name || "Student User",
        email: user?.email || "student@example.com",
        avatar: profile?.avatar_url || user?.user_metadata?.avatar_url || "/avatars/student.jpg",
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/lms/student/me">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <BookOpen className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Student Portal</span>
                                    <span className="truncate text-xs">My Learning</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
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
