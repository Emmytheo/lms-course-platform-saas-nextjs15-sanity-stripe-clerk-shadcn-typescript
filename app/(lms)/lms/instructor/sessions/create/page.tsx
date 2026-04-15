'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { createLiveSessionAction } from '@/actions/live-sessions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Calendar } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold"
        >
            {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
            {pending ? 'Scheduling...' : 'Schedule Session'}
        </Button>
    )
}

export default function ScheduleSessionPage() {
    return (
        <div className="p-6 md:p-12 bg-black min-h-screen text-white flex justify-center items-start">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Schedule Live Session</CardTitle>
                    <CardDescription className="text-gray-500">
                        Create a new AI-powered live session for your students.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createLiveSessionAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-white">Session Title</Label>
                            <Input id="title" name="title" placeholder="e.g. Master Class: Flying Kick" className="bg-black/50 border-zinc-800" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scheduledAt" className="text-white">Date & Time</Label>
                            <Input
                                id="scheduledAt"
                                name="scheduledAt"
                                type="datetime-local"
                                className="bg-black/50 border-zinc-800"
                                required
                            />
                        </div>

                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
