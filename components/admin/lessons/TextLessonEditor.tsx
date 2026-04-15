'use client';

import React from 'react';
import { Lesson } from '@/lib/db/interface';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextLessonEditorProps {
    lesson: Lesson;
    onChange: (updates: Partial<Lesson>) => void;
}

export function TextLessonEditor({ lesson, onChange }: TextLessonEditorProps) {
    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-base text-card-foreground">Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="content" className="text-card-foreground">Markdown Content</Label>
                    <Textarea
                        id="content"
                        value={lesson.content || ''}
                        onChange={(e) => onChange({ content: e.target.value })}
                        placeholder="Write your article content in markdown..."
                        className="bg-background border-border min-h-[300px] font-mono text-sm"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
