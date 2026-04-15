'use client';

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Video, FileText, Gamepad2, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Module, Lesson } from '@/lib/db/interface';
import { LessonEditor } from './lessons/LessonEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// --- Sortable Item Component ---
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-2">
            {React.cloneElement(children as React.ReactElement<{ dragHandleProps?: any }>, { dragHandleProps: { ...attributes, ...listeners } })}
        </div>
    );
}

// --- Main Builder Component ---

interface CurriculumBuilderProps {
    initialModules?: Module[];
    onChange?: (modules: Module[]) => void;
}

export default function CurriculumBuilder({ initialModules = [], onChange }: CurriculumBuilderProps) {
    const [modules, setModules] = useState<Module[]>(initialModules);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editingLesson, setEditingLesson] = useState<{ moduleId: string, lesson: Lesson } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setModules((items) => {
                const oldIndex = items.findIndex((i) => i._id === active.id);
                const newIndex = items.findIndex((i) => i._id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                // Defer onChange to avoid calling during render (if strict mode invokes this)
                // Actually, best to just use the new items for both
                // specific React anti-pattern fix: don't side-effect in updater
                setTimeout(() => onChange?.(newItems), 0);
                return newItems;
            });
        }
        setActiveId(null);
    };

    const addModule = () => {
        const newModule: Module = {
            _id: `temp-${Date.now()}`,
            title: 'New Module',
            lessons: []
        };
        const newModules = [...modules, newModule];
        setModules(newModules);
        onChange?.(newModules);
    };

    const updateModuleTitle = (id: string, title: string) => {
        const newModules = modules.map(m => m._id === id ? { ...m, title } : m);
        setModules(newModules);
        onChange?.(newModules);
    };

    const removeModule = (id: string) => {
        const newModules = modules.filter(m => m._id !== id);
        setModules(newModules);
        onChange?.(newModules);
    };

    const handleUpdateLesson = (updatedLesson: Lesson) => {
        if (!editingLesson) return;
        const newModules = modules.map(m => {
            if (m._id === editingLesson.moduleId) {
                return {
                    ...m,
                    lessons: m.lessons?.map(l => l._id === updatedLesson._id ? updatedLesson : l)
                };
            }
            return m;
        });
        setModules(newModules);
        onChange?.(newModules);
        // Keep dialog open for continuous editing
        setEditingLesson({ ...editingLesson, lesson: updatedLesson });
    };

    const addLesson = (moduleId: string, type: Lesson['type']) => {
        const newLesson: Lesson = {
            _id: `temp-lesson-${Date.now()}`,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Lesson`,
            type,
            content: '',
            videoUrl: ''
        };
        const newModules = modules.map(m => {
            if (m._id === moduleId) {
                return { ...m, lessons: [...(m.lessons || []), newLesson] };
            }
            return m;
        });
        setModules(newModules);
        onChange?.(newModules);
        setEditingLesson({ moduleId, lesson: newLesson });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-foreground">Curriculum</h3>
                <Button onClick={addModule} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    <Plus className="w-4 h-4 mr-2" /> Add Module
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={(event) => setActiveId(event.active.id as string)}
            >
                <SortableContext
                    items={modules.map(m => m._id)}
                    strategy={verticalListSortingStrategy}
                >
                    {modules.map((module) => (
                        <SortableItem key={module._id} id={module._id}>
                            <ModuleCard
                                module={module}
                                onUpdateTitle={(title) => updateModuleTitle(module._id, title)}
                                onDelete={() => removeModule(module._id)}
                                onAddLesson={(type) => addLesson(module._id, type)}
                                onEditLesson={(lesson) => setEditingLesson({ moduleId: module._id, lesson })}
                            />
                        </SortableItem>
                    ))}
                </SortableContext>
            </DndContext>

            <Dialog open={!!editingLesson} onOpenChange={(open: boolean) => !open && setEditingLesson(null)}>
                <DialogContent className="max-w-4xl bg-card text-card-foreground border-border max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Lesson Content</DialogTitle>
                    </DialogHeader>
                    {editingLesson && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Lesson Title</label>
                                <Input
                                    value={editingLesson.lesson.title}
                                    onChange={(e) => handleUpdateLesson({ ...editingLesson.lesson, title: e.target.value })}
                                    className="bg-background border-border font-bold text-lg text-foreground"
                                />
                            </div>

                            <LessonEditor
                                lesson={editingLesson.lesson}
                                onChange={handleUpdateLesson}
                            />

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setEditingLesson(null)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ... Module Card ...
// Repeating ModuleCard to ensure file is complete since I'm overwriting
// reusing the function from previous view or assuming simpler for brevity? 
// The tool `write_to_file` overwrites, so I MUST provide the full file.
// I will copy the previously known ModuleCard content below.

function ModuleCard({
    module,
    onUpdateTitle,
    onDelete,
    onAddLesson,
    onEditLesson,
    dragHandleProps
}: {
    module: Module,
    onUpdateTitle: (t: string) => void,
    onDelete: () => void,
    onAddLesson: (type: Lesson['type']) => void,
    onEditLesson: (l: Lesson) => void,
    dragHandleProps?: any
}) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Card className="bg-card border-border">
            <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-4">
                <div {...dragHandleProps} className="cursor-grab hover:text-primary transition-colors">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex-1">
                    {isEditing ? (
                        <Input
                            value={module.title}
                            onChange={(e) => onUpdateTitle(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            autoFocus
                            className="bg-background border-border h-8 text-foreground"
                        />
                    ) : (
                        <span
                            className="font-medium text-foreground cursor-pointer hover:underline decoration-primary/50"
                            onClick={() => setIsEditing(true)}
                        >
                            {module.title}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs text-muted-foreground border-border">
                        {module.lessons?.length || 0} Lessons
                    </Badge>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 pl-12">
                {module.lessons && module.lessons.length > 0 ? (
                    <div className="space-y-2 mt-2">
                        {module.lessons.map((lesson) => (
                            <div
                                key={lesson._id}
                                onClick={() => onEditLesson(lesson)}
                                className="flex items-center gap-3 text-sm text-foreground bg-muted/50 p-2 rounded border border-border hover:border-primary/50 cursor-pointer group transition-colors"
                            >
                                {getLessonIcon(lesson.type)}
                                <span className="flex-1">{lesson.title}</span>
                                <span className="text-xs opacity-0 group-hover:opacity-100 text-primary transition-opacity">Edit</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground italic py-2">
                        No lessons yet. Drag content here directly.
                    </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground" onClick={() => onAddLesson('text')}>
                        <Plus className="w-3 h-3 mr-1" /> Text
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground" onClick={() => onAddLesson('video')}>
                        <Plus className="w-3 h-3 mr-1" /> Video
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground" onClick={() => onAddLesson('quiz')}>
                        <Plus className="w-3 h-3 mr-1" /> Quiz
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground" onClick={() => onAddLesson('game')}>
                        <Plus className="w-3 h-3 mr-1" /> Game
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function getLessonIcon(type: Lesson['type']) {
    switch (type) {
        case 'video': return <Video className="w-3 h-3 text-blue-500" />;
        case 'quiz': return <BrainCircuit className="w-3 h-3 text-purple-500" />;
        case 'game': return <Gamepad2 className="w-3 h-3 text-green-500" />;
        default: return <FileText className="w-3 h-3 text-muted-foreground" />;
    }
}
