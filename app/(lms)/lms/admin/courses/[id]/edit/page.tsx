'use client';

import React, { useEffect, useState, use } from 'react';
import { getCourse } from '@/actions/courses';
import { Course } from '@/lib/db/interface';
import { EditCourseForm } from '@/components/admin/EditCourseForm';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [course, setCourse] = useState<Course | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch course data on mount
        getCourse(id).then((c) => {
            setCourse(c || undefined);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading Editor...</div>;
    if (!course) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Course not found</div>;

    return <EditCourseForm course={course} />;
}
