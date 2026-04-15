'use client';

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Course, Exam } from '@/lib/db/interface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- Sortable Item Component ---
// --- Sortable Item Component ---
function SortableItemRow({ item, index, onRemove }: { item: Course | Exam, index: number, onRemove: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isExam = 'pass_score' in item;

    return (
        <div ref={setNodeRef} style={style} className={`mb-2 bg-card border rounded p-4 flex items-center gap-4 group ${isExam ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
            <div {...attributes} {...listeners} className="cursor-grab hover:text-primary text-muted-foreground outline-none">
                <GripVertical className="w-5 h-5" />
            </div>
            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-bold text-muted-foreground">
                {index + 1}
            </div>
            {isExam ? (
                // EXAM UI
                <>
                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                        <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">Exam</Badge>
                    </div>
                </>
            ) : (
                // COURSE UI
                <>
                    {(item as Course).image ? (
                        <img src={(item as Course).image} alt={item.title} className="w-10 h-10 rounded object-cover" />
                    ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                        </div>
                    )}
                </>
            )}

            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item._id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
}

// --- Main Component ---

interface LearningPathBuilderProps {
    initialItems?: (Course | Exam)[];
    availableCourses: Course[];
    availableExams?: Exam[];
    onChange?: (items: (Course | Exam)[]) => void;
}

export default function LearningPathBuilder({ initialItems = [], availableCourses = [], availableExams = [], onChange }: LearningPathBuilderProps) {
    const [items, setItems] = useState<(Course | Exam)[]>(initialItems);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((currentItems) => {
                const oldIndex = currentItems.findIndex((i) => i._id === active.id);
                const newIndex = currentItems.findIndex((i) => i._id === over.id);
                const newItems = arrayMove(currentItems, oldIndex, newIndex);

                // Defer the parent update to avoid "setState during render" issues with dnd-kit
                if (onChange) {
                    setTimeout(() => onChange(newItems), 0);
                }
                return newItems;
            });
        }
    };

    const addItem = (item: Course | Exam) => {
        if (items.some(i => i._id === item._id)) return; // Prevent duplicates
        const newItems = [...items, item];
        setItems(newItems);
        onChange?.(newItems);
        setIsDialogOpen(false);
    };

    const removeItem = (id: string) => {
        const newItems = items.filter(i => i._id !== id);
        setItems(newItems);
        onChange?.(newItems);
    };

    const filteredCourses = availableCourses.filter(c =>
        !items.some(existing => existing._id === c._id) &&
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredExams = availableExams.filter(e =>
        !items.some(existing => existing._id === e._id) &&
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-foreground">Path Curriculum</h3>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                        <Plus className="w-4 h-4 mr-2" /> Add Content
                    </Button>

                    <DialogContent className="max-w-2xl bg-popover text-popover-foreground border-border">
                        <DialogHeader>
                            <DialogTitle>Select Content to Add</DialogTitle>
                        </DialogHeader>

                        <Tabs defaultValue="courses" className="w-full mt-4">
                            <TabsList className="bg-muted border-border w-full justify-start">
                                <TabsTrigger value="courses">Courses</TabsTrigger>
                                <TabsTrigger value="exams">Exams</TabsTrigger>
                            </TabsList>

                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-background border-input mt-4 mb-2"
                            />

                            <TabsContent value="courses" className="max-h-[300px] overflow-y-auto space-y-2">
                                {filteredCourses.map(course => (
                                    <div
                                        key={course._id}
                                        className="flex justify-between items-center p-3 bg-card rounded hover:bg-accent cursor-pointer border border-transparent hover:border-primary/50 transition-colors"
                                        onClick={() => addItem(course)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {course.image && <img src={course.image} alt={course.title} className="w-8 h-8 rounded object-cover" />}
                                            <span className="font-medium text-card-foreground">{course.title}</span>
                                        </div>
                                        <Plus className="w-4 h-4 text-primary" />
                                    </div>
                                ))}
                                {filteredCourses.length === 0 && <div className="text-center text-muted-foreground py-4">No matching courses found.</div>}
                            </TabsContent>

                            <TabsContent value="exams" className="max-h-[300px] overflow-y-auto space-y-2">
                                {filteredExams.map(exam => (
                                    <div
                                        key={exam._id}
                                        className="flex justify-between items-center p-3 bg-card rounded hover:bg-accent cursor-pointer border border-transparent hover:border-primary/50 transition-colors"
                                        onClick={() => addItem(exam)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary" className="bg-primary/20 text-primary">Exam</Badge>
                                            <span className="font-medium text-card-foreground">{exam.title}</span>
                                        </div>
                                        <Plus className="w-4 h-4 text-primary" />
                                    </div>
                                ))}
                                {filteredExams.length === 0 && <div className="text-center text-muted-foreground py-4">No matching exams found.</div>}
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end mt-4">
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(c => c._id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map((item, index) => (
                        <SortableItemRow
                            key={item._id}
                            item={item}
                            index={index}
                            onRemove={removeItem}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {items.length === 0 && (
                <div className="text-center py-8 border border-dashed border-border rounded-lg text-muted-foreground">
                    This path has no content yet. Click "Add Content" to begin.
                </div>
            )}
        </div>
    );
}
