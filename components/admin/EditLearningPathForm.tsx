'use client';

import React, { useActionState, useState } from 'react';
import { updateLearningPathAction } from '@/actions/learning-paths';
import { LearningPath, Course } from '@/lib/db/interface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import LearningPathBuilder from '@/components/admin/LearningPathBuilder';
import { useFormStatus } from 'react-dom';

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

interface EditLearningPathFormProps {
    path: LearningPath;
    allCourses: Course[];
    allExams: Exam[];
}

export function EditLearningPathForm({ path, allCourses, allExams }: EditLearningPathFormProps) {
    const updateActionWithId = updateLearningPathAction.bind(null, path._id);
    const action: any = updateActionWithId;
    const [state, formAction] = useActionState(action, { message: null, error: null });

    // State to track the sorted/updated courses/exams
    // Casting path.courses to allow mixed types if not already matching
    const [currentItems, setCurrentItems] = useState<(Course | Exam)[]>(path.courses || []);

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
                        <Link href="/lms/admin/learning-paths" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to List
                        </Link>
                        <div className="flex items-center gap-4">
                            <SubmitButton />
                        </div>
                    </div>



                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-card-foreground">Curriculum Sequence</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <LearningPathBuilder
                                        initialItems={currentItems}
                                        availableCourses={allCourses}
                                        availableExams={allExams}
                                        onChange={setCurrentItems}
                                    />
                                    {/* Pass updated courses as hidden JSON string (FULL OBJECTS) */}
                                    <input
                                        type="hidden"
                                        name="courses"
                                        value={JSON.stringify(currentItems)}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-base text-card-foreground">Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-card-foreground">Title</Label>
                                        <Input id="title" name="title" defaultValue={path.title} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-card-foreground">Description</Label>
                                        <Textarea id="description" name="description" defaultValue={path.description} className="bg-background border-border min-h-[100px]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Image URL</Label>
                                        <Input name="imageUrl" defaultValue={path.image || ''} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Level</Label>
                                        <select name="level" defaultValue={path.level || 'All Levels'} className="w-full bg-background border border-border rounded-md p-2 text-card-foreground">
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="All Levels">All Levels</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Language</Label>
                                        <Input name="language" defaultValue={path.language || 'English'} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Objectives (one per line)</Label>
                                        <Textarea name="objectives" defaultValue={(path.objectives || []).join('\n')} className="bg-background border-border min-h-[100px]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Prerequisites (one per line)</Label>
                                        <Textarea name="prerequisites" defaultValue={(path.prerequisites || []).join('\n')} className="bg-background border-border min-h-[100px]" />
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
