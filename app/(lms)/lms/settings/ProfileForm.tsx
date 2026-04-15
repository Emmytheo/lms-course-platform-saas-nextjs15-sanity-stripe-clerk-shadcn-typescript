'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfileAction } from '@/actions/profile';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { UserProfile } from '@/lib/db/interface';

interface ProfileFormProps {
    initialProfile: any; // Using any to match adapter output for simpler integration
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPending(true);

        const formData = new FormData(event.currentTarget);

        try {
            const result = await updateProfileAction(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email (Read-only)</Label>
                <Input
                    disabled
                    defaultValue={initialProfile.email || 'Managed by Auth Provider'}
                    className="bg-black/50 border-zinc-800 text-gray-500"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={initialProfile.fullName || ''}
                    className="bg-black/50 border-zinc-800"
                    placeholder="John Doe"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatarUrl" className="text-white">Avatar URL</Label>
                <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    defaultValue={initialProfile.avatarUrl || ''}
                    className="bg-black/50 border-zinc-800"
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="role" className="text-white">Role</Label>
                <select
                    id="role"
                    name="role"
                    defaultValue={initialProfile.role || 'student'}
                    className="flex h-10 w-full rounded-md border border-zinc-800 bg-black/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500">
                    Select 'Admin' or 'Instructor' to access the dashboard.
                </p>
            </div>

            <div className="pt-4">
                <Button type="submit" disabled={isPending} className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
            </div>
        </form>
    );
}
