'use client';

import React, { useActionState, useState } from 'react';
import { updateExamAction } from '@/actions/exams';
import { Exam, ExamSection } from '@/lib/db/interface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import ExamEditor from '@/components/admin/ExamEditor';
import { useFormStatus } from 'react-dom';
import { Textarea } from '../ui/textarea';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold min-w-[100px]"
        >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
        </Button>
    )
}

interface EditExamFormProps {
    exam: Exam;
}

export function EditExamForm({ exam }: EditExamFormProps) {
    const updateActionWithId = updateExamAction.bind(null, exam._id);
    const action: any = updateActionWithId;
    const [state, formAction] = useActionState(action, { message: null, error: null });

    // State to track sections (and questions within them)
    // Initialize with empty array if null
    const [sections, setSections] = useState<ExamSection[]>(exam.sections || []);

    // Toast effect
    React.useEffect(() => {
        if (state?.error) {
            toast.error(typeof state.error === 'string' ? state.error : 'Validation failed');
        } else if (state?.message) {
            toast.success(state.message);
        }
    }, [state]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">

                <form action={formAction}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/lms/admin" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <SubmitButton />
                        </div>
                    </div>



                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-6">
                            {/* Exam Editor Component */}
                            <ExamEditor
                                initialSections={sections}
                                onChange={setSections}
                            />
                            {/* Hidden input to pass sections JSON string */}
                            <input
                                type="hidden"
                                name="sections"
                                value={JSON.stringify(sections)}
                            />
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-base text-card-foreground">Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-card-foreground">Title</Label>
                                        <Input id="title" name="title" defaultValue={exam.title} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-card-foreground">Description</Label>
                                        <Input id="description" name="description" defaultValue={exam.description} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Duration (mins)</Label>
                                        <Input type="number" name="duration" defaultValue={exam.duration_minutes} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Passing Score (%)</Label>
                                        <Input type="number" name="passingScore" defaultValue={exam.pass_score} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Difficulty</Label>
                                        <select name="difficulty" defaultValue={exam.difficulty || 'Beginner'} className="w-full bg-background border border-border rounded-md p-2 text-card-foreground">
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Instructions (one per line)</Label>
                                        <Textarea name="instructions" defaultValue={(exam.instructions || []).join('\n')} className="bg-background border-border min-h-[100px]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Objectives (one per line)</Label>
                                        <Textarea name="objectives" defaultValue={(exam.objectives || []).join('\n')} className="bg-background border-border min-h-[100px]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Prerequisites (one per line)</Label>
                                        <Textarea name="prerequisites" defaultValue={(exam.prerequisites || []).join('\n')} className="bg-background border-border min-h-[100px]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Tags (comma separated)</Label>
                                        <Input name="tags" defaultValue={(exam.tags || []).join(', ')} className="bg-background border-border" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}
