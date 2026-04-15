'use client';

import React from 'react';
import { Lesson } from '@/lib/db/interface';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface GameLessonEditorProps {
    lesson: Lesson;
    onChange: (content: Partial<Lesson>) => void;
}

export function GameLessonEditor({ lesson, onChange }: GameLessonEditorProps) {
    // Game config might separate from main content in future.
    // For now, storing gameType in metadata or content.

    // Let's assume we use properties on Lesson for now or a `metadata` json field if Lesson interface allows.
    // The Lesson interface has `content` (string) and `videoUrl`.
    // It doesn't seem to have a dedicated `metadata` field. 
    // We might need to overload `content` as JSON or request schema update.
    // For now, let's assume `content` stores the Game Type ID.

    const gameType = lesson.content || 'flashcards';

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-foreground">Game Type</Label>
                <select
                    className="w-full bg-background border border-border rounded-md h-10 px-3 text-sm text-foreground"
                    value={gameType}
                    onChange={(e) => onChange({ content: e.target.value })}
                >
                    <option value="flashcards">Flashcards</option>
                    <option value="memory-match">Memory Match</option>
                    <option value="trivia-challenge">Trivia Challenge</option>
                </select>
                <p className="text-xs text-muted-foreground">
                    Select the type of game to present to the student.
                </p>
            </div>

            {/* Placeholder for specific game configs */}
            {gameType === 'flashcards' && (
                <div className="p-4 bg-muted border border-border rounded-md">
                    <p className="text-muted-foreground text-sm">Flashcards will be automatically generated from the course glossary or key terms (Future Feature).</p>
                </div>
            )}

            {/* Additional game settings could go here */}
        </div>
    );
}
