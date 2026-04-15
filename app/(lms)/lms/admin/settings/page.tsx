import React from 'react';
import { getAuth } from '@/lib/auth-wrapper';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { User } from 'lucide-react';
// Import ProfileForm from the student/settings directory
import ProfileForm from '../../student/settings/ProfileForm';

export default async function AdminSettingsPage() {
    const { userId } = await getAuth();
    if (!userId) redirect('/auth/login');

    const profile = await db.getProfile(userId);

    const defaultProfile = {
        fullName: '',
        avatarUrl: '',
        role: 'admin' // defaulting to admin if they are here
    };

    const currentProfile = profile || defaultProfile;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Admin Settings</h1>
                        <p className="text-muted-foreground">Manage your admin profile.</p>
                    </div>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Profile Details</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Update your personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm initialProfile={currentProfile} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
