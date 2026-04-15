'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createCourseAction } from '@/actions/courses';
import { toast } from 'sonner';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold min-w-[120px]">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Course'}
        </Button>
    );
}

const initialState = {
    error: null as string | object | null,
};

export default function CreateCoursePage() {
    const [state, formAction] = useActionState(createCourseAction, initialState);

    // Toast effect
    React.useEffect(() => {
        if (state?.error) {
            toast.error(typeof state.error === 'string' ? state.error : 'Validation failed');
        }
    }, [state]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">

                <Link href="/lms/admin" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Create New Course</h1>
                    <p className="text-muted-foreground">Start by filling out the basic details for your new course.</p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Course Details</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Basic information that will be displayed on the course card.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="space-y-6">

                            {state?.error && typeof state.error === 'string' && (
                                <div className="p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-md text-sm">
                                    {state.error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-foreground">Course Title</Label>
                                <Input id="title" name="title" placeholder="e.g., Advanced Muay Thai Clinch" className="bg-background border-border" required />
                                {state?.error && typeof state.error === 'object' && 'title' in state.error && (
                                    <p className="text-destructive text-xs">{(state.error as any).title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-foreground">Description</Label>
                                <Textarea id="description" name="description" placeholder="Briefly describe what students will learn..." className="bg-background border-border min-h-[100px]" required />
                                {state?.error && typeof state.error === 'object' && 'description' in state.error && (
                                    <p className="text-destructive text-xs">{(state.error as any).description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-foreground">Category</Label>
                                    <Select name="category">
                                        <SelectTrigger className="bg-background border-border">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border text-foreground">
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                            <SelectItem value="striking">Striking</SelectItem>
                                            <SelectItem value="grappling">Grappling</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-foreground">Price (USD)</Label>
                                    <Input id="price" name="price" type="number" placeholder="0" className="bg-background border-border" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imageUrl" className="text-foreground">Thumbnail URL</Label>
                                <Input id="imageUrl" name="imageUrl" placeholder="https://..." className="bg-background border-border" />
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <Button type="button" variant="outline" className="border-border text-muted-foreground hover:bg-muted" onClick={() => window.history.back()}>Cancel</Button>
                                <SubmitButton />
                            </div>

                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
