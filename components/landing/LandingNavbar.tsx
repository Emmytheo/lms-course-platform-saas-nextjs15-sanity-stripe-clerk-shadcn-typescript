"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/client";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LandingNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string>('student');
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                // Fetch role from profiles table
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile?.role) {
                    setRole(profile.role);
                }
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                if (profile?.role) {
                    setRole(profile.role);
                }
            } else {
                setRole('student');
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const dashboardLink = (role === 'admin' || role === 'instructor') ? '/lms/admin' : '/lms/student/me';

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <nav className="absolute top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-bold text-xl tracking-tighter text-foreground">
                        SKILL<span className="text-primary">HUB</span>
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {user && (
                        <Link href={dashboardLink} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                            {role === 'admin' || role === 'instructor' ? 'Admin Panel' : 'My Dashboard'}
                        </Link>
                    )}

                    <Link href="/lms/learning-paths" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                        Learning Paths
                    </Link>
                    <Link href="/lms/courses" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                        Courses
                    </Link>

                    <div className="h-4 w-px bg-border" />

                    {!user ? (
                        <>
                            <Link href="/login">
                                <Button size="sm" variant="ghost" className="font-bold text-gray-300 hover:text-white">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button size="sm" className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold px-6">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.email || ""} />
                                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuItem asChild>
                                    <Link href={dashboardLink}>Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Mobile Menu Trigger */}
                <div className="md:hidden flex items-center gap-4">
                    {user && (
                        <Link href={dashboardLink}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Link>
                    )}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-card border-border text-foreground w-[300px] p-6">
                            <div className="flex flex-col gap-6 mt-6">
                                {user && (
                                    <Link href={dashboardLink} onClick={() => setIsOpen(false)} className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors">
                                        {role === 'admin' || role === 'instructor' ? 'Admin Panel' : 'My Dashboard'}
                                    </Link>
                                )}

                                <Link href="/lms/learning-paths" onClick={() => setIsOpen(false)} className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors">
                                    Learning Paths
                                </Link>
                                <Link href="/lms/courses" onClick={() => setIsOpen(false)} className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors">
                                    Courses
                                </Link>
                                <div className="h-px bg-white/10 my-2" />

                                {!user ? (
                                    <>
                                        <Link href="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start font-bold text-muted-foreground hover:text-foreground pl-0">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <Button variant="ghost" onClick={() => { handleSignOut(); setIsOpen(false); }} className="w-full justify-start font-bold text-muted-foreground hover:text-foreground pl-0">
                                        Log Out
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </nav>
    );
}
