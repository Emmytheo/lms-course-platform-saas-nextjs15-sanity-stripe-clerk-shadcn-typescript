import React from 'react';
import { db } from '@/lib/db';
import CourseBrowser from '@/components/lms/CourseBrowser';
import { Course as UICourse } from '@/lib/lms/types';
import { Course as DBCourse } from '@/lib/db/interface';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
    const dbCourses: DBCourse[] = await db.getAllCourses();

    // Transform DB courses to UI courses
    const courses: UICourse[] = dbCourses.map(c => ({
        id: c._id,
        title: c.title,
        description: c.description || "",
        thumbnail_url: c.image || "",
        instructor_id: "system",
        difficulty: c.level || "Intermediate", // Default for now
        duration_minutes: 0, // Default for now
        tags: c.tags || [],
        published: true,
        created_at: new Date().toISOString(),
        modules: [] // Modules structure differs slightly, passing empty or we can map deeply if needed.
        // For the Grid View, we just need module count, so [] is safe if we strictly typed it, 
        // but the UI checks (course.modules || []).length.
        // Ideally we should pass c.modules if available, casting it carefully.
        // But c.modules in DB is Module[], in UI is Module[].
    }));

    // Better mapping for modules count
    const coursesWithModules = courses.map((uiC, idx) => ({
        ...uiC,
        modules: dbCourses[idx].modules as any || []
    }));

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <CourseBrowser initialCourses={coursesWithModules} />
            </div>
        </div>
    );
}
