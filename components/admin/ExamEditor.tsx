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
import { GripVertical, Plus, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExamSection, Question } from '@/lib/db/interface';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExamEditorProps {
    initialSections?: ExamSection[];
    onChange?: (sections: ExamSection[]) => void;
}

interface SortableSectionItemProps {
    section: ExamSection;
    sIndex: number;
    onUpdateTitle: (id: string, title: string) => void;
    onRemove: (id: string) => void;
    onAddQuestion: (sectionId: string) => void;
    children: React.ReactNode;
}

function SortableSectionItem({ section, sIndex, onUpdateTitle, onRemove, onAddQuestion, children }: SortableSectionItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-6">
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center gap-4 py-4">
                    <div
                        className="cursor-grab hover:text-primary text-muted-foreground outline-none"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border">Section {sIndex + 1}</Badge>
                    <Input
                        value={section.title}
                        onChange={(e) => onUpdateTitle(section.id, e.target.value)}
                        className="bg-background border-input font-bold h-9 flex-1 text-foreground"
                        placeholder="Section Title"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(section.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="pb-4 pt-0 pl-12 pr-4">
                    {children}
                    <div className="mt-3">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground" onClick={() => onAddQuestion(section.id)}>
                            <Plus className="w-3 h-3 mr-1" /> Add Question
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface SortableQuestionRowProps {
    question: Question;
    onEdit: (q: Question) => void;
}

function SortableQuestionRow({ question, onEdit }: SortableQuestionRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-2">
            <div
                onClick={() => onEdit(question)}
                className="flex items-center gap-3 p-3 rounded bg-muted/20 border border-border/50 hover:border-primary/30 cursor-pointer group transition-colors"
            >
                <div
                    className="cursor-grab hover:text-primary text-muted-foreground outline-none"
                    {...attributes}
                    {...listeners}
                    onClick={(e) => e.stopPropagation()} // Prevent triggering edit when dragging
                >
                    <GripVertical className="w-4 h-4" />
                </div>
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground truncate">{question.text}</span>
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">{question.type}</Badge>
                <span className="text-xs text-muted-foreground">{question.points} pts</span>
            </div>
        </div>
    );
}

export default function ExamEditor({ initialSections = [], onChange }: ExamEditorProps) {
    const [sections, setSections] = useState<ExamSection[]>(initialSections);
    const [editingQuestion, setEditingQuestion] = useState<{ sectionId: string, question: Question } | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // Check if dragging a section
        if (sections.some(s => s.id === active.id)) {
            if (active.id !== over.id) {
                setSections((items) => {
                    const oldIndex = items.findIndex((i) => i.id === active.id);
                    const newIndex = items.findIndex((i) => i.id === over.id);
                    const newItems = arrayMove(items, oldIndex, newIndex);
                    onChange?.(newItems);
                    return newItems;
                });
            }
            return;
        }

        // Handle Question Dragging
        const findSectionByQuestionId = (qid: string) => sections.find(s => s.questions.some(q => q.id === qid));
        const activeSection = findSectionByQuestionId(active.id);
        const overSection = findSectionByQuestionId(over.id);

        if (activeSection && overSection && activeSection.id === overSection.id) {
            if (active.id !== over.id) {
                const newSections = sections.map(sec => {
                    if (sec.id === activeSection.id) {
                        const oldIndex = sec.questions.findIndex(q => q.id === active.id);
                        const newIndex = sec.questions.findIndex(q => q.id === over.id);
                        return { ...sec, questions: arrayMove(sec.questions, oldIndex, newIndex) };
                    }
                    return sec;
                });
                setSections(newSections);
                onChange?.(newSections);
            }
        }
    };

    const addSection = () => {
        const newSection: ExamSection = { id: `sec-${Date.now()}`, title: 'New Section', questions: [] };
        const newSections = [...sections, newSection];
        setSections(newSections);
        onChange?.(newSections);
    };

    const removeSection = (id: string) => {
        const newSections = sections.filter(s => s.id !== id);
        setSections(newSections);
        onChange?.(newSections);
    };

    const updateSectionTitle = (id: string, title: string) => {
        const newSections = sections.map(s => s.id === id ? { ...s, title } : s);
        setSections(newSections);
        onChange?.(newSections);
    };

    const addQuestion = (sectionId: string) => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`, text: 'New Question', type: 'multiple_choice', options: ['Option A', 'Option B'], correct_option_index: 0, points: 10
        };
        const newSections = sections.map(s => {
            if (s.id === sectionId) return { ...s, questions: [...s.questions, newQuestion] };
            return s;
        });
        setSections(newSections);
        onChange?.(newSections);
        setEditingQuestion({ sectionId, question: newQuestion });
    };

    const updateQuestion = (updatedQuestion: Question) => {
        if (!editingQuestion) return;
        const newSections = sections.map(s => {
            if (s.id === editingQuestion.sectionId) {
                return { ...s, questions: s.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q) };
            }
            return s;
        });
        setSections(newSections);
        onChange?.(newSections);
        setEditingQuestion({ ...editingQuestion, question: updatedQuestion });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-foreground">Exam Sections</h3>
                <Button onClick={addSection} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                    <Plus className="w-4 h-4 mr-2" /> Add Section
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {sections.map((section, sIndex) => (
                        <SortableSectionItem
                            key={section.id}
                            section={section}
                            sIndex={sIndex}
                            onUpdateTitle={updateSectionTitle}
                            onRemove={removeSection}
                            onAddQuestion={addQuestion}
                        >
                            <SortableContext items={section.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2">
                                    {section.questions.map((question) => (
                                        <SortableQuestionRow
                                            key={question.id}
                                            question={question}
                                            onEdit={(q) => setEditingQuestion({ sectionId: section.id, question: q })}
                                        />
                                    ))}
                                    {section.questions.length === 0 && <div className="text-sm text-muted-foreground italic py-2">No questions.</div>}
                                </div>
                            </SortableContext>
                        </SortableSectionItem>
                    ))}
                </SortableContext>
            </DndContext>

            {/* Dialog Code */}
            <Dialog open={!!editingQuestion} onOpenChange={(open: boolean) => !open && setEditingQuestion(null)}>
                <DialogContent className="max-w-2xl bg-popover text-popover-foreground border-border max-h-[85vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Edit Question</DialogTitle></DialogHeader>
                    {editingQuestion && (
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2"><Label>Question Text</Label><Textarea value={editingQuestion.question.text} onChange={(e) => updateQuestion({ ...editingQuestion.question, text: e.target.value })} className="bg-background border-input min-h-[80px]" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Type</Label><select className="w-full bg-background border border-input rounded-md h-10 px-3 text-sm text-foreground" value={editingQuestion.question.type} onChange={(e) => updateQuestion({ ...editingQuestion.question, type: e.target.value as any })}><option value="multiple-choice">Multiple Choice</option><option value="true-false">True / False</option></select></div>
                                <div className="space-y-2"><Label>Points</Label><Input type="number" value={editingQuestion.question.points} onChange={(e) => updateQuestion({ ...editingQuestion.question, points: parseInt(e.target.value) || 0 })} className="bg-background border-input" /></div>
                            </div>
                            <div className="space-y-2"><Label>Options (one per line)</Label><Textarea value={editingQuestion.question.options.join('\n')} onChange={(e) => updateQuestion({ ...editingQuestion.question, options: e.target.value.split('\n') })} className="bg-background border-input min-h-[100px]" placeholder="Option A&#10;Option B" /></div>

                            <div className="space-y-2">
                                <Label>Correct Answer</Label>
                                <Select
                                    value={editingQuestion.question.correct_option_index?.toString() || '0'}
                                    onValueChange={(val) => updateQuestion({ ...editingQuestion.question, correct_option_index: parseInt(val) })}
                                >
                                    <SelectTrigger className="bg-background border-input">
                                        <SelectValue placeholder="Select correct answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {editingQuestion.question.options.map((opt, idx) => (
                                            <SelectItem key={idx} value={idx.toString()}>
                                                Option {idx + 1}: {opt.substring(0, 50)}{opt.length > 50 ? '...' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end pt-4"><Button onClick={() => setEditingQuestion(null)} className="bg-primary hover:bg-primary/90 text-primary-foreground">Done</Button></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
