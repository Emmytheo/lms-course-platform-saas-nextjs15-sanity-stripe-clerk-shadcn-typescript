'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createExamAction } from '@/actions/exams';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="min-w-[120px]">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Exam'}
        </Button>
    )
}

export default function CreateExamPage() {
    const [state, formAction] = useActionState(createExamAction, { message: null, error: null });

    // Toast effect
    React.useEffect(() => {
        if (state?.error) {
            toast.error(typeof state.error === 'string' ? state.error : 'Validation failed');
        }
    }, [state]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">

                <Link href="/lms/admin/exams" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Exams
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Create New Exam</h1>
                    <p className="text-muted-foreground">Set up certification exams for your students.</p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle>Exam Information</CardTitle>
                        <CardDescription>
                            Define the scope and rules of this test.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="title">Exam Title</Label>
                                <Input id="title" name="title" placeholder="e.g., White Belt Certification" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="What does this exam cover?" className="min-h-[100px]" required />
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <Link href="/lms/admin/exams">
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <SubmitButton />
                            </div>

                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
