"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Palette = "default" | "nature" | "electric" | "ocean" | "sunset" | "midnight"

interface PaletteContextType {
    palette: Palette
    setPalette: (palette: Palette) => void
}

const PaletteContext = createContext<PaletteContextType | undefined>(undefined)

export function PaletteProvider({ children }: { children: React.ReactNode }) {
    const [palette, setPalette] = useState<Palette>("midnight")

    useEffect(() => {
        // Load persisted palette on mount
        const saved = localStorage.getItem("theme-palette") as Palette
        if (saved) {
            setPalette(saved)
        }
    }, [])

    useEffect(() => {
        // Apply palette to <html> or <body>
        const root = document.documentElement
        if (palette === "default") {
            root.removeAttribute("data-palette")
        } else {
            root.setAttribute("data-palette", palette)
        }
        // Persist
        localStorage.setItem("theme-palette", palette)
    }, [palette])

    return (
        <PaletteContext.Provider value={{ palette, setPalette }}>
            {children}
        </PaletteContext.Provider>
    )
}

export function usePalette() {
    const context = useContext(PaletteContext)
    if (!context) {
        throw new Error("usePalette must be used within a PaletteProvider")
    }
    return context
}
