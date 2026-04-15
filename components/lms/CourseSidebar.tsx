'use client';

import React from 'react';
import { Course, Module, Lesson } from '@/lib/db/interface'; // Use real types
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, PlayCircle, Lock, Gamepad2, BrainCircuit, FileText, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CourseSidebarProps {
  course: Course;
  activeLessonId?: string;
  onSelectLesson?: (lesson: Lesson) => void;
  completedLessonIds?: string[];
  progress?: number;
}

export function CourseSidebar({
  course,
  activeLessonId,
  onSelectLesson,
  completedLessonIds = [],
  progress = 0
}: CourseSidebarProps) {

  // Default to opening the module containing the active lesson
  const activeModuleId = course.modules?.find(m => m.lessons?.some(l => l._id === activeLessonId))?._id;

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <h2 className="font-bold text-lg text-foreground mb-2 line-clamp-2">{course.title}</h2>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{progress}% Complete</p>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="single" collapsible defaultValue={activeModuleId} className="w-full">
          {course.modules?.map((module, index) => (
            <AccordionItem value={module._id} key={module._id} className="border-b border-border">
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Module {index + 1}</p>
                  <span className="text-sm font-medium text-foreground">{module.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-0">
                <div className="flex flex-col">
                  {module.lessons?.map((lesson) => {
                    const isActive = lesson._id === activeLessonId;
                    const isCompleted = completedLessonIds.includes(lesson._id);
                    // Mock locked state logic (e.g. if previous module not done)
                    const isLocked = false;

                    return (
                      <button
                        key={lesson._id}
                        onClick={() => !isLocked && onSelectLesson?.(lesson)}
                        disabled={isLocked}
                        className={cn(
                          "flex items-center gap-3 px-8 py-3 text-sm transition-colors border-l-2",
                          isActive
                            ? "bg-primary/20 border-primary text-primary"
                            : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground",
                          isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : (
                          <LessonIcon type={lesson.type} className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                        )}

                        <span className="truncate flex-1 text-left">{lesson.title}</span>

                        {lesson.type === 'video' && <span className="text-[10px] border border-border px-1 rounded text-muted-foreground">Video</span>}
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}

function LessonIcon({ type, className }: { type: string, className?: string }) {
  switch (type) {
    case 'video': return <Video className={className} />;
    case 'quiz': return <BrainCircuit className={className} />;
    case 'game': return <Gamepad2 className={className} />;
    default: return <FileText className={className} />;
  }
}
