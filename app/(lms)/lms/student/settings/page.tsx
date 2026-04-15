import React from 'react';
import { getAuth } from '@/lib/auth-wrapper';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { User, ArrowLeft } from 'lucide-react';
import ProfileForm from './ProfileForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SettingsPage() {
    const { userId } = await getAuth();
    if (!userId) redirect('/auth/login');

    const profile = await db.getProfile(userId);

    const defaultProfile = {
        fullName: '',
        avatarUrl: '',
        role: 'student'
    };

    const currentProfile = profile || defaultProfile;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Link href="/lms/admin" className="inline-flex">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Account Settings</h1>
                            <p className="text-muted-foreground">Manage your profile and access level.</p>
                        </div>
                    </div>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Profile Details</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Update your personal information.
                            <span className="block mt-2 text-yellow-500 font-medium">
                                ⚠️ RLS Bypass: You can change your role here to fix access issues.
                            </span>
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
