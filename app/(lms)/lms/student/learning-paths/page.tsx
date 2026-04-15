import React from 'react';
import { db } from '@/lib/db';
import LearningPathBrowser from '@/components/lms/LearningPathBrowser';
import { LearningPath as UIPath } from '@/lib/lms/types';
import { LearningPath as DBPath } from '@/lib/db/interface';

export const dynamic = 'force-dynamic';

export default async function LearningPathsPage() {
    const dbPaths: DBPath[] = await db.getAllLearningPaths();

    // Map DB paths to UI paths
    const paths: UIPath[] = dbPaths.map(p => ({
        id: p._id,
        title: p.title,
        description: p.description || "",
        thumbnail_url: p.image || "",
        courses: p.courses as any || [], // Casting for now, structure is roughly compatible for list view
        duration_minutes: 0, // Not stored in DB yet
        level: 'Intermediate', // Not stored in DB yet
        created_at: new Date().toISOString()
    }));

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <LearningPathBrowser initialPaths={paths} />
            </div>
        </div>
    );
}
