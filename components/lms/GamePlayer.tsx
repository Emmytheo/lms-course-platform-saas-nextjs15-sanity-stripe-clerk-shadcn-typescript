'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GamePlayerProps {
    lessonId: string;
    content?: string; // Could be configuration JSON
}

export function GamePlayer({ lessonId, content }: GamePlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);

    if (isPlaying) {
        return (
            <div className="w-full h-full bg-black relative flex flex-col">
                <div className="absolute top-4 right-4 z-10">
                    <Button variant="destructive" size="sm" onClick={() => setIsPlaying(false)}>Exit Game</Button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center animate-pulse">
                        <Gamepad2 className="w-24 h-24 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground">Game Loaded</h2>
                        <p className="text-muted-foreground">Interactive session running...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-background p-8 text-center min-h-[500px]">
            <div className="mb-6 p-6 bg-card rounded-full border border-border shadow-lg">
                <Gamepad2 className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Interactive Challenge</h2>
            <p className="text-muted-foreground mb-8 max-w-md text-lg">
                Ready to test your skills? Launch the game module to begin the simulation.
            </p>
            <Button
                onClick={() => setIsPlaying(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-6 text-lg rounded-full shadow-lg transition-all hover:scale-105"
            >
                Start Game
            </Button>
        </div>
    );
}
