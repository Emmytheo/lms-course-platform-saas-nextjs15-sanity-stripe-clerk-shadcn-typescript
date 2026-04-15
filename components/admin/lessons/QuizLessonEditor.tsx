'use client';

import React, { useState } from 'react';
import { Lesson, Question } from '@/lib/db/interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuizLessonEditorProps {
    lesson: Lesson;
    onChange: (content: Partial<Lesson>) => void;
}

export function QuizLessonEditor({ lesson, onChange }: QuizLessonEditorProps) {
    const [questions, setQuestions] = useState<Question[]>(lesson.questions || []);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const updateQuestions = (newQuestions: Question[]) => {
        setQuestions(newQuestions);
        onChange({ questions: newQuestions });
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            text: 'New Question',
            type: 'multiple_choice',
            options: ['Option A', 'Option B'],
            correct_option_index: 0,
            points: 10
        };
        const newQuestions = [...questions, newQuestion];
        updateQuestions(newQuestions);
        setEditingQuestion(newQuestion);
    };

    const removeQuestion = (id: string) => {
        const newQuestions = questions.filter(q => q.id !== id);
        updateQuestions(newQuestions);
    };

    const updateQuestion = (updated: Question) => {
        const newQuestions = questions.map(q => q.id === updated.id ? updated : q);
        updateQuestions(newQuestions);
        setEditingQuestion(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-foreground">Quiz Questions</Label>
                <Button onClick={addQuestion} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    <Plus className="w-4 h-4 mr-2" /> Add Question
                </Button>
            </div>

            <div className="space-y-2">
                {questions.map((question, index) => (
                    <Card key={question.id} className="bg-card border-border">
                        <CardContent className="flex items-center gap-3 p-3">
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0" onClick={() => setEditingQuestion(question)}>
                                <p className="text-sm text-foreground/80 truncate cursor-pointer hover:text-foreground transition-colors">
                                    {index + 1}. {question.text}
                                </p>
                            </div>
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">{question.type}</Badge>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeQuestion(question.id)}
                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {questions.length === 0 && (
                    <div className="text-sm text-muted-foreground italic text-center py-4 border border-border rounded-md">
                        No questions added yet.
                    </div>
                )}
            </div>

            <Dialog open={!!editingQuestion} onOpenChange={(open: boolean) => !open && setEditingQuestion(null)}>
                <DialogContent className="max-w-xl bg-card text-card-foreground border-border max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                    </DialogHeader>
                    {editingQuestion && (
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Question Text</Label>
                                <Textarea
                                    value={editingQuestion.text}
                                    onChange={(e) => updateQuestion({ ...editingQuestion, text: e.target.value })}
                                    className="bg-background border-border"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={editingQuestion.type}
                                        onValueChange={(val: any) => updateQuestion({ ...editingQuestion, type: val })}
                                    >
                                        <SelectTrigger className="bg-background border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border-border">
                                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                            <SelectItem value="true_false">True / False</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Points</Label>
                                    <Input
                                        type="number"
                                        value={editingQuestion.points}
                                        onChange={(e) => updateQuestion({ ...editingQuestion, points: parseInt(e.target.value) || 0 })}
                                        className="bg-background border-border"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Options (one per line)</Label>
                                <Textarea
                                    value={(editingQuestion.options || []).join('\n')}
                                    onChange={(e) => {
                                        const opts = e.target.value.split('\n');
                                        // Reset correct index if out of bounds
                                        const currentIdx = editingQuestion.correct_option_index ?? 0;
                                        const newIndex = currentIdx >= opts.length ? 0 : currentIdx;
                                        updateQuestion({ ...editingQuestion, options: opts, correct_option_index: newIndex });
                                    }}
                                    className="bg-background border-border min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Correct Option</Label>
                                <Select
                                    value={(editingQuestion.correct_option_index ?? 0).toString()}
                                    onValueChange={(val) => updateQuestion({ ...editingQuestion, correct_option_index: parseInt(val) })}
                                >
                                    <SelectTrigger className="bg-background border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border-border">
                                        {(editingQuestion.options || []).map((opt, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                Option {i + 1}: {opt.substring(0, 20)}{opt.length > 20 ? '...' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setEditingQuestion(null)} className="bg-primary text-primary-foreground hover:bg-primary/90">Done</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
