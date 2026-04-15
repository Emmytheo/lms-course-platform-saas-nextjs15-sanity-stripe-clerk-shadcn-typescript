"use client"
import * as React from "react"
import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ViewContext = React.createContext<{ view: 'list' | 'grid', setView: (v: 'list' | 'grid') => void } | null>(null)

export function ViewProvider({ children, defaultView = 'list' }: { children: React.ReactNode, defaultView?: 'list' | 'grid' }) {
    // Default to 'grid' on mobile if not overridden by explicit prop change? 
    // Actually the user wants "default to grid mode on mobile".
    // So if defaultView is passed, we might respect it, OR we force grid on mobile init.
    // Let's force grid if window width < 768px on mount.

    const [view, setView] = React.useState<'list' | 'grid'>(defaultView)

    React.useEffect(() => {
        const handleResize = () => {
            // Only auto-switch on initial load or if we want dynamic switching?
            // Usually responsive defaults run once.
            // But if user resizes, we might not want to force switch if they manually changed it.
            // For simplicity and fulfilling the request "default to grid on mobile":
            if (window.innerWidth < 768) {
                setView('grid');
            } else {
                // Should we revert to list? Maybe not? 
                // Let's respect initial default for desktop.
            }
        }

        // Check on mount
        if (window.innerWidth < 768) {
            setView('grid');
        }

        // We don't necessarily attach resize listener effectively unless we want to react to resize. 
        // Just setting initial state based on window is usually enough for "default".
    }, []);

    return <ViewContext.Provider value={{ view, setView }}>{children}</ViewContext.Provider>
}

export function ViewTrigger({ className }: { className?: string }) {
    const context = React.useContext(ViewContext)
    if (!context) return null
    return (
        <div className={cn("flex items-center gap-1 bg-muted border border-border rounded-md p-1", className)}>
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-7 w-7 hover:bg-background/50", context.view === 'list' && "bg-background text-foreground shadow-sm")}
                onClick={() => context.setView('list')}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-7 w-7 hover:bg-background/50", context.view === 'grid' && "bg-background text-foreground shadow-sm")}
                onClick={() => context.setView('grid')}
            >
                <LayoutGrid className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function ViewList({ children, className }: { children: React.ReactNode, className?: string }) {
    const context = React.useContext(ViewContext)
    if (context?.view !== 'list') return null
    return <div className={className}>{children}</div>
}

export function ViewGrid({ children, className }: { children: React.ReactNode, className?: string }) {
    const context = React.useContext(ViewContext)
    if (context?.view !== 'grid') return null
    return <div className={className}>{children}</div>
}
