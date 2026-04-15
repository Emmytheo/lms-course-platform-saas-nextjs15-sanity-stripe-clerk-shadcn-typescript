'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createLearningPathAction } from '@/actions/learning-paths';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="min-w-[120px]"
        >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Path'}
        </Button>
    )
}

export default function CreateLearningPathPage() {
    const [state, formAction] = useActionState(createLearningPathAction, { message: null, error: null });

    React.useEffect(() => {
        if (state?.error) {
            toast.error(typeof state.error === 'string' ? state.error : 'Validation failed');
        }
    }, [state]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">

                <Link href="/lms/admin/learning-paths" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to List
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">New Learning Path</h1>
                    <p className="text-muted-foreground">Define a sequential curriculum of courses.</p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Start by giving your path a name and description.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="title">Path Title</Label>
                                <Input id="title" name="title" placeholder="e.g., Full Stack Developer Career Path" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="Describe the goal of this learning path..." className="min-h-[100px]" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Cover Image URL</Label>
                                <Input id="imageUrl" name="imageUrl" placeholder="HTTPS URL..." />
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/lms/admin/learning-paths">Cancel</Link>
                                </Button>
                                <SubmitButton />
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
