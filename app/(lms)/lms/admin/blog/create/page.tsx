'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, PenTool } from 'lucide-react';
import Link from 'next/link';
import { createPostAction } from '@/actions/blog';
import { toast } from 'sonner';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold min-w-[120px]">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Publication'}
        </Button>
    );
}

const initialState = {
    error: null as string | null,
};

export default function CreatePostPage() {
    const [state, formAction] = useActionState(createPostAction, initialState);

    // Toast effect
    React.useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
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
                    <h1 className="text-3xl font-bold">New Publication</h1>
                    <p className="text-muted-foreground">Share insights and updates with your community.</p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <PenTool className="w-5 h-5 text-primary" />
                            Post Details
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Draft your article and set its visibility.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-foreground">Post Title</Label>
                                <Input id="title" name="title" placeholder="The Future of Professional Mastery" className="bg-background border-border" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt" className="text-foreground">Short Excerpt (Intro)</Label>
                                <Textarea id="excerpt" name="excerpt" placeholder="A brief summary for the preview card..." className="bg-background border-border min-h-[80px]" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-foreground">Content (Supports HTML)</Label>
                                <Textarea id="content" name="content" placeholder="Write your full article here..." className="bg-background border-border min-h-[300px]" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="tags" className="text-foreground">Tags (comma separated)</Label>
                                    <Input id="tags" name="tags" placeholder="Tech, Mastery, Education" className="bg-background border-border" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="published" className="text-foreground">Status</Label>
                                    <Select name="published" defaultValue="false">
                                        <SelectTrigger className="bg-background border-border">
                                            <SelectValue placeholder="Visibility" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border text-foreground">
                                            <SelectItem value="false">Draft (Hidden)</SelectItem>
                                            <SelectItem value="true">Published (Live)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cover_image" className="text-foreground">Cover Image URL</Label>
                                <Input id="cover_image" name="cover_image" placeholder="https://images.unsplash.com/..." className="bg-background border-border" />
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
