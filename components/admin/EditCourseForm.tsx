'use client';

import React, { useActionState, useState } from 'react';
import { updateCourseAction } from '@/actions/courses';
import { Course } from '@/lib/db/interface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import CurriculumBuilder from '@/components/admin/CurriculumBuilder';
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

export function EditCourseForm({ course }: { course: Course }) {
    // Correct usage of server action with binding and useActionState
    const updateActionWithId = updateCourseAction.bind(null, course._id);
    // Explicitly casting the action type if TS complains about specific signature match
    const action: any = updateActionWithId;
    const [state, formAction] = useActionState(action, { message: null, error: null });

    const [modules, setModules] = useState<any[]>(course.modules || []);

    const updateModules = (newModules: any[]) => {
        setModules(newModules);
    };

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
                    {/* Header Actions */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/lms/admin" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" type="button" className="border-border text-muted-foreground hover:text-foreground">Preview</Button>
                            <SubmitButton />
                        </div>
                    </div>



                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Content Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-card-foreground">Course Structure</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <CurriculumBuilder
                                        initialModules={course.modules || []}
                                        onChange={updateModules}
                                    />
                                    {/* Pass modules content as hidden JSON for server action */}
                                    <input type="hidden" name="modules" value={JSON.stringify(modules)} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Settings */}
                        <div className="space-y-6">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-base text-card-foreground">Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-card-foreground">Title</Label>
                                        <Input id="title" name="title" defaultValue={course.title} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-card-foreground">Description</Label>
                                        <Textarea id="description" name="description" defaultValue={course.description} className="bg-background border-border min-h-[100px]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Price (USD)</Label>
                                        <Input type="number" name="price" defaultValue={course.price || 0} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Image URL</Label>
                                        <Input name="imageUrl" defaultValue={course.image || ''} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Category</Label>
                                        <Input name="category" defaultValue={course.category?.title || ''} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Tags (comma separated)</Label>
                                        <Input
                                            name="tags"
                                            defaultValue={(course.tags || []).join(', ')}
                                            placeholder="React, Coding, Web"
                                            className="bg-background border-border"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Level</Label>
                                        <select name="level" defaultValue={course.level || 'All Levels'} className="w-full bg-background border border-border rounded-md p-2 text-card-foreground">
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="All Levels">All Levels</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Language</Label>
                                        <Input name="language" defaultValue={course.language || 'English'} className="bg-background border-border" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">What You'll Learn (one per line)</Label>
                                        <Textarea name="objectives" defaultValue={(course.objectives || []).join('\n')} className="bg-background border-border min-h-[100px]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Prerequisites (one per line)</Label>
                                        <Textarea name="prerequisites" defaultValue={(course.prerequisites || []).join('\n')} className="bg-background border-border min-h-[100px]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase">Includes (one per line)</Label>
                                        <Textarea name="includes" defaultValue={(course.includes || []).join('\n')} className="bg-background border-border min-h-[100px]" />
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
