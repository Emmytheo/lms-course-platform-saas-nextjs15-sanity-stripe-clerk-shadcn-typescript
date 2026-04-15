'use client';

import React from 'react';
import { Lesson } from '@/lib/db/interface';
import { VideoLessonEditor } from './VideoLessonEditor';
import { TextLessonEditor } from './TextLessonEditor';
import { QuizLessonEditor } from './QuizLessonEditor';
import { GameLessonEditor } from './GameLessonEditor';
import { Card } from '@/components/ui/card';

interface LessonEditorProps {
    lesson: Lesson;
    onChange: (updatedLesson: Lesson) => void;
}

export function LessonEditor({ lesson, onChange }: LessonEditorProps) {
    const handleContentChange = (content: Partial<Lesson>) => {
        onChange({ ...lesson, ...content });
    };

    switch (lesson.type) {
        case 'video':
            return <VideoLessonEditor lesson={lesson} onChange={handleContentChange} />;
        case 'text':
            return <TextLessonEditor lesson={lesson} onChange={handleContentChange} />;
        case 'quiz':
            return <QuizLessonEditor lesson={lesson} onChange={handleContentChange} />;
        case 'game':
            return <GameLessonEditor lesson={lesson} onChange={handleContentChange} />;
        default:
            return <div className="text-red-500">Unknown lesson type</div>;
    }
}
