"use client"

import { useState, useEffect } from "react"
import { Palette, Moon, Sun, Monitor, LogOut, User, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { usePalette } from "@/context/palette-context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

export function ThemeUserButton() {
    const [open, setOpen] = useState(false)
    const { setTheme, theme } = useTheme()
    const { palette, setPalette } = usePalette()
    const router = useRouter()
    const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await createClient().auth.getSession()
            if (data.session?.user) {
                const u = data.session.user
                setUser({
                    name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
                    email: u.email || '',
                    avatarUrl: u.user_metadata?.avatar_url
                })
            }
        }
        fetchUser()
    }, [])

    const handleSignOut = async () => {
        await createClient().auth.signOut()
        router.push('/sign-in')
        router.refresh()
    }

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

    return (
        <>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(true)}
                    className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Theme & Display"
                >
                    <Palette className="h-4 w-4" />
                    <span className="sr-only">Theme</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-border hover:ring-primary transition-all focus:outline-none">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                                    {initials}
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border bg-card p-2">
                        {user && (
                            <>
                                <div className="px-3 py-2 mb-1">
                                    <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                            <a href="/lms/student/me" className="flex items-center gap-2">
                                <User className="w-4 h-4" /> My Profile
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setOpen(true)}
                            className="rounded-xl cursor-pointer gap-2"
                        >
                            <Settings className="w-4 h-4" /> Theme & Display
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="rounded-xl cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Theme & Display</DialogTitle>
                        <DialogDescription>
                            Customize the look and feel of your workspace.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Mode Selection */}
                        <div className="space-y-4">
                            <Label className="text-base">Appearance</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <Button
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    className="flex flex-col items-center gap-2 h-20"
                                    onClick={() => setTheme("light")}
                                >
                                    <Sun className="h-6 w-6" />
                                    <span>Light</span>
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    className="flex flex-col items-center gap-2 h-20"
                                    onClick={() => setTheme("dark")}
                                >
                                    <Moon className="h-6 w-6" />
                                    <span>Dark</span>
                                </Button>
                                <Button
                                    variant={theme === 'system' ? 'default' : 'outline'}
                                    className="flex flex-col items-center gap-2 h-20"
                                    onClick={() => setTheme("system")}
                                >
                                    <Monitor className="h-6 w-6" />
                                    <span>System</span>
                                </Button>
                            </div>
                        </div>

                        {/* Palette Selection */}
                        <div className="space-y-4">
                            <Label className="text-base">Color Palette</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'default', label: 'Default (Zinc)', colors: ['#71717a', '#a1a1aa'] },
                                    { id: 'nature', label: 'Nature (Green)', colors: ['#125B36', '#D97706'] },
                                    { id: 'electric', label: 'Electric (Blue)', colors: ['#3b82f6', '#06b6d4'] },
                                    { id: 'ocean', label: 'Ocean (Teal)', colors: ['#0ea5e9', '#14b8a6'] },
                                    { id: 'sunset', label: 'Sunset (Purple)', colors: ['#9333ea', '#db2777'] },
                                ].map(p => (
                                    <div
                                        key={p.id}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 p-2 transition-all hover:bg-muted",
                                            palette === p.id ? "border-primary" : "border-transparent"
                                        )}
                                        onClick={() => setPalette(p.id as any)}
                                    >
                                        <div className="flex gap-2 mb-2 rounded-lg p-2 bg-muted/50">
                                            <div className="h-3 flex-1 rounded-full" style={{ backgroundColor: p.colors[0] }} />
                                            <div className="h-3 flex-1 rounded-full" style={{ backgroundColor: p.colors[1] }} />
                                        </div>
                                        <span className="block text-center text-xs font-medium">{p.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
