import React from 'react';
import { db } from '@/lib/db';
import { getAuth } from '@/lib/auth-wrapper';
import LearningPathBrowser from '@/components/lms/LearningPathBrowser';
import { LearningPath as UIPath } from '@/lib/lms/types';
import { LearningPath as DBPath } from '@/lib/db/interface';

export const dynamic = 'force-dynamic';

export default async function LearningPathsPage() {
    const { userId } = await getAuth();
    const dbPaths: DBPath[] = await db.getAllLearningPaths();

    const enrolledPathIds = userId
        ? (await db.getStudentLearningPathEnrollmentsWithDetails(userId)).map((e: any) => e.learning_path_id || e.learning_path?._id)
        : [];

    // Map DB paths to UI paths
    const paths: UIPath[] = dbPaths.map(p => ({
        id: p._id,
        title: p.title,
        description: p.description || "",
        thumbnail_url: p.image || "",
        courses: p.courses as any || [],
        duration_minutes: 0,
        level: (p.level as any) || 'Intermediate',
        created_at: new Date().toISOString(),
        slug: p.slug?.current || "",
        price: p.price || 0, // Paths might be free?
        isEnrolled: enrolledPathIds.includes(p._id)
    }));

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <LearningPathBrowser initialPaths={paths} />
            </div>
        </div>
    );
}
