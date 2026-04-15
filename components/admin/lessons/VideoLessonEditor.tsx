'use client';

import React from 'react';
import { Lesson } from '@/lib/db/interface';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VideoLessonEditorProps {
    lesson: Lesson;
    onChange: (updates: Partial<Lesson>) => void;
}

export function VideoLessonEditor({ lesson, onChange }: VideoLessonEditorProps) {
    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-base text-card-foreground">Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="videoUrl" className="text-card-foreground">Video URL</Label>
                    <Input
                        id="videoUrl"
                        value={lesson.videoUrl || ''}
                        onChange={(e) => onChange({ videoUrl: e.target.value })}
                        placeholder="https://vimeo.com/..."
                        className="bg-background border-border"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration" className="text-card-foreground">Duration (mins)</Label>
                    <Input
                        id="duration"
                        type="number"
                        placeholder="10"
                        className="bg-background border-border"
                    // Assuming we might add duration to Lesson interface later, or store in content?
                    // For now just partial impl
                    />
                </div>
            </CardContent>
        </Card>
    );
}
