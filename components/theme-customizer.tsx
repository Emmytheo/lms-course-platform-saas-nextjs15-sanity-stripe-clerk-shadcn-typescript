"use client"

import * as React from "react"
import { Moon, Sun, Palette as PaletteIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { usePalette } from "@/context/palette-context"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"

export function ThemeCustomizer() {
    const { setTheme, theme } = useTheme()
    const { palette, setPalette } = usePalette()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <PaletteIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mode</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Palette</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                    checked={palette === 'default'}
                    onCheckedChange={() => setPalette('default')}
                >
                    Default (Zinc)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={palette === 'nature'}
                    onCheckedChange={() => setPalette('nature')}
                >
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#125B36]" />
                        Nature (Green)
                    </div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={palette === 'midnight'}
                    onCheckedChange={() => setPalette('midnight')}
                >
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#EAB308]" />
                        Midnight & Gold
                    </div>
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
